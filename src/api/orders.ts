import { Order, CartItem } from '../types';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/orders`;

export async function getAllOrders(token: string): Promise<Order[]> {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return await res.json();
}

export async function getOrderById(id: string, token: string): Promise<Order> {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Order not found');
  return await res.json();
}

export async function createOrder(items: CartItem[], shippingAddress: any, paymentMethod: string, token: string) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items, shippingAddress, paymentMethod }),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return await res.json();
}

export async function payOrder(id: string, token: string) {
  const res = await fetch(`${API_URL}/${id}/pay`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to pay for order');
  return await res.json();
} 