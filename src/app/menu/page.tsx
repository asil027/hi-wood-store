import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, ShoppingBag, Sparkles, Star, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [categories, latestProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isPublished: true },
          include: { images: true },
          orderBy: { createdAt: 'desc' },
          take: 4,
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ]);

  const categoryIcons: Record<string, string> = {
    'backpacks': '🎒',
    'travel-bags': '✈️',
    'laptop-bags': '💻',
    'daypacks': '⚡',
    'duffel-bags': '🏋️',
    'crossbody-bags': '👜',
    'accessories': '👝',
  };

  const defaultCategoryImages: Record<string, string> = {
    'backpacks': '/images/hero-backpack.png',
    'travel-bags': '/images/products/urban-black.png',
    'laptop-bags': '/images/products/classic-cream.png',
    'daypacks': '/images/products/casual-pink.png',
    'duffel-bags': '/images/products/adventure-olive.png',
    'crossbody-bags': '/images/products/casual-pink.png',
    'accessories': '/images/products/classic-cream.png',
  };

  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider border border-orange-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPLORE HIWOOD CATALOG</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Bags Categories & Menu
          </h1>
          <p className="text-sm text-neutral-500">
            Browse our full range of engineered bags: from large travel packs to everyday commute backpacks.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const icon = categoryIcons[cat.slug] || '🎒';
            const catImage =
              cat.products[0]?.images[0]?.url ||
              cat.image ||
              defaultCategoryImages[cat.slug] ||
              '/images/hero-backpack.png';

            return (
              <div
                key={cat.id}
                className="group relative bg-[#FAFAFA] rounded-3xl p-6 border border-[#E8E8E8] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-2 z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 bg-white rounded-2xl shadow-sm border border-black/5">
                      {icon}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FF5A1F] border border-orange-100 shadow-sm">
                      {cat._count.products} {cat._count.products === 1 ? 'Bag' : 'Bags'}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-[#111111] group-hover:text-[#FF5A1F] transition-colors pt-2">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {cat.description || `High performance and durable ${cat.name.toLowerCase()} for daily commute.`}
                  </p>
                </div>

                {/* Bag Picture Preview */}
                <div className="relative aspect-square w-full max-w-[220px] mx-auto my-6 flex items-center justify-center">
                  <Image
                    src={catImage}
                    alt={cat.name}
                    width={240}
                    height={240}
                    className="object-contain w-full h-full drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between z-10">
                  <span className="text-xs font-semibold text-neutral-400">
                    Explore collection
                  </span>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                  >
                    <span>View Bags</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recently Added Bags (Directly showing manually added bag pictures!) */}
        <div className="pt-10 border-t border-neutral-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
                FRESH ARRIVALS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight mt-1">
                Latest Added Bags
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#111111] hover:text-[#FF5A1F] flex items-center gap-1"
            >
              <span>See Full Shop Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {latestProducts.map((p) => {
              const bagPic = p.images[0]?.url || '/images/hero-backpack.png';
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-200 p-3 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="w-full aspect-square bg-[#F8F8F8] rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={bagPic}
                      alt={p.name}
                      width={160}
                      height={160}
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform drop-shadow-sm"
                    />
                    {p.salePrice && (
                      <span className="absolute top-2 left-2 bg-[#FF5A1F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                        Sale
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#FF5A1F]">
                      {p.category?.name || 'Backpack'}
                    </span>
                    <h3 className="text-xs font-bold text-[#111111] line-clamp-1 group-hover:text-[#FF5A1F] transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-xs font-extrabold text-[#111111]">
                        Rs. {(p.salePrice || p.price).toLocaleString()}
                      </span>
                      {p.salePrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          Rs. {p.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
