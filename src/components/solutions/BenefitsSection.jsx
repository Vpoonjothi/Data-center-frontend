import React from 'react';
import { motion } from 'framer-motion';

const BenefitsSection = ({ benefits }) => {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4">
            Business Benefits
          </h2>
          <p className="text-[#64748B] text-lg max-w-3xl mx-auto">
            Transform your infrastructure with measurable impact
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-[#EFF6FF] to-[#F5F3FF] rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#166E18] text-white mx-auto mb-4">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                {benefit.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
