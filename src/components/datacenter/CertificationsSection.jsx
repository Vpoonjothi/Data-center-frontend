import React from 'react';
import { motion } from 'framer-motion';

const CertificationsSection = ({ certifications }) => {
  return (
    <section className="py-20 bg-[#0F172A] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Compliance & Certifications</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our facilities are audited to meet the highest international standards for security, quality, and environmental management.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="px-6 py-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <span className="font-bold text-secondary tracking-wider">{cert}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
