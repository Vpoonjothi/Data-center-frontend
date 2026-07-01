import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const formatTitle = (pathname) => {
  // Extract the last segment of the path and format it
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Service';
  const lastSegment = segments[segments.length - 1];
  
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const GenericServicePage = () => {
  const location = useLocation();
  const title = formatTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#020817] pt-32 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mt-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Coming Soon
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary">{title}</span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            We are currently building the next generation of {title.toLowerCase()} infrastructure. 
            Our enterprise-grade solutions will offer unparalleled performance, security, and scalability.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-secondary text-white rounded-lg font-medium transition-colors shadow-lg shadow-secondary/25"
            >
              Contact Sales
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GenericServicePage;
