'use client';

import React from 'react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';

interface AnnouncementBarProps {
  text?: string;
  isActive?: boolean;
}

export default function AnnouncementBar({
  text,
  isActive,
}: AnnouncementBarProps) {
  const { settings } = useSettings();
  const active = isActive !== undefined ? isActive : (settings?.announcementActive ?? true);
  const displayText =
    text ||
    settings?.announcementText ||
    '⚡ Special Offer: Free Nationwide Delivery on Orders over Rs. 3,000 | Use Code HIWOOD10 for 10% Off!';

  if (!active) return null;

  return (
    <div className="bg-[#111111] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 relative z-50">
      <span>{displayText}</span>
      <Link href="/shop" className="underline font-bold text-[#FF5A1F] hover:text-[#ff743f] ml-1 transition-colors">
        Shop Now →
      </Link>
    </div>
  );
}
