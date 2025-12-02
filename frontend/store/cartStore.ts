import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setCart: (items) => set({ items }),
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === newItem.product.id);

        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map((item) =>
              item.product.id === newItem.product.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          // Add new item
          set({ items: [...items, newItem] });
        }
      },
      updateItemQuantity: (itemId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },
      removeItem: (itemId) => {
        set({
          items: get().items.filter((item) => item.id !== itemId),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

