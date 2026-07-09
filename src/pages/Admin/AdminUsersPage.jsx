import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser, updateUserStatus } from '../../services/adminApi';
import ConfirmModal from '../../components/common/ConfirmModal';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setIsFilterOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await updateUserStatus(userId, newStatus);
      if (res.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const res = await deleteUser(userToDelete);
        if (res.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Users Management</h1>
          <p className="text-gray-400">View and manage registered customers.</p>
        </div>
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-visible">
        <div className="p-4 border-b border-gray-800 bg-[#020817]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div className="w-full sm:w-40 relative custom-dropdown-container">
            <button
              onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); setOpenMenuId(null); }}
              className="w-full flex items-center justify-between bg-[#020817] border border-gray-800 text-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none hover:border-gray-700 transition-colors cursor-pointer"
            >
              <span>{statusFilter === 'all' ? 'All Statuses' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="absolute right-0 z-30 mt-2 w-full min-w-[140px] bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2"
                >
                  {['all', 'active', 'suspended', 'inactive'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${statusFilter === status ? 'text-secondary font-medium bg-secondary/10' : 'text-gray-300'}`}
                    >
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="overflow-visible">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse block md:table min-w-full md:min-w-[800px]">
              <thead className="hidden md:table-header-group">
                <tr className="bg-[#020817] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email / Phone</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Registration Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="block md:table-row bg-[#020817] md:bg-transparent border border-gray-800 md:border-b md:border-x-0 md:border-t-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-white/[0.02] transition-colors relative">
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 font-medium text-white">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Name</span>
                      {user.name}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Email / Phone</span>
                      <div className="text-gray-300">{user.email}</div>
                      <div className="text-gray-500 text-xs">{user.phone || 'N/A'}</div>
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-gray-400">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Company</span>
                      {user.company || 'N/A'}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6 text-gray-400">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Registration Date</span>
                      {new Date(user.createdAt || user.created_at).toLocaleDateString()}
                    </td>
                    <td className="block md:table-cell py-2 md:py-4 px-2 md:px-6">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Status</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          type="button"
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.status === 'active' ? 'bg-emerald-500' : 'bg-gray-700'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${user.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-xs font-bold ${user.status === 'active' ? 'text-emerald-400' : user.status === 'suspended' ? 'text-red-400' : 'text-gray-400'}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="block md:table-cell py-3 md:py-4 px-2 md:px-6 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0">
                      <div className="flex items-center justify-between md:justify-end w-full">
                        <span className="md:hidden text-xs text-gray-500 uppercase font-semibold">Actions</span>
                        <div className="relative inline-block text-left">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {openMenuId === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-2 w-36 bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl z-20 py-1 overflow-hidden"
                            >
                              <Link to={`/admin/users/${user.id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors w-full text-left">
                                <Eye className="w-4 h-4" /> View
                              </Link>
                              <button onClick={() => { openDeleteModal(user.id); setOpenMenuId(null); }} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left">
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr className="block md:table-row">
                    <td colSpan="6" className="block md:table-cell py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will permanently remove their data from the system."
        confirmText="Delete User"
        isDanger={true}
      />
    </div>
  );
};

export default AdminUsersPage;
