import React, { useState, useEffect } from 'react';
import { getMyServices, createServiceRenewalOrder, verifyServiceRenewalPayment } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const MyServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewingId, setRenewingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getMyServices();
        setServices(response.data || []);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getDueBadge = (renewalDate) => {
    if (!renewalDate) return null;
    const today = new Date();
    const due = new Date(renewalDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">Overdue</span>;
    } else if (diffDays <= 7) {
      return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Due Soon</span>;
    } else {
      return <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Current</span>;
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (status === 'Expired') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (status === 'Suspended') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if (status === 'Cancelled') return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  const handleRenew = async (service) => {
    setRenewingId(service.id);
    try {
      // 1. Create Order
      const orderRes = await createServiceRenewalOrder(service.id);
      if (!orderRes.success) {
        alert(orderRes.message || 'Failed to create renewal order');
        setRenewingId(null);
        return;
      }

      if (orderRes.isDummy) {
        // Proceed directly to verification for Dummy flow
        const verifyRes = await verifyServiceRenewalPayment(service.id, {
          isDummy: true,
          razorpay_order_id: orderRes.data.id,
        });
        if (verifyRes.success) {
          alert(verifyRes.message);
          window.location.reload(); // Reload to fetch updated services
        } else {
          alert('Renewal failed.');
        }
        setRenewingId(null);
        return;
      }

      // 2. Open Razorpay Modal
      const options = {
        key: orderRes.keyId,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'GreenLeaf Data Center',
        description: `Renewal for ${service.service_name}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyServiceRenewalPayment(service.id, {
              isDummy: false,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verifyRes.success) {
              alert(verifyRes.message);
              window.location.reload();
            } else {
              alert(verifyRes.message || 'Verification failed');
            }
          } catch (err) {
            console.error(err);
            alert('Error verifying payment.');
          }
        },
        theme: {
          color: '#22C55E'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert('Payment failed: ' + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert('Error initiating renewal.');
    } finally {
      setRenewingId(null);
    }
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dueDate);
    target.setHours(0,0,0,0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">My Services</h1>
            <p className="mt-1 text-slate-400">View and manage your active subscriptions and servers.</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/dashboard/payments" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium border border-slate-700">
              Payment History
            </Link>
            <Link to="/dashboard" className="px-4 py-2 text-secondary hover:text-white transition-colors text-sm font-medium flex items-center">
              &larr; Dashboard
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No Active Services</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">You don't have any active services yet. Accept a quote and complete payment to provision your infrastructure.</p>
            <Link to="/dashboard" className="px-6 py-2.5 bg-secondary hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium text-sm">
              View My Quotes
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {services.map((service) => {
              const daysRemaining = calculateDaysRemaining(service.next_due_date);
              const progressPercentage = Math.max(0, Math.min(100, (daysRemaining / 30) * 100)); // Normalize assuming 30 day cycles
              
              const isSuspended = service.status === 'Suspended';
              const isGracePeriod = service.status === 'Expired';
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative overflow-hidden rounded-2xl border ${isSuspended ? 'border-orange-500/30' : isGracePeriod ? 'border-red-500/30' : 'border-slate-800'} bg-slate-900 shadow-sm`}
                >
                  {/* Banner for Suspended / Grace Period */}
                  {(isSuspended || isGracePeriod) && (
                    <div className={`w-full py-2 px-6 text-sm font-bold text-center ${isSuspended ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                      {isSuspended 
                        ? 'SERVER SUSPENDED - Complete payment to instantly reactivate your service. Data is preserved.' 
                        : 'GRACE PERIOD - Subscription expired. Please renew immediately to avoid suspension.'}
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Left Column: Details */}
                    <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">{service.service_name}</h3>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${getStatusBadge(service.status)}`}>
                              {service.status}
                            </span>
                          </div>
                          <p className="text-slate-400">{service.service_type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-white">₹{parseFloat(service.monthly_amount).toLocaleString()}<span className="text-lg text-slate-500 font-normal">/mo</span></p>
                        </div>
                      </div>

                      {/* Animated Timeline */}
                      <div className="mt-8">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Billing Cycle</span>
                          <span className="font-bold text-white">
                            {daysRemaining < 0 
                              ? `${Math.abs(daysRemaining)} Days Overdue` 
                              : `${daysRemaining} Days Remaining`}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`absolute top-0 left-0 h-full rounded-full ${
                              daysRemaining > 7 ? 'bg-emerald-500' : 
                              daysRemaining > 3 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-slate-500">
                          <span>{new Date(service.start_date).toLocaleDateString()}</span>
                          <span>Expires: {new Date(service.next_due_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Actions */}
                    <div className="md:w-64 shrink-0 flex flex-col justify-center space-y-3 bg-slate-950/50 p-6 rounded-xl border border-slate-800/50">
                      <div className="text-sm text-slate-400 mb-4">
                        Next Invoice: <br/>
                        <span className="text-white font-medium text-base">
                          {new Date(service.next_due_date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => handleRenew(service)}
                        disabled={renewingId === service.id || service.status === 'Cancelled'}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                          (isSuspended || isGracePeriod || daysRemaining <= 7)
                            ? 'bg-secondary hover:bg-secondary/90 text-white' 
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        } disabled:opacity-50`}
                      >
                        {renewingId === service.id ? (
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {isSuspended ? 'Pay & Reactivate' : 'Renew Subscription'}
                          </>
                        )}
                      </button>

                      {/* Download Last Invoice / View History */}
                      <Link 
                        to="/dashboard/payments" 
                        className="w-full py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 text-center transition-colors"
                      >
                        View Billing History
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyServicesPage;
