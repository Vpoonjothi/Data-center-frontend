import React, { useState, useEffect } from 'react';
import { getComplianceLogs, getAuditLogs } from '../../services/adminApi';
import { motion } from 'framer-motion';
import Pagination from '../../components/common/Pagination';

const Step = ({ title, status, date }) => {
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';
  const isPending = status === 'pending';

  return (
    <div className="flex flex-col items-center w-32 relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-3 transition-all ${
        isCompleted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
        isFailed ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 
        'bg-[#0f172a] border-slate-700 text-slate-500'
      }`}>
        {isCompleted && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isFailed && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {isPending && (
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
        )}
      </div>
      <div className={`text-sm font-bold ${isCompleted ? 'text-white' : isFailed ? 'text-red-400' : 'text-slate-400'}`}>
        {title}
      </div>
      <div className="text-[10px] text-slate-500 mt-1 text-center min-h-[16px] leading-tight">
        {date ? new Date(date).toLocaleString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : (isPending ? 'Pending Action' : '')}
      </div>
    </div>
  );
};

const Connector = ({ active }) => (
  <div className="flex-1 h-1 relative -mt-10 mx-[-20px] sm:mx-[-10px] md:mx-2 rounded-full overflow-hidden bg-slate-800 z-0">
    <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${active ? 'w-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'w-0'}`}></div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'quoted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'verification_pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'verified': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    case 'paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

const AdminComplianceLogsPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('workflow');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const [logsRes, auditRes] = await Promise.all([
        getComplianceLogs(),
        getAuditLogs()
      ]);
      setQuotes(logsRes.data);
      setAuditLogs(auditRes.data);
    } catch (err) {
      setError('Failed to load compliance logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );
  
  if (error) return <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">{error}</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Compliance & Consent Audit</h1>
          <p className="text-sm md:text-base text-slate-400 mt-2">Track the end-to-end workflow progress of all enterprise quotes.</p>
        </div>
        <div className="flex gap-2 bg-[#020817] p-1 rounded-xl border border-slate-800 self-start md:self-auto w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => { setActiveTab('workflow'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'workflow' ? 'bg-secondary text-[#020817]' : 'text-slate-400 hover:text-white'}`}
          >
            Workflows
          </button>
          <button 
            onClick={() => { setActiveTab('audit'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-secondary text-[#020817]' : 'text-slate-400 hover:text-white'}`}
          >
            System Logs
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'workflow' && (() => {
          const totalPages = Math.ceil(quotes.length / itemsPerPage);
          const currentItems = quotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
          
          return (
            <>
              {currentItems.map((quote, idx) => {
          const isQuoteCompleted = quote.status !== 'pending' && quote.status !== 'rejected';
          const isQuoteRejected = quote.status === 'rejected';
          const hasKycConsent = quote.KycVerification?.kyc_consent;
          const hasPaymentConsent = quote.payments && quote.payments.some(p => p.payment_terms_accepted);
          const isActive = quote.status === 'active';

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={quote.id} 
              className="bg-[#0b132b] border border-slate-800 rounded-2xl p-8 shadow-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800/50 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="text-emerald-500">Quote #{quote.quote_number}</span>
                  </h2>
                  <div className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-slate-200 font-medium">{quote.user?.name}</span>
                    <span className="text-slate-600">•</span>
                    <span>{quote.user?.email}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right flex flex-col md:items-end">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                  <div className="text-xs text-slate-500 mt-3 font-mono bg-slate-900/50 px-3 py-1 rounded border border-slate-800">
                    Created: {new Date(quote.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="relative pt-2 px-2 md:px-6">
                {/* Responsive horizontal scroll for small screens */}
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                  <div className="flex items-start justify-between min-w-[600px] relative">
                    <Step 
                      title="Registration" 
                      status={quote.user?.terms_accepted ? 'completed' : 'pending'} 
                      date={quote.user?.terms_accepted_at} 
                    />
                    <Connector active={isQuoteCompleted} />
                    
                    <Step 
                      title="Quote Sent" 
                      status={isQuoteCompleted ? 'completed' : isQuoteRejected ? 'failed' : 'pending'} 
                      date={isQuoteCompleted ? quote.createdAt : null} 
                    />
                    <Connector active={hasKycConsent} />
                    
                    <Step 
                      title="KYC Consent" 
                      status={hasKycConsent ? 'completed' : 'pending'} 
                      date={quote.KycVerification?.kyc_consent_at} 
                    />
                    <Connector active={hasPaymentConsent} />
                    
                    <Step 
                      title="Payment Terms" 
                      status={hasPaymentConsent ? 'completed' : 'pending'} 
                      date={quote.payments?.find(p => p.payment_terms_accepted)?.payment_terms_accepted_at} 
                    />
                    <Connector active={isActive} />
                    
                    <Step 
                      title="Activation" 
                      status={isActive ? 'completed' : 'pending'} 
                      date={isActive ? quote.updatedAt : null} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {quotes.length > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={Math.ceil(quotes.length / itemsPerPage)} 
            onPageChange={setCurrentPage} 
          />
        )}
        
        {quotes.length === 0 && (
          <div className="bg-[#0b132b] border border-slate-800 rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No Compliance Records Found</h3>
            <p className="text-slate-400">There are no quotes or compliance workflows to display.</p>
          </div>
        )}
            </>
          );
        })()}

        {activeTab === 'audit' && (() => {
        const totalPages = Math.ceil(auditLogs.length / itemsPerPage);
        const currentItems = auditLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        return (
          <div className="bg-[#0a1128] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto md:overflow-visible">
              <table className="w-full text-left text-sm border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-[#020817] text-slate-400 uppercase tracking-wider text-xs font-semibold border-b border-slate-800">
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">Action</th>
                    <th className="py-4 px-6">Entity</th>
                    <th className="py-4 px-6">Target User</th>
                    <th className="py-4 px-6">Action By</th>
                    <th className="py-4 px-6">Details</th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group divide-y md:divide-y divide-slate-800">
                  {currentItems.map((log) => (
                    <tr key={log.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-slate-800 md:border-b md:border-t-0 md:border-x-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-white/[0.02] transition-colors text-slate-300 relative">
                      <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 whitespace-nowrap text-slate-400 font-mono text-xs">
                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Timestamp</span>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Action</span>
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded inline-block">
                          {log.action}
                        </span>
                      </td>
                      <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-slate-400">
                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Entity</span>
                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                      </td>
                      <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Target User</span>
                        {log.target_user ? (
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{log.target_user.name}</span>
                            <span className="text-xs text-slate-500">{log.target_user.email}</span>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Action By</span>
                        {log.action_by ? (
                          <div className="flex flex-col">
                            <span className="text-white font-medium">{log.action_by.name}</span>
                            <span className="text-xs text-slate-500">{log.action_by.email}</span>
                          </div>
                        ) : 'System'}
                      </td>
                      <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-xs text-slate-400 md:max-w-xs break-all md:truncate" title={log.details ? JSON.stringify(log.details) : ''}>
                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Details</span>
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr className="block md:table-row">
                      <td colSpan="6" className="block md:table-cell py-8 text-center text-slate-500">
                        No audit logs available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        );
      })()}
      </div>
    </div>
  );
};

export default AdminComplianceLogsPage;
