'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">LOKUS</Link>
        <div className="flex space-x-6 text-sm font-medium">
          <Link href="/men" className="text-gray-700 hover:text-black">Men</Link>
          <Link href="/women" className="text-gray-700 hover:text-black">Women</Link>
          <Link href="/cart" className="text-gray-700 hover:text-black">
            Cart ({totalItems})
          </Link>
        </div>
      </div>
    </nav>
  );
}