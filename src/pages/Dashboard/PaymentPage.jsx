import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMode, setPaymentMode] = useState('online'); // 'online' or 'manual'
  
  // Payment Form State
  const [formData, setFormData] = useState({
    invoice_reference: '',
    payment_method: 'NEFT',
    transaction_reference: '',
    payment_date: new Date().toISOString().split('T')[0],
    bank_name: '',
    termsAccepted: false,
    msaAccepted: false,
    tncAccepted: false,
    aupAccepted: false,
    privacyAccepted: false
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/payments/${quoteId}/details`);
        setDetails(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payment details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [quoteId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentScreenshot(e.target.files[0]);
    }
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // 1. Create order on backend
      const orderRes = await api.post(`/payments/${quoteId}/razorpay/create-order`, {
        msaAccepted: formData.msaAccepted,
        tncAccepted: formData.tncAccepted,
        aupAccepted: formData.aupAccepted,
        privacyAccepted: formData.privacyAccepted
      });

      const orderData = orderRes.data.data;
      const isDummy = orderRes.data.isDummy;

      // 2. If it's the dummy flow (test mode before receiving real keys)
      if (isDummy) {
        const verifyRes = await api.post(`/payments/${quoteId}/razorpay/verify`, {
          razorpay_order_id: orderData.id,
          razorpay_payment_id: `pay_dummy_${Math.random().toString(36).substring(7)}`,
          razorpay_signature: 'dummy_sig',
          isDummy: true
        });

        if (verifyRes.data.success) {
          navigate('/dashboard/services'); // Redirect directly to services as it's provisioned instantly!
          return;
        }
      }

      // 3. Normal Razorpay Flow (Once real keys are set)
      const res = await loadRazorpayScript();
      if (!res) {
        setError('Razorpay SDK failed to load. Are you online?');
        setProcessing(false);
        return;
      }

      const options = {
        key: orderRes.data.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Greenleaf Data Center',
        description: `Payment for Quote ${details.quote_number}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setProcessing(true);
            const verifyRes = await api.post(`/payments/${quoteId}/razorpay/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isDummy: false
            });
            if (verifyRes.data.success) {
              navigate('/dashboard/services');
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed on server');
            setProcessing(false);
          }
        },
        prefill: {
          name: details.billing_identity?.name || '',
          email: '', // Get from auth context ideally
        },
        theme: {
          color: '#10b981'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment Failed');
        setProcessing(false);
      });
      
      rzp1.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment gateway');
      setProcessing(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (paymentScreenshot) {
        submitData.append('payment_screenshot', paymentScreenshot);
      }

      await api.post(`/payments/${quoteId}/submit`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/dashboard/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment submission failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#020817] min-h-screen font-sans">
      <main className="max-w-2xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a1128] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-secondary"></div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-slate-400 mb-6">Select your preferred payment method below to provision your service.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {details ? (
            <div className="space-y-6">
              <div className="bg-[#020817] rounded-xl p-6 border border-gray-800 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <span className="text-gray-400">Quote Reference</span>
                  <span className="text-white font-semibold">{details.quote_number}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <span className="text-gray-400">Service Name</span>
                  <span className="text-white">{details.service_type}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg text-white font-medium">Amount Due</span>
                  <span className="text-2xl text-secondary font-bold">₹{parseFloat(details.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div className="flex bg-[#020817] rounded-lg p-1 border border-gray-800">
                <button
                  type="button"
                  onClick={() => setPaymentMode('online')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${
                    paymentMode === 'online' 
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Pay Online (Instant)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('manual')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${
                    paymentMode === 'manual' 
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Manual Bank Transfer
                </button>
              </div>

              <form onSubmit={paymentMode === 'online' ? handleRazorpayPayment : handleManualSubmit} className="space-y-6">
                
                {paymentMode === 'manual' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Invoice Reference</label>
                      <input 
                        type="text" name="invoice_reference" value={formData.invoice_reference} onChange={handleChange} 
                        className="w-full px-4 py-2.5 bg-[#020817] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                        placeholder={`e.g. INV-${details.quote_number}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Payment Method <span className="text-red-500">*</span></label>
                      <select 
                        name="payment_method" value={formData.payment_method} onChange={handleChange} 
                        className="w-full px-4 py-2.5 bg-[#020817] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                        required={paymentMode === 'manual'}
                      >
                        <option value="NEFT">NEFT</option>
                        <option value="RTGS">RTGS</option>
                        <option value="IMPS">IMPS</option>
                        <option value="UPI">UPI</option>
                        <option value="Wire Transfer">Wire Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">UTR / Transaction ID <span className="text-red-500">*</span></label>
                      <input 
                        type="text" name="transaction_reference" value={formData.transaction_reference} onChange={handleChange} 
                        className="w-full px-4 py-2.5 bg-[#020817] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                        required={paymentMode === 'manual'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Payment Date <span className="text-red-500">*</span></label>
                      <input 
                        type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} 
                        className="w-full px-4 py-2.5 bg-[#020817] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                        required={paymentMode === 'manual'}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Bank Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} 
                        className="w-full px-4 py-2.5 bg-[#020817] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                        required={paymentMode === 'manual'}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-400 mb-2">Payment Receipt Upload <span className="text-red-500">*</span></label>
                      <input 
                        type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange}
                        className="w-full text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 transition-colors"
                        required={paymentMode === 'manual'}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="pt-4">
                  <h4 className="text-white font-bold mb-4">Customer Agreements</h4>
                  
                  <label className="flex items-start space-x-3 cursor-pointer group mb-4">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" name="msaAccepted"
                        className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#020817] checked:bg-secondary checked:border-secondary transition-colors cursor-pointer" 
                        checked={formData.msaAccepted} onChange={handleChange} required
                      />
                      <svg className="absolute w-3 h-3 text-[#020817] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      I have read and agree to the <a href="#" className="text-secondary hover:underline">Master Service Agreement (MSA)</a>.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group mb-4">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" name="tncAccepted"
                        className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#020817] checked:bg-secondary checked:border-secondary transition-colors cursor-pointer" 
                        checked={formData.tncAccepted} onChange={handleChange} required
                      />
                      <svg className="absolute w-3 h-3 text-[#020817] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      I accept the <a href="#" className="text-secondary hover:underline">Terms & Conditions</a> of service.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group mb-4">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" name="aupAccepted"
                        className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#020817] checked:bg-secondary checked:border-secondary transition-colors cursor-pointer" 
                        checked={formData.aupAccepted} onChange={handleChange} required
                      />
                      <svg className="absolute w-3 h-3 text-[#020817] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      I agree to the <a href="#" className="text-secondary hover:underline">Acceptable Use Policy (AUP)</a>.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group mb-4">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" name="privacyAccepted"
                        className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#020817] checked:bg-secondary checked:border-secondary transition-colors cursor-pointer" 
                        checked={formData.privacyAccepted} onChange={handleChange} required
                      />
                      <svg className="absolute w-3 h-3 text-[#020817] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      I have reviewed and accept the <a href="#" className="text-secondary hover:underline">Privacy Policy</a>.
                    </span>
                  </label>

                  <div className="border-t border-gray-800 my-6"></div>

                  <label className="flex items-start space-x-3 cursor-pointer group mb-6">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" name="termsAccepted"
                        className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#020817] checked:bg-secondary checked:border-secondary transition-colors cursor-pointer" 
                        checked={formData.termsAccepted} onChange={handleChange} required
                      />
                      <svg className="absolute w-3 h-3 text-[#020817] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      By proceeding, I confirm that the payment details provided are accurate and the transfer was made to the official Greenleaf Data Center account.
                    </span>
                  </label>

                  <button 
                    type="submit"
                    disabled={processing || !formData.termsAccepted || !formData.msaAccepted || !formData.tncAccepted || !formData.aupAccepted || !formData.privacyAccepted || (paymentMode === 'manual' && !paymentScreenshot)}
                    className="w-full py-4 bg-secondary hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/20 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        {paymentMode === 'online' ? 'Processing...' : 'Submitting Proof...'}
                      </>
                    ) : (
                      paymentMode === 'online' ? 'Pay Securely via Razorpay' : 'Submit Payment Proof'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            !error && <p className="text-gray-400">Could not load payment details.</p>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentPage;
