import React from 'react';
import Link from 'next/link';
import { Activity, Package, GraduationCap, Scale, Landmark, Building2, ChevronRight, Terminal, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/layout/Footer';


export const metadata = {
  title: 'Industry Solutions | DockShark',
  description: 'Discover how DockShark provides cryptographic truth for Healthcare, Supply Chain, Education, and Legal industries.',
};

const industries = [
  {
    title: 'Healthcare & Life Sciences',
    icon: Activity,
    description: 'Ensure HIPAA compliance while securing patient consent forms, clinical trial data integrity, and medical device logs. Raw medical data never leaves your servers; only the mathematical hash is anchored to the blockchain.',
    highlights: ['HIPAA Compliant', 'Zero-Knowledge Proof', 'Clinical Trial Integrity'],
  },
  {
    title: 'Supply Chain & Logistics',
    icon: Package,
    description: 'Eliminate counterfeit goods and forged shipping documents by creating an undeniable, timestamped trail of origin for bills of lading, customs declarations, and provenance certificates.',
    highlights: ['End-to-End Traceability', 'Fraud Elimination', 'Global Auditing'],
  },
  {
    title: 'Legal & Intellectual Property',
    icon: Scale,
    description: 'Provide undeniable cryptographic proof of existence at an exact timestamp. Secure NDAs, patent filings, and maintain a bulletproof chain of custody for digital evidence, eliminating contract disputes.',
    highlights: ['Cryptographic Timestamping', 'Chain of Custody', 'Dispute Resolution'],
  },
  {
    title: 'Education & Credentials',
    icon: GraduationCap,
    description: 'Issue immutable digital diplomas and academic transcripts. Employers can instantly verify a candidate\'s credentials by dragging and dropping the file into the verification portal.',
    highlights: ['Instant Verification', 'Tamper-Proof Diplomas', 'Global Trust'],
  },
  {
    title: 'Financial Services',
    icon: Landmark,
    description: 'Secure loan agreements, audit trails, and compliance reports. Create an immutable record of financial documents that satisfies stringent regulatory requirements and prevents fraud.',
    highlights: ['Regulatory Compliance', 'Audit Trails', 'Fraud Prevention'],
  },
  {
    title: 'Government & Public Sector',
    icon: Building2,
    description: 'Digitize and secure public records, land deeds, and municipal bonds. Provide citizens with verifiable proof of authenticity for government-issued documents and licenses.',
    highlights: ['Public Record Security', 'Citizen Trust', 'Digital Land Deeds'],
  },
];

export default function SolutionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* 1. Solutions Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5236FF]/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight leading-tight mb-6">
            Cryptographic Truth <br className="hidden md:block" />
            for Every Industry
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Secure, issue, and verify critical documents without compromising data privacy.
            Discover how DockShark protects infrastructure across the globe.
          </p>
        </div>
      </section>

      {/* 2. Industry Use Cases Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="group h-full">
                <div className="bg-[#0A0A0A] rounded-2xl p-6 md:p-8 border border-white/10 h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#5236FF]/50 hover:shadow-[0_0_30px_rgba(82,54,255,0.15)]">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-gray-300 mb-5 group-hover:text-white transition-colors">
                    <industry.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {industry.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm mb-6 font-light">
                    {industry.description}
                  </p>
                  <ul className="space-y-2.5">
                    {industry.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#5236FF] mr-3 shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Integration Guide (API Snippet) */}
      <section className="py-24 relative overflow-hidden border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-6">
                Integrates in minutes, <br />
                <span className="text-gray-500">protects forever.</span>
              </h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
                Our enterprise-grade API allows you to programmatically anchor documents directly from your existing backend systems. Generate zero-knowledge proofs without changing your current workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/api" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  View Documentation
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                <Link href="/demo" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/5 text-white font-semibold hover:bg-white/10 border border-white/10 transition-colors">
                  Get API Keys
                </Link>
              </div>
            </div>

            {/* Code Snippet Window */}
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(82,54,255,0.1)] bg-[#0A0A0A]">
              <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#111111]">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex items-center text-xs text-gray-500 font-mono">
                  <Terminal className="w-3 h-3 mr-2" />
                  anchor_document.js
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code className="text-gray-300">
                    <span className="text-[#5236FF]">import</span> {'{ DockShark }'} <span className="text-[#5236FF]">from</span> <span className="text-green-400">'@dockshark/sdk'</span>;<br /><br />
                    <span className="text-gray-500">{'// Initialize the SDK with your enterprise key'}</span><br />
                    <span className="text-[#5236FF]">const</span> ds = <span className="text-[#5236FF]">new</span> DockShark(process.env.DOCKSHARK_API_KEY);<br /><br />
                    <span className="text-[#5236FF]">async function</span> <span className="text-blue-400">secureDocument</span>(fileBuffer) {'{'}<br />
                    {'  '}<span className="text-gray-500">{'// 1. Generate SHA-256 hash locally (Zero-Knowledge)'}</span><br />
                    {'  '}<span className="text-[#5236FF]">const</span> fileHash = <span className="text-[#5236FF]">await</span> ds.hash(fileBuffer);<br /><br />
                    {'  '}<span className="text-gray-500">{'// 2. Anchor hash to Ethereum Sepolia'}</span><br />
                    {'  '}<span className="text-[#5236FF]">const</span> receipt = <span className="text-[#5236FF]">await</span> ds.anchor(fileHash);<br /><br />
                    {'  '}<span className="text-[#5236FF]">return</span> receipt.transactionHash;<br />
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-[#5236FF]/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">
            Ready to secure your infrastructure?
          </h2>
          <p className="text-lg text-gray-400 font-light mb-10 max-w-2xl mx-auto">
            Join the forward-thinking enterprises that trust DockShark for immutable cryptographic document verification.
          </p>
          <Link href="/login">
            <button className="bg-[#5236FF] hover:bg-[#432be0] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(82,54,255,0.3)]">
              Start Building Today
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
