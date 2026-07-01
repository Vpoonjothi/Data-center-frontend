import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InfrastructureSection from '../../components/shared/InfrastructureSection';
import ContactCTASection from '../../components/sections/ContactCTASection';
import { submitEnquiry } from '../../services/api';
import SubscriptionPlanSelector from '../../components/calculator/SubscriptionPlanSelector';
import { calculateSubscriptionPricing } from '../../utils/pricingCalculator';

const RACK_SIZES = [
  { units: 2, label: '2U Rack Space' },
  { units: 4, label: '4U Rack Space' },
  { units: 10, label: '10U Quarter Rack' },
  { units: 20, label: '20U Half Rack' },
  { units: 42, label: '42U Full Rack' },
  { units: 'Custom', label: 'Custom Requirement' }
];

const BROADBAND_OPTIONS = [
  { speed: '50 Mbps', price: 1000 },
  { speed: '75 Mbps', price: 1500 },
  { speed: '100 Mbps', price: 2000 },
  { speed: '150 Mbps', price: 2500 },
  { speed: '200 Mbps', price: 3000 },
  { speed: '300 Mbps', price: 4000 }
];

const LEASED_LINE_OPTIONS = [
  { speed: '10 Mbps', price: 5000 },
  { speed: '30 Mbps', price: 12000 },
  { speed: '50 Mbps', price: 18000 },
  { speed: '100 Mbps', price: 30000 }
];

const STATIC_IP_PRICE = 1000;
const RACK_U_PRICE = 500;

const ColocationPage = () => {
  const [rackRequirement, setRackRequirement] = useState('GreenLeaf');
  const [selectedRack, setSelectedRack] = useState(RACK_SIZES[0]);
  const [internetType, setInternetType] = useState('Broadband');
  const [selectedInternet, setSelectedInternet] = useState(BROADBAND_OPTIONS[0]);
  const [requireStaticIP, setRequireStaticIP] = useState(false);
  const [estimatedTotal, setEstimatedTotal] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [billingDuration, setBillingDuration] = useState({
    duration_type: 'Monthly',
    duration_value: 1,
    duration_unit: 'Months',
    durationMultiplier: 1
  });

  const setupFee = 150;
  const { contractValue: durationSubtotal, gstAmount: baseGstAmount, totalPayable: baseGrandTotal } = calculateSubscriptionPricing(
    estimatedTotal,
    billingDuration.duration_value,
    billingDuration.duration_unit
  );

  const gstAmount = baseGstAmount + (setupFee * 0.18);
  const grandTotal = durationSubtotal + setupFee + gstAmount;

  useEffect(() => {
    // Recalculate options when type changes
    if (internetType === 'Broadband') {
      setSelectedInternet(BROADBAND_OPTIONS[0]);
    } else if (internetType === 'Leased Line') {
      setSelectedInternet(LEASED_LINE_OPTIONS[0]);
    } else {
      setSelectedInternet(null);
    }
  }, [internetType]);

  useEffect(() => {
    // Calculate Total
    let total = 0;
    
    if (rackRequirement === 'GreenLeaf' && selectedRack.units !== 'Custom') {
      total += selectedRack.units * RACK_U_PRICE;
    }
    
    if (selectedInternet) {
      total += selectedInternet.price;
    }
    
    if (requireStaticIP) {
      total += STATIC_IP_PRICE;
    }
    
    setEstimatedTotal(total);
  }, [rackRequirement, selectedRack, selectedInternet, requireStaticIP]);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const configJson = {
        rack_requirement: rackRequirement === 'GreenLeaf' ? 'GreenLeaf Rack Space' : 'Customer Existing Rack',
      };

      if (rackRequirement === 'GreenLeaf') {
        configJson.rack_size = selectedRack.units === 'Custom' ? 'Custom' : `${selectedRack.units}U`;
        configJson.rack_rental = selectedRack.units === 'Custom' ? 'Custom Pricing' : `₹${(selectedRack.units * RACK_U_PRICE).toLocaleString()}`;
      } else {
        configJson.existing_rack_allocation = 'Provided by Customer';
        configJson.rack_rental = 'Not Applicable';
      }

      configJson.internet_type = internetType;
      configJson.internet_speed = selectedInternet ? selectedInternet.speed : 'None';
      configJson.internet_cost = selectedInternet ? `₹${selectedInternet.price.toLocaleString()}` : '₹0';
      configJson.static_ip = requireStaticIP ? 'Yes' : 'No';
      configJson.static_ip_cost = requireStaticIP ? `₹${STATIC_IP_PRICE.toLocaleString()}` : '₹0';
      configJson.estimated_monthly_cost = `₹${estimatedTotal.toLocaleString()}`;
      configJson.duration_type = billingDuration.duration_type;
      configJson.duration_value = billingDuration.duration_value;
      configJson.duration_unit = billingDuration.duration_unit;
      configJson.monthly_price = `₹${estimatedTotal.toLocaleString()}`;
      configJson.subtotal_price = `₹${durationSubtotal.toLocaleString()}`;
      configJson.setup_fee = `₹${setupFee.toLocaleString()}`;
      configJson.gst_amount = `₹${gstAmount.toLocaleString()}`;
      configJson.grand_total = `₹${grandTotal.toLocaleString()}`;

      const payload = {
        type: 'colocation',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        configuration_json: configJson
      };

      await submitEnquiry(payload);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#020817] min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1128] to-[#020817] z-0"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1A801D]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-heading">
              Rack Space <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Colocation</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Secure, reliable, and highly connected colocation space for your critical IT infrastructure. Build your custom package below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calculator Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-[#0a1128] border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  1
                </span>
                Configure Your Space
              </h2>

              {/* Rack Requirement Option */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Rack Requirement</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setRackRequirement('GreenLeaf')}
                    className={`flex-1 p-4 rounded-xl border text-left transition-all ${
                      rackRequirement === 'GreenLeaf' ? 'bg-secondary/10 border-secondary shadow-[0_0_15px_rgba(26,128,29,0.2)]' : 'bg-[#020817] border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${rackRequirement === 'GreenLeaf' ? 'border-secondary' : 'border-gray-500'}`}>
                        {rackRequirement === 'GreenLeaf' && <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>}
                      </div>
                      <div className={`font-bold ${rackRequirement === 'GreenLeaf' ? 'text-secondary' : 'text-white'}`}>
                        I need GreenLeaf Rack Space
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setRackRequirement('Existing')}
                    className={`flex-1 p-4 rounded-xl border text-left transition-all ${
                      rackRequirement === 'Existing' ? 'bg-secondary/10 border-secondary shadow-[0_0_15px_rgba(26,128,29,0.2)]' : 'bg-[#020817] border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${rackRequirement === 'Existing' ? 'border-secondary' : 'border-gray-500'}`}>
                        {rackRequirement === 'Existing' && <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>}
                      </div>
                      <div className={`font-bold ${rackRequirement === 'Existing' ? 'text-secondary' : 'text-white'}`}>
                        I already have my own Rack
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Rack Size */}
              {rackRequirement === 'GreenLeaf' && (
                <div className="mb-10 animate-fadeIn">
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Select Rack Space</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {RACK_SIZES.map((rack) => (
                      <button
                        key={rack.units}
                        onClick={() => setSelectedRack(rack)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          selectedRack.units === rack.units
                            ? 'bg-secondary/10 border-secondary shadow-[0_0_15px_rgba(26,128,29,0.2)]'
                            : 'bg-[#020817] border-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xl font-bold mb-1 ${selectedRack.units === rack.units ? 'text-secondary' : 'text-white'}`}>
                          {rack.units === 'Custom' ? 'Custom' : `${rack.units}U`}
                        </div>
                        <div className="text-xs text-gray-500">{rack.label}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Base cost is ₹500 per U / month.
                  </p>
                </div>
              )}
              {/* Connectivity */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Connectivity Options</label>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={() => setInternetType('Broadband')}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                      internetType === 'Broadband' ? 'bg-secondary text-white border-secondary' : 'bg-[#020817] text-gray-400 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    Broadband
                  </button>
                  <button
                    onClick={() => setInternetType('Leased Line')}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                      internetType === 'Leased Line' ? 'bg-secondary text-white border-secondary' : 'bg-[#020817] text-gray-400 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    Leased Line
                  </button>
                  <button
                    onClick={() => setInternetType('None')}
                    className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                      internetType === 'None' ? 'bg-secondary text-white border-secondary' : 'bg-[#020817] text-gray-400 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    No Internet
                  </button>
                </div>

                {internetType !== 'None' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fadeIn">
                    {(internetType === 'Broadband' ? BROADBAND_OPTIONS : LEASED_LINE_OPTIONS).map((opt) => (
                      <button
                        key={opt.speed}
                        onClick={() => setSelectedInternet(opt)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          selectedInternet?.speed === opt.speed
                            ? 'bg-secondary/10 border-secondary text-secondary'
                            : 'bg-[#020817] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-lg mb-1">{opt.speed}</div>
                        <div className="text-xs">₹{opt.price.toLocaleString()}/mo</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Add-ons</label>
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  requireStaticIP ? 'bg-secondary/10 border-secondary' : 'bg-[#020817] border-gray-800 hover:border-gray-600'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${
                      requireStaticIP ? 'bg-secondary border-secondary text-white' : 'border-gray-600 bg-transparent'
                    }`}>
                      {requireStaticIP && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className={`font-bold ${requireStaticIP ? 'text-white' : 'text-gray-300'}`}>Static Public IP</div>
                      <div className="text-xs text-gray-500">Dedicated IP address for your servers</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-400">₹1,000/mo</div>
                  <input type="checkbox" className="hidden" checked={requireStaticIP} onChange={(e) => setRequireStaticIP(e.target.checked)} />
                </label>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#0a1128]/50 border border-gray-800 p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">99.99% Power Uptime</h3>
                <p className="text-sm text-gray-400">Dual active power feeds with UPS and Generator backup.</p>
              </div>
              <div className="bg-[#0a1128]/50 border border-gray-800 p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">Tier III Infrastructure</h3>
                <p className="text-sm text-gray-400">Enterprise-grade security, cooling, and fire suppression.</p>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="sticky top-24">
              <div className="bg-[#0a1128] border border-secondary/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(26,128,29,0.05)]">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    2
                  </span>
                  Quote Summary
                </h2>

                <div className="space-y-4 mb-8">
                  {rackRequirement === 'GreenLeaf' ? (
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
                      <span className="text-gray-400">Rack Space ({selectedRack.units === 'Custom' ? 'Custom' : `${selectedRack.units}U`})</span>
                      <span className="text-white font-medium">
                        {selectedRack.units === 'Custom' ? 'Custom Pricing' : `₹${(selectedRack.units * RACK_U_PRICE).toLocaleString()}`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
                      <span className="text-gray-400">Existing Rack Allocation</span>
                      <span className="text-white font-medium">Not Applicable</span>
                    </div>
                  )}
                  {internetType !== 'None' && selectedInternet && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
                      <span className="text-gray-400">Internet ({internetType} - {selectedInternet.speed})</span>
                      <span className="text-white font-medium">₹{selectedInternet.price.toLocaleString()}</span>
                    </div>
                  )}
                  {requireStaticIP && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
                      <span className="text-gray-400">Static Public IP</span>
                      <span className="text-white font-medium">₹{STATIC_IP_PRICE.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-gray-800">
                    <span className="text-gray-400">Monthly Subscription</span>
                    <span className="text-white font-medium">₹{estimatedTotal.toLocaleString()}</span>
                  </div>

                  <div className="pt-2">
                    <SubscriptionPlanSelector onChange={setBillingDuration} />
                  </div>

                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Contract Value ({billingDuration.durationMultiplier} Months)</span>
                      <span className="text-white font-semibold">₹{durationSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Setup Fee (One-time)</span>
                      <span className="text-white font-semibold">₹{setupFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">GST (18%)</span>
                      <span className="text-white font-semibold">₹{gstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-800">
                      <span className="text-white font-bold text-lg">Total Payable</span>
                      <span className="text-secondary font-bold text-xl">₹{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {success ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
                    <p className="text-sm text-gray-400">Our sales team will review your colocation requirements and contact you shortly.</p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="mt-6 text-secondary text-sm font-medium hover:text-white transition-colors"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors" />
                      <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors" />
                    </div>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors" />
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Company Name (Optional)" className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors" />
                    <textarea name="message" rows="3" value={formData.message} onChange={handleInputChange} placeholder="Additional Requirements or Questions..." className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors resize-y"></textarea>
                    
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-secondary hover:bg-accent text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                      {submitting ? 'Submitting...' : 'Request Official Quote'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Enterprise Infrastructure Section */}
      <InfrastructureSection />

      {/* Ready to Deploy CTA */}
      <ContactCTASection />
    </div>
  );
};

export default ColocationPage;
