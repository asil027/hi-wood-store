'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            WE&apos;RE HERE TO HELP
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Contact Support
          </h1>
          <p className="text-sm text-neutral-500">
            Have questions regarding sizing, corporate bulk orders, or order tracking? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#E8E8E8] space-y-8 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#111111]">Direct Contact Channels</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Our support team operates Monday through Saturday, 9:00 AM to 7:00 PM PKT.
              </p>
            </div>

            <div className="space-y-5 text-xs text-neutral-600">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF3ED] text-[#FF5A1F] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#111111] block text-sm">Direct Phone & WhatsApp</span>
                  <a
                    href={`https://wa.me/${(settings?.contactPhone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#FF5A1F] transition-colors"
                  >
                    {settings?.contactPhone || '+92 300 1234567'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF3ED] text-[#FF5A1F] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#111111] block text-sm">Email Inquiries</span>
                  <a
                    href={`mailto:${settings?.contactEmail || 'support@hiwood.pk'}`}
                    className="hover:text-[#FF5A1F] transition-colors"
                  >
                    {settings?.contactEmail || 'support@hiwood.pk'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF3ED] text-[#FF5A1F] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[#111111] block text-sm">Headquarters & Warehouse</span>
                  <span>{settings?.address || 'Plot 42, Sector 15, Korangi Industrial Area, Karachi, Pakistan'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 text-xs text-neutral-700 space-y-1">
              <span className="font-bold text-[#FF5A1F] block">Instant WhatsApp Support:</span>
              <p>
                For quick order status updates or courier tracking inquiries, send a message to{' '}
                <a
                  href={`https://wa.me/${(settings?.contactPhone || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#FF5A1F] underline"
                >
                  {settings?.contactPhone || '+92 300 1234567'}
                </a>{' '}
                with your Order Number.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E8E8] shadow-sm">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#111111]">Message Delivered!</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Thank you for reaching out, {name}. A member of our Karachi customer care team will respond to {email} within 2 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-secondary text-xs font-bold py-2.5 px-6"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-extrabold text-[#111111] mb-2">Send Us an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sara Malik"
                      className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sara@example.com"
                      className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Mobile Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Your Message or Question *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your question about bags, order tracking, or exchange..."
                    className="w-full text-xs p-3.5 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary py-3.5 px-8 text-xs font-bold inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
