import { create } from 'zustand';
import { Product } from '../types';
import { API_BASE_URL } from '../api/config';

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const API_URL = `${API_BASE_URL}/api/products`;
function getToken() {
  return localStorage.getItem('token');
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    const res = await fetch(API_URL);
    const data = await res.json();
    set({ products: data, isLoading: false });
  },

  getProduct: async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return null;
    return await res.json();
  },

  addProduct: async (product) => {
    const token = getToken();
    if (!token) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    await get().fetchProducts();
  },

  updateProduct: async (id, product) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    await get().fetchProducts();
  },

  deleteProduct: async (id) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().fetchProducts();
  },
})); 