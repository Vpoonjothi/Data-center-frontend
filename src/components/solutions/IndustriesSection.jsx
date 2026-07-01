import React from 'react';
import { motion } from 'framer-motion';

const IndustriesSection = ({ industries, technologies }) => {
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
        {/* Industries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4 text-center">
            Industries Served
          </h2>
          <p className="text-[#64748B] text-lg max-w-3xl mx-auto text-center mb-12">
            Purpose-built solutions for diverse industry verticals
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[#F0F9FF] to-[#F5F3FF] rounded-xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {industry.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Technologies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4 text-center">
            Technology Stack
          </h2>
          <p className="text-[#64748B] text-lg max-w-3xl mx-auto text-center mb-12">
            Enterprise-grade technologies and integrations
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {technologies.map((tech) => (
              <motion.div
                key={tech.id}
                variants={itemVariants}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#166E18] text-center hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-24"
              >
                <p className="font-medium text-[#0F172A]">{tech.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustriesSection;
