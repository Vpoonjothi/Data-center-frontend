import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdmins, createAdmin, deleteAdmin, updateAdminAccount } from '../../services/adminApi';
import { AdminAuthContext } from '../../context/AdminAuthContext';

const SuperAdminPanel = () => {
  const { admin } = useContext(AdminAuthContext);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAdmins();
      if (res.success) {
        setAdmins(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const res = await createAdmin(newAdmin);
      if (res.success) {
        setAdmins([...admins, res.data]);
        setShowModal(false);
        setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsEditing(true);
      setError(null);
      const dataToUpdate = {
        name: editAdmin.name,
        email: editAdmin.email,
        role: editAdmin.role,
      };
      if (editAdmin.password) {
        dataToUpdate.password = editAdmin.password;
      }
      
      const res = await updateAdminAccount(editAdmin.id, dataToUpdate);
      if (res.success) {
        setAdmins(admins.map(a => a.id === editAdmin.id ? res.data : a));
        setShowEditModal(false);
        setEditAdmin(null);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin');
    } finally {
      setIsEditing(false);
    }
  };

  const openEditModal = (adminToEdit) => {
    setEditAdmin({ ...adminToEdit, password: '' });
    setShowEditModal(true);
  };

  const handleDelete = async (id, email) => {
    if (admin.id === id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (email === 'admin@greenleaf.com') {
      alert("You cannot delete the default superadmin.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        const res = await deleteAdmin(id);
        if (res.success) {
          setAdmins(admins.filter(a => a.id !== id));
        } else {
          alert(res.message);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete admin');
      }
    }
  };

  if (admin?.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl text-center">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You need Superadmin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-[#0a1128] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Superadmin Panel</h1>
          <p className="text-sm text-gray-400">Manage administrator accounts and privileges.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-secondary hover:bg-secondary/90 text-[#020817] px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg shadow-secondary/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="bg-[#0a1128] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-900/50 border-b border-gray-800">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y md:divide-y divide-gray-800">
              {loading ? (
                <tr className="block md:table-row">
                  <td colSpan="5" className="block md:table-cell p-8 text-center text-gray-500">Loading admins...</td>
                </tr>
              ) : admins.length === 0 ? (
                <tr className="block md:table-row">
                  <td colSpan="5" className="block md:table-cell p-8 text-center text-gray-500">No admins found.</td>
                </tr>
              ) : (
                admins.map((user) => (
                  <tr key={user.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-gray-800 md:border-b md:border-t-0 md:border-x-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-gray-800/30 transition-colors relative">
                    <td className="block md:table-cell p-2 md:p-4 text-sm text-gray-400">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">ID</span>
                      {user.id}
                    </td>
                    <td className="block md:table-cell p-2 md:p-4 text-sm font-medium text-white">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Name</span>
                      {user.name}
                    </td>
                    <td className="block md:table-cell p-2 md:p-4 text-sm text-gray-400">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Email</span>
                      {user.email}
                    </td>
                    <td className="block md:table-cell p-2 md:p-4 text-sm">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Role</span>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.role === 'superadmin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="block md:table-cell p-2 md:p-4 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0">
                      {user.email !== 'admin@greenleaf.com' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded transition-colors"
                            title="Edit Admin"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {user.id !== admin.id && (
                            <button
                              onClick={() => handleDelete(user.id, user.email)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded transition-colors"
                              title="Delete Admin"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a1128] border border-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Add New Admin</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input 
                    type="text" required
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input 
                    type="email" required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required minLength="6"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 pr-12 text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 rounded-lg bg-secondary text-[#020817] font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Admin Modal */}
      <AnimatePresence>
        {showEditModal && editAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a1128] border border-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit Admin</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input 
                    type="text" required
                    value={editAdmin.name}
                    onChange={(e) => setEditAdmin({...editAdmin, name: e.target.value})}
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input 
                    type="email" required
                    value={editAdmin.email}
                    onChange={(e) => setEditAdmin({...editAdmin, email: e.target.value})}
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">New Password (Optional)</label>
                  <div className="relative">
                    <input 
                      type={showEditPassword ? "text" : "password"} minLength="6"
                      value={editAdmin.password}
                      placeholder="Leave blank to keep unchanged"
                      onChange={(e) => setEditAdmin({...editAdmin, password: e.target.value})}
                      className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 pr-12 text-white focus:outline-none focus:border-secondary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showEditPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                  <select
                    value={editAdmin.role}
                    onChange={(e) => setEditAdmin({...editAdmin, role: e.target.value})}
                    disabled={editAdmin.id === admin.id}
                    className="w-full bg-[#020817] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isEditing} className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
                    {isEditing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminPanel;
