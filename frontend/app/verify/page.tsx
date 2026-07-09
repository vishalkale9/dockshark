import React from 'react';
import DocumentVerifier from '@/components/verifier/DocumentVerifier';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-black transition-colors pb-20 pt-20">
      {/* Verification Header */}
      <div className="bg-black border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Document Authenticity Verification
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Instantly verify the cryptographic integrity of any document anchored to the Polygon Blockchain. 
            No account required.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <DocumentVerifier />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
          <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 mx-auto bg-[#111111] text-white rounded-full flex items-center justify-center mb-4 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Zero-Knowledge</h4>
            <p className="text-sm text-gray-400">
              Your document never leaves your device. We compute a cryptographic fingerprint locally.
            </p>
          </div>
          
          <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 mx-auto bg-[#111111] text-white rounded-full flex items-center justify-center mb-4 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Blockchain Immutable</h4>
            <p className="text-sm text-gray-400">
              We check the fingerprint against our secure Merkle roots anchored to Polygon.
            </p>
          </div>
          
          <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="w-12 h-12 mx-auto bg-[#111111] text-white rounded-full flex items-center justify-center mb-4 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Instant Verification</h4>
            <p className="text-sm text-gray-400">
              Get an instant mathematical guarantee of your document's authenticity and integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
