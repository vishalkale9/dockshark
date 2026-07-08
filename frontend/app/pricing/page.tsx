'use client';

import React, { useState } from 'react';
import { ArrowRight, Lock, Shield, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock API call
      setTimeout(() => {
        setSubmitted(true);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5236FF]/10 rounded-full blur-[120px]" />
      </div>

      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-32">
        <div className="max-w-3xl w-full mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#5236FF] mr-2 animate-pulse" />
            Enterprise Pricing
          </div>
          
          <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight leading-tight mb-6">
            Institutional-Grade Trust.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Coming Very Soon.</span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            We are currently finalizing our highly anticipated enterprise pricing tiers. Secure your spot on our exclusive waitlist to receive early access, volume anchoring discounts, and priority white-glove onboarding.
          </p>

          <div className="max-w-md mx-auto bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(82,54,255,0.1)] relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5236FF]/20 rounded-full blur-3xl opacity-50" />
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="relative z-10 text-left">
                <h3 className="text-xl font-medium text-white mb-2">Join the Waitlist</h3>
                <p className="text-sm text-gray-400 mb-6 font-light">Enter your corporate email address to request early access.</p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#5236FF] focus:ring-1 focus:ring-[#5236FF] transition-all"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200 font-semibold rounded-xl px-4 py-3 transition-colors flex items-center justify-center group"
                  >
                    Request Access
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                
                <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500 font-medium">
                  <div className="flex items-center"><Shield className="w-3 h-3 mr-1" /> Zero Spam</div>
                  <div className="flex items-center"><Lock className="w-3 h-3 mr-1" /> Secure Data</div>
                </div>
              </form>
            ) : (
              <div className="relative z-10 text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5236FF]/20 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#5236FF]" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">You're on the list.</h3>
                <p className="text-gray-400 text-sm font-light">
                  Thank you for your interest. Our enterprise team will be in touch shortly with early access details.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
