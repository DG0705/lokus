'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const supabase = createClient();
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Order #{order.order_number}</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                <p className="text-sm mt-1">Total: ₹{(order.total_amount / 100).toFixed(2)}</p>
                <p className="text-sm">Payment ID: {order.payment_id}</p>
              </div>
              <div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">View Items</summary>
              <div className="mt-2 space-y-1 pl-4">
                {order.order_items?.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    {item.product_name} (Size {item.size}, {item.color}) x{item.quantity} – ₹{(item.price * item.quantity / 100).toFixed(2)}
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}