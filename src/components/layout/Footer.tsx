import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                Hiwood
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ml-0.5"></span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Carry Your World. Premium quality everyday backpacks designed for comfort, rugged durability, and modern urban aesthetics across Pakistan.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-[#FF5A1F] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-[#FF5A1F] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-[#FF5A1F] hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/shop" className="hover:text-[#FF5A1F] transition-colors">All Backpacks</Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#FF5A1F] transition-colors">Collections</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5A1F] transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#FF5A1F] transition-colors">Journal & Blog</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#FF5A1F] transition-colors">Track Order</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#FF5A1F] transition-colors flex items-center gap-1.5">
                  Admin Panel <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-mono">Staff</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link href="/shipping-policy" className="hover:text-[#FF5A1F] transition-colors">Shipping & Delivery</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-[#FF5A1F] transition-colors">7-Day Return Policy</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FF5A1F] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FF5A1F] transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5A1F] transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact Us</h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                <span>Plot 42, Korangi Industrial Area, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                <span>support@hiwood.pk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Hiwood Pakistan. All rights reserved. Carry Your World.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Truck className="w-3.5 h-3.5 text-[#FF5A1F]" /> Nationwide Delivery
            </span>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" /> Cash on Delivery (COD)
            </span>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <RefreshCw className="w-3.5 h-3.5 text-[#FF5A1F]" /> Easy 7-Day Returns
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
