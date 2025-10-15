import { API_BASE_URL } from './config';

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
}

export async function getColors() {
  const res = await fetch(`${API_BASE_URL}/api/colors`);
  if (!res.ok) throw new Error('Failed to fetch colors');
  return await res.json();
}

export async function getMaterials() {
  const res = await fetch(`${API_BASE_URL}/api/materials`);
  if (!res.ok) throw new Error('Failed to fetch materials');
  return await res.json();
}

export async function getRoomTypes() {
  const res = await fetch('/api/room-types');
  if (!res.ok) throw new Error('Failed to fetch room types');
  return await res.json();
} 