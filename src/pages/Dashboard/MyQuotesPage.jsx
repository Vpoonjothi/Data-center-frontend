import React, { useState, useEffect } from 'react';
import { getMyQuotes, acceptQuote, rejectQuote } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BillingSummary from '../../components/common/BillingSummary';

const MyQuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', quoteId: null });
  const [rejectReason, setRejectReason] = useState('');
  const [rejectCategory, setRejectCategory] = useState('');
  const navigate = useNavigate();

  const hasConfigDetails = (quote) => {
    if (quote.enquiry?.configuration_json) {
      const { model, cpu, gpu, ram, storage, network, power, space } = quote.enquiry.configuration_json;
      return !!(model || cpu || gpu || ram || storage || network || power || space);
    }
    return !!(quote.vcpu || quote.ram || quote.storage || quote.bandwidth || quote.os);
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await getMyQuotes();
        if (res.success) {
          setQuotes(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch quotes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  const openAcceptModal = (id) => {
    setModalConfig({ isOpen: true, type: 'accept', quoteId: id });
  };

  const openRejectModal = (id) => {
    setModalConfig({ isOpen: true, type: 'reject', quoteId: id });
    setRejectReason('');
    setRejectCategory('');
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', quoteId: null });
  };

  const confirmAccept = async () => {
    const id = modalConfig.quoteId;
    closeModal();
    try {
      const res = await acceptQuote(id);
      if (res.success) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status: 'verification_pending' } : q));
      }
    } catch (error) {
      console.error('Failed to accept quote', error);
      alert('Failed to accept quote. Please try again.');
    }
  };

  const confirmReject = async () => {
    const id = modalConfig.quoteId;
    const reason = rejectCategory === 'Other' ? rejectReason.trim() : rejectCategory;
    
    if (!reason) {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    closeModal();
    try {
      const res = await rejectQuote(id, reason);
      if (res.success) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status: 'rejected', reject_reason: reason } : q));
      }
    } catch (error) {
      console.error('Failed to reject quote', error);
      alert('Failed to reject quote. Please try again.');
    }
  };

  const renderStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s.includes('verified') || s.includes('active') || s.includes('paid')) {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize whitespace-nowrap">{status.replace('_', ' ')}</span>;
    }
    if (s.includes('pending') || s.includes('quoted') || s.includes('processing')) {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 capitalize whitespace-nowrap">{status.replace('_', ' ')}</span>;
    }
    if (s.includes('rejected') || s.includes('failed')) {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 capitalize whitespace-nowrap">{status.replace('_', ' ')}</span>;
    }
    return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 capitalize whitespace-nowrap">{status.replace('_', ' ')}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-300 font-sans min-h-screen pb-20 pt-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">My Quotes</h1>
            <p className="mt-1 text-slate-400">View and manage your service quotes.</p>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2">No Quotes Found</h3>
            <p className="text-slate-400 mb-4">You haven't requested any quotes yet.</p>
            <button onClick={() => navigate('/services')} className="px-6 py-2.5 bg-secondary hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">Request a Service</button>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-700">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpand(quote.id)}
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quote Number</p>
                      <p className="font-bold text-white text-sm">{quote.quote_number}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Type</p>
                      <p className="text-sm text-slate-300">{quote.service_type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderStatusBadge(quote.status)}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-slate-950 transition-transform duration-300 ml-4 ${expandedId === quote.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === quote.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-800/50"
                    >
                      <div className="p-6 bg-slate-900/50">
                        <div className={`grid grid-cols-1 ${hasConfigDetails(quote) ? 'md:grid-cols-2 gap-6' : 'max-w-2xl mx-auto'}`}>
                          {hasConfigDetails(quote) && (
                            <div>
                              <h4 className="text-sm font-bold text-white mb-4">Configuration Details</h4>
                              {quote.enquiry?.configuration_json ? (
                            <div className="space-y-3">
                              {quote.enquiry.configuration_json.model && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Model</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.model}</span>
                                </div>
                              )}
                              {quote.enquiry.configuration_json.cpu && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">CPU</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.cpu}</span>
                                </div>
                              )}
                              {quote.enquiry.configuration_json.gpu && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">GPU</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.gpu}</span>
                                </div>
                              )}
                              {quote.enquiry.configuration_json.ram && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Memory</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.ram}</span>
                                </div>
                              )}
                              {quote.enquiry.configuration_json.storage && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Storage</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.storage}</span>
                                </div>
                              )}
                              {quote.enquiry.configuration_json.network && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Network</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.network}</span>
                                </div>
                              )}
                              {quote.enquiry.configuration_json.power && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Power</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.power}</span>
                                </div>
                              )}
                              {quote.enquiry.configuration_json.space && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-500">Space</span>
                                  <span className="text-sm text-slate-300">{quote.enquiry.configuration_json.space}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-500">vCPU</span>
                                <span className="text-sm text-slate-300">{quote.vcpu || 'N/A'} Cores</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-500">RAM</span>
                                <span className="text-sm text-slate-300">{quote.ram || 'N/A'} GB</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Storage</span>
                                <span className="text-sm text-slate-300">{quote.storage || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Bandwidth</span>
                                <span className="text-sm text-slate-300">{quote.bandwidth || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Operating System</span>
                                <span className="text-sm text-slate-300">{quote.os || 'N/A'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                          )}
                        
                        <div className="mt-4 md:mt-0">
                          <BillingSummary 
                            productName={quote.service_type || (quote.enquiry && quote.enquiry.type?.replace('_', ' ').toUpperCase())}
                            productCategory="Infrastructure"
                            subscriptionPlan={quote.duration_type || 'Monthly'}
                            billingCycle="Monthly"
                            duration={`${quote.duration_value || 1} ${quote.duration_unit || 'Months'}`}
                            quantity={parseInt(quote.quantity || 1, 10)}
                            unitPrice={parseFloat(quote.unit_price || quote.monthly_price || 0)}
                            subtotal={parseFloat(quote.subtotal || quote.subtotal_price || quote.monthly_price || 0)}
                            discount={parseFloat(quote.discount_amount || 0)}
                            taxableAmount={parseFloat(quote.taxable_amount || quote.subtotal || quote.subtotal_price || quote.monthly_price || 0)}
                            gstAmount={parseFloat(quote.gst_amount || 0)}
                            grandTotal={parseFloat(quote.grand_total || quote.monthly_price || 0)}
                            isEditable={false}
                          />
                          <div className="flex justify-between items-center mt-2 p-2 bg-slate-800/50 rounded-lg">
                            <span className="text-xs text-slate-400">Renewal Type</span>
                            <span className="text-xs font-medium text-slate-300 uppercase">{quote.renewal_type || 'manual'}</span>
                          </div>
                          </div>
                        </div>


                        {quote.status === 'quoted' && (
                          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3 max-w-2xl mx-auto md:max-w-none">
                            <button
                              onClick={() => openRejectModal(quote.id)}
                              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium text-sm"
                            >
                              Reject Quote
                            </button>
                            <button
                              onClick={() => openAcceptModal(quote.id)}
                              className="px-6 py-2 bg-secondary hover:bg-emerald-600 text-white rounded-lg transition-colors font-bold text-sm shadow-lg shadow-secondary/20"
                            >
                              Accept Quote
                            </button>
                          </div>
                        )}

                        {quote.status === 'verification_pending' && (
                          <div className="md:col-span-2 pt-4 border-t border-slate-800 flex justify-between items-center">
                            <p className="text-sm text-amber-500">Identity verification is required before proceeding.</p>
                            <button
                              onClick={() => navigate(`/verification/${quote.id}`)}
                              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg transition-colors font-bold text-sm shadow-lg shadow-amber-500/20"
                            >
                              Start KYC Verification
                            </button>
                          </div>
                        )}

                        {quote.status === 'verified' && (
                          <div className="md:col-span-2 pt-4 border-t border-slate-800 flex justify-between items-center">
                            <p className="text-sm text-emerald-400">KYC Verified. Pending payment.</p>
                            <button
                              onClick={() => navigate(`/payment/${quote.id}`)}
                              className="px-6 py-2 bg-secondary hover:bg-emerald-600 text-white rounded-lg transition-colors font-bold text-sm shadow-lg shadow-secondary/20"
                            >
                              Proceed to Payment
                            </button>
                          </div>
                        )}

                        {quote.status === 'paid' && (
                          <div className="md:col-span-2 pt-4 border-t border-slate-800 flex justify-between items-center">
                            <p className="text-sm text-blue-400">Payment received and verified.</p>
                            <button
                              disabled
                              className="px-6 py-2 bg-slate-800 text-slate-400 rounded-lg cursor-not-allowed font-medium text-sm"
                            >
                              Waiting for Provisioning
                            </button>
                          </div>
                        )}

                        {quote.status === 'active' && (
                          <div className="md:col-span-2 pt-4 border-t border-slate-800 flex justify-between items-center">
                            <p className="text-sm text-emerald-400">Service is active and running.</p>
                            <button
                              onClick={() => navigate(`/dashboard/services`)}
                              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm border border-slate-700"
                            >
                              Manage Service
                            </button>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Custom Modal Overlay */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={closeModal}
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-10"
            >
              {modalConfig.type === 'accept' && (
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Accept Quote?</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    By accepting this quote, you agree to the billing summary terms and will proceed to KYC verification and payment.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium">Cancel</button>
                    <button onClick={confirmAccept} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-bold shadow-lg shadow-emerald-900/50">Accept Quote</button>
                  </div>
                </div>
              )}

              {modalConfig.type === 'reject' && (
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Reject Quote?</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Please let us know why you are rejecting this quote so we can improve our services.
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Rejection <span className="text-red-500">*</span></label>
                    <select
                      value={rejectCategory}
                      onChange={(e) => setRejectCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 mb-4"
                    >
                      <option value="">Select a reason...</option>
                      <option value="Price is too high">Price is too high</option>
                      <option value="Found a better alternative">Found a better alternative</option>
                      <option value="Specifications do not match requirements">Specifications do not match requirements</option>
                      <option value="Project cancelled or delayed">Project cancelled or delayed</option>
                      <option value="Other">Other (Please specify)</option>
                    </select>
                  </div>

                  {rejectCategory === 'Other' && (
                    <div className="mb-4">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Please specify your reason..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 h-24 resize-none"
                      ></textarea>
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-800">
                    <button onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium">Cancel</button>
                    <button 
                      onClick={confirmReject} 
                      disabled={!rejectCategory || (rejectCategory === 'Other' && !rejectReason.trim())}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm font-bold shadow-lg shadow-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyQuotesPage;
