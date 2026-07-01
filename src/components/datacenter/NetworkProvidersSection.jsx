import React from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';

const NetworkProvidersSection = ({ providers }) => {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          subtitle="CONNECTIVITY" 
          title="Carrier Neutral Network Grid" 
          description="Connect seamlessly to major cloud providers, internet exchanges, and telecom carriers with our dense, high-performance network ecosystem."
          centered
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {providers.map((provider, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center aspect-square hover:shadow-md hover:border-secondary transition-all group"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <span className="text-xl font-bold text-gray-400 group-hover:text-accent">
                  {provider.name.charAt(0)}
                </span>
              </div>
              <h4 className="font-bold text-[#0F172A] mb-1">{provider.name}</h4>
              <span className="text-xs font-semibold text-[#166E18] uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-md">
                {provider.type}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NetworkProvidersSection;
