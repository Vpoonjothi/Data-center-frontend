import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCTA = ({ title, subtitle, ctaText, ctaLink }) => {
  return (
    <section className="py-20 relative overflow-hidden bg-accent">
      {/* Decorative SVG Patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {title || "Ready To Transform Your Infrastructure?"}
        </h2>
        <p className="text-xl text-emerald-100 mb-10">
          {subtitle || "Deploy enterprise-grade solutions in minutes. Talk to our experts today."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={ctaLink || '/contact'}
            className="px-8 py-4 bg-white text-accent hover:bg-gray-100 rounded-lg font-bold text-lg transition-colors shadow-xl"
          >
            {ctaText || "Talk To Sales"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCTA;
