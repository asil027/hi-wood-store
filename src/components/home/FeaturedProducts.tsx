'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  categoryName?: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isBestSeller?: boolean;
}

interface FeaturedProductsProps {
  products: ProductSummary[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addItem } = useCart();
  const [filter, setFilter] = useState<'ALL' | 'BEST_SELLER'>('ALL');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const filtered = products.filter((p) => {
    if (filter === 'BEST_SELLER') return p.isBestSeller;
    return true;
  });

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product: ProductSummary, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.slug}-default`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      quantity: 1,
      maxStock: product.stock,
    });
  };

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
              FEATURED GEAR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight mt-1">
              Engineered For The Everyday
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              All Bags
            </button>
            <button
              onClick={() => setFilter('BEST_SELLER')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'BEST_SELLER'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const hasSale = product.salePrice && product.salePrice < product.price;
            const currentPrice = hasSale ? product.salePrice! : product.price;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E8E8E8] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-[#F8F8F8] p-6 flex items-center justify-center overflow-hidden">
                  
                  {/* Sale / Best seller badge */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    {hasSale && (
                      <span className="bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Sale
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-[#111111] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Top Rated
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-[#FF5A1F] shadow-sm transition-transform active:scale-90"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist[product.id]
                          ? 'fill-[#FF5A1F] text-[#FF5A1F]'
                          : 'stroke-[2]'
                      }`}
                    />
                  </button>

                  <Link href={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={350}
                      height={350}
                      className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                    />
                  </Link>

                  {/* Quick Add Overlay on Hover */}
                  <div className="absolute bottom-4 inset-x-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full btn-primary py-2.5 text-xs font-bold shadow-lg shadow-orange-500/20"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Quick Add to Bag</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {product.categoryName && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        {product.categoryName}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#111111] mt-0.5 line-clamp-1 hover:text-[#FF5A1F] transition-colors">
                      <Link href={`/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="font-bold text-[#111111]">{product.rating.toFixed(1)}</span>
                    <span>({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1 border-t border-gray-100">
                    <span className="text-lg font-extrabold text-[#111111]">
                      Rs. {currentPrice.toLocaleString()}
                    </span>
                    {hasSale && (
                      <span className="text-xs text-neutral-400 line-through">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Store Button */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="btn-secondary px-8 py-3.5 text-sm font-bold inline-flex items-center gap-2"
          >
            <span>Explore Entire Hiwood Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
