import React, { useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { servicesData } from '../../data/servicesData';
import PageBanner from '../../components/common/PageBanner';
import Button from '../../components/ui/Button';

const ServiceDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find the service based on slug
  const service = useMemo(() => {
    return servicesData.find(s => s.slug === slug);
  }, [slug]);

  // If service not found, redirect to services page
  if (!service) {
    return <Navigate to="/services" />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <button 
              onClick={() => navigate('/')}
              className="text-[#166E18] hover:text-emerald-700 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button 
              onClick={() => navigate('/services')}
              className="text-[#166E18] hover:text-emerald-700 transition-colors"
            >
              Services
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">{service.title}</span>
          </motion.nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-[#0F172A]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={service.heroImage} 
            alt={service.title} 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 bg-[#166E18] w-12"></div>
                <span className="text-[#166E18] font-bold text-sm tracking-wider uppercase">Enterprise Solutions</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 leading-tight">
                {service.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-medium">
                {service.shortDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary"
                  className="px-8 py-4 text-base shadow-lg shadow-secondary/30"
                  onClick={() => navigate('/contact')}
                >
                  Request Pricing
                </Button>
                <Button 
                  variant="outline"
                  className="px-8 py-4 text-base border-white text-white hover:bg-white hover:text-[#0F172A] backdrop-blur-sm"
                  onClick={() => navigate('/contact')}
                >
                  Talk To Infrastructure Expert
                </Button>
              </div>
            </motion.div>

            {/* Key Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:block hidden"
            >
               <div className="grid grid-cols-2 gap-4">
                 {service.metrics?.map((metric, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                      <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary mb-2">{metric.value}</div>
                      <div className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{metric.label}</div>
                    </div>
                 ))}
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0F172A] mb-8">
              Strategic Business Value
            </h2>
            <p className="text-[#475569] text-xl leading-relaxed">
              {service.fullDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0F172A] mb-4">
              Core Capabilities
            </h2>
            <p className="text-[#64748B] text-lg max-w-3xl mx-auto">
              Engineered for reliability, scale, and performance
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {service.features?.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all group"
              >
                <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#166E18] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#64748B] mb-6">
                  {feature.description}
                </p>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <span className="block text-xs font-bold text-[#166E18] uppercase tracking-wider mb-1">Business Value</span>
                  <p className="text-sm font-medium text-gray-800">{feature.businessValue}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Infrastructure Architecture */}
      {service.infrastructure && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4">
                Architecture & Controls
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Deep dive into the physical and logical layers supporting this service.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Power Architecture', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: service.infrastructure.power },
                { title: 'Cooling Design', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', desc: service.infrastructure.cooling },
                { title: 'Network Topology', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', desc: service.infrastructure.network },
                { title: 'Security Controls', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', desc: service.infrastructure.security }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works / Process */}
      {service.process && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0F172A] mb-4">
                Deployment Methodology
              </h2>
              <p className="text-[#64748B] text-lg max-w-3xl mx-auto">
                Our structured approach to ensuring successful enterprise implementations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {service.process?.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-0 text-6xl font-black text-gray-100 -z-10 leading-none">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2 mt-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust & Compliance */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0F172A] mb-6">
                Why Enterprises Choose Us
              </h2>
              <ul className="space-y-4 mb-10">
                {service.whyChooseUs?.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg font-semibold text-gray-800">{reason}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-emerald-50 text-[#166E18] rounded-xl flex items-center justify-center">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-bold text-[#0F172A]">Compliance & Certifications</h3>
              </div>
              <p className="text-gray-600 mb-8">
                We strictly adhere to international regulatory standards, ensuring your infrastructure meets the rigorous compliance demands of modern enterprise auditing.
              </p>
              <div className="flex flex-wrap gap-3">
                {service.compliance?.map((cert, idx) => (
                  <span key={idx} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shadow-sm">
                    {cert}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {service.caseStudies && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#0F172A] mb-4">
                Enterprise Success Stories
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
              {service.caseStudies?.map((study, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-emerald-100 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="text-sm font-bold text-[#166E18] uppercase tracking-wider mb-2">The Challenge</h4>
                      <p className="text-gray-700 font-medium">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#166E18] uppercase tracking-wider mb-2">Our Solution</h4>
                      <p className="text-gray-700 font-medium">{study.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">The Outcome</h4>
                      <p className="text-gray-700 font-bold">{study.outcome}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[160%] bg-accent/20 rotate-12 blur-3xl rounded-full pointer-events-none"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6">
              Ready to Architect Your Solution?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Engage with our infrastructure architects to design a resilient, high-performance environment tailored to your specific business requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary"
                className="px-10 py-4 text-lg font-bold shadow-lg shadow-secondary/30"
                onClick={() => navigate('/contact')}
              >
                Request Architecture Review
              </Button>
              <Button 
                variant="outline"
                className="px-10 py-4 text-lg font-bold border-white text-white hover:bg-white hover:text-[#0F172A]"
                onClick={() => navigate('/contact')}
              >
                Schedule Facility Tour
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetailsPage;
