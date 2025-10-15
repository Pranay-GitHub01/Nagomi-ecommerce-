import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface OrderItem {
  product: {
    name: string;
    images: string[];
    price: number;
    _id: string;
  };
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
}

interface Order {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
  };
  cardInfo: {
    brand: string;
    last4: string;
  };
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Order Details | Nagomi</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <Link to="/orders" className="text-primary-600 hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Order Details</h1>
          {loading ? (
            <div>Loading...</div>
          ) : !order ? (
            <div className="text-gray-600">Order not found.</div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Order #{order._id.slice(-6)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{order.status}</span>
              </div>
              <div className="mb-6 text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</div>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
                <div className="text-gray-700">
                  <div>{order.shippingInfo.name}</div>
                  <div>{order.shippingInfo.address}</div>
                  <div>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}</div>
                  <div>{order.shippingInfo.phone}</div>
                  <div>{order.shippingInfo.email}</div>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Payment</h2>
                <div className="text-gray-700">
                  <div>{order.cardInfo.brand} ending in {order.cardInfo.last4}</div>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Items</h2>
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center py-4">
                      <img src={Array.isArray(item.product.images) && item.product.images.length > 0 ? `/images/${item.product.images[0].split('/').pop()}` : '/placeholder.jpg'} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.product.name}</div>
                        <div className="text-gray-600 text-sm">Qty: {item.quantity}</div>
                        {item.selectedColor && <div className="text-xs text-gray-500">Color: {item.selectedColor}</div>}
                        {item.selectedMaterial && <div className="text-xs text-gray-500">Material: {item.selectedMaterial}</div>}
                      </div>
                      <div className="font-semibold text-gray-900">₹99 per square feet</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetail; 