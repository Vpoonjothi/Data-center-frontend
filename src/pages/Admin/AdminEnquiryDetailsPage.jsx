import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getEnquiryById, 
  updateEnquiryStatus, 
  addEnquiryResponse, 
  generateQuoteFromEnquiry,
  addEnquiryNote
} from '../../services/adminApi';
import BillingSummary from '../../components/common/BillingSummary';
import { calculateQuotePricing } from '../../utils/quotePricing';

const AdminEnquiryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Response Form State
  const [responseText, setResponseText] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Internal Notes State
  const [internalNote, setInternalNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Quote Generation State
  const [discount, setDiscount] = useState(0);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [generatingQuote, setGeneratingQuote] = useState(false);

  // Derived Pricing State
  const [baseMonthlyPrice, setBaseMonthlyPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Success/Error Messages
  const [notification, setNotification] = useState(null);
  
  // Custom Dropdown State
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-status-dropdown')) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchEnquiry = async () => {
    try {
      const res = await getEnquiryById(id);
      if (res.success) {
        setEnquiry(res.data);
      } else {
        navigate('/admin/enquiries');
      }
    } catch (error) {
      console.error(error);
      navigate('/admin/enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [id, navigate]);

  useEffect(() => {
    if (enquiry?.configuration_json) {
      const costStr = enquiry.configuration_json.estimated_monthly_cost || enquiry.configuration_json.monthly_price || '0';
      const numericCost = parseFloat(String(costStr).replace(/[^0-9.]/g, ''));
      if (!isNaN(numericCost)) {
        setBaseMonthlyPrice(numericCost);
      }
      
      const qtyStr = enquiry.configuration_json.quantity || '1';
      const numericQty = parseInt(qtyStr, 10);
      if (!isNaN(numericQty) && numericQty > 0) {
        setQuantity(numericQty);
      }
    }
  }, [enquiry]);

  // Derived Pricing Calculations
  const monthlyPrice = baseMonthlyPrice;
  const pricing = calculateQuotePricing(monthlyPrice, quantity, discount, 18);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateEnquiryStatus(id, newStatus);
      if (res.success) {
        showNotification(`Status updated to ${newStatus}`);
        fetchEnquiry();
      }
    } catch (error) {
      console.error(error);
      showNotification('Failed to update status', 'error');
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!responseText) return;
    
    setSubmitting(true);
    try {
      // Auto-generate subject for the customer email based on Enquiry Type
      const subject = `Update on your ${enquiry.type.replace('_', ' ').toUpperCase()} request (SR-${enquiry.id.toString().padStart(4, '0')})`;
      const res = await addEnquiryResponse(id, subject, responseText, false);
      if (res.success) {
        setResponseText('');
        showNotification('Response sent successfully');
        fetchEnquiry();
      }
    } catch (error) {
      console.error(error);
      showNotification('Failed to send response', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!internalNote) return;
    setAddingNote(true);
    try {
      const res = await addEnquiryNote(id, internalNote);
      if (res.success) {
        setInternalNote('');
        showNotification('Internal note added');
        fetchEnquiry();
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to add note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const handleGenerateQuote = async (e) => {
    e.preventDefault();
    if (baseMonthlyPrice <= 0) {
      showNotification('Cannot generate quote without a base monthly price.', 'error');
      return;
    }

    setGeneratingQuote(true);
    try {
      const payload = {
        unitPrice: pricing.unitPrice,
        quantity: pricing.quantity,
        discountAmount: pricing.discountAmount,
        billingCycle: 'Monthly',
        validityDays: 15,
        adminNotes: quoteNotes
      };
      const res = await generateQuoteFromEnquiry(id, payload);
      if (res.success) {
        setDiscount(0);
        setQuoteNotes('');
        showNotification('Quote generated successfully!');
        fetchEnquiry();
      } else {
        showNotification(res.message || 'Failed to generate quote', 'error');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to generate quote';
      showNotification(msg, 'error');
    } finally {
      setGeneratingQuote(false);
    }
  };

  const getStatusBadgeColors = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Reviewing':
      case 'In Progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Quote Generated':
      case 'Responded':
      case 'Quoted': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Waiting Customer Approval':
      case 'Verification Pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Approved':
      case 'Verified': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Invoice Generated':
      case 'Payment Pending': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Payment Received':
      case 'Paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Provisioning':
      case 'Active': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Completed': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Closed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020817]">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Sales Request not found.
      </div>
    );
  }

  // Combine initial message, responses, notes, and logs into a single timeline array
  const timeline = [
    {
      id: 'msg-0',
      type: 'customer',
      sender: enquiry.name,
      badge: 'Customer',
      text: enquiry.message || 'No additional notes provided.',
      timestamp: enquiry.created_at
    },
    ...(enquiry.responses || []).map(r => ({
      id: `resp-${r.id}`,
      type: 'admin',
      sender: r.admin?.name || 'System Admin',
      badge: 'Admin',
      text: r.response,
      timestamp: r.created_at
    })),
    ...(enquiry.notes || []).map(n => ({
      id: `note-${n.id}`,
      type: 'system',
      sender: n.admin?.name || 'System Admin',
      badge: 'Internal Note',
      text: n.note_text,
      timestamp: n.created_at
    })),
    ...(enquiry.logs || []).map(l => ({
      id: `log-${l.id}`,
      type: 'system',
      sender: 'System',
      badge: 'Activity',
      text: l.details,
      timestamp: l.created_at
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
              notification.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {notification.type === 'error' ? (
              <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-semibold text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK ACTIONS BAR */}
      <div className="sticky top-20 z-40 bg-[#0a1128]/95 backdrop-blur-md border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/enquiries" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>
          <button onClick={() => document.getElementById('generateQuoteSec')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Generate Quote</button>
          <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Generate Invoice</button>
          <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Assign Sales Exec</button>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
          <div className="relative custom-status-dropdown w-full sm:w-48">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 bg-[#020817] border border-gray-700 text-white rounded-lg px-4 py-2 text-sm font-medium focus:outline-none hover:border-gray-600 transition-colors cursor-pointer"
            >
              <span>{enquiry.status}</span>
              <svg className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {isStatusDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 sm:left-auto sm:right-0 z-50 mt-2 w-full sm:w-56 bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-2 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">CRM Workflow</div>
                  {['New', 'Reviewing', 'Quote Generated', 'Waiting Customer Approval', 'Approved', 'Invoice Generated', 'Payment Pending', 'Payment Received', 'Provisioning', 'Completed', 'Closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { handleStatusChange(status); setIsStatusDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${enquiry.status === status ? 'text-secondary font-medium bg-secondary/10' : 'text-gray-300'}`}
                    >
                      {status}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => handleStatusChange('Closed')} className="w-full sm:w-auto px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold transition-colors">
            Close Request
          </button>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">SR-{enquiry.id.toString().padStart(4, '0')}</h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${enquiry.request_action === 'DIRECT_ORDER' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
              {enquiry.request_action ? enquiry.request_action.replace('_', ' ') : 'QUOTE REQUEST'}
            </span>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {enquiry.type.replace('_', ' ')}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500">Status:</span>
              <span className={`${getStatusBadgeColors(enquiry.status).replace('bg-', 'text-').split(' ')[1]}`}>{enquiry.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500">Priority:</span>
              <span className="text-white">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500">Created:</span>
              <span className="text-white">{new Date(enquiry.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-500">Assigned To:</span>
              <span className="text-white">Unassigned</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: Customer Profile | Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 pb-4 border-b border-gray-800">
            Customer Profile
          </h3>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
              {enquiry.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{enquiry.name}</h4>
              <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                </svg>
                {enquiry.company || 'Individual Client'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Customer Type</p>
              <p className="text-sm font-medium text-white">{enquiry.company ? 'Enterprise' : 'Individual'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-white truncate" title={enquiry.email}>{enquiry.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="text-sm font-medium text-white">{enquiry.phone || 'N/A'}</p>
            </div>
          </div>
          {enquiry.user_id && (
            <div className="mt-auto pt-6">
              <Link to={`/admin/users/${enquiry.user_id}`} className="px-4 py-2 bg-[#020817] border border-gray-800 hover:border-gray-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                View Full Profile
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 pb-4 border-b border-gray-800">
            Product Information
          </h3>
          {enquiry.type === 'contact' ? (
             <div className="flex-1 flex flex-col justify-center items-center text-center">
              <p className="text-sm text-gray-500 max-w-sm">This is a general contact request and does not include specific product configurations.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                {enquiry.configuration_json && Object.entries(enquiry.configuration_json).map(([key, value]) => {
                  // Hide fields that are irrelevant or repetitive
                  const hiddenFields = ['estimated_monthly_cost', 'monthly_price', 'monthlyPrice', 'duration_value', 'duration_unit', 'monthly_price', 'subtotal_price', 'gst_amount', 'grand_total', 'discountName', 'durationMultiplier', 'isAI', 'durationSubtotal', 'gstAmount', 'grandTotal', 'discount'];
                  if (hiddenFields.includes(key) || !value || value === 'N/A' || value === 'None') return null;

                  let displayKey = key.replace(/_/g, ' ').toUpperCase();
                  if (key === 'vcpu') displayKey = 'CPU (vCPU)';
                  if (key === 'ram') displayKey = 'MEMORY (RAM)';
                  if (key === 'storage' || key === 'ssd') displayKey = 'STORAGE';
                  if (key === 'quantity') displayKey = 'QUANTITY';

                  let displayValue = String(value);
                  if (typeof value === 'boolean') {
                    displayValue = value ? 'Enabled' : 'Disabled';
                  }

                  return (
                    <div key={key}>
                      <p className="text-xs text-gray-500 mb-1 truncate">{displayKey}</p>
                      <p className="text-sm font-medium text-white break-words">{displayValue}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Chat & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-4">
              Customer Request
            </h3>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
              <span>Submitted: {new Date(enquiry.created_at).toLocaleDateString()}</span>
              <span>{new Date(enquiry.created_at).toLocaleTimeString()}</span>
            </div>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {enquiry.message || "No additional notes provided."}
            </div>
          </motion.div>

          {/* CRM Timeline */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#020817]/50 rounded-t-2xl">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Communication & Activity
              </h3>
            </div>
            
            <div className="flex-1 p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              {timeline.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-4">
                      <div className="bg-[#020817] border border-gray-800 px-4 py-2 rounded-full text-xs text-gray-400 flex items-center gap-2 shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${msg.badge === 'Internal Note' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                        <span className="font-medium text-gray-300">{msg.sender}:</span> {msg.text}
                        <span className="text-gray-600 ml-2">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                }

                const isCustomer = msg.type === 'customer';
                return (
                  <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex flex-col max-w-[85%]">
                      <div className={`flex items-center gap-2 mb-1.5 ${isCustomer ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isCustomer ? 'bg-secondary' : 'bg-indigo-600'}`}>
                          {msg.sender.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-gray-300">{msg.sender}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold ${isCustomer ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30'}`}>
                          {msg.badge}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(msg.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                        isCustomer 
                          ? 'bg-[#020817] border border-gray-800 text-gray-300 rounded-tl-sm' 
                          : 'bg-indigo-900/10 border border-indigo-900/30 text-gray-300 rounded-tr-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Section */}
            {enquiry.status !== 'Closed' && (
              <div className="p-4 border-t border-gray-800 bg-[#020817] rounded-b-2xl">
                <form onSubmit={handleResponseSubmit} className="space-y-3">
                  <textarea 
                    required
                    rows="2"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your reply to the customer..."
                    className="w-full bg-[#0a1128] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors resize-y custom-scrollbar"
                  ></textarea>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-800 bg-[#0a1128] text-secondary focus:ring-secondary focus:ring-offset-gray-900" 
                      />
                      <span className="text-xs text-gray-400 font-medium">Notify customer by email</span>
                    </label>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="px-5 py-2 bg-secondary hover:bg-accent text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Quote Gen, Notes, History */}
        <div className="space-y-6">
          {/* Generate Quote */}
          {(!enquiry.quotes || enquiry.quotes.length === 0) && (
            <motion.div id="generateQuoteSec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl flex flex-col shadow-lg shadow-black/20">
              <div className="p-6 border-b border-gray-800">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Generate Quote</h3>
              </div>
              
              <form onSubmit={handleGenerateQuote} className="p-6 space-y-4">
                <BillingSummary 
                  productName={enquiry.type?.replace('_', ' ').toUpperCase() || 'Custom Server'}
                  productCategory="Infrastructure"
                  subscriptionPlan="Monthly"
                  billingCycle="Monthly"
                  duration="1 Month"
                  quantity={pricing.quantity}
                  unitPrice={pricing.unitPrice}
                  subtotal={pricing.subtotal}
                  discount={pricing.discountAmount}
                  taxableAmount={pricing.taxableAmount}
                  gstAmount={pricing.gstAmount}
                  grandTotal={pricing.grandTotal}
                  isEditable={true}
                  onDiscountChange={(val) => setDiscount(val)}
                />

                <div>
                  <textarea 
                    rows="2"
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    placeholder="Optional notes for customer..."
                    className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors resize-y custom-scrollbar"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={generatingQuote || baseMonthlyPrice <= 0}
                  className="w-full py-3 bg-secondary hover:bg-accent text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {generatingQuote ? 'Generating...' : 'Generate Quote'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Quote History */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quote History</h3>
            </div>
            <div className="p-0">
              {enquiry.quotes && enquiry.quotes.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#020817]">
                    <tr className="text-gray-500 text-xs uppercase">
                      <th className="py-3 px-4 font-semibold">Quote</th>
                      <th className="py-3 px-4 font-semibold text-right">Amount</th>
                      <th className="py-3 px-4 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {enquiry.quotes.map(quote => (
                      <tr key={quote.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-medium text-white">{quote.quote_number}</td>
                        <td className="py-3 px-4 text-gray-300 text-right">₹{quote.monthly_price}</td>
                        <td className="py-3 px-4 text-center">
                           <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary uppercase font-bold">
                            {quote.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No quotes generated yet.
                </div>
              )}
            </div>
          </motion.div>

          {/* Internal Notes */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl flex flex-col">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Internal Notes</h3>
            </div>
            <div className="p-6 space-y-4">
               <form onSubmit={handleAddNote} className="space-y-3">
                  <textarea 
                    required
                    rows="2"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Add an admin-only note..."
                    className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors resize-y custom-scrollbar"
                  ></textarea>
                  <button 
                    type="submit" 
                    disabled={addingNote}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {addingNote ? 'Saving...' : 'Save Note'}
                  </button>
                </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminEnquiryDetailsPage;
