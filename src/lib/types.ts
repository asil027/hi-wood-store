export interface ProductVariantType {
  id: string;
  colorName: string;
  colorHex: string;
  size?: string | null;
  sku?: string | null;
  stock: number;
  price?: number | null;
  image?: string | null;
}

export interface ProductImageType {
  id: string;
  url: string;
  alt?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isPublished: boolean;
  rating: number;
  reviewCount: number;
  specs?: string | null;
  categoryId?: string | null;
  collectionId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  collection?: { id: string; name: string; slug: string } | null;
  images: ProductImageType[];
  variants: ProductVariantType[];
}

export interface CartItemType {
  id: string; // unique item id (e.g. productId + '-' + color)
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  maxStock: number;
}

export interface CollectionType {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  image?: string | null;
  startingPrice?: number | null;
  bgTheme?: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
}
