// AdminProducts.tsx (First Version from Redesign)

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Plus, Edit, Trash2, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Product } from "../../types"; // Adjust path as needed
import { API_BASE_URL } from "../../api/config"; // Adjust path as needed

// --- (Import new/moved components) ---
import ProductThumbnail from "../../components/admin/ProductThumbnail"; // Adjust path as needed
import { formatCurrency } from "../../utils/formatters"; // Adjust path as needed

// --- Main AdminProducts Component ---
const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const productData = await response.json();
        setProducts(Array.isArray(productData) ? productData : []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "An unexpected error occurred.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Filtering Logic ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(lowerSearchTerm) ||
        product.category?.toLowerCase().includes(lowerSearchTerm) ||
        product.skuId?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [products, searchTerm]);


  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <>
      <Helmet>
        <title>Admin - Manage Products</title>
        <meta name="description" content="View, add, edit, and delete products." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page Title */}
          <div className="mb-4">
             <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          </div>

          {/* Toolbar: Search and Add Button */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, category, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            {/* Add Product Button */}
            <Link
              to="/admin/products/add"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 text-sm whitespace-nowrap w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>


          {/* Product Table Container */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden" // Use overflow-hidden on the container
          >
            <div className="overflow-x-auto">
              {filteredProducts.length > 0 ? (
                <table className="w-full min-w-[700px]"> {/* Min width for horizontal scroll */}
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        In Stock
                      </th>
                       <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* Use the enhanced thumbnail component */}
                            <ProductThumbnail product={product} className="w-12 h-12" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-sm" title={product.name}>
                                {product.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {product.category || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                           <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                             product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                           }`}>
                             {product.inStock ? 'In Stock' : 'Out of Stock'}
                           </span>
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {product.skuId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="text-primary-600 hover:text-primary-800 p-1 rounded hover:bg-primary-50 transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => alert(`Implement delete for product ${product._id}`)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Display message when no products match the search or if list is empty
                 <div className="text-center py-16 px-6">
                   <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                   <p className="text-lg font-medium text-gray-700 mb-1">
                     No products found
                   </p>
                   <p className="text-sm text-gray-500">
                     {searchTerm ? `Your search for "${searchTerm}" returned no results.` : 'Get started by adding a new product.'}
                   </p>
                 </div>
              )}
            </div>
             {/* Optional: Add Pagination controls here */}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;