import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Order History | Nagomi</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Order History</h1>
          {loading ? (
            <div>Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-600">No orders found.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <Link
                  to={`/orders/${order._id}`}
                  key={order._id}
                  className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">Order #{order._id.slice(-6)}</span>
                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total: <span className="font-bold">${order.total.toFixed(2)}</span></span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory; 