import { create } from 'zustand';
import { Order, CartItem } from '../types';
import { API_BASE_URL } from '../api/config';

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  getOrder: (id: string) => Promise<Order | null>;
  createOrder: (items: CartItem[], shippingAddress: any, paymentMethod: string) => Promise<void>;
  payOrder: (id: string) => Promise<void>;
}

const API_URL = `${API_BASE_URL}/api/orders`;
function getToken() {
  return localStorage.getItem('token');
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    const token = getToken();
    if (!token) return set({ orders: [] });
    set({ isLoading: true });
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    set({ orders: data, isLoading: false });
  },

  getOrder: async (id) => {
    const token = getToken();
    if (!token) return null;
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  },

  createOrder: async (items, shippingAddress, paymentMethod) => {
    const token = getToken();
    if (!token) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items, shippingAddress, paymentMethod }),
    });
    await get().fetchOrders();
  },

  payOrder: async (id) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL}/${id}/pay`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().fetchOrders();
  },
})); 