import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#020817] min-h-screen text-slate-300 font-sans pb-20 pt-8 lg:pt-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-end mb-8">
          <button 
            onClick={handleBack}
            className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-accent hover:bg-secondary rounded-xl transition-colors shadow-lg shadow-secondary/20"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
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
                <li><a href="#information-we-collect" className="text-slate-400 hover:text-secondary transition-colors">1. Information We Collect</a></li>
                <li><a href="#data-collection-methods" className="text-slate-400 hover:text-secondary transition-colors">2. Data Collection Methods</a></li>
                <li><a href="#data-center-access-records" className="text-slate-400 hover:text-secondary transition-colors">3. Data Center Access Records</a></li>
                <li><a href="#how-we-use-information" className="text-slate-400 hover:text-secondary transition-colors">4. How We Use Information</a></li>
                <li><a href="#data-security" className="text-slate-400 hover:text-secondary transition-colors">5. Data Security</a></li>
                <li><a href="#data-sharing" className="text-slate-400 hover:text-secondary transition-colors">6. Data Sharing</a></li>
                <li><a href="#data-retention" className="text-slate-400 hover:text-secondary transition-colors">7. Data Retention</a></li>
                <li><a href="#customer-rights" className="text-slate-400 hover:text-secondary transition-colors">8. Customer Rights</a></li>
                <li><a href="#cookies-technologies" className="text-slate-400 hover:text-secondary transition-colors">9. Cookies & Website Technologies</a></li>
                <li><a href="#policy-changes" className="text-slate-400 hover:text-secondary transition-colors">10. Policy Changes</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-secondary transition-colors">11. Contact Information</a></li>
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
              <p className="mb-8 text-lg text-slate-300">
                Green Leaf Agencies ("we", "our", or "us") operates the Greenleaf Data Center platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our data center, colocation, and cloud services (collectively, the "Services").
              </p>

              <section id="information-we-collect" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-0 mb-4 border-b border-gray-800 pb-2">1. Information We Collect</h2>
                <p className="mb-4">We collect various types of information from our customers to provide our services effectively. This includes:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>Name</li>
                  <li>Company Name</li>
                  <li>Address</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>GST Information</li>
                  <li>Billing Information</li>
                  <li>IP Addresses</li>
                  <li>Login Activity</li>
                  <li>Support Communications</li>
                  <li>Service Usage Information</li>
                  <li>
                    Identity Verification Information
                    <span className="block text-sm text-slate-400 mt-1">
                      (Aadhaar Card, PAN Card, Passport, Driving License, GST Certificate, or other KYC documents voluntarily submitted for customer verification and compliance purposes.)
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-slate-400 italic">Customers are responsible for ensuring information provided is accurate and up to date.</p>
              </section>

              <section id="data-collection-methods" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">2. Data Collection Methods</h2>
                <p className="mb-4">Information may be collected through various touchpoints:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li>Website Registration</li>
                  <li>Service Orders</li>
                  <li>Customer Portal</li>
                  <li>Support Tickets</li>
                  <li>Email Communications</li>
                  <li>Phone Communications</li>
                  <li>Payment Transactions</li>
                  <li>Physical Data Center Access Records</li>
                </ul>
              </section>

              <section id="data-center-access-records" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">3. Data Center Access Records</h2>
                <p className="mb-4">For security, operational, and compliance purposes, Green Leaf Agencies may maintain records including:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>Visitor Logs</li>
                  <li>Access ID Records</li>
                  <li>Entry and Exit Timestamps</li>
                  <li>CCTV Recordings</li>
                  <li>Security Incident Logs</li>
                </ul>
                <p className="text-sm text-slate-400 italic">Such records may be retained as required for operational, legal, or security purposes.</p>
              </section>

              <section id="how-we-use-information" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">4. How We Use Information</h2>
                <p className="mb-4">We utilize the collected information to:</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li>Provide and manage services</li>
                  <li>Process payments and billing</li>
                  <li>Verify customer identity</li>
                  <li>Improve infrastructure and service quality</li>
                  <li>Prevent fraud and abuse</li>
                  <li>Respond to support requests</li>
                  <li>Comply with legal and regulatory obligations</li>
                  <li>Provision and manage customer services after successful verification and payment.</li>
                  <li>Create, activate, suspend, renew, or terminate customer services.</li>
                  <li>Maintain customer account history and service records.</li>
                  <li>Support fraud prevention, risk management, and compliance requirements.</li>
                </ul>
              </section>

              <section id="data-security" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">5. Data Security</h2>
                <p className="mb-4">
                  Green Leaf Agencies implements reasonable administrative, technical, and physical safeguards to protect customer information. While industry-standard security measures are used, no internet-based transmission, storage system, or electronic platform can guarantee absolute security. Customers acknowledge and accept these inherent risks when using our services.
                </p>
                <p className="mb-4">We employ stringent security measures to protect your data:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#020817] p-4 rounded-lg border border-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0"></span> Firewalls
                  </div>
                  <div className="bg-[#020817] p-4 rounded-lg border border-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0"></span> Access Controls
                  </div>
                  <div className="bg-[#020817] p-4 rounded-lg border border-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0"></span> Encryption Technologies
                  </div>
                  <div className="bg-[#020817] p-4 rounded-lg border border-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0"></span> Monitoring Systems
                  </div>
                  <div className="bg-[#020817] p-4 rounded-lg border border-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0"></span> Secure Data Center Facilities
                  </div>
                  <div className="bg-[#020817] p-4 rounded-lg border border-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3 shrink-0"></span> Physical Security Controls
                  </div>
                </div>
              </section>

              <section id="data-sharing" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">6. Data Sharing</h2>
                <p className="mb-4 font-medium text-white">Green Leaf Agencies does not sell, rent, or trade customer information.</p>
                <p className="mb-2">Information may only be disclosed when:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>Required by applicable law</li>
                  <li>Requested by authorized government authorities</li>
                  <li>Necessary for payment processing</li>
                  <li>Required for fraud prevention</li>
                  <li>Required for security investigations</li>
                  <li>Necessary to protect Green Leaf Agencies operations</li>
                </ul>
                <p className="mb-2 mt-4">Information may also be shared with trusted third-party providers strictly when required for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>Payment processing</li>
                  <li>Identity verification services</li>
                  <li>Fraud prevention</li>
                  <li>Legal compliance</li>
                  <li>Infrastructure and service delivery</li>
                </ul>
                <p className="text-sm text-slate-300">Such providers are required to maintain appropriate security and confidentiality standards.</p>
              </section>

              <section id="data-retention" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">7. Data Retention</h2>
                <p className="mb-4">Customer information will be retained only for as long as necessary to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>Provide services</li>
                  <li>Meet legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce agreements</li>
                  <li>Maintain operational records</li>
                </ul>
                <p className="mb-4">Certain information may be retained beyond account closure where required by law, regulatory obligations, taxation requirements, dispute resolution processes, security investigations, or operational record-keeping purposes.</p>
                <p className="text-sm text-slate-400 italic">Data may be securely deleted when no longer required.</p>
              </section>

              <section id="customer-rights" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">8. Customer Rights</h2>
                <p className="mb-4">Customers may request:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>Access to their information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Account closure</li>
                  <li>Deletion of eligible personal information</li>
                </ul>
                <p className="mb-2">Requests for access, correction, deletion, or account closure may be subject to identity verification before processing.</p>
                <p className="mb-4">Green Leaf Agencies may decline requests where legally prohibited or where retention is required for operational, regulatory, or security purposes.</p>
                <p className="text-sm text-slate-400 italic">Subject to applicable legal and verification requirements.</p>
              </section>

              <section id="cookies-technologies" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">9. Cookies & Website Technologies</h2>
                <p className="mb-4">We use cookies and similar technologies for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">
                  <li>Website functionality</li>
                  <li>Security monitoring</li>
                  <li>Performance analysis</li>
                  <li>User experience improvements</li>
                </ul>
                <p className="mb-2">Cookies may be used to maintain user sessions, improve platform security, remember preferences, and analyze website performance.</p>
                <p className="mb-4">Disabling cookies may impact certain website functionality.</p>
                <p className="text-sm text-slate-400 italic">Users may manage cookie preferences through browser settings.</p>
              </section>

              <section id="policy-changes" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">10. Policy Changes</h2>
                <p className="mb-4">Green Leaf Agencies reserves the right to update or modify this Privacy Policy at any time.</p>
                <p className="mb-4">Updated versions become effective upon publication on the website.</p>
                <p className="mb-4">Material changes to this Privacy Policy may be communicated through the website, customer portal, or registered email address.</p>
                <p className="mb-4">Continued use of services constitutes acceptance of revised policies.</p>
              </section>

              <section id="contact" className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">11. Contact Information</h2>
                <div className="bg-[#020817] border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Green Leaf Agencies</h3>
                  <div className="text-sm font-medium text-slate-300 mb-6">Privacy & Compliance Department</div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Email:</span>
                      <a href="mailto:privacy@greenleafagencies.in" className="text-secondary hover:text-accent font-medium transition-colors">privacy@greenleafagencies.in</a>
                    </div>
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Customer Support:</span>
                      <a href="mailto:support@greenleafagencies.in" className="text-secondary hover:text-accent font-medium transition-colors">support@greenleafagencies.in</a>
                    </div>
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Website:</span>
                      <a href="http://www.greenleafagencies.in" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent font-medium transition-colors">www.greenleafagencies.in</a>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 bg-[#0a1128] p-4 rounded-lg border border-gray-800/50">
                    For questions regarding privacy, data handling, identity verification, compliance, or customer information requests, please contact our Privacy & Compliance Team.
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

export default PrivacyPolicyPage;
