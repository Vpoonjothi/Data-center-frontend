import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageBanner from '../../components/common/PageBanner';
import { solutionsData } from '../../data/solutionsData';

const SolutionsPage = () => {
  const navigate = useNavigate();

  const solutionIconMap = {
    'ai-machine-learning': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    ),
    'financial-services': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    'healthcare': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    ),
    'edge-computing': (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
    ),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-[#FFFFFF]">
      <PageBanner
        title="Industry Solutions"
        description="Tailored infrastructure solutions designed to meet the unique challenges of your enterprise."
      />
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {solutionsData.map((sol) => (
            <motion.div
              key={sol.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/solutions/${sol.slug}`)}
              className="flex flex-col bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.1)] transition-all duration-300 cursor-pointer group relative overflow-hidden h-full"
            >
              {/* Decorative Dot Grid */}
              <div className="absolute top-4 right-4 opacity-20">
                <div className="grid grid-cols-4 gap-1">
                  {new Array(16).fill(0).map((_, i) => (
                    <div key={`dot-${sol.id}-${i}`} className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  ))}
                </div>
              </div>

              <div className="w-14 h-14 rounded-xl bg-[#166E18] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                {solutionIconMap[sol.slug]}
              </div>

              <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#166E18] transition-colors">
                {sol.title}
              </h3>
              <p className="text-[#64748B] mb-6 flex-grow leading-relaxed text-sm">
                {sol.shortDescription}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/solutions/${sol.slug}`);
                }}
                className="text-[#166E18] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all hover:text-[#1e40af]"
              >
                Explore Solution
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SolutionsPage;
