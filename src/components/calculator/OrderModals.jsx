import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { quoteService } from '../../services/quoteService';

const ModalBackdrop = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020817]/80 backdrop-blur-sm"
  >
    {children}
  </motion.div>
);

export const LoginRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalBackdrop onClose={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0a1128] border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px] pointer-events-none rounded-full" />
          
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-8">
            Please sign in or create an account before requesting a quote or placing an order.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-accent hover:bg-secondary text-white rounded-xl font-medium transition-colors shadow-lg shadow-secondary/25"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
            >
              Create Account
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-gray-400 hover:text-white rounded-xl font-medium transition-colors mt-2"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </ModalBackdrop>
    </AnimatePresence>
  );
};

export const OrderSummaryModal = ({ isOpen, onClose, config, user, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      const response = await quoteService.createQuote({
        service_type: config.isAI ? 'AI Server' : 'Enterprise Server',
        vcpu: config.vCPU, // Might be null for AI
        ram: config.ram,
        storage: config.ssd,
        os: config.os,
        bandwidth: config.bandwidth,
        backup: config.backup,
        discount: config.discountName,
        monthly_price: config.monthlyPrice,
        duration_type: config.duration_type,
        duration_value: config.duration_value,
        duration_unit: config.duration_unit
      });
      onSuccess(response.data);
    } catch (err) {
      setError(err.message || 'Something went wrong while submitting the request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <ModalBackdrop onClose={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0a1128] border border-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 blur-[50px] pointer-events-none rounded-full" />
          
          <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
          
          <div className="bg-[#020817] rounded-xl p-5 border border-gray-800 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {config.isAI ? `Package: ${config.packageName}` : 'Configuration'}
            </h3>
            <div className="space-y-3 text-sm">
              {config.isAI ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-300">GPU</span>
                    <span className="text-white font-medium">{config.gpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Memory</span>
                    <span className="text-white font-medium">{config.ram} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Storage</span>
                    <span className="text-white font-medium">{config.ssd} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bandwidth</span>
                    <span className="text-white font-medium">{config.bandwidth}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Processor</span>
                    <span className="text-white font-medium">{config.vCPU} vCPU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Memory</span>
                    <span className="text-white font-medium">{config.ram} GB RAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Storage</span>
                    <span className="text-white font-medium">{config.ssd} GB SSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bandwidth</span>
                    <span className="text-white font-medium">{config.bandwidth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Operating System</span>
                    <span className="text-white font-medium">{config.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Daily Backup</span>
                    <span className="text-white font-medium">{config.backup ? 'Yes' : 'No'}</span>
                  </div>
                  {config.discountName && (
                    <div className="flex justify-between text-green-400 font-medium">
                      <span>Applied Offer</span>
                      <span>{config.discountName}</span>
                    </div>
                  )}
                </>
              )}
              
              <div className="border-t border-gray-800 my-2 pt-4 mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Subscription</span>
                  <span className="text-white font-medium">₹{config.monthlyPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subscription Plan</span>
                  <span className="text-white font-medium">{config.duration_type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subscription Duration</span>
                  <span className="text-white font-medium">{config.durationMultiplier} Months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Contract Value</span>
                  <span className="text-white font-medium">₹{config.durationSubtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">GST (18%)</span>
                  <span className="text-white font-medium">₹{config.gstAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-800 mt-2">
                  <span className="text-secondary font-bold">Total Payable</span>
                  <span className="text-xl text-secondary font-bold">₹{config.grandTotal?.toLocaleString()}</span>
                </div>
                <div className="mt-4 p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-xs text-secondary/80">
                  <span className="block font-bold mb-1 text-secondary">Subscription Renewal</span>
                  This subscription is set to manual renewal by default. You can manage your renewal preferences from your dashboard.
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="text-gray-200">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-gray-200">{user?.email}</span>
              </div>
            </div>
          </div>

          {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-accent hover:bg-secondary text-white rounded-xl font-medium transition-colors shadow-lg shadow-secondary/25 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </motion.div>
      </ModalBackdrop>
    </AnimatePresence>
  );
};

export const SuccessModal = ({ isOpen, quote, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !quote) return null;

  return (
    <AnimatePresence>
      <ModalBackdrop onClose={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0a1128] border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-secondary/10 blur-[60px] pointer-events-none rounded-full" />
          
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Quote Request Submitted</h2>
          <p className="text-gray-400 mb-6">
            Your quote request has been received successfully. Our team will review it shortly.
          </p>

          <div className="bg-[#020817] rounded-xl p-4 border border-gray-800 mb-8 inline-block w-full">
            <div className="text-sm text-gray-400 mb-1">Quote ID</div>
            <div className="text-xl font-bold text-secondary mb-3">{quote.quote_number}</div>
            
            <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-300">
              <span className="font-semibold text-white">{quote.service_type}</span>
              <span>•</span>
              {quote.vcpu && <span>{quote.vcpu} vCPU</span>}
              {quote.ram && <span>{quote.ram} GB RAM</span>}
              {quote.storage && <span>{quote.storage} GB Storage</span>}
            </div>
            <div className="mt-3 text-white font-medium">
              ₹{parseFloat(quote.monthly_price).toLocaleString()}/mo
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                navigate('/dashboard');
              }}
              className="w-full py-3 px-4 bg-accent hover:bg-secondary text-white rounded-xl font-medium transition-colors shadow-lg shadow-secondary/25"
            >
              View My Quotes
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/dashboard');
              }}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </ModalBackdrop>
    </AnimatePresence>
  );
};
