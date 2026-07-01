import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { submitEnquiry } from '../../services/api';
const SpecIcon = ({ icon }) => {
  switch (icon) {
    case 'cpu':
      return <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
    case 'ram':
      return <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
    case 'storage':
      return <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
    case 'gpu':
      return <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'network':
      return <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'support':
      return <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    default:
      return <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
  }
};

import SubscriptionPlanSelector from '../../components/calculator/SubscriptionPlanSelector';
import { calculateSubscriptionPricing } from '../../utils/pricingCalculator';
import InfrastructureSection from '../../components/shared/InfrastructureSection';

const AIServerPage = () => {
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  // Billing Duration State
  const [billingDuration, setBillingDuration] = useState({
    duration_type: 'Monthly',
    duration_value: 1,
    duration_unit: 'Months',
    durationMultiplier: 1
  });

  const monthlyPrice = 35000;
  const { contractValue: durationSubtotal, gstAmount, totalPayable: grandTotal } = calculateSubscriptionPricing(
    monthlyPrice,
    billingDuration.duration_value,
    billingDuration.duration_unit
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const configJson = {
        model: 'AI Compute Pro 5060 Ti',
        cpu: 'Intel Core Ultra i7',
        ram: '64GB DDR5',
        storage: '2 × 2TB NVMe SSD',
        gpu: 'RTX 5060 Ti 16GB',
        duration_type: billingDuration.duration_type,
        duration_value: billingDuration.duration_value,
        duration_unit: billingDuration.duration_unit,
        monthly_price: `₹${monthlyPrice.toLocaleString()}`,
        subtotal_price: `₹${durationSubtotal.toLocaleString()}`,
        gst_amount: `₹${gstAmount.toLocaleString()}`,
        grand_total: `₹${grandTotal.toLocaleString()}`
      };

      const enquiryData = {
        type: 'ai_server',
        ...formData,
        configuration_json: configJson
      };
      
      await submitEnquiry(enquiryData);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Failed to submit quote request:', error);
      setIsSubmitting(false);
      alert('Failed to submit your request. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] pt-20">
      
      {/* 1. Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-emerald-900/10 blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Dedicated AI Server
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            AI Compute Pro 5060 Ti
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-10"
          >
            High-performance AI server powered by Intel Core Ultra i7 and NVIDIA RTX 5060 Ti 16GB graphics.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button 
              onClick={scrollToForm}
              className="px-8 py-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/25 flex items-center justify-center gap-2"
            >
              Request Quote
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <Link 
              to="/contact"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-colors border border-slate-700 flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Server Specifications Section */}
      <section className="py-20 bg-[#0a1128] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Server Specifications</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">High-performance hardware configured for intensive workloads.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#020817] p-6 rounded-2xl border border-gray-800 hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><SpecIcon icon="cpu" /></div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Processor</div>
              <div className="text-lg font-bold text-white">Intel Core Ultra i7</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#020817] p-6 rounded-2xl border border-gray-800 hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><SpecIcon icon="ram" /></div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Memory</div>
              <div className="text-lg font-bold text-white">64GB DDR5</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#020817] p-6 rounded-2xl border border-gray-800 hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><SpecIcon icon="storage" /></div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Storage</div>
              <div className="text-lg font-bold text-white">2 × 2TB M.2 NVMe SSD</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-[#020817] p-6 rounded-2xl border border-gray-800 hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><SpecIcon icon="gpu" /></div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Graphics</div>
              <div className="text-lg font-bold text-white">NVIDIA RTX 5060 Ti 16GB</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-[#020817] p-6 rounded-2xl border border-gray-800 hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><SpecIcon icon="network" /></div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Network</div>
              <div className="text-lg font-bold text-white">10 Gbps Port</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="bg-[#020817] p-6 rounded-2xl border border-gray-800 hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><SpecIcon icon="support" /></div>
              <div className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Support</div>
              <div className="text-lg font-bold text-white">24/7 Technical Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Key Benefits Section */}
      <section className="py-20 bg-[#020817] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Dedicated RTX 5060 Ti GPU', '64GB DDR5 Memory', '4TB NVMe SSD Storage', '10Gbps High-Speed Network'].map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3"
              >
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white">{benefit}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pricing Card Section */}
      <section className="py-20 bg-[#0a1128] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-900/40 to-[#020817] rounded-3xl p-1 border border-secondary/20 shadow-2xl shadow-emerald-900/20">
            <div className="bg-[#020817] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-2">AI Compute Pro 5060 Ti</h3>
                <p className="text-secondary font-semibold mb-6">High-Performance Dedicated Server</p>
                <ul className="space-y-3 mb-8">
                  {['Intel Core Ultra i7', '64GB DDR5 RAM', '2 × 2TB NVMe SSD', 'RTX 5060 Ti 16GB'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full md:border-l border-gray-800 md:pl-10 flex flex-col justify-center">
                <SubscriptionPlanSelector onChange={setBillingDuration} />
                <div className="bg-[#020817] p-5 rounded-xl border border-gray-800 text-left mb-6 space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>Monthly Subscription:</span>
                    <span className="font-semibold text-white">₹{monthlyPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Contract Value ({billingDuration.durationMultiplier} Months):</span>
                    <span className="font-semibold text-white">₹{durationSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GST (18%):</span>
                    <span className="font-semibold text-white">₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-base border-t border-gray-800 pt-2 mt-2">
                    <span className="text-secondary">Total Payable:</span>
                    <span className="text-xl text-white">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={scrollToForm}
                    className="flex-1 py-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/25"
                  >
                    Request Quote
                  </button>
                  <Link 
                    to="/contact"
                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-colors border border-slate-700 flex items-center justify-center"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Lead Form */}
      <section ref={formRef} className="py-24 relative overflow-hidden bg-[#020817]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-emerald-900/10 blur-[150px] pointer-events-none rounded-full"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Request a Quote</h2>
              <p className="text-gray-400">Fill out the form below and our sales team will contact you shortly.</p>
            </div>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                <p className="text-gray-400">Thank you for your interest. Our sales team will be in touch soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors h-32 resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/25 flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Request...
                    </span>
                  ) : 'Submit Request'}
                </button>
              </form>
            )}
            
          </div>
        </div>
      </section>

      {/* Enterprise Infrastructure Section */}
      <InfrastructureSection />

      {/* 6. Contact CTA */}
      <section className="py-20 bg-emerald-900 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Need More Information?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">Contact our sales team for pricing, availability, and deployment assistance.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="px-8 py-3 bg-white text-emerald-900 hover:bg-gray-100 rounded-lg font-bold transition-colors">
              Contact Sales
            </Link>
            <button 
              onClick={scrollToForm} 
              className="px-8 py-3 bg-emerald-800 text-white border border-emerald-700 hover:bg-emerald-700 rounded-lg font-bold transition-colors"
            >
              Get Quote
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AIServerPage;
