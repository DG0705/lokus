'use client';

import { useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-green-50 rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Thank you for your order!</h1>
        <p className="text-green-700">Your payment was successful.</p>
      </div>
      <p className="text-gray-600 mb-8">We'll send you a confirmation email shortly.</p>
      <Link href="/" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
        Continue Shopping
      </Link>
    </main>
  );
}