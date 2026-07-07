import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getUsers, getEnquiries, getQuotes, getAdminKycVerifications, getAdminPayments, getAdminServices, getAdminDashboardStats } from '../../services/adminApi';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnquiries: 0,
    quoteRequests: 0,
    aiRequests: 0,
    enterpriseRequests: 0,
    pendingQuotes: 0,
    pendingKyc: 0,
    pendingPayments: 0,
    provisioningQueue: 0,
    recentlyActivated: 0,
    rejectedVerifications: 0,
    // Infrastructure Health
    totalActiveServers: 0,
    suspendedServers: 0,
    inGracePeriod: 0,
    renewalsDue: 0,
    todaysRevenue: 0,
    monthlyRevenue: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, enquiriesRes, quotesRes, kycRes, paymentsRes, servicesRes, dbStatsRes] = await Promise.all([
          getUsers(),
          getEnquiries(),
          getQuotes(),
          getAdminKycVerifications(),
          getAdminPayments(),
          getAdminServices(),
          getAdminDashboardStats()
        ]);

        if (usersRes.success && enquiriesRes.success) {
          const users = usersRes.data;
          const enquiries = enquiriesRes.data;
          const quotes = quotesRes.success ? quotesRes.data : [];
          const kyc = kycRes.success ? kycRes.data : [];
          const payments = paymentsRes.success ? paymentsRes.data : [];
          const services = servicesRes.success ? servicesRes.data : [];
          const dbStats = dbStatsRes.success ? dbStatsRes.data : {};

          setStats({
            totalUsers: users.length,
            totalEnquiries: enquiries.length,
            quoteRequests: enquiries.filter(e => e.type === 'quote').length,
            aiRequests: enquiries.filter(e => e.type === 'ai_server').length,
            enterpriseRequests: enquiries.filter(e => e.type === 'enterprise_server').length,
            pendingQuotes: quotes.filter(q => q.status === 'pending').length,
            pendingKyc: kyc.filter(k => k.overall_status === 'pending' || k.overall_status === 'under_review').length,
            pendingPayments: dbStats.pendingPayments || payments.filter(p => p.status === 'pending').length,
            provisioningQueue: services.filter(s => s.status === 'Pending' || s.status === 'Provisioning').length,
            recentlyActivated: services.filter(s => s.status === 'Active').length,
            rejectedVerifications: kyc.filter(k => k.overall_status === 'rejected' || k.overall_status === 'failed').length,
            totalActiveServers: dbStats.totalActiveServers || 0,
            suspendedServers: dbStats.suspendedServers || 0,
            inGracePeriod: dbStats.inGracePeriod || 0,
            renewalsDue: dbStats.renewalsDue || 0,
            todaysRevenue: dbStats.todaysRevenue || 0,
            monthlyRevenue: dbStats.monthlyRevenue || 0
          });

          // Top 5 recent enquiries
          setRecentEnquiries(enquiries.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Pending Quotes', value: stats.pendingQuotes, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Pending KYC', value: stats.pendingKyc, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Pending Payments', value: stats.pendingPayments, icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Active Servers', value: stats.totalActiveServers, icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    { title: 'Suspended Servers', value: stats.suspendedServers, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
    { title: 'In Grace Period', value: stats.inGracePeriod, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Renewals Due (7d)', value: stats.renewalsDue, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#020817] border border-gray-800 flex items-center justify-center text-secondary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-400 font-medium text-sm mb-1">{stat.title}</h3>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Recent Sales Requests</h2>
          <Link to="/admin/enquiries" className="text-sm font-medium text-secondary hover:text-secondary">View All</Link>
        </div>
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left border-collapse block md:table min-w-full md:min-w-[800px]">
            <thead className="hidden md:table-header-group">
              <tr className="bg-[#020817] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Service Type</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group text-sm">
              {recentEnquiries.map((enq) => (
                <tr key={enq.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-gray-800 md:border-b md:border-x-0 md:border-t-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-white/[0.02] transition-colors relative">
                  <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 font-medium text-white">
                    <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Customer Name</span>
                    {enq.name}
                  </td>
                  <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                    <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Service Type</span>
                    <span className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                      {enq.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-gray-400">
                    <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Email</span>
                    {enq.email}
                  </td>
                  <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-gray-400">
                    <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Date</span>
                    {new Date(enq.created_at).toLocaleDateString()}
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
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        enq.status === 'New' ? 'bg-blue-500' :
                        enq.status === 'Reviewing' || enq.status === 'In Progress' ? 'bg-yellow-500' :
                        enq.status === 'Quote Generated' || enq.status === 'Responded' || enq.status === 'Quoted' ? 'bg-cyan-500' :
                        enq.status === 'Waiting Customer Approval' || enq.status === 'Verification Pending' ? 'bg-orange-500' :
                        enq.status === 'Approved' || enq.status === 'Verified' ? 'bg-emerald-500' :
                        enq.status === 'Invoice Generated' || enq.status === 'Payment Pending' ? 'bg-purple-500' :
                        enq.status === 'Payment Received' || enq.status === 'Paid' ? 'bg-green-500' :
                        enq.status === 'Provisioning' || enq.status === 'Active' ? 'bg-indigo-500' :
                        enq.status === 'Completed' ? 'bg-secondary' :
                        'bg-gray-500'
                      }`}></span>
                      {enq.status}
                    </span>
                  </td>
                  <td className="block md:table-cell py-3 md:py-4 px-2 md:px-6 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0">
                    <Link to={`/admin/enquiries/${enq.id}`} className="inline-block px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary md:bg-transparent md:hover:bg-transparent md:p-0 font-medium text-sm rounded-lg transition-colors">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {recentEnquiries.length === 0 && (
                <tr className="block md:table-row">
                  <td colSpan="6" className="block md:table-cell py-8 text-center text-gray-500">
                    No recent enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
