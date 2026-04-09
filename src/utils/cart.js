import { create } from "zustand";

// Each "Add to cart" pushes one object. Badge uses items.length.
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  /** For homepage + : same productId → increase qty on that row, else new row. */
  addItemOrMerge: (item) => {
    const extra = Number(item.qty) > 0 ? item.qty : 1;
    set((state) => {
      const i = state.items.findIndex((line) => line.productId === item.productId);
      if (i === -1) {
        return { items: [...state.items, { ...item, qty: extra }] };
      }
      const next = [...state.items];
      const q = (Number(next[i].qty) > 0 ? next[i].qty : 1) + extra;
      next[i] = { ...next[i], qty: q };
      return { items: next };
    });
  },
  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),
  setQty: (index, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    set((state) => ({
      items: state.items.map((line, i) =>
        i === index ? { ...line, qty: q } : line,
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
}));

/** Build API body: { orderDetailRequests: [{ productId, orderQty }, …] } */
export function cartToOrderRequest(items) {
  const byProduct = new Map();
  for (const line of items) {
    const id = String(line.productId);
    const qty = Number(line.qty) > 0 ? line.qty : 1;
    byProduct.set(id, (byProduct.get(id) ?? 0) + qty);
  }
  return {
    orderDetailRequests: [...byProduct.entries()].map(([productId, orderQty]) => ({
      productId,
      orderQty,
    })),
  };
}
