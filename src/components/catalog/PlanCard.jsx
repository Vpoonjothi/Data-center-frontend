import React from 'react';
import { motion } from 'framer-motion';

const PlanCard = ({ plan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
        plan.isPopular 
          ? 'bg-gradient-to-b from-emerald-900/40 to-slate-900 border-secondary/50 shadow-2xl shadow-emerald-900/20 transform md:-translate-y-4' 
          : 'bg-slate-900/80 border-gray-800 hover:border-gray-700'
      }`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-slate-400 text-sm mb-6 h-10">{plan.description}</p>
      
      <div className="mb-8">
        <span className="text-4xl font-extrabold text-white">₹{plan.price}</span>
        <span className="text-slate-500 font-medium">/mo</span>
      </div>

      <button className={`w-full py-3.5 rounded-xl font-bold transition-colors mb-8 ${
        plan.isPopular
          ? 'bg-accent hover:bg-secondary text-white shadow-lg shadow-secondary/25'
          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
      }`}>
        Choose Plan
      </button>

      <div className="flex flex-col gap-4 flex-grow">
        <span className="text-sm font-semibold text-white uppercase tracking-wider">Top Features</span>
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start">
            <svg className="w-5 h-5 text-secondary mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-slate-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PlanCard;
