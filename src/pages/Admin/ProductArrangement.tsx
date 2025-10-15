import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';

const initialProducts = [
  { id: '1', name: 'Botanical Bliss' },
  { id: '2', name: 'Bahama Breeze' },
  { id: '3', name: 'Midnight Garden' },
  { id: '4', name: 'Minimalist Zen' },
];

const ProductArrangement: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [featured, setFeatured] = useState<string[]>(['1', '3']);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold text-primary-700 mb-6">Product Arrangement</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Drag & Drop Product Order</h2>
          <Reorder.Group axis="y" values={products} onReorder={setProducts} className="space-y-2">
            {products.map((product) => (
              <Reorder.Item key={product.id} value={product} className="bg-primary-50 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm">
                <span>{product.name}</span>
                <span className="text-xs text-gray-400">Drag</span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Collections</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span>{product.name}</span>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${featured.includes(product.id) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`}
                  onClick={() => setFeatured(f => f.includes(product.id) ? f.filter(id => id !== product.id) : [...f, product.id])}
                >
                  {featured.includes(product.id) ? 'Featured' : 'Set as Featured'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductArrangement; 