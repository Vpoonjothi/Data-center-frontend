import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionTitle from '../common/SectionTitle';

const AvailableServicesSection = ({ services }) => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          subtitle="CAPABILITIES" 
          title="Available Services" 
          description="Deploy and scale your infrastructure with our comprehensive suite of data center services available at this facility."
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 transition-all group"
            >
              <div className="w-14 h-14 bg-emerald-50 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{service.name}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <Link to={`/services/${service.slug}`} className="inline-flex items-center font-semibold text-[#166E18] group-hover:text-emerald-700">
                Learn more
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableServicesSection;
