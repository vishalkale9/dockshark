import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, AlertTriangle } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 text-gray-400 mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <AlertTriangle className="w-10 h-10 text-gray-500" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6 flex items-center justify-center gap-4">
            <span>4</span>
            <span className="w-24 h-24 rounded-full border-[12px] border-[#5236FF] shadow-[0_0_40px_rgba(82,54,255,0.3)] animate-pulse"></span>
            <span>4</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-6">
            Document Not Found
          </h2>
          
          <p className="text-lg text-gray-400 mb-10 max-w-md mx-auto leading-relaxed font-light">
            The cryptographic hash you are looking for does not exist on this network, or the URL path has been corrupted.
          </p>

          {/* Terminal / Code snippet block for that developer aesthetic */}
          <div className="bg-[#0A0A0A] rounded-xl border border-white/10 p-4 mb-10 max-w-lg mx-auto text-left font-mono text-xs text-gray-400 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
            <div className="flex items-center mb-2">
              <Terminal className="w-4 h-4 mr-2" />
              <span>system_error.log</span>
            </div>
            <p className="text-red-400 mt-2">&gt; ERROR 404: RESOURCE_UNAVAILABLE</p>
            <p>&gt; Request rejected by DockShark Verification Node</p>
            <p>&gt; Action: Redirecting to safety protocols...</p>
          </div>

          <Link href="/">
            <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded-full transition-all transform hover:scale-105 hover:bg-gray-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
