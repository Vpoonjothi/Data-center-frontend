import React from 'react';
import { motion } from 'framer-motion';
import PageBanner from '../../components/common/PageBanner';

const AboutPage = () => {
  return (
    <div className="bg-[#FFFFFF]">
      <PageBanner 
        title="About Greenleaf" 
        description="Pioneering the future of enterprise-grade, hyper-scalable data center infrastructure." 
      />
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-gray-300 w-12"></div>
              <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">OUR VISION</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-6 text-[#0F172A]">Empowering the Digital Future</h2>
            <p className="text-[#64748B] mb-6 leading-relaxed text-lg">
              Founded in 2024, Greenleaf was built on a singular vision: to create the most intelligent, efficient, and resilient data centers on the planet. We recognized that the explosion of data and cloud computing requires a fundamentally different approach to digital infrastructure.
            </p>
            <p className="text-[#64748B] leading-relaxed text-lg">
              Today, we operate over 2.5 million square feet of white space globally, powered by 100% renewable energy and managed by our proprietary automation platform.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#166E18]/10 translate-x-4 translate-y-4 rounded-2xl z-0"></div>
            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop" alt="Global Network" className="rounded-2xl relative z-10 shadow-xl object-cover h-[500px] w-full" />
          </motion.div>
        </div>

        <div className="mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 text-[#0F172A]">Our Core Values</h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">The principles that drive our operations and ensure your success.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.1)] transition-all"
            >
              <div className="w-14 h-14 bg-[#166E18] rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Relentless Innovation</h3>
              <p className="text-[#64748B] leading-relaxed">We constantly push the boundaries of what's possible in thermal management, power distribution, and network architecture.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.1)] transition-all"
            >
              <div className="w-14 h-14 bg-[#166E18] rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Uncompromising Security</h3>
              <p className="text-[#64748B] leading-relaxed">Security isn't an afterthought. Our zero-trust physical and digital security protocols are the most rigorous in the industry.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.1)] transition-all"
            >
              <div className="w-14 h-14 bg-[#166E18] rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Sustainable Future</h3>
              <p className="text-[#64748B] leading-relaxed">We are committed to net-zero emissions, utilizing liquid cooling and advanced power routing to achieve industry-leading PUE.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
