import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitKyc, startAadhaarVerification } from '../../services/api';
import FileUpload from './FileUpload';

const KycWizard = ({ quote, onComplete, initialData = {} }) => {
  const [step, setStep] = useState(1);
  const [customerType, setCustomerType] = useState('individual');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Aadhaar OTP State
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarReferenceId, setAadhaarReferenceId] = useState(null);
  const [otp, setOtp] = useState('');
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [aadhaarError, setAadhaarError] = useState('');
  const [aadhaarMessage, setAadhaarMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    full_name: initialData.name || '',
    email_address: initialData.email || '',
    mobile_number: initialData.phone || '',
    residential_address: '',
    aadhaar_number: '',
    company_name: '',
    gst_number: '',
    pan_number: '',
    registered_address: '',
    auth_contact_person: '',
    designation: '',
    official_email: '',
    auth_aadhaar_number: ''
  });

  // Compliance declarations state
  const [declarations, setDeclarations] = useState({
    accurate: false,
    authorize: false
  });

  // File State
  const [files, setFiles] = useState({
    aadhaar_front: null,
    aadhaar_back: null,
    gst_cert: null,
    pan_card: null,
    company_reg: null,
    address_proof: null
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleGenerateOtp = async () => {
    try {
      setVerifyingAadhaar(true);
      setAadhaarError('');
      setAadhaarMessage('');
      const targetAadhaar = customerType === 'company' ? formData.auth_aadhaar_number : formData.aadhaar_number;
      if (!targetAadhaar || targetAadhaar.length !== 12) {
        setAadhaarError('Please enter a valid 12-digit Aadhaar number.');
        setVerifyingAadhaar(false);
        return;
      }
      const res = await startAadhaarVerification(quote.id, true, null, targetAadhaar, formData, customerType);
      if (res.data?.aadhaar_reference_id) {
         setAadhaarReferenceId(res.data.aadhaar_reference_id);
         setAadhaarMessage('OTP has been sent to your Aadhaar linked mobile number.');
      }
    } catch (err) {
      setAadhaarError(err.response?.data?.message || 'Failed to generate OTP.');
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setVerifyingAadhaar(true);
      setAadhaarError('');
      const res = await startAadhaarVerification(quote.id, true, otp);
      if (res.success) {
        setAadhaarVerified(true);
        setAadhaarMessage('');
      }
    } catch (err) {
      setAadhaarError(err.response?.data?.message || 'Failed to verify OTP.');
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('quoteId', quote.id);
      data.append('customer_type', customerType);

      if (customerType === 'individual') {
        data.append('full_name', formData.full_name);
        data.append('email_address', formData.email_address);
        data.append('mobile_number', formData.mobile_number);
        data.append('residential_address', formData.residential_address);
        data.append('aadhaar_number', formData.aadhaar_number);
      } else {
        data.append('company_name', formData.company_name);
        data.append('gst_number', formData.gst_number);
        data.append('pan_number', formData.pan_number);
        data.append('registered_address', formData.registered_address);
        data.append('auth_contact_person', formData.auth_contact_person);
        data.append('designation', formData.designation);
        data.append('official_email', formData.official_email);
        data.append('mobile_number', formData.mobile_number); // Company auth person mobile
        data.append('auth_aadhaar_number', formData.auth_aadhaar_number);
      }

      await submitKyc(data);
      onComplete(); // Triggers a refetch of KYC status in parent component
    } catch (error) {
      console.error('KYC submission failed:', error);
      alert('Failed to submit KYC. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a1128] border border-gray-800 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Identity & Compliance Verification</h2>
        <p className="text-gray-400">Complete your KYC to activate services and generate your invoice.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-secondary' : 'bg-gray-800'}`}></div>
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-secondary' : 'bg-gray-800'}`}></div>
        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-secondary' : 'bg-gray-800'}`}></div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Customer Type */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-semibold text-white mb-6">Select Customer Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setCustomerType('individual')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  customerType === 'individual' ? 'border-secondary bg-secondary/10' : 'border-gray-800 bg-[#020817] hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${customerType === 'individual' ? 'bg-secondary text-white' : 'bg-gray-800 text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">Individual</h4>
                </div>
                <p className="text-gray-400 text-sm">For personal use. Requires Aadhaar and basic address details.</p>
              </button>

              <button
                onClick={() => setCustomerType('company')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  customerType === 'company' ? 'border-secondary bg-secondary/10' : 'border-gray-800 bg-[#020817] hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${customerType === 'company' ? 'bg-secondary text-white' : 'bg-gray-800 text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">Company / Organization</h4>
                </div>
                <p className="text-gray-400 text-sm">For businesses. Requires GST, PAN, and Authorized Person Aadhaar.</p>
              </button>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={nextStep} className="px-6 py-3 bg-secondary text-white rounded-xl font-bold">Continue</button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Details */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-semibold text-white mb-6">
              {customerType === 'individual' ? 'Personal Details' : 'Company Details'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customerType === 'individual' ? (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                    <input type="email" name="email_address" value={formData.email_address} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Mobile Number *</label>
                    <input type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div className="md:col-span-2 border border-gray-800 p-4 rounded-xl bg-[#020817]">
                    <label className="block text-sm text-gray-400 mb-2">Aadhaar Number *</label>
                    <input 
                      type="text" 
                      name="aadhaar_number" 
                      value={formData.aadhaar_number} 
                      onChange={handleInputChange} 
                      disabled={aadhaarVerified}
                      className="w-full bg-[#0a1128] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary disabled:opacity-50" 
                      required 
                    />
                    
                    {aadhaarError && <p className="text-red-500 text-sm mt-2">{aadhaarError}</p>}
                    {aadhaarMessage && <p className="text-secondary text-sm mt-2">{aadhaarMessage}</p>}
                    
                    <div className="mt-4">
                      {aadhaarVerified ? (
                        <div className="flex items-center text-green-500 font-bold">
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Aadhaar Verified
                        </div>
                      ) : (
                        !aadhaarReferenceId ? (
                          <button type="button" onClick={handleGenerateOtp} disabled={verifyingAadhaar} className="px-4 py-2 bg-secondary text-[#020817] font-bold rounded-lg disabled:opacity-50">
                            {verifyingAadhaar ? 'Generating...' : 'Generate OTP'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-4">
                            <input type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="bg-[#0a1128] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-secondary w-32 tracking-widest text-center" />
                            <button type="button" onClick={handleVerifyOtp} disabled={verifyingAadhaar || otp.length !== 6} className="px-4 py-2 bg-secondary text-[#020817] font-bold rounded-lg disabled:opacity-50">
                              {verifyingAadhaar ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            {aadhaarError && <button type="button" onClick={handleGenerateOtp} className="text-xs text-blue-400 hover:underline">Resend</button>}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Residential Address *</label>
                    <textarea name="residential_address" value={formData.residential_address} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary h-24" required></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company Name *</label>
                    <input type="text" name="company_name" value={formData.company_name} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">GST Number *</label>
                    <input type="text" name="gst_number" value={formData.gst_number} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">PAN Number *</label>
                    <input type="text" name="pan_number" value={formData.pan_number} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Official Email *</label>
                    <input type="email" name="official_email" value={formData.official_email} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Registered Address *</label>
                    <textarea name="registered_address" value={formData.registered_address} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary h-24" required></textarea>
                  </div>
                  <div className="md:col-span-2 mt-4"><h4 className="text-lg font-bold text-white">Authorized Contact Person</h4></div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Contact Person Name *</label>
                    <input type="text" name="auth_contact_person" value={formData.auth_contact_person} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Designation *</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Mobile Number *</label>
                    <input type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} className="w-full bg-[#020817] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary" required />
                  </div>
                  <div className="md:col-span-2 border border-gray-800 p-4 rounded-xl bg-[#020817]">
                    <label className="block text-sm text-gray-400 mb-2">Authorized Aadhaar Number *</label>
                    <input 
                      type="text" 
                      name="auth_aadhaar_number" 
                      value={formData.auth_aadhaar_number} 
                      onChange={handleInputChange} 
                      disabled={aadhaarVerified}
                      className="w-full bg-[#0a1128] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-secondary disabled:opacity-50" 
                      required 
                    />
                    
                    {aadhaarError && <p className="text-red-500 text-sm mt-2">{aadhaarError}</p>}
                    {aadhaarMessage && <p className="text-secondary text-sm mt-2">{aadhaarMessage}</p>}
                    
                    <div className="mt-4">
                      {aadhaarVerified ? (
                        <div className="flex items-center text-green-500 font-bold">
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Aadhaar Verified
                        </div>
                      ) : (
                        !aadhaarReferenceId ? (
                          <button type="button" onClick={handleGenerateOtp} disabled={verifyingAadhaar} className="px-4 py-2 bg-secondary text-[#020817] font-bold rounded-lg disabled:opacity-50">
                            {verifyingAadhaar ? 'Generating...' : 'Generate OTP'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-4">
                            <input type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="bg-[#0a1128] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-secondary w-32 tracking-widest text-center" />
                            <button type="button" onClick={handleVerifyOtp} disabled={verifyingAadhaar || otp.length !== 6} className="px-4 py-2 bg-secondary text-[#020817] font-bold rounded-lg disabled:opacity-50">
                              {verifyingAadhaar ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            {aadhaarError && <button type="button" onClick={handleGenerateOtp} className="text-xs text-blue-400 hover:underline">Resend</button>}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={prevStep} className="px-6 py-3 border border-gray-700 text-white rounded-xl hover:bg-gray-800">Back</button>
              <button onClick={nextStep} disabled={!aadhaarVerified} className="px-6 py-3 bg-secondary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Submit (Declarations Only) */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            
            <form onSubmit={handleSubmit}>


              {/* Compliance Declarations */}
              <div className="bg-[#020817] border border-gray-800 rounded-2xl p-6 mb-8">
                <h4 className="text-lg font-bold text-white mb-4">Compliance Declarations</h4>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#0a1128] checked:bg-secondary checked:border-secondary transition-colors cursor-pointer" 
                             checked={declarations.accurate} onChange={(e) => setDeclarations({...declarations, accurate: e.target.checked})} required />
                      <svg className="absolute w-3 h-3 text-[#020817] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">I confirm that all submitted information is accurate.</span>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-[#0a1128] checked:bg-secondary checked:border-secondary transition-colors cursor-pointer" 
                             checked={declarations.authorize} onChange={(e) => setDeclarations({...declarations, authorize: e.target.checked})} required />
                      <svg className="absolute w-3 h-3 text-[#020817] opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">I authorize GreenLeaf Data Center to verify my identity and business information.</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-700 text-white rounded-xl hover:bg-gray-800">Back</button>
                <button type="submit" disabled={isSubmitting || !declarations.accurate || !declarations.authorize} className="px-8 py-3 bg-secondary text-white rounded-xl font-bold shadow-lg shadow-secondary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Submitting...' : 'Submit Verification'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KycWizard;
