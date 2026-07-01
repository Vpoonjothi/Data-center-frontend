import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'Enterprise Servers',
      slug: 'enterprise-servers',
      shortDescription: 'Custom-configured dedicated servers offering maximum control and security. Choose your CPU, RAM, and ultra-fast NVMe storage.',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
    },
    {
      id: 2,
      title: 'AI Servers',
      slug: 'ai-servers',
      shortDescription: 'Purpose-built infrastructure featuring the latest NVIDIA GPUs for machine learning, inference, and heavy rendering workloads.',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
    },
    {
      id: 3,
      title: 'Colocation',
      slug: 'colocation',
      shortDescription: 'Secure, reliable, and highly connected rack space for your critical IT infrastructure. Build your custom package today.',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
    }
  ];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gray-300 w-12"></div>
            <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">OUR SERVICES</span>
            <div className="h-px bg-gray-300 w-12"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0F172A] mb-5">
            Specialized Hosting Solutions
          </h2>
          <p className="text-[#64748B] text-lg">
            We provide bare-metal resources that give you total control and uncompromised power.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/${service.slug}`)}
            >
              <div className="w-14 h-14 rounded-xl bg-[#166E18] text-white flex items-center justify-center mb-8 shadow-md">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-4 group-hover:text-[#166E18] transition-colors">{service.title}</h3>
              <p className="text-[#64748B] mb-8 flex-grow leading-relaxed">
                {service.shortDescription}
              </p>
              <div className="text-[#166E18] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Configure Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
