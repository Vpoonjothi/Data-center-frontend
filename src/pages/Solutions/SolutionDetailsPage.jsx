import React, { useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { solutionsData } from '../../data/solutionsData';
import SolutionHero from '../../components/solutions/SolutionHero';
import ChallengeSection from '../../components/solutions/ChallengeSection';
import FeaturesSection from '../../components/solutions/FeaturesSection';
import BenefitsSection from '../../components/solutions/BenefitsSection';
import IndustriesSection from '../../components/solutions/IndustriesSection';
import FAQSection from '../../components/solutions/FAQSection';
import SolutionCTA from '../../components/solutions/SolutionCTA';

const SolutionDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find the solution based on slug
  const solution = useMemo(() => {
    return solutionsData.find(s => s.slug === slug);
  }, [slug]);

  // If solution not found, redirect to solutions page
  if (!solution) {
    return <Navigate to="/solutions" />;
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm"
          >
            <button
              onClick={() => navigate('/')}
              className="text-[#166E18] hover:underline transition-colors"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate('/solutions')}
              className="text-[#166E18] hover:underline transition-colors"
            >
              Solutions
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{solution.title}</span>
          </motion.nav>
        </div>
      </div>

      {/* Hero Section */}
      <SolutionHero
        solution={solution}
        onExplore={() => navigate('/contact')}
      />

      {/* Business Challenges Section */}
      <ChallengeSection challenges={solution.businessChallenges} />

      {/* Solution Overview & Features Section */}
      <FeaturesSection
        features={solution.features}
        overview={solution.solutionOverview}
      />

      {/* Benefits Section */}
      <BenefitsSection benefits={solution.benefits} />

      {/* Industries & Technologies Section */}
      <IndustriesSection
        industries={solution.industries}
        technologies={solution.technologies}
      />

      {/* FAQ Section */}
      <FAQSection faqs={solution.faqs} />

      {/* CTA Section */}
      <SolutionCTA onContact={() => navigate('/contact')} />

      {/* Related Solutions */}
      <RelatedSolutions currentId={solution.id} navigate={navigate} />
    </div>
  );
};

const RelatedSolutions = ({ currentId, navigate }) => {
  const relatedSolutions = solutionsData.filter(s => s.id !== currentId);

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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-4">
            Explore Other Solutions
          </h2>
          <p className="text-[#64748B] text-lg max-w-3xl mx-auto">
            Discover our comprehensive suite of industry-specific solutions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {relatedSolutions.map((sol) => (
            <motion.div
              key={sol.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/solutions/${sol.slug}`)}
              className="bg-gradient-to-br from-[#F0F9FF] to-[#F5F3FF] rounded-2xl p-8 border border-gray-200 hover:border-[#166E18] hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <h3 className="text-2xl font-bold text-[#0F172A] mb-3 group-hover:text-[#166E18] transition-colors">
                {sol.title}
              </h3>
              <p className="text-[#64748B] mb-6 leading-relaxed">
                {sol.shortDescription}
              </p>
              <div className="text-[#166E18] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore Solution
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionDetailsPage;
