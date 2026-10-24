import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Plus, Search, Edit, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import ProductsManager from './ProductsManager';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];
  let collections: any[] = [];

  try {
    const [_products, _categories, _collections] = await Promise.all([
      prisma.product.findMany({
        include: {
          images: true,
          category: true,
          collection: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
      prisma.collection.findMany(),
    ]);
    products = _products;
    categories = _categories;
    collections = _collections;
  } catch (e) {
    console.warn('Failed to load products in admin:', e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#111111]">
            Product Management
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your backpack inventory, pricing, variants, and catalog visibility.
          </p>
        </div>
      </div>

      <ProductsManager
        initialProducts={products}
        categories={categories}
        collections={collections}
      />
    </div>
  );
}
