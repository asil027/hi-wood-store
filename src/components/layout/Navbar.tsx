'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, User as UserIcon, Menu, X, Shield, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bagCategories = [
    { name: 'Backpacks', slug: 'backpacks', icon: '🎒', desc: 'Commute, campus & daily carry' },
    { name: 'Travel Bags', slug: 'travel-bags', icon: '✈️', desc: 'Carry-on luggage & travel packs' },
    { name: 'Laptop Bags', slug: 'laptop-bags', icon: '💻', desc: 'Padded tech sleeves & briefpacks' },
    { name: 'Daypacks', slug: 'daypacks', icon: '⚡', desc: 'Ultralight compact day bags' },
    { name: 'Duffel Bags', slug: 'duffel-bags', icon: '🏋️', desc: 'Gym, sports & weekender duffels' },
    { name: 'Crossbody Bags', slug: 'crossbody-bags', icon: '👜', desc: 'Hands-free compact slings' },
    { name: 'Accessories', slug: 'accessories', icon: '👝', desc: 'Pouches & tech organizers' },
  ];

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'Categories Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E8E8] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 group">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
              Hiwood
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ml-0.5 transition-transform group-hover:scale-125"></span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link
              href="/"
              className={`text-sm font-semibold transition-all relative py-1 ${
                pathname === '/' ? 'text-[#111111]' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Home
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF5A1F] rounded-full" />
              )}
            </Link>

            {/* Bags Categories Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`text-sm font-semibold transition-all flex items-center gap-1 py-1 ${
                  categoriesDropdownOpen || pathname.includes('category') || pathname === '/menu'
                    ? 'text-[#FF5A1F]'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                <span>Bags Menu</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180 text-[#FF5A1F]' : ''
                  }`}
                />
              </button>

              {/* Mega Dropdown Card */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-3xl shadow-2xl border border-[#E8E8E8] p-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A1F] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>BAGS BY CATEGORY</span>
                    </span>
                    <Link
                      href="/menu"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="text-[11px] font-bold text-neutral-500 hover:text-[#FF5A1F] flex items-center gap-0.5"
                    >
                      <span>Menu Page</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="py-1">
                    {bagCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-orange-50/70 transition-colors group"
                      >
                        <span className="text-xl shrink-0 p-1 bg-neutral-100 group-hover:bg-white rounded-xl transition-colors">
                          {cat.icon}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#111111] group-hover:text-[#FF5A1F] block transition-colors">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 block truncate">
                            {cat.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 px-2 pb-1">
                    <Link
                      href="/shop"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="w-full btn-primary py-2 text-center text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>Explore All Bags</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/shop"
              className={`text-sm font-semibold transition-all relative py-1 ${
                pathname === '/shop' ? 'text-[#111111]' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Shop All
              {pathname === '/shop' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF5A1F] rounded-full" />
              )}
            </Link>

            <Link
              href="/collections"
              className={`text-sm font-semibold transition-all relative py-1 ${
                pathname === '/collections' ? 'text-[#111111]' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Series Collections
              {pathname === '/collections' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF5A1F] rounded-full" />
              )}
            </Link>

            <Link
              href="/about"
              className={`text-sm font-semibold transition-all relative py-1 ${
                pathname === '/about' ? 'text-[#111111]' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-semibold transition-all relative py-1 ${
                pathname === '/contact' ? 'text-[#111111]' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#111111] hover:text-[#FF5A1F] transition-colors rounded-full hover:bg-gray-100"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Shopping Cart Icon with Live Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 p-2 text-[#111111] hover:text-[#FF5A1F] transition-colors rounded-full hover:bg-gray-100 group"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-[#111111]">
                ({totalItems})
              </span>
            </button>

            {/* User Account / Admin Link */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 text-xs font-bold bg-[#111111] text-white px-2.5 py-1 rounded-full hover:bg-[#FF5A1F] transition-colors shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/account"
                  className="p-2 text-[#111111] hover:text-[#FF5A1F] transition-colors rounded-full hover:bg-gray-100"
                  title={user.name}
                >
                  <UserIcon className="w-5 h-5 stroke-[2.2]" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-neutral-100 text-neutral-800 hover:text-white hover:bg-[#111111] px-2.5 py-1 rounded-full transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#FF5A1F]" />
                  <span>Admin</span>
                </Link>
                <Link
                  href="/login"
                  className="p-2 text-[#111111] hover:text-[#FF5A1F] transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Login or Account"
                >
                  <UserIcon className="w-5 h-5 stroke-[2.2]" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#111111] hover:text-[#FF5A1F] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E8E8E8] bg-white px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search travel bags, backpacks, laptop briefpacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-sm font-medium text-[#111111] outline-none bg-transparent"
              />
              <button
                type="submit"
                className="text-xs font-bold uppercase bg-[#FF5A1F] text-white px-4 py-1.5 rounded-full hover:bg-[#E04B14] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-[#111111] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E8E8] bg-white px-6 py-5 space-y-4 shadow-xl animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold py-2 px-3 rounded-xl transition-colors ${
                  pathname === '/' ? 'bg-orange-50 text-[#FF5A1F]' : 'text-[#111111] hover:bg-gray-50'
                }`}
              >
                Home
              </Link>

              {/* Bags Categories Accordion */}
              <div className="border border-neutral-200 rounded-2xl p-2 bg-neutral-50/50">
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#111111] py-1.5 px-2 uppercase tracking-wider"
                >
                  <span className="flex items-center gap-1.5 text-[#FF5A1F]">
                    <span>🎒</span>
                    <span>Bags Categories</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {mobileCategoriesOpen && (
                  <div className="pt-2 space-y-1">
                    {bagCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-orange-50 hover:text-[#FF5A1F] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      </Link>
                    ))}
                    <Link
                      href="/menu"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 text-xs font-bold text-[#FF5A1F] hover:underline"
                    >
                      View All Bag Categories &rarr;
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2 px-3 rounded-xl text-[#111111] hover:bg-gray-50"
              >
                Shop All Bags
              </Link>

              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2 px-3 rounded-xl text-[#111111] hover:bg-gray-50"
              >
                Series Collections
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2 px-3 rounded-xl text-[#111111] hover:bg-gray-50"
              >
                About Hiwood
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold py-2 px-3 rounded-xl text-[#111111] hover:bg-gray-50"
              >
                Contact Us
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-white bg-[#111111] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <Shield className="w-4 h-4 text-[#FF5A1F]" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
