import React, { useState, useEffect } from 'react';
import { getAdminServices } from '../../services/adminApi';

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">All Services</h1>
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-[#020817]/50 border-b border-gray-800">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service Name & Type</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dates</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Due Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No active services found.</td>
                  </tr>
                ) : (
                  services.map(service => (
                    <tr key={service.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{service.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{service.user?.email || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-300">{service.service_name}</div>
                        <div className="text-xs text-gray-500">{service.service_type}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">₹{parseFloat(service.monthly_amount).toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-slate-400 mb-1"><span className="text-slate-500">Start:</span> {new Date(service.start_date).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-300"><span className="text-slate-500">Next:</span> {new Date(service.next_due_date).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${getStatusBadge(service.status)}`}>
                          {service.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {service.status === 'Active' ? getDueBadge(service.next_due_date) : <span className="text-slate-500 text-xs">-</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminServicesPage;
