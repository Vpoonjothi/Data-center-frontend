import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ENTERPRISE_PRICING } from '../../constants/pricingData';
import { getOffers, submitEnquiry } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { ContentContext } from '../../context/ContentContext';
import SubscriptionPlanSelector from '../../components/calculator/SubscriptionPlanSelector';
import { calculateSubscriptionPricing } from '../../utils/pricingCalculator';

const EnterpriseServerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { getContent } = useContext(ContentContext);

  // Configuration State
  const [offers, setOffers] = useState([]);
  
  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await getOffers();
        if (Array.isArray(data)) {
          const filteredOffers = data.filter(o => o.product_category === 'Enterprise Servers');
          setOffers(filteredOffers.sort((a, b) => b.discount - a.discount));
        } else {
          console.error('Expected array for offers, got:', data);
          setOffers([]);
        }
      } catch (err) {
        console.error('Failed to load offers:', err);
      }
    };
    loadOffers();
  }, []);

  const [vCPU, setVCPU] = useState(ENTERPRISE_PRICING.vCPU.min);
  const [ram, setRam] = useState(ENTERPRISE_PRICING.RAM.min);
  const [ssd, setSsd] = useState(ENTERPRISE_PRICING.SSD.min);
  const [bandwidth, setBandwidth] = useState(ENTERPRISE_PRICING.Bandwidth.min);
  const [os, setOs] = useState(ENTERPRISE_PRICING.OS[0]);
  const [backup, setBackup] = useState(false);
  const [isOsDropdownOpen, setIsOsDropdownOpen] = useState(false);
  const [windowsLicense, setWindowsLicense] = useState('licensed');

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.os-dropdown-container')) {
        setIsOsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Billing Duration State
  const [billingDuration, setBillingDuration] = useState({
    duration_type: 'Monthly',
    duration_value: 1,
    duration_unit: 'Months',
    durationMultiplier: 1
  });

  // Calculate Base Components (Derived State)
  const baseVcpuPrice = Number(getContent('Enterprise Base CPU Price', ENTERPRISE_PRICING.vCPU.price));
  const baseRamPrice = Number(getContent('Enterprise Base RAM Price', ENTERPRISE_PRICING.RAM.price));
  const baseSsdPrice = Number(getContent('Enterprise Base SSD Price', ENTERPRISE_PRICING.SSD.price));

  const vCPUPrice = vCPU * baseVcpuPrice;
  const ramPrice = ram * baseRamPrice;
  const ssdPrice = (ssd / ENTERPRISE_PRICING.SSD.baseIncrement) * baseSsdPrice;
  const bandwidthPrice = bandwidth > 10 ? 6000 : bandwidth * ENTERPRISE_PRICING.Bandwidth.price;
  const isWindows = os.label.includes('Windows');
  const osPrice = isWindows && windowsLicense === 'unlicensed' ? 0 : os.price;
  const backupPrice = backup ? ENTERPRISE_PRICING.Backup.price : 0;

  const subtotal = vCPUPrice + ramPrice + ssdPrice + bandwidthPrice + osPrice + backupPrice;

  // Determine Applicable Offer
  let appliedOffer = null;
  // Since offers are sorted by discount descending, the first one that matches the criteria is the best one
  for (const offer of offers) {
    if (vCPU >= offer.min_vcpu && ram >= offer.min_ram) {
      appliedOffer = offer;
      break;
    }
  }

  // Determine Next Offer for Upsell
  // Determine Next Offer for Upsell (the next offer with a higher discount than the currently applied one, or just the lowest requirement offer if none applied)
  let nextOffer = null;
  if (!appliedOffer) {
    // If no offer applied, the next offer is the one with the lowest requirements
    // Assuming the last element in the sorted array has the lowest requirements (lowest discount)
    if (offers.length > 0) {
      nextOffer = [...offers].reverse().find(o => vCPU < o.min_vcpu || ram < o.min_ram);
    }
  } else {
    // Find the offer with the smallest discount that is still larger than the current discount
    const betterOffers = offers.filter(o => o.discount > appliedOffer.discount && (vCPU < o.min_vcpu || ram < o.min_ram));
    if (betterOffers.length > 0) {
      nextOffer = betterOffers[betterOffers.length - 1]; // Because it's sorted descending, the last one is the smallest better offer
    }
  }

  const getMissingText = (offer) => {
    if (!offer) return '';
    const missingCpu = Math.max(0, offer.min_vcpu - vCPU);
    const missingRam = Math.max(0, offer.min_ram - ram);
    if (missingCpu > 0 && missingRam > 0) return `Increase RAM by ${missingRam} GB and CPU by ${missingCpu} vCPU`;
    if (missingCpu > 0) return `Increase CPU by ${missingCpu} vCPU`;
    if (missingRam > 0) return `Increase RAM by ${missingRam} GB`;
    return '';
  };

  // Calculate Discounts
  const discount = appliedOffer ? subtotal * (appliedOffer.discount / 100) : 0;
  const monthlyPrice = subtotal - discount;

  // Duration Calculations
  const { contractValue: durationSubtotal, gstAmount, totalPayable: grandTotal } = calculateSubscriptionPricing(
    monthlyPrice,
    billingDuration.duration_value,
    billingDuration.duration_unit
  );

  const handleSubmit = async (requestAction) => {
    if (!user) {
      navigate('/signup', { state: { from: location.pathname } });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const configJson = {
        vcpu: vCPU,
        ram: ram,
        storage: ssd,
        os: isWindows ? `${os.label} (${windowsLicense === 'licensed' ? 'With License' : 'Without License'})` : os.label,
        bandwidth: bandwidth > 10 ? 'Unlimited' : `${bandwidth} TB`,
        backup: backup,
        quantity: quantity,
        discount: appliedOffer ? appliedOffer.name : 'None',
        duration_type: billingDuration.duration_type,
        duration_value: billingDuration.duration_value,
        duration_unit: billingDuration.duration_unit,
        monthly_price: `₹${monthlyPrice.toLocaleString()}`,
        subtotal_price: `₹${durationSubtotal.toLocaleString()}`,
        gst_amount: `₹${gstAmount.toLocaleString()}`,
        grand_total: `₹${grandTotal.toLocaleString()}`
      };

      const enquiryData = {
        name: user.name,
        email: user.email,
        company: user?.company || '',
        phone: user?.phone || '',
        type: 'enterprise_server',
        message: message,
        request_action: requestAction,
        configuration_json: configJson
      };

      await submitEnquiry(enquiryData);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
        setQuantity(1);
      }, 5000);
    } catch (err) {
      console.error('Failed to submit order:', err);
      setIsSubmitting(false);
      alert('Failed to submit your request. Please try again later.');
    }
  };

  // Stepper Handlers
  const handleStepper = (type, action) => {
    const rules = ENTERPRISE_PRICING[type];
    if (type === 'vCPU') {
      const newValue = action === 'add' ? vCPU + rules.step : vCPU - rules.step;
      if (newValue >= rules.min && newValue <= rules.max) setVCPU(newValue);
    } else if (type === 'RAM') {
      const newValue = action === 'add' ? ram + rules.step : ram - rules.step;
      if (newValue >= rules.min && newValue <= rules.max) setRam(newValue);
    } else if (type === 'SSD') {
      const newValue = action === 'add' ? ssd + rules.step : ssd - rules.step;
      if (newValue >= rules.min && newValue <= rules.max) setSsd(newValue);
    } else if (type === 'Bandwidth') {
      const newValue = action === 'add' ? bandwidth + rules.step : bandwidth - rules.step;
      if (newValue >= rules.min && rules.max >= newValue) setBandwidth(newValue);
    }
  };

  const renderControlGroup = ({ label, value, unit, type, isBandwidth = false }) => {
    const rules = ENTERPRISE_PRICING[type];
    const displayValue = isBandwidth && value > 10 ? 'Unlimited' : value;
    const displayUnit = isBandwidth && value > 10 ? '' : unit;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium text-lg">{label}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleStepper(type, 'sub')}
              disabled={value <= rules.min}
              className="w-8 h-8 rounded-full bg-[#1e293b] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <div className="w-24 text-center font-bold text-xl text-secondary flex flex-col items-center justify-center leading-tight">
              <span className={displayValue === 'Unlimited' ? 'text-base tracking-tight' : ''}>{displayValue}</span>
              {displayUnit && <span className="text-sm font-normal text-gray-500">{displayUnit}</span>}
            </div>
            <button
              onClick={() => handleStepper(type, 'add')}
              disabled={value >= rules.max}
              className="w-8 h-8 rounded-full bg-[#1e293b] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Slider */}
        <div className="relative w-full h-2 bg-gray-800 rounded-full">
          <div
            className="absolute h-full bg-secondary rounded-full pointer-events-none"
            style={{ width: `${((value - rules.min) / (rules.max - rules.min)) * 100}%` }}
          ></div>
          <input
            type="range"
            min={rules.min}
            max={rules.max}
            step={rules.step}
            value={value}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (type === 'vCPU') setVCPU(val);
              if (type === 'RAM') setRam(val);
              if (type === 'SSD') setSsd(val);
              if (type === 'Bandwidth') setBandwidth(val);
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{rules.min} {unit}</span>
          <span>{isBandwidth ? 'Unlimited' : `${rules.max} ${unit}`}</span>
        </div>
      </div>
    );
  };

  const currentConfig = {
    isAI: false,
    vCPU,
    ram,
    ssd,
    bandwidth: bandwidth > 10 ? 'Unlimited' : `${bandwidth} TB`,
    os: os.label,
    backup,
    discountName: appliedOffer ? `${appliedOffer.name} (-${appliedOffer.discount}%)` : null,
    monthlyPrice,
    durationSubtotal,
    gstAmount,
    grandTotal,
    ...billingDuration
  };

  return (
    <div className="min-h-screen bg-[#020817]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-emerald-900/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Enterprise Dedicated <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary">Servers</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Build your own enterprise infrastructure with configurable CPU, RAM, Storage, and bandwidth to perfectly match your workload.
          </motion.p>
        </div>
      </section>

      {/* Main Configurator Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration Controls */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">Hardware Configuration</h2>
              {renderControlGroup({ label: "Processor (vCPU)", value: vCPU, unit: "vCPU", type: "vCPU" })}
              {renderControlGroup({ label: "Memory (RAM)", value: ram, unit: "GB", type: "RAM" })}
              {renderControlGroup({ label: "Storage (SSD)", value: ssd, unit: "GB", type: "SSD" })}
            </div>

            <div className="bg-[#0a1128] border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-20">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Software & Network</h2>
              
              <div className="space-y-6">
                
                {/* OS Selection */}
                <div className="relative z-[60] os-dropdown-container">
                  <label className="block text-gray-400 font-medium text-sm mb-2">Operating System</label>
                  
                  {/* Custom Dropdown Trigger */}
                  <div 
                    className="w-full bg-[#1e293b] border border-gray-700 hover:border-secondary text-white rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center transition-colors text-sm"
                    onClick={() => setIsOsDropdownOpen(!isOsDropdownOpen)}
                  >
                    <span className="font-medium flex-1 truncate pr-2">
                      {os.label}
                      {isWindows && windowsLicense === 'unlicensed' && ' (Without License)'}
                      {isWindows && windowsLicense === 'licensed' && ' (With License)'}
                      <span className={osPrice === 0 ? 'text-emerald-400 ml-1' : 'text-blue-400 ml-1'}>
                        {osPrice > 0 ? `(+₹${osPrice}/mo)` : '(Free)'}
                      </span>
                    </span>
                    <svg className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOsDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Custom Dropdown Menu */}
                  <AnimatePresence>
                    {isOsDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-gray-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto overflow-x-hidden custom-scrollbar"
                      >
                        {/* Linux Group */}
                        <div className="px-2 pt-3 pb-2">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 22s5-2 5-6c0-3-1-4-3-4-2 0-3 1-3 1s-1-1-3-1c-2 0-3 1-3 4 0 4 5 6 5 6zm-1.5-12c.5 0 1 .5 1 1 0-.5.5-1 1-1 .5 0 1 .5 1 1.5 0 2-2 2-2 4 0-2-2-2-2-4 0-1 .5-1.5 1-1.5zm.5-4c-1.5 0-3 .5-3 2.5v1h1v-1c0-1.5 1-2 2-2h1c1 0 2 .5 2 2v1h1v-1c0-2-1.5-2.5-3-2.5h-1z"/>
                            </svg>
                            Linux (Free License)
                          </div>
                          {ENTERPRISE_PRICING.OS.filter(o => !o.value.includes('Windows')).map(opt => (
                            <div 
                              key={opt.label}
                              onClick={() => { setOs(opt); setIsOsDropdownOpen(false); }}
                              className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center transition-colors text-sm ${os.label === opt.label ? 'bg-secondary/20 text-secondary' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                            >
                              <span className="font-medium truncate mr-2">{opt.label}</span>
                              <span className="text-[10px] shrink-0 font-bold px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-400/10">FREE</span>
                            </div>
                          ))}
                        </div>

                        <div className="w-full h-px bg-gray-800"></div>

                        {/* Windows Group */}
                        <div className="px-2 pt-2 pb-3">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#00a4ef]" viewBox="0 0 88 88" fill="currentColor">
                              <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.027 34.453-35.67-4.904-.027-29.773zm4.326-39.08l47.968-6.851v41.341l-47.968.39zm47.968 41.527v41.405l-47.968-6.861-.016-34.82z"/>
                            </svg>
                            Windows Server
                          </div>
                          {ENTERPRISE_PRICING.OS.filter(o => o.value.includes('Windows')).map(opt => (
                            <div 
                              key={opt.label}
                              onClick={() => { setOs(opt); setIsOsDropdownOpen(false); }}
                              className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center transition-colors text-sm ${os.label === opt.label ? 'bg-secondary/20 text-secondary' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                            >
                              <span className="font-medium truncate mr-2">{opt.label}</span>
                              {opt.price > 0 ? (
                                <span className="text-xs shrink-0 text-blue-400 font-semibold">+₹{opt.price}/mo</span>
                              ) : (
                                <span className="text-[10px] shrink-0 font-bold px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-400/10">FREE</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Windows Specific Note & License Toggle */}
                  <AnimatePresence>
                    {isWindows && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 bg-[#0a1128]/50 border border-blue-900/30 rounded-xl">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Windows License Option</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setWindowsLicense('licensed')}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                windowsLicense === 'licensed' 
                                  ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                  : 'bg-[#020817] border-gray-800 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${windowsLicense === 'licensed' ? 'border-blue-400' : 'border-gray-600'}`}>
                                  {windowsLicense === 'licensed' && <div className="w-2 h-2 rounded-full bg-blue-400"></div>}
                                </div>
                                <span className={`font-bold text-sm ${windowsLicense === 'licensed' ? 'text-blue-400' : 'text-gray-300'}`}>With License</span>
                              </div>
                              <div className="text-xs text-gray-500 pl-6">+₹{os.price}/mo</div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setWindowsLicense('unlicensed')}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                windowsLicense === 'unlicensed' 
                                  ? 'bg-emerald-900/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                                  : 'bg-[#020817] border-gray-800 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${windowsLicense === 'unlicensed' ? 'border-emerald-400' : 'border-gray-600'}`}>
                                  {windowsLicense === 'unlicensed' && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                                </div>
                                <span className={`font-bold text-sm ${windowsLicense === 'unlicensed' ? 'text-emerald-400' : 'text-gray-300'}`}>Without License</span>
                              </div>
                              <div className="text-xs text-gray-500 pl-6">Bring your own (Free)</div>
                            </button>
                          </div>
                          
                          {windowsLicense === 'licensed' && (
                            <div className="mt-3 p-3 bg-blue-900/10 border border-blue-800/30 rounded-lg flex items-start gap-2.5">
                              <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-xs text-blue-200/80 leading-relaxed">
                                <strong className="text-blue-300 font-semibold">Note:</strong> <span className="text-white">Windows activation charges and installation fees are additional</span> and will be included in your final quotation.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bandwidth Selection */}
                <div className="pt-6 border-t border-gray-800">
                  {renderControlGroup({ label: "Bandwidth", value: bandwidth, unit: "TB", type: "Bandwidth", isBandwidth: true })}
                </div>

                {/* Backup Checkbox */}
                <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm">Daily Automated Backup</h3>
                    <p className="text-xs text-gray-500 mt-1">Secure your data with daily snapshot backups.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary font-medium text-sm">+₹{ENTERPRISE_PRICING.Backup.price}/mo</span>
                    <button
                      onClick={() => setBackup(!backup)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${backup ? 'bg-accent' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${backup ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Promotional Offers Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {offers.map(offer => {
                const isApplied = appliedOffer?.name === offer.name;
                const isMet = vCPU >= offer.min_vcpu && ram >= offer.min_ram;
                
                if (isApplied) {
                  return (
                    <div key={offer.name} className="p-5 rounded-2xl border bg-emerald-900/20 border-secondary shadow-[0_0_20px_rgba(16,185,129,0.2)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                        ACTIVE
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-secondary">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="text-xs font-bold uppercase tracking-wider">{offer.name}</span>
                      </div>
                      <div className="text-3xl font-bold text-white mb-4">{offer.discount}% OFF</div>
                      <div className="text-xs text-emerald-200/70 mb-4 border-b border-secondary/20 pb-3 space-y-1">
                        <div className="font-semibold text-secondary">Minimum Requirements:</div>
                        <div>{offer.min_vcpu} vCPU</div>
                        <div>{offer.min_ram} GB RAM</div>
                      </div>
                      <div className="text-sm font-bold text-secondary flex items-center gap-2">
                        ✓ CURRENTLY APPLIED
                      </div>
                      <div className="text-xs text-secondary mt-1">
                        You Save ₹{discount.toLocaleString()}
                      </div>
                    </div>
                  );
                } else if (!isMet) {
                  const missingCpu = Math.max(0, offer.min_vcpu - vCPU);
                  const missingRam = Math.max(0, offer.min_ram - ram);
                  return (
                    <div key={offer.name} className="p-5 rounded-2xl border bg-[#0a1128]/50 border-gray-800 opacity-70 grayscale">
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        {offer.name}
                      </div>
                      <div className="text-2xl font-bold text-gray-400 mb-4">{offer.discount}% OFF</div>
                      <div className="text-xs text-gray-500 space-y-1 mb-4 border-b border-gray-800 pb-3">
                        <div className="text-gray-400 font-semibold">Requirements:</div>
                        <div>{offer.min_vcpu} vCPU</div>
                        <div>{offer.min_ram} GB RAM</div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="text-gray-400 font-semibold">Current:</div>
                        <div>{vCPU} vCPU</div>
                        <div>{ram} GB RAM</div>
                      </div>
                      <div className="text-xs font-medium text-orange-400/80 mt-3 pt-3 border-t border-gray-800 space-y-1">
                        {missingCpu > 0 && <div>Need {missingCpu} More vCPU</div>}
                        {missingRam > 0 && <div>Need {missingRam} More GB RAM</div>}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={offer.name} className="p-5 rounded-2xl border bg-[#0a1128] border-gray-700 opacity-60">
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">
                        {offer.name}
                      </div>
                      <div className="text-2xl font-bold text-gray-400 mb-4">{offer.discount}% OFF</div>
                      <div className="text-xs text-gray-500">Requirements met, but a higher offer is applied.</div>
                    </div>
                  );
                }
              })}
            </div>

          </div>

          {/* Right Column: Live Price Calculator */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-b from-[#0a1128]/90 to-[#020817] backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl sticky top-28">
              
              {/* LIVE OFFER STATUS BAR */}
              <div className="mb-6">
                {appliedOffer ? (
                  <div className="bg-emerald-900/20 border border-secondary/50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-3xl">
                      {appliedOffer.name === 'Startup Offer' ? '🎉' : appliedOffer.name === 'Business Offer' ? '🚀' : '🏆'}
                    </span>
                    <div>
                      <div className="font-bold text-secondary">{appliedOffer.name} Applied</div>
                      <div className="text-sm text-emerald-200/70">You are saving {appliedOffer.discount}% on this configuration.</div>
                    </div>
                  </div>
                ) : nextOffer ? (
                  <div className="bg-emerald-900/20 border border-secondary/30 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    <div>
                      <div className="font-bold text-secondary">Unlock Discounts</div>
                      <div className="text-sm text-emerald-200/70">
                        {getMissingText(nextOffer)} to unlock {nextOffer.name} ({nextOffer.discount}% OFF)
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="bg-[#020817] rounded-xl p-6 border border-gray-800 mb-6 space-y-4">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Configuration Summary</h4>
                
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>CPU Cost:</span>
                  <span className="font-medium text-white">₹{vCPUPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>RAM Cost:</span>
                  <span className="font-medium text-white">₹{ramPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>Storage Cost:</span>
                  <span className="font-medium text-white">₹{ssdPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>Bandwidth Cost:</span>
                  <span className="font-medium text-white">₹{bandwidthPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>OS License Fee:</span>
                  <span className={`font-medium ${osPrice === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {osPrice === 0 ? 'FREE' : `₹${osPrice.toLocaleString()}/month`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>Backup Cost:</span>
                  <span className="font-medium text-white">₹{backupPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-white font-bold text-lg pt-4 border-t border-gray-800">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedOffer && (
                  <div className="bg-emerald-900/10 rounded-lg p-3 mt-4 border border-secondary/20 space-y-2">
                    <div className="flex justify-between items-center text-gray-300 text-sm">
                      <span>Offer Applied:</span>
                      <span className="text-secondary font-bold">{appliedOffer.name} ({appliedOffer.discount}%)</span>
                    </div>
                    <div className="flex justify-between items-center text-secondary text-sm font-medium">
                      <span>Discount:</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-secondary text-sm font-bold border-t border-secondary/20 pt-2 mt-2">
                      <span>You Save:</span>
                      <span>₹{discount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <SubscriptionPlanSelector onChange={setBillingDuration} />

              <div className="mb-6 p-6 bg-gradient-to-br from-emerald-900/20 to-[#020817] border border-secondary/30 rounded-2xl text-center shadow-lg">
                <span className="block text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">Monthly Subscription</span>
                <div className="text-5xl font-extrabold text-white flex justify-center items-baseline gap-1 mb-4">
                  <span className="text-3xl text-gray-500 font-medium">₹</span>
                  {monthlyPrice.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-400 border-t border-gray-800/80 pt-4 flex flex-col gap-2 text-left">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Contract Value ({billingDuration.durationMultiplier} Months):</span>
                    <span className="font-semibold text-white">₹{durationSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>GST (18%):</span>
                    <span className="font-semibold text-white">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-base border-t border-gray-800 pt-3 mt-1">
                    <span className="text-white">Total Payable:</span>
                    <span className="text-secondary text-lg">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8 bg-emerald-900/20 border border-emerald-900/50 rounded-xl mt-6">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Request Received</h3>
                  <p className="text-emerald-200/70 text-sm">Thank you! Our sales team will be in touch shortly.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {user ? (
                    <div className="bg-emerald-900/20 border border-emerald-900/50 p-4 rounded-xl text-emerald-100 flex flex-col gap-1">
                      <p className="text-sm">Requesting as: <strong className="text-white">{user.name}</strong> <span className="text-gray-400">({user.company || 'No Company'})</span></p>
                      <p className="text-xs text-gray-500 mt-1 italic">Your account information will be automatically used for this request.</p>
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 border border-gray-800 p-4 rounded-xl flex flex-col gap-1">
                      <p className="text-sm text-gray-300">You will be asked to <strong className="text-white">create an account</strong> or log in before completing this request.</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-[#020817] border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Additional Requirements / Notes</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#020817] border border-gray-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-secondary transition-colors h-24 resize-none"
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => handleSubmit('REQUEST_QUOTE')}
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold transition-colors shadow-lg shadow-secondary/25 disabled:opacity-50 text-sm"
                    >
                      {isSubmitting ? 'Processing...' : 'Request Quote'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EnterpriseServerPage;
