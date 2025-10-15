import { API_BASE_URL } from './config';

export async function submitCustomDesignRequest(data: any) {
  const res = await fetch(`${API_BASE_URL}/api/custom-design`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit custom design request');
  return await res.json();
}

export async function getAllCustomDesignRequests(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/custom-design`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch custom design requests');
  return await res.json();
}

export async function getCustomDesignRequestById(id: string, token: string) {
  const res = await fetch(`/api/custom-design/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Custom design request not found');
  return await res.json();
} 