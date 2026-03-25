import { create } from "zustand";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  finish?: string;
  quantity: number;
  unitPrice: number;
  configurationId?: string;
}

interface CartStore {
  items: CartItem[];
  drawerOpen: boolean;

  // Drawer control
  openDrawer: () => void;
  closeDrawer: () => void;

  // Item mutations (optimistic — synced with API separately)
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, configurationId?: string) => void;
  updateQty: (productId: string, quantity: number, configurationId?: string) => void;
  clear: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  drawerOpen: false,

  openDrawer:  () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),

  setItems: (items) => set({ items }),

  addItem: (incoming) => {
    const { items } = get();
    const idx = items.findIndex(
      (i) => i.productId === incoming.productId && i.configurationId === incoming.configurationId,
    );
    if (idx >= 0) {
      const updated = [...items];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + incoming.quantity };
      set({ items: updated });
    } else {
      set({ items: [...items, incoming] });
    }
  },

  removeItem: (productId, configurationId) => {
    set({
      items: get().items.filter(
        (i) => !(i.productId === productId && i.configurationId === configurationId),
      ),
    });
  },

  updateQty: (productId, quantity, configurationId) => {
    if (quantity < 1) { get().removeItem(productId, configurationId); return; }
    set({
      items: get().items.map((i) =>
        i.productId === productId && i.configurationId === configurationId
          ? { ...i, quantity }
          : i,
      ),
    });
  },

  clear: () => set({ items: [] }),

  totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
  subtotal:   () => get().items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
}));
