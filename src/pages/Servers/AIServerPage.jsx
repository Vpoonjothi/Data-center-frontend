// Force Vite HMR reload
import React, { useRef, useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ContentContext } from '../../context/ContentContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { submitEnquiry, getAiServers, getOffers } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import SubscriptionPlanSelector from '../../components/calculator/SubscriptionPlanSelector';
import { calculateSubscriptionPricing } from '../../utils/pricingCalculator';

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

const AIServerPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);
  
  const [servers, setServers] = useState([]);
  const [activeServer, setActiveServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const data = await getAiServers();
        if (Array.isArray(data)) {
          setServers(data);
        } else {
          console.error('Expected array for servers, got:', data);
          setServers([]);
        }
        if (data.length > 0) {
          setActiveServer(data[0]);
        }
        
        const offersData = await getOffers();
        if (Array.isArray(offersData)) {
          const aiOffers = offersData.filter(o => o.product_category === 'AI Servers' && o.status === 'Active');
          setOffers(aiOffers.sort((a, b) => b.discount - a.discount));
        }
      } catch (err) {
        console.error('Failed to fetch AI servers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServers();
  }, []);

  const [formData, setFormData] = useState({
    message: '',
    quantity: 1
  });

  // Billing Duration State
  const [billingDuration, setBillingDuration] = useState({
    duration_type: 'Monthly',
    duration_value: 1,
    duration_unit: 'Months',
    durationMultiplier: 1
  });

  const activeOffer = offers.length > 0 ? offers[0] : null;
  const discountPercent = activeOffer ? activeOffer.discount : 0;
  
  const baseMonthlyPrice = activeServer?.monthly_price || 0;
  const discountedMonthlyPrice = baseMonthlyPrice - (baseMonthlyPrice * (discountPercent / 100));

  const { contractValue: durationSubtotal, gstAmount, totalPayable: grandTotal } = calculateSubscriptionPricing(
    discountedMonthlyPrice,
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

  const handleSubmit = async (e, requestAction) => {
    e.preventDefault();
    if (!user) {
      navigate('/signup', { state: { from: location.pathname } });
      return;
    }
    setIsSubmitting(true);
    
    try {
      const configJson = {
        model: activeServer.name,
        cpu: activeServer.cpu,
        ram: activeServer.ram,
        storage: activeServer.storage,
        gpu: activeServer.gpu,
        quantity: formData.quantity,
        discount: activeOffer ? activeOffer.name : 'None',
        duration_type: billingDuration.duration_type,
        duration_value: billingDuration.duration_value,
        duration_unit: billingDuration.duration_unit,
        monthly_price: `₹${activeServer.monthly_price.toLocaleString()}`,
        subtotal_price: `₹${durationSubtotal.toLocaleString()}`,
        gst_amount: `₹${gstAmount.toLocaleString()}`,
        grand_total: `₹${grandTotal.toLocaleString()}`
      };

      const enquiryData = {
        name: user.name,
        email: user.email,
        company: user?.company || '',
        phone: user?.phone || '',
        type: 'ai_server',
        message: formData.message,
        request_action: requestAction,
        configuration_json: configJson
      };
      
      await submitEnquiry(enquiryData);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ message: '', quantity: 1 });
      }, 5000);
    } catch (error) {
      console.error('Failed to submit quote request:', error);
      setIsSubmitting(false);
      alert('Failed to submit your request. Please try again later.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#020817] pt-20 flex items-center justify-center text-white">Loading AI Servers...</div>;
  }

  if (servers.length === 0) {
    return <div className="min-h-screen bg-[#020817] pt-20 flex items-center justify-center text-white">No AI Servers currently available.</div>;
  }

  return (
    <div className="min-h-screen bg-[#020817]">
      
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
            Dedicated AI Server Models
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Power Your Next Breakthrough
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-10"
          >
            High-performance AI servers built for intensive compute workloads, machine learning, and data analytics.
          </motion.p>
          


          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            
          </motion.div>
        </div>
      </section>

      {/* 2. AI Servers Pricing Grid */}
      <section className="py-24 bg-[#0a1128] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your AI Powerhouse</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">Compare specifications and find the perfect dedicated server for your machine learning workloads.</p>
            {activeOffer && (
              <div className="max-w-2xl mx-auto bg-emerald-900/20 border border-secondary/50 rounded-xl p-4 flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl">🎉</span>
                <div className="text-left">
                  <div className="font-bold text-secondary">{activeOffer.name} Applied</div>
                  <div className="text-sm text-emerald-200/70">You are saving {activeOffer.discount}% on all AI Servers!</div>
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <SubscriptionPlanSelector onChange={setBillingDuration} className="mb-0" />
              </div>
            </div>
          </div>
          
          <div className={`grid gap-8 ${
            servers.length === 1 
              ? 'grid-cols-1 max-w-sm mx-auto' 
              : servers.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {servers.map((server, index) => {
              const discountedServerPrice = server.monthly_price - (server.monthly_price * (discountPercent / 100));
              const contractValue = discountedServerPrice * billingDuration.durationMultiplier;
              const gst = contractValue * 0.18;
              const total = contractValue + gst;
              
              return (
              <motion.div 
                key={server.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#020817] rounded-3xl border border-gray-800 hover:border-secondary/50 transition-all shadow-2xl hover:shadow-secondary/20 flex flex-col overflow-hidden"
              >
                <div className="p-6 border-b border-gray-800 bg-gradient-to-br from-emerald-900/20 to-transparent">
                  <h3 className="text-xl font-bold text-white mb-2">{server.name}</h3>
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-secondary">₹{total.toLocaleString()}</span>
                      <span className="text-gray-500 text-xs"> total</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      (₹{discountedServerPrice.toLocaleString()}/mo x {billingDuration.durationMultiplier} mo + 18% GST)
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col bg-[#020817]">
                  <ul className="space-y-3 mb-6 flex-1">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 text-secondary"><SpecIcon icon="gpu" /></div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold leading-none mb-1">GPU</div>
                        <div className="text-white font-medium text-sm leading-tight">{server.gpu}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 text-secondary"><SpecIcon icon="cpu" /></div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold leading-none mb-1">CPU</div>
                        <div className="text-gray-300 text-sm leading-tight">{server.cpu}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 text-secondary"><SpecIcon icon="ram" /></div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold leading-none mb-1">Memory</div>
                        <div className="text-gray-300 text-sm leading-tight">{server.ram}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 text-secondary"><SpecIcon icon="storage" /></div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold leading-none mb-1">Storage</div>
                        <div className="text-gray-300 text-sm leading-tight">{server.storage}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 text-secondary"><SpecIcon icon="network" /></div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-semibold leading-none mb-1">Network</div>
                        <div className="text-gray-300 text-sm leading-tight">{server.network}</div>
                      </div>
                    </li>
                  </ul>
                  
                  <button 
                    onClick={() => {
                      setActiveServer(server);
                      scrollToForm();
                    }}
                    className="w-full py-3 bg-[#0a1128] hover:bg-secondary text-white rounded-xl font-bold text-sm transition-colors border border-gray-700 hover:border-transparent flex items-center justify-center gap-2 mt-auto"
                  >
                    Request Quote
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* 3. Key Benefits Section */}
      <section className="py-20 bg-[#020817] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Dedicated GPU Resources', 'High-Speed DDR5 Memory', 'Ultra-Fast NVMe SSD Storage', '10Gbps High-Speed Network'].map((benefit, idx) => (
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

      {/* 5. Lead Form */}
      <section ref={formRef} className="py-24 relative overflow-hidden bg-[#020817]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-emerald-900/10 blur-[150px] pointer-events-none rounded-full"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Request a Quote for {activeServer.name}</h2>
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
              <form className="space-y-6">
                
                {user ? (
                  <div className="bg-emerald-900/20 border border-emerald-900/50 p-6 rounded-xl text-emerald-100 flex flex-col gap-2">
                    <p className="text-sm">Requesting as: <strong className="text-white text-base">{user.name}</strong> <span className="text-gray-400">({user.company || 'No Company'})</span></p>
                    <p className="text-sm text-emerald-300/70">{user.email} | {user.phone_number}</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Your account information will be automatically used for this request.</p>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-gray-800 p-4 rounded-xl flex flex-col gap-1 mb-4">
                    <p className="text-sm text-gray-300">You will be asked to <strong className="text-white">create an account</strong> or log in before completing this request.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
                    <input 
                      type="number" 
                      name="quantity"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                      placeholder="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Additional Requirements / Notes</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors h-32 resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="button" 
                    onClick={(e) => handleSubmit(e, 'REQUEST_QUOTE')}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/25 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Request Quote'}
                  </button>
                </div>
              </form>
            )}
            
          </div>
        </div>
      </section>


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
              onClick={() => {
                scrollToForm();
              }} 
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
