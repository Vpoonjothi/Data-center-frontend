import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const TermsOfServicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    // Scroll to hash if present on mount
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 text-lg mb-4">These Terms of Service govern the use of Green Leaf Agencies Data Center, Colocation, Dedicated Server, Cloud Infrastructure, Hosting, and Customer Portal services.</p>
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm font-medium">Last Updated: June 2026</span>
        </motion.div>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-900/20 border border-secondary/30 rounded-xl p-6 mb-12 max-w-4xl shadow-lg"
        >
          <div className="flex gap-4 items-start">
            <svg className="w-6 h-6 text-secondary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-medium">
              By accessing, purchasing, subscribing to, or using any Green Leaf Agencies service, customers agree to comply with these Terms of Service.
            </p>
          </div>
        </motion.div>

        {/* Compliance Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <div className="flex items-center gap-2 bg-[#0a1128] border border-gray-800 px-4 py-2 rounded-lg">
            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-white">Enterprise Infrastructure</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1128] border border-gray-800 px-4 py-2 rounded-lg">
            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-white">Data Center Operations</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1128] border border-gray-800 px-4 py-2 rounded-lg">
            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-white">Customer Protection</span>
          </div>
          <div className="flex items-center gap-2 bg-[#0a1128] border border-gray-800 px-4 py-2 rounded-lg">
            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-white">Legal Compliance</span>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar / Table of Contents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full md:w-80 shrink-0 md:sticky top-28"
          >
            <div className="bg-[#0a1128] border border-gray-800 rounded-xl p-6 shadow-xl max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
              <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Table of Contents</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#acceptance" className="text-slate-400 hover:text-secondary transition-colors">1. Acceptance of Terms</a></li>
                <li><a href="#services-provided" className="text-slate-400 hover:text-secondary transition-colors">2. Services Provided</a></li>
                <li><a href="#customer-account" className="text-slate-400 hover:text-secondary transition-colors">3. Customer Account</a></li>
                <li><a href="#payments-billing" className="text-slate-400 hover:text-secondary transition-colors">4. Payments and Billing</a></li>
                <li><a href="#service-activation" className="text-slate-400 hover:text-secondary transition-colors">5. Service Activation</a></li>
                <li><a href="#customer-responsibilities" className="text-slate-400 hover:text-secondary transition-colors">6. Customer Responsibilities</a></li>
                <li><a href="#prohibited-activities" className="text-slate-400 hover:text-secondary transition-colors">7. Prohibited Activities</a></li>
                <li><a href="#resource-usage" className="text-slate-400 hover:text-secondary transition-colors">8. Resource Usage</a></li>
                <li><a href="#suspension" className="text-slate-400 hover:text-secondary transition-colors">9. Suspension of Services</a></li>
                <li><a href="#data-backup" className="text-slate-400 hover:text-secondary transition-colors">10. Data Backup</a></li>
                <li><a href="#dedicated-server" className="text-slate-400 hover:text-secondary transition-colors">11. Dedicated Server Services</a></li>
                <li><a href="#colocation" className="text-slate-400 hover:text-secondary transition-colors">12. Colocation Services</a></li>
                <li><a href="#data-center-access" className="text-slate-400 hover:text-secondary transition-colors">13. Data Center Access</a></li>
                <li><a href="#security-monitoring" className="text-slate-400 hover:text-secondary transition-colors">14. Security Monitoring</a></li>
                <li><a href="#maintenance" className="text-slate-400 hover:text-secondary transition-colors">15. Maintenance</a></li>
                <li><a href="#limitation-of-liability" className="text-slate-400 hover:text-secondary transition-colors">16. Limitation of Liability</a></li>
                <li><a href="#force-majeure" className="text-slate-400 hover:text-secondary transition-colors">17. Force Majeure</a></li>
                <li><a href="#termination" className="text-slate-400 hover:text-secondary transition-colors">18. Termination</a></li>
                <li><a href="#governing-law" className="text-slate-400 hover:text-secondary transition-colors">19. Governing Law and Jurisdiction</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-secondary transition-colors">20. Contact Information</a></li>
              </ul>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 max-w-4xl prose prose-invert prose-emerald max-w-none prose-headings:text-white prose-a:text-secondary hover:prose-a:text-accent prose-p:leading-relaxed prose-li:leading-relaxed"
          >
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 md:p-12 shadow-2xl">
              
              <section id="acceptance" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mt-0 mb-4 border-b border-gray-800 pb-2">1. ACCEPTANCE OF TERMS</h2>
                <p className="mb-4">By purchasing, subscribing to, accessing, or using any service provided by Green Leaf Agencies ("Company", "We", "Us", or "Our"), the Customer ("Customer", "Client", "You", or "Your") acknowledges that they have read, understood, and agreed to be legally bound by these Terms of Service, including any policies, guidelines, agreements, and procedures referenced herein.</p>
                <p className="mb-4">If You are entering into this agreement on behalf of a company, organization, or other legal entity, You represent and warrant that You have the authority to bind such entity to these Terms.</p>
                <p className="mb-4">Green Leaf Agencies reserves the right to modify, update, or amend these Terms at any time. Continued use of our services after such modifications constitutes acceptance of the updated Terms.</p>
              </section>

              <section id="services-provided" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">2. SERVICES PROVIDED</h2>
                <p className="mb-4">Green Leaf Agencies provides enterprise-grade infrastructure, hosting, and data center solutions, including but not limited to:</p>
                
                <h3 className="text-lg font-bold text-white mt-6 mb-2">Hosting Services</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Shared Hosting</li>
                  <li>Cloud Hosting</li>
                  <li>Virtual Private Servers (VPS)</li>
                  <li>Managed VPS Solutions</li>
                  <li>Dedicated Servers</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Data Center Services</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Server Colocation</li>
                  <li>Rack Space Rental</li>
                  <li>Private Rack Solutions</li>
                  <li>Half Rack and Full Rack Services</li>
                  <li>Cage Space (where applicable)</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Infrastructure Services</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Managed Infrastructure Services</li>
                  <li>Server Monitoring</li>
                  <li>Backup and Disaster Recovery Solutions</li>
                  <li>Storage Services</li>
                  <li>Network Connectivity Services</li>
                  <li>Load Balancing Solutions</li>
                  <li>Infrastructure Consulting</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Additional Services</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Custom Hosting Solutions</li>
                  <li>IP Address Allocation</li>
                  <li>Remote Hands Support</li>
                  <li>Server Migration Services</li>
                  <li>Managed Security Services</li>
                </ul>
                <p className="mb-4">Green Leaf Agencies reserves the right to modify, discontinue, upgrade, or introduce new services at its sole discretion.</p>
              </section>

              <section id="customer-account" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">3. CUSTOMER ACCOUNT</h2>
                <p className="mb-4">To access certain services, Customers may be required to create and maintain an account.</p>
                <p className="mb-2">Customers agree to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Provide accurate, current, and complete information.</li>
                  <li>Promptly update any changes to contact or billing information.</li>
                  <li>Maintain the confidentiality of login credentials.</li>
                  <li>Restrict unauthorized access to their account.</li>
                  <li>Immediately notify Green Leaf Agencies of any suspected unauthorized use or security breach.</li>
                </ul>
                <p className="mb-4">Customers are solely responsible for all activities performed under their account, whether authorized or unauthorized.</p>
                <p className="mb-4">Providing false, misleading, or fraudulent information may result in immediate suspension or termination of services.</p>
              </section>

              <section id="payments-billing" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">4. PAYMENTS AND BILLING</h2>
                
                <h3 className="text-lg font-bold text-white mt-6 mb-2">4.1 Payment Obligations</h3>
                <p className="mb-4">Customers agree to pay all applicable fees, taxes, setup charges, recurring charges, and service-related costs associated with the purchased services.</p>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">4.2 Due Dates</h3>
                <p className="mb-4">All invoices must be paid on or before the specified due date.</p>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">4.3 Late Payments</h3>
                <p className="mb-2">Failure to make timely payments may result in:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Service suspension</li>
                  <li>Restricted access</li>
                  <li>Additional administrative fees</li>
                  <li>Service termination</li>
                  <li>Data removal after retention periods</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">4.4 Pricing Changes</h3>
                <p className="mb-4">Green Leaf Agencies reserves the right to revise pricing, service fees, and billing structures with reasonable prior notice.</p>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">4.5 Taxation</h3>
                <p className="mb-4">All applicable taxes, including GST and other government-imposed charges, shall be borne by the Customer unless otherwise stated.</p>
              </section>

              <section id="service-activation" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">5. SERVICE ACTIVATION</h2>
                <p className="mb-2">Service activation shall occur only after:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Successful payment verification</li>
                  <li>Completion of customer verification procedures</li>
                  <li>Acceptance of applicable agreements</li>
                  <li>Resource availability</li>
                  <li>Technical provisioning requirements</li>
                </ul>
                <p className="mb-4">Provisioning times may vary depending on service type, infrastructure availability, and security verification requirements.</p>
                <p className="mb-4">Green Leaf Agencies reserves the right to reject any service order without obligation to disclose specific reasons.</p>
              </section>

              <section id="customer-responsibilities" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">6. CUSTOMER RESPONSIBILITIES</h2>
                <p className="mb-4">Customers shall:</p>
                
                <h3 className="text-lg font-bold text-white mt-6 mb-2">Account Responsibilities</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Maintain valid and up-to-date contact information.</li>
                  <li>Ensure billing details remain accurate.</li>
                  <li>Protect account credentials from unauthorized access.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Data Responsibilities</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Maintain independent backups of all critical data.</li>
                  <li>Verify backup integrity regularly.</li>
                  <li>Implement appropriate disaster recovery measures.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Security Responsibilities</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Secure hosted applications and operating systems.</li>
                  <li>Maintain software updates and security patches.</li>
                  <li>Use strong passwords and access controls.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Legal Responsibilities</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Comply with all applicable local, national, and international laws.</li>
                  <li>Obtain all required licenses and permissions.</li>
                  <li>Respect intellectual property rights.</li>
                </ul>
                <p className="mb-4">Customers remain solely responsible for all content, software, applications, and activities hosted or operated through Green Leaf Agencies services.</p>
              </section>

              <section id="prohibited-activities" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">7. PROHIBITED ACTIVITIES</h2>
                <p className="mb-4">Customers shall not use Green Leaf Agencies services for any activity that is illegal, harmful, abusive, fraudulent, or disruptive to network operations.</p>
                <p className="mb-2">The following activities are strictly prohibited:</p>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Illegal Content and Activities</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Hosting, storing, transmitting, or distributing illegal content.</li>
                  <li>Child exploitation or abuse-related content.</li>
                  <li>Human trafficking content.</li>
                  <li>Terrorism-related content or propaganda.</li>
                  <li>Illegal gambling operations.</li>
                  <li>Sale or distribution of prohibited goods or services.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Cybersecurity Violations</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Phishing attacks.</li>
                  <li>Malware distribution.</li>
                  <li>Ransomware activities.</li>
                  <li>Virus creation or dissemination.</li>
                  <li>Botnet operations.</li>
                  <li>Credential theft.</li>
                  <li>Unauthorized penetration attempts.</li>
                  <li>Brute-force attacks.</li>
                  <li>Network scanning without authorization.</li>
                  <li>Denial-of-Service (DoS) or Distributed Denial-of-Service (DDoS) attacks.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Network Abuse</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Excessive network consumption affecting other customers.</li>
                  <li>Unauthorized proxy services.</li>
                  <li>Open relay services.</li>
                  <li>IP reputation abuse.</li>
                  <li>Traffic manipulation.</li>
                  <li>Routing abuse.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Email Abuse</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Spam email campaigns.</li>
                  <li>Bulk unsolicited communications.</li>
                  <li>Email spoofing.</li>
                  <li>Blacklisted mailing activities.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Intellectual Property Violations</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Copyright infringement.</li>
                  <li>Trademark violations.</li>
                  <li>Unauthorized software distribution.</li>
                  <li>Pirated software hosting.</li>
                  <li>Distribution of cracked software or license circumvention tools.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Resource Abuse</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Unauthorized cryptocurrency mining.</li>
                  <li>Resource-intensive applications affecting service stability.</li>
                  <li>Excessive CPU, memory, storage, or bandwidth abuse.</li>
                </ul>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Fraudulent Activities</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Identity theft.</li>
                  <li>Financial fraud.</li>
                  <li>Fake websites intended to deceive users.</li>
                  <li>Scams or deceptive business practices.</li>
                </ul>

                <p className="mb-4">Green Leaf Agencies reserves the right to immediately suspend, restrict, investigate, or terminate any service found violating these provisions without prior notice.</p>
                <p className="mb-4">Serious violations may be reported to relevant law enforcement agencies, regulatory authorities, or affected third parties where legally required.</p>
              </section>

              <section id="resource-usage" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">8. RESOURCE USAGE</h2>
                <p className="mb-4">Customers shall use allocated resources in a fair, responsible, and non-disruptive manner.</p>
                <p className="mb-4">Customers shall not intentionally or negligently consume excessive CPU, memory, storage, bandwidth, power, cooling, or network resources in a manner that negatively impacts other customers, shared infrastructure, or overall service performance.</p>
                <p className="mb-4">Green Leaf Agencies reserves the right to investigate unusual resource consumption and may implement temporary restrictions, request service upgrades, or suspend services if excessive usage threatens infrastructure stability, security, or availability.</p>
                <p className="mb-4">Customers must comply with the applicable Fair Usage Policy (FUP) and any service-specific resource limitations communicated during service provisioning.</p>
              </section>

              <section id="suspension" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">9. SUSPENSION OF SERVICES</h2>
                <p className="mb-2">Green Leaf Agencies reserves the right to suspend, restrict, or isolate any service, with or without prior notice, under the following circumstances:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Detection of abuse, fraud, or malicious activity.</li>
                  <li>Security threats affecting the customer, other customers, or infrastructure.</li>
                  <li>Violation of these Terms of Service or other company policies.</li>
                  <li>Non-payment of invoices or overdue balances.</li>
                  <li>Legal, regulatory, or law enforcement requirements.</li>
                  <li>Activities causing network instability or service disruption.</li>
                  <li>Unauthorized access attempts or security breaches.</li>
                </ul>
                <p className="mb-4">Where reasonably possible, customers will be notified of the suspension and provided with remediation steps. However, immediate suspension may be necessary to protect infrastructure, customer data, or network security.</p>
              </section>

              <section id="data-backup" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">10. DATA BACKUP</h2>
                <p className="mb-4">Unless explicitly purchased as a Managed Backup Service, Green Leaf Agencies does not guarantee the availability, recovery, or retention of customer data.</p>
                <p className="mb-2">Customers are solely responsible for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Maintaining regular backups.</li>
                  <li>Verifying backup integrity.</li>
                  <li>Implementing disaster recovery procedures.</li>
                  <li>Protecting business-critical information.</li>
                </ul>
                <p className="mb-4">Green Leaf Agencies shall not be liable for any loss, corruption, deletion, or inability to recover customer data, regardless of the cause, including hardware failures, software errors, cyberattacks, accidental deletion, or service termination.</p>
              </section>

              <section id="dedicated-server" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">11. DEDICATED SERVER SERVICES</h2>
                <p className="mb-4">Dedicated Server customers are provided with exclusive access to the assigned physical server and its allocated resources.</p>
                <p className="mb-2">Unless otherwise specified in a separate written agreement:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>All server hardware remains the sole property of Green Leaf Agencies.</li>
                  <li>Customers are granted usage rights only.</li>
                  <li>Customers may not modify, remove, relocate, or replace hardware components without prior authorization.</li>
                  <li>Unauthorized hardware modifications may result in service suspension.</li>
                </ul>
                <p className="mb-4">Green Leaf Agencies remains responsible for maintaining core hardware infrastructure and may replace hardware components when necessary to ensure service continuity.</p>
              </section>

              <section id="colocation" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">12. COLOCATION SERVICES</h2>
                <p className="mb-4">Customers utilizing Colocation Services retain ownership of all customer-owned hardware deployed within the Green Leaf Agencies Data Center.</p>
                <p className="mb-2">Green Leaf Agencies shall provide:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Rack space allocation.</li>
                  <li>Power distribution.</li>
                  <li>Cooling infrastructure.</li>
                  <li>Physical security controls.</li>
                  <li>Network connectivity services.</li>
                </ul>
                <p className="mb-2">Customers remain responsible for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Hardware maintenance.</li>
                  <li>Operating system administration.</li>
                  <li>Software licensing.</li>
                  <li>Data protection and backups.</li>
                </ul>
                <p className="mb-4">Green Leaf Agencies shall not be responsible for failures arising from defective customer-owned equipment.</p>
              </section>

              <section id="data-center-access" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">13. DATA CENTER ACCESS</h2>
                <p className="mb-4">Access to Green Leaf Agencies Data Center facilities is strictly controlled for security and compliance purposes.</p>
                <p className="mb-2">Physical access is subject to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Access ID verification.</li>
                  <li>Government-issued photo identification verification.</li>
                  <li>Visitor registration procedures.</li>
                  <li>Security screening requirements.</li>
                  <li>Authorization approval from registered account contacts.</li>
                </ul>
                <p className="mb-4">Only approved and authorized individuals may access assigned racks, cages, cabinets, or equipment.</p>
                <p className="mb-4">Green Leaf Agencies reserves the right to deny, restrict, or revoke facility access at its sole discretion for security, operational, legal, or compliance reasons.</p>
                <p className="mb-4">All visitors must comply with the Data Center Access Policy and facility security requirements.</p>
              </section>

              <section id="security-monitoring" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">14. SECURITY MONITORING</h2>
                <p className="mb-2">To ensure the safety, security, and integrity of our facilities and infrastructure, Green Leaf Agencies may implement:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>CCTV surveillance systems.</li>
                  <li>Access control systems.</li>
                  <li>Visitor logging systems.</li>
                  <li>Environmental monitoring systems.</li>
                  <li>Network monitoring systems.</li>
                  <li>Security incident monitoring.</li>
                </ul>
                <p className="mb-4">Customers acknowledge that access logs, surveillance footage, and security records may be retained for operational, compliance, audit, or legal purposes.</p>
                <p className="mb-4">Monitoring activities are conducted in accordance with applicable laws and company policies.</p>
              </section>

              <section id="maintenance" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">15. MAINTENANCE</h2>
                <p className="mb-4">Green Leaf Agencies may perform scheduled or emergency maintenance activities to maintain infrastructure reliability, security, and performance.</p>
                <p className="mb-2">Scheduled maintenance may include:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Network upgrades.</li>
                  <li>Hardware replacements.</li>
                  <li>Security updates.</li>
                  <li>Power system maintenance.</li>
                  <li>Cooling system maintenance.</li>
                </ul>
                <p className="mb-4">Reasonable efforts will be made to provide advance notice for scheduled maintenance whenever possible.</p>
                <p className="mb-4">Emergency maintenance required to protect service availability, infrastructure integrity, or security may be performed without prior notice.</p>
              </section>

              <section id="limitation-of-liability" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">16. LIMITATION OF LIABILITY</h2>
                <p className="mb-2">To the maximum extent permitted by applicable law, Green Leaf Agencies shall not be liable for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Data loss.</li>
                  <li>Data corruption.</li>
                  <li>Business interruption.</li>
                  <li>Revenue loss.</li>
                  <li>Loss of profits.</li>
                  <li>Loss of goodwill.</li>
                  <li>Indirect damages.</li>
                  <li>Incidental damages.</li>
                  <li>Consequential damages.</li>
                  <li>Punitive damages.</li>
                  <li>Third-party service failures.</li>
                  <li>Customer software failures.</li>
                  <li>Cybersecurity incidents originating from customer-managed systems.</li>
                </ul>
                <p className="mb-4">In all circumstances, Green Leaf Agencies' total aggregate liability shall not exceed the amount paid by the Customer for the affected service during the preceding three (3) months.</p>
              </section>

              <section id="force-majeure" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">17. FORCE MAJEURE</h2>
                <p className="mb-2">Green Leaf Agencies shall not be held liable for any delay, interruption, failure, or inability to perform its obligations resulting from events beyond its reasonable control, including but not limited to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Natural disasters.</li>
                  <li>Floods.</li>
                  <li>Earthquakes.</li>
                  <li>Fires.</li>
                  <li>Lightning strikes.</li>
                  <li>Pandemics.</li>
                  <li>Epidemics.</li>
                  <li>Acts of war.</li>
                  <li>Terrorist activities.</li>
                  <li>Civil unrest.</li>
                  <li>Government actions.</li>
                  <li>Regulatory restrictions.</li>
                  <li>Utility failures.</li>
                  <li>Internet backbone failures.</li>
                  <li>Power grid failures.</li>
                  <li>Telecommunications outages.</li>
                </ul>
                <p className="mb-4">Service obligations affected by Force Majeure events shall be suspended for the duration of such events.</p>
              </section>

              <section id="termination" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">18. TERMINATION</h2>
                <p className="mb-4">Either party may terminate services in accordance with applicable service agreements, cancellation policies, or contractual obligations.</p>
                <p className="mb-2">Green Leaf Agencies may immediately terminate services for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Serious policy violations.</li>
                  <li>Illegal activities.</li>
                  <li>Security threats.</li>
                  <li>Fraudulent activities.</li>
                  <li>Repeated abuse incidents.</li>
                  <li>Persistent payment defaults.</li>
                </ul>
                <p className="mb-2">Upon termination:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300">
                  <li>Customer access may be revoked.</li>
                  <li>Services may be disabled.</li>
                  <li>Data may be deleted after applicable retention periods.</li>
                  <li>Outstanding balances shall remain payable.</li>
                </ul>
              </section>

              <section id="governing-law" className="mb-12 scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">19. GOVERNING LAW AND JURISDICTION</h2>
                <p className="mb-4">These Terms of Service shall be governed and interpreted in accordance with the laws of India.</p>
                <p className="mb-4">Any disputes arising from these Terms, services, or related agreements shall be subject to the exclusive jurisdiction of the courts located in Tamil Nadu, India.</p>
                <p className="mb-4">Both parties agree to attempt good-faith resolution of disputes before initiating formal legal proceedings.</p>
              </section>

              <section id="contact" className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">20. CONTACT INFORMATION</h2>
                <div className="bg-[#020817] border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Green Leaf Agencies</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Corporate Office:</span>
                      <p className="text-slate-300">[Company Address]</p>
                    </div>
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Support Email:</span>
                      <a href="mailto:support@greenleafagencies.in" className="text-secondary hover:text-accent font-medium transition-colors">support@greenleafagencies.in</a>
                    </div>
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Billing Email:</span>
                      <a href="mailto:billing@greenleafagencies.in" className="text-secondary hover:text-accent font-medium transition-colors">billing@greenleafagencies.in</a>
                    </div>
                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Abuse Reporting:</span>
                      <a href="mailto:abuse@greenleafagencies.in" className="text-secondary hover:text-accent font-medium transition-colors">abuse@greenleafagencies.in</a>
                    </div>

                    <div>
                      <span className="block text-sm text-slate-500 mb-1">Website:</span>
                      <a href="http://www.greenleafagencies.in" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent font-medium transition-colors">www.greenleafagencies.in</a>
                    </div>
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

export default TermsOfServicePage;
