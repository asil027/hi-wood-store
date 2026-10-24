import React from 'react';
import Link from 'next/link';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            HASSLE-FREE GUARANTEE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            7-Day Return & Exchange Policy
          </h1>
          <p className="text-xs text-neutral-400">Last updated: October 2026</p>
        </div>

        <div className="prose max-w-none text-neutral-600 text-sm leading-relaxed space-y-6">
          <div className="p-6 rounded-2xl bg-[#FFF5F0] border border-[#FFE5D6] space-y-2">
            <h3 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#FF5A1F]" />
              <span>Easy 7-Day Window</span>
            </h3>
            <p>
              We want you to love your Hiwood bag. If you are not satisfied with the size, color, or style, you may exchange or return it within 7 calendar days of receipt.
            </p>
          </div>

          <h3 className="text-lg font-bold text-[#111111] pt-4">Conditions for Return</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>The backpack must be unworn, unwashed, and in brand-new condition.</li>
            <li>All original tags, zip pullers, and plastic packaging must be intact.</li>
            <li>Proof of purchase (Order Number) must be provided.</li>
          </ul>

          <h3 className="text-lg font-bold text-[#111111] pt-4">How to Initiate a Return</h3>
          <p>
            Simply send a WhatsApp message to our dedicated support helpline at <strong>+92 300 1234567</strong> or email <strong>support@hiwood.pk</strong> with your Order Number and photos of the bag. Our team will guide you through our courier pickup or drop-off process.
          </p>

          <h3 className="text-lg font-bold text-[#111111] pt-4">Refund Process</h3>
          <p>
            Upon inspection of the returned backpack at our Karachi warehouse, refunds are disbursed within 3 to 5 business days directly via Bank Transfer, Raast, JazzCash, or EasyPaisa.
          </p>
        </div>

      </div>
    </div>
  );
}
