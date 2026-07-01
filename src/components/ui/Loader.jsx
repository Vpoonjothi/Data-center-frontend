import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full"
      />
    </div>
  );
};

export default Loader;
