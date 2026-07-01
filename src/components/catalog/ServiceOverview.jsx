import React from 'react';
import { motion } from 'framer-motion';

const ServiceOverview = ({ overview }) => {
  if (!overview) return null;

  return (
    <section className="py-20 bg-slate-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Service Overview</h2>
            <div className="space-y-6 text-lg text-slate-400">
              {overview.paragraphs?.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Enterprise Benefits</h3>
            <ul className="space-y-4">
              {overview.bullets?.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-6 h-6 text-secondary mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
