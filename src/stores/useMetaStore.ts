import { create } from 'zustand';
import { API_BASE_URL } from '../api/config';

interface MetaStore {
  categories: string[];
  colors: string[];
  materials: string[];
  roomTypes: string[];
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = create<MetaStore>((set) => ({
  categories: [],
  colors: [],
  materials: [],
  roomTypes: [],

  fetchMeta: async () => {
    const [categories, colors, materials, roomTypes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/categories`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/colors`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/materials`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/room-types`).then(r => r.json()),
    ]);
    set({ categories, colors, materials, roomTypes });
  },
})); 