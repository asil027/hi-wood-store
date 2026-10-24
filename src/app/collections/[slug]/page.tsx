import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div
          className="rounded-3xl p-8 sm:p-14 border border-[#E8E8E8] flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: collection.bgTheme || '#FDF6EE' }}
        >
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
              {collection.subtitle || 'COLLECTION'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
              {collection.name}
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {collection.description}
            </p>
          </div>

          <div className="relative w-64 h-64 shrink-0 flex items-center justify-center">
            <Image
              src={collection.image || '/images/products/classic-cream.png'}
              alt={collection.name}
              width={260}
              height={260}
              className="object-contain w-full h-full drop-shadow-xl"
            />
          </div>
        </div>

        {/* Products in this Collection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#111111]">
              Available Bags ({collection.products.length})
            </h2>
            <Link href="/shop" className="text-xs font-bold text-[#FF5A1F] hover:underline flex items-center gap-1">
              <span>View All Store Bags</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collection.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex flex-col rounded-3xl p-4 border border-[#E8E8E8] bg-white transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-square rounded-2xl bg-[#F8F8F8] p-6 flex items-center justify-center">
                  <Image
                    src={product.images[0]?.url || '/images/hero-backpack.png'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-contain w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-base font-bold text-[#111111] mt-4 group-hover:text-[#FF5A1F] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-[#111111]">{product.rating.toFixed(1)}</span>
                </div>
                <div className="text-base font-extrabold text-[#111111] mt-2">
                  Rs. {(product.salePrice || product.price).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
