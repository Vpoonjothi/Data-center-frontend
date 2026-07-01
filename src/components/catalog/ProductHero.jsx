import React from 'react';
import { motion } from 'framer-motion';

const ProductHero = ({ title, subtitle, startingPrice, badgeText }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#020817] border-b border-gray-800">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                {badgeText}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              {title}
            </h1>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {startingPrice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-auto bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center min-w-[300px]"
            >
              <span className="text-slate-400 font-medium mb-2">Starting from</span>
              <div className="text-5xl font-bold text-white mb-2 flex items-start">
                <span className="text-2xl text-secondary mt-1">₹</span>
                {startingPrice}
                <span className="text-lg text-slate-500 self-end mb-1">/mo</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 text-center">Billed monthly. No long term commitment.</p>
              <button className="w-full py-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold transition-colors shadow-lg shadow-secondary/25">
                View Plans
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
