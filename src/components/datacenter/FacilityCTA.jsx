import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FacilityCTA = ({ facilityName }) => {
  return (
    <section className="relative py-24 bg-[#0F172A] overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[160%] bg-accent/10 rotate-12 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[100%] bg-cyan-600/10 -rotate-12 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Deploy in <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-teal-400">{facilityName}</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Connect with our infrastructure specialists to discuss your requirements, request pricing, or schedule a comprehensive facility tour.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-[#166E18] hover:bg-accent text-white font-bold rounded-lg shadow-lg shadow-secondary/30 transition-all text-lg"
            >
              Request Pricing
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg backdrop-blur-sm transition-all text-lg"
            >
              Talk To Expert
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-transparent hover:bg-white/5 border border-transparent text-gray-300 hover:text-white font-bold rounded-lg transition-all text-lg underline underline-offset-4 decoration-gray-500 hover:decoration-white"
            >
              Schedule Facility Tour
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FacilityCTA;
