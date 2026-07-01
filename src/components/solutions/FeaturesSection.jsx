import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = ({ features, overview }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4">
            Solution Overview
          </h2>
          <p className="text-[#64748B] text-lg max-w-3xl mx-auto">
            Comprehensive features designed for enterprise success
          </p>
        </motion.div>

        {/* Overview Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 mb-12"
        >
          <p className="text-[#64748B] text-lg leading-relaxed">
            {overview}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-[#0F172A] mb-8"
          >
            Key Features
          </motion.h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#166E18] hover:shadow-lg transition-all duration-300 flex items-start gap-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#EFF6FF] text-[#166E18]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {feature.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
