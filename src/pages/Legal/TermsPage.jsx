import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const TermsPage = () => {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-400">Last Updated: October 1, 2023</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert prose-emerald max-w-none prose-headings:text-white prose-a:text-secondary hover:prose-a:text-accent prose-p:leading-relaxed prose-li:leading-relaxed"
        >
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mt-0 mb-4">1. Agreement to Terms</h2>
            <p className="mb-6">
              These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Green Leaf Agencies ("Company", "we", "us", or "our"), concerning your access to and use of the Greenleaf Data Center platform as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Intellectual Property Rights</h2>
            <p className="mb-6">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. User Representations</h2>
            <p className="mb-4">By using the Site, you represent and warrant that:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
              <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Acceptable Use Policy (AUP)</h2>
            <p className="mb-6">
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Specifically, using our servers for spam, phishing, cryptocurrency mining, malicious attacks (DDoS), or hosting illegal content is strictly prohibited and will result in immediate termination without refund.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Service Level Agreement (SLA)</h2>
            <p className="mb-6">
              Our Services are backed by a 99.9% uptime guarantee. In the event of a failure to meet this SLA, you may be eligible for service credits. Scheduled maintenance is excluded from downtime calculations. The complete terms of our SLA are provided within your service contract upon purchasing an active service.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. KYC and Verification</h2>
            <p className="mb-6">
              To prevent abuse and comply with local regulations, we require all users to complete a Know Your Customer (KYC) verification process before purchasing our cloud and colocation services. This involves submitting valid, government-issued identification. We reserve the right to reject service to any individual or business failing to pass our verification checks.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Contact Us</h2>
            <p>
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
              <br /><br />
              <strong>Green Leaf Agencies</strong><br />
              Email: legal@greenleafdc.com<br />
              Phone: +91 90000 00000
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsPage;
