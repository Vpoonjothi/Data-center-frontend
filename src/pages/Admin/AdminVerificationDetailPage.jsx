import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminKycVerificationById, updateAdminKycVerificationStatus, updateAdminKycDocumentStatus, getKycDocumentBlob } from '../../services/adminApi';

const DocumentViewer = ({ label, path, userId, docKey, status, reason, onUpdateStatus }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  // Local state for rejecting a document
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchDocument = async () => {
    if (!path) return;
    try {
      setLoading(true);
      const blob = await getKycDocumentBlob(path, userId);
      setBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Failed to fetch document:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [path, userId]);

  if (!path) return null;

  const handleApprove = () => {
    onUpdateStatus(docKey, 'approved', '');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onUpdateStatus(docKey, 'rejected', rejectReason);
    setIsRejecting(false);
  };

  return (
    <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-400 font-medium">{label}</p>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
            status === 'approved' ? 'bg-green-500/20 text-green-400' :
            status === 'rejected' ? 'bg-red-500/20 text-red-400' :
            status === 'replaced' ? 'bg-blue-500/20 text-blue-400' :
            'bg-yellow-500/20 text-yellow-500'
          }`}>
            {status || 'pending'}
          </span>
        </div>
        <a 
          href={blobUrl || '#'} 
          download={path} 
          className={`text-xs px-3 py-1 rounded bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors ${!blobUrl ? 'pointer-events-none opacity-50' : ''}`}
        >
          Download
        </a>
      </div>
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-800 relative group mb-3">
        {loading ? (
          <div className="w-6 h-6 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
        ) : error ? (
          <span className="text-red-400 text-xs">Failed to load</span>
        ) : blobUrl ? (
          path.toLowerCase().endsWith('.pdf') ? (
            <div className="text-center">
              <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <a href={blobUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:underline">View PDF</a>
            </div>
          ) : (
            <>
              <img src={blobUrl} alt={label} className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a href={blobUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-black text-xs font-bold rounded">View Full Size</a>
              </div>
            </>
          )
        ) : null}
      </div>

      {reason && status === 'rejected' && (
        <div className="mb-3 p-2 bg-red-900/20 border border-red-900/50 rounded text-xs text-red-400">
          <span className="font-bold">Reason:</span> {reason}
        </div>
      )}

      {/* Action Buttons */}
      {!isRejecting ? (
        <div className="flex gap-2">
          <button 
            onClick={handleApprove}
            disabled={status === 'approved'}
            className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${status === 'approved' ? 'bg-green-500/20 text-green-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-green-600'}`}
          >
            {status === 'approved' ? 'Approved' : 'Approve'}
          </button>
          <button 
            onClick={() => setIsRejecting(true)}
            disabled={status === 'rejected'}
            className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${status === 'rejected' ? 'bg-red-500/20 text-red-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-red-600'}`}
          >
            {status === 'rejected' ? 'Rejected' : 'Reject'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Reason for rejection..." 
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            className="w-full bg-[#0a1128] border border-gray-700 rounded p-1.5 text-xs text-white"
          />
          <div className="flex gap-2">
            <button onClick={handleReject} className="flex-1 py-1 rounded text-xs font-bold bg-red-600 text-white">Confirm</button>
            <button onClick={() => setIsRejecting(false)} className="flex-1 py-1 rounded text-xs font-bold bg-gray-700 text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminVerificationDetailPage = () => {
  const { id } = useParams();
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchVerificationDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVerificationDetails = async () => {
    try {
      const res = await getAdminKycVerificationById(id);
      setKyc(res.data);
      setAdminNotes(res.data.admin_notes || '');
    } catch (err) {
      setError('Failed to fetch KYC verification details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpdateStatus = async (docKey, status, reason) => {
    try {
      await updateAdminKycDocumentStatus(id, docKey, status, reason);
      await fetchVerificationDetails(); // Refresh to get updated overall status
    } catch (err) {
      console.error(err);
      alert('Failed to update document status');
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      setActionLoading(true);
      await updateAdminKycVerificationStatus(id, status, '', adminNotes);
      await fetchVerificationDetails();
      alert(`KYC status updated to ${status}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !kyc) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
        {error || 'KYC Verification not found.'}
        <Link to="/admin/verifications" className="block mt-4 text-white underline hover:text-gray-300">Back to Verifications</Link>
      </div>
    );
  }

  const isCompany = kyc.customer_type === 'company';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/admin/verifications" className="p-2 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-white">KYC Details Review</h1>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
          kyc.overall_status === 'verified' ? 'bg-secondary/10 text-secondary border-secondary/30' :
          kyc.overall_status === 'partially_verified' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
          kyc.overall_status === 'failed' || kyc.overall_status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
          kyc.overall_status === 'under_review' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
          'bg-gray-800 text-gray-300 border-gray-600'
        }`}>
          {kyc.overall_status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Customer Details & Documents */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Customer Information</h3>
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-xs uppercase font-bold">{kyc.customer_type}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isCompany ? (
                <>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Company Name</p>
                    <p className="text-white font-medium">{kyc.company_name}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">GST Number</p>
                    <p className="text-white font-mono font-medium">{kyc.gst_number}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">PAN Number</p>
                    <p className="text-white font-mono font-medium">{kyc.pan_number}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Official Email</p>
                    <p className="text-white font-medium">{kyc.official_email}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800 md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Registered Address</p>
                    <p className="text-white font-medium">{kyc.registered_address}</p>
                  </div>
                  <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-800">
                    <h4 className="text-sm font-bold text-gray-400 mb-4">Authorized Contact Person</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Name</p>
                        <p className="text-white font-medium">{kyc.auth_contact_person}</p>
                      </div>
                      <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Designation</p>
                        <p className="text-white font-medium">{kyc.designation}</p>
                      </div>
                      <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Mobile</p>
                        <p className="text-white font-medium">{kyc.mobile_number}</p>
                      </div>
                      <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Auth Aadhaar Number</p>
                        <p className="text-white font-mono font-medium">{kyc.auth_aadhaar_number}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-white font-medium">{kyc.full_name}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-white font-medium">{kyc.email_address}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Mobile</p>
                    <p className="text-white font-medium">{kyc.mobile_number}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Aadhaar Number</p>
                    <p className="text-white font-mono font-medium">{kyc.aadhaar_number}</p>
                  </div>
                  <div className="bg-[#020817] p-4 rounded-xl border border-gray-800 md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Residential Address</p>
                    <p className="text-white font-medium">{kyc.residential_address}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Uploaded Documents</h3>
            <p className="text-sm text-gray-400 mb-4">Review and approve or reject each document individually.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kyc.aadhaar_front_path && <DocumentViewer label="Aadhaar Front" path={kyc.aadhaar_front_path} userId={kyc.user_id} docKey="aadhaar_front" status={kyc.aadhaar_front_status} reason={kyc.aadhaar_front_reason} onUpdateStatus={handleDocumentUpdateStatus} />}
              {kyc.aadhaar_back_path && <DocumentViewer label="Aadhaar Back" path={kyc.aadhaar_back_path} userId={kyc.user_id} docKey="aadhaar_back" status={kyc.aadhaar_back_status} reason={kyc.aadhaar_back_reason} onUpdateStatus={handleDocumentUpdateStatus} />}
              {kyc.gst_cert_path && <DocumentViewer label="GST Certificate" path={kyc.gst_cert_path} userId={kyc.user_id} docKey="gst_cert" status={kyc.gst_cert_status} reason={kyc.gst_cert_reason} onUpdateStatus={handleDocumentUpdateStatus} />}
              {kyc.pan_card_path && <DocumentViewer label="PAN Card" path={kyc.pan_card_path} userId={kyc.user_id} docKey="pan_card" status={kyc.pan_card_status} reason={kyc.pan_card_reason} onUpdateStatus={handleDocumentUpdateStatus} />}
              {kyc.company_reg_path && <DocumentViewer label="Company Registration" path={kyc.company_reg_path} userId={kyc.user_id} docKey="company_reg" status={kyc.company_reg_status} reason={kyc.company_reg_reason} onUpdateStatus={handleDocumentUpdateStatus} />}
              {kyc.address_proof_path && <DocumentViewer label="Address Proof" path={kyc.address_proof_path} userId={kyc.user_id} docKey="address_proof" status={kyc.address_proof_status} reason={kyc.address_proof_reason} onUpdateStatus={handleDocumentUpdateStatus} />}
            </div>
          </div>

          {kyc.documents && kyc.documents.length > 0 && (
            <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Document Version History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400">
                      <th className="pb-3 pr-4 font-medium">Type</th>
                      <th className="pb-3 pr-4 font-medium">Version</th>
                      <th className="pb-3 pr-4 font-medium">Date Uploaded</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {kyc.documents.map((doc) => (
                      <tr key={doc.id} className="text-gray-300">
                        <td className="py-3 pr-4 uppercase text-xs tracking-wider">{doc.document_type.replace('_', ' ')}</td>
                        <td className="py-3 pr-4 font-mono">v{doc.version_number}</td>
                        <td className="py-3 pr-4">{new Date(doc.created_at).toLocaleString()}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            doc.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                            doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs">{doc.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Action Panel */}
        <div className="space-y-6">
          
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quote Context</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Quote Number</p>
                <p className="text-white font-mono">{kyc.quote?.quote_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Service Type</p>
                <p className="text-white">{kyc.quote?.service_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Price</p>
                <p className="text-white font-bold text-xl">₹{parseFloat(kyc.quote?.monthly_price).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 shadow-xl sticky top-6">
            <h3 className="text-lg font-bold text-white mb-6">Global Action</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Internal Admin Notes</label>
                <textarea 
                  className="w-full bg-[#020817] border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-secondary transition-colors" 
                  rows="3"
                  placeholder="Notes visible only to admins..."
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={() => handleUpdateStatus('verified')}
                  disabled={actionLoading || kyc.overall_status === 'verified'}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  Save Admin Notes
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-xs text-blue-300">Overall KYC status is determined automatically based on individual document approvals.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminVerificationDetailPage;
