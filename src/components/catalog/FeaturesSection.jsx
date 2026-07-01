import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-24 bg-[#020817]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
          <p className="text-lg text-slate-400">
            Enterprise-grade capabilities engineered for scale, security, and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 border border-gray-800 hover:border-secondary/50 rounded-2xl p-6 transition-colors group"
            >
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {/* SVG Icon (Using a generic cube if specific icon not provided) */}
                {feature.icon || (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
