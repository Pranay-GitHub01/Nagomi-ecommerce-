import { CartItem } from '../types';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/cart`;

export async function getCart(token: string) {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return await res.json();
}

export async function addItemToCart(productId: string, quantity: number, selectedColor: string, selectedMaterial: string, token: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity, selectedColor, selectedMaterial }),
  });
  if (!res.ok) throw new Error('Failed to add item to cart');
  return await res.json();
}

export async function updateCartItem(itemId: string, quantity: number, token: string) {
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Failed to update cart item');
  return await res.json();
}

export async function removeCartItem(itemId: string, token: string) {
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove cart item');
  return await res.json();
}

export async function clearCart(token: string) {
  const res = await fetch(API_URL, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  return await res.json();
} 