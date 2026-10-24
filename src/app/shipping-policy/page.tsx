import React from 'react';
import Link from 'next/link';
import { Truck, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            TRANSPARENT LOGISTICS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Shipping & Nationwide Delivery Policy
          </h1>
          <p className="text-xs text-neutral-400">Last updated: October 2026</p>
        </div>

        <div className="prose max-w-none text-neutral-600 text-sm leading-relaxed space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#FF5A1F]" />
              <span>Free Nationwide Delivery Over Rs. 3,000</span>
            </h3>
            <p>
              We offer free standard delivery across all cities and towns in Pakistan for orders totaling Rs. 3,000 or above. For orders under Rs. 3,000, a flat shipping fee of Rs. 250 applies.
            </p>
          </div>

          <h3 className="text-lg font-bold text-[#111111] pt-4">Delivery Timelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Karachi & Lahore:</strong> 2 to 3 business days.</li>
            <li><strong>Islamabad & Rawalpindi:</strong> 2 to 3 business days.</li>
            <li><strong>Faisalabad, Multan, Peshawar, Sialkot, Gujranwala:</strong> 3 to 4 business days.</li>
            <li><strong>Quetta, Gilgit, Skardu, and Interior Sindh / KPK / Balochistan:</strong> 4 to 6 business days.</li>
          </ul>

          <h3 className="text-lg font-bold text-[#111111] pt-4">Order Verification</h3>
          <p>
            For first-time Cash on Delivery orders, our customer service team may send a brief WhatsApp confirmation to ensure address accuracy before dispatching your parcel.
          </p>

          <h3 className="text-lg font-bold text-[#111111] pt-4">Courier Partners & Tracking</h3>
          <p>
            All shipments are dispatched via TCS Express, Leopards Courier, or Trax Logistics. Once dispatched, you will receive a tracking number which can be queried directly on our <Link href="/track-order" className="text-[#FF5A1F] font-bold underline">Order Tracking Page</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}
