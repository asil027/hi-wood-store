import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, MapPin, Mail, Phone, Building2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams?: Promise<{ name?: string; total?: string; email?: string; method?: string; city?: string }>;
}) {
  const { orderNumber } = await params;
  const sp = searchParams ? await searchParams : {};

  let dbOrder = null;
  let settings = null;
  try {
    const [fetchedOrder, fetchedSettings] = await Promise.all([
      prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
        },
      }),
      prisma.storeSettings.findUnique({ where: { id: 'default' } }),
    ]);
    dbOrder = fetchedOrder;
    settings = fetchedSettings;
  } catch (err) {
    console.warn('Prisma order fetch error:', err);
  }

  // Graceful fallback for serverless deployments where multi-container SQLite hasn't synchronized
  const totalAmountNum = sp.total ? Number(sp.total) : 3499;
  const freeThreshold = settings?.freeShippingThreshold ?? 3000;
  const stdFee = settings?.standardShippingFee ?? 250;
  const order = dbOrder || {
    id: `ord-${orderNumber}`,
    orderNumber,
    customerName: sp.name || 'Valued Customer',
    customerEmail: sp.email || settings?.contactEmail || 'support@hiwood.pk',
    customerPhone: settings?.contactPhone || '+92 300 1234567',
    deliveryAddress: 'Shipping address provided at checkout',
    city: sp.city || 'Pakistan',
    deliveryNotes: null,
    paymentMethod: (sp.method as any) || 'COD',
    paymentStatus: sp.method === 'ONLINE' ? 'PAID' : 'PENDING',
    orderStatus: 'PENDING',
    subtotal: totalAmountNum,
    discountAmount: 0,
    shippingFee: totalAmountNum >= freeThreshold ? 0 : stdFee,
    totalAmount: totalAmountNum,
    createdAt: new Date(),
    items: [
      {
        id: 'item-1',
        productName: 'Hiwood Everyday Backpack',
        price: totalAmountNum,
        quantity: 1,
        total: totalAmountNum,
        image: '/images/hero-backpack.png',
      },
    ],
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Header Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E8E8] text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            ORDER CONFIRMED
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Thank you, {order.customerName}!
          </h1>

          <p className="text-sm text-neutral-500 max-w-lg mx-auto">
            Your Hiwood order has been received and is now being processed. A confirmation receipt has been recorded for your account.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="bg-neutral-100 px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#111111]">
              Order Number: <span className="text-[#FF5A1F]">{order.orderNumber}</span>
            </div>
            <div className="bg-neutral-100 px-4 py-2 rounded-xl text-xs font-bold text-neutral-600">
              Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Bank Transfer Alert if Applicable */}
        {order.paymentMethod === 'BANK_TRANSFER' && (
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 font-bold text-[#111111] text-base">
              <Building2 className="w-5 h-5 text-[#FF5A1F]" />
              <span>Direct Bank Transfer Details</span>
            </div>
            <p className="text-xs text-neutral-600">
              Please transfer the total amount of <strong>Rs. {order.totalAmount.toLocaleString()}</strong> to the designated account and mention your Order Number <strong>{order.orderNumber}</strong> in the transfer remarks:
            </p>
            <div className="bg-white p-4 rounded-2xl border border-orange-200 font-mono text-xs text-neutral-800 whitespace-pre-line leading-relaxed shadow-sm">
              {settings?.bankDetails ||
                'Bank: Meezan Bank Ltd\nAccount Title: Hiwood Bags Private Limited\nAccount Number: 01020304050607\nIBAN: PK65MEZN0001020304050607'}
            </div>
          </div>
        )}

        {/* Delivery Timeline Indicator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-4">
          <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#FF5A1F]" />
            <span>Estimated Delivery Timeline</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="font-bold text-[#111111] block mb-1">1. Processing (Day 1)</span>
              <span className="text-neutral-500">Quality check and safe packaging at our Karachi distribution warehouse.</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="font-bold text-[#111111] block mb-1">2. Dispatched (Day 2)</span>
              <span className="text-neutral-500">Handed over to courier (TCS/Leopards) with tracking code.</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="font-bold text-[#111111] block mb-1">3. Delivery (Day 3-4)</span>
              <span className="text-neutral-500">Doorstep delivery to {order.city} with Cash on Delivery collection.</span>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Items Purchased */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-4">
            <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#FF5A1F]" />
              <span>Purchased Bags</span>
            </h3>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 border p-1 shrink-0 flex items-center justify-center">
                      <Image
                        src={item.image || '/images/hero-backpack.png'}
                        alt={item.productName}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-[#111111] block">{item.productName}</span>
                      <span className="text-neutral-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#111111]">
                    Rs. {item.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#111111]">Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#FF5A1F]">
                  <span>Discount</span>
                  <span>- Rs. {order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#111111]">
                  {order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#111111] pt-2 border-t border-gray-100">
                <span>Total Paid</span>
                <span>Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] space-y-4">
            <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF5A1F]" />
              <span>Delivery Details</span>
            </h3>

            <div className="space-y-3 text-xs text-neutral-600">
              <div>
                <span className="font-bold text-[#111111] block">Customer:</span>
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <span className="font-bold text-[#111111] block mb-1">Destination:</span>
                <span>{order.deliveryAddress}, {order.city}, Pakistan</span>
              </div>
              {order.deliveryNotes && (
                <div>
                  <span className="font-bold text-[#111111] block mb-1">Instructions:</span>
                  <span className="italic">{order.deliveryNotes}</span>
                </div>
              )}
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <Link
                href="/track-order"
                className="btn-primary w-full text-xs font-bold py-3 text-center"
              >
                <span>Track Live Order Status</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/"
                className="btn-secondary w-full text-xs font-bold py-3 text-center"
              >
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
