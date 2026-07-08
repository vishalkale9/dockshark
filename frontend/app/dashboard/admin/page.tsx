import React from 'react';
import BatchProcessor from '@/components/dashboard/BatchProcessor';
import AnchorProcessor from '@/components/dashboard/AnchorProcessor';

export default function AdminPage() {
  return (
    <div className="p-8 lg:p-10 w-full max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#141B34] dark:text-white tracking-tight">
          Admin Controls
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-2xl">
          Manage batch processing and blockchain anchoring.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#111111]">
            <h2 className="text-lg font-bold text-[#141B34] dark:text-white">Batch Processing</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Combine hashes into a Merkle root.</p>
          </div>
          <div className="p-6 bg-white dark:bg-[#0A0A0A]">
            <BatchProcessor />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-[#111111]">
            <h2 className="text-lg font-bold text-[#141B34] dark:text-white">Blockchain Anchor</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Anchor the root to Polygon.</p>
          </div>
          <div className="p-6 bg-white dark:bg-[#0A0A0A]">
            <AnchorProcessor />
          </div>
        </div>
      </div>
    </div>
  );
}
