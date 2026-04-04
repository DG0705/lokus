'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type CartItem = {
  id: string;           // unique cart item ID
  productId: number;    // Supabase product ID
  name: string;
  price: number;
  size: number;
  color: string;
  image_url: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('lokus_cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lokus_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      // Check if same product, size, color already exists
      const existingIndex = prev.findIndex(
        item => item.productId === newItem.productId && 
                item.size === newItem.size && 
                item.color === newItem.color
      );
      if (existingIndex > -1) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      // Add new item with unique ID
      return [...prev, { ...newItem, id: uuidv4() }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}