'use client';

import React from 'react';
import OverviewStats from '@/components/dashboard/OverviewStats';
import ActivityChart from '@/components/dashboard/ActivityChart';
import BatchProcessor from '@/components/dashboard/BatchProcessor';
import AnchorProcessor from '@/components/dashboard/AnchorProcessor';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user && !user.isApproved && user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-16 h-16 bg-[#5236FF]/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#5236FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Pending Approval</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Your account is currently waiting for administrator approval. You will gain full access to the DockShark platform once your enterprise account is verified.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#141B34] dark:text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-2xl">
          Here is your document security overview. You can securely verify and anchor your documents to the blockchain from this dashboard.
        </p>
      </div>

      {/* KPI Overview Section */}
      <section id="overview" className="scroll-mt-32 mb-8">
        <OverviewStats />
      </section>

      {/* Merkle Batching & Anchoring Section */}
      <section className="mb-8 space-y-4">
        <BatchProcessor />
        <AnchorProcessor />
      </section>

      {/* Grid Layout for Chart & Info */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Activity Chart (Takes 2/3 width) */}
        <section className="xl:col-span-2">
          <ActivityChart />
        </section>

        {/* Info Section (Takes 1/3 width) */}
        <section className="bg-gradient-to-br from-[#5236FF] to-[#3d27ca] rounded-2xl shadow-md p-6 text-white flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How it works
          </h3>
          <ul className="space-y-4 text-sm text-blue-100 flex-1">
            <li className="flex gap-3">
              <span className="font-bold text-white shrink-0">1.</span>
              <p>Your files are hashed locally in your browser using Keccak-256 (Zero-Knowledge).</p>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white shrink-0">2.</span>
              <p>Hashes are cryptographically combined into a single, efficient Merkle Root.</p>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white shrink-0">3.</span>
              <p>The Merkle Root is securely anchored onto the Polygon Blockchain.</p>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}

