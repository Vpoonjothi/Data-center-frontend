import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import { updateAdminPassword } from '../../services/adminApi';

const AdminSettingsPage = () => {
  const { admin } = useContext(AdminAuthContext);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError('Please fill in all fields.');
    }
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }
    if (newPassword.length < 8) {
      return setError('New password must be at least 8 characters long.');
    }

    try {
      setIsLoading(true);
      const res = await updateAdminPassword(currentPassword, newPassword);
      if (res.success) {
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-gray-400">Manage your account preferences.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-800">
          <div className="w-20 h-20 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-3xl border border-secondary/30 shadow-lg shadow-secondary/10">
            {admin?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{admin?.name || 'Administrator'}</h2>
            <p className="text-gray-400 mb-2">{admin?.email}</p>
            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold uppercase tracking-wider border border-secondary/20">
              {admin?.role || 'Admin'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">Security</h3>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-secondary/10 border border-secondary/50 text-secondary p-4 rounded-xl text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showCurrent ? (
                    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showNew ? (
                    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirm ? (
                    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-3 bg-accent hover:bg-secondary text-white rounded-xl font-bold transition-colors shadow-lg shadow-secondary/25 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminSettingsPage;
