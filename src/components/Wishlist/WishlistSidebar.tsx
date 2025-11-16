import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';
const WishlistSidebar: React.FC = () => {
  const { items, isOpen, toggleWishlist, removeFromWishlist, getTotalItems } = useWishlistStore();

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
            onClick={toggleWishlist}
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
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Wishlist ({getTotalItems()})
              </h2>
              <button
                onClick={toggleWishlist}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start liking wallpapers to build your collection!
                  </p>
                  <Link
                    to="/"
                    onClick={toggleWishlist}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Explore Designs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((product) => (
                    <motion.div
                      key={product._id || product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={Array.isArray(product.images) && product.images.length > 0 ? `${API_BASE_URL}${product.images[0]}` : '/placeholder.jpg'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600"> ₹99 per square feet</p>
                        {product.bestseller && (
                          <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold mt-1">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/${product.category}/${product._id || product.id}`}
                          onClick={toggleWishlist}
                          className="p-2 hover:bg-gray-200 rounded text-blue-600"
                        >
                          <span className="sr-only">View product</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(product._id || product.id)}
                          className="p-2 hover:bg-gray-200 rounded text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total Items:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {getTotalItems()}
                  </span>
                </div>
                <Link
                  to="/"
                  onClick={toggleWishlist}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar; 