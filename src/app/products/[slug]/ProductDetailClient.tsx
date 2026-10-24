'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RefreshCw,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  Heart,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0]?.url || '/images/hero-backpack.png'
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [wishlisted, setWishlisted] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const hasSale = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasSale ? product.salePrice : product.price;

  // Specs parser
  let specsObj: Record<string, string> = {};
  try {
    if (product.specs) specsObj = JSON.parse(product.specs);
  } catch {
    // Ignore
  }

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant?.id || 'default'}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: selectedImage,
      color: selectedVariant?.colorName || 'Default',
      size: selectedVariant?.size || 'Standard',
      quantity,
      maxStock: product.stock,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewsList((prev: any[]) => [
          {
            id: 'temp-' + Date.now(),
            userName: reviewName,
            rating: reviewRating,
            comment: reviewComment,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setReviewName('');
        setReviewComment('');
      }
    } catch {
      // Fallback
      setReviewsList((prev: any[]) => [
        {
          id: 'temp-' + Date.now(),
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setReviewSuccess(true);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-8">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[#111111]">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111] line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left: Gallery & Zoom */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Image Display */}
            <div className="relative w-full aspect-square rounded-3xl bg-[#F8F8F8] border border-[#E8E8E8] p-8 flex items-center justify-center overflow-hidden">
              <Image
                src={selectedImage}
                alt={product.name}
                width={650}
                height={650}
                priority
                className="object-contain w-full h-full drop-shadow-xl transition-transform duration-500 hover:scale-110 cursor-zoom-in"
              />

              {/* Wishlist toggle */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-neutral-600 hover:text-[#FF5A1F] shadow-sm transition-transform active:scale-90"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#FF5A1F] text-[#FF5A1F]' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img: any) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-20 h-20 rounded-2xl bg-[#F8F8F8] border p-2 shrink-0 transition-all ${
                      selectedImage === img.url
                        ? 'border-[#FF5A1F] ring-2 ring-[#FF5A1F]/20'
                        : 'border-[#E8E8E8] hover:border-neutral-300'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt="Thumbnail"
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Category & Title */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">
                {product.category?.name || 'Hiwood Backpack'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight mt-1">
                {product.name}
              </h1>
              <div className="text-xs text-neutral-400 mt-1">SKU: {product.sku}</div>
            </div>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-neutral-200 fill-current'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#111111]">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-neutral-400">({reviewsList.length} verified reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <span className="text-3xl font-extrabold text-[#111111]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {hasSale && (
                <>
                  <span className="text-base text-neutral-400 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-white bg-[#FF5A1F] px-2.5 py-0.5 rounded-full uppercase">
                    Save Rs. {(product.price - currentPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Color Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  Select Color: <span className="text-[#FF5A1F]">{selectedVariant?.colorName}</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {product.variants.map((v: any) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-[#FF5A1F] bg-orange-50/50 text-[#111111] shadow-sm'
                            : 'border-[#E8E8E8] text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.colorName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5A1F]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Quantity
                </label>
                <span className="text-xs font-bold text-emerald-600">
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300 rounded-full bg-white px-3 py-1.5 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 text-neutral-500 hover:text-[#111111] disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-[#111111] px-4 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1 text-neutral-500 hover:text-[#111111] disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-orange-500/25 disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                <span>Add to Bag • Rs. {(currentPrice * quantity).toLocaleString()}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="btn-secondary w-full py-3.5 text-base font-bold"
              >
                <Zap className="w-4 h-4 mr-2 fill-current" />
                <span>Buy It Now (Direct Checkout)</span>
              </button>
            </div>

            {/* Shipping & Assurance Highlights */}
            <div className="pt-4 border-t border-neutral-200/80 space-y-3 text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                <span>Free nationwide delivery over Rs. 3,000 (2-4 business days)</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                <span>Hassle-free 7-day return and exchange policy</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                <span>Cash on Delivery (COD) available nationwide</span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tabs: Specifications, Description, Customer Reviews */}
        <div className="mt-16 border-t border-[#E8E8E8] pt-12">
          
          {/* Tab Navigation */}
          <div className="flex items-center space-x-8 border-b border-[#E8E8E8] mb-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${
                activeTab === 'desc'
                  ? 'text-[#111111]'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Description & Craftsmanship
              {activeTab === 'desc' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5A1F]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${
                activeTab === 'specs'
                  ? 'text-[#111111]'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Technical Specifications
              {activeTab === 'specs' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5A1F]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold tracking-tight transition-all relative ${
                activeTab === 'reviews'
                  ? 'text-[#111111]'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Customer Reviews ({reviewsList.length})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5A1F]" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            
            {/* Description Tab */}
            {activeTab === 'desc' && (
              <div className="prose max-w-3xl text-neutral-700 leading-relaxed space-y-4">
                <p className="text-base">{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <h4 className="font-bold text-[#111111] text-sm">Ergonomic Air-Mesh</h4>
                    <p className="text-xs text-neutral-500 mt-1">Multi-layered breathable honeycomb back panel to minimize perspiration during hot Pakistani summers.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <h4 className="font-bold text-[#111111] text-sm">Shockproof Tech Cradle</h4>
                    <p className="text-xs text-neutral-500 mt-1">Suspended laptop compartment with high-density EVA foam that safeguards against accidental floor drops.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden">
                  {Object.entries(specsObj).map(([key, val]) => (
                    <div key={key} className="flex px-5 py-3.5 text-sm bg-white hover:bg-neutral-50">
                      <span className="w-1/3 font-bold text-neutral-700">{key}</span>
                      <span className="w-2/3 text-neutral-600 font-medium">{val}</span>
                    </div>
                  ))}
                  {Object.keys(specsObj).length === 0 && (
                    <div className="p-6 text-sm text-neutral-500">
                      Standard Hiwood 22L - 32L dimensions with dedicated 15.6&quot; laptop sleeve and water-repellent canvas exterior.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-4">
                  {reviewsList.map((rev: any) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E8E8E8] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#111111]">{rev.userName}</span>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{rev.comment}</p>
                      <span className="text-[11px] text-neutral-400 block pt-1">
                        {new Date(rev.createdAt).toLocaleDateString('en-PK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                  {reviewsList.length === 0 && (
                    <p className="text-sm text-neutral-500 py-4">
                      No reviews yet. Be the first to share your thoughts on this backpack!
                    </p>
                  )}
                </div>

                {/* Add Review Form */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8E8E8] space-y-4">
                  <h3 className="text-base font-bold text-[#111111]">Write a Review</h3>
                  {reviewSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
                      Thank you! Your verified review has been published.
                    </div>
                  )}
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Asad Siddiqui"
                        className="w-full text-xs p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Rating
                      </label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full text-xs p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5 Very Good)</option>
                        <option value="3">⭐⭐⭐ (3/5 Average)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Your Feedback
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="How is the fabric quality, stitching, and comfort?"
                        className="w-full text-xs p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="btn-primary w-full py-2.5 text-xs font-bold"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8E8E8]">
            <h3 className="text-2xl font-extrabold text-[#111111] mb-8">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group flex flex-col rounded-3xl p-4 border border-[#E8E8E8] bg-white transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-square rounded-2xl bg-[#F8F8F8] p-4 flex items-center justify-center">
                    <Image
                      src={rel.images[0]?.url || '/images/hero-backpack.png'}
                      alt={rel.name}
                      width={240}
                      height={240}
                      className="object-contain w-full h-full transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-[#111111] mt-3 group-hover:text-[#FF5A1F] transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                  <div className="text-sm font-extrabold text-[#111111] mt-1">
                    Rs. {(rel.salePrice || rel.price).toLocaleString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
