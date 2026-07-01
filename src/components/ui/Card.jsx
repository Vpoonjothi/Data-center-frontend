import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`bg-sectionBg/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-6 transition-all duration-300 ${hover ? 'hover:shadow-accent/5 hover:border-gray-700' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
