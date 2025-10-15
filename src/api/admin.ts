import { API_BASE_URL } from './config';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  getRecentOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/recent`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch recent orders');
    return response.json();
  },

  // Orders
  getAllOrders: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/api/admin/orders?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getOrderDetails: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch order details');
    return response.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  // Products
  getAllProducts: async (params?: { page?: number; limit?: number; search?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);

    const response = await fetch(`${API_BASE_URL}/api/admin/products?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getProductCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/products/categories`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product categories');
    return response.json();
  },

  // Customers
  getAllCustomers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/api/admin/customers?${searchParams}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  },

  getCustomerDetails: async (customerId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/customers/${customerId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch customer details');
    return response.json();
  },

  // Analytics
  getAnalytics: async (period: string = '30') => {
    const response = await fetch(`${API_BASE_URL}/api/admin/analytics?period=${period}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  getAbandonedCarts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/abandoned-carts`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch abandoned carts');
    return response.json();
  },

  getProductInsights: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/product-insights`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product insights');
    return response.json();
  },

  // Stats
  getRevenue: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats/revenue`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch revenue');
    return response.json();
  },

  getOrderCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats/orders`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch order count');
    return response.json();
  },

  getProductCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats/products`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product count');
    return response.json();
  },

  getCustomerCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats/customers`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch customer count');
    return response.json();
  },
}; 