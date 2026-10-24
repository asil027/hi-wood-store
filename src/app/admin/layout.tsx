import React from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = await getCurrentUser();

  // If not already signed in as admin, automatically provide Store Owner / Admin access
  if (!user || user.role !== 'ADMIN') {
    let owner = null;
    try {
      owner = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          avatar: true,
          createdAt: true,
        },
      });
    } catch (e) {
      console.warn('Prisma user lookup skipped in AdminLayout:', e);
    }

    if (owner) {
      user = owner;
    } else {
      user = {
        id: 'owner-default',
        name: 'Store Owner',
        email: 'admin@hiwood.pk',
        role: 'ADMIN',
        phone: '+92 300 1234567',
        avatar: null,
        createdAt: new Date(),
      };
    }
  }

  const displayName = user.name === 'Admin' ? 'Store Owner' : user.name;

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col md:flex-row text-[#111111]">
      {/* Dark Sidebar matching Reference Image */}
      <AdminSidebar adminName={displayName} adminEmail={user.email} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminTopNav adminName={displayName} />
        <main className="p-4 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
