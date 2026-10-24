'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Eye, RefreshCw } from 'lucide-react';

export default function ContentEditorClient({ initialSettings }: { initialSettings: any }) {
  const [heroHeading, setHeroHeading] = useState(initialSettings?.heroHeading || 'Carry\nYour World');
  const [heroSubheading, setHeroSubheading] = useState(
    initialSettings?.heroSubheading ||
      'Premium quality backpacks designed for your everyday adventures. Style, comfort and durability — all in one.'
  );
  const [heroButtonText, setHeroButtonText] = useState(initialSettings?.heroButtonText || 'Shop Now');
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings?.heroImageUrl || '/images/hero-backpack.png');

  const [promoHeading, setPromoHeading] = useState(initialSettings?.promoHeading || 'Bags for Every Journey');
  const [promoSubheading, setPromoSubheading] = useState(
    initialSettings?.promoSubheading || 'Travel • Study • Work • Adventure'
  );
  const [promoButtonText, setPromoButtonText] = useState(initialSettings?.promoButtonText || 'Shop Collection');
  const [promoImageUrl, setPromoImageUrl] = useState(initialSettings?.promoImageUrl || '/images/banner-lifestyle.png');

  const [announcementText, setAnnouncementText] = useState(
    initialSettings?.announcementText ||
      '⚡ Special Offer: Free Nationwide Delivery on Orders over Rs. 3,000 | Use Code HIWOOD10 for 10% Off!'
  );
  const [announcementActive, setAnnouncementActive] = useState(
    initialSettings?.announcementActive !== undefined ? initialSettings.announcementActive : true
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroHeading,
          heroSubheading,
          heroButtonText,
          heroImageUrl,
          promoHeading,
          promoSubheading,
          promoButtonText,
          promoImageUrl,
          announcementText,
          announcementActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch {
      setError('Network failure while saving content.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Homepage content updated successfully in database! Storefront will reflect changes instantly.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Top Announcement Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-[#111111]">
            1. Top Announcement Bar
          </h3>
          <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              className="accent-[#FF5A1F]"
            />
            <span>Active / Visible</span>
          </label>
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-700 block mb-1">
            Announcement Banner Text
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
          />
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#111111] pb-3 border-b border-gray-100">
          2. Hero Section (Top of Homepage)
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Hero Main Headline</label>
            <textarea
              rows={2}
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] font-bold text-sm"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Hero Subheading Text</label>
            <textarea
              rows={2}
              value={heroSubheading}
              onChange={(e) => setHeroSubheading(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Primary Button Text</label>
              <input
                type="text"
                value={heroButtonText}
                onChange={(e) => setHeroButtonText(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Hero Product Image URL</label>
              <select
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] bg-white font-medium"
              >
                <option value="/images/hero-backpack.png">Hero Cream Backpack</option>
                <option value="/images/products/classic-cream.png">Classic Cream Bag</option>
                <option value="/images/products/urban-black.png">Urban Black Bag</option>
                <option value="/images/products/adventure-olive.png">Adventure Olive Bag</option>
                <option value="/images/products/casual-pink.png">Casual Pink Bag</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Promotional Lifestyle Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E8E8] shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#111111] pb-3 border-b border-gray-100">
          3. Promotional Lifestyle Banner
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Banner Heading</label>
            <input
              type="text"
              value={promoHeading}
              onChange={(e) => setPromoHeading(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Banner Subheading</label>
              <input
                type="text"
                value={promoSubheading}
                onChange={(e) => setPromoSubheading(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Banner Button Text</label>
              <input
                type="text"
                value={promoButtonText}
                onChange={(e) => setPromoButtonText(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary py-3.5 px-8 text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing Updates...' : 'Publish to Storefront'}</span>
        </button>
      </div>

    </form>
  );
}
