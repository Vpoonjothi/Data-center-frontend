import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DateFilter, { applyDateFilter } from '../../components/common/DateFilter';
import { Link } from 'react-router-dom';
import { getQuotes } from '../../services/adminApi';
import Pagination from '../../components/common/Pagination';

const AdminQuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [dateFilter, setDateFilter] = useState({ type: 'all', value: '' });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-status-filter')) setIsFilterOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
    return applyDateFilter(quote.created_at || quote.createdAt, dateFilter);
  });

  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const currentQuotes = filteredQuotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Quotes</h1>
        <p className="text-gray-400">Manage customer server and quote requests.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl"
      >
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-end bg-[#0a1128]">
          <div className="flex flex-wrap gap-4">
            <div className="relative custom-status-filter min-w-[180px]">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-secondary transition-colors"
              >
                <span className="truncate">
                  {filterStatus === 'All' ? 'All Statuses' : 
                   filterStatus === 'verification_pending' ? 'Verification Pending' :
                   filterStatus === 'processing' ? 'Payment Processing' :
                   filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </span>
                <svg className={`shrink-0 w-4 h-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 z-50 mt-2 w-full min-w-[180px] bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2 max-h-[60vh] overflow-y-auto"
                  >
                    {[
                      { value: 'All', label: 'All Statuses' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'quoted', label: 'Quoted' },
                      { value: 'verification_pending', label: 'Verification Pending' },
                      { value: 'verified', label: 'Verified' },
                      { value: 'processing', label: 'Payment Processing' },
                      { value: 'paid', label: 'Paid' },
                      { value: 'active', label: 'Active' },
                      { value: 'rejected', label: 'Rejected' },
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => { 
                          setFilterStatus(option.value); 
                          setCurrentPage(1);
                          setIsFilterOpen(false); 
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${filterStatus === option.value ? 'text-secondary bg-secondary/10' : 'text-gray-300'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <DateFilter 
              filter={dateFilter} 
              setFilter={setDateFilter} 
              onFilterChange={() => setCurrentPage(1)} 
            />
          </div>
        </div>

        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left text-sm text-gray-400 block md:table min-w-full md:min-w-[900px]">
            <thead className="text-xs uppercase bg-[#020817] text-gray-500 border-b border-gray-800 hidden md:table-header-group">
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
            <tbody className="block md:table-row-group">
              {loading ? (
                <tr className="block md:table-row">
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500 block md:table-cell">
                    Loading quotes...
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr className="block md:table-row">
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400 block md:table-cell">
                      No quotes found.
                    </td>
                  </tr>
                ) : (
                  currentQuotes.map((quote) => (
                  <tr key={quote.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-gray-800 md:border-b md:border-t-0 md:border-x-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-gray-800/30 transition-colors relative">
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4 font-medium text-white">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">ID</span>
                      {quote.quote_number}
                    </td>
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Customer Details</span>
                      <div className="text-white font-medium">{quote.user?.name}</div>
                      <div className="text-xs text-gray-500">{quote.user?.email}</div>
                    </td>
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4 text-white">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Service Type</span>
                      {quote.service_type}
                    </td>
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-300">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Duration</span>
                      {quote.duration_value && quote.duration_unit ? `${quote.duration_value} ${quote.duration_unit}` : '1 Month'}
                    </td>
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4 font-medium text-secondary">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Total Value</span>
                      ₹{parseFloat(quote.grand_total || quote.monthly_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-gray-400">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Date</span>
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Status</span>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border inline-block ${
                        quote.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                        quote.status === 'quoted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        quote.status === 'verification_pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                        quote.status === 'verified' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 
                        quote.status === 'processing' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        quote.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        quote.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        quote.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="block md:table-cell px-2 md:px-6 py-3 md:py-4 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0">
                      <Link 
                        to={`/admin/quotes/${quote.id}`}
                        className="inline-block w-full text-center md:w-auto px-4 py-2 bg-secondary/10 hover:bg-secondary/20 md:bg-transparent md:hover:bg-transparent md:p-0 border border-secondary/20 md:border-none rounded-lg text-secondary md:hover:text-white font-medium text-sm transition-colors"
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
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </motion.div>
    </div>
  );
};

export default AdminQuotesPage;
