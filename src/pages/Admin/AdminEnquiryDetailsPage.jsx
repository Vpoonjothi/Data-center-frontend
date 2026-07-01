import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  getEnquiryById, 
  updateEnquiryStatus, 
  addEnquiryResponse, 
  addEnquiryNote,
  deleteEnquiryNote,
  generateQuoteFromEnquiry
} from '../../services/adminApi';

const AdminEnquiryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Response Form State
  const [responseSubject, setResponseSubject] = useState('');
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [markAsClosed, setMarkAsClosed] = useState(false);

  // Internal Notes State
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Quote Generation State
  const [quoteAmount, setQuoteAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [validity, setValidity] = useState('15 Days');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [generatingQuote, setGeneratingQuote] = useState(false);

  // Success/Error Messages
  const [notification, setNotification] = useState(null);

  const fetchEnquiry = async () => {
    try {
      const res = await getEnquiryById(id);
      if (res.success) {
        setEnquiry(res.data);
        setUserStats(res.data.userStats || null);
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
    if (enquiry?.configuration_json?.estimated_monthly_cost) {
      const costStr = enquiry.configuration_json.estimated_monthly_cost;
      const numericCost = parseFloat(costStr.replace(/[^0-9.]/g, ''));
      if (!isNaN(numericCost)) {
        setQuoteAmount(numericCost.toString());
      }
    }
  }, [enquiry]);

  const getConfigTitle = () => {
    if (enquiry?.type === 'ai_server') return 'AI Configuration';
    if (enquiry?.type === 'enterprise_server') return 'Enterprise Configuration';
    if (enquiry?.type === 'colocation') return 'Colocation Configuration';
    return 'Server Configuration';
  };

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
    if (!responseSubject || !responseText) return;
    
    setSubmitting(true);
    try {
      const res = await addEnquiryResponse(id, responseSubject, responseText, markAsClosed);
      if (res.success) {
        setResponseSubject('');
        setResponseText('');
        setMarkAsClosed(false);
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

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    
    setSubmittingNote(true);
    try {
      const res = await addEnquiryNote(id, newNote);
      if (res.success) {
        setNewNote('');
        showNotification('Note added successfully');
        fetchEnquiry();
      }
    } catch (error) {
      console.error(error);
      showNotification('Failed to add note', 'error');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await deleteEnquiryNote(id, noteId);
      if (res.success) {
        showNotification('Note deleted');
        fetchEnquiry();
      }
    } catch (error) {
      console.error(error);
      showNotification('Failed to delete note', 'error');
    }
  };

  const handleGenerateQuote = async (e) => {
    e.preventDefault();
    if (!quoteAmount) return;

    setGeneratingQuote(true);
    try {
      const payload = {
        amount: quoteAmount,
        billingCycle,
        validityDays: parseInt(validity),
        adminNotes: quoteNotes
      };
      const res = await generateQuoteFromEnquiry(id, payload);
      if (res.success) {
        setQuoteAmount('');
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
      case 'In Progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Responded': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Quoted': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Verification Pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Verified': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'Paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Active': return 'bg-secondary/10 text-secondary border-secondary/20';
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
        Enquiry not found.
      </div>
    );
  }

  // Combine initial message and responses into a single timeline array
  const timeline = [
    {
      id: 'msg-0',
      type: 'customer',
      sender: enquiry.name,
      subject: 'Initial Request',
      text: enquiry.message || 'No additional message provided.',
      timestamp: enquiry.created_at
    },
    ...(enquiry.responses || []).map(r => ({
      id: `resp-${r.id}`,
      type: 'admin',
      sender: r.admin?.name || 'System Admin',
      subject: r.subject,
      text: r.response,
      timestamp: r.created_at
    }))
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Notifications */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${
          notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
        } transition-all duration-300`}>
          {notification.message}
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/enquiries" className="w-10 h-10 shrink-0 rounded-xl bg-[#020817] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary/50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white">ENQ-{enquiry.id.toString().padStart(4, '0')}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColors(enquiry.status)}`}>
                {enquiry.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-indigo-500/10 text-indigo-400 border-indigo-500/20`}>
                Priority: Normal
              </span>
            </div>
            <div className="text-gray-400 text-sm mt-1 flex items-center gap-4">
              <span>{enquiry.type.replace('_', ' ').toUpperCase()}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>Created: {new Date(enquiry.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={enquiry.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-secondary transition-colors cursor-pointer"
          >
            <option value="New">Mark as New</option>
            <option value="In Progress">Mark In Progress</option>
            <option value="Quoted">Mark as Quoted</option>
            <option value="Verification Pending">Mark Verification Pending</option>
            <option value="Verified">Mark Verified</option>
            <option value="Paid">Mark Paid</option>
            <option value="Active">Mark Active</option>
            <option value="Closed">Close Enquiry</option>
          </select>
        </div>
      </div>

      {/* ROW 1: Customer Profile | Request Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Customer Profile
          </h3>
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-800">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {enquiry.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">{enquiry.name}</h4>
              <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                </svg>
                {enquiry.company || 'Individual Client'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Email</p>
              <p className="text-sm font-medium text-white truncate" title={enquiry.email}>{enquiry.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Phone</p>
              <p className="text-sm font-medium text-white">{enquiry.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Country</p>
              <p className="text-sm font-medium text-white">{enquiry.user?.country || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Customer Since</p>
              <p className="text-sm font-medium text-white">
                {enquiry.user ? new Date(enquiry.user.createdAt).toLocaleDateString() : 'Guest'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Enquiries</p>
              <p className="text-sm font-medium text-white">{userStats ? userStats.totalEnquiries : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Total Quotes</p>
              <p className="text-sm font-medium text-white">{userStats ? userStats.totalQuotes : 'N/A'}</p>
            </div>
          </div>
          {enquiry.user_id && (
            <div className="mt-auto pt-6">
              <Link to={`/admin/users/${enquiry.user_id}`} className="text-sm font-bold text-secondary hover:text-white transition-colors flex items-center gap-1 w-max">
                View Full Profile
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Request Details
          </h3>
          <div className="bg-[#020817] border border-gray-800 rounded-xl p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-white px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg">
                {enquiry.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                Submitted: {new Date(enquiry.created_at).toLocaleString()}
              </span>
            </div>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto max-h-[200px]">
              {enquiry.message || <span className="text-gray-600 italic">No additional message provided by the customer.</span>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ROW 2: Configuration Details | Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enquiry.type !== 'contact' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <svg className="w-32 h-32 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-6 relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              {getConfigTitle()}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
              {enquiry.configuration_json && Object.keys(enquiry.configuration_json).length > 0 ? (
                Object.entries(enquiry.configuration_json).map(([key, value]) => (
                  <div key={key} className="bg-[#020817] p-4 rounded-xl border border-gray-800/50 hover:border-secondary/30 transition-colors">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 truncate" title={key.replace(/_/g, ' ')}>
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm font-bold text-white break-words">{value}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-500 text-sm">No configuration data stored for this enquiry.</div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 bg-[#020817] rounded-full flex items-center justify-center border border-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Configuration</h3>
            <p className="text-sm text-gray-500 max-w-sm">This is a general contact enquiry and does not include specific hardware requirements.</p>
          </motion.div>
        )}

        {/* Quotes Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Quotes Summary
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {enquiry.quotes && enquiry.quotes.length > 0 ? (
              enquiry.quotes.map(quote => (
                <div key={quote.id} className="bg-[#020817] border border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:border-secondary/50 transition-colors">
                  <div>
                    <div className="text-white font-bold mb-1 flex items-center gap-2">
                      {quote.quote_number}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/10 text-secondary uppercase">
                        ${quote.monthly_price}/mo
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Created: {new Date(quote.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Link to={`/admin/quotes/${quote.id}`} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-secondary transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-sm">
                 <svg className="w-10 h-10 text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                No quotes generated yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ROW 3: Communication Timeline */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 bg-[#020817]/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Communication Timeline
          </h3>
        </div>
        
        <div className="flex-1 p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {timeline.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.type === 'customer' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-2xl p-5 ${
                msg.type === 'customer' 
                  ? 'bg-[#020817] border border-gray-800 rounded-tl-sm' 
                  : 'bg-secondary/10 border border-secondary/20 rounded-tr-sm'
              }`}>
                <div className="flex justify-between items-start mb-3 gap-8">
                  <div>
                    <div className={`font-bold text-sm ${msg.type === 'customer' ? 'text-white' : 'text-secondary'}`}>
                      {msg.sender} <span className="text-xs font-normal text-gray-500 ml-2">({msg.type === 'customer' ? 'Customer' : 'Admin'})</span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1">{msg.subject}</div>
                  </div>
                  <div className="text-[10px] text-gray-500 whitespace-nowrap">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={`text-sm leading-relaxed whitespace-pre-wrap border-t pt-3 ${
                  msg.type === 'customer' ? 'text-gray-300 border-gray-800/50' : 'text-gray-200 border-secondary/20'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {enquiry.status !== 'Closed' && (
          <div className="p-6 border-t border-gray-800 bg-[#020817]">
            <form onSubmit={handleResponseSubmit} className="space-y-4 max-w-4xl">
              <h4 className="text-sm font-bold text-white mb-2">Send Response</h4>
              <div>
                <input 
                  type="text" 
                  required
                  value={responseSubject}
                  onChange={(e) => setResponseSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full bg-[#0a1128] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <textarea 
                  required
                  rows="3"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response to the customer..."
                  className="w-full bg-[#0a1128] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors resize-y"
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={markAsClosed}
                    onChange={(e) => setMarkAsClosed(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-800 bg-[#0a1128] text-secondary focus:ring-secondary focus:ring-offset-gray-900" 
                  />
                  <span className="text-sm text-gray-400">Mark enquiry as Closed</span>
                </label>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-2.5 bg-accent hover:bg-secondary text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-secondary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROW 4: Internal Notes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 flex flex-col h-[500px]">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Internal Notes
          </h3>
          <p className="text-xs text-gray-500 mb-4">Private admin-only notes. Never visible to customers.</p>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
            {enquiry.notes && enquiry.notes.length > 0 ? (
              enquiry.notes.map(note => (
                <div key={note.id} className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 group relative">
                  <div className="text-xs text-yellow-500/70 font-medium mb-2 flex justify-between">
                    <span>{note.admin?.name || 'Admin'}</span>
                    <span>{new Date(note.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.note_text}</p>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                    title="Delete Note"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No internal notes added yet.
              </div>
            )}
          </div>

          <form onSubmit={handleNoteSubmit} className="mt-auto pt-4 border-t border-gray-800">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a private note..."
                className="flex-1 bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
              <button 
                type="submit" 
                disabled={submittingNote || !newNote}
                className="px-4 py-2.5 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20 text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Add Note
              </button>
            </div>
          </form>
        </motion.div>

        {/* ROW 5: Quote Generation Panel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-[#0a1128] to-[#0d1633] border border-secondary/30 rounded-2xl p-6 flex flex-col h-[500px]">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Quote
          </h3>
          <p className="text-xs text-gray-400 mb-6 border-b border-gray-800 pb-4">Create a formal quote based on this enquiry.</p>
          
          <form onSubmit={handleGenerateQuote} className="flex flex-col flex-1">
            <div className="space-y-4 overflow-y-auto pr-2 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Monthly Quote Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="e.g. 1500.00"
                  className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Cycle</label>
                  <select 
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Validity</label>
                  <select 
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Terms / Admin Notes</label>
                <textarea 
                  rows="2"
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Additional terms or notes for the quote..."
                  className="w-full bg-[#020817] border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors resize-y"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4">
              <button 
                type="button" 
                className="px-4 py-3 bg-[#020817] border border-gray-800 text-white hover:bg-gray-800 text-sm font-bold rounded-xl transition-colors text-center"
              >
                Save Draft
              </button>
              <button 
                type="submit" 
                disabled={generatingQuote || !quoteAmount}
                className="px-4 py-3 bg-secondary hover:bg-accent text-white shadow-lg shadow-secondary/20 text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generatingQuote ? 'Generating...' : 'Send Quote'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* ROW 6: Activity Log */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activity Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-3 font-bold px-4">Timestamp</th>
                <th className="pb-3 font-bold px-4">Action</th>
                <th className="pb-3 font-bold px-4">User</th>
                <th className="pb-3 font-bold px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {enquiry.logs && enquiry.logs.length > 0 ? (
                enquiry.logs.map(log => (
                  <tr key={log.id} className="hover:bg-[#020817]/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-white px-2 py-1 bg-[#020817] border border-gray-800 rounded-lg">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      {log.user_id ? `Admin #${log.user_id}` : 'System'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-400 truncate max-w-xs" title={log.details}>
                      {log.details || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">
                    No activity logs found.
                  </td>
                </tr>
              )}
              {/* Always show initial lead creation as a static base log if it's not in DB logs */}
              <tr>
                <td className="py-4 px-4 text-sm text-gray-400 whitespace-nowrap">
                  {new Date(enquiry.created_at).toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-bold text-white px-2 py-1 bg-[#020817] border border-gray-800 rounded-lg">
                    Lead Created
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-300">
                  {enquiry.name} (Customer)
                </td>
                <td className="py-4 px-4 text-sm text-gray-400">
                  Enquiry submitted via website.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default AdminEnquiryDetailsPage;
