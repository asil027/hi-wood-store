import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: { isPublished: true },
        include: { images: true },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            CURATED EDITIONS
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            The Hiwood Series
          </h1>
          <p className="text-sm text-neutral-500">
            From everyday minimalist commutes to rugged off-road expeditions across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group rounded-3xl p-8 border border-[#E8E8E8] transition-all hover:shadow-2xl flex flex-col justify-between overflow-hidden relative"
              style={{ backgroundColor: col.bgTheme || '#FDF6EE' }}
            >
              <div className="space-y-2 z-10">
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  {col.subtitle || 'Everyday Series'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] group-hover:text-[#FF5A1F] transition-colors">
                  {col.name}
                </h2>
                <p className="text-sm text-neutral-600 max-w-sm">
                  {col.description}
                </p>
              </div>

              <div className="relative aspect-[4/3] w-full max-w-sm mx-auto my-6 flex items-center justify-center">
                <Image
                  src={col.image || '/images/products/classic-cream.png'}
                  alt={col.name}
                  width={400}
                  height={320}
                  className="object-contain w-full h-full drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/10 z-10">
                <div>
                  <span className="text-xs text-neutral-500 block">Starting from</span>
                  <span className="text-lg font-extrabold text-[#111111]">
                    Rs. {(col.startingPrice || 2499).toLocaleString()}
                  </span>
                </div>

                <div className="btn-primary py-2.5 px-5 text-xs font-bold">
                  <span>Explore Series</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
