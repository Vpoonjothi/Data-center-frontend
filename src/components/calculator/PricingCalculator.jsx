import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PRICING_RULES } from '../../config/pricingConfig';
import { AuthContext } from '../../context/AuthContext';
import { LoginRequiredModal, OrderSummaryModal, SuccessModal } from './OrderModals';

const PricingCalculator = () => {
  const navigate = useNavigate();
  const [vCPU, setVCPU] = useState(PRICING_RULES.vCPU.min);
  const [ram, setRam] = useState(4); // Default to 4GB
  const [ssd, setSsd] = useState(PRICING_RULES.SSD.min);
  const [costs, setCosts] = useState({ vCPU: 0, ram: 0, ssd: 0 });
  const [totalPrice, setTotalPrice] = useState(0);

  const { user } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdQuote, setCreatedQuote] = useState(null);

  // Calculate Price
  useEffect(() => {
    const vCPUPrice = vCPU * PRICING_RULES.vCPU.price;
    const ramPrice = ram * PRICING_RULES.RAM.price;
    const ssdPrice = (ssd / PRICING_RULES.SSD.baseIncrement) * PRICING_RULES.SSD.price;
    
    setCosts({ vCPU: vCPUPrice, ram: ramPrice, ssd: ssdPrice });
    setTotalPrice(vCPUPrice + ramPrice + ssdPrice);
  }, [vCPU, ram, ssd]);

  const handleAction = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowSummaryModal(true);
    }
  };

  const handleOrderNow = () => {
    handleAction();
  };

  const handleGetQuote = () => {
    handleAction();
  };

  const handleSuccess = (quoteData) => {
    setShowSummaryModal(false);
    setCreatedQuote(quoteData);
    setShowSuccessModal(true);
  };

  const handleContactSales = () => {
    navigate('/contact');
  };

  // Stepper Handlers
  const handleStepper = (type, action) => {
    if (type === 'vCPU') {
      const step = PRICING_RULES.vCPU.step;
      const newValue = action === 'add' ? vCPU + step : vCPU - step;
      if (newValue >= PRICING_RULES.vCPU.min && newValue <= PRICING_RULES.vCPU.max) {
        setVCPU(newValue);
      }
    } else if (type === 'RAM') {
      const step = PRICING_RULES.RAM.step;
      const newValue = action === 'add' ? ram + step : ram - step;
      if (newValue >= PRICING_RULES.RAM.min && newValue <= PRICING_RULES.RAM.max) {
        setRam(newValue);
      }
    } else if (type === 'SSD') {
      const step = PRICING_RULES.SSD.step;
      const newValue = action === 'add' ? ssd + step : ssd - step;
      if (newValue >= PRICING_RULES.SSD.min && newValue <= PRICING_RULES.SSD.max) {
        setSsd(newValue);
      }
    }
  };

  const ControlGroup = ({ label, value, unit, type, min, max, step, onChange }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium text-lg">{label}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStepper(type, 'sub')}
            disabled={value <= min}
            className="w-8 h-8 rounded-full bg-[#1e293b] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <div className="w-20 text-center font-bold text-xl text-secondary">
            {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
          </div>
          <button
            onClick={() => handleStepper(type, 'add')}
            disabled={value >= max}
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
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-[#020817] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-900/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary">Perfect Server</span>
          </h2>
          <p className="text-lg text-slate-400">
            Customize your infrastructure with our enterprise-grade dynamic calculator. Transparent pricing, powerful performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl"
          >
            <ControlGroup
              label="Processor (vCPU)"
              value={vCPU}
              unit="vCPU"
              type="vCPU"
              min={PRICING_RULES.vCPU.min}
              max={PRICING_RULES.vCPU.max}
              step={PRICING_RULES.vCPU.step}
              onChange={setVCPU}
            />
            
            <ControlGroup
              label="Memory (RAM)"
              value={ram}
              unit="GB"
              type="RAM"
              min={PRICING_RULES.RAM.min}
              max={PRICING_RULES.RAM.max}
              step={PRICING_RULES.RAM.step}
              onChange={setRam}
            />

            <ControlGroup
              label="Storage (SSD)"
              value={ssd}
              unit="GB"
              type="SSD"
              min={PRICING_RULES.SSD.min}
              max={PRICING_RULES.SSD.max}
              step={PRICING_RULES.SSD.step}
              onChange={setSsd}
            />
          </motion.div>

          {/* Right Side: Summary & Price */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="bg-gradient-to-b from-[#0a1128]/90 to-[#020817] backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl sticky top-32">
              <h3 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">Configuration Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-300">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                      {vCPU} vCPU
                    </span>
                  </div>
                  <span className="font-medium text-white">₹{costs.vCPU.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-gray-300">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      {ram} GB RAM
                    </span>
                  </div>
                  <span className="font-medium text-white">₹{costs.ram.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-gray-300">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      {ssd} GB SSD
                    </span>
                  </div>
                  <span className="font-medium text-white">₹{costs.ssd.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-8 p-6 bg-emerald-900/10 border border-secondary/20 rounded-2xl text-center">
                <span className="block text-sm text-secondary font-medium mb-1">Monthly Price</span>
                <div className="text-4xl font-bold text-white flex justify-center items-end gap-1">
                  <span className="text-2xl text-secondary">₹</span>
                  {totalPrice.toLocaleString()}
                  <span className="text-base text-gray-500 font-normal mb-1">/mo</span>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleOrderNow} className="w-full py-3.5 px-4 bg-accent hover:bg-secondary text-white rounded-xl font-medium transition-colors shadow-lg shadow-secondary/25 flex items-center justify-center gap-2">
                  Order Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleGetQuote} className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700">
                    Get Quote
                  </button>
                  <button onClick={handleContactSales} className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <OrderSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        config={{ vCPU, ram, ssd, totalPrice }}
        user={user}
        onSuccess={handleSuccess}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        quote={createdQuote}
      />
    </section>
  );
};

export default PricingCalculator;
