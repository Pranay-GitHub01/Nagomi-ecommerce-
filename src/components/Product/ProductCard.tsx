// // src/components/Product/ProductCard.tsx

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Heart, Loader2, ImageOff } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { Product } from '../../types'; // Adjust path as needed
// import { useWishlistStore } from '../../stores/useWishlistStore'; // Adjust path as needed
// import { useAuthStore } from '../../stores/useAuthStore'; // Adjust path as needed
// import { API_BASE_URL } from '../../api/config'; // Make sure this is imported and correct


// interface ProductCardProps {
//   // Accept the 'displayImageSrc' prop calculated by Products.tsx
//   product: Product & { displayImageSrc?: string };
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
//   const { user } = useAuthStore();
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
//   const [showWishlistToast, setShowWishlistToast] = useState(false);

//   // --- State for Image Loading & Error ---
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const [imageLoadError, setImageLoadError] = useState(false);

//   // --- Construct the FULL image source URL ---
//   const relativeImgSrc = product.displayImageSrc;
//   let finalImgSrc = '/placeholder.jpg'; // Default placeholder

//   if (relativeImgSrc) {
//     if (relativeImgSrc.startsWith('http')) {
//       // If displayImageSrc is already an absolute URL, use it directly
//       finalImgSrc = relativeImgSrc;
//     } else if (relativeImgSrc.startsWith('/')) {
//       // If it's a root-relative path (like /images/...), prepend API_BASE_URL
//       // Ensure no double slashes if API_BASE_URL ends with / and relativeImgSrc starts with /
//       const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
//       finalImgSrc = `${baseUrl}${relativeImgSrc}`;
//     }
//      // Optional: Handle cases where relativeImgSrc might be just a filename
//      // else { finalImgSrc = `${API_BASE_URL}/${relativeImgSrc}`; }
//   }
//   // Uncomment for debugging:
//   // console.log(`Product: ${product.name}, Final Image Src: ${finalImgSrc}`);

//   // --- Simplified useEffect ---
//   // Reset loading/error state when the final URL changes.
//   useEffect(() => {
//     setIsImageLoading(true);
//     setImageLoadError(false);
//   }, [finalImgSrc]); // Dependency is now the fully constructed URL

//   // --- Image Load/Error Handlers ---
//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//     setImageLoadError(false);
//   };

//   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//     console.error(`Image Error: Failed to load ${finalImgSrc}`, e); // Log the error and the URL
//     setIsImageLoading(false);
//     setImageLoadError(true);
//   };

//   // --- Effect to check Wishlist Status ---
//   useEffect(() => {
//     const checkStatus = async () => {
//       const productId = product._id || product.id;
//       if (!productId) return;

//       if (user) { // Logged-in user
//         setIsLoadingWishlist(true);
//         try {
//           // Use the async check function from the store
//           const status = await checkWishlistStatus(productId);
//           setIsWishlisted(status);
//         } catch (error) {
//           console.error('Error checking wishlist status:', error);
//           // Optionally fallback to local check or set false
//           setIsWishlisted(isInWishlist(productId));
//         } finally {
//           setIsLoadingWishlist(false);
//         }
//       } else { // Guest user
//         setIsWishlisted(isInWishlist(productId));
//         setIsLoadingWishlist(false); // Ensure loading stops for guests
//       }
//      };
//     checkStatus();
//   }, [user, product._id, product.id, checkWishlistStatus, isInWishlist]);


//   // --- Wishlist Toggle Handler ---
//   const handleWishlistToggle = async (e: React.MouseEvent) => {
//       e.preventDefault(); // Prevent link navigation
//     e.stopPropagation(); // Stop event bubbling
//     const productId = product._id || product.id;
//     if (!productId) return;

//     setIsLoadingWishlist(true);

//     // Guest User Logic (using local storage via Zustand)
//     if (!user) {
//       if (isWishlisted) {
//         await removeFromWishlist(productId); // Assumes store handles localStorage
//         setIsWishlisted(false);
//       } else {
//         await addToWishlist(product); // Assumes store handles localStorage
//         setIsWishlisted(true);
//         // Optional: Show toast for guests
//         setShowWishlistToast(true);
//         setTimeout(() => setShowWishlistToast(false), 2000);
//       }
//       setIsLoadingWishlist(false);
//       return;
//     }

//     // Logged-in User Logic (using API via Zustand actions)
//     try {
//       if (isWishlisted) {
//         await removeFromWishlist(productId); // Store action calls API
//         setIsWishlisted(false);
//       } else {
//         await addToWishlist(product); // Store action calls API
//         setIsWishlisted(true);
//       }
//     } catch (error) {
//       console.error("Failed to toggle wishlist via API:", error);
//       // Optional: Revert UI state or show error to user
//       // setIsWishlisted(!isWishlisted); // Revert optimistic update on failure
//     } finally {
//       setIsLoadingWishlist(false);
//     }
//    };

//   // Determine price display
//   const displayPrice = product.price ?? 0;
//   const displayOriginalPrice = product.originalPrice ?? 0;
//   const hasOriginalPrice = displayOriginalPrice > 0 && displayOriginalPrice > displayPrice;

//   // Determine link target (Example - Adjust as needed)
//   // const detailLink = `/product/${product._id || product.id}`;

//   return (
//     <>
// <Link to={ `/${product.category}/${product._id || product.id}` }>
//       {/* Wishlist Toast Notification */}
//       {showWishlistToast && (
//         <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
//           Added to wishlist!
//         </div>
//       )}

//       {/* Main Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.2 }}
//         whileHover={{ y: -6, scale: 1.02 }}
//         className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-150 h-full flex flex-col border border-gray-100"
//       >
//         {/* Link Wrapper (Uncomment and adjust 'to' prop if needed) */}
//         {/* <Link to={detailLink} className="block flex flex-col h-full"> */}

//           {/* Image Container */}
//           <div className="relative overflow-hidden w-full h-64 bg-gray-100">

//             {/* 1. Loader: Show only while loading AND no error */}
//             {isImageLoading && !imageLoadError && (
//               <div className="absolute inset-0 flex items-center justify-center z-0">
//                 <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                
//               </div>
//             )}

//             {/* 2. Error Placeholder: Show if error occurred (and not loading) */}
//             {imageLoadError && !isImageLoading && (
//                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center z-0">
//                  <ImageOff className="w-10 h-10 mb-2" />
//                  <span className="text-xs">Image unavailable</span>
//                </div>
//             )}

//             {/* 3. Image --- USES finalImgSrc --- */}
//             <motion.img
//               key={finalImgSrc} // Use the full URL as key
//               src={finalImgSrc} // Use the full URL as src
//               alt={product.name || 'Product Image'}
//               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 ${
//                 !isImageLoading && !imageLoadError ? 'opacity-100' : 'opacity-0'
//               }`}
//               onLoad={handleImageLoad}
//               onError={handleImageError} // Added error logging here
//               loading="lazy"
//             />

//             {/* Badges */}
//             <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
//               {product.bestseller && (
//                 <span className="bg-[#172b9b] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold shadow">
//                   Bestseller
//                 </span>
//               )}
//               {/* {hasOriginalPrice && (
//                 <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold shadow">
//                   Sale
//                 </span>
//               )} */}
//             </div>

//             {/* Wishlist Button */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={handleWishlistToggle}
//               disabled={isLoadingWishlist}
//               className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
//                 isWishlisted
//                   ? 'bg-red-500 text-white hover:bg-red-600'
//                   : 'bg-white/70 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500'
//               } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
//               aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//             >
//                {isLoadingWishlist ? (
//                   <Loader2 className="w-5 h-5 animate-spin"/>
//                ) : (
//                   <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
//                )}
//             </motion.button>
//           </div>

//           {/* Card Content */}
//           <div className="p-4 flex flex-col flex-grow">
//             <h3 className="font-semibold text-base text-[#172b9b] mb-2 line-clamp-2 flex-grow">
//               {product.name || 'Untitled Product'}
//             </h3>
//             <div className="mt-auto pt-1 flex items-baseline justify-between gap-2">
//               <p className="font-bold text-[#1428a0] text-lg">
//                  ₹{displayPrice.toLocaleString('en-IN')}
//                  {(product.category?.toLowerCase() === 'wallpaper' || product.category?.toLowerCase() === 'wall-art') && (
//                     <span className="text-xs font-normal text-gray-500"> / sq.ft</span>
//                  )}
//               </p>
//               {hasOriginalPrice && (
//                   <span className="text-sm text-gray-400 line-through">
//                       ₹{displayOriginalPrice.toLocaleString('en-IN')}
//                   </span>
//               )}
//             </div>
//           </div>

//         {/* Closing Link Wrapper (if used) */}
//         {/* </Link> */}
//       </motion.div>
//        </Link>
//     </>
//   );
// };

// export default ProductCard;

// src/components/Product/ProductCard.tsx




// //currently using this layout for ProductCard.tsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Heart, Loader2, ImageOff, PlayCircle } from 'lucide-react'; // Added PlayCircle icon
// import { Link } from 'react-router-dom';
// import { Product } from '../../types'; 
// import { useWishlistStore } from '../../stores/useWishlistStore'; 
// import { useAuthStore } from '../../stores/useAuthStore'; 
// import { API_BASE_URL } from '../../api/config'; 

// interface ProductCardProps {
//   product: Product & { displayImageSrc?: string };
// }

// // --- Helper: Extract YouTube Video ID ---
// const getYouTubeVideoId = (url: string) => {
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//   const match = url.match(regExp);
//   return (match && match[2].length === 11) ? match[2] : null;
// };

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
//   const { user } = useAuthStore();
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
//   const [showWishlistToast, setShowWishlistToast] = useState(false);

//   // --- State for Image Loading & Error ---
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const [imageLoadError, setImageLoadError] = useState(false);

//   // --- Construct the FULL image/video source URL ---
//   const relativeImgSrc = product.displayImageSrc;
//   let finalImgSrc = '/placeholder.jpg'; 

//   if (relativeImgSrc) {
//     if (relativeImgSrc.startsWith('http')) {
//       finalImgSrc = relativeImgSrc;
//     } else if (relativeImgSrc.startsWith('/')) {
//       const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
//       finalImgSrc = `${baseUrl}${relativeImgSrc}`;
//     }
//   }

//   // --- Check if the source is a YouTube Video ---
//   const isYoutubeVideo = finalImgSrc.toLowerCase().includes('youtube.com') || finalImgSrc.toLowerCase().includes('youtu.be');
//   let videoEmbedUrl = null;

//   if (isYoutubeVideo) {
//     const videoId = getYouTubeVideoId(finalImgSrc);
//     if (videoId) {
//       // Params: autoplay=1 (play auto), mute=1 (required for auto), loop=1 (repeat), controls=0 (clean look)
//       videoEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
//     }
//   }

//   // --- Reset loading state when URL changes ---
//   useEffect(() => {
//     setIsImageLoading(true);
//     setImageLoadError(false);
//   }, [finalImgSrc]);

//   // --- Image Handlers ---
//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//     setImageLoadError(false);
//   };

//   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//     if (!isYoutubeVideo) { // Only log error if it's not a video (videos are handled by iframe)
//         console.error(`Image Error: Failed to load ${finalImgSrc}`, e);
//         setImageLoadError(true);
//     }
//     setIsImageLoading(false);
//   };

//   // --- Wishlist Status Check (Keep existing logic) ---
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
//           setIsWishlisted(isInWishlist(productId));
//         } finally {
//           setIsLoadingWishlist(false);
//         }
//       } else { 
//         setIsWishlisted(isInWishlist(productId));
//         setIsLoadingWishlist(false);
//       }
//      };
//     checkStatus();
//   }, [user, product._id, product.id, checkWishlistStatus, isInWishlist]);

//   // --- Wishlist Toggle Handler (Keep existing logic) ---
//   const handleWishlistToggle = async (e: React.MouseEvent) => {
//     e.preventDefault(); 
//     e.stopPropagation(); 
//     const productId = product._id || product.id;
//     if (!productId) return;

//     setIsLoadingWishlist(true);

//     if (!user) {
//       if (isWishlisted) {
//         await removeFromWishlist(productId);
//         setIsWishlisted(false);
//       } else {
//         await addToWishlist(product);
//         setIsWishlisted(true);
//         setShowWishlistToast(true);
//         setTimeout(() => setShowWishlistToast(false), 2000);
//       }
//       setIsLoadingWishlist(false);
//       return;
//     }

//     try {
//       if (isWishlisted) {
//         await removeFromWishlist(productId);
//         setIsWishlisted(false);
//       } else {
//         await addToWishlist(product);
//         setIsWishlisted(true);
//       }
//     } catch (error) {
//       console.error("Failed to toggle wishlist via API:", error);
//     } finally {
//       setIsLoadingWishlist(false);
//     }
//    };

//   const displayPrice = product.price ?? 0;
//   const displayOriginalPrice = product.originalPrice ?? 0;
//   const hasOriginalPrice = displayOriginalPrice > 0 && displayOriginalPrice > displayPrice;

//   return (
//     <>
//       <Link to={`/${product.category}/${product._id || product.id}`}>
//         {showWishlistToast && (
//           <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
//             Added to wishlist!
//           </div>
//         )}

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2 }}
//           whileHover={{ y: -6, scale: 1.02 }}
//           className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-150 h-full flex flex-col border border-gray-100"
//         >
//           {/* MEDIA CONTAINER (Image or Video) */}
//           <div className="relative overflow-hidden w-full h-64 bg-gray-100">

//             {/* 1. VIDEO RENDERER */}
//             {isYoutubeVideo && videoEmbedUrl ? (
//                 <div className="absolute inset-0 w-full h-full bg-black">
//                     {/* pointer-events-none ensures clicks pass through to the Link, so the card is still clickable */}
//                     <iframe
//                         src={videoEmbedUrl}
//                         className="w-full h-full object-cover pointer-events-none scale-[1.35]" // Scale slightly to remove YouTube black bars/borders
//                         title={product.name}
//                         frameBorder="0"
//                         allow="autoplay; encrypted-media"
//                     />
//                     {/* Optional: Video Icon Overlay to indicate it's a video product */}
//                     <div className="absolute bottom-2 right-2 z-20">
//                          <PlayCircle className="w-5 h-5 text-white/80" />
//                     </div>
//                 </div>
//             ) : (
//                 /* 2. IMAGE RENDERER (Existing Logic) */
//                 <>
//                     {/* Loader */}
//                     {isImageLoading && !imageLoadError && (
//                     <div className="absolute inset-0 flex items-center justify-center z-0">
//                         <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
//                     </div>
//                     )}

//                     {/* Error Placeholder */}
//                     {imageLoadError && !isImageLoading && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center z-0">
//                         <ImageOff className="w-10 h-10 mb-2" />
//                         <span className="text-xs">Image unavailable</span>
//                     </div>
//                     )}

//                     {/* Actual Image */}
//                     <motion.img
//                         key={finalImgSrc}
//                         src={finalImgSrc}
//                         alt={product.name || 'Product Image'}
//                         className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 ${
//                             !isImageLoading && !imageLoadError ? 'opacity-100' : 'opacity-0'
//                         }`}
//                         onLoad={handleImageLoad}
//                         onError={handleImageError}
//                         loading="lazy"
//                     />
//                 </>
//             )}

//             {/* Badges */}
//             <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
//               {product.bestseller && (
//                 <span className="bg-[#172b9b] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold shadow">
//                   Bestseller
//                 </span>
//               )}
//             </div>

//             {/* Wishlist Button */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={handleWishlistToggle}
//               disabled={isLoadingWishlist}
//               className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
//                 isWishlisted
//                   ? 'bg-red-500 text-white hover:bg-red-600'
//                   : 'bg-white/70 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500'
//               } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//                {isLoadingWishlist ? (
//                   <Loader2 className="w-5 h-5 animate-spin"/>
//                ) : (
//                   <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
//                )}
//             </motion.button>
//           </div>

//           {/* Card Content (Existing) */}
//           <div className="p-4 flex flex-col flex-grow">
//             <h3 className="font-semibold text-base text-[#172b9b] mb-2 line-clamp-2 flex-grow">
//               {product.name || 'Untitled Product'}
//             </h3>
//             <div className="mt-auto pt-1 flex items-baseline justify-between gap-2">
//               <p className="font-bold text-[#1428a0] text-lg">
//                  ₹{displayPrice.toLocaleString('en-IN')}
//                  {(product.category?.toLowerCase() === 'wallpaper' || product.category?.toLowerCase() === 'wall-art') && (
//                     <span className="text-xs font-normal text-gray-500"> / sq.ft</span>
//                  )}
//               </p>
//               {hasOriginalPrice && (
//                   <span className="text-sm text-gray-400 line-through">
//                       ₹{displayOriginalPrice.toLocaleString('en-IN')}
//                   </span>
//               )}
//             </div>
//           </div>
//         </motion.div>
//        </Link>
//     </>
//   );
// };

// export default ProductCard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2, ImageOff, PlayCircle, MessageCircle } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { Product } from '../../types'; 
import { useWishlistStore } from '../../stores/useWishlistStore'; 
import { useAuthStore } from '../../stores/useAuthStore'; 
import { API_BASE_URL } from '../../api/config'; 

interface ProductCardProps {
  product: Product & { displayImageSrc?: string };
}

// --- Helper: Extract YouTube Video ID ---
const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
  const { user } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [showWishlistToast, setShowWishlistToast] = useState(false);

  // --- State for Image Loading & Error ---
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);

  // --- Construct the FULL image/video source URL ---
  const relativeImgSrc = product.displayImageSrc;
  let finalImgSrc = '/placeholder.jpg'; 

  if (relativeImgSrc) {
    if (relativeImgSrc.startsWith('http')) {
      finalImgSrc = relativeImgSrc;
    } else if (relativeImgSrc.startsWith('/')) {
      const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      finalImgSrc = `${baseUrl}${relativeImgSrc}`;
    }
  }

  // --- Check if the source is a YouTube Video ---
  const isYoutubeVideo = finalImgSrc.toLowerCase().includes('youtube.com') || finalImgSrc.toLowerCase().includes('youtu.be');
  let videoEmbedUrl = null;

  if (isYoutubeVideo) {
    const videoId = getYouTubeVideoId(finalImgSrc);
    if (videoId) {
      // Params: autoplay=1 (play auto), mute=1, loop=1, controls=0, etc.
      videoEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;
    }
  }

  // --- Reset loading state when URL changes ---
  useEffect(() => {
    setIsImageLoading(true);
    setImageLoadError(false);
  }, [finalImgSrc]);

  // --- Image Handlers ---
  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageLoadError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!isYoutubeVideo) { 
        console.error(`Image Error: Failed to load ${finalImgSrc}`, e);
        setImageLoadError(true);
    }
    setIsImageLoading(false);
  };

  // --- Wishlist Status Check ---
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
          setIsWishlisted(isInWishlist(productId));
        } finally {
          setIsLoadingWishlist(false);
        }
      } else { 
        setIsWishlisted(isInWishlist(productId));
        setIsLoadingWishlist(false);
      }
     };
    checkStatus();
  }, [user, product._id, product.id, checkWishlistStatus, isInWishlist]);

  // --- Wishlist Toggle Handler ---
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    const productId = product._id || product.id;
    if (!productId) return;

    setIsLoadingWishlist(true);

    if (!user) {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product);
        setIsWishlisted(true);
        setShowWishlistToast(true);
        setTimeout(() => setShowWishlistToast(false), 2000);
      }
      setIsLoadingWishlist(false);
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist via API:", error);
    } finally {
      setIsLoadingWishlist(false);
    }
   };

  // --- WhatsApp Order Handler ---
  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    // REPLACE WITH YOUR ACTUAL BUSINESS NUMBER
    const phoneNumber = "919999999999"; 
    const message = encodeURIComponent(
      `Hi, I am interested in this product: ${product.name} (Price: ₹${product.price})`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const displayPrice = product.price ?? 0;
  const displayOriginalPrice = product.originalPrice ?? 0;
  const hasOriginalPrice = displayOriginalPrice > 0 && displayOriginalPrice > displayPrice;

  // --- Define Card Content (Shared between both states) ---
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-150 h-full flex flex-col border border-gray-100"
    >
      {/* MEDIA CONTAINER */}
      <div className="relative overflow-hidden w-full h-64 bg-gray-100">

        {/* 1. VIDEO RENDERER */}
        {isYoutubeVideo && videoEmbedUrl ? (
            <div className="absolute inset-0 w-full h-full bg-black">
                <iframe
                    src={videoEmbedUrl}
                    className="w-full h-full object-cover scale-[1.35] pointer-events-none" 
                    title={product.name}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                />
                <div className="absolute bottom-2 right-2 z-20">
                     <PlayCircle className="w-5 h-5 text-white/80" />
                </div>
            </div>
        ) : (
            /* 2. IMAGE RENDERER */
            <>
                {isImageLoading && !imageLoadError && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
                )}

                {imageLoadError && !isImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center z-0">
                    <ImageOff className="w-10 h-10 mb-2" />
                    <span className="text-xs">Image unavailable</span>
                </div>
                )}

                <motion.img
                    key={finalImgSrc}
                    src={finalImgSrc}
                    alt={product.name || 'Product Image'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 ${
                        !isImageLoading && !imageLoadError ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
            </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && (
            <span className="bg-[#172b9b] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold shadow">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
          disabled={isLoadingWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
            isWishlisted
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/70 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500'
          } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
           {isLoadingWishlist ? (
              <Loader2 className="w-5 h-5 animate-spin"/>
           ) : (
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
           )}
        </motion.button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base text-[#172b9b] mb-2 line-clamp-2">
          {product.name || 'Untitled Product'}
        </h3>
        
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <p className="font-bold text-[#1428a0] text-lg">
              ₹{displayPrice.toLocaleString('en-IN')}
              {(product.category?.toLowerCase() === 'wallpaper' || product.category?.toLowerCase() === 'wall-art') && (
                <span className="text-xs font-normal text-gray-500"> / sq.ft</span>
              )}
          </p>
          {hasOriginalPrice && (
              <span className="text-sm text-gray-400 line-through">
                  ₹{displayOriginalPrice.toLocaleString('en-IN')}
              </span>
          )}
        </div>

        {/* Order on WhatsApp Button - ONLY FOR VIDEOS */}
        {isYoutubeVideo && (
            <div className="mt-auto pt-2 border-t border-gray-100">
                <button
                    onClick={handleOrderClick}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                    <MessageCircle size={18} />
                    Order on WhatsApp
                </button>
            </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {showWishlistToast && (
          <div className="fixed top-6 right-6 z-[100] bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
            Added to wishlist!
          </div>
      )}

      {/* CONDITIONAL LINK: Only wrap in Link if NOT a YouTube video */}
      {isYoutubeVideo ? (
        // Render Card directly for Videos (No click-through to detail page)
        <div className="h-full">
            {CardContent}
        </div>
      ) : (
        // Render Link wrapper for Images (Click-through enabled)
        <Link to={`/${product.category}/${product._id || product.id}`} className="block h-full">
            {CardContent}
        </Link>
      )}
    </>
  );
};

export default ProductCard;