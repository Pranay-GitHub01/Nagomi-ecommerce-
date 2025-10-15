import { Product } from '../types';
import { API_BASE_URL } from './config';

export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return await res.json();
}

export async function addProduct(product: Partial<Product>, token: string) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to add product');
  return await res.json();
}

export async function updateProduct(id: string, product: Partial<Product>, token: string) {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return await res.json();
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return await res.json();
} 