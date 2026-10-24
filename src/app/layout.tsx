import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import CartDrawer from '@/components/cart/CartDrawer';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Hiwood — Carry Your World | Premium Backpacks & Bags Pakistan',
  description: 'Premium quality backpacks designed for your everyday adventures. Style, comfort and durability — all in one. Free shipping over Rs. 3,000 across Pakistan.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  } catch {
    // Fallback if db is empty during initial load
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-[#111111] antialiased selection:bg-[#FF5A1F] selection:text-white">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar
              text={settings?.announcementText}
              isActive={settings?.announcementActive ?? true}
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
