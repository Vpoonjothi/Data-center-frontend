import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 text-center"
  >
    <div className="text-3xl md:text-4xl font-extrabold text-[#166E18] mb-2">{value}</div>
    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
  </motion.div>
);

const FacilityStats = ({ stats }) => {
  return (
    <section className="py-12 bg-gray-50 -mt-10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard value={`${stats.capacity} MW`} label="Capacity" delay={0.1} />
          <StatCard value={stats.uptime} label="Uptime" delay={0.2} />
          <StatCard value={`${stats.cabinets}+`} label="Cabinets" delay={0.3} />
          <StatCard value={`${stats.carriers}+`} label="Carriers" delay={0.4} />
          <StatCard value={stats.monitoring} label="Monitoring" delay={0.5} />
        </div>
      </div>
    </section>
  );
};

export default FacilityStats;
