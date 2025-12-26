import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types'; 
import { API_BASE_URL } from '../api/config';
import { Loader2, ServerCrash } from 'lucide-react';
import { Link } from "react-router-dom";
import { CgProductHunt } from 'react-icons/cg';

// --- Helper: Get Image URL ---
const getImageUrl = (images?: string[]) => {
  const img = images?.[0]; 
  if (!img) return '/images/placeholder.png'; 
  if (img.startsWith('http')) return img;
  return `${API_BASE_URL.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
};

// --- ProductCard Component ---
type ProductCardProps = { product: Product };

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const initialImage = getImageUrl(product.images);
  const [imgSrc, setImgSrc] = useState<string>(initialImage);

  useEffect(() => {
    setImgSrc(getImageUrl(product.images));
  }, [product.images]);

  const handleImageError = () => {
    setImgSrc('/images/placeholder.png');
  };

  const productLink = `/${product.category}/${product._id || product.id}`;

  return (
    <Link to={productLink} className="h-full block">
      <motion.div
        layout
        whileHover={{ scale: 1.03 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full"
      >
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name || 'product'}
            onError={handleImageError}
            className="object-cover h-full w-full"
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-sm md:text-base font-semibold text-blue-900 mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
            {product.description}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-blue-800">
              ₹{product.price?.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
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

  const bestsellers = useMemo(() => products.filter(product => product.bestseller), [products]);

  const filteredBestsellers = useMemo(() => {
    if (selectedCategory === 'All') {
      return bestsellers;
    }
    return bestsellers.filter(product => (product.category || 'Other') === selectedCategory);
  }, [bestsellers, selectedCategory]);

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
      <ProductCard key={product._id || product.id} product={product} />
    ));
  };

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

      {/* --- VIDEO BANNER PLACEHOLDER START --- */}
      {/* INSTRUCTIONS:
          Replace the inner <div> below with your <video> or <iframe> tag.
          Example:
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="/your-video.mp4" type="video/mp4" />
          </video>
      */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-1/2 max-w-auto mx-auto h-[400px] md:h-[20vh] fitcontent bg-gray-200 rounded-2xl mb-12 overflow-hidden shadow-lg relative border border-gray-100"
      >
        <video
          autoPlay
          muted
          playsInline
          // loop={false} // Removed loop so it plays only once
          className="w-full h-full object-cover"
        >
          {/* UPDATE THIS PATH TO YOUR ACTUAL VIDEO FILE */}
          <source src="/home vdos/BestSellerBanner.MP4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
      {/* --- VIDEO BANNER PLACEHOLDER END --- */}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {renderContent()}
      </div>
    </div>
  );
};

export default Bestsellers;