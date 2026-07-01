import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/adminApi';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await deleteUser(id);
        if (res.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Users Management</h1>
          <p className="text-gray-400">View and manage registered customers.</p>
        </div>
      </div>

      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-[#020817]/50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
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
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#020817] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email / Phone</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Registration Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-medium text-white">{user.name}</td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300">{user.email}</div>
                      <div className="text-gray-500 text-xs">{user.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{user.company || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-400">
                      {new Date(user.createdAt || user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        user.status === 'active' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                        user.status === 'suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <Link to={`/admin/users/${user.id}`} className="text-secondary hover:text-secondary font-medium text-sm">
                        View
                      </Link>
                      <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300 font-medium text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
