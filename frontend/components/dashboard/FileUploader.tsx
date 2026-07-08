'use client';

import React, { useState, useCallback } from 'react';
import { keccak256 } from 'js-sha3';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';

export default function FileUploader() {
  const [activeTab, setActiveTab] = useState<'single' | 'multiple'>('single');
  const [isDragging, setIsDragging] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  
  // Single document state
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Multiple documents state
  const [documents, setDocuments] = useState<{ fileName: string, documentHash: string }[]>([]);
  
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [anchorSuccess, setAnchorSuccess] = useState(false);

  const processFiles = async (files: FileList | File[]) => {
    setIsHashing(true);
    setAnchorSuccess(false);

    try {
      if (activeTab === 'single') {
        const file = files[0];
        setFileName(file.name);
        setFileHash(null);
        
        const arrayBuffer = await file.arrayBuffer();
        const hash = keccak256(arrayBuffer);
        
        setTimeout(() => {
          setFileHash(`0x${hash}`);
          setIsHashing(false);
        }, 600);
      } else {
        // Process multiple
        const newDocs: { fileName: string, documentHash: string }[] = [];
        
        // Process them sequentially to avoid locking the UI completely
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const arrayBuffer = await file.arrayBuffer();
          const hash = keccak256(arrayBuffer);
          newDocs.push({
            fileName: file.name,
            documentHash: `0x${hash}`
          });
        }
        
        setTimeout(() => {
          setDocuments(prev => [...prev, ...newDocs]);
          setIsHashing(false);
        }, 800);
      }
    } catch (error) {
      console.error("Error hashing file(s):", error);
      alert("Failed to hash the document securely.");
      setIsHashing(false);
    }
  };

  const handleAnchorSingle = async () => {
    if (!fileHash || !fileName) return;
    
    setIsAnchoring(true);
    try {
      const result = await fetchWithAuth('/anchor/push-single', {
        method: 'POST',
        body: JSON.stringify({ documentHash: fileHash, fileName })
      });
      setAnchorSuccess(true);
      window.dispatchEvent(new CustomEvent('documentAnchored'));
    } catch (error: any) {
      alert(error.message || "Failed to anchor document.");
    } finally {
      setIsAnchoring(false);
    }
  };

  const handleAnchorBulk = async () => {
    if (documents.length === 0) return;
    
    setIsAnchoring(true);
    try {
      const result = await fetchWithAuth('/documents/bulk', {
        method: 'POST',
        body: JSON.stringify({ documents })
      });
      setAnchorSuccess(true);
      toast.success(result.message); // Show how many were inserted/skipped
      window.dispatchEvent(new CustomEvent('documentAnchored'));
    } catch (error: any) {
      toast.error(error.message || "Failed to bulk anchor documents.");
    } finally {
      setIsAnchoring(false);
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
      processFiles(e.dataTransfer.files);
    }
  }, [activeTab]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      
      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
        <button
          onClick={() => {
            setActiveTab('single');
            setAnchorSuccess(false);
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'single' 
              ? 'bg-white text-[#141B34] shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Single Document
        </button>
        <button
          onClick={() => {
            setActiveTab('multiple');
            setAnchorSuccess(false);
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'multiple' 
              ? 'bg-white text-[#141B34] shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Multiple Documents
        </button>
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-[#5236FF] bg-[#5236FF]/5 scale-[1.02] shadow-xl' 
            : 'border-gray-300 bg-gray-50 hover:border-[#E57A3C] hover:bg-gray-100'
          }`}
      >
        <input 
          type="file" 
          multiple={activeTab === 'multiple'}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={onFileInput}
        />
        
        <div className="flex flex-col items-center justify-center gap-4 relative z-0">
          <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-[#5236FF]/10' : 'bg-white'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 transition-colors ${isDragging ? 'text-[#5236FF]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {activeTab === 'single' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              )}
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-[#141B34] mb-2">
              {isDragging ? 'Drop your files here' : activeTab === 'single' ? 'Upload a single document' : 'Upload multiple documents'}
            </h3>
            <p className="text-gray-500 font-medium text-sm">
              Drag & drop or click to browse local files
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

      {/* Loading State */}
      {isHashing && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-xl shadow-sm text-center animate-pulse">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#5236FF] rounded-full animate-spin"></div>
            <p className="text-[#141B34] font-bold text-lg">Computing Keccak-256 fingerprint(s)...</p>
            <p className="text-gray-400 text-sm font-medium">Your files are not leaving your device.</p>
          </div>
        </div>
      )}

      {/* SINGLE TAB DISPLAY */}
      {activeTab === 'single' && fileHash && !isHashing && (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">File Name</p>
              <p className="text-[#141B34] font-semibold text-sm truncate">{fileName}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Cryptographic Hash</p>
              <div className="bg-white p-4 rounded-xl border border-gray-200 break-all font-mono text-[#5236FF] text-sm">
                {fileHash}
              </div>
            </div>
            
            {anchorSuccess ? (
              <div className="w-full py-4 px-4 mt-4 text-sm rounded-xl font-bold text-green-700 bg-green-100 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Anchored to Polygon Blockchain!
              </div>
            ) : (
              <button 
                onClick={handleAnchorSingle}
                disabled={isAnchoring}
                className="w-full py-4 px-4 mt-4 text-sm rounded-xl font-bold text-white bg-[#141B34] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isAnchoring ? 'Queueing...' : 'Anchor to Blockchain'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* MULTIPLE TAB DISPLAY */}
      {activeTab === 'multiple' && documents.length > 0 && !isHashing && (
        <div className="mt-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-[#141B34]">{documents.length} Document(s) Ready</h4>
            <button 
              onClick={() => setDocuments([])} 
              className="text-sm text-red-500 hover:text-red-700 font-bold"
            >
              Clear List
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-2 mb-6 space-y-2">
            {documents.map((doc, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-semibold text-sm text-[#141B34] truncate max-w-[200px]">{doc.fileName}</span>
                <span className="text-xs font-mono text-gray-500 truncate max-w-[300px]">{doc.documentHash}</span>
              </div>
            ))}
          </div>

          {anchorSuccess ? (
            <div className="w-full py-4 px-4 text-sm rounded-xl font-bold text-green-700 bg-green-100 flex items-center justify-center gap-3">
              Bulk Batch Queued Successfully!
            </div>
          ) : (
            <button 
              onClick={handleAnchorBulk}
              disabled={isAnchoring}
              className="w-full py-4 px-4 text-sm rounded-xl font-bold text-white bg-[#5236FF] hover:bg-[#3d27ca] transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-md"
            >
              {isAnchoring ? 'Sending Bulk Batch...' : `Anchor ${documents.length} Documents`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
