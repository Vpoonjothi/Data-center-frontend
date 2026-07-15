import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PaymentVerificationTab = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments/my-payments');
        if (res.success) {
          setPayments(res.data || []);
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Pending Verification': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  if (payments.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Payment History</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-slate-400 font-medium">No payment history found.</p>
          <p className="text-xs text-slate-500 mt-2">Your verified payments will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Payment History</h3>
      
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start gap-6 hover:border-slate-700 transition-colors">
            
            <div className="flex-1 space-y-4 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Payment Submission</h4>
                  <p className="text-sm text-slate-400">Quote: {payment.quote_id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Date</p>
                  <p className="text-sm text-slate-300">
                    {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="text-sm text-slate-300 font-mono">{payment.transaction_id || `PAY-${payment.id.toString().padStart(5, '0')}`}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-sm text-emerald-400 font-bold">₹{parseFloat(payment.amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm text-slate-300 capitalize">{payment.payment_method?.replace('_', ' ') || 'Manual'}</p>
                </div>
              </div>

              {payment.remarks && (
                <div className={`mt-4 p-3 border rounded-lg ${payment.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/50 border-slate-700'}`}>
                  <p className={`text-xs font-bold uppercase mb-1 ${payment.status === 'Rejected' ? 'text-red-400' : 'text-slate-400'}`}>
                    {payment.status === 'Rejected' ? 'Rejection Reason' : 'Admin Remarks'}
                  </p>
                  <p className={`text-sm ${payment.status === 'Rejected' ? 'text-red-300' : 'text-slate-300'}`}>{payment.remarks}</p>
                </div>
              )}
            </div>

            {payment.receipt_url && (
              <div className="shrink-0 pt-2 md:pt-0">
                <a 
                  href={payment.receipt_url.startsWith('http') ? payment.receipt_url : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`}${payment.receipt_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View Receipt
                </a>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentVerificationTab;
