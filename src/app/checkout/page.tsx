'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Other / Nationwide',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, totalAmount, coupon, clearCart } = useCart();
  const { user } = useAuth();

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('Karachi');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER' | 'ONLINE'>('COD');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#111111]">Your cart is currently empty</h2>
        <p className="text-sm text-neutral-500">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="btn-primary text-sm font-bold">
          Explore Bags
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please fill in all required delivery details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          city,
          deliveryNotes,
          paymentMethod,
          couponCode: coupon?.code || null,
          items,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        router.push(`/order-confirmation/${data.order.orderNumber}`);
      } else {
        setErrorMessage(data.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage('A network error occurred. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            SECURE 256-BIT ENCRYPTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight mt-1">
            Express Checkout
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Nationwide delivery across Pakistan • Guaranteed authentic Hiwood gear
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Contact & Delivery Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-lg font-extrabold text-[#111111]">
                  Delivery Information
                </h2>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Email Address (for Order Updates) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ayesha@example.com"
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Mobile Phone Number (03xx-xxxxxxx) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Destination City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] bg-white cursor-pointer"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Full Street Address (House/Apartment #, Street, Area) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House 14B, Street 3, DHA Phase 5..."
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Delivery Instructions / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Near Masjid / Leave with security..."
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-lg font-extrabold text-[#111111]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                
                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#FF5A1F] bg-orange-50/40'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 accent-[#FF5A1F]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#FF5A1F]" />
                      <span className="text-sm font-bold text-[#111111]">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] font-bold bg-[#111111] text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Pay in cash when your Hiwood package is physically delivered to your door.
                    </p>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'border-[#FF5A1F] bg-orange-50/40'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'BANK_TRANSFER'}
                    onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    className="mt-1 accent-[#FF5A1F]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#FF5A1F]" />
                      <span className="text-sm font-bold text-[#111111]">
                        Direct Bank Transfer (Meezan Bank)
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Transfer directly to our corporate bank account via your mobile banking app or Raast ID.
                    </p>
                    {paymentMethod === 'BANK_TRANSFER' && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-neutral-200 text-xs space-y-1 text-neutral-700 font-mono">
                        <div>Bank: <strong>Meezan Bank Ltd</strong></div>
                        <div>Title: <strong>Hiwood Bags Private Limited</strong></div>
                        <div>Account: <strong>01020304050607</strong></div>
                        <div>IBAN: <strong>PK65MEZN0001020304050607</strong></div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Online Gateway Sandbox */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'border-[#FF5A1F] bg-orange-50/40'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    className="mt-1 accent-[#FF5A1F]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#FF5A1F]" />
                      <span className="text-sm font-bold text-[#111111]">
                        Debit / Credit Card / EasyPaisa / JazzCash
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Instant and secure verified payment simulation.
                    </p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-[#111111]">
                Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
              <Link href="/cart" className="text-xs font-bold text-[#FF5A1F] hover:underline">
                Edit Cart
              </Link>
            </div>

            {/* Items preview */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl bg-[#F8F8F8] border border-gray-100 p-1.5 shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image || '/images/hero-backpack.png'}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#111111] line-clamp-1">{item.name}</h4>
                    {item.color && (
                      <span className="text-[11px] text-neutral-400 block">{item.color}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#111111]">
                    Rs. {((item.salePrice || item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-neutral-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#111111]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#FF5A1F] font-semibold">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="font-semibold text-[#111111]">
                  {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#111111] border-t border-gray-100 pt-3">
                <span>Final Payable Amount</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-orange-500/25 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Complete Order (Rs. {totalAmount.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            <div className="text-center space-y-2 pt-2 text-[11px] text-neutral-400">
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Your information is encrypted and protected.</span>
              </div>
              <p>By placing order you agree to Hiwood Terms & Shipping Policy.</p>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
