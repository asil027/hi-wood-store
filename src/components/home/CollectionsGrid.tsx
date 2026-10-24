'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  startingPrice: number;
  bgTheme: string;
  image: string;
}

interface CollectionsGridProps {
  collections?: CollectionItem[];
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  const { addItem } = useCart();

  const defaultCollections: CollectionItem[] = [
    {
      id: 'col-1',
      name: 'Classic Series',
      slug: 'classic-series',
      subtitle: 'Simple • Stylish • Daily Use',
      startingPrice: 2499,
      bgTheme: '#FDF6EE',
      image: '/images/products/classic-cream.png',
    },
    {
      id: 'col-2',
      name: 'Urban Series',
      slug: 'urban-series',
      subtitle: 'Modern • Spacious • Travel',
      startingPrice: 3299,
      bgTheme: '#F3F0FA',
      image: '/images/products/urban-black.png',
    },
    {
      id: 'col-3',
      name: 'Adventure Series',
      slug: 'adventure-series',
      subtitle: 'Rugged • Durable • Outdoor',
      startingPrice: 3799,
      bgTheme: '#EFF7F2',
      image: '/images/products/adventure-olive.png',
    },
    {
      id: 'col-4',
      name: 'Casual Series',
      slug: 'casual-series',
      subtitle: 'Trendy • Lightweight • Daily',
      startingPrice: 2199,
      bgTheme: '#FDF2F4',
      image: '/images/products/casual-pink.png',
    },
  ];

  const items = collections && collections.length > 0 ? collections : defaultCollections;

  const handleQuickAdd = (col: CollectionItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${col.slug}-standard`,
      productId: col.id,
      name: `${col.name} Backpack`,
      slug: col.slug,
      price: col.startingPrice,
      salePrice: col.startingPrice,
      image: col.image,
      quantity: 1,
      maxStock: 25,
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
              OUR COLLECTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight mt-1">
              Find Your Perfect Bag
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/collections"
              className="text-sm font-bold text-[#111111] hover:text-[#FF5A1F] flex items-center gap-1.5 transition-colors group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 4 Collection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((col) => (
            <div
              key={col.slug}
              className="group flex flex-col rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-[#E8E8E8]"
            >
              {/* Product Visual Container with custom pastel background */}
              <Link
                href={`/collections/${col.slug}`}
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden flex items-center justify-center p-6 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: col.bgTheme }}
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  width={380}
                  height={480}
                  className="object-contain w-full h-full drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Card Meta Content */}
              <div className="pt-5 pb-2 px-1 flex flex-col flex-1 justify-between">
                <div>
                  <Link
                    href={`/collections/${col.slug}`}
                    className="text-base font-bold text-[#111111] hover:text-[#FF5A1F] transition-colors"
                  >
                    {col.name}
                  </Link>
                  <p className="text-xs text-neutral-500 mt-1 font-medium">
                    {col.subtitle}
                  </p>
                </div>

                {/* Price & Quick Add Button */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                  <div className="text-sm font-extrabold text-[#111111]">
                    Rs. {col.startingPrice.toLocaleString()}
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(col, e)}
                    className="w-8 h-8 rounded-full border border-[#111111] text-[#111111] hover:bg-[#FF5A1F] hover:border-[#FF5A1F] hover:text-white flex items-center justify-center transition-all duration-200 group/btn"
                    title="Add to cart"
                    aria-label={`Add ${col.name} to cart`}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5] group-hover/btn:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
