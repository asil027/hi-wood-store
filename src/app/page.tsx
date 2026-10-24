import React from 'react';
import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/home/HeroSection';
import BenefitsBar from '@/components/home/BenefitsBar';
import CollectionsGrid from '@/components/home/CollectionsGrid';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch store settings, collections, categories, and products from database
  let settings = null;
  let collections: any[] = [];
  let dbCategories: any[] = [];
  let products: any[] = [];

  const defaultCategoryImages: Record<string, string> = {
    'backpacks': '/images/hero-backpack.png',
    'travel-bags': '/images/products/urban-black.png',
    'laptop-bags': '/images/products/classic-cream.png',
    'daypacks': '/images/products/casual-pink.png',
    'duffel-bags': '/images/products/adventure-olive.png',
    'crossbody-bags': '/images/products/casual-pink.png',
    'accessories': '/images/products/classic-cream.png',
  };

  try {
    settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

    collections = await prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isPublished: true },
          include: { images: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    const dbProducts = await prisma.product.findMany({
      where: { isPublished: true },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    products = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      image: p.images[0]?.url || '/images/hero-backpack.png',
      categoryName: p.category?.name || 'Backpack',
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      isBestSeller: p.isBestSeller,
    }));
  } catch (error) {
    console.error('Database load error on homepage:', error);
  }

  // Format collections for CollectionsGrid
  const formattedCollections = collections.map((col) => ({
    id: col.id,
    name: col.name,
    slug: col.slug,
    subtitle: col.subtitle || 'Everyday Collection',
    startingPrice: col.startingPrice || 2499,
    bgTheme: col.bgTheme || '#FDF6EE',
    image: col.image || '/images/products/classic-cream.png',
  }));

  // Format categories for CategoryShowcase
  const formattedCategories = dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    count: c._count.products,
    image:
      c.products[0]?.images[0]?.url ||
      c.image ||
      defaultCategoryImages[c.slug] ||
      '/images/hero-backpack.png',
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section matching reference image */}
      <HeroSection
        headline={settings?.heroHeading || 'Carry\nYour World'}
        subheading={settings?.heroSubheading}
        buttonText={settings?.heroButtonText}
        imageUrl={settings?.heroImageUrl}
      />

      {/* 2. Benefits Bar */}
      <BenefitsBar />

      {/* 3. Shop Bags By Category (Travel Bags, Backpacks, Laptop Bags, etc.) */}
      <CategoryShowcase categories={formattedCategories} />

      {/* 4. Find Your Perfect Bag - Collections Grid */}
      <CollectionsGrid collections={formattedCollections} />

      {/* 5. Featured Gear Product Grid (Reflects newly added bags immediately) */}
      <FeaturedProducts products={products} />

      {/* 6. Bags For Every Journey - Promotional Banner */}
      <PromoBanner
        heading={settings?.promoHeading}
        subheading={settings?.promoSubheading}
        buttonText={settings?.promoButtonText}
        imageUrl={settings?.promoImageUrl}
      />

      {/* 7. Real Customer Testimonials */}
      <TestimonialsSection />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}
