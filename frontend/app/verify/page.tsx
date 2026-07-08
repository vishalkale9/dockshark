'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { keccak256 } from 'js-sha3';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const urlHash = searchParams.get('hash');

  const [verificationState, setVerificationState] = useState<'IDLE' | 'HASHING' | 'VERIFYING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const executeVerification = async (hexHash: string) => {
    setVerificationState('VERIFYING');

    try {
      const response = await fetch('http://localhost:5000/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentHash: hexHash })
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        setVerificationResult(data.data);
        setVerificationState('SUCCESS');
      } else {
        setErrorMessage(data.message || 'Document is not anchored or has been tampered with.');
        setVerificationState('ERROR');
      }
    } catch (error) {
      console.error("Verification failed", error);
      setErrorMessage('Failed to connect to verification server.');
      setVerificationState('ERROR');
    }
  };

  // Auto-verify if the URL contains a hash
  useEffect(() => {
    if (urlHash) {
      executeVerification(urlHash);
    }
  }, [urlHash]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    setVerificationState('HASHING');
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const buffer = event.target.result as ArrayBuffer;
        const hash = keccak256(buffer);
        const hexHash = `0x${hash}`;
        
        await executeVerification(hexHash);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1
  });

  const resetVerification = () => {
    setVerificationState('IDLE');
    setVerificationResult(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0A0D1A] flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 tracking-tight">
          Public Document Verification
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
          Drag and drop any file to cryptographically verify its authenticity against the Polygon blockchain. 
          <br/><span className="text-teal-400 text-sm font-bold">Files never leave your device.</span>
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="w-full max-w-3xl bg-[#141B34] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* IDLE & HASHING STATE */}
        {(verificationState === 'IDLE' || verificationState === 'HASHING' || verificationState === 'VERIFYING') && (
          <div className="p-10">
            <div 
              {...getRootProps()} 
              className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'border-teal-400 bg-teal-400/10 scale-105' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
              }`}
            >
              <input {...getInputProps()} />
              
              {verificationState === 'IDLE' && (
                <>
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-semibold text-white">Drag & Drop a document to verify</p>
                  <p className="text-gray-500 mt-2">or click to browse your local files</p>
                </>
              )}

              {verificationState === 'HASHING' && (
                <div className="py-8">
                  <div className="w-16 h-16 border-4 border-gray-700 border-t-teal-400 rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-xl font-bold text-teal-400">Computing local Keccak-256 hash...</p>
                  <p className="text-gray-500 mt-2 text-sm">Ensuring zero-knowledge privacy.</p>
                </div>
              )}

              {verificationState === 'VERIFYING' && (
                <div className="py-8">
                  <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-xl font-bold text-blue-400">Querying Polygon Ledger...</p>
                  <p className="text-gray-500 mt-2 text-sm">Validating cryptographic proofs.</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {verificationState === 'SUCCESS' && verificationResult && (
          <div className="bg-gradient-to-b from-green-900/40 to-[#141B34] p-10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-green-400 mb-2">Cryptographic Proof Verified</h2>
            <p className="text-gray-300 text-lg mb-8">This document is mathematically proven to be authentic and completely untampered.</p>
            
            <div className="bg-black/40 rounded-2xl p-6 text-left border border-green-500/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">File Name</p>
                  <p className="text-white font-medium">{verificationResult.fileName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Registered By</p>
                  <p className="text-white font-medium">{verificationResult.owner}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Polygon Transaction Hash</p>
                  <p className="text-green-400 font-mono text-sm break-all bg-green-900/30 p-2 rounded-lg border border-green-500/20">{verificationResult.polygonTxHash}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Document Hash (Keccak-256)</p>
                  <p className="text-gray-300 font-mono text-xs break-all">{verificationResult.documentHash}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={resetVerification}
              className="mt-8 px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors"
            >
              Verify Another Document
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {verificationState === 'ERROR' && (
          <div className="bg-gradient-to-b from-red-900/40 to-[#141B34] p-10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(239,68,68,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-red-400 mb-2">Verification Failed</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">{errorMessage}</p>
            
            <div className="bg-red-900/20 rounded-2xl p-6 text-left border border-red-500/30">
              <h3 className="text-red-400 font-bold mb-3">Why did this fail?</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>The document was never anchored to the blockchain.</li>
                <li>The document has been <strong className="text-white">altered or tampered with</strong> since it was anchored. Even changing a single comma completely changes the mathematical hash.</li>
                <li>You uploaded a different version of the file (e.g. compressed or saved differently).</li>
              </ul>
            </div>

            <button 
              onClick={resetVerification}
              className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
