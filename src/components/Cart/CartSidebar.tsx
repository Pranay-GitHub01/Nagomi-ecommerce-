import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';

const CartSidebar: React.FC = () => {
  const { items: storeItems, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const [optimisticItems, setOptimisticItems] = React.useState(storeItems);
  React.useEffect(() => { setOptimisticItems(storeItems); }, [storeItems]);

  // Optimistic quantity update
  const handleUpdateQuantity = async (id: string, quantity: number) => {
    setOptimisticItems(items => items.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
    await updateQuantity(id, quantity);
  };
  // Optimistic remove
  const handleRemoveItem = async (id: string) => {
    setOptimisticItems(items => items.filter(item => item.id !== id));
    await removeItem(id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleCart}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Shopping Cart ({storeItems.length})
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {optimisticItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some beautiful wallpapers to get started!
                  </p>
                  <Link
                    to="/products"
                    onClick={toggleCart}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {optimisticItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg group"
                    >
                      <Link
                        to={`/products/${item.product._id || item.product.id}`}
                        onClick={toggleCart}
                        className="flex items-center flex-1 space-x-4 min-w-0 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                        style={{ textDecoration: 'none' }}
                      >
                        <img
                          src={Array.isArray(item.product.images) && item.product.images.length > 0 ? `${API_BASE_URL}${item.product.images[0]}` : '/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">₹99 per square feet</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </Link>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 hover:bg-gray-200 rounded text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {storeItems.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ₹{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;