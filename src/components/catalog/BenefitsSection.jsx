import React from 'react';
import { motion } from 'framer-motion';

const BenefitsSection = ({ benefits }) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-24 bg-slate-950 border-t border-gray-800 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Business Benefits</h2>
          <p className="text-lg text-slate-400">
            Transform your infrastructure to drive growth, efficiency, and compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-accent to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20 mb-6 text-white">
                {/* Fallback Icon */}
                {benefit.icon || (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
