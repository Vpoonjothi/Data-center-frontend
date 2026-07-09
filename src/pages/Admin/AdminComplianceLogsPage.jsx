import React, { useState, useEffect } from 'react';
import { getComplianceLogs, getAuditLogs } from '../../services/adminApi';
import { motion } from 'framer-motion';
import Pagination from '../../components/common/Pagination';
import DateFilter, { applyDateFilter } from '../../components/common/DateFilter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [dateFilter, setDateFilter] = useState({ type: 'all', value: '' });

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

  const formatDetails = (details) => {
    if (!details) return '';
    if (typeof details === 'string') return details;
    try {
      const obj = typeof details === 'string' ? JSON.parse(details) : details;
      return Object.entries(obj)
        .map(([key, value]) => `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${value}`)
        .join(' | ');
    } catch(e) {
      return String(details);
    }
  };

  const downloadAuditLogsCSV = () => {
    if (!auditLogs || auditLogs.length === 0) return;
    
    // Create CSV header
    const headers = ['Date', 'Time', 'Action', 'Entity', 'ID', 'User', 'User Email', 'Admin', 'Admin Email', 'Details'];
    
    const csvRows = [headers.join(',')];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    auditLogs.forEach(log => {
      const d = new Date(log.created_at);
      const dateStr = `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
      const action = log.action || '';
      const entityType = log.entity_type || '';
      const entityId = log.entity_id || '';
      const targetUserName = log.target_user?.name || '';
      const targetUserEmail = log.target_user?.email || '';
      const actionByName = log.action_by?.name || 'System';
      const actionByEmail = log.action_by?.email || '';
      const detailsStr = formatDetails(log.details);
      const details = detailsStr.replace(/"/g, '""');
      
      const row = [
        `"${dateStr}"`,
        `"${timeStr}"`,
        `"${action}"`,
        `"${entityType}"`,
        `"${entityId}"`,
        `"${targetUserName}"`,
        `"${targetUserEmail}"`,
        `"${actionByName}"`,
        `"${actionByEmail}"`,
        `"${details}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Greenleaf_System_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadAuditLogsPDF = () => {
    if (!auditLogs || auditLogs.length === 0) return;
    const doc = new jsPDF();
    doc.text('System Logs & Audit Trail', 14, 15);
    
    const tableColumn = ["Timestamp", "Action", "Target", "Action By", "Details"];
    const tableRows = [];
    
    auditLogs.forEach(log => {
      const timestamp = new Date(log.created_at).toLocaleString();
      const target = log.target_user ? log.target_user.name : (log.entity_type + (log.entity_id ? ` ${log.entity_id}` : ''));
      const actionBy = log.action_by ? log.action_by.name : 'System';
      const details = log.details ? JSON.stringify(log.details).substring(0, 50) : '';
      
      tableRows.push([timestamp, log.action, target, actionBy, details]);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] }
    });
    
    doc.save(`Greenleaf_System_Logs_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadWorkflowsPDF = () => {
    if (!quotes || quotes.length === 0) return;
    const doc = new jsPDF();
    doc.text('Compliance Workflows', 14, 15);
    
    const tableColumn = ["Quote ID", "User", "Status", "Created", "KYC", "Payment"];
    const tableRows = [];
    
    quotes.forEach(quote => {
      const date = new Date(quote.createdAt).toLocaleDateString();
      const user = quote.user?.name || 'N/A';
      const kyc = quote.KycVerification?.kyc_consent ? 'Yes' : 'No';
      const payment = (quote.payments && quote.payments.some(p => p.payment_terms_accepted)) ? 'Yes' : 'No';
      
      tableRows.push([quote.quote_number, user, quote.status, date, kyc, payment]);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 185, 129] }
    });
    
    doc.save(`Greenleaf_Workflows_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );
  
  if (error) return <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">{error}</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Overall Logs</h1>
          <p className="text-slate-400 text-sm">Monitor system workflows, quote progressions, and admin audit trails.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <DateFilter 
            filter={dateFilter} 
            setFilter={setDateFilter} 
            onFilterChange={() => setCurrentPage(1)} 
          />
          <div className="flex justify-center md:justify-start gap-2 bg-[#020817] p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
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
      </div>

      <div className="space-y-6">
        {activeTab === 'workflow' && (() => {
          const filteredQuotes = quotes.filter(quote => applyDateFilter(quote.createdAt || quote.created_at, dateFilter));
          const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
          const currentItems = filteredQuotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
          
          return (
            <div className="space-y-4">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={downloadWorkflowsPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-500/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>

              <div className="bg-[#0a1128] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto md:overflow-visible">
                  <table className="w-full text-left text-sm border-collapse block md:table">
                    <thead className="hidden md:table-header-group">
                      <tr className="bg-[#020817] text-slate-400 uppercase tracking-wider text-xs font-semibold border-b border-slate-800">
                        <th className="py-4 px-6">Quote ID</th>
                        <th className="py-4 px-6">User</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Created At</th>
                        <th className="py-4 px-6">KYC</th>
                        <th className="py-4 px-6">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="block md:table-row-group divide-y md:divide-y divide-slate-800">
                      {currentItems.map((quote) => {
                        const hasKycConsent = quote.KycVerification?.kyc_consent;
                        const hasPaymentConsent = quote.payments && quote.payments.some(p => p.payment_terms_accepted);
                        
                        return (
                          <tr key={quote.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-slate-800 md:border-b md:border-t-0 md:border-x-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-white/[0.02] transition-colors text-slate-300 relative">
                            <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 whitespace-nowrap text-emerald-400 font-bold">
                              <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Quote ID</span>
                              {quote.quote_number}
                            </td>
                            <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                              <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">User</span>
                              <div className="flex flex-col">
                                <span className="text-white font-medium">{quote.user?.name}</span>
                                <span className="text-xs text-slate-500">{quote.user?.email}</span>
                              </div>
                            </td>
                            <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                              <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Status</span>
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(quote.status)}`}>
                                {quote.status}
                              </span>
                            </td>
                            <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-slate-400 font-mono text-xs">
                              <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Created At</span>
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </td>
                            <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                              <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">KYC Consent</span>
                              {hasKycConsent ? (
                                <span className="text-emerald-400 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Yes</span>
                              ) : (
                                <span className="text-slate-500">Pending</span>
                              )}
                            </td>
                            <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                              <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Payment Consent</span>
                              {hasPaymentConsent ? (
                                <span className="text-emerald-400 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Yes</span>
                              ) : (
                                <span className="text-slate-500">Pending</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {filteredQuotes.length === 0 && (
                        <tr className="block md:table-row">
                          <td colSpan="6" className="block md:table-cell py-8 text-center text-slate-500">
                            No compliance workflows found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              )}
            </div>
          );
        })()}

        {activeTab === 'audit' && (() => {
          const filteredAuditLogs = auditLogs.filter(log => applyDateFilter(log.created_at, dateFilter));
          const totalPages = Math.ceil(filteredAuditLogs.length / itemsPerPage);
          const currentItems = filteredAuditLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        return (
          <div className="space-y-4">
            <div className="flex justify-end mb-4 gap-2">
              <button 
                onClick={downloadAuditLogsPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
              <button 
                onClick={downloadAuditLogsCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-emerald-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CSV
              </button>
            </div>
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
                      <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-xs text-slate-400 md:max-w-xs break-all md:truncate" title={log.details ? formatDetails(log.details) : ''}>
                        <span className="md:hidden text-[10px] text-gray-500 uppercase font-semibold block mb-1">Details</span>
                        {log.details ? formatDetails(log.details) : '-'}
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
          </div>
        );
      })()}
      </div>
    </div>
  );
};

export default AdminComplianceLogsPage;
