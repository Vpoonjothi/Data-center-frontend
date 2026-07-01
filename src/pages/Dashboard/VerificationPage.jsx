import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getKycStatus, startAadhaarVerification, startPanVerification } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import KycWizard from '../../components/kyc/KycWizard';
import KycDocumentCenter from '../../components/kyc/KycDocumentCenter';

const VerificationPage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [verifyingPan, setVerifyingPan] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKycData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId]);

  const fetchKycData = async () => {
    try {
      setLoading(true);
      const res = await getKycStatus(quoteId);
      setKycData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load KYC verification status.');
    } finally {
      setLoading(false);
    }
  };

  const handleAadhaarVerify = async () => {
    try {
      setVerifyingAadhaar(true);
      // Simulate real API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const res = await startAadhaarVerification(quoteId, declarations.consent);
      setKycData(res.data);
    } catch (err) {
      setError('Aadhaar verification failed.');
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const handlePanVerify = async () => {
    try {
      setVerifyingPan(true);
      // Simulate real API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const res = await startPanVerification(quoteId, declarations.consent);
      setKycData(res.data);
    } catch (err) {
      setError('PAN verification failed.');
    } finally {
      setVerifyingPan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { aadhaar_status, pan_status, overall_status, quote } = kycData || {};
  const isVerified = overall_status === 'verified';

  return (
    <div className="bg-[#020817] min-h-screen font-sans pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Customer KYC Verification</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete identity verification before proceeding to payment and service activation.
          </p>
        </div>

        {/* Workflow Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 -z-10 rounded-full"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-secondary text-[#020817] flex items-center justify-center font-bold text-lg mb-2 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                ✓
              </div>
              <span className="text-sm font-medium text-secondary">Quote Accepted</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors ${overall_status === 'verified' ? 'bg-secondary text-[#020817] shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}>
                {overall_status === 'verified' ? '✓' : '2'}
              </div>
              <span className={`text-sm font-medium ${overall_status === 'verified' ? 'text-secondary' : 'text-blue-400'}`}>KYC Verification</span>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-600 text-gray-400 flex items-center justify-center font-bold text-lg mb-2`}>
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Payment</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-600 text-gray-400 flex items-center justify-center font-bold text-lg mb-2">
                4
              </div>
              <span className="text-sm font-medium text-gray-500">Active Service</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Summary */}
          <div className="space-y-6">
            
            {/* Quote Summary Card */}
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <h3 className="text-lg font-bold text-white mb-4">Quote Summary</h3>
              {quote ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quote Number</p>
                    <p className="text-white font-mono">{quote.quote_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Service Type</p>
                    <p className="text-white">{quote.service_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-white text-xl font-bold">₹{parseFloat(quote.monthly_price).toLocaleString()}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-800">
                      Verification Required
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Quote details unavailable.</p>
              )}
            </div>

            {/* Customer Details */}
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4">Customer Details</h3>
              {user && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-white">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mobile Number</p>
                    <p className="text-white">{user.phone || 'N/A'}</p>
                  </div>
                  {user.company && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Company Name</p>
                      <p className="text-white">{user.company}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-2xl p-5 flex items-start space-x-4">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h4 className="text-sm font-bold text-blue-300 mb-1">Security & Privacy</h4>
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  Your identity verification information is securely processed and stored. Aadhaar and PAN verification APIs will be connected in a future production release.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Verification Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* KYC Timeline Status */}
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Verification Status</h3>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                  overall_status === 'verified' ? 'bg-secondary/20 text-secondary border-secondary/50' :
                  overall_status === 'partially_verified' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' :
                  'bg-gray-800 text-gray-300 border-gray-600'
                }`}>
                  {overall_status === 'verified' ? 'Verified' : 
                   overall_status === 'partially_verified' ? 'Partially Verified' : 'Pending'}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="relative flex items-center justify-between mb-2">
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gray-800 -z-10"></div>
                <div className="h-0.5 bg-secondary absolute left-4 top-1/2 -translate-y-1/2 -z-10 transition-all duration-500" 
                     style={{ width: overall_status === 'verified' ? '100%' : overall_status === 'partially_verified' ? '50%' : '0%' }}></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[#020817] shadow-lg mb-2">✓</div>
                  <span className="text-xs text-gray-400">Submitted</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg mb-2 ${overall_status !== 'pending' ? 'bg-secondary text-[#020817]' : 'bg-gray-800 text-gray-500 border border-gray-600'}`}>
                    {overall_status !== 'pending' ? '✓' : '2'}
                  </div>
                  <span className="text-xs text-gray-400">Under Review</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg mb-2 ${overall_status === 'verified' ? 'bg-secondary text-[#020817]' : 'bg-gray-800 text-gray-500 border border-gray-600'}`}>
                    {overall_status === 'verified' ? '✓' : '3'}
                  </div>
                  <span className="text-xs text-gray-400">Approved</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg mb-2 ${overall_status === 'verified' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 border border-gray-600'}`}>
                    4
                  </div>
                  <span className="text-xs text-gray-400">Payment Pending</span>
                </div>
              </div>
            </div>

            {/* KYC Wizard or Status */}
            {overall_status === 'pending' ? (
              <KycWizard quote={quote} onComplete={fetchKycData} initialData={user} />
            ) : overall_status === 'under_review' || overall_status === 'rejected' || overall_status === 'failed' || overall_status === 'partially_verified' ? (
              <div className="space-y-6">
                <div className={`border rounded-2xl p-8 text-center ${overall_status === 'rejected' || overall_status === 'failed' ? 'bg-red-900/10 border-red-900/50' : 'bg-[#0a1128] border-yellow-500/50'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${overall_status === 'rejected' || overall_status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                    <svg className={`w-8 h-8 ${overall_status === 'rejected' || overall_status === 'failed' ? 'text-red-500' : 'text-yellow-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {overall_status === 'rejected' || overall_status === 'failed' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {overall_status === 'rejected' || overall_status === 'failed' ? 'Verification Rejected' : 'Verification Under Review'}
                  </h3>
                  <p className="text-gray-400">
                    {overall_status === 'rejected' || overall_status === 'failed' 
                      ? 'One or more documents were rejected. Please review the feedback below and upload replacements.' 
                      : 'Your documents have been submitted and are currently being reviewed by our compliance team. This usually takes 1-2 business hours.'}
                  </p>
                </div>

                {/* Always show the document center if not pending/verified so user can see what's happening */}
                <KycDocumentCenter kycData={kycData} onDocumentReplaced={fetchKycData} />
              </div>
            ) : null}

            {/* Payment Access Control */}
            <div className="pt-4">
              <button
                onClick={() => navigate(`/payment/${quoteId}`)}
                disabled={!isVerified}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center ${
                  isVerified 
                    ? 'bg-secondary text-[#020817] hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                {!isVerified && (
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                Proceed to Payment
              </button>
              {!isVerified && (
                <p className="text-center text-xs text-gray-500 mt-3">Complete all verification steps above to unlock payment.</p>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default VerificationPage;
