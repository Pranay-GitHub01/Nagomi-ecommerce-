import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
// We'll assume the Product type uses 'images' (plural) like your other files
import { Product } from '../types'; 
import { API_BASE_URL } from '../api/config';
import { Loader2, ServerCrash } from 'lucide-react';
import {Link} from "react-router-dom"

// --- Helper: Get Image URL ---
// This logic is from your pasted code, but I've changed 'product.image'
// to 'product.images' to match your other components (like Products.tsx).
// This consistency is important.
const getImageUrl = (images?: string[]) => {
  const img = images?.[0]; // Use the first image from the 'images' array
  if (!img) return '/images/placeholder.png'; // Fallback path
  if (img.startsWith('http')) return img;
  return `${API_BASE_URL.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
};




// --- ProductCard Component ---
// MOVED OUTSIDE of Bestsellers component to fix "fluctuating"
type ProductCardProps = { product: Product };

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use 'images' (plural) to match your other files
  const imageUrl = getImageUrl(product.images); 
const handleImageError = () => {
    setImgSrc('/images/placeholder.png');
  };
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full"
    >
      <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
           
        
        <img
          src={imageUrl}
        
          alt={product.name || 'product'}
          onError={handleImageError}
          // Changed to object-cover to fill the space, 'contain' can look empty
          className="object-cover h-full w-full"
        />
       
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm md:text-base font-semibold text-blue-900 mb-2">{product.name}</h3>
        {/* Use a line-clamp for consistent height, even if description is short */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-blue-800">
            {/* Format price to show currency */}
            ₹{product.price?.toFixed(2)}
          </span>
         
        </div>
      </div>
    </motion.div>
  );
};



// --- Bestsellers Page Component ---
const Bestsellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch data");
        return r.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        // Derive categories from *all* products (or just bestsellers)
        const bestsellerProducts = data.filter(product => product.bestseller);
        const bestsellerCategories = new Set(bestsellerProducts.map(p => p.category || 'Other'));
        setCategories(['All', ...Array.from(bestsellerCategories)]);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "An unknown error occurred");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter for bestsellers first
  const bestsellers = useMemo(() => products.filter(product => product.bestseller), [products]);

  // Then, filter by category
  const filteredBestsellers = useMemo(() => {
    if (selectedCategory === 'All') {
      return bestsellers;
    }
    return bestsellers.filter(product => (product.category || 'Other') === selectedCategory);
  }, [bestsellers, selectedCategory]);


  // Helper for rendering content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-blue-900">
          <Loader2 className="w-12 h-12 animate-spin" />
          <span className="mt-4 text-xl font-seasons">Loading Bestsellers...</span>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-red-600">
          <ServerCrash className="w-12 h-12" />
          <span className="mt-4 text-xl font-seasons">Failed to load products</span>
        </div>
      );
    }

    if (filteredBestsellers.length === 0) {
      return (
        <div className="col-span-full text-center py-20 text-blue-800">
          <span className="text-xl font-seasons">No bestsellers found.</span>
        </div>
      );
    }

    return filteredBestsellers.map((product) => (
      // Use the robust key from your other files
      <ProductCard key={product._id || product.id} product={product} />
    ));
  };

const productLink = `${products.category}/${products._id || products.id}`;
console.log("Product Link:", productLink);

  return (

    <div className="min-h-screen bg-[#f7f8fa] py-12 px-4">
    
     

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-5xl font-bold text-blue-900 mb-8 text-center font-seasons"
      >
        Bestsellers
      </motion.h1>

      {/* --- Category Filter Section --- */}
      {!loading && !error && categories.length > 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10 md:mb-12 px-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                ${
                  selectedCategory === category
                    ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                    : 'bg-white text-blue-800 border-blue-300 hover:bg-blue-50 hover:border-blue-500'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>
      )}

      {/* --- Product Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        
          {renderContent()}
        
      
      </div>
           
    </div>
  );
};

export default Bestsellers;