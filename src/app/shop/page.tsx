import React from 'react';
import { prisma } from '@/lib/prisma';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string };
}) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
  });

  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      category: true,
      collection: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDescription: p.shortDescription,
    price: p.price,
    salePrice: p.salePrice,
    image: p.images[0]?.url || '/images/hero-backpack.png',
    categoryId: p.categoryId,
    categorySlug: p.category?.slug,
    categoryName: p.category?.name || 'Backpack',
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    isBestSeller: p.isBestSeller,
    isFeatured: p.isFeatured,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="bg-white min-h-screen">
      <ShopClient
        products={formattedProducts}
        categories={categories}
        initialSearch={searchParams.q || ''}
        initialCategory={searchParams.category || ''}
        initialSort={searchParams.sort || 'featured'}
      />
    </div>
  );
}
