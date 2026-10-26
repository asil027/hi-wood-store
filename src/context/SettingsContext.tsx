'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface StoreSettingsType {
  id?: string;
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  bankTransferEnabled: boolean;
  bankDetails: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroButtonText?: string;
  heroImageUrl?: string;
  promoHeading?: string;
  promoSubheading?: string;
  promoButtonText?: string;
  promoImageUrl?: string;
  announcementText?: string;
  announcementActive?: boolean;
  returnPolicyText?: string;
  shippingPolicyText?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

interface SettingsContextType {
  settings: StoreSettingsType;
  categories: CategoryItem[];
  refreshSettings: () => Promise<void>;
  updateLocalSettings: (newSettings: Partial<StoreSettingsType>) => void;
}

const defaultSettings: StoreSettingsType = {
  storeName: 'Hiwood',
  tagline: 'Carry Your World',
  contactEmail: 'support@hiwood.pk',
  contactPhone: '+92 300 1234567',
  address: 'Plot 42, Sector 15, Korangi Industrial Area, Karachi, Pakistan',
  currency: 'Rs.',
  standardShippingFee: 250,
  freeShippingThreshold: 3000,
  codEnabled: true,
  bankTransferEnabled: true,
  bankDetails:
    'Bank: Meezan Bank Ltd\nAccount Title: Hiwood Bags Private Limited\nAccount Number: 01020304050607\nIBAN: PK65MEZN0001020304050607',
  heroHeading: 'Carry Your World',
  heroSubheading:
    'Premium quality backpacks designed for your everyday adventures. Style, comfort and durability — all in one.',
  heroButtonText: 'Shop Now',
  heroImageUrl: '/images/hero-backpack.png',
  promoHeading: 'Bags for Every Journey',
  promoSubheading: 'Travel • Study • Work • Adventure',
  promoButtonText: 'Shop Collection',
  promoImageUrl: '/images/banner-lifestyle.png',
  announcementText:
    '⚡ Special Offer: Free Nationwide Delivery on Orders over Rs. 3,000 | Use Code HIWOOD10 for 10% Off!',
  announcementActive: true,
  returnPolicyText:
    'We offer a hassle-free 7-day return and exchange policy for all unworn backpacks in original packaging.',
  shippingPolicyText:
    'Delivery within 2-4 business days across major cities in Pakistan (Karachi, Lahore, Islamabad, etc.). Free shipping on orders above Rs. 3,000.',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({
  children,
  initialSettings,
  initialCategories = [],
}: {
  children: React.ReactNode;
  initialSettings?: Partial<StoreSettingsType> | null;
  initialCategories?: CategoryItem[];
}) {
  const [settings, setSettings] = useState<StoreSettingsType>(() => ({
    ...defaultSettings,
    ...(initialSettings || {}),
  }));

  const [categories, setCategories] = useState<CategoryItem[]>(() => initialCategories);

  // Load from localStorage on client mount (ensures persistence on serverless Vercel)
  useEffect(() => {
    try {
      const cached = localStorage.getItem('hiwood_store_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        setSettings((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Listen for real-time local updates across components
  useEffect(() => {
    const handleSync = () => {
      try {
        const cached = localStorage.getItem('hiwood_store_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          setSettings((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener('hiwood_settings_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('hiwood_settings_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Sync if initialSettings change (e.g. from server revalidation)
  useEffect(() => {
    if (initialSettings) {
      setSettings((prev) => {
        let cached: Partial<StoreSettingsType> = {};
        try {
          const raw = localStorage.getItem('hiwood_store_settings');
          if (raw) cached = JSON.parse(raw);
        } catch {
          // Ignore
        }
        return {
          ...prev,
          ...initialSettings,
          ...cached,
        };
      });
    }
  }, [initialSettings]);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings((prev) => {
            const merged = { ...prev, ...data.settings };
            try {
              localStorage.setItem('hiwood_store_settings', JSON.stringify(merged));
            } catch {
              // Ignore
            }
            return merged;
          });
        }
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (e) {
      console.error('Failed to refresh settings:', e);
    }
  }, []);

  const updateLocalSettings = useCallback((newSettings: Partial<StoreSettingsType>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      try {
        localStorage.setItem('hiwood_store_settings', JSON.stringify(merged));
        window.dispatchEvent(new Event('hiwood_settings_updated'));
      } catch {
        // Ignore
      }
      return merged;
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        categories,
        refreshSettings,
        updateLocalSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: defaultSettings,
      categories: [],
      refreshSettings: async () => {},
      updateLocalSettings: () => {},
    };
  }
  return context;
}
