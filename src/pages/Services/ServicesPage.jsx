import React from 'react';
import PageBanner from '../../components/common/PageBanner';
import ServicesSection from '../../components/sections/ServicesSection';
import { servicesData } from '../../data/servicesData';

const ServicesPage = () => {
  return (
    <div>
      <PageBanner 
        title="Our Services" 
        description="Comprehensive colocation and cloud connectivity solutions." 
      />
      <ServicesSection />
    </div>
  );
};

export default ServicesPage;
