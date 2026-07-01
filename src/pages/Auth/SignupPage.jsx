import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Mobile number must be at least 10 digits' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must read and agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const SignupPage = () => {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms: false,
    }
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      setIsLoading(true);
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        terms: data.terms,
      });
      // After successful signup, redirect to login page
      navigate('/login', { state: { message: 'Account created successfully. Please login to your portal.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Request Enterprise Server Quotes",
    "Request AI Server Configurations",
    "Request Colocation Services",
    "Track Enquiry Status",
    "Complete KYC Verification",
    "Access Customer Dashboard"
  ];

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full flex flex-col md:flex-row bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        {/* Left Side: Account Benefits */}
        <div className="w-full md:w-5/12 bg-slate-900/50 p-10 lg:p-12 border-r border-gray-800 flex flex-col justify-center">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1A801D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-heading font-bold text-white leading-none block">
                  Greenleaf
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#1A801D] font-bold uppercase block mt-0.5">
                  Agencies
                </span>
              </div>
            </Link>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
            Enterprise Customer Portal
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed">
            Create your Greenleaf account to request quotes, manage enquiries, complete verification requirements, and access future service management features.
          </p>
          
          <ul className="space-y-5">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center text-slate-300">
                <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mr-4 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium text-sm lg:text-base">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-[11px] text-slate-500 italic leading-tight">
            * Additional service management, billing, and support features will become available after service activation.
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full md:w-7/12 p-10 lg:p-12">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
            <p className="text-slate-400 text-sm">Join thousands of businesses trusting Greenleaf.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-4 py-2.5 bg-slate-900 border ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-white placeholder-slate-500 transition-colors`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-2.5 bg-slate-900 border ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-white placeholder-slate-500 transition-colors`}
                  placeholder="name@company.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className={`w-full px-4 py-2.5 bg-slate-900 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-white placeholder-slate-500 transition-colors`}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className={`w-full px-4 py-2.5 bg-slate-900 border ${
                      errors.password ? 'border-red-500' : 'border-gray-700'
                    } rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-white placeholder-slate-500 transition-colors pr-12`}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmPassword')}
                    className={`w-full px-4 py-2.5 bg-slate-900 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    } rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-white placeholder-slate-500 transition-colors pr-12`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('terms')}
                    className="w-4 h-4 rounded border-gray-700 bg-slate-900 text-accent focus:ring-secondary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <span className="text-slate-400">
                    I have read and agree to the{' '}
                    <Link to="/terms-of-service" className="font-medium text-secondary hover:text-secondary transition-colors">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="font-medium text-secondary hover:text-secondary transition-colors">Privacy Policy</Link>.
                  </span>
                </div>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-400 ml-7">{errors.terms.message}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center md:text-left">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-secondary hover:text-secondary transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
