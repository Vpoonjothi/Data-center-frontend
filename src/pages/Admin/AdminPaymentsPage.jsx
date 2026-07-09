import React, { useState, useEffect } from 'react';
import Pagination from '../../components/common/Pagination';
import DateFilter, { applyDateFilter } from '../../components/common/DateFilter';
import { getAdminPayments } from '../../services/adminApi';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [dateFilter, setDateFilter] = useState({ type: 'all', value: '' });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getAdminPayments();
      setPayments(res.data || []);
    } catch (error) {
      console.error('Failed to fetch admin payments', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => applyDateFilter(payment.payment_date, dateFilter));

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const currentItems = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">All Payments</h1>
        <DateFilter 
          filter={dateFilter} 
          setFilter={setDateFilter} 
          onFilterChange={() => setCurrentPage(1)} 
        />
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
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service & Quote</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction Ref</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y md:divide-y divide-gray-800/50">
                {payments.length === 0 ? (
                  <tr className="block md:table-row">
                    <td colSpan="6" className="block md:table-cell py-8 text-center text-gray-500">No payment history found.</td>
                  </tr>
                ) : (
                  currentItems.map(payment => (
                    <tr key={payment.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-gray-800 md:border-b md:border-t-0 md:border-x-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-gray-800/20 transition-colors relative">
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Date</span>
                        <span className="text-sm text-gray-300">{new Date(payment.payment_date).toLocaleString()}</span>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Customer</span>
                        <div className="font-medium text-white">{payment.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{payment.user?.email || 'N/A'}</div>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Service & Quote</span>
                        <div className="font-bold text-gray-300">{payment.service?.service_name || 'N/A'}</div>
                        <div className="text-xs text-blue-400 font-mono">Q: {payment.quote?.quote_number || 'N/A'}</div>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Amount</span>
                        <div className="font-bold text-white">₹{parseFloat(payment.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4 font-mono text-sm text-blue-300">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Transaction Ref</span>
                        {payment.transaction_reference}
                      </td>
                      <td className="block md:table-cell px-2 md:px-6 py-2 md:py-4">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Status</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border inline-block ${
                          payment.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          payment.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                          {payment.status.toUpperCase()}
                        </span>
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

export default AdminPaymentsPage;
