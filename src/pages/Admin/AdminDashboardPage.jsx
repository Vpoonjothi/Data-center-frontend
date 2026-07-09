import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, getEnquiries, getQuotes, getAdminKycVerifications, getAdminPayments, getAdminServices, getAdminDashboardStats } from '../../services/adminApi';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
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
    { title: 'Total Users', value: stats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', trend: 'up', trendValue: '12%', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', link: '/admin/users' },
    { title: 'Pending Quotes', value: stats.pendingQuotes, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', trend: 'up', trendValue: '5%', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Pending KYC', value: stats.pendingKyc, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', trend: 'down', trendValue: '2%', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Pending Payments', value: stats.pendingPayments, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', trend: 'up', trendValue: '8%', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Active Servers', value: stats.totalActiveServers, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', trend: 'up', trendValue: '15%', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    { title: 'Suspended Servers', value: stats.suspendedServers, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', trend: 'down', trendValue: '1%', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
    { title: 'In Grace Period', value: stats.inGracePeriod, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', trend: 'up', trendValue: '3%', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Renewals Due (7d)', value: stats.renewalsDue, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', trend: 'up', trendValue: '10%', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
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
            onClick={() => stat.link && navigate(stat.link)}
            className={`bg-[#0a1128]/80 backdrop-blur-xl border ${stat.border} rounded-3xl p-6 relative overflow-hidden group shadow-lg transition-all duration-300 ${stat.link ? 'cursor-pointer hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]' : ''}`}
          >
            {/* Subtle Gradient Background */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-current ${stat.color}`}></div>
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${stat.bg}`}></div>
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-300 ${stat.bg} ${stat.color} ${stat.border}`}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              
              {stat.trend === 'up' ? (
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-bold">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  </svg>
                  {stat.trendValue}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-full text-xs font-bold">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7 7" />
                  </svg>
                  {stat.trendValue}
                </div>
              )}
            </div>
            
            <div className="relative z-10">
              <h3 className="text-gray-400 font-semibold text-sm mb-2 tracking-wide uppercase">{stat.title}</h3>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold text-white tracking-tight">{stat.value}</span>
              </div>
            </div>
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
