import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getQuotes } from '../../services/adminApi';

const AdminQuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await getQuotes();
      if (res.success) {
        setQuotes(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (filterStatus !== 'All' && quote.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Quotes</h1>
        <p className="text-gray-400">Manage customer server and quote requests.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between bg-[#0a1128]">
          <div className="flex gap-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#020817] border border-gray-700 text-sm rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-secondary"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="quoted">Quoted</option>
              <option value="verification_pending">Verification Pending</option>
              <option value="verified">Verified</option>
              <option value="processing">Payment Processing</option>
              <option value="paid">Paid</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-[#020817] text-gray-500 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Customer Details</th>
                <th className="px-6 py-4 font-semibold">Service Type</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Total Value</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Loading quotes...
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No quotes match your filters.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{quote.quote_number}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{quote.user?.name}</div>
                      <div className="text-xs text-gray-500">{quote.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {quote.service_type}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {quote.duration_value && quote.duration_unit ? `${quote.duration_value} ${quote.duration_unit}` : '1 Month'}
                    </td>
                    <td className="px-6 py-4 font-medium text-secondary">
                      ₹{parseFloat(quote.grand_total || quote.monthly_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                        quote.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        quote.status === 'quoted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                        quote.status === 'verification_pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                        quote.status === 'verified' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 
                        quote.status === 'processing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        quote.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        quote.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        quote.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/quotes/${quote.id}`}
                        className="text-secondary hover:text-white font-medium text-sm transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminQuotesPage;
