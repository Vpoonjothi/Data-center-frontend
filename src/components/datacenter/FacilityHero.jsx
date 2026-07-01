import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FacilityHero = ({ facility }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#0F172A]">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={facility.heroImage} 
          alt={facility.facilityName} 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Breadcrumbs */}
          <nav className="flex mb-6 text-sm font-medium text-gray-400">
            <Link to="/data-center" className="hover:text-white transition-colors">Data Center</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">Facilities</span>
            <span className="mx-2">/</span>
            <span className="text-[#166E18]">{facility.id}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            {facility.status}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            {facility.facilityName}
          </h1>
          <p className="text-xl text-gray-300 mb-8 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#166E18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {facility.city}, {facility.state}, {facility.country}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Power Capacity</p>
              <p className="text-2xl font-bold text-white">{facility.capacity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Tier Level</p>
              <p className="text-2xl font-bold text-white">{facility.tier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Uptime SLA</p>
              <p className="text-2xl font-bold text-white">{facility.uptime}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="px-8 py-3 bg-[#166E18] hover:bg-accent text-white font-semibold rounded-lg shadow-lg shadow-secondary/30 transition-all">
              Request Quote
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all">
              Schedule Tour
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacilityHero;
