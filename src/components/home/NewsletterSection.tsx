'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMsg('Welcome to the Hiwood Community! Your 10% coupon code: HIWOOD10');
        setEmail('');
      } else {
        setStatus('error');
        setMsg(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setMsg('Network issue. Please try again later.');
    }
  };

  return (
    <section className="py-20 bg-[#111111] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
          JOIN THE HIWOOD CLUB
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Get 10% Off Your First Backpack
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
          Subscribe for exclusive product drops, travel stories, and special discount codes delivered directly to your inbox.
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-6 py-3.5 rounded-full text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{msg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-full pl-12 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#FF5A1F]"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary py-3 px-6 text-sm whitespace-nowrap shadow-lg shadow-orange-500/20"
            >
              {status === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-400 mt-2">{msg}</p>
        )}
      </div>
    </section>
  );
}
