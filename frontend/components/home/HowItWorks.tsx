'use client';

import React, { useState } from 'react';
import Stepper, { Step } from './Stepper';
import { Upload, Shield, Link2, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const [completed, setCompleted] = useState(false);

  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5236FF]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-4">
            How DockShark Works
          </h2>
          <p className="text-lg text-gray-400 font-light">
            A seamless pipeline from document upload to undeniable cryptographic proof.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {completed ? (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Process Completed</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You now understand the complete DockShark verification lifecycle. Ready to secure your first document?
              </p>
              <button 
                onClick={() => setCompleted(false)}
                className="bg-[#5236FF] hover:bg-[#432be0] text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Replay Walkthrough
              </button>
            </div>
          ) : (
            <Stepper
              initialStep={1}
              onFinalStepCompleted={() => setCompleted(true)}
              backButtonText="Previous"
              nextButtonText="Next"
              disableStepIndicators={false}
            >
              <Step>
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Upload Document</h3>
                  <p className="text-gray-400 leading-relaxed max-w-sm">
                    Select any file. It never leaves your device—our platform generates a unique cryptographic hash entirely in your browser.
                  </p>
                </div>
              </Step>

              <Step>
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Cryptographic Hashing</h3>
                  <p className="text-gray-400 leading-relaxed max-w-sm">
                    The file is converted into an SHA-256 hash. This mathematical fingerprint is impossible to reverse-engineer, guaranteeing zero-knowledge privacy.
                  </p>
                </div>
              </Step>

              <Step>
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 bg-[#5236FF]/20 border border-[#5236FF]/50 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(82,54,255,0.3)]">
                    <Link2 className="w-8 h-8 text-[#5236FF]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Blockchain Anchoring</h3>
                  <p className="text-gray-400 leading-relaxed max-w-sm">
                    The hash is anchored directly to the Ethereum blockchain via a smart contract, creating an immutable timestamp of existence.
                  </p>
                </div>
              </Step>

              <Step>
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Instant Verification</h3>
                  <p className="text-gray-400 leading-relaxed max-w-sm">
                    Anyone can verify the document instantly by dropping it into the verification portal. The hash is checked against the blockchain in real-time.
                  </p>
                </div>
              </Step>
            </Stepper>
          )}
        </div>
      </div>
    </section>
  );
}
