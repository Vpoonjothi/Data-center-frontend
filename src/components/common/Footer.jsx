import React from 'react';
import { Link } from 'react-router-dom';
import { MAIN_NAVIGATION } from '../../constants/navigation';
import { COMPANY_INFO } from '../../constants/companyInfo';

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-heading font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-secondary/10 text-secondary rounded-md flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </span>
              {COMPANY_INFO.shortName}
            </span>
            <p className="text-sm">
              Enterprise-grade data center solutions empowering the next generation of digital infrastructure.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {MAIN_NAVIGATION.filter(link => link.name !== 'Home' && link.name !== 'Contact').map(link => (
                <li key={link.name}><Link to={link.path} onClick={() => window.scrollTo(0,0)} className="block py-1 hover:text-accent transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" onClick={() => window.scrollTo(0,0)} className="block py-1 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" onClick={() => window.scrollTo(0,0)} className="block py-1 hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" onClick={() => window.scrollTo(0,0)} className="block py-1 hover:text-accent transition-colors">Refund & Cancellation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>{COMPANY_INFO.contact.general}</li>
              <li>{COMPANY_INFO.address}</li>
              {COMPANY_INFO.gstin && <li>GSTIN: {COMPANY_INFO.gstin}</li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
