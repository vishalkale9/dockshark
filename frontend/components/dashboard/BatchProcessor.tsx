'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function BatchProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const fetchPendingCount = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/documents');
      if (data.documents) {
        const pending = data.documents.filter((doc: any) => doc.status === 'PENDING_BATCH');
        setPendingCount(pending.length);
      }
    } catch (error) {
      console.error('Failed to fetch pending count', error);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount();
    window.addEventListener('documentAnchored', fetchPendingCount);
    return () => window.removeEventListener('documentAnchored', fetchPendingCount);
  }, [fetchPendingCount]);

  const handleProcessBatch = async () => {
    setIsProcessing(true);
    setBatchResult(null);

    try {
      const data = await fetchWithAuth('/batch/process', {
        method: 'POST'
      });
      setBatchResult(data);
      // Tell the ledger to refresh so it shows the new Merkle Roots
      window.dispatchEvent(new CustomEvent('documentAnchored'));
    } catch (error: any) {
      alert(error.message || 'Failed to process batch.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Only showcase the Merkle Batching panel if there are multiple files waiting
  if (pendingCount < 2) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-[#141B34] to-[#252F5A] rounded-2xl shadow-lg text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E57A3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Merkle Batching
          </h3>
          <p className="text-sm text-gray-300 mt-1">Combine all pending document hashes into a single cryptographic Merkle Root.</p>
        </div>
        
        <button 
          onClick={handleProcessBatch}
          disabled={isProcessing}
          className="shrink-0 px-6 py-3 bg-[#5236FF] hover:bg-[#3d27ca] disabled:opacity-70 text-white font-bold rounded-xl transition-colors shadow-md flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Computing Tree...
            </>
          ) : (
            'Process Pending Batch'
          )}
        </button>
      </div>

      {batchResult && (
        <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {batchResult.message}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Documents Batched</p>
              <p className="text-lg font-bold">{batchResult.documentsBatched}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Merkle Root</p>
              <p className="text-xs font-mono text-[#E57A3C] break-all">{batchResult.merkleRoot}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
