import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary",
    secondary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
    outline: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
