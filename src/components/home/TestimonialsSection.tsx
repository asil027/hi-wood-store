import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: 'Zainab Qureshi',
      city: 'Karachi',
      rating: 5,
      review: 'The Classic Series in Cream & Orange is breathtaking in person! The laptop compartment fits my MacBook Pro with extra padding. It arrived in just 2 days in DHA Phase 5.',
      bag: 'Classic Series Backpack',
    },
    {
      name: 'Bilal Ahmed',
      city: 'Lahore',
      rating: 5,
      review: 'I ride my bike to office in Gulberg everyday. The Urban Series water resistance was tested during the heavy rain last week and everything inside remained 100% bone dry.',
      bag: 'Urban Series Backpack',
    },
    {
      name: 'Dr. Harris Khan',
      city: 'Islamabad',
      rating: 5,
      review: 'Took the Adventure pack on a 5-day trek through Hunza Valley. Extremely rugged fabric, comfortable chest harness, and holds all camera gear effortlessly.',
      bag: 'Adventure Rugged Pack',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            REAL FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Loved By Pakistani Commuters & Travelers
          </h2>
          <p className="text-neutral-500 text-sm">
            Discover why hundreds of university students, remote workers, and adventurers carry Hiwood every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-[#F9F9F9] border border-[#E8E8E8] flex flex-col justify-between space-y-6 relative hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-[#FF5A1F]/20 absolute top-6 right-6" />

              <div className="space-y-4">
                {/* 5-star rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed italic">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span title="Verified Buyer" className="inline-flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">{rev.city}, Pakistan</span>
                </div>
                <span className="text-[11px] font-bold text-neutral-500 bg-white px-2.5 py-1 rounded-full border border-neutral-200">
                  {rev.bag}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
