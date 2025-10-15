import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from '../Cart/CartSidebar';
import WishlistSidebar from '../Wishlist/WishlistSidebar';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const { isCartOpen, toggleCart } = useCartStore();
  const { isWishlistOpen, toggleWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Floating WhatsApp Widget */}
      <motion.a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <FaWhatsapp className="w-6 h-6" />
      </motion.a>
      {/* Sidebars - always render, let them handle their own visibility */}
      <CartSidebar onClose={toggleCart} />
      <WishlistSidebar onClose={toggleWishlist} />
    </div>
  );
};

export default Layout;