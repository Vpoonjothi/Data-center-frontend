import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const RefundPolicyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-[#020817] min-h-screen text-slate-300 font-sans pb-20 pt-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={handleBack}
          className="mb-8 inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-accent hover:bg-secondary rounded-xl transition-colors shadow-lg shadow-secondary/20"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Refund & Cancellation Policy</h1>
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm font-medium">Last Updated: June 2026</span>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar / Table of Contents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full md:w-72 shrink-0 md:sticky top-28"
          >
            <div className="bg-[#0a1128] border border-gray-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Table of Contents</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#overview" className="text-slate-400 hover:text-secondary transition-colors">1. Overview</a></li>
                <li><a href="#service-cancellation" className="text-slate-400 hover:text-secondary transition-colors">2. Service Cancellation</a></li>
                <li><a href="#quote-cancellation" className="text-slate-400 hover:text-secondary transition-colors">3. Quote Cancellation</a></li>
                <li><a href="#refund-eligibility" className="text-slate-400 hover:text-secondary transition-colors">4. Refund Eligibility</a></li>
                <li><a href="#non-refundable-services" className="text-slate-400 hover:text-secondary transition-colors">5. Non-refundable Services</a></li>
                <li><a href="#payment-disputes" className="text-slate-400 hover:text-secondary transition-colors">6. Payment Disputes</a></li>
                <li><a href="#processing-timelines" className="text-slate-400 hover:text-secondary transition-colors">7. Processing Timelines</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-secondary transition-colors">8. Contact Information</a></li>
              </ul>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 max-w-4xl prose prose-invert prose-emerald max-w-none prose-headings:text-white prose-a:text-secondary hover:prose-a:text-accent prose-p:leading-relaxed prose-li:leading-relaxed"
          >
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-12 shadow-2xl">
              
              <section id="overview" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-0 mb-4 border-b border-gray-800 pb-2">1. Overview</h2>
                <p className="mb-6">
                  At Greenleaf Data Center, we strive to ensure customer satisfaction while maintaining the integrity and availability of our enterprise infrastructure. This Refund and Cancellation Policy outlines the conditions under which you may cancel your services and request a refund. By using our data center, colocation, dedicated server, or AI server services, you legally agree to this policy.
                </p>
              </section>

              <section id="service-cancellation" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">2. Service Cancellation</h2>
                <p className="mb-4">You may cancel your active services at any time through the Customer Dashboard or by submitting an official support ticket to our billing department. Please note the following strict notice periods:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                  <li><strong>Colocation Service Cancellation:</strong> Requires a minimum 30-day notice prior to your next billing cycle. Early termination of multi-month contracts may incur penalties as specified in your Master Services Agreement (MSA).</li>
                  <li><strong>Dedicated Server Cancellation:</strong> Must be requested at least 7 days before the renewal date. Server setups are non-refundable once deployed.</li>
                  <li><strong>AI Server Service Cancellation:</strong> Due to the high demand and resource allocation for GPU clusters, cancellations must be made 14 days prior to the end of your billing cycle.</li>
                </ul>
              </section>

              <section id="quote-cancellation" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">3. Quote Cancellation</h2>
                <p className="mb-6">
                  Customers may reject or cancel a generated Quote at any point prior to payment completion and KYC verification. Once a Quote has been paid, identity verification is completed, and the service provisioned, the terms of "Service Cancellation" strictly apply.
                </p>
              </section>

              <section id="refund-eligibility" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">4. Refund Eligibility</h2>
                <p className="mb-4">Refunds may be granted exclusively under the following verified circumstances:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                  <li>You canceled a service prior to its provisioning or deployment phase.</li>
                  <li>A verified billing error resulted in an overcharge on your account.</li>
                  <li>Severe and sustained failure to meet our strict SLA uptime guarantee, resulting in account termination instead of service credits (as verified by Greenleaf Data Center engineers).</li>
                </ul>
              </section>

              <section id="non-refundable-services" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">5. Non-refundable Services</h2>
                <p className="mb-4">The following fees, resources, and services are strictly non-refundable under any circumstances:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
                  <li>One-time setup, installation, and deployment fees.</li>
                  <li>IP address allocations and licensing fees.</li>
                  <li>Custom hardware procurement costs directly requested by the customer.</li>
                  <li>Services terminated or suspended due to violations of our Acceptable Use Policy or Terms of Service (e.g., spamming, hosting malicious content, non-compliance).</li>
                </ul>
              </section>

              <section id="payment-disputes" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">6. Payment Disputes & Chargebacks</h2>
                <p className="mb-6">
                  Initiating a chargeback or payment dispute with your bank, credit card provider, or payment gateway without first attempting to resolve the issue directly with our billing department is a severe violation of our terms. Such actions will result in the immediate and permanent suspension of all active services, deletion of data, and potential legal action to recover outstanding fees.
                </p>
              </section>

              <section id="processing-timelines" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">7. Processing Timelines</h2>
                <p className="mb-6">
                  Approved refunds will be processed back to the original method of payment within 7-14 business days, depending on your financial institution's processing times. We do not issue cash refunds. Service credits, if opted for instead of a refund, will be applied to your account balance immediately upon approval.
                </p>
              </section>

              <section id="contact" className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">8. Contact Information</h2>
                <div className="bg-[#020817] border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Green Leaf Agencies</h3>
                  <div className="text-sm font-medium text-slate-300 mb-6">Billing & Finance Department</div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Billing Support Email:</span>
                      <a href="mailto:billing@greenleafagencies.in" className="text-secondary hover:text-accent font-medium transition-colors">billing@greenleafagencies.in</a>
                    </div>
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Customer Support Email:</span>
                      <a href="mailto:support@greenleafagencies.in" className="text-secondary hover:text-accent font-medium transition-colors">support@greenleafagencies.in</a>
                    </div>
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Website:</span>
                      <a href="http://www.greenleafagencies.in" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent font-medium transition-colors">www.greenleafagencies.in</a>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 bg-[#0a1128] p-4 rounded-lg border border-gray-800/50">
                    To request a cancellation or refund, please open an official support ticket from your customer dashboard or contact our Billing Team directly.
                  </div>
                </div>
              </section>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default RefundPolicyPage;
