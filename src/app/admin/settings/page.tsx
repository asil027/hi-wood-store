import React from 'react';
import { prisma } from '@/lib/prisma';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 'default' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#111111]">
          Store Settings & Payment Configuration
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Manage currency, nationwide shipping thresholds, Meezan Bank details, and COD availability.
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
