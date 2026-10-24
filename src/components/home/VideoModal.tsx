'use client';

import React from 'react';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
        
        {/* Header / Close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5A1F]" />
            <h3 className="text-white font-bold text-base sm:text-lg">
              Hiwood — The Craft Behind Carry Your World
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Embed or Interactive Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0"
            title="Hiwood Backpack Showcase"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Footer info */}
        <div className="p-6 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-sm">
            Discover water-repellent durability, ergonomic weight distribution, and intelligent compartment architecture.
          </p>
          <a
            href="/shop"
            onClick={onClose}
            className="btn-primary text-sm whitespace-nowrap"
          >
            Explore Bags
          </a>
        </div>
      </div>
    </div>
  );
}
