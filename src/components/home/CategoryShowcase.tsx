'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  count: number;
  image: string;
}

interface CategoryShowcaseProps {
  categories: CategoryItem[];
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const categoryIcons: Record<string, string> = {
    'backpacks': '🎒',
    'travel-bags': '✈️',
    'laptop-bags': '💻',
    'daypacks': '⚡',
    'duffel-bags': '🏋️',
    'crossbody-bags': '👜',
    'accessories': '👝',
  };

  return (
    <section className="py-16 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider border border-orange-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SHOP BY CATEGORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Bags For Every Lifestyle
            </h2>
          </div>

          <Link
            href="/menu"
            className="text-xs font-bold text-[#111111] hover:text-[#FF5A1F] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Categories &amp; Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#FF5A1F]" />
          </Link>
        </div>

        {/* Category Pills / Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => {
            const icon = categoryIcons[cat.slug] || '🎒';
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative bg-[#FAFAFA] hover:bg-orange-50/50 rounded-3xl p-4 border border-[#E8E8E8] hover:border-orange-200 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center justify-between"
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-lg p-1.5 bg-white rounded-xl shadow-xs border border-black/5">
                    {icon}
                  </span>
                  <span className="text-[10px] font-bold text-[#FF5A1F] bg-white px-2 py-0.5 rounded-full border border-orange-100">
                    {cat.count} {cat.count === 1 ? 'Bag' : 'Bags'}
                  </span>
                </div>

                <div className="relative aspect-square w-24 h-24 my-3 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#111111] group-hover:text-[#FF5A1F] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-neutral-400 group-hover:text-neutral-600 flex items-center justify-center gap-0.5 mt-0.5">
                    <span>Explore</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
