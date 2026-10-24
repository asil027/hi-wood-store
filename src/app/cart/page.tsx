'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [applying, setApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    setApplying(true);
    const res = await applyCoupon(couponInput);
    setApplying(false);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#111111]">Your bag is currently empty</h1>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Explore our Classic, Urban, Adventure, and Casual series backpacks designed for Pakistani everyday journeys.
        </p>
        <Link href="/shop" className="btn-primary text-sm font-bold inline-flex items-center gap-2">
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight mb-8">
          Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-6">
            
            {/* Free shipping progress */}
            <div className="bg-[#FFF5F0] p-4 rounded-2xl border border-[#FFE5D6] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#111111]">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#FF5A1F]" />
                  <span>Free Shipping Status</span>
                </span>
                <span className="text-[#FF5A1F]">
                  {subtotal >= 3000 ? 'Unlocked! FREE Nationwide Delivery' : `Add Rs. ${(3000 - subtotal).toLocaleString()} for Free Delivery`}
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF5A1F] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / 3000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const itemPrice = item.salePrice || item.price;
                return (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-center">
                    <div className="relative w-28 h-28 rounded-2xl bg-[#F8F8F8] border border-gray-100 p-3 shrink-0 flex items-center justify-center">
                      <Image
                        src={item.image || '/images/hero-backpack.png'}
                        alt={item.name}
                        width={110}
                        height={110}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-base font-bold text-[#111111] hover:text-[#FF5A1F] transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.color && (
                        <div className="text-xs text-neutral-500">Color: {item.color}</div>
                      )}
                      <div className="text-sm font-extrabold text-[#111111] pt-1">
                        Rs. {itemPrice.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 rounded-full bg-white px-3 py-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-neutral-500 hover:text-[#111111] p-1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-[#111111] px-3 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-neutral-500 hover:text-[#111111] p-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className="text-base font-extrabold text-[#111111]">
                        Rs. {(itemPrice * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center text-xs">
              <Link href="/shop" className="text-neutral-600 hover:text-[#111111] font-bold">
                ← Continue Browsing Bags
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-6">
            <h2 className="text-lg font-extrabold text-[#111111]">Order Summary</h2>

            {/* Coupon Box */}
            {coupon ? (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-[#FF5A1F]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Coupon: {coupon.code}</span>
                </div>
                <button onClick={removeCoupon} className="text-neutral-500 hover:text-red-500 font-bold underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 uppercase outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className="text-xs font-bold bg-[#111111] text-white px-4 py-2.5 rounded-xl hover:bg-[#FF5A1F] transition-colors disabled:opacity-50"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs ${couponMsg.isError ? 'text-red-500' : 'text-green-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </form>
            )}

            {/* Calculations */}
            <div className="space-y-3 text-sm text-neutral-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#111111]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#FF5A1F] font-semibold">
                  <span>Discount</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-semibold text-[#111111]">
                  {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-[#111111] border-t border-gray-100 pt-3">
                <span>Total Amount</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-orange-500/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-[#FF5A1F]" />
                <span>100% Cash on Delivery & Direct Bank Transfer</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
