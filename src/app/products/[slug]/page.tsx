import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      variants: true,
      category: true,
      collection: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Related products
  const related = await prisma.product.findMany({
    where: {
      isPublished: true,
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId },
        { collectionId: product.collectionId },
      ],
    },
    include: {
      images: true,
      category: true,
    },
    take: 4,
  });

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={related}
    />
  );
}
