import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Threads from './Threads';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-0 pb-16">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <div className="absolute inset-0 opacity-40">
          <Threads
            color={[0.32, 0.21, 1.0]} // #5236FF
            amplitude={1}
            distance={0}
            enableMouseInteraction
          />
        </div>
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-[600px] h-[600px] bg-[#5236FF]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              New: Sepolia Testnet Integration
              <ChevronRight className="w-3 h-3 ml-1 opacity-50" />
            </div>

            <h1 className="text-5xl lg:text-[4rem] font-medium text-white tracking-tight leading-[1.1] mb-6">
              Document Anchoring <br className="hidden lg:block" />
              for the Modern Web
            </h1>

            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              The most secure way to verify digital documents without exposing raw data. Instantly anchor cryptographic proofs to the Ethereum blockchain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/verify" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center text-sm">
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </Link>

              <Link href="/demo" className="group flex items-center text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                Documentation
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Isometric Document Stack */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-full">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center [perspective:1000px]">

              {/* Outer glowing halo for the 3D element */}
              <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-75 animate-pulse" />

              <div className="relative w-64 h-80 [transform-style:preserve-3d] [transform:rotateX(60deg)_rotateZ(-45deg)] animate-[float_6s_ease-in-out_infinite]">

                {/* Bottom Document Layer */}
                <div className="absolute inset-0 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] [transform:translateZ(0px)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                  {/* Decorative "data" lines */}
                  <div className="p-4 space-y-3 opacity-20">
                    <div className="h-2 w-3/4 bg-white/50 rounded" />
                    <div className="h-2 w-full bg-white/50 rounded" />
                    <div className="h-2 w-5/6 bg-white/50 rounded" />
                  </div>
                </div>

                {/* Middle Document Layer (Floating higher) */}
                <div className="absolute inset-0 bg-[#111111] border border-white/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] [transform:translateZ(40px)] backdrop-blur-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#5236FF]/10 to-transparent" />
                  <div className="p-4 space-y-3 opacity-40">
                    <div className="h-2 w-2/3 bg-white/50 rounded" />
                    <div className="h-2 w-full bg-white/50 rounded" />
                    <div className="h-2 w-4/5 bg-white/50 rounded" />
                  </div>
                </div>

                {/* Top Glowing Document Layer (The "Verified" state) */}
                <div className="absolute inset-0 bg-black/60 border border-white/40 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1)] [transform:translateZ(90px)] backdrop-blur-xl flex flex-col items-center justify-center group overflow-hidden">
                  {/* Sweep highlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

                  {/* Holographic Logo taking full space */}
                  <div className="relative w-full h-full p-6 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
                    <Image 
                      src="/logo.png" 
                      alt="DockShark Logo" 
                      fill
                      className="object-contain mix-blend-screen filter brightness-150"
                    />
                  </div>

                  <div className="absolute bottom-4 text-[10px] font-mono text-white/70 tracking-widest bg-black/50 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                    0x8f2A...c9B4
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Trust Anchor */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center text-xs font-semibold text-gray-500 tracking-wide">
          Secured by <span className="text-gray-300 ml-1 flex items-center"><Image src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029" alt="Ethereum" width={12} height={12} className="mr-1 opacity-70" /> Ethereum Sepolia</span>
        </div>
      </div>
    </section>
  );
}
