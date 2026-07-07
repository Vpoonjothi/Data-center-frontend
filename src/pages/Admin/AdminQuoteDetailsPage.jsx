import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getQuoteById, updateQuoteStatus } from '../../services/adminApi';
import BillingSummary from '../../components/common/BillingSummary';

const AdminQuoteDetailsPage = () => {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields for quoting
  const [finalAmount, setFinalAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const fetchQuote = async () => {
    try {
      const res = await getQuoteById(id);
      if (res.success) {
        setQuote(res.data);
        setFinalAmount(res.data.grand_total || '');
        setNotes(res.data.notes || '');
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      setError('Failed to load quote details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      
      let priceToSave = undefined;
      let notesToSave = undefined;
      
      if (newStatus === 'quoted') {
        if (!finalAmount) {
          setError('Final Quotation Amount is required to generate a quote.');
          setUpdating(false);
          return;
        }
        priceToSave = finalAmount;
        notesToSave = notes;
      }
      
      await updateQuoteStatus(id, newStatus, priceToSave, notesToSave);
      await fetchQuote();
      setSuccess(`Quote status updated to ${newStatus.toUpperCase()} successfully!`);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const displayMonthly = parseFloat(quote?.unit_price || quote?.monthly_price || 0);
  const displayQuantity = parseInt(quote?.quantity || 1, 10);
  const displaySubtotal = parseFloat(quote?.subtotal || quote?.subtotal_price || quote?.monthly_price || 0);
  const displayDiscount = parseFloat(quote?.discount_amount || 0);
  const displayTaxable = parseFloat(quote?.taxable_amount || displaySubtotal);
  const displayGst = parseFloat(quote?.gst_amount || 0);
  const displayTotal = parseFloat(quote?.grand_total || displaySubtotal);

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading quote details...</div>;
  }

  if (error && !quote) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error || 'Quote not found.'}
        </div>
        <Link to="/admin/quotes" className="mt-4 inline-block text-secondary hover:text-white">
          &larr; Back to Quotes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/admin/quotes" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Quotes
        </Link>
        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide border ${
          quote.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
          quote.status === 'quoted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
          quote.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
          quote.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }`}>
          {quote.status}
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 space-y-6">
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/10 border border-secondary/50 text-secondary p-4 rounded-xl"
            >
              {success}
            </motion.div>
          )}
          {error && quote && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl"
            >
              {error}
            </motion.div>
          )}
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Quote Details: {quote.quote_number}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Service Type</h3>
                <p className="text-white text-lg">{quote.service_type}</p>
              </div>
              </div>
              <div className="mt-8">
                <BillingSummary 
                  productName={quote.service_type}
                  productCategory="Infrastructure"
                  subscriptionPlan={quote.duration_type || 'Monthly'}
                  billingCycle="Monthly"
                  duration={`${quote.duration_value || 1} ${quote.duration_unit || 'Months'}`}
                  quantity={displayQuantity}
                  unitPrice={displayMonthly}
                  subtotal={displaySubtotal}
                  discount={displayDiscount}
                  taxableAmount={displayTaxable}
                  gstAmount={displayGst}
                  grandTotal={displayTotal}
                  isEditable={false}
                />
              </div>
            </div>
          
          {quote.notes && quote.status !== 'pending' && (
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quotation Notes</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}

          {quote.status === 'rejected' && quote.reject_reason && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 md:p-8 mt-6">
              <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rejection Reason
              </h3>
              <p className="text-red-400 whitespace-pre-wrap text-sm leading-relaxed">{quote.reject_reason}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Info</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Name</div>
                <div className="text-sm text-white font-medium">{quote.user?.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="text-sm text-white">{quote.user?.email}</div>
              </div>
              {quote.user?.company && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Company</div>
                  <div className="text-sm text-white">{quote.user?.company}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Workflow Actions</h3>
            


            {quote.status === 'quoted' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Waiting for customer to accept the quote.</p>
              </div>
            )}

            {quote.status === 'verification_pending' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Customer accepted the quote. Waiting for KYC Verification to be completed in the KYC module.</p>
              </div>
            )}

            {quote.status === 'verified' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">KYC Verified. Waiting for customer to submit payment.</p>
              </div>
            )}

            {quote.status === 'processing' && (
              <div className="space-y-4">
                <p className="text-sm text-blue-400 font-medium">Customer has submitted manual payment proof.</p>
                <p className="text-sm text-gray-400">Review the payment in the Payments section. Once verified, mark it as received.</p>
                <button 
                  onClick={() => handleUpdateStatus('paid')}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-green-500/20"
                >
                  {updating ? 'Processing...' : 'Verify & Mark Payment Received'}
                </button>
              </div>
            )}

            {quote.status === 'paid' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Payment received. Provision the server/service for the customer and mark as active.</p>
                <button 
                  onClick={() => handleUpdateStatus('active')}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {updating ? 'Processing...' : 'Activate Service'}
                </button>
              </div>
            )}

            {quote.status === 'active' && (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center">
                  <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-emerald-400 font-medium">Service is currently active.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminQuoteDetailsPage;
