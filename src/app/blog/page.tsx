import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: 'How to Choose the Best Commuter Backpack for University & Tech Work',
      snippet: 'Key features to look for: laptop suspension padding, water-resistant oxford weave, and ergonomic weight distribution.',
      date: 'Oct 18, 2026',
      readTime: '4 min read',
      category: 'Buying Guide',
      image: '/images/products/classic-cream.png',
    },
    {
      id: 2,
      title: 'Northern Pakistan Packing Checklist: 5 Essentials for Autumn Road Trips',
      snippet: 'A curated breakdown of essential apparel, tech gear, and weather-sealed packs for Swat, Hunza, and Skardu.',
      date: 'Oct 12, 2026',
      readTime: '6 min read',
      category: 'Travel & Expeditions',
      image: '/images/products/adventure-olive.png',
    },
    {
      id: 3,
      title: 'Caring for 900D Oxford Fabric: Maintenance & Stain Prevention',
      snippet: 'Simple everyday cleaning tips to maintain your Hiwood backpack looking crisp, fresh, and water-repellent for years.',
      date: 'Oct 05, 2026',
      readTime: '3 min read',
      category: 'Care & Durability',
      image: '/images/products/urban-black.png',
    },
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            THE HIWOOD JOURNAL
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Stories & Carry Guides
          </h1>
          <p className="text-sm text-neutral-500">
            Field reports, product deep-dives, and tips for everyday explorers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group rounded-3xl border border-[#E8E8E8] bg-white overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#FAFAFA] p-6 flex items-center justify-center overflow-hidden">
                  <Image
                    src={art.image}
                    alt={art.title}
                    width={320}
                    height={200}
                    className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#111111] uppercase tracking-wider shadow-sm">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {art.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#111111] group-hover:text-[#FF5A1F] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {art.snippet}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <span className="text-xs font-bold text-[#111111] group-hover:text-[#FF5A1F] flex items-center gap-1 transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
