import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const SolutionHero = ({ solution, onExplore }) => {
  return (
    <section className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 bg-[#166E18] w-12"></div>
              <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">Solution</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              {solution.title}
            </h1>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl">
              {solution.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                className="px-8 py-4 text-base"
                onClick={onExplore}
              >
                Talk To Expert
              </Button>
              <Button
                variant="outline"
                className="px-8 py-4 text-base border-white text-white hover:bg-white hover:text-[#0F172A]"
              >
                Learn More
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-700">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-3xl font-bold text-[#166E18] mb-2">99.99%</div>
                <p className="text-gray-400 text-sm">Uptime SLA</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl font-bold text-[#166E18] mb-2">24/7</div>
                <p className="text-gray-400 text-sm">Expert Support</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-3xl font-bold text-[#166E18] mb-2">Global</div>
                <p className="text-gray-400 text-sm">Coverage</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Shape */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative h-96"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#166E18]/20 to-[#7C3AED]/20 rounded-3xl blur-3xl"></div>
            <div className="absolute inset-0 border border-[#166E18]/20 rounded-3xl"></div>
            <div className="absolute top-12 right-12 w-24 h-24 bg-[#166E18]/10 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionHero;
