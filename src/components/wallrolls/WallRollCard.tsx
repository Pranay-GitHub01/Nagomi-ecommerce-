import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types'; // Re-using the same Product type
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useAuthStore } from '../../stores/useAuthStore';

interface WallRollCardProps {
  product: Product;
}

const WallRollCard: React.FC<WallRollCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
  const { user } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [showWishlistToast, setShowWishlistToast] = useState(false);

  // Check wishlist status on mount (same logic as ProductCard)
  useEffect(() => {
    const checkStatus = async () => {
      const productId = product._id || product.id;
      if (!productId) return;
      
      if (user) {
        setIsLoadingWishlist(true);
        try {
          const status = await checkWishlistStatus(productId);
          setIsWishlisted(status);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        } finally {
          setIsLoadingWishlist(false);
        }
      } else {
        setIsWishlisted(isInWishlist(productId));
      }
    };

    checkStatus();
  }, [user, product._id, product.id, checkWishlistStatus, isInWishlist]);

  // Handle wishlist toggle (same logic as ProductCard)
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product._id || product.id;
    if (!productId) return;

    setIsLoadingWishlist(true);
    if (!user) {
      if (!isWishlisted) {
        setIsWishlisted(true);
        await addToWishlist(product);
        setShowWishlistToast(true);
        setTimeout(() => setShowWishlistToast(false), 2000);
      } else {
        setIsWishlisted(false);
        await removeFromWishlist(productId);
      }
      setIsLoadingWishlist(false);
      return;
    }
    
    if (isWishlisted) {
      setIsWishlisted(false);
      removeFromWishlist(productId).catch(() => setIsWishlisted(true))
        .finally(() => setIsLoadingWishlist(false));
    } else {
      setIsWishlisted(true);
      addToWishlist(product).catch(() => setIsWishlisted(false))
        .finally(() => setIsLoadingWishlist(false));
    }
  };

  // Image fallback logic (same as ProductCard)
  const candidates: string[] = (() => {
    const urls: string[] = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      const raw = product.images[0] || '';
      if (raw) {
        if (raw.startsWith('http')) urls.push(raw);
        else if (raw.startsWith('/')) urls.push(raw);
        else urls.push(`/images/${raw.split('/').pop() || raw}`);
      }
    }
    const sku = (product as any).skuId;
    if (sku) {
      const base = String(sku).replace(/-WP$/i, '');
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${sku}.${ext}`));
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${base}.${ext}`));
    }
    urls.push('/placeholder.jpg');
    return urls;
  })();

  const [imgSrc, setImgSrc] = useState<string>(candidates[0]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setImgSrc(candidates[0]);
    setCandidateIndex(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id, product.id]);

  const handleImgError = () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidates.length) {
      setCandidateIndex(nextIndex);
      setImgSrc(candidates[nextIndex]);
    }
  };

  // Helper to format price correctly
  const formatPrice = (price: string | number | null | undefined) => {
    if (price === null || price === undefined) return null;
    const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g,"")) : price;
    if (isNaN(numericPrice)) return null;
    return `₹${numericPrice.toLocaleString('en-IN')}`;
  };

  const displayPrice = formatPrice(product.price);
  const displayOriginalPrice = formatPrice(product.originalPrice);

  return (
    <>
      {showWishlistToast && (
        <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          Added to wishlist!
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        whileHover={{ y: -8, scale: 1.03 }}
        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-100 h-full flex flex-col"
      >
        {/* MODIFIED: Link points to the /wallroll/ route */}
        <Link to={`/wallroll/${product._id || product.id}`} className="block flex flex-col h-full">
          <div className="relative overflow-hidden">
            <motion.img
              src={imgSrc}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              whileHover={{ scale: 1.12 }}
              onError={handleImgError}
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.bestseller && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse">
                  Bestseller
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Sale
                </span>
              )}
            </div>
            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              disabled={isLoadingWishlist}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
              } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-[#172b9b] mb-2 line-clamp-2 flex-grow">{product.name}</h3>
            {/* MODIFIED: Dynamic pricing display */}
            <div className="flex items-baseline gap-2 mt-2">
              {displayPrice && <p className="font-bold text-lg text-[#1428a0]">{displayPrice}</p>}
              {displayOriginalPrice && <p className="font-semibold text-sm text-gray-400 line-through">{displayOriginalPrice}</p>}
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default WallRollCard;