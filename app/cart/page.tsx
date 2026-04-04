'use client';

import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems})</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image_url || '/shoe-placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size} / Color: {item.color}</p>
                <p className="font-medium">${item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <select
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[1,2,3,4,5].map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between mb-4 text-sm text-gray-500">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-black text-white text-center py-3 rounded-full hover:bg-gray-800 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
