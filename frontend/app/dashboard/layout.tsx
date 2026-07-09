import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex bg-white dark:bg-black min-h-[calc(100vh-116px)] transition-colors">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
