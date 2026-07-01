import React, { useState, useEffect } from 'react';
import { getMyServices } from '../../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (status === 'Suspended') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if (status === 'Cancelled') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm hover:border-slate-700 transition-colors"
              >
                <div className="p-6 border-b border-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${getStatusBadge(service.status)}`}>
                        {service.status}
                      </span>
                      {service.status === 'Active' && getDueBadge(service.next_due_date)}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{service.service_name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{service.service_type}</p>
                  <p className="text-xl font-bold text-white">₹{parseFloat(service.monthly_amount).toLocaleString()}<span className="text-sm text-slate-500 font-normal">/mo</span></p>
                </div>
                
                <div className="px-6 py-4 bg-slate-950/50 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Subscription Status</span>
                    <span className="text-white">{service.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Purchased On</span>
                    <span className="text-white">{new Date(service.purchase_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Renewal Type</span>
                    <span className="text-white uppercase">{service.renewal_type || 'manual'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800/50">
                    <span className="text-slate-400 font-medium">Next Renewal Date</span>
                    <span className="text-white font-medium">{service.next_due_date ? new Date(service.next_due_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyServicesPage;
