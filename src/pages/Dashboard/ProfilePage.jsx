import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import DocumentCenterTab from '../../components/dashboard/DocumentCenterTab';
import NotificationsTab from '../../components/dashboard/NotificationsTab';

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    // Personal
    name: '', phone: '', alternate_mobile: '', designation: '', email: '',
    // Business
    company: '', business_type: '', gst_number: '', website: '', industry: '',
    // Address
    address_line1: '', address_line2: '', city: '', state: '', country: '', pin_code: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        alternate_mobile: user.alternate_mobile || '',
        designation: user.designation || '',
        email: user.email || '',
        company: user.company || '',
        business_type: user.business_type || '',
        gst_number: user.gst_number || '',
        website: user.website || '',
        industry: user.industry || '',
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        pin_code: user.pin_code || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await updateProfile(formData);
      setSaveMessage('Profile updated successfully.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'business', label: 'Business Information' },
    { id: 'address', label: 'Address Details' },
    { id: 'documents', label: 'Compliance Documents' },
    { id: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Customer Portal</h1>
            <p className="mt-1 text-slate-400">Manage your infrastructure, account details, and compliance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-secondary/10 border-secondary/50 text-secondary border'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="md:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm"
            >
              {saveMessage && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${saveMessage.includes('Failed') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {saveMessage}
                </div>
              )}

              <div className="space-y-6">
                {activeTab === 'personal' && (
                  <>
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={formData.email} disabled className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-500 cursor-not-allowed opacity-70" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Alternate Mobile</label>
                        <input type="tel" name="alternate_mobile" value={formData.alternate_mobile} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Designation / Role</label>
                        <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" placeholder="e.g. IT Director, Systems Administrator" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'business' && (
                  <>
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Business Type</label>
                        <select name="business_type" value={formData.business_type} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors">
                          <option value="">Select Type</option>
                          <option value="Private Limited">Private Limited</option>
                          <option value="Public Limited">Public Limited</option>
                          <option value="LLP">LLP</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Proprietorship">Proprietorship</option>
                          <option value="Individual/Freelancer">Individual / Freelancer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">GST Number</label>
                        <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" placeholder="e.g. 22AAAAA0000A1Z5" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
                        <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" placeholder="e.g. IT, Finance, Healthcare" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'address' && (
                  <>
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Address Line 1</label>
                        <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Address Line 2</label>
                        <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">PIN / ZIP Code</label>
                        <input type="text" name="pin_code" value={formData.pin_code} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'documents' && <DocumentCenterTab />}
                {activeTab === 'notifications' && <NotificationsTab />}

                {['personal', 'business', 'address'].includes(activeTab) && (
                  <div className="pt-6 border-t border-slate-800 mt-8 flex justify-end">
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-secondary hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors shadow-lg shadow-secondary/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
