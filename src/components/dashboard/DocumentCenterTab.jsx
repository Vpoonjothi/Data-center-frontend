import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../utils/axios';

const DocumentCenterTab = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const [kycRes, quotesRes, paymentsRes, servicesRes] = await Promise.all([
          api.get('/kyc/my-kyc'),
          api.get('/quotes/my-quotes'),
          api.get('/payments/my-payments'),
          api.get('/services/my-services')
        ]);

        const allDocs = [];

        // Add KYC Documents
        if (kycRes.data.success) {
          kycRes.data.data.forEach(k => {
            if (k.aadhaar_front_path) {
              allDocs.push({
                id: `kyc-af-${k.id}`,
                name: 'Aadhaar Front',
                category: 'KYC Document',
                date: k.created_at,
                status: k.overall_status,
                url: k.aadhaar_front_path.startsWith('http') ? k.aadhaar_front_path : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`}${k.aadhaar_front_path}`
              });
            }
            if (k.aadhaar_back_path) {
              allDocs.push({
                id: `kyc-ab-${k.id}`,
                name: 'Aadhaar Back',
                category: 'KYC Document',
                date: k.created_at,
                status: k.overall_status,
                url: k.aadhaar_back_path.startsWith('http') ? k.aadhaar_back_path : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`}${k.aadhaar_back_path}`
              });
            }
            if (k.gst_cert_path) {
              allDocs.push({
                id: `kyc-gst-${k.id}`,
                name: 'GST Certificate',
                category: 'KYC Document',
                date: k.created_at,
                status: k.overall_status,
                url: k.gst_cert_path.startsWith('http') ? k.gst_cert_path : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`}${k.gst_cert_path}`
              });
            }
            if (k.pan_card_path) {
              allDocs.push({
                id: `kyc-pan-${k.id}`,
                name: 'PAN Card',
                category: 'KYC Document',
                date: k.created_at,
                status: k.overall_status,
                url: k.pan_card_path.startsWith('http') ? k.pan_card_path : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`}${k.pan_card_path}`
              });
            }
            if (k.company_reg_path) {
              allDocs.push({
                id: `kyc-reg-${k.id}`,
                name: 'Company Registration',
                category: 'KYC Document',
                date: k.created_at,
                status: k.overall_status,
                url: k.company_reg_path.startsWith('http') ? k.company_reg_path : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`}${k.company_reg_path}`
              });
            }
            if (k.address_proof_path) {
              allDocs.push({
                id: `kyc-add-${k.id}`,
                name: 'Address Proof',
                category: 'KYC Document',
                date: k.created_at,
                status: k.overall_status,
                url: k.address_proof_path.startsWith('http') ? k.address_proof_path : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`}${k.address_proof_path}`
              });
            }
          });
        }

        // Add Quotes
        if (quotesRes.data.success) {
          quotesRes.data.data.forEach(q => {
            allDocs.push({
              id: `quote-${q.id}`,
              name: `Quote ${q.quote_number}`,
              category: 'Quote',
              date: q.created_at,
              status: q.status.replace('_', ' '),
              url: null // Quotes are viewed internally
            });
          });
        }

        // Add Payments
        if (paymentsRes.data.success) {
          paymentsRes.data.data.forEach(p => {
            if (p.payment_screenshot) {
              allDocs.push({
                id: `pay-${p.id}`,
                name: p.invoice_reference || `Receipt INV-${p.id}`,
                category: 'Payment Receipt',
                date: p.payment_date,
                status: p.status,
                url: p.payment_screenshot
              });
            }
          });
        }

        // Add Services
        if (servicesRes.data.success) {
            servicesRes.data.data.forEach(s => {
              allDocs.push({
                id: `srv-${s.id}`,
                name: s.service_name || `Service ${s.id}`,
                category: 'Service Details',
                date: s.created_at,
                status: s.status,
                url: null 
              });
            });
          }

        // Sort documents by date descending
        allDocs.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setDocuments(allDocs);
      } catch (error) {
        console.error('Error fetching document center data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('verified') || s.includes('paid') || s.includes('active')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (s.includes('pending') || s.includes('quoted') || s.includes('processing')) {
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
    if (s.includes('rejected') || s.includes('failed')) {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  if (loading) {
    return <div className="text-slate-400">Loading Compliance Documents...</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-800 pb-4">Compliance Documents</h3>
      <p className="text-slate-400 mb-6 text-sm">Access all your historical records, including KYC documents, quotes, invoices, payment receipts, and service agreements.</p>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Document Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Upload Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm italic">
                    No documents found.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {doc.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{doc.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{new Date(doc.date).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium border rounded-md capitalize ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {doc.url ? (
                        <div className="flex justify-end gap-2">
                          <a href={doc.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md transition-colors border border-slate-700">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View
                          </a>
                          <a href={doc.url} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md transition-colors border border-slate-700">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                          </a>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-500 text-xs font-medium cursor-not-allowed">
                          Internal
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentCenterTab;
