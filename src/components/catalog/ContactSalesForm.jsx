import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSalesForm = ({ serviceName }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: serviceName || '',
    budget: '',
    requirements: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // In production, send to backend here.
    alert("Thank you! Our sales team will contact you shortly.");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-24 bg-slate-950 border-t border-gray-800" id="contact-sales">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Sales</h2>
          <p className="text-lg text-slate-400">
            Get expert advice and customized enterprise pricing for your infrastructure.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Work Email *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name *</label>
                <input required type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Service Interested In</label>
                <input type="text" name="service" value={formData.service} onChange={handleChange} className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-slate-400 focus:outline-none cursor-not-allowed" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Budget</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors">
                  <option value="">Select a range</option>
                  <option value="under_500">Under $500</option>
                  <option value="500_2000">$500 - $2,000</option>
                  <option value="2000_5000">$2,000 - $5,000</option>
                  <option value="5000_10000">$5,000 - $10,000</option>
                  <option value="10000_plus">$10,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Requirements</label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="3" className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="E.g., Need 5 bare metal servers with 10Gbps unmetered bandwidth"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Additional Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full bg-slate-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" placeholder="Any other details..."></textarea>
            </div>

            <div className="pt-4 text-center">
              <button type="submit" className="w-full md:w-auto px-10 py-4 bg-accent hover:bg-secondary text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-secondary/25">
                Request Consultation
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSalesForm;
