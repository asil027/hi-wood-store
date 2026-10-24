'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, CheckCircle2, Truck, Clock, AlertCircle, MapPin, ExternalLink } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    if (!orderNumber.trim() || !contact.trim()) {
      setError('Please provide both Order Number and Email or Phone Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, contact }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found. Please double check your order number.');
      }
    } catch {
      setError('Network error while looking up order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: 'PENDING', label: 'Order Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Dispatched / In Transit' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const getStepIndex = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELIVERED') return 4;
    if (s === 'SHIPPED') return 3;
    if (s === 'PROCESSING') return 2;
    if (s === 'CONFIRMED') return 1;
    return 0; // PENDING
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            LIVE LOGISTICS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Track Your Hiwood Order
          </h1>
          <p className="text-sm text-neutral-500 max-w-lg mx-auto">
            Enter your Hiwood order number (e.g. HW-2026-1024) and the phone or email used during checkout.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E8E8] shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. HW-2026-1024"
                className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] uppercase font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Customer Email or Mobile Phone *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="ayesha@gmail.com or 03001234567"
                className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-xs font-bold"
            >
              {loading ? 'Searching Logistics Database...' : 'Track My Parcel'}
            </button>
          </form>
        </div>

        {/* Live Tracking Result */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E8E8] shadow-md space-y-8 animate-in fade-in duration-300">
            
            {/* Header Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">
                  ORDER STATUS: {order.orderStatus}
                </span>
                <h3 className="text-2xl font-extrabold text-[#111111] mt-0.5">
                  Order #{order.orderNumber}
                </h3>
                <span className="text-xs text-neutral-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-400 block">Total Amount</span>
                <span className="text-xl font-extrabold text-[#111111]">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-neutral-500 block">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>
            </div>

            {/* Status Steps Progress Bar */}
            <div className="py-4">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FF5A1F] transition-all duration-500 -z-0"
                  style={{
                    width: `${(getStepIndex(order.orderStatus) / (statusSteps.length - 1)) * 100}%`,
                  }}
                />

                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.orderStatus);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-[#FF5A1F] text-white shadow-md'
                            : 'bg-white border-2 border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] mt-2 font-bold text-center hidden sm:block ${
                          isCurrent ? 'text-[#FF5A1F]' : isDone ? 'text-[#111111]' : 'text-neutral-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier & Shipping Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAFAFA] p-5 rounded-2xl border border-neutral-100 text-xs">
              <div>
                <span className="font-bold text-neutral-400 block mb-1">COURIER PARTNER</span>
                <span className="text-sm font-bold text-[#111111]">
                  {order.courierName || 'TCS Express Logistics'}
                </span>
              </div>

              <div>
                <span className="font-bold text-neutral-400 block mb-1">TRACKING NUMBER</span>
                <span className="text-sm font-bold text-[#FF5A1F] font-mono">
                  {order.trackingNumber || 'Pending assignment'}
                </span>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#111111]">Items in this shipment:</h4>
              <div className="divide-y divide-gray-100">
                {order.items.map((i: any) => (
                  <div key={i.id} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#111111]">
                      {i.productName} × {i.quantity}
                    </span>
                    <span className="font-bold text-[#111111]">
                      Rs. {i.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
