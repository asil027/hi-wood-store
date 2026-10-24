import React from 'react';
import { prisma } from '@/lib/prisma';
import ContentEditorClient from './ContentEditorClient';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 'default' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#111111]">
          Homepage & Website Content CMS
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Customize the public storefront headlines, hero images, announcement bar, and promotional banners without editing code.
        </p>
      </div>

      <ContentEditorClient initialSettings={settings} />
    </div>
  );
}
