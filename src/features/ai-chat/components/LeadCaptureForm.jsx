import React, { useState } from 'react';

const LeadCaptureForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    requirement: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lead captured:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-sm text-center my-4">
        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-green-800 font-semibold text-sm">Request Received</h4>
        <p className="text-green-600 text-xs mt-1">An architecture specialist will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 my-4">
      <div className="mb-4">
        <h4 className="font-heading font-semibold text-slate-800 text-sm">Talk to a Specialist</h4>
        <p className="text-xs text-slate-500 mt-1">Provide your details to discuss custom pricing and architecture.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              placeholder="Jane Doe" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Work Email</label>
            <input 
              required
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              placeholder="jane@company.com" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Company</label>
            <input 
              required
              type="text" 
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              placeholder="Acme Corp" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              placeholder="+1 (555) 000-0000" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Infrastructure Requirement</label>
          <textarea 
            required
            name="requirement"
            value={formData.requirement}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none h-16" 
            placeholder="e.g. 5 racks in Ashburn, 20kW density" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-slate-900 text-white font-medium text-sm py-2.5 rounded-lg hover:bg-accent transition-colors mt-2"
        >
          Submit Request
        </button>
      </form>
      <p className="text-[10px] text-center text-slate-400 mt-3">We respect your privacy. No spam.</p>
    </div>
  );
};

export default LeadCaptureForm;
