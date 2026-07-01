import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';

const FeatureList = ({ title, items, icon }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#166E18] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#0F172A]">{title}</h3>
    </div>
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="text-gray-600 font-medium">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const InfrastructureSection = ({ facility }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          subtitle="INFRASTRUCTURE" 
          title="Engineered for Reliability" 
          description="Our facilities are built with state-of-the-art power, cooling, and network systems to ensure maximum uptime and performance for your mission-critical workloads."
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FeatureList 
              title="Power Systems" 
              items={facility.powerSystems}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeatureList 
              title="Cooling Systems" 
              items={facility.coolingSystems}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              }
            />
          </motion.div>
        </div>

        {/* General Features Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-[#0F172A] mb-10">Facility Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {facility.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <div className="w-10 h-10 mx-auto bg-emerald-100 text-accent rounded-full flex items-center justify-center mb-3">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                   </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureSection;
