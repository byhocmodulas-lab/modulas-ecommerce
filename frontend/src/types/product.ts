// ── Product types (mirrors backend entities) ──────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  parent?: Category;
}

export interface ProductImage {
  id: string;
  fileKey: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description?: string;
  category?: Category;
  price: number;
  currency: string;
  material?: string;
  finishOptions: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: "cm" | "mm" | "in";
  };
  weightKg?: number;
  isConfigurable: boolean;
  tags: string[];
  isActive: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchParams {
  q?: string;
  category?: string;
  material?: string;
  finish?: string;
  min?: string;
  max?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "popular";
  page?: string;
  limit?: string;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  aggregations?: {
    categories: Array<{ key: string; count: number }>;
    materials: Array<{ key: string; count: number }>;
    priceRange: { min: number; max: number; avg: number };
  };
}