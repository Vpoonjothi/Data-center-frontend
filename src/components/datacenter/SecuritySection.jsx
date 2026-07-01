import React from 'react';
import { motion } from 'framer-motion';

const SecuritySection = ({ securityFeatures }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4 border border-red-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              PHYSICAL SECURITY
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-6">Zero-Trust Enterprise Security</h2>
            <p className="text-gray-600 text-lg mb-8">
              Protecting your critical infrastructure is our top priority. Our facilities employ multi-layered security protocols, stringent access controls, and 24/7 on-site monitoring.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-2/3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-800">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
