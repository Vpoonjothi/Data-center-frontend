import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import PageBanner from '../../components/common/PageBanner';
import { submitEnquiry } from '../../services/api';
import { COMPANY_INFO } from '../../constants/companyInfo';

const schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      
      const payload = { ...data, type: 'contact' };
      const res = await submitEnquiry(payload);
      
      if (res.success) {
        setSuccessMsg('Your message has been successfully sent! We will get back to you shortly.');
        reset();
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMsg('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF]">
      <PageBanner 
        title="Contact Sales" 
        description="Get in touch with our experts to discuss your data center needs." 
      />
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gray-300 w-12"></div>
            <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">GET IN TOUCH</span>
            <div className="h-px bg-gray-300 w-12"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0F172A]">Let's build something together.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#64748B] mb-10 leading-relaxed text-lg">
              Whether you need a single rack or a custom built private suite, our team is ready to design the perfect solution for your enterprise.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#166E18]/10 rounded-xl flex items-center justify-center text-[#166E18] shadow-sm border border-[#166E18]/20">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-lg mb-1">Global Headquarters</p>
                  <p className="text-[#64748B]">{COMPANY_INFO.address}</p>
                </div>
              </div>

              {COMPANY_INFO.gstin && (
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-[#166E18]/10 rounded-xl flex items-center justify-center text-[#166E18] shadow-sm border border-[#166E18]/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] text-lg mb-1">GSTIN</p>
                    <p className="text-[#64748B]">{COMPANY_INFO.gstin}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-600 p-4 rounded-xl text-sm font-medium">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500 text-red-600 p-4 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Full Name</label>
                <input 
                  className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#166E18]/50 transition-colors ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#166E18]'
                  }`}
                  placeholder="John Doe" 
                  {...register('name')} 
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Email Address</label>
                <input 
                  type="email"
                  className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#166E18]/50 transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#166E18]'
                  }`}
                  placeholder="john@company.com" 
                  {...register('email')} 
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Company</label>
                <input 
                  className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#166E18]/50 transition-colors ${
                    errors.company ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#166E18]'
                  }`}
                  placeholder="Company Name" 
                  {...register('company')} 
                />
                {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Message</label>
                <textarea
                  className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#166E18]/50 transition-colors ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#166E18]'
                  }`}
                  rows="5"
                  placeholder="Tell us about your infrastructure needs..."
                  {...register('message')}
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-[#166E18] hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/30"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
