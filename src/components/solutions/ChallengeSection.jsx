import React from 'react';
import { motion } from 'framer-motion';

const ChallengeSection = ({ challenges }) => {
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
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4">
            Common Business Challenges
          </h2>
          <p className="text-[#64748B] text-lg max-w-3xl mx-auto">
            Understanding your infrastructure pain points
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              variants={itemVariants}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#166E18] transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-100 text-red-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 15.572 13m0 0a4 4 0 11-8.605-2.209m5.012-2.224a4 4 0 11-8 0m0 0a4 4 0 018 0" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A]">
                    {challenge.text}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ChallengeSection;
