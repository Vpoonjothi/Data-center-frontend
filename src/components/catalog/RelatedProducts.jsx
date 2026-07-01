import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RelatedProducts = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-[#020817] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">Related Services</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={product.path} 
                className="block bg-slate-900 border border-gray-800 hover:border-secondary/50 rounded-xl p-6 transition-all group hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-secondary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-400">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-secondary">
                  Learn more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
