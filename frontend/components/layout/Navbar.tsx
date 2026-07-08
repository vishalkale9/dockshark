'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <div className="fixed w-full z-50 top-0 start-0 flex flex-col">

      {/* Main Navbar */}
      <nav className={`w-full border-b transition-colors duration-300 bg-black/50 backdrop-blur-md border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
                <div className={`relative w-10 h-10 transition-transform group-hover:scale-105`}>
                  <Image 
                    src="/logo.png" 
                    alt="DockShark Logo" 
                    fill
                    className={`object-contain mix-blend-screen`}
                  />
                </div>
                <span className={`text-2xl font-bold whitespace-nowrap tracking-tight text-white`}>
                  DockShark
                </span>
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              <div className={`relative group cursor-pointer flex items-center font-medium text-[14px] text-gray-300 hover:text-white`}>
                Platform <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
              </div>
              <Link href="/solutions" className={`relative group cursor-pointer flex items-center font-medium text-[14px] text-gray-300 hover:text-white`}>
                Solutions
              </Link>
              <Link href="/verify" className={`font-semibold text-[14px] flex items-center gap-1 text-[#5236FF] hover:text-[#7861FF]`}>
                Verify
              </Link>
              <Link href="/pricing" className={`font-medium text-[14px] text-gray-300 hover:text-white`}>
                Pricing
              </Link>
            </div>

            {/* Right: Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/login" className={`font-medium text-[14px] text-gray-300 hover:text-white`}>
                Sign In
              </Link>
              <Link href="/support" className={`font-medium text-[14px] text-gray-300 hover:text-white`}>
                Support
              </Link>
              <Link href="/demo">
                <button
                  type="button"
                  className="text-black bg-white hover:bg-gray-200 font-semibold rounded-full text-[14px] px-5 py-2 transition-all transform hover:scale-105"
                >
                  Get a Demo
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`focus:outline-none p-2 text-white`}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className={`md:hidden absolute w-full left-0 border-t px-4 pt-2 pb-6 space-y-1 shadow-lg bg-[#0A0A0A] border-white/10`}>
            <Link href="/platform" className={`block px-3 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-white/5 hover:text-white`}>
              Platform
            </Link>
            <Link href="/solutions" className={`block px-3 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-white/5 hover:text-white`}>
              Solutions
            </Link>
            <Link href="/verify" className={`block px-3 py-2 text-base font-medium rounded-md text-[#5236FF] hover:bg-white/5`}>
              Verify
            </Link>
            <Link href="/pricing" className={`block px-3 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-white/5 hover:text-white`}>
              Pricing
            </Link>
            <div className={`border-t my-2 border-white/10`}></div>
            <Link href="/login" className={`block px-3 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-white/5 hover:text-white`}>
              Sign In
            </Link>
            <Link href="/support" className={`block px-3 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-white/5 hover:text-white`}>
              Support
            </Link>
            <div className="px-3 mt-4">
              <Link href="/demo">
                <button className={`w-full font-semibold rounded-full text-base px-6 py-3 transition-colors bg-white text-black hover:bg-gray-200`}>
                  Get a Demo
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
