import React from 'react';
import { motion } from 'framer-motion';

const FAQSection = ({ faqs }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#64748B] text-lg">
            Find answers to common questions about our solution
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq) => (
            <motion.details
              key={faq.id}
              variants={itemVariants}
              className="group bg-white rounded-lg border border-gray-200 hover:border-[#166E18] transition-all duration-300 overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-[#F0F9FF] transition-colors">
                <h3 className="text-lg font-semibold text-[#0F172A] pr-4">
                  {faq.question}
                </h3>
                <svg className="w-5 h-5 text-[#166E18] flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </summary>
              <div className="px-6 pb-6 pt-0 text-[#64748B] leading-relaxed border-t border-gray-100">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
