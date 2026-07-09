'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Shield, ShieldAlert, CheckCircle2, User as UserIcon, XCircle } from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    } else {
      fetchUsers();
    }
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: !currentStatus })
      });

      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, isApproved: !currentStatus } : u));
      }
    } catch (error) {
      console.error("Failed to update user approval", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#5236FF]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 w-full max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#141B34] dark:text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#5236FF]" />
            Access Management
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Review and approve enterprise users. Unapproved users cannot access the platform.
          </p>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium text-white shadow-lg">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {users.filter(u => !u.isApproved).length} Pending Approvals
        </div>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#111111] text-gray-300 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-300" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-[#5236FF]/20 text-[#5236FF] border border-[#5236FF]/30' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.isApproved ? (
                      <span className="inline-flex items-center gap-1.5 text-green-400">
                        <CheckCircle2 className="w-4 h-4" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-400">
                        <ShieldAlert className="w-4 h-4" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => toggleApproval(u._id, u.isApproved)}
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                          u.isApproved 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                        }`}
                      >
                        {u.isApproved ? 'Revoke Access' : 'Approve Access'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
