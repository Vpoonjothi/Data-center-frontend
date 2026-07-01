import React, { useState } from 'react';
import { replaceKycDocument } from '../../services/api';
import FileUpload from './FileUpload';

const KycDocumentCenter = ({ kycData, onDocumentReplaced }) => {
  const [replacingDoc, setReplacingDoc] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!kycData) return null;

  const getRequiredDocs = () => {
    return kycData.customer_type === 'company' 
      ? [
          { key: 'gst_cert', label: 'GST Certificate' },
          { key: 'pan_card', label: 'PAN Card Copy' },
          { key: 'aadhaar_front', label: 'Auth Person Aadhaar Front' },
          { key: 'aadhaar_back', label: 'Auth Person Aadhaar Back' },
          { key: 'company_reg', label: 'Company Registration (Optional)' }
        ]
      : [
          { key: 'aadhaar_front', label: 'Aadhaar Front' },
          { key: 'aadhaar_back', label: 'Aadhaar Back' }
        ];
  };

  const handleReplaceSubmit = async (docKey) => {
    if (!replacementFile) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('quoteId', kycData.quote_id);
      formData.append('documentType', docKey);
      formData.append('document', replacementFile);
      
      await replaceKycDocument(formData);
      setReplacingDoc(null);
      setReplacementFile(null);
      onDocumentReplaced();
    } catch (error) {
      alert('Failed to replace document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const docs = getRequiredDocs();

  return (
    <div className="bg-[#0a1128] border border-gray-800 rounded-2xl p-6 mt-6">
      <h3 className="text-xl font-bold text-white mb-4">KYC Document Center</h3>
      <p className="text-gray-400 text-sm mb-6">Manage your uploaded identity documents and view verification feedback.</p>
      
      <div className="space-y-4">
        {docs.map(doc => {
          const path = kycData[`${doc.key}_path`];
          const status = kycData[`${doc.key}_status`] || 'pending';
          const reason = kycData[`${doc.key}_reason`];

          if (!path) return null;

          return (
            <div key={doc.key} className="bg-[#020817] p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-white text-sm">{doc.label}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {status.toUpperCase()}
                  </span>
                </div>
                {reason && status === 'rejected' && (
                  <p className="text-xs text-red-400 mt-2 bg-red-900/20 p-2 rounded border border-red-900/50">
                    <span className="font-bold">Reason: </span>{reason}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href={`/api/kyc/document?path=${path}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  View
                </a>
                
                {status === 'rejected' && (
                  <button 
                    onClick={() => setReplacingDoc(replacingDoc === doc.key ? null : doc.key)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 transition-colors"
                  >
                    {replacingDoc === doc.key ? 'Cancel' : 'Replace'}
                  </button>
                )}
              </div>
              
              {replacingDoc === doc.key && (
                <div className="w-full mt-4 pt-4 border-t border-gray-800 md:col-span-full">
                  <FileUpload 
                    label={`Upload new ${doc.label}`}
                    name={doc.key}
                    accept=".pdf,.jpg,.jpeg,.png"
                    description="Upload a clear copy to replace the rejected document."
                    currentFile={replacementFile}
                    onChange={(name, file) => setReplacementFile(file)}
                  />
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={() => handleReplaceSubmit(doc.key)}
                      disabled={!replacementFile || isSubmitting}
                      className="px-6 py-2 bg-secondary text-white rounded-lg font-bold disabled:opacity-50"
                    >
                      {isSubmitting ? 'Uploading...' : 'Submit Replacement'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KycDocumentCenter;
