import React from 'react';
import { prisma } from '@/lib/prisma';
import CategoriesManager from './CategoriesManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#111111]">
          Categories & Collections Management
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Organize bag categories (Travel Bags, Backpacks, etc.) and curated lifestyle series for menus and catalogs.
        </p>
      </div>

      <CategoriesManager
        initialCategories={categories}
        initialCollections={collections}
      />
    </div>
  );
}
