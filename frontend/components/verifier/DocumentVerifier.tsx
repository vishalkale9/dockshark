'use client';

import React, { useState, useCallback } from 'react';
import { keccak256 } from 'js-sha3';
import { CheckCircle2, XCircle, Search, FileText, Loader2 } from 'lucide-react';

type FileStatus = 'hashing' | 'verifying' | 'authentic' | 'unverified';

type FileVerificationResult = {
  id: string;
  fileName: string;
  status: FileStatus;
  hash: string | null;
  details?: {
    timestamp: string;
    txHash: string;
    issuer: string;
    network: string;
  };
};

export default function DocumentVerifier() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileVerificationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = async (uploadedFiles: File[]) => {
    setIsProcessing(true);
    
    // Initialize results
    const newFiles: FileVerificationResult[] = uploadedFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      fileName: f.name,
      status: 'hashing',
      hash: null
    }));
    
    setFiles(prev => [...newFiles, ...prev]);

    // Process files sequentially or in parallel
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const resultId = newFiles[i].id;
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const hash = `0x${keccak256(arrayBuffer)}`;
        
        // Update to verifying
        setFiles(prev => prev.map(f => 
          f.id === resultId ? { ...f, hash, status: 'verifying' } : f
        ));
        
        // Real network call to backend API for verification
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentHash: hash })
        });
        
        const data = await response.json();
        
        setFiles(prev => prev.map(f => 
          f.id === resultId ? {
            ...f,
            status: data.verified ? 'authentic' : 'unverified',
            details: data.verified ? {
              timestamp: data.data.timestamp,
              txHash: data.data.polygonTxHash,
              issuer: data.data.owner,
              network: data.data.network || 'Ethereum Sepolia'
            } : undefined
          } : f
        ));
        
      } catch (error) {
        console.error("Hashing failed for", file.name, error);
        setFiles(prev => prev.map(f => 
          f.id === resultId ? { ...f, status: 'unverified' } : f
        ));
      }
    }
    
    setIsProcessing(false);
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
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'hashing':
      case 'verifying':
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
      case 'authentic':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'unverified':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const resetVerifier = () => {
    setFiles([]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0A0A0A] p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-white/10 transition-colors">
      
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Secure Document Verification</h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Ensure the integrity of your documents. Drop multiple files to instantly verify their cryptographic proofs on the Ethereum blockchain.
        </p>
      </div>

      {files.length === 0 ? (
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
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={onFileInput}
          />
          
          <div className="flex flex-col items-center justify-center gap-4 relative z-0">
            <div className={`p-5 rounded-full transition-colors ${isDragging ? 'bg-white/10' : 'bg-[#0A0A0A]'}`}>
              <Search className={`w-12 h-12 transition-colors ${isDragging ? 'text-white' : 'text-gray-500'}`} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isDragging ? 'Drop to verify' : 'Select documents to verify'}
              </h3>
              <p className="text-gray-500 font-medium text-sm">
                Drop one or multiple files (PDF, DOCX, JPG, PNG)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-medium text-white">Verification Results</h3>
              <p className="text-sm text-gray-400">
                {isProcessing ? 'Processing files...' : `Completed checking ${files.length} file(s)`}
              </p>
            </div>
            
            {!isProcessing && (
              <button 
                onClick={resetVerifier}
                className="px-4 py-2 text-sm font-medium rounded-lg text-black bg-white hover:bg-gray-200 transition-colors"
              >
                Verify More
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {files.map((file) => (
              <div 
                key={file.id} 
                className={`p-4 rounded-xl border transition-all ${
                  file.status === 'authentic' ? 'border-green-500/30 bg-green-500/5' :
                  file.status === 'unverified' ? 'border-red-500/30 bg-red-500/5' :
                  'border-white/10 bg-[#111111]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="mt-1">
                      {getStatusIcon(file.status)}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        file.status === 'authentic' ? 'text-green-400' :
                        file.status === 'unverified' ? 'text-red-500' :
                        'text-white'
                      }`}>
                        {file.fileName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 font-mono">
                          {file.status === 'hashing' ? 'Computing Hash...' : 
                           file.status === 'verifying' ? 'Querying Blockchain...' :
                           file.hash ? `${file.hash.substring(0, 14)}...${file.hash.substring(file.hash.length - 10)}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {file.status === 'authentic' && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded">
                      AUTHENTIC
                    </span>
                  )}
                  {file.status === 'unverified' && (
                    <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded">
                      UNVERIFIED
                    </span>
                  )}
                </div>
                
                {/* Expandable Details for Authentic Files */}
                {file.status === 'authentic' && file.details && (
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Timestamp</p>
                      <p className="text-gray-300 text-xs">
                        {new Date(file.details.timestamp).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Network</p>
                      <p className="text-gray-300 text-xs">{file.details.network}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Issuer</p>
                      <p className="text-gray-300 text-xs">{file.details.issuer}</p>
                    </div>
                    <div className="col-span-1 sm:col-span-3">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Etherscan Proof</p>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${file.details.txHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Transaction
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
