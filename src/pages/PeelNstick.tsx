// // src/pages/WallRollDetail.tsx

// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   Heart,
//   Star,
//   ShoppingCart,
//   ChevronLeft,
//   ChevronRight,
//   HelpCircle,
//   ChevronDown,
//   Plus, // For quantity counter
//   Minus, // For quantity counter
//   Loader2, // For image loading
//   ImageOff // For image error
// } from 'lucide-react';
// import { Helmet } from 'react-helmet-async';
// import { useCartStore } from '../stores/useCartStore'; // Adjust path
// import { useWishlistStore } from '../stores/useWishlistStore'; // Adjust path
// import ProductCard from '../components/Product/ProductCard'; // Use ProductCard for related
// import { API_BASE_URL } from '../api/config'; // Adjust path
// import { Product } from '../types'; // Adjust path
// import { useAuthStore } from '../stores/useAuthStore'; // Adjust path
// import { FaWhatsapp } from 'react-icons/fa';

// // --- Modals ---
// // Simple Support Modal
// const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
//     if (!open) return null;
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative animate-fade-in-scale">
//                 <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
//                 <h2 className="text-xl font-semibold mb-3 text-[#172b9b] font-seasons">Need Help?</h2>
//                 <p className="mb-4 text-gray-700 font-lora">Our support team is ready to assist you!</p>
//                 <div className="flex flex-col gap-3 font-lora">
//                     <a href="mailto:support@nagomi.com" className="text-[#172b9b] underline hover:text-blue-800 transition-colors">📧 Email Support</a>
//                     <a href="tel:+919876543210" className="text-[#172b9b] underline hover:text-blue-800 transition-colors">📞 Call Support</a>
//                     <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 underline hover:text-green-800 transition-colors">
//                         <FaWhatsapp className="w-5 h-5"/> Chat on WhatsApp
//                     </a>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-4 font-lora italic">Support available Mon-Sat, 10 AM - 6 PM IST.</p>
//             </div>
//         </div>
//     );
// };
// // --- END Modals ---

// // Define ProductWithDisplaySrc type
// type ProductWithDisplaySrc = Product & { displayImageSrc?: string };

// const PeelNstick: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { addItem } = useCartStore();
//   const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
//   const { user } = useAuthStore();
//   const navigate = useNavigate();

//   // State variables
//   const [product, setProduct] = useState<Product | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<ProductWithDisplaySrc[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [quantity, setQuantity] = useState<number>(1); // State for roll quantity
//   const [includeInstallation, setIncludeInstallation] = useState(true);
//   const [pinCode, setPinCode] = useState('');
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
//   const [supportModalOpen, setSupportModalOpen] = useState(false);
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [showQuestionMark, setShowQuestionMark] = useState(false); // For price help
//   const [imageList, setImageList] = useState<string[]>(['/placeholder.jpg']);
//   const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});

//   // Image loading state
//   const [isMainImageLoading, setIsMainImageLoading] = useState(true);
//   const [mainImageLoadError, setMainImageLoadError] = useState(false);

//   const toggleFaq = (index: number) => { setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] })); };

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'auto' });
//     setLoading(true);
//     setImageList(['/placeholder.jpg']);
//     setSelectedImageIndex(0);
//     setIsMainImageLoading(true);
//     setMainImageLoadError(false);

//     fetch(`${API_BASE_URL}/api/products/${id}`)
//       .then(r => {
//           if (!r.ok) throw new Error(`HTTP error ${r.status}`);
//           return r.json();
//       })
//       .then(data => {
//         if (!data || typeof data !== 'object') throw new Error('Invalid product data');
//          if ((data.category || '').toLowerCase() !== 'wallpaper-roll') {
//              console.warn("Fetched product might not be a wallpaper roll.");
//          }
//         setProduct(data as Product);

//         // Process Images
//         let processedImages: string[] = [];
//         if (Array.isArray(data.images) && data.images.length > 0) {
//           processedImages = data.images
//             .map((pathStr: string | null | undefined): string => {
//               if (!pathStr) return '';
//               if (pathStr.startsWith('http')) return pathStr;
//               const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
//               return `${baseUrl}/${pathStr.startsWith('/') ? pathStr.substring(1) : pathStr}`;
//             })
//             .filter(url => url !== '');
//         }
//         setImageList(processedImages.length > 0 ? processedImages : ['/placeholder.jpg']);

//         // Fetch related products
//         fetch(`${API_BASE_URL}/api/products?category=wallpaper-roll`)
//           .then(r => r.ok ? r.json() : [])
//           .then(allRolls => {
//             if (!Array.isArray(allRolls)) return;
//             const currentId = data._id || data.id;
//             const related = allRolls.filter((p: Product) => (p._id || p.id) !== currentId).slice(0, 4);

//              const relatedWithImages = related.map((prod): ProductWithDisplaySrc => {
//                  let displaySrc = '/placeholder.jpg';
//                  if (Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]) {
//                       displaySrc = prod.images[0].startsWith('/') ? prod.images[0] : `/${prod.images[0]}`;
//                  }
//                  return { ...prod, displayImageSrc: displaySrc };
//              });
//             setRelatedProducts(relatedWithImages);
//           }).catch(err => console.error("Error fetching related products:", err));
//       })
//       .catch(err => {
//         console.error("Error fetching product details:", err);
//         setProduct(null);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [id, API_BASE_URL]);

//   // --- Wishlist Status Effect ---
//   useEffect(() => {
//       if (product) {
//        const productId = product._id || product.id;
//        if (!productId) return;
//        const checkStatus = async () => {
//          setIsLoadingWishlist(true);
//          try {
//            if (user) {
//              const status = await checkWishlistStatus(productId);
//              setIsWishlisted(status);
//            } else {
//              setIsWishlisted(isInWishlist(productId));
//            }
//          } catch (error) {
//            console.error('Error checking wishlist status:', error);
//            setIsWishlisted(isInWishlist(productId)); // Fallback
//          } finally {
//            setIsLoadingWishlist(false);
//          }
//        };
//        checkStatus();
//      }
//   }, [product, user, isInWishlist, checkWishlistStatus]);

//   // --- Calculations ---
//   const pricePerRoll = product?.price ?? 0;
//   const originalPricePerRoll = product?.originalPrice ?? 0;
//   const installationCostPerRoll = 450; // Example cost per roll
//   const rollCoverageSqFt = 55; // Example coverage

//   const basePrice = pricePerRoll * quantity;
//   const installationCost = includeInstallation ? (installationCostPerRoll * quantity) : 0;
//   const finalPrice = basePrice + installationCost;
//   const originalFinalPrice = originalPricePerRoll > pricePerRoll
//                              ? (originalPricePerRoll * quantity + installationCost)
//                              : 0;

//    // Get size display
//    const getSizeDisplay = () => {
//        // Check variants first
//        if (product?.variants && product.variants.length > 0 && product.variants[0].size && product.variants[0].size.length > 0) {
//            return product.variants[0].size[0];
//        }
//        // Fallback to dimensions if they exist (assuming dimensions object might have width/height)
//        if (product?.dimensions?.width && product?.dimensions?.height) {
//             // Convert to feet if needed, or display as is
//             // Example: return `${product.dimensions.width} x ${product.dimensions.height} Inches`;
//        }
//        // Final fallback
//        return `Covers approx. ${rollCoverageSqFt} sq ft`;
//    };
//    const sizeDisplay = getSizeDisplay();


//   const getDeliveryDate = () => {
//         const today = new Date();
//     const deliveryDate = new Date(today);
//     deliveryDate.setDate(today.getDate() + 3);
//     return deliveryDate.toLocaleDateString('en-US', {
//       weekday: 'long', day: 'numeric', month: 'long'
//     });
//    };

//   // --- Event Handlers ---
//   const handleQuantityChange = (amount: number) => {
//     setQuantity(prev => Math.max(1, prev + amount));
//   };
//   const handleAddToCart = async () => {
//     if (!product) return;
//     if (!user) {
//       navigate('/login?redirect=/wallroll/' + id);
//       return;
//     }
//     const itemToAdd = {
//       ...product,
//       _id: product._id || product.id || '',
//       name: product.name || 'Unnamed Roll',
//       price: pricePerRoll,
//     };
//     await addItem(itemToAdd, quantity, {
//       isInstallationIncluded: includeInstallation,
//       finalItemPrice: finalPrice
//     });
//     setAddedToCart(true);
//     setTimeout(() => setAddedToCart(false), 1500);
//    };
//   const handleWishlistToggle = async () => {
//      if (!product) return;
//      if (!user) {
//        navigate('/login?redirect=/wallroll/' + id);
//        return;
//      }
//      const productId = product._id || product.id;
//      if (!productId) return;
//      setIsLoadingWishlist(true);
//      try {
//        if (isWishlisted) {
//          await removeFromWishlist(productId);
//          setIsWishlisted(false);
//        } else {
//           const productToAdd = { ...product, _id: productId, name: product.name || 'Unnamed' };
//          await addToWishlist(productToAdd);
//          setIsWishlisted(true);
//        }
//      } catch (error) {
//        console.error('Error toggling wishlist:', error);
//      } finally {
//        setIsLoadingWishlist(false);
//      }
//   };

//   // Image Load Handlers
//   const handleMainImageLoad = () => { setIsMainImageLoading(false); setMainImageLoadError(false); };
//   const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { console.error(`Image Error: Failed to load ${mainImage}`, e); setIsMainImageLoading(false); setMainImageLoadError(true); };
//   useEffect(() => { setIsMainImageLoading(true); setMainImageLoadError(false); }, [selectedImageIndex, imageList]);


//   // --- Render Logic ---
//   if (loading) { return <div className="min-h-screen flex items-center justify-center">Loading...</div>; }
//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center px-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-700 mb-4 font-seasons">Roll Not Found</h1>
//           <p className="text-gray-500 mb-6 font-lora">Sorry, we couldn't find the wallpaper roll.</p>
//           <Link to="/" className="inline-flex items-center gap-2 text-[#172b9b] hover:underline font-lora"> <ChevronLeft className="w-4 h-4" /> Back to Home </Link>
//         </div>
//       </div>
//     );
//   }

//   const mainImage = imageList[selectedImageIndex] || '/placeholder.jpg';
//   const whatsappLink = `https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%20${quantity}%20x%20${encodeURIComponent(product.name)}%20(ID%3A%20${product._id || product.id}).`;

//   return (
//     <>
//       <Helmet>
//         <title>{product.name} - Wallpaper Roll | Nagomi</title>
//         <meta name="description" content={product.description || `Premium wallpaper roll: ${product.name}`} />
//       </Helmet>
//       <div className="bg-white pb-16">
//         {/* Breadcrumbs */}
//          <div className="bg-white border-b border-gray-200">
//              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//              <nav className="flex items-center space-x-2 text-sm text-gray-500">
//                   <Link to="/" className="text-[#172b9b] italic">Home</Link>
//                   <span>/</span>
//                   <Link to="/wallroll" className="text-[#172b9b] italic">Wallpaper Rolls</Link>
//                   <span>/</span>
//                   <span className="text-[#172b9b] italic truncate max-w-[200px]">{product.name}</span>
//              </nav>
//            </div>
//          </div>

//         {/* Main Content */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

//             {/* --- Left Section - Image --- */}
//             <div className="w-full">
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg shadow-sm" >
//                  {isMainImageLoading && !mainImageLoadError && ( <div className="absolute inset-0 flex items-center justify-center z-10"><Loader2 className="w-10 h-10 text-gray-400 animate-spin" /></div> )}
//                  {mainImageLoadError && !isMainImageLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center z-10"><ImageOff className="w-12 h-12 mb-2" /><span className="text-sm">Image cannot be loaded</span></div> )}
//                  <motion.img key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: (!isMainImageLoading && !mainImageLoadError) ? 1 : 0 }} transition={{ duration: 0.3 }} src={mainImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-0" onLoad={handleMainImageLoad} onError={handleMainImageError} />
//                  {imageList.length > 1 && ( <> <button onClick={() => setSelectedImageIndex(prev => prev === 0 ? imageList.length - 1 : prev - 1)} className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" aria-label="Previous image"> <ChevronLeft className="w-5 h-5 text-gray-800" /> </button> <button onClick={() => setSelectedImageIndex(prev => prev === imageList.length - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" aria-label="Next image"> <ChevronRight className="w-5 h-5 text-gray-800" /> </button> </> )}
//               </motion.div>
//             </div>


//             {/* --- Right Section - Product Details (MODIFIED) --- */}
//             <div className="space-y-6">
//               {product.bestseller && ( <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-sm font-bold"> BESTSELLER </span> )}
//               <h1 className="text-3xl sm:text-4xl font-bold text-[#172b9b] font-seasons leading-tight">{product.name}</h1>
//               {/* Ratings */}
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center text-yellow-500"> {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-current" />))} </div>
//                 <span className="text-sm text-gray-700">4.9 |</span> {/* Example */}
//                 <span className="text-sm text-gray-700 underline cursor-pointer"> 20 ratings </span> {/* Example */}
//               </div>

//               {/* Price per Item */}
//               <div className="flex items-baseline gap-2 flex-wrap relative">
//                 <span className="text-3xl font-bold text-[#1428a0]">
//                   ₹{pricePerRoll.toLocaleString('en-IN')}
//                 </span>
//                  {originalPricePerRoll > pricePerRoll && (
//                    <span className="text-lg text-gray-400 line-through">
//                       ₹{originalPricePerRoll.toLocaleString('en-IN')}
//                    </span>
//                  )}
//                 {/* Updated text */}
//                 <span className="text-sm text-gray-500">per roll</span>
//                    {/* Tooltip for roll coverage */}
//                    <div className="relative inline-block ml-1">
//                       <button onMouseEnter={() => setShowQuestionMark(true)} onMouseLeave={() => setShowQuestionMark(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Roll coverage information" > <HelpCircle className="w-4 h-4" /> </button>
//                       {showQuestionMark && ( <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg z-20 font-lora"> Each roll covers approx. {rollCoverageSqFt} sq ft </motion.div> )}
//                    </div>
//                    {/* Save Percentage */}
//                    {originalPricePerRoll > pricePerRoll && (
//                       <span className="bg-[#172b9b] text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ml-2">
//                          SAVE {Math.round(((originalPricePerRoll - pricePerRoll) / originalPricePerRoll) * 100)}%
//                       </span>
//                    )}
//               </div>
//               <p className="text-sm text-gray-500 font-lora italic -mt-4">inclusive of all taxes</p>

//               {/* Size Display */}
//               <div>
//                  <label className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">Size</label>
//                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 font-lora">
//                      {sizeDisplay}
//                  </div>
//               </div>

//               {/* --- Quantity Counter --- */}
//                <div>
//                  <label htmlFor="quantity-input" className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">Quantity</label>
//                  <div className="flex items-center border border-gray-300 rounded-md w-max shadow-sm">
//                      <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#172b9b]"> <Minus className="w-4 h-4" /> </button>
//                      <input id="quantity-input" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-12 text-center border-l border-r border-gray-300 py-1.5 font-lora text-sm focus:outline-none focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b]" min={1} />
//                      <button onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#172b9b]"> <Plus className="w-4 h-4" /> </button>
//                  </div>
//               </div>
//               {/* --- END Quantity Counter --- */}

//                {/* Order Help Button */}
//                <div>
//                   <button type="button" onClick={() => setSupportModalOpen(true)} className="text-sm text-blue-600 hover:underline focus:outline-none font-lora flex items-center gap-1">
//                      <HelpCircle className="w-4 h-4" /> Need help placing the order?
//                   </button>
//                   <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
//                </div>

//               {/* PIN Code & Delivery */}
//                <div>
//                  <label htmlFor="pincode-input" className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">Check Delivery {includeInstallation ? '& Installation' : ''}</label>
//                  <div className="flex gap-2">
//                      <input id="pincode-input" type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} className="w-32 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm" placeholder="Enter PIN code" />
//                  </div>
//                  {pinCode.length === 6 && ( <div className="text-xs text-green-700 mt-1 font-lora"> ✓ Delivery {includeInstallation ? '& Installation available!' : 'available!'} Expected by {getDeliveryDate()}. </div> )}
//                   {pinCode.length > 0 && pinCode.length < 6 && ( <div className="text-xs text-red-600 mt-1 font-lora"> Please enter a valid 6-digit PIN code. </div> )}
//                </div>

//               {/* Installation Option */}
//               <div className="flex items-center gap-2">
//                 <input type="checkbox" id="install-checkbox-roll" checked={includeInstallation} onChange={(e) => setIncludeInstallation(e.target.checked)} className="w-4 h-4 text-[#172b9b] border-gray-300 rounded focus:ring-[#172b9b] focus:ring-offset-1" />
//                 <label htmlFor="install-checkbox-roll" className="text-sm font-medium text-gray-700 font-lora">
//                   Include installation (+ ₹{installationCostPerRoll}/roll) {/* Updated label */}
//                 </label>
//               </div>

//               {/* Final Price Display */}
//               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                  <div className="text-sm text-gray-600 font-lora mb-1">Total Estimated Price ({quantity} Roll{quantity > 1 ? 's' : ''}):</div>
//                   <div className="flex items-baseline gap-2 flex-wrap">
//                       <span className="text-3xl font-bold text-[#172b9b]"> ₹{finalPrice.toLocaleString('en-IN')} </span>
//                       {originalFinalPrice > finalPrice && ( <span className="text-base text-gray-400 line-through"> ₹{originalFinalPrice.toLocaleString('en-IN')} </span> )}
//                   </div>
//                   <div className="text-xs text-gray-500 font-lora mt-1"> (Incl. product, {includeInstallation ? 'installation &' : '&'} taxes) </div>
//                   {finalPrice > 3999 && ( <div className="mt-2 text-xs text-green-700 font-semibold font-lora"> 🎉 Yay! Free shipping included! </div> )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} className={`w-full sm:flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-150 flex items-center justify-center gap-2 text-base shadow-sm ${ addedToCart ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-[#172b9b] text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-700' }`} disabled={addedToCart} > {addedToCart ? ( <> <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Added </> ) : ( <> <ShoppingCart className="w-5 h-5" /> Add to Cart </> )} </motion.button>
//                   <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-600" > <FaWhatsapp className="w-5 h-5" /> WhatsApp Order </a>
//                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWishlistToggle} disabled={isLoadingWishlist} className={`p-3 border rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${ isWishlisted ? 'bg-red-50 border-red-200 text-red-500 focus:ring-red-300' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-red-500 focus:ring-gray-300' } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} > {isLoadingWishlist ? ( <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : ( <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} /> )} </motion.button>
//               </div>

//                {/* Product Features */}
//                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-200 pt-6 text-center">
//                   <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/non-toxic-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">Non-toxic & VOC Free</span> </div>
//                  <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/high-quality-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">Covers {rollCoverageSqFt} sq ft</span> </div>
//                  <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/high-quality-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">High Quality Print</span> </div>
//                  <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/lasts-years-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">Lasts 8-10 Years</span> </div>
//                </div>
//             </div>
//           </div>

//           {/* --- Lower Sections --- */}
//           {/* ... (Keep Description, Related Products, FAQ, etc.) ... */}
//            <div className="mt-16 pt-8 border-t border-gray-200">
//                  <h2 className="text-2xl font-semibold text-[#172b9b] mb-4 font-seasons">Product Details</h2>
//                  <div className="prose prose-sm max-w-none text-gray-600 font-lora">
//                      <p>{product.description || 'No description available.'}</p>
//                      {product.tags && product.tags.length > 0 && ( <p><strong>Tags:</strong> {product.tags.join(', ')}</p> )}
//                      {product.category && <p><strong>Category:</strong> {product.category}</p>}
//                      {product.skuId && <p><strong>SKU:</strong> {product.skuId}</p>}
//                      {product.materials && product.materials.length > 0 && ( <p><strong>Materials:</strong> {product.materials.join(', ')}</p> )}
//                  </div>
//              </div>
//            {relatedProducts.length > 0 && (
//              <div className="mt-16 pt-8 border-t border-gray-200">
//                 <h2 className="text-2xl font-semibold text-[#172b9b] mb-6 font-seasons text-center"> You Might Also Like </h2>
//                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
//                  {relatedProducts.map(relProd => ( <ProductCard key={relProd._id || relProd.id} product={relProd} /> ))}
//                </div>
//              </div>
//            )}
//              <div className="mt-16 pt-8 border-t border-gray-200 max-w-3xl mx-auto">
//              <h2 className="text-2xl font-semibold text-[#172b9b] mb-6 font-seasons text-center"> Frequently Asked Questions </h2>
//              <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm bg-white">
//                {[
//                  { q: "How much area does one wallpaper roll cover?", a: `Each standard roll covers approximately ${rollCoverageSqFt} square feet. Use the quantity counter to select how many rolls you need.` },
//                  { q: "How is installation cost calculated?", a: `Installation is charged per roll (${installationCostPerRoll}/roll). Simply select the 'Include installation' checkbox if you require this service.` },
//                  { q: "What's the difference between rolls and custom wallpaper?", a: "Wallpaper rolls come in standard sizes with repeating patterns, ideal for covering larger areas. Custom wallpaper is printed exactly to your wall's dimensions, often featuring large murals." },
//                  { q: "Can I order a sample?", a: "Yes, samples are often available. Please contact support to inquire about sample availability." },
//                  { q: "How do I calculate rolls needed?", a: "Measure your wall's height and width in feet. Calculate total square footage (H x W). Divide by the roll coverage (${rollCoverageSqFt} sq ft) and round *up*. Order an extra roll for waste/repairs." },
//                ].map((faq, index) => (
//                  <div key={index}>
//                    <button onClick={() => toggleFaq(index)} className="w-full py-3 px-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none" > <span className="text-sm font-medium text-gray-800 font-lora">{faq.q}</span> <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${ openFaqs[index] ? 'rotate-180' : '' }`} /> </button>
//                    {openFaqs[index] && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-3 text-gray-600 text-sm font-lora bg-gray-50 border-t border-gray-100"> <div className="pt-2">{faq.a}</div> </motion.div> )}
//                  </div>
//                ))}
//              </div>
//            </div>


//         </div>
//       </div>
//     </>
//   );
// };

// export default PeelNstick;

// // --- END Lower Sections ---


import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard'; // Ensure this path is correct
import { FilterOptions, Product } from '../types'; // Ensure Product type is defined correctly
import { API_BASE_URL } from '../api/config';
// CORRECTED IMPORT: Added Link
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react'; // Import ChevronDown

const PRODUCTS_PER_PAGE = 21;

// --- Helper Function to Get Image Source ---
// Determines the best image source URL for a product, prioritizing product.images[0]
const getDisplayImageSrc = (product: Product): string => {
  // 1. Prioritize the first image from the product's images array if it exists and is valid
  if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
    const imageUrl = product.images[0];
    // Simple check if it's already a usable URL (absolute or root-relative)
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      return imageUrl;
    }
    // If it's potentially just a filename or relative path segment, construct the path
    const parts = imageUrl.split(/[\\/]/);
    const filename = parts.pop() || imageUrl;
    const categoryFolder = product.category?.toLowerCase().includes('roll') ? 'wallpaper_roll' :
                           product.category?.toLowerCase().includes('art') ? 'wall_art' : 'wallpaper';

    // If the path seems to already include the category structure, use it directly
    if (imageUrl.includes(categoryFolder)) {
        // Assuming path might be like 'wallpaper/WP_001/1-001-WP.png'
        return `/images/${imageUrl}`;
    }

    // Attempt to construct path using SKU subfolder convention
    const skuId = product.skuId || '';
    if (skuId && (filename.includes(skuId) || filename.includes(skuId.replace('-WP','')))) {
       // e.g., /images/wallpaper/WP_001/1-001-WP.png or similar variations
       // Check if SKU is already in the filename path segments provided
       if (imageUrl.includes(skuId)) { // If path already contains SKU (e.g., SKU/filename)
         return `/images/${categoryFolder}/${imageUrl}`; // Path might be SKU/filename.ext
       }
       // Construct path assuming SKU is the folder name
       return `/images/${categoryFolder}/${skuId}/${filename}`;
    }
    // General fallback within the category folder
    return `/images/${categoryFolder}/${filename}`;
  }
  // Ultimate fallback
  return '/placeholder.jpg';
};
// --- End Helper Function ---

// Type for products including the generated image source
interface ProductWithImage extends Product {
  displayImageSrc: string;
}

const PeelNstick: React.FC = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]); // State holds only processed wallpapers
  const [allCategories, setAllCategories] = useState<string[]>(['All', 'Wallpaper']); // Simplified categories
  const [colors, setColors] = useState<string[]>([]);
  const rooms = ['Living Room', 'Bedroom', 'Pooja room', 'Kids room', 'Office']; // Available room filters

  const [openSections, setOpenSections] = useState({
    type: true,  // Theme filter section open by default
    colour: true, // Color filter section open by default
    room: true   // Room filter section open by default
  });

  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
  const [filters, setFilters] = useState<FilterOptions>({
    // Category filter might become less relevant if only wallpapers are shown,
    // but keep for structure if needed for 'All' vs specific sub-types later
    category: 'All',
    priceRange: [0, 200], // Example price range
    colors: [],
    roomTypes: []
  });
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  // Available theme filters (ensure 'Minimalist' is removed if not desired)
  const themes = ['Tropical', 'Indian', 'Modern', 'Kids', '3D', 'Global Destinations', 'Ceiling'];
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // Search term from URL
  const [sidebarSearch, setSidebarSearch] = useState(''); // Search term from Sidebar Input
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // --- Main useEffect Hook for Fetching, Filtering, and Processing ---
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(fetchedProducts => {
        const allProducts = Array.isArray(fetchedProducts) ? fetchedProducts : [];

        // 1. Filter for 'peel-n-stick' category ONLY
        const wallpaperProducts = allProducts.filter((p: any): p is Product => {
            const rawCat = p?.category;
            const normalizedCat = typeof rawCat === 'string' ? rawCat.toLowerCase().trim() : '';
            return normalizedCat === 'peel-n-stick'; // Keep only products explicitly categorized as 'wallpaper'
        });

        // 2. Generate displayImageSrc for each wallpaper
        const wallpapersWithImageSrc = wallpaperProducts.map((product): ProductWithImage => {
            const displayImageSrc = getDisplayImageSrc(product);
            return {
              ...product,
              displayImageSrc
            };
        });

        // 3. Enrich with Room Types
        const poojaKeywords = ['pooja', 'mandir', 'temple', 'krishna', 'radha', 'srinath', 'shiv', 'shiva', 'vrindavan', 'gopal', 'govind', 'gau', 'kamdhenu', 'spiritual', 'divine', 'sacred', 'pichwai'];
        const kidsKeywords = ['kids', 'princess', 'astronaut', 'rocket', 'unicorn', 'football', 'avenger', 'spidey', 'parachute', 'balloon', 'safari', 'animal', 'fairy', 'cartoon', 'playful', 'whimsy'];
        const officeKeywords = ['office', 'workspace', 'work space', 'corporate', 'stripe', 'stripes', 'concrete', 'marble', 'geometric', 'geometry', 'metallic', 'stucco', 'city', 'skyline', 'abstract', 'pattern', 'modern', '3d'];

        const normalize = (v: any): string => (typeof v === 'string' ? v.toLowerCase().trim() : '');
        const includesAny = (text: string, words: string[]): boolean => words.some(w => text.includes(w));

        const enrichedWallpapers = wallpapersWithImageSrc.map((p): ProductWithImage => {
           // Use existing roomTypes if valid and specific, otherwise infer
           const existingRooms = (Array.isArray(p.roomTypes) ? p.roomTypes : [])
             .map(normalize)
             .filter(r => rooms.map(br => br.toLowerCase()).includes(r)); // Filter against known valid rooms

           if (existingRooms.length > 0) {
              return { ...p, roomTypes: existingRooms }; // Use existing valid rooms
           }

           // Infer if no valid existing rooms
           const name = normalize(p?.name);
           const theme = normalize(p?.theme || (Array.isArray(p.tags) && p.tags[0] ? p.tags[0] : ''));
           const desc = normalize(p?.description);
           const text = `${name} ${theme} ${desc}`;

           let inferredRooms: string[] = [];

           if (includesAny(text, kidsKeywords) || theme === 'kids') inferredRooms.push('Kids room');
           if (includesAny(text, poojaKeywords) || theme === 'indian') inferredRooms.push('Pooja room');
           if (includesAny(text, officeKeywords) || ['modern', '3d', 'abstract', 'geometric'].includes(theme)) inferredRooms.push('Office');

           // Add general rooms if suitable or no specific room found yet
           if (inferredRooms.length === 0 || ['tropical', 'modern', 'global destinations', '3d'].includes(theme) || inferredRooms.includes('Office') ) {
               if (!inferredRooms.includes('Living Room')) inferredRooms.push('Living Room');
               if (!inferredRooms.includes('Bedroom')) inferredRooms.push('Bedroom');
           }

           const finalRooms = Array.from(new Set(inferredRooms));
           return { ...p, roomTypes: finalRooms.length > 0 ? finalRooms : ['Living Room', 'Bedroom'] }; // Default if empty
        });

        setProducts(enrichedWallpapers); // Set the final list of processed wallpapers
      })
      .catch(err => console.error('Error fetching or processing products:', err));

    // Fetch and set colors (no change needed here)
    fetch(`${API_BASE_URL}/api/meta/colors`)
      .then(r => r.json())
      .then(data => setColors(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching colors:', err));

    // Categories are now simplified
    setAllCategories(['All', 'Wallpaper']);

  }, []); // Run only once on mount

 // Effect to handle URL parameters (search) - Category param is less relevant now
 useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchTerm(q); // Set search term based on URL
    setCurrentPage(1); // Reset page when search term changes
  }, [location.search]);


  // --- Filtering and Sorting Logic (useMemo) ---
  const filteredProducts = useMemo(() => {
    let listToFilter = products; // Start with the processed wallpapers from state

    // 1. Filter by Search Term (Sidebar search takes priority)
    const currentSearch = sidebarSearch.trim() ? sidebarSearch.trim().toLowerCase() : searchTerm.trim().toLowerCase();
    if (currentSearch) {
      listToFilter = listToFilter.filter(product =>
        product.name?.toLowerCase().includes(currentSearch) ||
        product.description?.toLowerCase().includes(currentSearch) ||
        product.tags?.some(tag => tag.toLowerCase().includes(currentSearch))
      );
    }

    // 2. Filter by Selected Themes
    if (selectedThemes.length > 0) {
      const lowerSelectedThemes = selectedThemes.map(t => t.toLowerCase());
      listToFilter = listToFilter.filter(product => {
        const productTheme = product.theme ? product.theme.toLowerCase() : (Array.isArray(product.tags) && product.tags.length > 0 ? product.tags[0].toLowerCase() : '');
        return lowerSelectedThemes.includes(productTheme);
      });
    }

    // 3. Filter by Color
    if (filters.colors && filters.colors.length > 0) {
      const lowerSelectedColors = filters.colors.map(c => c.toLowerCase());
      listToFilter = listToFilter.filter(product =>
        product.colors?.some(color => lowerSelectedColors.includes(color.toLowerCase()))
      );
    }

    // 4. Filter by Room Type
    if (filters.roomTypes && filters.roomTypes.length > 0) {
      const lowerSelectedRooms = filters.roomTypes.map(r => r.toLowerCase());
      listToFilter = listToFilter.filter(product =>
        product.roomTypes?.some(room => lowerSelectedRooms.includes(room.toLowerCase()))
      );
    }

    // --- Sorting ---
    const sortedList = [...listToFilter];
     switch (sortBy) {
       case 'price-low':
         sortedList.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
         break;
       case 'price-high':
         sortedList.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
         break;
       case 'newest':
         sortedList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || (b.skuId || '').localeCompare(a.skuId || ''));
         break;
       case 'alphabetical':
         sortedList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
         break;
       case 'popularity':
       default:
         sortedList.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (a.skuId || '').localeCompare(b.skuId || ''));
         break;
     }
    return sortedList;

  }, [products, filters, sortBy, searchTerm, sidebarSearch, selectedThemes]); // Dependencies


  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
     return filteredProducts.slice(
       (currentPage - 1) * PRODUCTS_PER_PAGE,
       currentPage * PRODUCTS_PER_PAGE
     );
  }, [filteredProducts, currentPage]);


  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchTerm, sidebarSearch, selectedThemes]);

  // Scroll to top when page changes
  useEffect(() => {
    const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentPage]);


  // --- Filter Helper Functions ---
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArrayFilter = (key: 'colors' | 'roomTypes', value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [key]: updatedValues };
    });
  };

  const clearAllFilters = () => {
       setFilters({
         category: 'All',
         priceRange: [0, 200],
         colors: [],
         roomTypes: []
       });
       setSelectedThemes([]);
       setSidebarSearch('');
       setSearchTerm('');
       // Clear only the search param from URL if present
       const params = new URLSearchParams(location.search);
       if (params.has('search')) {
            params.delete('search');
            navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
       } else {
            navigate(location.pathname, { replace: true });
       }
     };

     const isFilterActive = useMemo(() => {
         return (
           (filters.colors && filters.colors.length > 0) ||
           (filters.roomTypes && filters.roomTypes.length > 0) ||
           selectedThemes.length > 0 ||
           sidebarSearch.trim() !== '' ||
           searchTerm.trim() !== ''
         );
     }, [filters, selectedThemes, sidebarSearch, searchTerm]);


  // --- Render JSX ---
  return (
    <>
      <Helmet>
        <title>Premium Wallpapers - Shop Collection | Nagomi</title>
        <meta name="description" content="Browse our extensive collection of premium wallpapers. Find the perfect design for your space with our advanced filtering options." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#172b9b] mb-3 font-seasons leading-tight"> Peel N Stick</h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-lora italic"> Transform every wall into a masterpiece with our aesthetically curated collection. </p>
            </motion.div>
             <nav className="flex items-center justify-center space-x-1.5 text-xs sm:text-sm text-gray-500 mt-4 font-lora">
               <Link to="/" className="hover:text-[#172b9b] transition-colors">Home</Link>
               <span>/</span>
               <span className="text-gray-700 font-medium">Peel N Stick</span>
             </nav>
          </div>
        </div>

         {/* Mobile Filter/Sort Buttons */}
         <div className="sticky top-0 lg:hidden z-30 bg-white border-t border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
             <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-700 hover:text-[#172b9b] transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2.75 4A.75.75 0 0 1 3.5 3.25h13a.75.75 0 0 1 0 1.5h-13A.75.75 0 0 1 2.75 4Zm0 5A.75.75 0 0 1 3.5 8.25h9a.75.75 0 0 1 0 1.5h-9A.75.75 0 0 1 2.75 9Zm0 5A.75.75 0 0 1 3.5 13.25h5a.75.75 0 0 1 0 1.5h-5A.75.75 0 0 1 2.75 14Z"/></svg> Sort By </button>
             <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-700 hover:text-[#172b9b] transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.59L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" /></svg> Filters {isFilterActive && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-1"></span>} </button>
           </div>
         </div>


        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* --- Desktop Sidebar --- */}
            <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
                <div className="bg-white p-5 sticky top-24 rounded-lg border border-gray-100 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
                 <div className="flex items-center justify-between mb-4"> <h2 className="text-lg font-semibold text-[#172b9b] font-seasons">Filters</h2> {isFilterActive && ( <button onClick={clearAllFilters} className="text-xs text-gray-500 hover:text-red-600 font-lora transition-colors"> Clear All </button> )} </div>
                  <p className="text-xs text-gray-400 mb-4 font-lora italic">{filteredProducts.length} results found</p>
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="border-b border-gray-100 pb-4"> <label htmlFor="sidebar-search" className="block text-sm font-medium text-gray-600 mb-2 font-lora">Search</label> <input id="sidebar-search" type="text" placeholder="e.g., Bahama Breeze" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm shadow-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} /> </div>
                    {/* Theme */}
                    <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Theme <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} /> </button> {openSections.type && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1"> {themes.map(theme => ( <label key={theme} className="flex items-center gap-2 text-xs font-lora text-gray-700 cursor-pointer"> <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={selectedThemes.includes(theme)} onChange={() => { setSelectedThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]); }} /> <span>{theme}</span> </label> ))} </motion.div> )} </div>
                    {/* Color */}
                    <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Colour <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} /> </button> {openSections.colour && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1"> {colors.map(color => ( <label key={color} className="flex items-center gap-2 text-xs font-lora text-gray-700 cursor-pointer"> <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.colors?.includes(color)} onChange={() => toggleArrayFilter('colors', color)} /> <span>{color}</span> </label> ))} </motion.div> )} </div>
                    {/* Room */}
                    <div className="pb-4"> <button onClick={() => toggleSection('room')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Room <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.room ? 'rotate-180' : ''}`} /> </button> {openSections.room && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1"> {rooms.map(room => ( <label key={room} className="flex items-center gap-2 text-xs font-lora text-gray-700 cursor-pointer"> <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.roomTypes?.includes(room)} onChange={() => toggleArrayFilter('roomTypes', room)} /> <span>{room}</span> </label> ))} </motion.div> )} </div>
                  </div>
               </div>
            </aside>


            {/* --- Main Product Grid Area --- */}
            <main className="flex-1 min-w-0">
               {/* Sort Dropdown & Result Count */}
                 <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-6">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                   <span className="text-sm text-gray-500 font-lora"> Showing {paginatedProducts.length > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0}-{(currentPage - 1) * PRODUCTS_PER_PAGE + paginatedProducts.length} of {filteredProducts.length} results </span>
                   <div className="flex items-center gap-2"> <label htmlFor="sort-by" className="text-sm text-gray-500 font-lora">Sort by:</label> <select id="sort-by" value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)} className="px-2 py-1 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] text-sm font-lora shadow-sm appearance-none bg-white pr-6" style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") no-repeat right 0.5rem center/1em`}} > <option value="popularity">Popularity</option> <option value="price-low">Price: Low to High</option> <option value="price-high">Price: High to Low</option> <option value="newest">Newest First</option> <option value="alphabetical">Alphabetical</option> </select> </div>
                 </div>
               </div>

              {/* Product Grid */}
              {paginatedProducts.length > 0 ? (
                <motion.div layout className="grid gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => ( <ProductCard key={product._id || product.id} product={product} /> ))}
                </motion.div>
              ) : (
                 // --- Loading / No Results ---
                 !products.length ? ( // Still loading initial products
                     <div className="grid gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"> {Array.from({ length: 9 }).map((_, i) => ( <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"> <div className="w-full aspect-[4/3] bg-gray-200"></div> <div className="p-3 space-y-2"> <div className="h-4 bg-gray-200 rounded w-3/4"></div> <div className="h-4 bg-gray-200 rounded w-1/2"></div> </div> </div> ))} </div>
                 ) : ( // Filters resulted in no matches
                   <div className="text-center py-16 px-4"> <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <p className="text-gray-500 font-lora mb-4">No wallpapers found matching your criteria.</p> <button onClick={clearAllFilters} className="text-sm text-[#172b9b] underline hover:text-blue-800 font-lora"> Clear all filters and try again </button> </div>
                 )
              )}


              {/* Pagination */}
              {totalPages > 1 && (
                 <div className="flex justify-center items-center gap-1.5 mt-8 md:mt-12 text-sm font-lora">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Previous page"> Prev </button>
                    {(() => { const pages = []; const maxPagesToShow = 5; const halfPages = Math.floor(maxPagesToShow / 2); let startPage = Math.max(1, currentPage - halfPages); let endPage = Math.min(totalPages, currentPage + halfPages); if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; } else if (currentPage <= halfPages) { startPage = 1; endPage = maxPagesToShow; } else if (currentPage + halfPages >= totalPages) { startPage = totalPages - maxPagesToShow + 1; endPage = totalPages; } if (startPage > 1) { pages.push( <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label="Go to page 1">1</button> ); if (startPage > 2) { pages.push(<span key="start-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } } for (let page = startPage; page <= endPage; page++) { pages.push( <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === page ? 'bg-[#172b9b] text-white border-[#172b9b] font-semibold z-10' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-current={currentPage === page ? 'page' : undefined} aria-label={`Go to page ${page}`}> {page} </button> ); } if (endPage < totalPages) { if (endPage < totalPages - 1) { pages.push(<span key="end-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } pages.push( <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label={`Go to page ${totalPages}`}>{totalPages}</button> ); } return pages; })()}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Next page"> Next </button>
                 </div>
               )}

            </main>
          </div>
        </div>

        {/* --- Mobile Modals for Filter/Sort --- */}
        {/* Mobile Sort Options */}
        {isMobileSortOpen && (
             <div className="lg:hidden fixed inset-0 z-50 flex items-end">
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} aria-hidden="true" />
                <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }} className="relative w-full bg-white rounded-t-2xl p-4 shadow-xl max-h-[70vh] flex flex-col">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b flex-shrink-0"> <h3 className="font-semibold text-gray-800 text-lg">Sort By</h3> <button onClick={() => setIsMobileSortOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button> </div>
                  <div className="divide-y divide-gray-100 overflow-y-auto">
                    {[ { value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' } ].map(opt => ( <button key={opt.value} onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }} className={`w-full text-left py-3 px-2 text-sm rounded-md transition-colors ${ sortBy === opt.value ? 'text-[#172b9b] font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50' }`} > {opt.label} </button> ))}
                  </div>
                </motion.div>
             </div>
        )}

        {/* Mobile Filters Panel */}
        {isMobileFiltersOpen && (
             <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} aria-hidden="true" />
                <motion.div initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }} transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }} className="relative h-full w-11/12 max-w-sm bg-white shadow-xl flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b flex-shrink-0"> <h2 className="text-lg font-semibold text-[#172b9b]">Filters</h2> {isFilterActive && ( <button onClick={() => { clearAllFilters(); /* Keep panel open after clearing */ }} className="text-xs text-gray-500 hover:text-red-600"> Clear All </button> )} <button onClick={() => setIsMobileFiltersOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button> </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Mobile Search */}
                     <div className="border-b border-gray-100 pb-4"> <label htmlFor="mobile-sidebar-search" className="block text-sm font-medium text-gray-600 mb-2 font-lora">Search</label> <input id="mobile-sidebar-search" type="text" placeholder="Search wallpapers..." className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm shadow-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} /> </div>
                    {/* Mobile Theme */}
                     <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Theme <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} /> </button> {openSections.type && ( <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto"> {themes.map(theme => ( <label key={theme} className="flex items-center gap-2 text-xs font-lora text-gray-700"><input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={selectedThemes.includes(theme)} onChange={() => { setSelectedThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]); }} /><span>{theme}</span></label> ))} </div> )} </div>
                    {/* Mobile Color */}
                     <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Colour <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} /> </button> {openSections.colour && ( <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto"> {colors.map(color => ( <label key={color} className="flex items-center gap-2 text-xs font-lora text-gray-700"><input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.colors?.includes(color)} onChange={() => toggleArrayFilter('colors', color)} /><span>{color}</span></label> ))} </div> )} </div>
                    {/* Mobile Room */}
                     <div className="pb-4"> <button onClick={() => toggleSection('room')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Room <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.room ? 'rotate-180' : ''}`} /> </button> {openSections.room && ( <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto"> {rooms.map(room => ( <label key={room} className="flex items-center gap-2 text-xs font-lora text-gray-700"><input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.roomTypes?.includes(room)} onChange={() => toggleArrayFilter('roomTypes', room)} /><span>{room}</span></label> ))} </div> )} </div>
                  </div>
                  {/* Apply Button Footer */}
                   <div className="p-4 border-t sticky bottom-0 bg-white flex-shrink-0"> <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#172b9b] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"> Apply Filters ({filteredProducts.length}) </button> </div>
                </motion.div>
             </div>
        )}

      </div> {/* End min-h-screen */}
    </>
  );
};

export default PeelNstick;