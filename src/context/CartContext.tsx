'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItemType } from '@/lib/types';

interface AppliedCoupon {
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
}

interface CartContextType {
  items: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hiwood_cart');
      if (stored) setItems(JSON.parse(stored));
      const storedCoupon = localStorage.getItem('hiwood_coupon');
      if (storedCoupon) setCoupon(JSON.parse(storedCoupon));
    } catch {
      // Ignore
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hiwood_cart', JSON.stringify(items));
      if (coupon) {
        localStorage.setItem('hiwood_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('hiwood_coupon');
      }
    } catch {
      // Ignore
    }
  }, [items, coupon, isLoaded]);

  const addItem = (newItem: CartItemType) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === newItem.id);
      if (index > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[index].quantity + newItem.quantity, newItem.maxStock || 99);
        updated[index] = { ...updated[index], quantity: newQty };
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, i.maxStock || 99) } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a coupon code' };

    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(cleanCode)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (res.ok && data.valid) {
        setCoupon({
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue,
        });
        return { success: true, message: `Coupon applied: ${data.coupon.code}!` };
      } else {
        return { success: false, message: data.message || 'Invalid or expired coupon' };
      }
    } catch {
      // Fallback offline validation for default codes
      if (cleanCode === 'HIWOOD10') {
        setCoupon({ code: 'HIWOOD10', discountType: 'PERCENT', discountValue: 10 });
        return { success: true, message: 'Coupon applied: 10% Discount!' };
      } else if (cleanCode === 'WELCOME500' && subtotal >= 3500) {
        setCoupon({ code: 'WELCOME500', discountType: 'FIXED', discountValue: 500 });
        return { success: true, message: 'Coupon applied: Rs. 500 Discount!' };
      }
      return { success: false, message: 'Unable to validate coupon code' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'PERCENT') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }
  }

  // Free shipping threshold = Rs. 3000
  const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 250;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
