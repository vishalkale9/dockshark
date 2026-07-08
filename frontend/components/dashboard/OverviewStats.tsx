'use client';

import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

export default function OverviewStats() {
  const [stats, setStats] = useState({ total: 0, anchored: 0, pending: 0, batched: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth(`/documents?page=1&limit=1`);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    const handleDocumentAnchored = () => fetchStats();
    window.addEventListener('documentAnchored', handleDocumentAnchored);
    return () => window.removeEventListener('documentAnchored', handleDocumentAnchored);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Uploads */}
      <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(255,255,255,0.02)] flex flex-col relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-16 h-16 text-[#C724B1]" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </div>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider z-10">Total Uploads</span>
        <span className="text-4xl font-extrabold text-[#141B34] dark:text-white mt-3 z-10">{loading ? '-' : stats.total}</span>
        <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden z-10">
          <div className="h-full bg-gradient-to-r from-[#C724B1] to-[#E57A3C] w-[70%]"></div>
        </div>
      </div>

      {/* Secured (Anchored) */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-[#0A0A0A] dark:to-[#0A0A0A] dark:bg-[#0A0A0A] p-6 rounded-2xl border border-green-100 dark:border-white/10 shadow-[0_4px_24px_rgba(0,229,255,0.05)] dark:shadow-[0_0_30px_rgba(0,229,255,0.05)] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-16 h-16 text-[#00E5FF]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </div>
        <span className="text-green-700 dark:text-[#00E5FF] text-sm font-semibold uppercase tracking-wider z-10">Secured (Anchored)</span>
        <span className="text-4xl font-extrabold text-green-700 dark:text-white mt-3 z-10">{loading ? '-' : stats.anchored}</span>
        <div className="mt-4 h-1 w-full bg-green-200/50 dark:bg-[#1A333A] rounded-full overflow-hidden z-10">
          <div className="h-full bg-[#00E5FF] w-[90%] shadow-[0_0_10px_#00E5FF]"></div>
        </div>
      </div>

      {/* Pending Batch */}
      <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(255,255,255,0.02)] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-16 h-16 text-[#F9A826]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </div>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider z-10">Pending Batch</span>
        <span className="text-4xl font-extrabold text-yellow-600 dark:text-white mt-3 z-10">{loading ? '-' : stats.pending}</span>
        <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden z-10">
          <div className="h-full bg-[#F9A826] w-[40%]"></div>
        </div>
      </div>

      {/* Ready to Push */}
      <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(255,255,255,0.02)] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-16 h-16 text-[#141B34] dark:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </div>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider z-10">Ready to Push</span>
        <span className="text-4xl font-extrabold text-[#141B34] dark:text-white mt-3 z-10">{loading ? '-' : stats.batched}</span>
        <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden z-10">
          <div className="h-full bg-[#141B34] dark:bg-white w-[20%]"></div>
        </div>
      </div>
    </div>
  );
}
