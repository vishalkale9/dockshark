'use client';

import React, { useState, useCallback } from 'react';
import { keccak256 } from 'js-sha3';
import { CheckCircle2, XCircle, Search, FileText } from 'lucide-react';

type VerificationStatus = 'idle' | 'hashing' | 'verifying' | 'authentic' | 'unverified';

export default function DocumentVerifier() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  
  // Mock verification result - randomly pass/fail or just pass for demo
  const [verificationDetails, setVerificationDetails] = useState<any>(null);

  const processFile = async (file: File) => {
    setFileName(file.name);
    setStatus('hashing');
    setFileHash(null);
    setVerificationDetails(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hash = `0x${keccak256(arrayBuffer)}`;
      
      // Simulate zero-knowledge hash computation delay
      setTimeout(() => {
        setFileHash(hash);
        setStatus('verifying');
        
        // Simulate network call to blockchain indexer
        setTimeout(() => {
          // For demo purposes, we randomly simulate success or failure 
          // (In production, this queries the backend / Polygon contract)
          const isAuthentic = Math.random() > 0.3; // 70% chance of success
          
          if (isAuthentic) {
            setStatus('authentic');
            setVerificationDetails({
              timestamp: new Date().toISOString(),
              txHash: '0x3f5c9e2d...a8b41',
              issuer: 'DockSharks Secure Corp.',
              network: 'Polygon Mainnet'
            });
          } else {
            setStatus('unverified');
          }
        }, 1500);
      }, 800);
      
    } catch (error) {
      console.error("Hashing failed", error);
      setStatus('idle');
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0A0A0A] p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white/10 transition-colors">
      
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Secure Document Verification</h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Ensure the integrity of your documents. Drop a file to instantly verify its cryptographic proof on the Polygon blockchain. Your files never leave your device.
        </p>
      </div>

      {status === 'idle' && (
        <div 
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer overflow-hidden
            ${isDragging 
              ? 'border-white/50 bg-white/5 scale-[1.02] shadow-xl' 
              : 'border-white/20 bg-[#111111] hover:border-white/40 hover:bg-[#151515]'
            }`}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={onFileInput}
          />
          
          <div className="flex flex-col items-center justify-center gap-4 relative z-0">
            <div className={`p-5 rounded-full transition-colors ${isDragging ? 'bg-white/10' : 'bg-[#0A0A0A]'}`}>
              <Search className={`w-12 h-12 transition-colors ${isDragging ? 'text-white' : 'text-gray-500'}`} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isDragging ? 'Drop to verify' : 'Select a document to verify'}
              </h3>
              <p className="text-gray-500 font-medium text-sm">
                PDF, DOCX, JPG, PNG up to 50MB
              </p>
            </div>
          </div>
        </div>
      )}

      {(status === 'hashing' || status === 'verifying') && (
        <div className="p-12 bg-[#111111] border border-white/10 rounded-2xl text-center relative overflow-hidden">
          {/* Scanning Animation line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-[scan_2s_ease-in-out_infinite]"></div>
          
          <div className="flex flex-col items-center justify-center gap-6 relative z-10">
            <div className="relative">
              <FileText className="w-16 h-16 text-gray-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            
            <div>
              <p className="text-white font-bold text-xl mb-2">
                {status === 'hashing' ? 'Computing Keccak-256 Hash...' : 'Querying Polygon Blockchain...'}
              </p>
              <p className="text-gray-400 text-sm font-mono bg-[#0A0A0A] border border-white/10 px-3 py-1 rounded-lg truncate max-w-xs mx-auto">
                {status === 'verifying' ? fileHash : 'Processing securely locally...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'authentic' && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-8 text-center border-b border-white/10">
              <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4 border border-white/10">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Document is Authentic!</h3>
              <p className="text-gray-300 text-sm font-medium">
                This exact file matches a cryptographic root anchored to the blockchain.
              </p>
            </div>
            
            <div className="p-6 bg-[#0A0A0A] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">File Name</p>
                  <p className="text-gray-200 font-medium text-sm truncate">{fileName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Network</p>
                  <p className="text-gray-200 font-medium text-sm">{verificationDetails?.network}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Verified Issuer</p>
                  <p className="text-gray-200 font-medium text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>
                    {verificationDetails?.issuer}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Document Hash (Keccak-256)</p>
                  <p className="text-xs font-mono text-gray-400 break-all bg-[#111111] p-2 rounded border border-white/10">
                    {fileHash}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setStatus('idle')}
            className="w-full mt-6 py-4 px-4 text-sm rounded-xl font-bold text-black bg-white hover:bg-gray-200 transition-colors"
          >
            Verify Another Document
          </button>
        </div>
      )}

      {status === 'unverified' && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-[#111111] border border-red-500/50 rounded-2xl overflow-hidden p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4 border border-red-500/20">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-red-500 mb-2">Unverified Document</h3>
            <p className="text-gray-300 text-sm font-medium mb-6">
              This document's hash could not be found on the blockchain. It may have been modified, corrupted, or not officially anchored.
            </p>
            
            <div className="text-left bg-[#0A0A0A] p-4 rounded-xl border border-white/10">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Computed Hash</p>
              <p className="text-xs font-mono text-gray-400 break-all">
                {fileHash}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setStatus('idle')}
            className="w-full mt-6 py-4 px-4 text-sm rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
          >
            Try Another Document
          </button>
        </div>
      )}
    </div>
  );
}
