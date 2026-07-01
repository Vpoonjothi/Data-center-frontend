import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex w-full justify-start mt-2 mb-4">
      <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-[10px] bg-slate-900 flex-shrink-0 flex items-center justify-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.2)] border border-slate-700/50">
          <svg className="w-4 h-4 text-secondary drop-shadow-[0_0_5px_rgba(37,99,235,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <div className="px-4 py-3 bg-white border border-slate-200/80 rounded-2xl rounded-bl-sm shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex gap-1 items-center h-[38px]">
          <motion.div
            className="w-1.5 h-1.5 bg-slate-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-slate-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-slate-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
