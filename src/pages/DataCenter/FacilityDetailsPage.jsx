import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facilitiesData } from '../../data/facilitiesData';

import FacilityHero from '../../components/datacenter/FacilityHero';
import FacilityStats from '../../components/datacenter/FacilityStats';
import InfrastructureSection from '../../components/datacenter/InfrastructureSection';
import NetworkProvidersSection from '../../components/datacenter/NetworkProvidersSection';
import SecuritySection from '../../components/datacenter/SecuritySection';
import CertificationsSection from '../../components/datacenter/CertificationsSection';
import AvailableServicesSection from '../../components/datacenter/AvailableServicesSection';
import FacilityGallery from '../../components/datacenter/FacilityGallery';
import FAQSection from '../../components/datacenter/FAQSection';
import FacilityCTA from '../../components/datacenter/FacilityCTA';

const FacilityDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const facility = facilitiesData.find(f => f.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!facility) {
      navigate('/not-found');
    }
  }, [slug, facility, navigate]);

  if (!facility) return null;

  return (
    <div className="bg-white min-h-screen">
      <FacilityHero facility={facility} />
      
      {/* Facility Overview Section */}
      <section className="py-16 bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 -mt-8 rounded-t-3xl border-t border-gray-100">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Facility Overview</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {facility.description}
        </p>
      </section>

      <FacilityStats stats={facility.statistics} />
      
      <InfrastructureSection facility={facility} />
      
      <NetworkProvidersSection providers={facility.networkProviders} />
      
      <SecuritySection securityFeatures={facility.securityFeatures} />
      
      <CertificationsSection certifications={facility.certifications} />
      
      <AvailableServicesSection services={facility.availableServices} />
      
      <FacilityGallery gallery={facility.gallery} />
      
      <FAQSection faqs={facility.faqs} />
      
      <FacilityCTA facilityName={facility.facilityName} />
    </div>
  );
};

export default FacilityDetailsPage;
