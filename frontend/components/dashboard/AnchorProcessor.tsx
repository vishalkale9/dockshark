'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function AnchorProcessor() {
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [anchorResult, setAnchorResult] = useState<any>(null);
  const [batchedCount, setBatchedCount] = useState<number>(0);

  const fetchBatchedCount = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/documents');
      if (data.documents) {
        const batched = data.documents.filter((doc: any) => doc.status === 'BATCHED');
        setBatchedCount(batched.length);
      }
    } catch (error) {
      console.error('Failed to fetch batched count', error);
    }
  }, []);

  useEffect(() => {
    fetchBatchedCount();
    window.addEventListener('documentAnchored', fetchBatchedCount);
    return () => window.removeEventListener('documentAnchored', fetchBatchedCount);
  }, [fetchBatchedCount]);

  const handlePushToBlockchain = async () => {
    setIsAnchoring(true);
    setAnchorResult(null);

    try {
      const data = await fetchWithAuth('/anchor/push', {
        method: 'POST'
      });
      setAnchorResult(data);
      // Tell the ledger to refresh so it shows the new Anchored status and TxHash
      window.dispatchEvent(new CustomEvent('documentAnchored'));
    } catch (error: any) {
      alert(error.message || 'Failed to push to Polygon.');
    } finally {
      setIsAnchoring(false);
    }
  };

  // Only showcase this panel if there are documents waiting to be pushed to the blockchain
  if (batchedCount === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-emerald-800 to-green-900 rounded-2xl shadow-lg text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Blockchain Network: Ready
          </h3>
          <p className="text-sm text-gray-200 mt-1">You have {batchedCount} batched document(s) ready to be permanently etched into Polygon.</p>
        </div>
        
        <button 
          onClick={handlePushToBlockchain}
          disabled={isAnchoring}
          className="shrink-0 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white font-bold rounded-xl transition-colors shadow-md flex items-center gap-2"
        >
          {isAnchoring ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Transmitting...
            </>
          ) : (
            'Push Merkle Roots to Polygon'
          )}
        </button>
      </div>

      {anchorResult && (
        <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-green-300 font-bold mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {anchorResult.message}
          </div>
          <div className="space-y-3 mt-3">
            {anchorResult.results?.map((res: any, idx: number) => (
               <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/5">
                 <p className="text-xs text-gray-300 font-bold mb-1">Merkle Root: <span className="font-mono font-normal">{res.merkleRoot}</span></p>
                 <p className="text-xs text-green-400 font-bold">Polygon TxHash: <span className="font-mono font-normal">{res.txHash}</span></p>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
