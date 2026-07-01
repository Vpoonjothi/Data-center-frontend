import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import api from '../../utils/axios';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

const ForgotPasswordPage = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setStatus({ type: '', message: '' });
      const res = await api.post('/auth/forgot-password', { email: data.email });
      setStatus({ type: 'success', message: res.data.message || 'Password reset link sent to your email.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to process request.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-teal-500 to-red-500"></div>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-slate-400">Enter your email to receive reset instructions</p>
          </div>

          {status.message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 border rounded-lg text-sm text-center ${
                status.type === 'error'
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-secondary/10 border-secondary/20 text-secondary'
              }`}
            >
              {status.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 bg-slate-950 border ${
                  errors.email ? 'border-red-500' : 'border-slate-800'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-white placeholder-slate-500 transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-slate-400">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-secondary hover:text-secondary transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
