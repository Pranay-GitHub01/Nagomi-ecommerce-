// Dashboard.tsx (Restructured for Scrolling)

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Search, // Removed Trash2 and Eye
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { adminAPI } from "../../api/admin"; // Assuming you have this
import { Product } from "../../types"; // Your Product type definition
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../api/config"; // Your API base URL config

// --- UPDATED ProductThumbnail Component ---
const ProductThumbnail: React.FC<{ product: Product; className?: string }> = ({ product, className = "w-10 h-10" }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let primarySrc = '/placeholder.jpg';

    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      const rawUrl = product.images[0];
      if (rawUrl.startsWith('/')) {
        primarySrc = `${API_BASE_URL}${rawUrl}`;
      } else {
        primarySrc = rawUrl;
      }
    }
    setImgSrc(primarySrc);
    if (primarySrc === '/placeholder.jpg') {
        setIsLoading(false);
    }
  }, [product._id, product.images]);

  const handleImgError = () => {
    setImgSrc('/placeholder.jpg');
    setIsLoading(false);
  };

  const handleImgLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`${className} rounded-md flex-shrink-0 bg-gray-200 relative overflow-hidden`}>
      {isLoading && imgSrc !== '/placeholder.jpg' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
        </div>
      )}
      <img
        key={imgSrc}
        src={imgSrc}
        alt={product.name || 'Product Image'}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImgError}
        onLoad={handleImgLoad}
        loading="lazy"
      />
    </div>
  );
};
// --- END OF ProductThumbnail Component ---


// --- Interfaces (assuming similar structure) ---
interface DashboardStats {
  revenue: string;
  orderCount: number;
  productCount: number;
  customerCount: number;
}

interface Order {
  _id: string;
  orderId: string;
  user: { name: string; email: string };
  total: number;
  status: string;
  createdAt: string;
  items: Array<{ product: { name: string }; quantity: number; price: number }>;
}

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "customers">("products"); // Default to products tab
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Effect (Keep as is) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all([
          adminAPI.getDashboardStats().catch(err => { console.error("Stats fetch error:", err); return null; }),
          adminAPI.getRecentOrders().catch(err => { console.error("Orders fetch error:", err); return []; }),
          fetch(`${API_BASE_URL}/api/products`).catch(err => { console.error("Products fetch error:", err); return null; }) // Fetch from public endpoint
        ]);

        const [statsData, ordersData, productsRes] = results;

        setStats(statsData);
        setRecentOrders(ordersData || []);

        if (productsRes instanceof Response) {
            if (productsRes.ok) {
              const productData = await productsRes.json();
              setProducts(Array.isArray(productData) ? productData : []);
            } else {
              throw new Error(`Failed to fetch products: ${productsRes.statusText}`);
            }
        } else if (productsRes === null) {
             throw new Error("Failed to connect to the products API.");
        }
         else {
             throw new Error("Products fetch did not return a valid Response object");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "An unexpected error occurred while fetching data.");
        setProducts([]);
        setRecentOrders([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // --- Helper Functions (Using Intl.NumberFormat) ---
  const formatCurrency = (amount: number | null | undefined): string => {
    if (typeof amount !== 'number') {
      return 'N/A';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

   const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": case "delivered": return "bg-green-100 text-green-800";
      case "processing": case "paid": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // --- Filtering Logic (Keep as is) ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(lowerSearchTerm) ||
        product.category?.toLowerCase().includes(lowerSearchTerm) ||
        product.skuId?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [products, searchTerm]);

  // --- Tab Definitions (Keep as is) ---
   const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
  ];


  // --- Render Loading/Error States ---
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
       <div className="w-full h-full bg-red-50 flex items-center justify-center p-4">
         <div className="bg-white p-6 rounded-lg shadow-md text-center">
           <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
           <p className="text-gray-600">{error}</p>
         </div>
       </div>
     );
   }


  // --- Main Render (Restructured) ---
  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Manage products, orders, and customers." />
      </Helmet>

      {/* NEW ROOT: Fills the h-screen <main> from AdminLayout */}
      <div className="w-full h-full flex flex-col bg-gray-50">

        {/* --- FIXED HEADER AREA --- */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your store efficiently</p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="flex space-x-8 p-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* --- END OF FIXED HEADER --- */}


        {/* --- SCROLLING CONTENT AREA --- */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* --- Products Tab Content (Restructured) --- */}
            {activeTab === "products" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden" // Added overflow-hidden
              >
                {/* Header and Search (Layout matches AdminProducts.tsx) */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Products
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {searchTerm
                        ? `Showing ${filteredProducts.length} of ${products.length} total products`
                        : `Total products: ${products.length}`
                      }
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                    <Link
                      to="/admin/products/add" // Make sure this route exists
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 text-sm whitespace-nowrap w-full sm:w-auto justify-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </Link>
                  </div>
                </div>

                {/* Products Table (Padding updated) */}
                <div className="overflow-x-auto">
                  {filteredProducts.length > 0 ? (
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            In Stock
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            SKU
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {/* Using thumbnail with adjusted size */}
                                <ProductThumbnail product={product} className="w-12 h-12" />
                                <div className="ml-3 sm:ml-4">
                                  <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-sm" title={product.name}>
                                    {product.name || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              {product.category || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {/* Changed Yes/No to In Stock/Out of Stock */}
                              <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                              {product.skuId || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  to={`/admin/products/edit/${product._id}`}
                                  className="text-primary-600 hover:text-primary-800 p-1 rounded hover:bg-primary-50 transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                {/* Delete button is removed here as per AdminProducts.tsx */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-10 px-4">
                      <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        No products found{searchTerm ? ` matching "${searchTerm}"` : ''}.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- Render other Tabs --- */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="text-center p-10 bg-white rounded-xl shadow-lg">
                Overview Tab Content Goes Here
              </motion.div>
            )}
            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="text-center p-10 bg-white rounded-xl shadow-lg">
                Orders Tab Content Goes Here
              </motion.div>
            )}
            {activeTab === "customers" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="text-center p-10 bg-white rounded-xl shadow-lg">
                Customers Tab Content Goes Here
              </motion.div>
            )}
          </div>
        </div>
        {/* --- END OF SCROLLING CONTENT --- */}

      </div>
    </>
  );
};

export default Dashboard;