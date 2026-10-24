'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FolderTree,
  Star,
  TicketPercent,
  Sliders,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
}

export default function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Coupons', href: '/admin/coupons', icon: TicketPercent },
    { name: 'Content CMS', href: '/admin/content', icon: Sliders },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#141414] text-white flex flex-col justify-between shrink-0 border-r border-neutral-800 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-neutral-800/80">
          <Link href="/" className="flex items-center gap-0.5 group">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Hiwood
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ml-0.5"></span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            title="View Storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#FF5A1F] text-white shadow-md shadow-orange-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Log out */}
      <div className="p-4 border-t border-neutral-800/80">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-400 hover:text-red-400 hover:bg-neutral-800/60 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
