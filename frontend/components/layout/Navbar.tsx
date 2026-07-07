'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed w-full z-50 top-0 start-0 flex flex-col">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#E57A3C] text-white py-2 px-4 flex justify-center items-center text-sm font-semibold hover:bg-[#cc6a31] transition-colors cursor-pointer group">
        <span className="group-hover:underline decoration-white decoration-2 underline-offset-4 transition-all">
          New: Find out where your credentialing program stands
        </span>
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </div>

      {/* Main Navbar */}
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
                <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                  <Image 
                    src="/logo-maxzom.png" 
                    alt="DockShark Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl font-extrabold whitespace-nowrap tracking-tight text-[#141B34]">
                  DockShark
                </span>
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative group cursor-pointer flex items-center text-gray-700 hover:text-[#141B34] font-medium text-[15px]">
                Platform <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </div>
              <div className="relative group cursor-pointer flex items-center text-gray-700 hover:text-[#141B34] font-medium text-[15px]">
                Solutions <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </div>
              <div className="relative group cursor-pointer flex items-center text-gray-700 hover:text-[#141B34] font-medium text-[15px]">
                Resources <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </div>
              <Link href="/pricing" className="text-gray-700 hover:text-[#141B34] font-medium text-[15px]">
                Pricing
              </Link>
            </div>

            {/* Right: Actions (Desktop) */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/login" className="text-gray-700 hover:text-[#141B34] font-medium text-[15px]">
                Sign In
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-[#141B34] font-medium text-[15px]">
                Support
              </Link>
              <Link href="/demo">
                <button
                  type="button"
                  className="text-white bg-[#5236FF] hover:bg-[#432be0] font-semibold rounded-full text-[15px] px-6 py-2.5 transition-all transform hover:scale-105"
                >
                  Get a Demo
                </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-1 shadow-lg absolute w-full left-0">
            <Link href="/platform" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#141B34] rounded-md">
              Platform
            </Link>
            <Link href="/solutions" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#141B34] rounded-md">
              Solutions
            </Link>
            <Link href="/resources" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#141B34] rounded-md">
              Resources
            </Link>
            <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#141B34] rounded-md">
              Pricing
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#141B34] rounded-md">
              Sign In
            </Link>
            <Link href="/support" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#141B34] rounded-md">
              Support
            </Link>
            <div className="px-3 mt-4">
              <Link href="/demo">
                <button className="w-full text-white bg-[#5D43F6] hover:bg-[#4b35c9] font-semibold rounded-full text-base px-6 py-3 transition-colors">
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
