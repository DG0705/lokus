'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!user) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="bg-gray-50 rounded-2xl p-8">
        <p className="text-gray-600">Welcome back, <span className="font-semibold">{user.email}</span></p>
        <p className="text-gray-500 mt-2">Order history and saved addresses will appear here soon.</p>
      </div>
    </main>
  );
}