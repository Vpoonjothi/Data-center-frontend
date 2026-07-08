import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { quoteService } from '../../services/quoteService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    quotes: [],
    kyc: [],
    payments: [],
    services: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [quotesRes, kycRes, paymentsRes, servicesRes] = await Promise.all([
          quoteService.getMyQuotes(),
          api.get('/kyc/my-kyc'),
          api.get('/payments/my-payments'),
          api.get('/services/my-services')
        ]);

        setData({
          quotes: quotesRes.data || [],
          kyc: kycRes.data?.success ? kycRes.data.data : [],
          payments: paymentsRes.data?.success ? paymentsRes.data.data : [],
          services: servicesRes.data?.success ? servicesRes.data.data : []
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 1. Calculate Profile Completion (6 Checkpoints)
  const calculateCompletion = () => {
    let completedSteps = 0;
    const totalSteps = 6; // Personal, Business, Address, Service, KYC, Payment
    const checks = {
      personal: Boolean(user?.name && user?.email && user?.phone),
      business: Boolean(user?.company && user?.business_type),
      address: Boolean(user?.address_line1 && user?.city && user?.country),
      service: Boolean(user?.service_requirement_type),
      kyc: data.kyc.some(k => k.overall_status === 'verified'),
      payment: data.payments.some(p => p.status === 'Verified')
    };

    Object.values(checks).forEach(isComplete => {
      if (isComplete) completedSteps++;
    });

    return {
      percentage: Math.round((completedSteps / totalSteps) * 100),
      completedSteps,
      totalSteps,
      checks
    };
  };

  const completionStats = calculateCompletion();
  const serviceActivated = data.services.some(s => s.status === 'Active');

  // 2. Action Required Priority Logic
  const getActionRequired = () => {
    const pendingQuote = data.quotes.find(q => q.status === 'quoted');
    if (pendingQuote) {
      return {
        type: 'quote',
        title: 'Accept Pending Quote',
        message: `Quote ${pendingQuote.quote_number} is ready for your review.`,
        actionText: 'Review Quote',
        action: () => navigate(`/dashboard/quotes`)
      };
    }

    const requiresKycQuote = data.quotes.find(q => ['pending', 'accepted', 'processing', 'verification_pending', 'verified'].includes(q.status) && !data.kyc.some(k => k.quote_id === q.id && k.overall_status === 'verified'));
    if (requiresKycQuote) {
      return {
        type: 'kyc',
        title: 'Complete KYC Verification',
        message: 'Identity verification is strictly required before provisioning.',
        actionText: 'Complete Now',
        action: () => navigate(`/verification/${requiresKycQuote.id}`)
      };
    }

    const requiresPaymentQuote = data.quotes.find(q => q.status === 'verified' || q.status === 'payment_rejected');
    if (requiresPaymentQuote) {
      return {
        type: 'payment',
        title: 'Upload Payment Receipt',
        message: `Payment is required for Quote ${requiresPaymentQuote.quote_number}.`,
        actionText: 'Upload Receipt',
        action: () => navigate(`/payment/${requiresPaymentQuote.id}`)
      };
    }

    if (!completionStats.checks.personal || !completionStats.checks.business || !completionStats.checks.address) {
      return {
        type: 'profile',
        title: 'Complete Profile Information',
        message: 'Your profile is incomplete. Please update your details.',
        actionText: 'Update Profile',
        action: () => navigate('/dashboard/profile')
      };
    }

    return null;
  };

  const actionTask = getActionRequired();

  // Generate Notifications
  const generateNotifications = () => {
    const notifs = [];
    if (data.quotes.find(q => q.status === 'quoted')) notifs.push('You have a pending quote awaiting acceptance.');
    
    const pendingKycQuote = data.quotes.find(q => ['pending', 'accepted', 'verification_pending'].includes(q.status));
    if (pendingKycQuote && !completionStats.checks.kyc) {
        notifs.push(`Quote ${pendingKycQuote.quote_number} is awaiting KYC verification.`);
    }

    if (data.quotes.find(q => q.status === 'verified')) notifs.push('Payment verification is pending.');
    
    const paidQuote = data.quotes.find(q => q.status === 'paid');
    if (paidQuote && !data.services.some(s => s.quote_id === paidQuote.id)) {
        notifs.push('Service provisioning will begin after verification.');
    }
    
    if (data.services.some(s => s.status === 'Pending Provisioning')) notifs.push('One of your services is currently being provisioned.');
    if (data.services.some(s => s.status === 'Active')) notifs.push('Your infrastructure is active and online.');

    return notifs.slice(0, 4);
  };
  const notifications = generateNotifications();

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s.includes('verified') || s.includes('active') || s.includes('paid')) {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize whitespace-nowrap">{status}</span>;
    }
    if (s.includes('pending') || s.includes('quoted') || s.includes('processing')) {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 capitalize whitespace-nowrap">{status}</span>;
    }
    if (s.includes('rejected') || s.includes('failed')) {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 capitalize whitespace-nowrap">{status}</span>;
    }
    return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 capitalize whitespace-nowrap">{status}</span>;
  };

  const getGlobalStatus = () => {
    let kycStatus = 'Not Started';
    let paymentStatus = 'Not Started';
    let quoteStatus = 'Not Started';
    let serviceStatus = 'Not Activated';

    if (data.quotes.length > 0) quoteStatus = data.quotes[0].status.replace('_', ' ');
    if (data.kyc.length > 0) kycStatus = data.kyc[0].overall_status;
    if (data.payments.length > 0) paymentStatus = data.payments[0].status;
    if (data.services.length > 0) serviceStatus = data.services[0].status;

    return { kycStatus, paymentStatus, quoteStatus, serviceStatus };
  };
  const globalStatus = getGlobalStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeQuotes = data.quotes.filter(q => ['pending', 'quoted', 'verification_pending', 'verified', 'paid'].includes(q.status));
  const activeServices = data.services.filter(s => s.status === 'Active' || s.status === 'Pending Provisioning');

  return (
    <div className="bg-slate-950 text-slate-300 font-sans min-h-screen pb-20 pt-8">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="mt-1 text-slate-400">Welcome back, {user?.name}. Here is your onboarding and infrastructure overview.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN - PRIMARY */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* CUSTOMER ONBOARDING WORKFLOW */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Customer Onboarding Journey</h3>
              <div className="flex items-center min-w-[700px] justify-between relative px-4">
                <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>
                
                {[
                  { id: 'personal', label: 'Registration', done: true },
                  { id: 'profile', label: 'Profile Completed', done: completionStats.checks.personal && completionStats.checks.business },
                  { id: 'quote', label: 'Quote Accepted', done: data.quotes.some(q => q.status !== 'pending' && q.status !== 'quoted') },
                  { id: 'kyc', label: 'KYC Verification', done: completionStats.checks.kyc },
                  { id: 'payment', label: 'Payment Verification', done: completionStats.checks.payment },
                  { id: 'provisioning', label: 'Provisioning', done: data.quotes.some(q => q.status === 'paid') },
                  { id: 'active', label: 'Service Active', done: serviceActivated },
                ].map((step, index, arr) => {
                  const isCurrent = !step.done && (index === 0 || arr[index-1].done);
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-3 relative bg-slate-900 px-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                        step.done ? 'bg-secondary border-secondary text-white' :
                        isCurrent ? 'bg-slate-950 border-secondary text-secondary shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                        'bg-slate-950 border-slate-700 text-slate-600'
                      }`}>
                        {step.done ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs font-semibold whitespace-nowrap ${
                        step.done ? 'text-slate-300' :
                        isCurrent ? 'text-white' :
                        'text-slate-600'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTION REQUIRED BANNER */}
            {actionTask ? (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg shadow-amber-500/5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-amber-500 font-bold text-lg mb-1">{actionTask.title}</h3>
                    <p className="text-amber-200/70 text-sm">{actionTask.message}</p>
                  </div>
                </div>
                {actionTask.action && (
                  <button 
                    onClick={actionTask.action}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-amber-500/20"
                  >
                    {actionTask.actionText}
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg mb-0.5">Everything is up to date</h3>
                  <p className="text-emerald-200/70 text-sm">Your account is ready for the next stage.</p>
                </div>
              </div>
            )}

            {/* ACTIVE QUOTES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6">Active Quotes</h3>
              {activeQuotes.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-slate-400 mb-3">No active quotes.</p>
                  <button onClick={() => navigate('/services')} className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium">Request Service</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeQuotes.map(quote => (
                    <div key={quote.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-slate-700 transition-colors">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 w-full">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quote Number</p>
                          <p className="font-bold text-white text-sm">{quote.quote_number}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Type</p>
                          <p className="text-sm text-slate-300">{quote.service_type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Subscription</p>
                          <p className="text-sm text-slate-300">₹{parseFloat(quote.monthly_price).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subscription Plan</p>
                          <p className="text-sm text-slate-300 capitalize">{quote.duration_type || 'Monthly'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center gap-3 shrink-0 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        {renderStatusBadge(quote.status.replace('_', ' '))}
                        <button onClick={() => navigate('/dashboard/quotes')} className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors w-full lg:w-auto text-center">View Quote</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIVE SERVICES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6">Active Services</h3>
              {activeServices.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl flex flex-col items-center justify-center text-center">
                  <svg className="w-12 h-12 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
                  <p className="text-slate-300 font-medium mb-1">No active services.</p>
                  <p className="text-sm text-slate-500 mb-4">Browse our Enterprise Servers, AI Servers, or Colocation services to get started.</p>
                  <button onClick={() => navigate('/services')} className="text-sm px-5 py-2.5 bg-secondary hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">Browse Services</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeServices.map(service => {
                    return (
                      <div key={service.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-slate-700 transition-colors">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-4 w-full">
                          <div className="col-span-2 md:col-span-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Name</p>
                            <p className="font-bold text-white text-sm truncate">{service.service_name || `Server #${service.id}`}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{service.service_type || 'Infrastructure'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subscription Plan</p>
                            <p className="text-sm text-slate-300 capitalize">{service.duration_type || 'Monthly'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Sub</p>
                            <p className="text-sm text-slate-300">₹{parseFloat(service.monthly_amount || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Next Renewal</p>
                            <p className="text-sm text-slate-300">{service.next_due_date ? new Date(service.next_due_date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Renewal Type</p>
                            <p className="text-sm text-slate-300 uppercase">{service.renewal_type || 'manual'}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center gap-3 shrink-0 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                          {renderStatusBadge(service.status)}
                          <button onClick={() => navigate('/dashboard')} className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors w-full lg:w-auto text-center font-medium">Manage Service</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - SECONDARY */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Account Status Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-5">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-lg border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-300">KYC Status</span>
                  {renderStatusBadge(globalStatus.kycStatus)}
                </div>
                <div className="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-lg border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-300">Payment Status</span>
                  {renderStatusBadge(globalStatus.paymentStatus)}
                </div>
                <div className="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-lg border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-300">Quote Status</span>
                  {renderStatusBadge(globalStatus.quoteStatus)}
                </div>
                <div className="flex justify-between items-center bg-slate-950 px-4 py-3 rounded-lg border border-slate-800/50">
                  <span className="text-sm font-medium text-slate-300">Service Status</span>
                  {renderStatusBadge(globalStatus.serviceStatus)}
                </div>
              </div>
            </div>

            {/* Provisioning Readiness */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Provisioning Readiness</h3>
                <span className="text-lg font-black text-secondary">{completionStats.percentage}%</span>
              </div>
              
              <div className="space-y-4 mb-6">
                {[
                  { key: 'personal', label: 'Personal Information', done: completionStats.checks.personal, path: '/dashboard/profile' },
                  { key: 'business', label: 'Business Information', done: completionStats.checks.business, path: '/dashboard/profile' },
                  { key: 'address', label: 'Address Information', done: completionStats.checks.address, path: '/dashboard/profile' },
                  { key: 'service', label: 'Service Preferences', done: completionStats.checks.service, path: '/dashboard/profile' },
                  { key: 'kyc', label: 'KYC Verified', done: completionStats.checks.kyc, path: '/dashboard/quotes' },
                  { key: 'payment', label: 'Payment Verified', done: completionStats.checks.payment, path: '/dashboard/quotes' }
                ].map(item => (
                  <div 
                    key={item.key} 
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-3 p-2 -mx-2 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors group"
                  >
                    {item.done ? (
                      <svg className="w-5 h-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <div className="w-4 h-4 ml-0.5 mr-0.5 rounded border border-slate-700 group-hover:border-slate-500 bg-slate-950 shrink-0 transition-colors"></div>
                    )}
                    <span className={`text-sm flex-1 ${item.done ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'} transition-colors`}>{item.label}</span>
                    <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${item.done ? 'text-secondary' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current Status</p>
                {completionStats.percentage === 100 ? (
                  <p className="text-sm font-bold text-emerald-400">Ready For Provisioning</p>
                ) : (
                  <p className="text-sm font-bold text-amber-500">Pending Customer Action</p>
                )}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-5">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No new notifications.</p>
              ) : (
                <ul className="space-y-4">
                  {notifications.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                      <p className="text-sm text-slate-300">{note}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick Navigation Links */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-5">Quick Navigation</h3>
              <div className="space-y-2">
                {[
                  { label: 'Request New Service', path: '/services' },
                  { label: 'View Quotes', path: '/dashboard/quotes' },
                  { label: 'Compliance Documents', path: '/dashboard/profile' },
                  { label: 'Pending Payments', path: '/dashboard/quotes' },
                  { label: 'Pending KYC', path: '/dashboard/quotes' },
                  { label: 'Support Tickets', path: '/contact' }
                ].map((link, idx) => (
                  <button key={idx} onClick={() => navigate(link.path)} className="w-full text-left px-4 py-3 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl text-sm font-medium text-slate-300 transition-colors flex justify-between items-center group">
                    {link.label}
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
