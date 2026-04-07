'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      const [{ count: productCount }, { data: orders, error }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*'),
      ]);
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const pending = orders?.filter(o => o.status === 'pending').length || 0;
      setStats({
        totalProducts: productCount || 0,
        totalOrders: orders?.length || 0,
        totalRevenue: totalRevenue / 100,
        pendingOrders: pending,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading stats...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.totalProducts} icon="👟" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon="💰" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  );
}