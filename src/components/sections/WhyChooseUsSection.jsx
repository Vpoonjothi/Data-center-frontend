import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseUsSection = () => {
  const reasons = [
    {
      title: "High Performance Hardware",
      desc: "We utilize the latest generation of processors, DDR5 memory, and NVMe storage to ensure your applications run at peak speed.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      )
    },
    {
      title: "Enterprise Reliability",
      desc: "Our server infrastructure is built with enterprise-grade components, ensuring maximum uptime for mission-critical deployments.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      )
    },
    {
      title: "24/7 Support",
      desc: "Get direct access to our technical support team around the clock. Real engineers ready to help you resolve issues quickly.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )
    },
    {
      title: "Fast Deployment",
      desc: "Don't wait weeks for infrastructure. Our standardized bare-metal systems are provisioned and handed over to you rapidly.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-24 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gray-700 w-12"></div>
            <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">WHY CHOOSE US</span>
            <div className="h-px bg-gray-700 w-12"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-5 text-white">
            The Greenleaf Difference
          </h2>
          <p className="text-[#64748B] text-lg">
            We deliver the performance, security, and scalability that modern businesses require.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {reasons.map((reason, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl hover:border-[#166E18]/50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#166E18]/10 rounded-xl flex items-center justify-center text-[#166E18] mb-6 group-hover:scale-110 transition-transform">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{reason.title}</h3>
              <p className="text-[#64748B] leading-relaxed text-sm">{reason.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
