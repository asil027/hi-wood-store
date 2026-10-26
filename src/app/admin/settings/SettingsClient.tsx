'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const { updateLocalSettings, refreshSettings } = useSettings();
  const [storeName, setStoreName] = useState(initialSettings?.storeName || 'Hiwood');
  const [tagline, setTagline] = useState(initialSettings?.tagline || 'Carry Your World');
  const [contactEmail, setContactEmail] = useState(initialSettings?.contactEmail || 'support@hiwood.pk');
  const [contactPhone, setContactPhone] = useState(initialSettings?.contactPhone || '+92 300 1234567');
  const [address, setAddress] = useState(
    initialSettings?.address || 'Plot 42, Sector 15, Korangi Industrial Area, Karachi, Pakistan'
  );
  const [standardShippingFee, setStandardShippingFee] = useState(
    initialSettings?.standardShippingFee?.toString() || '250'
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    initialSettings?.freeShippingThreshold?.toString() || '3000'
  );
  const [codEnabled, setCodEnabled] = useState(
    initialSettings?.codEnabled !== undefined ? initialSettings.codEnabled : true
  );
  const [bankDetails, setBankDetails] = useState(
    initialSettings?.bankDetails ||
      'Bank: Meezan Bank Ltd\nAccount Title: Hiwood Bags Private Limited\nAccount Number: 01020304050607\nIBAN: PK65MEZN0001020304050607'
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    try {
      const cached = localStorage.getItem('hiwood_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.tagline) setTagline(parsed.tagline);
        if (parsed.contactEmail) setContactEmail(parsed.contactEmail);
        if (parsed.contactPhone) setContactPhone(parsed.contactPhone);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.standardShippingFee !== undefined) setStandardShippingFee(String(parsed.standardShippingFee));
        if (parsed.freeShippingThreshold !== undefined) setFreeShippingThreshold(String(parsed.freeShippingThreshold));
        if (parsed.codEnabled !== undefined) setCodEnabled(Boolean(parsed.codEnabled));
        if (parsed.bankDetails) setBankDetails(parsed.bankDetails);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const payload = {
        storeName,
        tagline,
        contactEmail,
        contactPhone,
        address,
        standardShippingFee: parseFloat(standardShippingFee) || 250,
        freeShippingThreshold: parseFloat(freeShippingThreshold) || 3000,
        codEnabled,
        bankDetails,
      };

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        updateLocalSettings(payload);
        await refreshSettings();
        router.refresh();
      }
    } catch {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Store settings successfully updated in the database!</span>
        </div>
      )}

      {/* General Store Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#111111] pb-3 border-b border-gray-100">
          General Brand Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Store Name</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Brand Tagline</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Support Email</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Helpline / WhatsApp</label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-neutral-700 block mb-1">Warehouse & Office Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>
        </div>
      </div>

      {/* Shipping Rates */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#111111] pb-3 border-b border-gray-100">
          Shipping & Logistics Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Standard Delivery Fee (PKR)</label>
            <input
              type="number"
              required
              value={standardShippingFee}
              onChange={(e) => setStandardShippingFee(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Free Nationwide Shipping Threshold (PKR)</label>
            <input
              type="number"
              required
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>
        </div>
      </div>

      {/* Payment Configuration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#111111] pb-3 border-b border-gray-100">
          Payment Methods
        </h3>

        <div className="space-y-4 text-xs">
          <label className="flex items-center gap-3 font-bold text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#FF5A1F]"
            />
            <span>Enable Cash on Delivery (COD) Nationwide</span>
          </label>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">
              Direct Bank Account Details (Meezan / Raast)
            </label>
            <textarea
              rows={4}
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-3.5 px-8 text-xs font-bold inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Store Configuration'}</span>
        </button>
      </div>
    </form>
  );
}
