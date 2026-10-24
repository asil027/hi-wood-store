'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  AlertCircle,
  X,
  Check,
  Package,
  Upload,
  Link as LinkIcon,
  Grid,
  Loader2,
  FolderPlus,
  Image as ImageIcon,
} from 'lucide-react';

interface ProductsManagerProps {
  initialProducts: any[];
  categories: any[];
  collections: any[];
}

export default function ProductsManager({
  initialProducts,
  categories: initialCategories,
  collections,
}: ProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Mode State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('15');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [collectionId, setCollectionId] = useState(collections[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('/images/products/classic-cream.png');
  const [isPublished, setIsPublished] = useState(true);

  // Image Upload & Source State
  const [imageTab, setImageTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick Add Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Curated Preset Bag Images
  const presetImages = [
    { label: 'Hero Cream', url: '/images/hero-backpack.png' },
    { label: 'Classic Cream', url: '/images/products/classic-cream.png' },
    { label: 'Urban Black', url: '/images/products/urban-black.png' },
    { label: 'Adventure Olive', url: '/images/products/adventure-olive.png' },
    { label: 'Casual Pink', url: '/images/products/casual-pink.png' },
    { label: 'Banner Lifestyle', url: '/images/banner-lifestyle.png' },
  ];

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchName = p.name?.toLowerCase().includes(q);
    const matchSku = p.sku && p.sku.toLowerCase().includes(q);
    const matchCat = p.category?.name?.toLowerCase().includes(q);
    return matchName || matchSku || matchCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setSku('');
    setPrice('');
    setSalePrice('');
    setStock('15');
    setShortDesc('');
    setDesc('');
    setCategoryId(categories[0]?.id || '');
    setCollectionId(collections[0]?.id || '');
    setImageUrl('/images/products/classic-cream.png');
    setImageTab('upload');
    setUploadError('');
    setIsPublished(true);
    setError('');
    setIsAddingCategory(false);
    setNewCatName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name || '');
    setSku(prod.sku || '');
    setPrice(String(prod.price || ''));
    setSalePrice(prod.salePrice ? String(prod.salePrice) : '');
    setStock(String(prod.stock ?? 10));
    setShortDesc(prod.shortDescription || '');
    setDesc(prod.description || '');
    setCategoryId(prod.categoryId || categories[0]?.id || '');
    setCollectionId(prod.collectionId || collections[0]?.id || '');
    setImageUrl(prod.images?.[0]?.url || '/images/products/classic-cream.png');
    setImageTab('upload');
    setUploadError('');
    setIsPublished(prod.isPublished !== false);
    setError('');
    setIsAddingCategory(false);
    setNewCatName('');
    setIsModalOpen(true);
  };

  // Handle Manual File Upload (Bag photo from computer/phone)
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setImageUrl(data.url);
      } else {
        setUploadError(data.error || 'Failed to upload image file');
      }
    } catch {
      setUploadError('Network error while uploading picture');
    } finally {
      setIsUploading(false);
    }
  };

  // Quick create category on the fly
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSavingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.category) {
        // Add to state if not already present
        if (!categories.some((c) => c.id === data.category.id)) {
          setCategories((prev) => [...prev, data.category]);
        }
        setCategoryId(data.category.id);
        setNewCatName('');
        setIsAddingCategory(false);
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch {
      alert('Error creating category');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // Edit existing product
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            sku,
            price,
            salePrice: salePrice || null,
            stock,
            shortDescription: shortDesc,
            description: desc,
            categoryId,
            collectionId,
            imageUrl,
            isPublished,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data.product } : p))
          );
          setIsModalOpen(false);
          setSuccessMsg(`Product "${name}" updated successfully.`);
          setTimeout(() => setSuccessMsg(''), 4000);
        } else {
          setError(data.error || 'Failed to update product');
        }
      } else {
        // Create new product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            sku,
            price,
            salePrice: salePrice || null,
            stock,
            shortDescription: shortDesc,
            description: desc,
            categoryId,
            collectionId,
            imageUrl,
            isPublished,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setProducts([data.product, ...products]);
          setIsModalOpen(false);
          setSuccessMsg(`Bag product "${name}" added successfully with your photo!`);
          setTimeout(() => setSuccessMsg(''), 4000);
        } else {
          setError(data.error || 'Failed to create product');
        }
      }
    } catch {
      setError('Network failure while saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setSuccessMsg(`Product "${productToDelete.name}" was successfully deleted.`);
        setProductToDelete(null);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch {
      alert('Network failure while deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Bar: Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by bag name, category or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8E8E8] outline-none focus:border-[#FF5A1F]"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary py-2.5 px-5 text-xs font-bold shrink-0 self-start sm:self-auto flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Bag Product</span>
        </button>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-[#FAFAFA] border-b border-[#E8E8E8] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Bag Product & Photo</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price (PKR)</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6">Visibility</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-neutral-600">No products found</p>
                    <p className="text-[11px] mt-0.5">Click &quot;Add New Bag Product&quot; to upload your bag photo.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 p-1 shrink-0 flex items-center justify-center overflow-hidden relative">
                          <Image
                            src={prod.images?.[0]?.url || '/images/hero-backpack.png'}
                            alt={prod.name}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-[#111111] block line-clamp-1">{prod.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Rating: {prod.rating ? Number(prod.rating).toFixed(1) : '5.0'} ★ ({prod.reviewCount || 0})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#111111]">
                      {prod.sku}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block bg-orange-50 text-[#FF5A1F] font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-orange-100">
                        {prod.category?.name || 'Backpacks'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-[#111111] block">
                        Rs. {(prod.salePrice || prod.price).toLocaleString()}
                      </span>
                      {prod.salePrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          Rs. {prod.price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          prod.stock > 10
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prod.stock > 0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          prod.isPublished !== false
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                        }`}
                      >
                        {prod.isPublished !== false ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="p-2 text-neutral-500 hover:text-[#111111] hover:bg-neutral-100 rounded-xl transition-colors"
                          title="Edit Bag Product"
                        >
                          <Edit2 className="w-4 h-4 stroke-[2]" />
                        </button>
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setProductToDelete(prod)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8E8E8] shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-extrabold text-[#111111]">
                Delete Product?
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-[#111111]">&quot;{productToDelete.name}&quot;</strong> ({productToDelete.sku})? This product will be immediately removed from the catalog.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Bag Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E8E8E8] shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-extrabold text-[#111111]">
                  {editingProduct ? `Edit Bag: ${editingProduct.name}` : 'Add New Bag Product Manually'}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Upload your bag picture, select category (Travel Bags, Backpacks, etc.), and set pricing.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-[#111111] p-1.5 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Product Title */}
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Travel Clamshell 40L Backpack or Urban Pro Stealth"
                  className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] text-sm"
                />
              </div>

              {/* Pricing & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    SKU Code (Auto if blank)
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="HW-TRAVEL-01"
                    className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Regular Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Sale Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="2999"
                    className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              {/* Category, Collection, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                {/* Category with Inline Quick-Add */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-neutral-700">
                      Bag Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="text-[10px] font-bold text-[#FF5A1F] hover:underline flex items-center gap-0.5"
                    >
                      <FolderPlus className="w-3 h-3" />
                      <span>{isAddingCategory ? 'Cancel' : '+ New Category'}</span>
                    </button>
                  </div>

                  {isAddingCategory ? (
                    <div className="flex gap-1.5 animate-in fade-in duration-150">
                      <input
                        type="text"
                        placeholder="e.g. Travel Bags"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-orange-300 outline-none focus:border-[#FF5A1F] text-xs bg-orange-50/30"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={isSavingCategory || !newCatName.trim()}
                        className="px-3 bg-[#FF5A1F] text-white rounded-xl font-bold hover:bg-[#E04B14] disabled:opacity-50 shrink-0 text-xs"
                      >
                        {isSavingCategory ? '...' : 'Add'}
                      </button>
                    </div>
                  ) : (
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] bg-white font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    Curated Series
                  </label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] bg-white font-medium"
                  >
                    <option value="">None (Standard)</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BAG PHOTO SECTION (Manual upload from device, URL, or Presets) */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-extrabold text-neutral-800 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#FF5A1F]" />
                      <span>Bag Picture (Photo)</span>
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      Upload your bag photo directly from your device or paste a URL
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="flex rounded-xl bg-white p-1 border border-neutral-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                        imageTab === 'upload'
                          ? 'bg-[#FF5A1F] text-white'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                        imageTab === 'url'
                          ? 'bg-[#FF5A1F] text-white'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Web URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('presets')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                        imageTab === 'presets'
                          ? 'bg-[#FF5A1F] text-white'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Grid className="w-3 h-3" />
                      <span>Presets</span>
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-red-500 text-[11px] font-bold">{uploadError}</p>
                )}

                {/* Tab 1: Upload from Device */}
                {imageTab === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed border-neutral-300 hover:border-[#FF5A1F] bg-white rounded-2xl p-4 text-center transition-colors group flex flex-col items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 text-[#FF5A1F] animate-spin" />
                          <span className="text-xs font-bold text-neutral-700">Uploading bag picture...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-orange-50 text-[#FF5A1F] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div>
                            <span className="font-bold text-[#111111] text-xs">
                              Click to choose or drag bag photo here
                            </span>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              Supports PNG, JPG, JPEG, WEBP (stored automatically in /public/uploads)
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Direct Image URL */}
                {imageTab === 'url' && (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or /images/..."
                      className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] bg-white text-xs"
                    />
                    <p className="text-[10px] text-neutral-400">
                      Paste any external image link or local path.
                    </p>
                  </div>
                )}

                {/* Tab 3: Presets */}
                {imageTab === 'presets' && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetImages.map((preset) => (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() => setImageUrl(preset.url)}
                        className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                          imageUrl === preset.url
                            ? 'border-[#FF5A1F] bg-orange-50 ring-2 ring-[#FF5A1F]/20'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="w-12 h-12 relative flex items-center justify-center">
                          <Image
                            src={preset.url}
                            alt={preset.label}
                            width={44}
                            height={44}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[9px] font-bold text-neutral-700 truncate w-full">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Live Bag Photo Preview */}
                {imageUrl && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
                    <div className="w-14 h-14 rounded-lg bg-neutral-100 p-1 flex items-center justify-center shrink-0 border border-neutral-200 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="Bag preview"
                        width={52}
                        height={52}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-[#111111] truncate">Selected Picture Active</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-mono truncate">{imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Short Tagline Description
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Water-repellent 26L commuter backpack with padded laptop sleeve."
                  className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  Full Specifications & Description
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Enter detailed fabric specifications, warranty, dimensions, capacity..."
                  className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary py-2.5 px-5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Catalog...</span>
                    </>
                  ) : editingProduct ? (
                    'Update Product'
                  ) : (
                    'Save Bag to Catalog'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
