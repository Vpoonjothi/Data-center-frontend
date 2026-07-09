import React, { useEffect, useState } from 'react';
import Pagination from '../../components/common/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import DateFilter, { applyDateFilter } from '../../components/common/DateFilter';
import { Link } from 'react-router-dom';
import { getEnquiries } from '../../services/adminApi';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [dateFilter, setDateFilter] = useState({ type: 'all', value: '' });

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-status-dropdown')) {
        setIsStatusFilterOpen(false);
      }
      if (!e.target.closest('.custom-type-dropdown')) {
        setIsTypeFilterOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await getEnquiries();
      if (res.success) {
        setEnquiries(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter(enq => {
    const statusMatch = filterStatus === 'All' || enq.status === filterStatus;
    const typeMatch = filterType === 'All' || enq.type === filterType;
    const actionMatch = filterAction === 'All' || enq.request_action === filterAction;
    const dateMatch = applyDateFilter(enq.created_at || enq.createdAt, dateFilter);
    return statusMatch && typeMatch && actionMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const currentItems = filteredEnquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Sales Requests</h1>
          <p className="text-gray-400">Manage customer queries, quotes, and requests.</p>
        </div>
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl">
        {/* Top Action Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-800 bg-[#020817] custom-scrollbar">
          {['All', 'REQUEST_QUOTE', 'DIRECT_ORDER', 'GENERAL_ENQUIRY'].map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                filterAction === action 
                  ? 'border-secondary text-white bg-secondary/5' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
              }`}
            >
              {action.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-gray-800 bg-[#020817]/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto z-20">
            <span className="text-sm font-medium text-gray-400 w-12 sm:w-auto">Status:</span>
            <div className="relative custom-status-dropdown flex-1 sm:w-48">
              <button
                onClick={() => { setIsStatusFilterOpen(!isStatusFilterOpen); setIsTypeFilterOpen(false); }}
                className="w-full flex items-center justify-between gap-2 bg-[#020817] border border-gray-800 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none hover:border-gray-600 transition-colors cursor-pointer"
              >
                <span className="truncate">{filterStatus === 'All' ? 'All Statuses' : filterStatus}</span>
                <svg className={`w-4 h-4 shrink-0 transition-transform ${isStatusFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isStatusFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 sm:left-auto sm:right-auto z-30 mt-2 w-full sm:w-56 bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    <button onClick={() => { setFilterStatus('All'); setCurrentPage(1); setIsStatusFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${filterStatus === 'All' ? 'text-secondary font-medium bg-secondary/10' : 'text-gray-300'}`}>All Statuses</button>
                    
                    <div className="px-4 py-1 mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">New Workflow</div>
                    {['New', 'Reviewing', 'Quote Generated', 'Waiting Customer Approval', 'Approved', 'Invoice Generated', 'Payment Pending', 'Payment Received', 'Provisioning', 'Completed', 'Closed'].map((status) => (
                      <button key={status} onClick={() => { setFilterStatus(status); setCurrentPage(1); setIsStatusFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${filterStatus === status ? 'text-secondary font-medium bg-secondary/10' : 'text-gray-300'}`}>{status}</button>
                    ))}
                    
                    <div className="px-4 py-1 mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Legacy Workflow</div>
                    {['In Progress', 'Responded'].map((status) => (
                      <button key={status} onClick={() => { setFilterStatus(status); setCurrentPage(1); setIsStatusFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${filterStatus === status ? 'text-secondary font-medium bg-secondary/10' : 'text-gray-300'}`}>{status} (Legacy)</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto z-10">
            <span className="text-sm font-medium text-gray-400 w-12 sm:w-auto">Type:</span>
            <div className="relative custom-type-dropdown flex-1 sm:w-48">
              <button
                onClick={() => { setIsTypeFilterOpen(!isTypeFilterOpen); setIsStatusFilterOpen(false); }}
                className="w-full flex items-center justify-between gap-2 bg-[#020817] border border-gray-800 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none hover:border-gray-600 transition-colors cursor-pointer"
              >
                <span className="truncate">
                  {filterType === 'All' ? 'All Types' : 
                   filterType === 'contact' ? 'General Contact' : 
                   filterType === 'quote' ? 'Quote Request' : 
                   filterType === 'ai_server' ? 'AI Server Request' : 
                   filterType === 'enterprise_server' ? 'Enterprise Server Request' : filterType}
                </span>
                <svg className={`w-4 h-4 shrink-0 transition-transform ${isTypeFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isTypeFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 sm:left-auto sm:right-auto z-30 mt-2 w-full sm:w-56 bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    {[
                      { val: 'All', label: 'All Types' },
                      { val: 'contact', label: 'General Contact' },
                      { val: 'quote', label: 'Quote Request' },
                      { val: 'ai_server', label: 'AI Server Request' },
                      { val: 'enterprise_server', label: 'Enterprise Server Request' }
                    ].map((typeObj) => (
                      <button key={typeObj.val} onClick={() => { setFilterType(typeObj.val); setCurrentPage(1); setIsTypeFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${filterType === typeObj.val ? 'text-secondary font-medium bg-secondary/10' : 'text-gray-300'}`}>
                        {typeObj.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <DateFilter 
              filter={dateFilter} 
              setFilter={setDateFilter} 
              onFilterChange={() => setCurrentPage(1)} 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto md:overflow-visible">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse block md:table min-w-full md:min-w-[900px]">
              <thead className="hidden md:table-header-group">
                <tr className="bg-[#020817] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Product Type</th>
                  <th className="py-4 px-6">Request Action</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group text-sm">
                {currentItems.map((enq) => (
                  <tr key={enq.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-gray-800 md:border-b md:border-x-0 md:border-t-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-white/[0.02] transition-colors relative">
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-gray-500 font-mono">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">ID</span>
                      ENQ-{enq.id.toString().padStart(4, '0')}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Customer Details</span>
                      <div className="font-medium text-white">{enq.name}</div>
                      <div className="text-gray-500 text-xs">{enq.email}</div>
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Product Type</span>
                      <span className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                        {enq.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Request Action</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border inline-block ${
                        enq.request_action === 'DIRECT_ORDER' ? 'bg-accent/10 text-accent border-accent/20' :
                        enq.request_action === 'REQUEST_QUOTE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-gray-800 text-gray-300 border-gray-700'
                      }`}>
                        {enq.request_action ? enq.request_action.replace('_', ' ') : 'GENERAL ENQUIRY'}
                      </span>
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-gray-400">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Date</span>
                      {new Date(enq.created_at).toLocaleString()}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Status</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        enq.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        enq.status === 'Reviewing' || enq.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        enq.status === 'Quote Generated' || enq.status === 'Responded' || enq.status === 'Quoted' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        enq.status === 'Waiting Customer Approval' || enq.status === 'Verification Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        enq.status === 'Approved' || enq.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        enq.status === 'Invoice Generated' || enq.status === 'Payment Pending' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        enq.status === 'Payment Received' || enq.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        enq.status === 'Provisioning' || enq.status === 'Active' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        enq.status === 'Completed' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                        enq.status === 'Closed' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="block md:table-cell py-3 md:py-4 px-2 md:px-6 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0">
                      <Link to={`/admin/enquiries/${enq.id}`} className="inline-block px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary md:bg-transparent md:hover:bg-transparent md:p-0 border border-secondary/20 md:border-none rounded-lg font-medium text-sm transition-colors w-full text-center md:w-auto">
                        Respond
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredEnquiries.length === 0 && (
                  <tr className="block md:table-row">
                    <td colSpan="7" className="block md:table-cell py-8 text-center text-gray-500">
                      No enquiries match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
  );
};

export default AdminEnquiriesPage;
