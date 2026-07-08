'use client';

import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DocumentLedger() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, anchored: 0, pending: 0, batched: 0 });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/documents');
      const docs = data.documents || [];
      setDocuments(docs);
      
      setStats({
        total: docs.length,
        anchored: docs.filter((d: any) => d.status === 'ANCHORED').length,
        pending: docs.filter((d: any) => d.status === 'PENDING_BATCH').length,
        batched: docs.filter((d: any) => d.status === 'BATCHED').length,
      });
    } catch (error) {
      console.error('Failed to fetch documents', error);
      toast.error('Failed to load document ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    
    const handleDocumentAnchored = () => {
      fetchDocuments();
    };
    
    window.addEventListener('documentAnchored', handleDocumentAnchored);
    return () => window.removeEventListener('documentAnchored', handleDocumentAnchored);
  }, []);

  const copyProofLink = (hash: string) => {
    const link = `${window.location.origin}/verify?hash=${hash}`;
    navigator.clipboard.writeText(link);
    toast.success('Proof Link Copied to Clipboard!');
  };

  return (
    <div className="mt-16">
      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Uploads</span>
          <span className="text-3xl font-extrabold text-[#141B34] mt-2">{stats.total}</span>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl border border-green-100 shadow-sm flex flex-col">
          <span className="text-green-700 text-sm font-semibold uppercase tracking-wider">Secured (Anchored)</span>
          <span className="text-3xl font-extrabold text-green-700 mt-2">{stats.anchored}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Pending Batch</span>
          <span className="text-3xl font-extrabold text-yellow-600 mt-2">{stats.pending}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Ready to Push</span>
          <span className="text-3xl font-extrabold text-blue-600 mt-2">{stats.batched}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-[#141B34]">Document Ledger</h2>
        <button 
          onClick={fetchDocuments}
          className="text-sm font-semibold text-[#5236FF] hover:text-[#3d27ca] flex items-center gap-1 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading && documents.length === 0 ? (
          <div className="p-12 flex justify-center">
             <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#5236FF]"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#141B34]">No documents yet</h3>
            <p className="text-gray-500 mt-1">Anchor your first document above to see it securely stored here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider font-bold text-gray-500">
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Anchored</th>
                  <th className="px-6 py-4 text-right">Blockchain Tx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#141B34]">{doc.fileName}</span>
                        <span className="text-xs text-gray-400 font-mono mt-1 w-32 md:w-48 truncate" title={doc.documentHash}>
                          {doc.documentHash}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {doc.status === 'PENDING_BATCH' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-200 shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                          Queued for Batching
                        </span>
                      ) : doc.status === 'BATCHED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Batched (Ready for Anchor)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-200 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Anchored on Polygon
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {doc.polygonTxHash ? (
                        <div className="flex items-center justify-end gap-3">
                          <a href={`https://polygonscan.com/tx/${doc.polygonTxHash}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#5236FF] hover:text-[#3d27ca] transition-colors flex items-center gap-1 bg-[#5236FF]/10 px-2.5 py-1.5 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Polygon
                          </a>
                          
                          <button 
                            onClick={() => copyProofLink(doc.documentHash)}
                            className="text-xs font-bold text-gray-700 hover:text-black transition-colors flex items-center gap-1 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200"
                            title="Copy Proof Link"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Copy Link
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Pending...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
