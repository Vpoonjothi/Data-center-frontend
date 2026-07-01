import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminKycVerifications } from '../../services/adminApi';

const AdminVerificationsPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const res = await getAdminKycVerifications();
      setVerifications(res.data || []);
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Identity Verifications</h1>
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#020817]/50 border-b border-gray-800">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quote ID</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aadhaar Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">PAN Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overall Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {verifications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">No verifications found.</td>
                  </tr>
                ) : (
                  verifications.map(ver => (
                    <tr key={ver.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{ver.user?.name}</div>
                        <div className="text-sm text-gray-500">{ver.user?.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-300">{ver.quote?.quote_number}</div>
                        <div className="text-xs text-gray-500">{ver.quote?.service_type}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-300">{new Date(ver.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${
                          ver.aadhaar_status === 'verified' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                          ver.aadhaar_status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {ver.aadhaar_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${
                          ver.pan_status === 'verified' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                          ver.pan_status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {ver.pan_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          ver.overall_status === 'verified' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                          ver.overall_status === 'partially_verified' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                          ver.overall_status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-gray-800 text-gray-300 border-gray-600'
                        }`}>
                          {ver.overall_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <Link to={`/admin/verifications/${ver.id}`} className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-lg font-medium text-sm transition-colors">
                          Review
                        </Link>
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

export default AdminVerificationsPage;
