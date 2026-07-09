import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminAiServers, createAiServer, updateAiServer, deleteAiServer } from '../../services/adminApi';

const AdminAiSettingsPage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });

  const [isEditing, setIsEditing] = useState(null); // null means creating new, string ID means editing
  
  const [formData, setFormData] = useState({
    name: 'AI Compute Pro 5060 Ti',
    monthly_price: 35000,
    cpu: 'Intel Core Ultra i7',
    ram: '64GB DDR5',
    storage: '2 × 2TB NVMe SSD',
    gpu: 'RTX 5060 Ti 16GB',
    network: '10 Gbps Port',
    support: '24/7 Technical Support',
    is_active: true
  });

  const fetchServers = async () => {
    try {
      setLoading(true);
      const data = await getAdminAiServers();
      setServers(data);
    } catch (err) {
      console.error('Failed to fetch AI servers:', err);
      setError('Failed to load servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleEdit = (server) => {
    setIsEditing(server.id);
    setFormData({
      name: server.name,
      monthly_price: server.monthly_price,
      cpu: server.cpu,
      ram: server.ram,
      storage: server.storage,
      gpu: server.gpu,
      network: server.network,
      support: server.support,
      is_active: server.is_active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      name: '',
      monthly_price: 0,
      cpu: '',
      ram: '',
      storage: '',
      gpu: '',
      network: '',
      support: '',
      is_active: true
    });
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        await updateAiServer(isEditing, formData);
        setSuccess(`Successfully updated: ${formData.name}`);
      } else {
        await createAiServer(formData);
        setSuccess(`Successfully created: ${formData.name}`);
      }
      handleCancel();
      fetchServers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const handleDelete = async () => {
    const { id, name } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, id: null, name: '' });
    
    try {
      await deleteAiServer(id);
      setSuccess(`${name} deleted successfully.`);
      fetchServers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete server');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">AI Server Models</h1>
        <p className="text-gray-400">Add, edit, and manage multiple AI Server configurations.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-secondary/10 border border-secondary/50 text-secondary p-4 rounded-xl text-sm mb-6">
          {success}
        </div>
      )}

      {/* Editor Form */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          {isEditing ? `Edit AI Server` : 'Add New AI Server'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Server Name</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. AI Compute Pro 5060 Ti"
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Monthly Price (₹)</label>
              <input 
                type="number"
                name="monthly_price"
                value={formData.monthly_price}
                onChange={handleChange}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Processor (CPU)</label>
              <input 
                type="text"
                name="cpu"
                value={formData.cpu}
                onChange={handleChange}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Memory (RAM)</label>
              <input 
                type="text"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Storage (SSD)</label>
              <input 
                type="text"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Graphics Card (GPU)</label>
              <input 
                type="text"
                name="gpu"
                value={formData.gpu}
                onChange={handleChange}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Network</label>
              <input 
                type="text"
                name="network"
                value={formData.network}
                onChange={handleChange}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Support</label>
              <input 
                type="text"
                name="support"
                value={formData.support}
                onChange={handleChange}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input 
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 accent-emerald-500"
              />
              <label htmlFor="is_active" className="text-white font-medium">Server is Active (Visible on public page)</label>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Add Server'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Servers List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">Existing AI Servers</h3>
        
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : servers.length === 0 ? (
          <div className="text-gray-400">No servers found. Add one above!</div>
        ) : (
          <div className="overflow-x-auto md:overflow-visible">
            <table className="w-full text-left text-sm text-gray-400 block md:table min-w-full md:min-w-full">
              <thead className="text-xs text-gray-500 uppercase bg-[#020817] border-b border-gray-800 hidden md:table-header-group">
                <tr>
                  <th className="px-4 py-3">Server Name</th>
                  <th className="px-4 py-3">GPU</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {servers.map(server => (
                  <tr key={server.id} className="block md:table-row border border-gray-800 md:border-b md:border-t-0 md:border-x-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-[#020817]/50 relative">
                    <td className="block md:table-cell px-2 md:px-4 py-2 md:py-3 font-bold text-white">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Server Name</span>
                      {server.name}
                    </td>
                    <td className="block md:table-cell px-2 md:px-4 py-2 md:py-3">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">GPU</span>
                      {server.gpu}
                    </td>
                    <td className="block md:table-cell px-2 md:px-4 py-2 md:py-3">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Price</span>
                      ₹{server.monthly_price.toLocaleString()}
                    </td>
                    <td className="block md:table-cell px-2 md:px-4 py-2 md:py-3">
                      <span className="md:hidden text-xs text-gray-500 uppercase font-semibold block mb-1">Status</span>
                      {server.is_active ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium inline-block">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-medium inline-block">Inactive</span>
                      )}
                    </td>
                    <td className="block md:table-cell px-2 md:px-4 py-3 md:py-3 md:text-right border-t border-gray-800 md:border-none mt-3 md:mt-0 space-x-3 text-right">
                      <button 
                        onClick={() => handleEdit(server)}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => confirmDelete(server.id, server.name)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a1128] border border-gray-700 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full relative"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete AI Server</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
                  className="px-6 py-2.5 font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/20"
                >
                  Delete Server
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminAiSettingsPage;
