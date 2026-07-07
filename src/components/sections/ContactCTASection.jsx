import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContactCTASection = () => {
  const location = useLocation();
  const isConfiguratorPage = location.pathname === '/enterprise-servers' || location.pathname === '/ai-servers';

  return (
    <section className="py-20 bg-[#020617] relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-900/10 blur-[120px] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Ready to Deploy Your Server?</h2>
          <p className="text-[#64748B] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Contact our sales team today to configure the perfect infrastructure for your business needs. Fast provisioning, no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-[#166E18] hover:bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/25 flex items-center justify-center gap-2">
              Contact Sales
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            {isConfiguratorPage ? (
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-gray-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center"
              >
                Configure Server
              </button>
            ) : (
              <Link to="/enterprise-servers" className="bg-[#0F172A] border border-[#1E293B] hover:border-gray-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center">
                Configure Server
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTASection;
