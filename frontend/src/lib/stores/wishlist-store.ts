import { create } from "zustand";
import { persist } from "zustand/middleware";
import { wishlistApi } from "@/lib/api/client";

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
  material?: string;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  add:    (item: WishlistItem) => void;
  remove: (productId: string) => void;
  toggle: (item: WishlistItem) => void;
  has:    (productId: string) => boolean;
  clear:  () => void;
  /** Fire-and-forget: push local wishlist to server after login */
  syncToServer: (accessToken: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        if (get().has(item.productId)) return;
        set({ items: [...get().items, { ...item, addedAt: Date.now() }] });
      },

      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      toggle: (item) =>
        get().has(item.productId) ? get().remove(item.productId) : get().add(item),

      has: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),

      syncToServer: (accessToken) => {
        const productIds = get().items.map((i) => i.productId);
        wishlistApi.sync(accessToken, productIds).catch(() => {/* local store remains source of truth */});
      },
    }),
    { name: "modulas-wishlist" },
  ),
);
