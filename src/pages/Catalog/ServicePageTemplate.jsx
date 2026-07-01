import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServiceData } from '../../data/catalog/serviceData';
import CatalogHero from '../../components/catalog/CatalogHero';
import ServiceOverview from '../../components/catalog/ServiceOverview';
import FeaturesSection from '../../components/catalog/FeaturesSection';
import BenefitsSection from '../../components/catalog/BenefitsSection';
import FAQSection from '../../components/catalog/FAQSection';
import ContactSalesForm from '../../components/catalog/ContactSalesForm';
import RelatedProducts from '../../components/catalog/RelatedProducts';
import ServiceCTA from '../../components/catalog/ServiceCTA';

const ServicePageTemplate = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // In a real app, this might be an API call. Here we use our static data getter.
    const fetchedData = getServiceData(slug);
    setData(fetchedData);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!data) return <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="bg-[#020817] min-h-screen">
      <CatalogHero {...data.hero} />
      <ServiceOverview overview={data.overview} />
      <FeaturesSection features={data.features} />
      <BenefitsSection benefits={data.benefits} />
      <FAQSection faqs={data.faqs} />
      <ContactSalesForm serviceName={data.name} />
      {data.relatedServices && <RelatedProducts products={data.relatedServices} />}
      <ServiceCTA />
    </div>
  );
};

export default ServicePageTemplate;
