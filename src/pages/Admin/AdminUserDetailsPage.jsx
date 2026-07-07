import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserById, updateUserStatus, deleteUser } from '../../services/adminApi';

const AdminUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        if (res.success) {
          setUser(res.data);
        } else {
          navigate('/admin/users');
        }
      } catch (error) {
        console.error(error);
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateUserStatus(id, newStatus);
      if (res.success) {
        setUser({ ...user, status: newStatus });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await deleteUser(id);
        if (res.success) {
          navigate('/admin/users');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/users" className="w-10 h-10 rounded-xl bg-[#0a1128] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary/50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {user.name}
              {user.kyc_verification_status === 'verified' && (
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </h1>
            <p className="text-gray-400 text-sm">{user.email} • Account #{user.id.toString().padStart(4, '0')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={user.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`text-sm font-bold px-4 py-2 rounded-lg outline-none cursor-pointer border ${
              user.status === 'active' ? 'bg-secondary/10 text-secondary border-secondary/20' :
              user.status === 'suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}
          >
            <option value="active" className="bg-[#020817] text-white">Active</option>
            <option value="inactive" className="bg-[#020817] text-white">Inactive</option>
            <option value="suspended" className="bg-[#020817] text-white">Suspended</option>
          </select>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium text-sm"
          >
            Delete User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Essential CRM Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-1 space-y-6"
        >
          {/* Identity & Contact Card */}
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Identity & Contact</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500 mb-1">Mobile Number</span>
                <span className="text-white font-medium">{user.phone || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Alternate Mobile</span>
                <span className="text-white font-medium">{user.alternate_mobile || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Designation</span>
                <span className="text-white font-medium">{user.designation || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Joined Date</span>
                <span className="text-white font-medium">{new Date(user.createdAt || user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Business Info Card */}
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Business Details</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500 mb-1">Company Name</span>
                <span className="text-white font-medium">{user.company || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Business Type</span>
                <span className="text-white font-medium">{user.business_type || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">GST Number</span>
                <span className="text-white font-medium">{user.gst_number || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Industry</span>
                <span className="text-white font-medium">{user.industry || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Website</span>
                <span className="text-blue-400 hover:underline font-medium">{user.website ? <a href={user.website} target="_blank" rel="noreferrer">{user.website}</a> : '—'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Address, KYC, Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service & KYC Summary Card */}
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Service Interests & KYC</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Interested In</span>
                  <span className="text-secondary font-bold">{user.service_requirement_type || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Expected Deployment</span>
                  <span className="text-white font-medium">{user.expected_deployment_date || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Budget Range</span>
                  <span className="text-white font-medium">{user.monthly_budget_range || '—'}</span>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Location & Address</h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Address Line 1</span>
                  <span className="text-white font-medium">{user.address_line1 || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Address Line 2</span>
                  <span className="text-white font-medium">{user.address_line2 || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">City</span>
                    <span className="text-white font-medium">{user.city || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">State</span>
                    <span className="text-white font-medium">{user.state || '—'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Country</span>
                    <span className="text-white font-medium">{user.country || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">PIN / Zip Code</span>
                    <span className="text-white font-medium">{user.pin_code || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Request History Card */}
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sales Request History</h3>
            </div>
            
            <div className="divide-y divide-gray-800 max-h-[400px] overflow-y-auto custom-scrollbar">
              {user.enquiries && user.enquiries.length > 0 ? (
                user.enquiries.map(enq => (
                  <div key={enq.id} className="p-6 hover:bg-white/[0.02] transition-colors flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-white">{enq.type.replace('_', ' ').toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          enq.status === 'New' ? 'bg-blue-500/20 text-blue-400' :
                          enq.status === 'Reviewing' || enq.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          enq.status === 'Quote Generated' || enq.status === 'Responded' || enq.status === 'Quoted' ? 'bg-cyan-500/20 text-cyan-400' :
                          enq.status === 'Waiting Customer Approval' || enq.status === 'Verification Pending' ? 'bg-orange-500/20 text-orange-400' :
                          enq.status === 'Approved' || enq.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' :
                          enq.status === 'Invoice Generated' || enq.status === 'Payment Pending' ? 'bg-purple-500/20 text-purple-400' :
                          enq.status === 'Payment Received' || enq.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                          enq.status === 'Provisioning' || enq.status === 'Active' ? 'bg-indigo-500/20 text-indigo-400' :
                          enq.status === 'Completed' ? 'bg-secondary/20 text-secondary' :
                          enq.status === 'Closed' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(enq.created_at).toLocaleString()}
                      </div>
                    </div>
                    <Link to={`/admin/enquiries/${enq.id}`} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors">
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  This user hasn't made any sales requests yet.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
