// ── Product types (snake_case — matches API JSON response) ────────

export interface ProductImage {
  id?:        string;
  url:        string;
  alt_text?:  string;
  is_primary: boolean;
  sort_order?: number;
}

export interface ProductCategory {
  id:   string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent?: ProductCategory;
}

export interface Product {
  id:             string;
  sku:            string;
  slug:           string;
  name:           string;
  description?:   string;
  seo_title?:     string;
  seo_description?: string;
  category?:      ProductCategory;
  price:          number;
  compare_at_price?: number;
  currency:       string;
  material?:      string;
  finish_options: string[];
  dimensions?:    { width: number; height: number; depth: number; unit: string } | null;
  weight_kg?:     number;
  is_configurable: boolean;
  is_featured?:   boolean;
  tags:           string[];
  is_active?:     boolean;
  images:         ProductImage[];
  lead_time_days: number;
  rating?:        number;
  review_count?:  number;
  created_at?:    string;
  updated_at?:    string;
}

export type ProductSortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "popular";

export interface ProductFilters {
  q?:            string;
  category?:     string;
  material?:     string;
  brand?:        string;
  finish?:       string;
  min?:          string;
  max?:          string;
  sort?:         ProductSortOption | string;
  page?:         string;
  limit?:        string;
  configurable?: string;
  instock?:      string;
  sale?:         string;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  aggregations?: {
    categories: Array<{ key: string; count: number }>;
    materials:  Array<{ key: string; count: number }>;
    price_range?: { min: number; max: number; avg: number };
  };
}
