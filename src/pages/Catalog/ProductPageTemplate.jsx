import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductData } from '../../data/catalog/productData';
import ProductHero from '../../components/catalog/ProductHero';
import ProductTable from '../../components/catalog/ProductTable';
import PlanCard from '../../components/catalog/PlanCard';
import PricingCalculator from '../../components/calculator/PricingCalculator';
import FeatureComparison from '../../components/catalog/FeatureComparison';
import FAQSection from '../../components/catalog/FAQSection';
import ContactSalesForm from '../../components/catalog/ContactSalesForm';
import RelatedProducts from '../../components/catalog/RelatedProducts';
import ServiceCTA from '../../components/catalog/ServiceCTA';

const ProductPageTemplate = () => {
  const { category, slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchedData = getProductData(slug);
    setData(fetchedData);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!data) return <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="bg-[#020817] min-h-screen">
      <ProductHero {...data.hero} />
      
      {/* Dynamic Pricing / Product Display */}
      {slug === 'cloud-server' || category === 'cloud' ? (
        <PricingCalculator />
      ) : data.cards ? (
        <section className="py-20 bg-[#020817]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.cards.map((plan, idx) => (
                <PlanCard key={idx} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <ProductTable plans={data.plans} />
      )}

      <FeatureComparison features={data.features} />
      <FAQSection faqs={data.faqs} />
      <ContactSalesForm serviceName={data.name} />
      {data.relatedProducts && <RelatedProducts products={data.relatedProducts} />}
      <ServiceCTA />
    </div>
  );
};

export default ProductPageTemplate;
