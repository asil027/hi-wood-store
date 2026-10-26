'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    discountAmount,
    shippingFee,
    freeShippingThreshold = 3000,
    totalAmount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    setIsApplying(true);
    const res = await applyCoupon(couponInput);
    setIsApplying(false);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E8E8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF5A1F]" />
              <h2 className="text-lg font-bold text-[#111111]">
                Your Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-[#111111] rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">Your bag is empty</h3>
                  <p className="text-sm text-neutral-500 mt-1 max-w-xs">
                    Looks like you haven&apos;t added any backpacks to your bag yet.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary text-sm"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-all bg-neutral-50/50"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl bg-white p-2 shrink-0 border border-neutral-100 overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.image || '/images/hero-backpack.png'}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-sm font-bold text-[#111111] hover:text-[#FF5A1F] transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          {item.color && (
                            <span className="text-xs text-neutral-500 block">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Pricing and Quantity Selector */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm font-bold text-[#111111]">
                          Rs. {((item.salePrice || item.price) * item.quantity).toLocaleString()}
                        </div>

                        <div className="flex items-center border border-neutral-200 rounded-full bg-white px-2 py-0.5 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-neutral-500 hover:text-[#111111] p-1"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#111111] px-2 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-neutral-500 hover:text-[#111111] p-1"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E8E8] bg-white space-y-4">
              
              {/* Coupon input */}
              {coupon ? (
                <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#FF5A1F]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Coupon Applied: {coupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-500 hover:text-red-500 font-bold ml-2 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Coupon code (HIWOOD10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-neutral-200 uppercase outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="text-xs font-bold bg-[#111111] text-white px-4 py-2 rounded-xl hover:bg-[#FF5A1F] transition-colors disabled:opacity-50"
                  >
                    {isApplying ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && <p className="text-xs text-red-500">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-green-600">{couponSuccess}</p>}

              {/* Free shipping threshold progress */}
              <div className="bg-neutral-50 p-2.5 rounded-xl text-xs space-y-1 border border-neutral-100">
                <div className="flex justify-between text-neutral-600">
                  <span>Free Shipping Status:</span>
                  <span className="font-bold text-[#111111]">
                    {subtotal >= freeShippingThreshold
                      ? 'Unlocked! (Rs. 0)'
                      : `Add Rs. ${(freeShippingThreshold - subtotal).toLocaleString()} for Free Delivery`}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF5A1F] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / (freeShippingThreshold || 3000)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#FF5A1F] font-medium">
                    <span>Discount</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#111111]">
                    {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#111111] pt-2 border-t border-neutral-100">
                  <span>Total</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-primary w-full py-3.5 text-base shadow-lg shadow-orange-500/20"
              >
                <span>Checkout (Rs. {totalAmount.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <p className="text-center text-[11px] text-neutral-400">
                Taxes included. Cash on Delivery & Bank Transfer available.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
