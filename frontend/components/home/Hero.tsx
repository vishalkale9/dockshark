import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, PlayCircle, Lock, Fingerprint } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-32 lg:pt-12 lg:pb-40">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 bg-white overflow-hidden">
        {/* Tech Line Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-white" />
        
        {/* Animated Glowing Orbs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 animate-[pulse_8s_ease-in-out_infinite]">
          <div className="w-[800px] h-[800px] bg-gradient-to-tr from-[#141B34]/10 to-[#E57A3C]/15 rounded-full blur-3xl" />
        </div>
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 animate-[pulse_12s_ease-in-out_infinite]">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-[#E57A3C]/10 to-[#141B34]/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#141B34] text-sm font-semibold mb-8 shadow-sm">
              <Lock className="w-4 h-4 mr-2 text-[#E57A3C]" />
              Secure Client-Side Hashing Engine
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold text-[#141B34] tracking-tight leading-[1.1] mb-6">
              Absolute Trust. <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141B34] to-[#3a4980]">
                Zero Compromise.
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Verify credentials, legal documents, and supply chain records instantly. Our decentralized network ensures your data remains yours with military-grade client-side encryption.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-5">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#E57A3C] hover:bg-[#d46a2e] text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-[#E57A3C]/20 flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
              
              <Link href="/demo" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-[#141B34] border-2 border-gray-200 hover:border-[#141B34] font-bold rounded-full transition-all flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 mr-2 text-[#141B34]" />
                  Watch Demo
                </button>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-500 font-medium">
              <span>Trusted for Education, Legal, & Enterprise Use Cases</span>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-6 relative">
            <div className="relative animate-[float_6s_ease-in-out_infinite]">
              {/* Main Graphic */}
              <div className="relative w-full aspect-square max-w-[650px] mx-auto z-10">
                <Image
                  src="/hero.png"
                  alt="DockShark User Verification"
                  fill
                  quality={100}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
