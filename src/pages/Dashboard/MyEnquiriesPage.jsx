import React, { useState, useEffect } from 'react';
import { getMyEnquiries } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const MyEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await getMyEnquiries();
        if (res.success) {
          setEnquiries(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch enquiries', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-300 font-sans min-h-screen pb-20 pt-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Enquiries & Messages</h1>
          <p className="mt-1 text-slate-400">View your support tickets, requests, and communications with our team.</p>
        </div>

        {enquiries.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2">No Enquiries Found</h3>
            <p className="text-slate-400">You haven't submitted any enquiries yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div key={enq.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-700">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpand(enq.id)}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                        {enq.type}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </span>
                      {enq.responses && enq.responses.length > 0 && (
                        <span className="flex items-center gap-1 text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-md border border-secondary/20">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                          {enq.responses.length} Repl{enq.responses.length > 1 ? 'ies' : 'y'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white truncate max-w-[600px]">{enq.message}</h3>
                  </div>
                  <div className={`p-2 rounded-lg bg-slate-950 transition-transform duration-300 ${expandedId === enq.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === enq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-800/50"
                    >
                      <div className="p-6 bg-slate-900/50">
                        
                        {/* Original Message */}
                        <div className="mb-6">
                          <div className="inline-block px-4 py-3 bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-700 max-w-[85%]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-300">You</span>
                              <span className="text-[10px] text-slate-500">{new Date(enq.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{enq.message}</p>
                          </div>
                        </div>

                        {/* Responses */}
                        {enq.responses && enq.responses.length > 0 ? (
                          <div className="space-y-6">
                            {enq.responses.map(resp => (
                              <div key={resp.id} className="flex justify-end">
                                <div className="inline-block px-4 py-3 bg-[#1A801D]/10 rounded-2xl rounded-tr-sm border border-[#1A801D]/20 max-w-[85%]">
                                  <div className="flex items-center justify-end gap-2 mb-1">
                                    <span className="text-[10px] text-emerald-500/70">{new Date(resp.created_at).toLocaleString()}</span>
                                    <span className="text-xs font-bold text-emerald-400">{resp.admin ? resp.admin.name : 'GreenLeaf Support'}</span>
                                  </div>
                                  {resp.subject && (
                                    <p className="text-xs font-bold text-emerald-300 mb-1">{resp.subject}</p>
                                  )}
                                  <p className="text-sm text-emerald-100/90 whitespace-pre-wrap">{resp.response}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-slate-500 italic">We have received your enquiry and our team will respond shortly.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyEnquiriesPage;
