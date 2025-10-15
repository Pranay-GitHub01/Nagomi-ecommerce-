import { create } from 'zustand';
import { API_BASE_URL } from '../api/config';

interface CustomDesignRequest {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  roomType: string;
  dimensions: { width: number; height: number };
  style: string;
  budget: string;
  description: string;
  inspirationImages: string[];
  submittedAt?: string;
}

interface CustomDesignStore {
  requests: CustomDesignRequest[];
  isLoading: boolean;
  submitRequest: (data: Omit<CustomDesignRequest, '_id' | 'submittedAt'>) => Promise<void>;
  fetchRequests: () => Promise<void>;
  getRequest: (id: string) => Promise<CustomDesignRequest | null>;
}

const API_URL = `${API_BASE_URL}/api/custom-design`;
function getToken() {
  return localStorage.getItem('token');
}

export const useCustomDesignStore = create<CustomDesignStore>((set, get) => ({
  requests: [],
  isLoading: false,

  submitRequest: async (data) => {
    set({ isLoading: true });
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    set({ isLoading: false });
  },

  fetchRequests: async () => {
    const token = getToken();
    if (!token) return set({ requests: [] });
    set({ isLoading: true });
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    set({ requests: data, isLoading: false });
  },

  getRequest: async (id) => {
    const token = getToken();
    if (!token) return null;
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  },
})); 