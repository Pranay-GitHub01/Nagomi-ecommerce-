import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/Product/ProductCard';
import { Product } from '../types';
import { API_BASE_URL } from '../api/config';

const Bestsellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => setProducts(data));
  }, []);

  const bestsellers = products.filter(product => product.bestseller);

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-5xl font-bold text-blue-900 mb-10 text-center font-seasons"
      >
        Bestsellers
      </motion.h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {bestsellers.length === 0 ? (
          <div className="col-span-full text-center text-blue-700 text-xl">No bestsellers found.</div>
        ) : (
          bestsellers.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Bestsellers;