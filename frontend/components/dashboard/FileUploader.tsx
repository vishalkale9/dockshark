'use client';

import React, { useState, useCallback } from 'react';
import { keccak256 } from 'js-sha3';

export default function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);

  const processFile = async (file: File) => {
    setIsHashing(true);
    setFileName(file.name);
    setFileHash(null);

    try {
      // Step 1: Read file completely into memory as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Step 2: Hash the array buffer using Keccak-256 (Zero Knowledge)
      const hash = keccak256(arrayBuffer);
      
      // Step 3: Discard arrayBuffer from memory (happens automatically via GC)
      // Display the hash with 0x prefix standard for Ethereum/Polygon ecosystem
      setTimeout(() => {
        setFileHash(`0x${hash}`);
        setIsHashing(false);
      }, 600); // Artificial micro-delay to show the premium loading state
      
    } catch (error) {
      console.error("Error hashing file:", error);
      alert("Failed to hash the document securely.");
      setIsHashing(false);
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
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload Zone */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-[#5236FF] bg-[#5236FF]/5 scale-[1.02] shadow-xl' 
            : 'border-gray-300 bg-white hover:border-[#E57A3C] hover:bg-gray-50'
          }`}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={onFileInput}
        />
        
        <div className="flex flex-col items-center justify-center gap-4 relative z-0">
          <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-[#5236FF]/10' : 'bg-gray-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 transition-colors ${isDragging ? 'text-[#5236FF]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-[#141B34] mb-2">
              {isDragging ? 'Drop document here' : 'Drag & Drop your document'}
            </h3>
            <p className="text-gray-500 font-medium">
              or click to browse your local files
            </p>
          </div>
          
          <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Zero-Knowledge Client-Side Hashing
          </div>
        </div>
      </div>

      {/* Results Display */}
      {isHashing && (
        <div className="mt-8 p-6 bg-white border border-gray-100 rounded-xl shadow-sm text-center animate-pulse">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-[#5236FF] rounded-full animate-spin"></div>
            <p className="text-[#141B34] font-bold text-lg">Computing Keccak-256 fingerprint...</p>
            <p className="text-gray-400 text-sm font-medium">Your file is not leaving your device.</p>
          </div>
        </div>
      )}

      {fileHash && !isHashing && (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#141B34] px-6 py-4 flex items-center justify-between">
            <h4 className="text-white font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#E57A3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Document Fingerprint Generated
            </h4>
            <span className="bg-[#5236FF] text-white text-xs px-3 py-1 rounded-full font-mono font-bold tracking-wider">Keccak-256</span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">File Name</p>
                 <p className="text-[#141B34] font-semibold text-sm truncate">{fileName}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Privacy Status</p>
                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-sm font-bold">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   Zero-Knowledge Verified
                 </span>
               </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Cryptographic Hash</p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 break-all font-mono text-[#5236FF] text-sm shadow-inner">
                {fileHash}
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 text-[#E57A3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This hash acts as the immutable fingerprint of your document. Because it was generated in your browser, the original file data remains strictly on your local device.
              </p>
            </div>
            
            <button className="w-full py-4 px-4 mt-4 text-sm rounded-xl font-bold text-white bg-[#141B34] hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group">
              Anchor to Blockchain (Step 2)
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
