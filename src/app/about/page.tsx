import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Heart, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            OUR JOURNEY & VISION
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#111111] tracking-tight">
            Carry Your World with Uncompromised Craft
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            Founded with a passion for functional minimalism, Hiwood was born in Karachi to solve a simple dilemma: why were everyday backpacks either cheaply made or exorbitantly imported?
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF5A1F] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Pakistan-Engineered</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Every seam, strap, and zipper puller is rigorously engineered to withstand heavy laptop loads, crowded commutes, and dust storms.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF5A1F] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">100% Water-Repellent</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              We exclusively specify heavy-duty 900D and 1680D ballistic oxford canvas with polyurethane weatherproof coating.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF5A1F] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">Customer First</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Nationwide Cash on Delivery, responsive WhatsApp support, and a transparent 7-day money-back exchange policy.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-extrabold text-white">Join the Hiwood Movement</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Whether you are a university student rushing to IBA or LUMS, a tech consultant traveling between Islamabad and Karachi, or a photographer exploring Skardu — Hiwood is built to carry your world.
            </p>
            <div className="pt-2">
              <Link href="/shop" className="btn-primary text-sm font-bold">
                <span>Explore the Catalog</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          <div className="relative w-64 h-64 shrink-0 flex items-center justify-center">
            <Image
              src="/images/hero-backpack.png"
              alt="Hiwood Craft"
              width={260}
              height={260}
              className="object-contain w-full h-full drop-shadow-2xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
