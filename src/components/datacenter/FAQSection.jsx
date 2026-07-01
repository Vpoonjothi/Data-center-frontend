import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        className="w-full px-6 py-4 flex justify-between items-center bg-white focus:outline-none"
        onClick={onClick}
      >
        <span className="font-bold text-[#0F172A] text-left">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4">
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

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          subtitle="FAQ" 
          title="Frequently Asked Questions" 
          description="Find answers to common questions about this facility."
          centered
        />

        <div className="mt-12 flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
