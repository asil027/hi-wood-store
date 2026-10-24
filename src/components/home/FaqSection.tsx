'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does delivery take across Pakistan?',
      a: 'We deliver nationwide through our trusted courier partners (TCS, Leopards, and Trax). Orders to major cities like Karachi, Lahore, Islamabad, and Rawalpindi arrive within 2 to 3 business days. Other cities and rural areas take 3 to 5 business days.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes! We offer 100% Cash on Delivery on all orders across Pakistan. You only pay when your parcel is physically delivered to your doorstep. We also support direct Bank Transfer and online payment options.',
    },
    {
      q: 'What is the return and exchange policy?',
      a: 'We provide a hassle-free 7-day return and exchange guarantee. If you are not completely satisfied with your Hiwood backpack, simply contact our WhatsApp support or email support@hiwood.pk with your order number to initiate an easy exchange or refund.',
    },
    {
      q: 'Are Hiwood backpacks water-resistant?',
      a: 'Yes, our Classic and Adventure Series are crafted from premium 900D and 1000D high-density water-repellent oxford canvas with treated interior lining. They shield your laptop and electronics from unexpected rain showers and splashes.',
    },
    {
      q: 'What size laptops fit inside the Classic & Urban Series?',
      a: 'Both the Classic Series and Urban Series feature heavily padded, dedicated laptop sleeves engineered to snugly fit laptops up to 15.6 inches (including Apple MacBook Pro 16", Dell XPS, HP Spectre, and Lenovo ThinkPads).',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#FAFAFA] border-t border-[#E8E8E8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-500 text-sm">
            Everything you need to know about our bags, shipping, and guarantees.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#E8E8E8] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-base text-[#111111] hover:text-[#FF5A1F] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FF5A1F]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-neutral-600 leading-relaxed animate-in fade-in duration-200 border-t border-neutral-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
