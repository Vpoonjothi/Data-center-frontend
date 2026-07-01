import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getUsers, getEnquiries, getQuotes, getAdminKycVerifications, getAdminPayments, getAdminServices } from '../../services/adminApi';

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
    expiringServices: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, enquiriesRes, quotesRes, kycRes, paymentsRes, servicesRes] = await Promise.all([
          getUsers(),
          getEnquiries(),
          getQuotes(),
          getAdminKycVerifications(),
          getAdminPayments(),
          getAdminServices()
        ]);

        if (usersRes.success && enquiriesRes.success) {
          const users = usersRes.data;
          const enquiries = enquiriesRes.data;
          const quotes = quotesRes.success ? quotesRes.data : [];
          const kyc = kycRes.success ? kycRes.data : [];
          const payments = paymentsRes.success ? paymentsRes.data : [];
          const services = servicesRes.success ? servicesRes.data : [];

          setStats({
            totalUsers: users.length,
            totalEnquiries: enquiries.length,
            quoteRequests: enquiries.filter(e => e.type === 'quote').length,
            aiRequests: enquiries.filter(e => e.type === 'ai_server').length,
            enterpriseRequests: enquiries.filter(e => e.type === 'enterprise_server').length,
            pendingQuotes: quotes.filter(q => q.status === 'pending').length,
            pendingKyc: kyc.filter(k => k.overall_status === 'pending' || k.overall_status === 'under_review').length,
            pendingPayments: payments.filter(p => p.status === 'pending').length,
            provisioningQueue: services.filter(s => s.status === 'Pending' || s.status === 'Provisioning').length,
            recentlyActivated: services.filter(s => s.status === 'Active').length, // Should filter by date, but this is a proxy
            rejectedVerifications: kyc.filter(k => k.overall_status === 'rejected' || k.overall_status === 'failed').length,
            expiringServices: services.filter(s => {
              if (s.status !== 'Active' || !s.renewal_date) return false;
              const daysUntilRenewal = (new Date(s.renewal_date) - new Date()) / (1000 * 60 * 60 * 24);
              return daysUntilRenewal <= 30 && daysUntilRenewal >= 0;
            }).length
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
    { title: 'Total Enquiries', value: stats.totalEnquiries, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { title: 'Pending Quotes', value: stats.pendingQuotes, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Pending KYC', value: stats.pendingKyc, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Pending Payments', value: stats.pendingPayments, icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { title: 'Provisioning Queue', value: stats.provisioningQueue, icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    { title: 'Recently Activated', value: stats.recentlyActivated, icon: 'M5 13l4 4L19 7' },
    { title: 'Rejected Verifications', value: stats.rejectedVerifications, icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
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
          <h2 className="text-lg font-bold text-white">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm font-medium text-secondary hover:text-secondary">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#020817] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Service Type</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {recentEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-white">{enq.name}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {enq.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{enq.email}</td>
                  <td className="py-4 px-6 text-gray-400">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      enq.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      enq.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      enq.status === 'Responded' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        enq.status === 'New' ? 'bg-blue-500' :
                        enq.status === 'In Progress' ? 'bg-yellow-500' :
                        enq.status === 'Responded' ? 'bg-secondary' :
                        'bg-gray-500'
                      }`}></span>
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link to={`/admin/enquiries/${enq.id}`} className="text-secondary hover:text-secondary font-medium text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {recentEnquiries.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
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
