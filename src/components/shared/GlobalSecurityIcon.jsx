import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const GlobalSecurityIcon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the icon if we are already on the enterprise-security page
  if (location.pathname === '/enterprise-security') {
    return null;
  }

  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-[100]"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="relative group cursor-pointer" onClick={() => navigate('/enterprise-security')}>
        {/* Pulsing Outer Glow */}
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 group-hover:scale-150 transition-all duration-700 animate-pulse pointer-events-none" />
        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-50 group-hover:opacity-80 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
        
        {/* Button Container */}
        <motion.div 
          className="relative flex items-center justify-center w-16 h-16 bg-[#020817] rounded-full border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glassmorphism inner shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          {/* Icon */}
          <svg className="w-8 h-8 text-emerald-400 group-hover:text-white transition-colors duration-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          
          {/* Tooltip */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-4 py-2 bg-gray-900 border border-emerald-500/30 text-emerald-300 text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
            Enterprise Security
            <div className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 border-8 border-transparent border-l-gray-900 border-l-[10px]" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GlobalSecurityIcon;
