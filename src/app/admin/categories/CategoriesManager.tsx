'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FolderTree, Layers, Plus, X, Check, Loader2, Sparkles } from 'lucide-react';

interface CategoriesManagerProps {
  initialCategories: any[];
  initialCollections: any[];
}

export default function CategoriesManager({
  initialCategories,
  initialCollections,
}: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [collections] = useState(initialCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.category) {
        if (!categories.some((c) => c.id === data.category.id)) {
          setCategories((prev) => [...prev, { ...data.category, _count: { products: 0 } }]);
        }
        setSuccess(`Category "${name}" created successfully!`);
        setName('');
        setDescription('');
        setIsModalOpen(false);
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.error || 'Failed to create category');
      }
    } catch {
      setError('Network error while saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Featured Collections Table */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-[#111111] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#FF5A1F]" />
          <span>Curated Series Collections (Homepage Grid)</span>
        </h3>

        <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Series Name</th>
                <th className="py-4 px-6">Subtitle Tagline</th>
                <th className="py-4 px-6">Starting Price</th>
                <th className="py-4 px-6">Assigned Bags</th>
                <th className="py-4 px-6 text-right">Theme Pastel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl p-1 shrink-0 flex items-center justify-center border border-black/5"
                        style={{ backgroundColor: col.bgTheme || '#FDF6EE' }}
                      >
                        <Image
                          src={col.image || '/images/products/classic-cream.png'}
                          alt={col.name}
                          width={36}
                          height={36}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <span className="font-bold text-[#111111]">{col.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-neutral-500">
                    {col.subtitle || '—'}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-[#111111]">
                    Rs. {(col.startingPrice || 2499).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#111111]">
                    {col._count?.products || 0} products
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className="inline-block w-6 h-6 rounded-full border border-neutral-300 shadow-sm"
                      style={{ backgroundColor: col.bgTheme || '#FFFFFF' }}
                      title={col.bgTheme || '#FFFFFF'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#111111] flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#FF5A1F]" />
            <span>Bag Categories (Catalog & Menu Filters)</span>
          </h3>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Bag Category</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Slug</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6 text-right">Products Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#111111] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
                    <span>{cat.name}</span>
                  </td>
                  <td className="py-4 px-6 font-mono text-neutral-400 text-[11px]">
                    /shop?category={cat.slug}
                  </td>
                  <td className="py-4 px-6 text-neutral-500">{cat.description || '—'}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="bg-orange-50 text-[#FF5A1F] px-2.5 py-1 rounded-full font-bold text-[11px] border border-orange-100">
                      {cat._count?.products || 0} bags
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8E8E8] shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-[#111111]">
                Add Bag Category
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-[#111111] p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel Bags, Backpacks, Gym Bags..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Rugged high-capacity carry-on bags for flights and road trips."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary py-2.5 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
