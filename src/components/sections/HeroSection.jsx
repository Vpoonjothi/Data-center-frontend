import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DynamicContent from '../shared/DynamicContent';

const HeroSection = () => {
  return (
    <div className="relative bg-[#020617] text-white pt-24 pb-32 lg:pb-48 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-y-0 right-0 w-full lg:w-3/5 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/90 to-transparent z-10 hidden lg:block"></div>
        <div className="absolute inset-0 bg-[#020617]/80 lg:hidden z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop" 
          alt="Data Center Servers" 
          className="h-full w-full object-cover object-center lg:object-left mix-blend-screen opacity-60 lg:opacity-100"
        />
        <div className="absolute inset-0 bg-[#166E18]/10 mix-blend-overlay z-0"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="lg:w-3/5 pt-12 lg:pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-[64px] font-heading font-extrabold text-white mb-6 leading-[1.1] tracking-tight"
          >
            <DynamicContent contentKey="home.hero.title_start" fallback="High-Performance" /> <br />
            <span className="text-[#166E18]">
              <DynamicContent contentKey="home.hero.title_highlight" fallback="Server Infrastructure" />
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-[#64748B] mb-10 max-w-xl leading-relaxed font-normal"
          >
            <DynamicContent contentKey="home.hero.subtitle" fallback="Greenleaf delivers reliable, scalable, and secure dedicated servers engineered for your most demanding enterprise and AI workloads." />
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/enterprise-servers" className="bg-[#166E18] hover:bg-emerald-700 text-white px-7 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
              Enterprise Servers
            </Link>
            <Link to="/ai-servers" className="bg-[#0F172A] border border-[#1E293B] text-white hover:border-gray-500 hover:bg-[#1E293B] px-7 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
              AI Servers
            </Link>
            <Link to="/colocation" className="bg-[#0F172A] border border-[#1E293B] text-white hover:border-gray-500 hover:bg-[#1E293B] px-7 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
              Colocation
            </Link>
            <Link to="/contact" className="bg-transparent text-white hover:underline px-4 py-3 font-medium transition-colors flex items-center gap-2 text-sm ml-2">
              Get Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
