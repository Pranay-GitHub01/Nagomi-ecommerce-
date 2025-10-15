import { create } from 'zustand';
import { CartItem, Product } from '../types';
import { API_BASE_URL } from '../api/config';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number, options?: Partial<CartItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  mergeLocalCart: () => Promise<void>;
}

const API_URL = `${API_BASE_URL}/api/cart`;
function getToken() {
  return localStorage.getItem('token');
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  fetchCart: async () => {
    const token = getToken();
    if (!token) {
      // Restore cart from localStorage if present
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        set({ items: JSON.parse(localCart) });
      } else {
        set({ items: [] });
      }
      return;
    }
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return set({ items: [] });
    const cart = await res.json();
    set({ items: (cart.items || []).map((item: any) => ({
      ...item,
      id: item._id,
    })) });
    // Clear localStorage cart after successful fetch
    localStorage.removeItem('cart');
  },

  addItem: async (product, quantity = 1, options = {}) => {
    const token = getToken();
    if (!token) {
      // Save to localStorage cart if not logged in
      const current = get().items;
      const existing = current.find(
        (item) => item.product.id === (product.id || product._id) &&
          item.selectedColor === options.selectedColor &&
          item.selectedMaterial === options.selectedMaterial
      );
      let newItems;
      if (existing) {
        newItems = current.map((item) =>
          item.product.id === (product.id || product._id) &&
          item.selectedColor === options.selectedColor &&
          item.selectedMaterial === options.selectedMaterial
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [
          ...current,
          {
            id: `${product.id || product._id}-${options.selectedColor || ''}-${options.selectedMaterial || ''}`,
            product,
            quantity,
            ...options,
          },
        ];
      }
      set({ items: newItems });
      localStorage.setItem('cart', JSON.stringify(newItems));
      return;
    }
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id || product._id,
        quantity,
        selectedColor: options.selectedColor,
        selectedMaterial: options.selectedMaterial,
      }),
    });
    await get().fetchCart();
  },

  removeItem: async (id) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().fetchCart();
  },

  updateQuantity: async (id, quantity) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    await get().fetchCart();
  },

  clearCart: async () => {
    const token = getToken();
    if (!token) {
      set({ items: [] });
      localStorage.removeItem('cart');
      return;
    }
    await fetch(API_URL, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().fetchCart();
  },

  toggleCart: () => {
    set(state => ({ isOpen: !state.isOpen }));
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  // Add a method to merge localStorage cart with backend cart after login
  mergeLocalCart: async () => {
    const token = getToken();
    if (!token) return;
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const items = JSON.parse(localCart);
      for (const item of items) {
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item.product.id || item.product._id,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedMaterial: item.selectedMaterial,
          }),
        });
      }
      localStorage.removeItem('cart');
      await get().fetchCart();
    }
  },
}));