import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                <Image 
                  src="/logo.png" 
                  alt="DockShark Logo" 
                  fill
                  className="object-contain mix-blend-screen"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                DockShark
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed pr-4">
              The premier platform for enterprise-grade cryptographic document anchoring and zero-knowledge verification on the Ethereum blockchain.
            </p>
          </div>

          {/* Links - Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/verify" className="hover:text-white transition-colors">Verify Document</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/api" className="hover:text-white transition-colors">API Documentation</Link></li>
            </ul>
          </div>

          {/* Links - Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Education & Credentials</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Legal & Compliance</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Healthcare</Link></li>
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DockShark. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500 font-medium">
            <span>System Status: <span className="text-green-400">All Systems Operational</span></span>
            <span className="hidden md:inline">|</span>
            <span>Network: <span className="text-gray-300">Ethereum Sepolia</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
