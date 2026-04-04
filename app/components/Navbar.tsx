'use client';

import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">LOKUS</Link>
        <div className="flex space-x-6 text-sm font-medium items-center">
          <Link href="/men" className="text-gray-700 hover:text-black">Men</Link>
          <Link href="/women" className="text-gray-700 hover:text-black">Women</Link>
          <Link href="/cart" className="text-gray-700 hover:text-black">
            Cart ({totalItems})
          </Link>
          {user ? (
            <div className="relative group">
              <button className="text-gray-700 hover:text-black">Account ▼</button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
                <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">My Account</Link>
                <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-black">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}