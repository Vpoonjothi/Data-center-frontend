import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateContentBlock, createContentBlock } from '../../services/adminApi';
import { getContentBlocks } from '../../services/api';

const AdminColocationSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [blocks, setBlocks] = useState({});

  const [formData, setFormData] = useState({
    rackUPrice: '500',
    staticIpPrice: '1000'
  });

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await getContentBlocks();
      setBlocks(data);
      
      setFormData({
        rackUPrice: data['Colocation Rack Price Per U']?.value || '500',
        staticIpPrice: data['Colocation Static IP Price']?.value || '1000'
      });
    } catch (err) {
      console.error('Failed to fetch colocation specs:', err);
      setError('Failed to load current pricing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updates = [
        { key: 'Colocation Rack Price Per U', value: formData.rackUPrice },
        { key: 'Colocation Static IP Price', value: formData.staticIpPrice }
      ];

      for (const update of updates) {
        const block = blocks[update.key];
        if (block && block.id) {
          await updateContentBlock(block.id, { key: update.key, type: 'text', value: update.value });
        } else {
          // Create it if it doesn't exist yet
          await createContentBlock({ key: update.key, type: 'text', value: update.value });
        }
      }

      setSuccess('Colocation pricing updated successfully!');
      setTimeout(() => setSuccess(null), 4000);
      fetchContent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update pricing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Colocation Settings</h1>
        <p className="text-gray-400">Manage the base pricing for Data Center Colocation.</p>
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

      {loading ? (
        <div className="text-gray-400">Loading pricing data...</div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Rack Unit Price (₹ per U)</label>
                <input 
                  type="number"
                  name="rackUPrice"
                  value={formData.rackUPrice}
                  onChange={handleChange}
                  className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Static IP Price (₹)</label>
                <input 
                  type="number"
                  name="staticIpPrice"
                  value={formData.staticIpPrice}
                  onChange={handleChange}
                  className="w-full bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-800 mt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Colocation Pricing'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AdminColocationSettingsPage;
