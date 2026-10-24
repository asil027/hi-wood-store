import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export default function BenefitsBar() {
  const benefits = [
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'On orders over Rs. 3000',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      subtitle: '100% secure checkout',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      subtitle: '7 days return policy',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      subtitle: "We're here to help",
    },
  ];

  return (
    <section className="border-y border-[#E8E8E8] bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-2 transition-transform hover:translate-x-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F5] flex items-center justify-center text-[#111111] shrink-0 border border-neutral-200/60">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111111] tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
