import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  imageUrl?: string;
  linkUrl?: string;
}

export default function PromoBanner({
  heading = 'Bags for Every Journey',
  subheading = 'Travel • Study • Work • Adventure',
  buttonText = 'Shop Collection',
  imageUrl = '/images/banner-lifestyle.png',
  linkUrl = '/shop',
}: PromoBannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center">
        
        {/* Background Image with Dark Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={heading}
            fill
            className="object-cover object-center filter brightness-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-8 sm:p-14 max-w-xl space-y-5 text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            EXPLORE MORE
          </span>

          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {heading}
          </h3>

          <p className="text-sm sm:text-base text-neutral-300 font-medium tracking-wide">
            {subheading}
          </p>

          <div className="pt-2">
            <Link
              href={linkUrl}
              className="btn-primary group text-sm sm:text-base shadow-xl"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
