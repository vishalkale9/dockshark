'use client';

import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DocumentLedger() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 5;

  const fetchDocuments = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`/documents?page=${page}&limit=${itemsPerPage}`);
      setDocuments(data.documents || []);
      
      if (data.pagination) {
        setTotalCount(data.pagination.totalCount);
      }
    } catch (error) {
      console.error('Failed to fetch documents', error);
      toast.error('Failed to load document ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(currentPage);
    
    const handleDocumentAnchored = () => {
      fetchDocuments(currentPage);
    };
    
    window.addEventListener('documentAnchored', handleDocumentAnchored);
    return () => window.removeEventListener('documentAnchored', handleDocumentAnchored);
  }, [currentPage]);

  const copyProofLink = (hash: string) => {
    const link = `${window.location.origin}/verify?hash=${hash}`;
    navigator.clipboard.writeText(link);
    toast.success('Proof Link Copied to Clipboard!');
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-[#141B34] dark:text-white">Document Ledger</h2>
        <button 
          onClick={() => fetchDocuments(currentPage)}
          className="text-sm font-semibold text-[#141B34] dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors bg-white dark:bg-[#111111] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(255,255,255,0.02)] overflow-hidden">
        {loading && documents.length === 0 ? (
          <div className="p-12 flex justify-center">
             <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 dark:border-gray-700 border-t-[#141B34] dark:border-t-white"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#141B34] dark:text-white">No documents yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Anchor your first document above to see it securely stored here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-[#111111] text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4">Filename</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#141B34] dark:text-gray-200 flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#141B34] dark:text-white">{doc.fileName}</span>
                        <span className="text-xs text-gray-400 font-mono mt-1 w-32 md:w-48 truncate" title={doc.documentHash}>
                          {doc.documentHash}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {doc.status === 'ANCHORED' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-[#112228] text-green-800 dark:text-[#00E5FF] border border-green-200 dark:border-[#1E3A42]">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-[#00E5FF] mr-1.5 animate-pulse"></span>
                          Anchored
                        </span>
                      ) : doc.status === 'BATCHED' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-white/10 text-[#141B34] dark:text-white border border-gray-200 dark:border-white/20">
                          Batched
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-100 dark:bg-[#111111] text-yellow-800 dark:text-[#F9A826] border border-yellow-200 dark:border-white/10">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {new Date(doc.createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {doc.status === 'ANCHORED' && doc.proofHash ? (
                        <div className="flex items-center justify-end gap-3">
                          <a href={`https://polygonscan.com/tx/${doc.polygonTxHash}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#141B34] dark:text-white hover:text-black transition-colors flex items-center gap-1 bg-gray-100 dark:bg-white/10 px-2.5 py-1.5 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Polygon
                          </a>
                          <button 
                            onClick={() => copyProofLink(doc.documentHash)}
                            className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 bg-gray-100 dark:bg-[#111111] px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10"
                            title="Copy Proof Link"
                          >
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
            <div className="p-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                >
                  &lt;
                </button>
                {[...Array(Math.ceil(totalCount / itemsPerPage) || 0)].map((_, i) => {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors text-sm font-semibold ${currentPage === i + 1 ? 'bg-[#141B34] dark:bg-white text-white dark:text-black border-[#141B34] dark:border-white shadow-sm' : 'bg-white dark:bg-transparent border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalCount / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(totalCount / itemsPerPage) || totalCount === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
