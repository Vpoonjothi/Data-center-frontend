import React from 'react';
import HeroSection from '../../components/sections/HeroSection';
import AboutUsSection from '../../components/sections/AboutUsSection';
import ServicesSection from '../../components/sections/ServicesSection';
import WhyChooseUsSection from '../../components/sections/WhyChooseUsSection';
import ContactCTASection from '../../components/sections/ContactCTASection';

const HomePage = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <AboutUsSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ContactCTASection />
    </div>
  );
};

export default HomePage;
