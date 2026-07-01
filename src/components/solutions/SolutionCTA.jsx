import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const SolutionCTA = ({ onContact }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0F172A] to-[#1E293B] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to Transform Your Infrastructure?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Let our enterprise solutions experts guide you through a personalized infrastructure transformation journey tailored to your business needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              className="px-10 py-4 text-base"
              onClick={onContact}
            >
              Request Consultation
            </Button>
            <Button
              variant="outline"
              className="px-10 py-4 text-base border-white text-white hover:bg-white hover:text-[#0F172A]"
            >
              Schedule Call
            </Button>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-12 border-t border-gray-700 flex flex-wrap justify-center gap-8 items-center"
          >
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Enterprise Grade</p>
              <p className="text-white font-semibold">99.99% SLA</p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-gray-700"></div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Global Presence</p>
              <p className="text-white font-semibold">Multi-Region Support</p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-gray-700"></div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Compliance Certified</p>
              <p className="text-white font-semibold">ISO 27001 • SOC 2</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionCTA;
