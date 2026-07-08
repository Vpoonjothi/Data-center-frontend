import React from 'react';
import { motion } from 'framer-motion';

const AboutUsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-secondary w-12"></div>
            <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">ABOUT GREENLEAF</span>
            <div className="h-px bg-secondary w-12"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A]">
            Dedicated Infrastructure for Modern Workloads
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#64748B] text-lg leading-relaxed mb-6">
              Greenleaf is a specialized server provider dedicated to delivering uncompromising performance. We cut through the industry noise to focus on what matters most to your business: high-quality hardware, rock-solid reliability, and expert support that's there when you need it.
            </p>
            <p className="text-[#64748B] text-lg leading-relaxed">
              Whether you need customizable Enterprise Servers for scaling web applications or dedicated GPU infrastructure for demanding AI inference, our systems are engineered to keep your critical workloads running 24/7.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#166E18]/10 rounded-3xl translate-x-4 translate-y-4 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              alt="Server Racks" 
              className="rounded-3xl shadow-xl w-full object-cover h-[400px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
