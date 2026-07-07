import React, { useState, useEffect } from 'react';
import Pagination from '../../components/common/Pagination';
import { getAdminServices, updateAdminServiceStatus } from '../../services/adminApi';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;
    try {
      await updateAdminServiceStatus(id, newStatus);
      fetchServices();
    } catch (error) {
      console.error('Error updating status', error);
      alert('Failed to update status');
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

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const currentItems = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">All Services</h1>
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
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
                      <td className="block md:table-cell px-2 md:px-6 py-3 md:py-4 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0 flex gap-2 flex-wrap md:justify-end">
                        {service.status === 'Active' && (
                          <button onClick={() => handleStatusChange(service.id, 'Suspended')} className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded hover:bg-orange-500/20 text-xs font-medium transition-colors border border-orange-500/20">Suspend</button>
                        )}
                        {(service.status === 'Suspended' || service.status === 'Expired') && (
                          <button onClick={() => handleStatusChange(service.id, 'Active')} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 text-xs font-medium transition-colors border border-emerald-500/20">Reactivate</button>
                        )}
                        {service.status !== 'Cancelled' && (
                          <button onClick={() => handleStatusChange(service.id, 'Cancelled')} className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-xs font-medium transition-colors border border-red-500/20">Cancel</button>
                        )}
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
    </div>
  );
};

export default AdminServicesPage;
