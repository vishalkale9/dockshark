'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FileUploader from '@/components/dashboard/FileUploader';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-116px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-[#141B34] sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Securely verify and anchor your documents to the blockchain.
            </p>
          </div>

          {/* Uploader Section */}
          <FileUploader />

          {/* Info Section */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-[#5236FF]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#141B34] mb-2">Step 1: Zero-Knowledge</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Your files are hashed locally in your browser using Keccak-256. We never see, store, or transmit your actual document data.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 text-[#E57A3C]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#141B34] mb-2">Step 2: Merkle Batching</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Multiple document hashes are cryptographically combined into a single, highly efficient Merkle Root structure.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#141B34] mb-2">Step 3: Polygon Anchor</h3>
              <p className="text-gray-500 text-sm leading-relaxed">The Merkle Root is securely anchored onto the Polygon L2 Blockchain, guaranteeing permanent, tamper-proof verification.</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
