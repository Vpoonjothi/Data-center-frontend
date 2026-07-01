import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getEnquiries } from '../../services/adminApi';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

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
    return statusMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Enquiries</h1>
          <p className="text-gray-400">Manage customer queries, quotes, and requests.</p>
        </div>
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-[#020817]/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Status:</span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#020817] border border-gray-800 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-secondary"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Responded">Responded</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Type:</span>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#020817] border border-gray-800 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-secondary"
            >
              <option value="All">All Types</option>
              <option value="contact">General Contact</option>
              <option value="quote">Quote Request</option>
              <option value="ai_server">AI Server Request</option>
              <option value="enterprise_server">Enterprise Server Request</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#020817] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-gray-500 font-mono">ENQ-{enq.id.toString().padStart(4, '0')}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-white">{enq.name}</div>
                      <div className="text-gray-500 text-xs">{enq.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {enq.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {new Date(enq.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        enq.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        enq.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        enq.status === 'Responded' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link to={`/admin/enquiries/${enq.id}`} className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-lg font-medium text-sm transition-colors">
                        Respond
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredEnquiries.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No enquiries match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiriesPage;
