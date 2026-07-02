import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createContentBlock, updateContentBlock, deleteContentBlock } from '../../services/adminApi';
import { getContentBlocks } from '../../services/api';

const AdminContentPage = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [isEditing, setIsEditing] = useState(null); // null means creating new, string ID means editing
  const [formData, setFormData] = useState({ key: '', type: 'text', value: '' });

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await getContentBlocks();
      // data is an object map, convert to array for list view
      setContentList(Object.values(data));
    } catch (err) {
      console.error('Failed to fetch content blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleEdit = (block) => {
    setIsEditing(block.id);
    setFormData({ key: block.key, type: block.type, value: block.value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({ key: '', type: 'text', value: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.key || !formData.value) {
      return setError('Key and Value are required.');
    }

    try {
      if (isEditing) {
        await updateContentBlock(isEditing, formData);
        setSuccess(`Successfully updated block: ${formData.key}`);
      } else {
        await createContentBlock(formData);
        setSuccess(`Successfully created block: ${formData.key}`);
      }
      handleCancel();
      fetchContent();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content block? This may break the frontend if it is still being referenced.')) {
      return;
    }

    try {
      await deleteContentBlock(id);
      setSuccess('Block deleted successfully.');
      fetchContent();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete block');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Website Content Management</h1>
        <p className="text-gray-400">Easily update the text, prices, and images across your website.</p>
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
          {isEditing ? `Edit Content` : 'Add New Content'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Content Identifier (Where it appears)</label>
              <input 
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="page.section.element"
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Content Format</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
              >
                <option value="text">Simple Text</option>
                <option value="html">Advanced Text (HTML)</option>
                <option value="image_url">Image Link</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">The actual text or link to display</label>
            <textarea 
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              rows={4}
              placeholder="The actual content to display..."
              className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Add Content'}
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

      {/* Content List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">Existing Content</h3>
        
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : contentList.length === 0 ? (
          <div className="text-gray-400">No content found. Add one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs text-gray-500 uppercase bg-[#020817] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Identifier</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Preview Text/Link</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contentList.map(block => (
                  <tr key={block.id} className="border-b border-gray-800/50 hover:bg-[#020817]/50">
                    <td className="px-4 py-3 font-mono text-white">{block.key}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-800 rounded text-xs">{block.type}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {block.value}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button 
                        onClick={() => handleEdit(block)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(block.id)}
                        className="text-red-400 hover:text-red-300"
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
    </div>
  );
};

export default AdminContentPage;
