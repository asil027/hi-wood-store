'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Star, ShoppingBag, Heart, X, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  salePrice?: number | null;
  image: string;
  categoryId?: string | null;
  categorySlug?: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

interface ShopClientProps {
  products: ShopProduct[];
  categories: { id: string; name: string; slug: string }[];
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: string;
}

export default function ShopClient({
  products,
  categories,
  initialSearch = '',
  initialCategory = '',
  initialSort = 'featured',
}: ShopClientProps) {
  const { addItem } = useCart();
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product: ShopProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.slug}-shop`,
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

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory) {
          if (p.categorySlug !== selectedCategory && p.categoryId !== selectedCategory) return false;
        }

        // Price filter
        const price = p.salePrice || p.price;
        if (price > maxPrice) return false;

        // Stock filter
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // Default featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, search, selectedCategory, maxPrice, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMaxPrice(6000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
          HIWOOD CATALOG
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight mt-1">
          {selectedCategory
            ? `Explore ${categories.find((c) => c.slug === selectedCategory)?.name || 'Bags'}`
            : 'Explore All Bags & Backpacks'}
        </h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-2xl">
          Engineered for university, office, and off-road adventures. Enjoy free shipping on orders above Rs. 3,000 across Pakistan.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-3xl p-5 mb-10 space-y-4">
        
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by series, model or specs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#E8E8E8] text-sm text-[#111111] outline-none focus:border-[#FF5A1F]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3 text-neutral-400 hover:text-[#111111]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Sort & Stock Toggle */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer bg-white px-3.5 py-2.5 rounded-full border border-[#E8E8E8]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#FF5A1F] rounded"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#E8E8E8]">
              <span className="text-xs text-neutral-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-[#111111] outline-none bg-transparent cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Pills & Price Slider */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-neutral-200/60">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                selectedCategory === ''
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              All Bags
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[#FF5A1F] text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-[#E8E8E8] shrink-0 self-start lg:self-auto">
            <span className="text-xs text-neutral-500 font-medium">
              Max Price: <strong className="text-[#111111]">Rs. {maxPrice.toLocaleString()}</strong>
            </span>
            <input
              type="range"
              min="1500"
              max="6000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-[#FF5A1F] cursor-pointer w-28 sm:w-36"
            />
          </div>

        </div>

      </div>

      {/* Results Count and Active Filter Indicators */}
      <div className="flex items-center justify-between mb-6 text-xs text-neutral-500 font-medium">
        <span>Showing <strong>{filteredProducts.length}</strong> bags</span>
        {(search || selectedCategory || maxPrice < 6000 || inStockOnly) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[#FF5A1F] hover:underline font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#FAFAFA] rounded-3xl border border-dashed border-neutral-300">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
            <Search className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-[#111111]">No matching backpacks found</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing your filters to see our full bag collection.
          </p>
          <button
            onClick={resetFilters}
            className="btn-primary text-xs font-bold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const hasSale = product.salePrice && product.salePrice < product.price;
            const currentPrice = hasSale ? product.salePrice! : product.price;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E8E8E8] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Visual Container */}
                <div className="relative w-full aspect-square bg-[#F8F8F8] p-6 flex items-center justify-center overflow-hidden">
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    {hasSale && (
                      <span className="bg-[#FF5A1F] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-[#111111] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Best Seller
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-[#FF5A1F] shadow-sm transition-transform active:scale-90"
                    aria-label="Wishlist"
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

                  {/* Quick Add Overlay */}
                  <div className="absolute bottom-4 inset-x-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full btn-primary py-2.5 text-xs font-bold shadow-lg shadow-orange-500/20"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      {product.categoryName}
                    </span>
                    <h3 className="text-base font-bold text-[#111111] mt-0.5 line-clamp-1 hover:text-[#FF5A1F] transition-colors">
                      <Link href={`/products/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                  </div>

                  {/* Rating & Stock */}
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-[#111111]">{product.rating.toFixed(1)}</span>
                      <span>({product.reviewCount})</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold ${
                        product.stock > 5 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
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
      )}

    </div>
  );
}
