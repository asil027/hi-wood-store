'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import VideoModal from './VideoModal';

interface HeroSectionProps {
  headline?: string;
  subheading?: string;
  buttonText?: string;
  imageUrl?: string;
}

export default function HeroSection({
  headline = 'Carry\nYour World',
  subheading = 'Premium quality backpacks designed for your everyday adventures. Style, comfort and durability — all in one.',
  buttonText = 'Shop Now',
  imageUrl = '/images/hero-backpack.png',
}: HeroSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-6 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-8 z-10">
              
              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.08] whitespace-pre-line">
                {headline}
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
                {subheading}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="btn-primary group text-base font-bold shadow-lg shadow-orange-500/20"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="btn-secondary group text-base font-semibold"
                >
                  <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Trust Badge Bar */}
              <div className="pt-6 border-t border-[#E8E8E8] flex items-center gap-6 text-xs text-neutral-500 font-medium">
                <div>
                  <span className="font-bold text-[#111111] text-sm">4.9 ★</span> from 500+ Pakistani Bag Enthusiasts
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <div>
                  Handcrafted in Pakistan
                </div>
              </div>

            </div>

            {/* Right Product Presentation Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              {/* Soft Organic Peach/Orange Background Shape */}
              <div
                className="absolute w-[80%] max-w-[480px] aspect-square rounded-full bg-gradient-to-tr from-[#FFF0E8] via-[#FFE5D6] to-[#FFF7F2] -z-0 blur-xl opacity-90 scale-105"
                aria-hidden="true"
              />
              <div
                className="absolute w-[88%] max-w-[520px] aspect-square rounded-full bg-[#FFF3EC] -z-0"
                aria-hidden="true"
              />

              {/* Hero Backpack Image */}
              <div className="relative z-10 w-full max-w-[460px] aspect-square flex items-center justify-center drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src={imageUrl}
                  alt="Hiwood Signature Classic Backpack"
                  width={600}
                  height={600}
                  priority
                  className="object-contain w-full h-full drop-shadow-xl"
                />

                {/* Floating Aesthetic Feature Badge */}
                <div className="absolute bottom-6 right-2 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-in fade-in duration-700">
                  <div className="w-3 h-3 rounded-full bg-[#FF5A1F] animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-[#111111]">Water-Repellent</div>
                    <div className="text-[10px] text-neutral-500">900D Oxford Canvas</div>
                  </div>
                </div>

                {/* Floating Price Pill */}
                <div className="absolute top-8 left-2 sm:left-4 bg-[#111111] text-white px-3.5 py-1.5 rounded-full shadow-lg text-xs font-bold tracking-wide">
                  Rs. 2,499
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Video Modal Trigger */}
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
