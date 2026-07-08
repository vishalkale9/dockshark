'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Upload, 
  Shield, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Upload Files', icon: Upload, href: '/dashboard/upload' },
    { name: 'Document Ledger', icon: FileText, href: '/dashboard/ledger' },
    { name: 'Admin Tools', icon: Shield, href: '/dashboard/admin' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-white/10 flex flex-col min-h-[calc(100vh-116px)] sticky top-[116px] overflow-y-auto hidden md:flex transition-colors">
      {/* User Profile Summary */}
      <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5236FF] to-[#C724B1] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(199,36,177,0.5)]">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-[#141B34] dark:text-white truncate">
              {user?.name || 'User'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'user@example.com'}
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          // Simplified active state check
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm border ${
                isActive 
                  ? 'bg-gray-100 dark:bg-[#111111] text-[#141B34] dark:text-white border-transparent dark:border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#141B34] dark:hover:text-white border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#141B34] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}

        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 mt-8 px-2">
          Settings
        </div>
        <button 
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#141B34] dark:hover:text-white"
        >
          <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          Account
        </button>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100 dark:border-white/10">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
