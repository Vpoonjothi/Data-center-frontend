import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../../components/common/Pagination';
import DateFilter, { applyDateFilter } from '../../components/common/DateFilter';
import { getAdminServices, updateAdminServiceStatus } from '../../services/adminApi';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [dateFilter, setDateFilter] = useState({ type: 'all', value: '' });
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, newStatus: '' });
  const [toast, setToast] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-menu-container')) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getAdminServices();
      setServices(res.data || []);
    } catch (error) {
      console.error('Failed to fetch admin services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setConfirmModal({ isOpen: true, id, newStatus });
  };

  const confirmStatusChange = async () => {
    const { id, newStatus } = confirmModal;
    setConfirmModal({ isOpen: false, id: null, newStatus: '' });
    try {
      await updateAdminServiceStatus(id, newStatus);
      showToast(`Successfully updated status to ${newStatus}`);
      fetchServices();
    } catch (error) {
      console.error('Error updating status', error);
      showToast('Failed to update status', 'error');
    }
  };

  const getDueBadge = (nextDueDate) => {
    const today = new Date();
    const due = new Date(nextDueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">Overdue</span>;
    } else if (diffDays <= 7) {
      return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Due Soon</span>;
    } else {
      return <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Current</span>;
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (status === 'Suspended') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if (status === 'Cancelled') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const filteredServices = services.filter(service => applyDateFilter(service.start_date || service.created_at || service.createdAt, dateFilter));

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentItems = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">All Services</h1>
        <DateFilter 
          filter={dateFilter} 
          setFilter={setDateFilter} 
          onFilterChange={() => setCurrentPage(1)} 
        />
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl shadow-sm">
        <div className="overflow-x-auto md:overflow-visible">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse block md:table min-w-full md:min-w-[1200px]">
              <thead className="hidden md:table-header-group">
                <tr className="bg-[#020817]/50 border-b border-gray-800">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service Name & Type</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dates</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Due Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y md:divide-y divide-gray-800/50">
                {services.length === 0 ? (
                  <tr className="block md:table-row">
                    <td colSpan="7" className="block md:table-cell py-8 text-center text-gray-500">No active services found.</td>
                  </tr>
                ) : (
                  currentItems.map(service => (
                    <tr key={service.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-gray-800 md:border-b md:border-t-0 md:border-x-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-gray-800/20 transition-colors relative">
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Customer</span>
                        <div className="font-medium text-white">{service.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{service.user?.email || 'N/A'}</div>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Service Name & Type</span>
                        <div className="font-bold text-gray-300">{service.service_name}</div>
                        <div className="text-xs text-gray-500">{service.service_type}</div>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Monthly</span>
                        <div className="font-bold text-white">₹{parseFloat(service.monthly_amount).toLocaleString()}</div>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Dates</span>
                        <div className="text-xs text-slate-400 mb-1"><span className="text-slate-500">Start:</span> {new Date(service.start_date).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-300"><span className="text-slate-500">Next:</span> {new Date(service.next_due_date).toLocaleDateString()}</div>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Status</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border inline-block ${getStatusBadge(service.status)}`}>
                          {service.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Due Status</span>
                        {service.status === 'Active' || service.status === 'Expired' ? getDueBadge(service.next_due_date) : <span className="text-slate-500 text-xs">-</span>}
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-3 md:py-4 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0 relative action-menu-container">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Actions</span>
                        <div className="flex justify-end relative">
                          <button 
                            onClick={() => setOpenActionMenuId(openActionMenuId === service.id ? null : service.id)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          
                          <AnimatePresence>
                            {openActionMenuId === service.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-10 mt-1 w-32 bg-[#0a1128] border border-gray-700 rounded-xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] py-2 z-50 origin-top-right flex flex-col"
                              >
                                {service.status === 'Active' && (
                                  <button onClick={() => { handleStatusChange(service.id, 'Suspended'); setOpenActionMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-white/5 transition-colors">
                                    Suspend
                                  </button>
                                )}
                                {(service.status === 'Suspended' || service.status === 'Expired') && (
                                  <button onClick={() => { handleStatusChange(service.id, 'Active'); setOpenActionMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-emerald-400 hover:bg-white/5 transition-colors">
                                    Reactivate
                                  </button>
                                )}
                                {service.status !== 'Cancelled' && (
                                  <button onClick={() => { handleStatusChange(service.id, 'Cancelled'); setOpenActionMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors">
                                    Cancel
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1128] border border-gray-700 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full relative"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Change Service Status</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Are you sure you want to change the status of this service to <span className="text-white font-semibold capitalize">{confirmModal.newStatus}</span>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, id: null, newStatus: '' })}
                  className="px-6 py-2.5 font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                >
                  Confirm Change
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-md border ${
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            <span className="font-semibold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServicesPage;
