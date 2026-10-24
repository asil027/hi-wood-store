'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, Shield } from 'lucide-react';

export default function AdminTopNav({ adminName }: { adminName: string }) {
  return (
    <header className="h-20 bg-white border-b border-[#E8E8E8] px-6 sm:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
          Dashboard Overview
        </h1>
        <span className="hidden sm:inline-block bg-orange-50 text-[#FF5A1F] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
          Live Database Mode
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          className="relative p-2 text-neutral-500 hover:text-[#111111] rounded-full hover:bg-neutral-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5A1F]" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-neutral-200">
          <div className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
            {adminName.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-[#111111] block leading-none">
              {adminName}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">
              Store Owner / Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
