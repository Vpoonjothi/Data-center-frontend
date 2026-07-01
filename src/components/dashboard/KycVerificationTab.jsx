import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const KycVerificationTab = () => {
  const [kycRecords, setKycRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kycRes = await api.get('/kyc/my-kyc');
        if (kycRes.success) {
          setKycRecords(kycRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching KYC tab data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'rejected':
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'under_review':
      case 'pending':
      case 'partially_verified': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (kycRecords.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Verification History</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-400 font-medium">No verification history found.</p>
          <p className="text-xs text-slate-500 mt-2">Any future identity verification records will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Verification History</h3>
      
      <div className="space-y-4">
        {kycRecords.map((kyc) => (
          <div key={kyc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start gap-6 hover:border-slate-700 transition-colors">
            
            <div className="flex-1 space-y-4 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Identity Verification</h4>
                  <p className="text-sm text-slate-400">Quote: {kyc.quote_id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(kyc.overall_status)}`}>
                  {getStatusLabel(kyc.overall_status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Verification Date</p>
                  <p className="text-sm text-slate-300">
                    {kyc.verified_at ? new Date(kyc.verified_at).toLocaleDateString() : (kyc.updated_at ? new Date(kyc.updated_at).toLocaleDateString() : 'Pending')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Verification ID</p>
                  <p className="text-sm text-slate-300 font-mono">KYC-{(kyc.id).toString().padStart(6, '0')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Aadhaar Status</p>
                  <p className={`text-sm ${kyc.aadhaar_status === 'verified' ? 'text-emerald-400' : 'text-slate-300'}`}>{getStatusLabel(kyc.aadhaar_status)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">PAN Status</p>
                  <p className={`text-sm ${kyc.pan_status === 'verified' ? 'text-emerald-400' : 'text-slate-300'}`}>{getStatusLabel(kyc.pan_status)}</p>
                </div>
              </div>

              {kyc.reject_reason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-xs font-bold text-red-400 uppercase mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-300">{kyc.reject_reason}</p>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default KycVerificationTab;
