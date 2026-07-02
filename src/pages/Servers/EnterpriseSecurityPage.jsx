import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import InfrastructureSection from '../../components/shared/InfrastructureSection';
import ContactCTASection from '../../components/sections/ContactCTASection';

const certifications = [
  { name: 'ISO 27001', desc: 'Information Security Management', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { name: 'SOC 2 Type II', desc: 'Security & Availability Controls', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { name: 'Tier III Certified', desc: '99.982% Uptime Guarantee', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { name: 'PCI DSS', desc: 'Payment Card Industry Security', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
];

const EnterpriseSecurityPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#020817] min-h-screen pt-24 pb-12 overflow-hidden relative">
      
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[
          { top: '15%', left: '5%', delay: 0, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
          { top: '40%', left: '90%', delay: 1.5, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { top: '75%', left: '10%', delay: 2.5, icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
          { top: '85%', left: '85%', delay: 0.5, icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-500/30"
            style={{ top: item.top, left: item.left }}
            animate={{ 
              y: [0, -40, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <svg className="w-32 h-32 md:w-48 md:h-48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={item.icon} />
            </svg>
          </motion.div>
        ))}
      </div>
      {/* 3. Interactive Infrastructure Explorer */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-20"
      >
        <InfrastructureSection />
      </motion.div>

     
      {/* 5. CTA Section */}
      <ContactCTASection />
      
    </div>
  );
};

export default EnterpriseSecurityPage;
