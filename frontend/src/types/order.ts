// ── Order & Cart types ────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImageUrl?: string;
  configurationId?: string;
  quantity: number;
  unitPrice: number;
  finish?: string;
  customSpecs?: Record<string, unknown>;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  affiliateCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    primaryImage?: string;
  };
  configurationId?: string;
  quantity: number;
  finish?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  currency: string;
}