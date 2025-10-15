import { create } from 'zustand';
import { Product } from '../types';
import { API_BASE_URL } from '../api/config';

interface WishlistStore {
  items: Product[];
  isOpen: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
  checkWishlistStatus: (productId: string) => Promise<boolean>;
  initializeWishlist: () => Promise<void>;
}

const API_URL = `${API_BASE_URL}/api/wishlist`;

function getToken() {
  return localStorage.getItem('token');
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isOpen: false,

  initializeWishlist: async () => {
    console.log('Initializing wishlist...');
    await get().fetchWishlist();
  },

  fetchWishlist: async () => {
    const token = getToken();
    console.log('Fetching wishlist, token:', !!token);
    
    if (!token) {
      // Restore wishlist from localStorage if present
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        set({ items: JSON.parse(localWishlist) });
      } else {
        set({ items: [] });
      }
      return;
    }
    
    try {
      console.log('Making API call to:', API_URL);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Wishlist fetch response status:', res.status);
      
      if (!res.ok) {
        console.error('Wishlist fetch failed:', res.status, res.statusText);
        return set({ items: [] });
      }
      
      const wishlistItems = await res.json();
      console.log('Wishlist items received:', wishlistItems);
      
      // Extract products from wishlist items - server returns array of wishlist items with populated productId
      const products = wishlistItems.map((item: any) => item.productId).filter(Boolean);
      console.log('Extracted products:', products);
      
      set({ items: products || [] });
      // Clear localStorage wishlist after successful fetch
      localStorage.removeItem('wishlist');
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      set({ items: [] });
    }
  },

  addToWishlist: async (product) => {
    const token = getToken();
    console.log('Adding to wishlist, product:', product.name, 'token:', !!token);
    
    if (!token) {
      // Save to localStorage wishlist if not logged in
      const current = get().items;
      const existing = current.find(item => item.id === (product.id || product._id));
      if (!existing) {
        const newItems = [...current, product];
        set({ items: newItems });
        localStorage.setItem('wishlist', JSON.stringify(newItems));
      }
      return;
    }

    try {
      const productId = product.id || product._id;
      console.log('Making API call to add product:', productId);
      
      const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
        }),
      });
      
      console.log('Add to wishlist response status:', res.status);
      
      if (res.ok) {
        console.log('Successfully added to wishlist');
        // Always fetch the full wishlist after add
        await get().fetchWishlist();
      } else {
        const errorData = await res.json();
        console.error('Error adding to wishlist:', errorData);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  },

  removeFromWishlist: async (productId) => {
    const token = getToken();
    console.log('Removing from wishlist, productId:', productId, 'token:', !!token);
    
    if (!token) {
      // Remove from localStorage wishlist if not logged in
      const current = get().items;
      const newItems = current.filter(item => item.id !== productId && item._id !== productId);
      set({ items: newItems });
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      return;
    }

    try {
      console.log('Making API call to remove product:', productId);
      
      const res = await fetch(`${API_URL}/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Remove from wishlist response status:', res.status);
      
      if (res.ok) {
        console.log('Successfully removed from wishlist');
        // Always fetch the full wishlist after remove
        await get().fetchWishlist();
      } else {
        const errorData = await res.json();
        console.error('Error removing from wishlist:', errorData);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  },

  clearWishlist: async () => {
    const token = getToken();
    console.log('Clearing wishlist, token:', !!token);
    
    if (!token) {
      set({ items: [] });
      localStorage.removeItem('wishlist');
      return;
    }

    try {
      console.log('Making API call to clear wishlist');
      
      const res = await fetch(`${API_URL}/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Clear wishlist response status:', res.status);
      
      if (res.ok) {
        console.log('Successfully cleared wishlist');
        await get().fetchWishlist();
      } else {
        const errorData = await res.json();
        console.error('Error clearing wishlist:', errorData);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  },

  checkWishlistStatus: async (productId) => {
    const token = getToken();
    console.log('Checking wishlist status, productId:', productId, 'token:', !!token);
    
    if (!token) {
      return get().isInWishlist(productId);
    }

    try {
      console.log('Making API call to check status for product:', productId);
      
      const res = await fetch(`${API_URL}/check/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Check status response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Wishlist status result:', data);
        return data.isInWishlist;
      }
      return false;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  },

  toggleWishlist: () => {
    set(state => ({ isOpen: !state.isOpen }));
  },

  isInWishlist: (productId) => {
    return get().items.some(item => item.id === productId || item._id === productId);
  },

  getTotalItems: () => {
    return get().items.length;
  },
})); 