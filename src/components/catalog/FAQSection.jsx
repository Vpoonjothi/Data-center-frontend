import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-gray-800 rounded-xl mb-4 bg-slate-900/50 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <span className={`ml-4 shrink-0 transition-transform duration-200 text-secondary ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-gray-800/50 mt-2 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 bg-[#020817]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-400">Everything you need to know about our services.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
