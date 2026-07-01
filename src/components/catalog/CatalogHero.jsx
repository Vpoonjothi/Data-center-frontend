import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CatalogHero = ({ title, subtitle, badgeText, ctaPrimary, ctaSecondary }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#020817]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              {badgeText}
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            {title}
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctaPrimary && (
              <Link
                to={ctaPrimary.link || '#'}
                className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-secondary text-white rounded-lg font-medium transition-colors shadow-lg shadow-secondary/25 flex items-center justify-center gap-2"
              >
                {ctaPrimary.text}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            )}
            {ctaSecondary && (
              <a
                href={ctaSecondary.link || '#contact-sales'}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {ctaSecondary.text}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CatalogHero;
