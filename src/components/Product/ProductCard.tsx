import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useAuthStore } from '../../stores/useAuthStore';


interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
  const { user } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  // Simple toast for unauthenticated wishlist
  const [showWishlistToast, setShowWishlistToast] = useState(false);

  // Check wishlist status on mount
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
        // For non-logged in users, check local state
        setIsWishlisted(isInWishlist(productId));
      }
    };

    checkStatus();
  }, [user, product._id, product.id, checkWishlistStatus, isInWishlist]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product._id || product.id;
    if (!productId) return;

    setIsLoadingWishlist(true);
    if (!user) {
      // Unauthenticated: use localStorage wishlist
      if (!isWishlisted) {
        setIsWishlisted(true); // Optimistic update
        await addToWishlist(product);
        setShowWishlistToast(true);
        setTimeout(() => setShowWishlistToast(false), 2000);
      } else {
        setIsWishlisted(false); // Optimistic update
        await removeFromWishlist(productId);
      }
      setIsLoadingWishlist(false);
      return;
    }
    // Authenticated: use API
    if (isWishlisted) {
      setIsWishlisted(false); // Optimistic update
      removeFromWishlist(productId).catch((error) => {
        setIsWishlisted(true); // Revert if error
        console.error('Error removing from wishlist:', error);
      }).finally(() => setIsLoadingWishlist(false));
    } else {
      setIsWishlisted(true); // Optimistic update
      addToWishlist(product).catch((error) => {
        setIsWishlisted(false); // Revert if error
        console.error('Error adding to wishlist:', error);
      }).finally(() => setIsLoadingWishlist(false));
    }
  };

  // Image source with local /images fallbacks based on SKU and provided image paths
  const candidates: string[] = (() => {
    const urls: string[] = [];
    // If product provides images, normalize first one
    if (Array.isArray(product.images) && product.images.length > 0) {
      const raw = product.images[0] || '';
      if (raw) {
        if (raw.startsWith('http://') || raw.startsWith('https://')) urls.push(raw);
        else if (raw.startsWith('@images/')) urls.push(`/images/${raw.substring('@images/'.length)}`);
        else if (raw.startsWith('images/')) urls.push(`/images/${raw.substring('images/'.length)}`);
        else if (raw.startsWith('/images/')) urls.push(raw);
        else if (raw.startsWith('@uploads/')) urls.push(`/uploads/${raw.substring('@uploads/'.length)}`);
        else if (raw.startsWith('uploads/')) urls.push(`/uploads/${raw.substring('uploads/'.length)}`);
        else if (raw.startsWith('/uploads/')) urls.push(raw);
        else if (raw.startsWith('/')) urls.push(raw);
        else urls.push(`/images/${raw.split('/').pop() || raw}`);
      }
    }
    const sku = (product as any).skuId || (product as any).sku || (product as any).SKU || (product as any).sku_id;
    if (sku) {
      const base = String(sku).replace(/-WP$/i, '');
      const raw = String(sku);
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${raw}.${ext}`));
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${base}.${ext}`));
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${base}-WP.${ext}`));
      for (let i = 1; i <= 6; i++) {
        ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${i}-${base}-WP.${ext}`));
      }
      for (let i = 1; i <= 6; i++) {
        ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${base}-${i}.${ext}`));
      }
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

  // Debug log
  console.log('ProductCard:', product.name, imgSrc);



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
        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-100"
      >
        <Link to={`/wallpapers/${product._id || product.id}`} className="block">
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
          <div className="p-4">
            <h3 className="font-bold text-[#172b9b] mb-2 line-clamp-2">{product.name}</h3>
            <p className="font-bold italic text-[#545454]">
              <span className="font-bold italic text-[#545454] line-through">₹119</span> ₹99 per square feet
            </p>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default ProductCard;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Heart } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Product } from '../../types';
// import { useWishlistStore } from '../../stores/useWishlistStore';
// import { useAuthStore } from '../../stores/useAuthStore';

// interface ProductCardProps {
//   product: Product;
//   showBadge?: boolean; // Prop from redesigns is now included and optional
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge }) => {
//   const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
//   const { user } = useAuthStore();
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
//   const [showWishlistToast, setShowWishlistToast] = useState(false);

//   // Check wishlist status on mount
//   useEffect(() => {
//     const checkStatus = async () => {
//       const productId = product._id || product.id;
//       if (!productId) return;
      
//       if (user) {
//         setIsLoadingWishlist(true);
//         try {
//           const status = await checkWishlistStatus(productId);
//           setIsWishlisted(status);
//         } catch (error) {
//           console.error('Error checking wishlist status:', error);
//         } finally {
//           setIsLoadingWishlist(false);
//         }
//       } else {
//         setIsWishlisted(isInWishlist(productId));
//       }
//     };

//     checkStatus();
//   }, [user, product._id, product.id, checkWishlistStatus, isInWishlist]);

//   const handleWishlistToggle = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const productId = product._id || product.id;
//     if (!productId) return;

//     setIsLoadingWishlist(true);
//     if (!user) {
//       if (!isWishlisted) {
//         setIsWishlisted(true);
//         await addToWishlist(product);
//         setShowWishlistToast(true);
//         setTimeout(() => setShowWishlistToast(false), 3000);
//       } else {
//         setIsWishlisted(false);
//         await removeFromWishlist(productId);
//       }
//       setIsLoadingWishlist(false);
//       return;
//     }

//     if (isWishlisted) {
//       setIsWishlisted(false);
//       removeFromWishlist(productId).catch(() => setIsWishlisted(true))
//         .finally(() => setIsLoadingWishlist(false));
//     } else {
//       setIsWishlisted(true);
//       addToWishlist(product).catch(() => setIsWishlisted(false))
//         .finally(() => setIsLoadingWishlist(false));
//     }
//   };

//   // Complex image fallback logic from your file is preserved
//   const candidates: string[] = (() => {
//     const urls: string[] = [];
//     if (Array.isArray(product.images) && product.images.length > 0) {
//       const raw = product.images[0] || '';
//       if (raw) {
//         if (raw.startsWith('http')) urls.push(raw);
//         else urls.push(`/images/${raw.split('/').pop() || raw}`);
//       }
//     }
//     const sku = (product as any).skuId;
//     if (sku) {
//       const base = String(sku).replace(/-WP$/i, '');
//       ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${sku}.${ext}`));
//       ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`/images/${base}.${ext}`));
//     }
//     urls.push('/placeholder.jpg');
//     return Array.from(new Set(urls)); // Ensure unique candidates
//   })();

//   const [imgSrc, setImgSrc] = useState<string>(candidates[0]);
//   const [candidateIndex, setCandidateIndex] = useState(0);

//   useEffect(() => {
//     setImgSrc(candidates[0]);
//     setCandidateIndex(0);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [product._id, product.id]);

//   const handleImgError = () => {
//     const nextIndex = candidateIndex + 1;
//     if (nextIndex < candidates.length) {
//       setCandidateIndex(nextIndex);
//       setImgSrc(candidates[nextIndex]);
//     }
//   };

//   // MERGED LOGIC: Prioritize `showBadge` prop, but fall back to `product.bestseller`
//   const shouldDisplayBestseller = typeof showBadge === 'boolean' ? showBadge : product.bestseller;

//   return (
//     <>
//       {showWishlistToast && (
//         <div className="fixed top-20 right-6 z-[100] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
//           Added to wishlist!
//         </div>
//       )}
//       <motion.div
//         layout
//         whileHover={{ y: -8 }}
//         className="group bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300 border border-blue-100"
//       >
//         <Link to={`/wallpapers/${product._id || product.id}`} className="block h-full flex flex-col">
//           <div className="relative overflow-hidden">
//             <motion.img
//               src={imgSrc}
//               alt={product.name}
//               className="w-full h-56 object-cover"
//               onError={handleImgError}
//               transition={{ duration: 0.5 }}
//               initial={false}
//             />
//             <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

//             <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
//               {shouldDisplayBestseller && (
//                 <span className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
//                   Bestseller
//                 </span>
//               )}
//               {product.originalPrice && (
//                 <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
//                   Sale
//                 </span>
//               )}
//             </div>
            
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={handleWishlistToggle}
//               disabled={isLoadingWishlist}
//               className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
//                 isWishlisted 
//                   ? 'bg-blue-600 text-white' 
//                   : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
//               } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
//               aria-label="Toggle Wishlist"
//             >
//               <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
//             </motion.button>
//           </div>
//           <div className="p-4 flex flex-col flex-grow">
//             <h3 className="font-bold text-[#172b9b] text-base font-seasons line-clamp-2 flex-grow">
//               {product.name}
//             </h3>
//             <div className="mt-4 flex items-baseline justify-between">
//               <p className="font-bold text-[#1428a0] text-lg">
//                 ₹{product.price}
//                 <span className="text-sm font-normal text-gray-500"> / sq ft</span>
//               </p>
//               {product.originalPrice && (
//                   <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
//               )}
//             </div>
//           </div>
//         </Link>
//       </motion.div>
//     </>
//   );
// };

// export default ProductCard;