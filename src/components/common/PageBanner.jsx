import React from 'react';
import { motion } from 'framer-motion';

const PageBanner = ({ title, description }) => {
  return (
    <div className="bg-primary pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PageBanner;
