// src/pages/WallRollDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  Plus, // For quantity counter
  Minus, // For quantity counter
  Loader2, // For image loading
  ImageOff // For image error
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../stores/useCartStore'; // Adjust path
import { useWishlistStore } from '../stores/useWishlistStore'; // Adjust path
import ProductCard from '../components/Product/ProductCard'; // Use ProductCard for related
import { API_BASE_URL } from '../api/config'; // Adjust path
import { Product } from '../types'; // Adjust path
import { useAuthStore } from '../stores/useAuthStore'; // Adjust path
import { FaWhatsapp } from 'react-icons/fa';

// --- Modals ---
// Simple Support Modal
const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative animate-fade-in-scale">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
                <h2 className="text-xl font-semibold mb-3 text-[#172b9b] font-seasons">Need Help?</h2>
                <p className="mb-4 text-gray-700 font-lora">Our support team is ready to assist you!</p>
                <div className="flex flex-col gap-3 font-lora">
                    <a href="mailto:support@nagomi.com" className="text-[#172b9b] underline hover:text-blue-800 transition-colors">📧 Email Support</a>
                    <a href="tel:+919876543210" className="text-[#172b9b] underline hover:text-blue-800 transition-colors">📞 Call Support</a>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 underline hover:text-green-800 transition-colors">
                        <FaWhatsapp className="w-5 h-5"/> Chat on WhatsApp
                    </a>
                </div>
                <p className="text-xs text-gray-500 mt-4 font-lora italic">Support available Mon-Sat, 10 AM - 6 PM IST.</p>
            </div>
        </div>
    );
};
// --- END Modals ---

// Define ProductWithDisplaySrc type
type ProductWithDisplaySrc = Product & { displayImageSrc?: string };

const WallRollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // State variables
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithDisplaySrc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number>(1); // State for roll quantity
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showQuestionMark, setShowQuestionMark] = useState(false); // For price help
  const [imageList, setImageList] = useState<string[]>(['/placeholder.jpg']);
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});

  // Image loading state
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [mainImageLoadError, setMainImageLoadError] = useState(false);

  const toggleFaq = (index: number) => { setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] })); };

  // --- Data Fetching Effect ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setLoading(true);
    setImageList(['/placeholder.jpg']);
    setSelectedImageIndex(0);
    setIsMainImageLoading(true);
    setMainImageLoadError(false);

    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(r => {
          if (!r.ok) throw new Error(`HTTP error ${r.status}`);
          return r.json();
      })
      .then(data => {
        if (!data || typeof data !== 'object') throw new Error('Invalid product data');
         if ((data.category || '').toLowerCase() !== 'wallpaper-roll') {
             console.warn("Fetched product might not be a wallpaper roll.");
         }
        setProduct(data as Product);

        // Process Images
        let processedImages: string[] = [];
        if (Array.isArray(data.images) && data.images.length > 0) {
          processedImages = data.images
            .map((pathStr: string | null | undefined): string => {
              if (!pathStr) return '';
              if (pathStr.startsWith('http')) return pathStr;
              const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
              return `${baseUrl}/${pathStr.startsWith('/') ? pathStr.substring(1) : pathStr}`;
            })
            .filter(url => url !== '');
        }
        setImageList(processedImages.length > 0 ? processedImages : ['/placeholder.jpg']);

        // Fetch related products
        fetch(`${API_BASE_URL}/api/products?category=wallpaper-roll`)
          .then(r => r.ok ? r.json() : [])
          .then(allRolls => {
            if (!Array.isArray(allRolls)) return;
            const currentId = data._id || data.id;
            const related = allRolls.filter((p: Product) => (p._id || p.id) !== currentId).slice(0, 4);

             const relatedWithImages = related.map((prod): ProductWithDisplaySrc => {
                 let displaySrc = '/placeholder.jpg';
                 if (Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]) {
                      displaySrc = prod.images[0].startsWith('/') ? prod.images[0] : `/${prod.images[0]}`;
                 }
                 return { ...prod, displayImageSrc: displaySrc };
             });
            setRelatedProducts(relatedWithImages);
          }).catch(err => console.error("Error fetching related products:", err));
      })
      .catch(err => {
        console.error("Error fetching product details:", err);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, API_BASE_URL]);

  // --- Wishlist Status Effect ---
  useEffect(() => {
      if (product) {
       const productId = product._id || product.id;
       if (!productId) return;
       const checkStatus = async () => {
         setIsLoadingWishlist(true);
         try {
           if (user) {
             const status = await checkWishlistStatus(productId);
             setIsWishlisted(status);
           } else {
             setIsWishlisted(isInWishlist(productId));
           }
         } catch (error) {
           console.error('Error checking wishlist status:', error);
           setIsWishlisted(isInWishlist(productId)); // Fallback
         } finally {
           setIsLoadingWishlist(false);
         }
       };
       checkStatus();
     }
  }, [product, user, isInWishlist, checkWishlistStatus]);

  // --- Calculations ---
  const pricePerRoll = product?.price ?? 0;
  const originalPricePerRoll = product?.originalPrice ?? 0;
  const installationCostPerRoll = 450; // Example cost per roll
  const rollCoverageSqFt = 55; // Example coverage

  const basePrice = pricePerRoll * quantity;
  const installationCost = includeInstallation ? (installationCostPerRoll * quantity) : 0;
  const finalPrice = basePrice + installationCost;
  const originalFinalPrice = originalPricePerRoll > pricePerRoll
                             ? (originalPricePerRoll * quantity + installationCost)
                             : 0;

   // Get size display
   const getSizeDisplay = () => {
       // Check variants first
       if (product?.variants && product.variants.length > 0 && product.variants[0].size && product.variants[0].size.length > 0) {
           return product.variants[0].size[0];
       }
       // Fallback to dimensions if they exist (assuming dimensions object might have width/height)
       if (product?.dimensions?.width && product?.dimensions?.height) {
            // Convert to feet if needed, or display as is
            // Example: return `${product.dimensions.width} x ${product.dimensions.height} Inches`;
       }
       // Final fallback
       return `Covers approx. ${rollCoverageSqFt} sq ft`;
   };
   const sizeDisplay = getSizeDisplay();


  const getDeliveryDate = () => {
        const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
   };

  // --- Event Handlers ---
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      navigate('/login?redirect=/wallpaper-rolls/' + id);
      return;
    }
    const itemToAdd = {
      ...product,
      _id: product._id || product.id || '',
      name: product.name || 'Unnamed Roll',
      price: pricePerRoll,
    };
    await addItem(itemToAdd, quantity, {
      isInstallationIncluded: includeInstallation,
      finalItemPrice: finalPrice
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
   };
  const handleWishlistToggle = async () => {
     if (!product) return;
     if (!user) {
       navigate('/login?redirect=/wallpaper-rolls/' + id);
       return;
     }
     const productId = product._id || product.id;
     if (!productId) return;
     setIsLoadingWishlist(true);
     try {
       if (isWishlisted) {
         await removeFromWishlist(productId);
         setIsWishlisted(false);
       } else {
          const productToAdd = { ...product, _id: productId, name: product.name || 'Unnamed' };
         await addToWishlist(productToAdd);
         setIsWishlisted(true);
       }
     } catch (error) {
       console.error('Error toggling wishlist:', error);
     } finally {
       setIsLoadingWishlist(false);
     }
  };

  // Image Load Handlers
  const handleMainImageLoad = () => { setIsMainImageLoading(false); setMainImageLoadError(false); };
  const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { console.error(`Image Error: Failed to load ${mainImage}`, e); setIsMainImageLoading(false); setMainImageLoadError(true); };
  useEffect(() => { setIsMainImageLoading(true); setMainImageLoadError(false); }, [selectedImageIndex, imageList]);


  // --- Render Logic ---
  if (loading) { return <div className="min-h-screen flex items-center justify-center">Loading...</div>; }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-700 mb-4 font-seasons">Roll Not Found</h1>
          <p className="text-gray-500 mb-6 font-lora">Sorry, we couldn't find the wallpaper roll.</p>
          <Link to="/wallpaper-rolls" className="inline-flex items-center gap-2 text-[#172b9b] hover:underline font-lora"> <ChevronLeft className="w-4 h-4" /> Back to Rolls </Link>
        </div>
      </div>
    );
  }

  const mainImage = imageList[selectedImageIndex] || '/placeholder.jpg';
  const whatsappLink = `https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%20${quantity}%20x%20${encodeURIComponent(product.name)}%20(ID%3A%20${product._id || product.id}).`;

  return (
    <>
      <Helmet>
        <title>{product.name} - Wallpaper Roll | Nagomi</title>
        <meta name="description" content={product.description || `Premium wallpaper roll: ${product.name}`} />
      </Helmet>
      <div className="bg-white pb-16">
        {/* Breadcrumbs */}
         <div className="bg-white border-b border-gray-200">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
             <nav className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link to="/" className="text-[#172b9b] italic">Home</Link>
                  <span>/</span>
                  <Link to="/wallroll" className="text-[#172b9b] italic">Wallpaper Rolls</Link>
                  <span>/</span>
                  <span className="text-[#172b9b] italic truncate max-w-[200px]">{product.name}</span>
             </nav>
           </div>
         </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

            {/* --- Left Section - Image --- */}
            <div className="w-full">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg shadow-sm" >
                 {isMainImageLoading && !mainImageLoadError && ( <div className="absolute inset-0 flex items-center justify-center z-10"><Loader2 className="w-10 h-10 text-gray-400 animate-spin" /></div> )}
                 {mainImageLoadError && !isMainImageLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center z-10"><ImageOff className="w-12 h-12 mb-2" /><span className="text-sm">Image cannot be loaded</span></div> )}
                 <motion.img key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: (!isMainImageLoading && !mainImageLoadError) ? 1 : 0 }} transition={{ duration: 0.3 }} src={mainImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-0" onLoad={handleMainImageLoad} onError={handleMainImageError} />
                 {imageList.length > 1 && ( <> <button onClick={() => setSelectedImageIndex(prev => prev === 0 ? imageList.length - 1 : prev - 1)} className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" aria-label="Previous image"> <ChevronLeft className="w-5 h-5 text-gray-800" /> </button> <button onClick={() => setSelectedImageIndex(prev => prev === imageList.length - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" aria-label="Next image"> <ChevronRight className="w-5 h-5 text-gray-800" /> </button> </> )}
              </motion.div>
            </div>


            {/* --- Right Section - Product Details (MODIFIED) --- */}
            <div className="space-y-6">
              {product.bestseller && ( <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-sm font-bold"> BESTSELLER </span> )}
              <h1 className="text-3xl sm:text-4xl font-bold text-[#172b9b] font-seasons leading-tight">{product.name}</h1>
              {/* Ratings */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-yellow-500"> {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-current" />))} </div>
                <span className="text-sm text-gray-700">4.9 |</span> {/* Example */}
                <span className="text-sm text-gray-700 underline cursor-pointer"> 20 ratings </span> {/* Example */}
              </div>

              {/* Price per Item */}
              <div className="flex items-baseline gap-2 flex-wrap relative">
                <span className="text-3xl font-bold text-[#1428a0]">
                  ₹{pricePerRoll.toLocaleString('en-IN')}
                </span>
                 {originalPricePerRoll > pricePerRoll && (
                   <span className="text-lg text-gray-400 line-through">
                      ₹{originalPricePerRoll.toLocaleString('en-IN')}
                   </span>
                 )}
                {/* Updated text */}
                <span className="text-sm text-gray-500">per roll</span>
                   {/* Tooltip for roll coverage */}
                   <div className="relative inline-block ml-1">
                      <button onMouseEnter={() => setShowQuestionMark(true)} onMouseLeave={() => setShowQuestionMark(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Roll coverage information" > <HelpCircle className="w-4 h-4" /> </button>
                      {showQuestionMark && ( <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg z-20 font-lora"> Each roll covers approx. {rollCoverageSqFt} sq ft </motion.div> )}
                   </div>
                   {/* Save Percentage */}
                   {originalPricePerRoll > pricePerRoll && (
                      <span className="bg-[#172b9b] text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ml-2">
                         SAVE {Math.round(((originalPricePerRoll - pricePerRoll) / originalPricePerRoll) * 100)}%
                      </span>
                   )}
              </div>
              <p className="text-sm text-gray-500 font-lora italic -mt-4">inclusive of all taxes</p>

              {/* Size Display */}
              <div>
                 <label className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">Size</label>
                 <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 font-lora">
                     {sizeDisplay}
                 </div>
              </div>

              {/* --- Quantity Counter --- */}
               <div>
                 <label htmlFor="quantity-input" className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">Quantity</label>
                 <div className="flex items-center border border-gray-300 rounded-md w-max shadow-sm">
                     <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#172b9b]"> <Minus className="w-4 h-4" /> </button>
                     <input id="quantity-input" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-12 text-center border-l border-r border-gray-300 py-1.5 font-lora text-sm focus:outline-none focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b]" min={1} />
                     <button onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#172b9b]"> <Plus className="w-4 h-4" /> </button>
                 </div>
              </div>
              {/* --- END Quantity Counter --- */}

               {/* Order Help Button */}
               <div>
                  <button type="button" onClick={() => setSupportModalOpen(true)} className="text-sm text-blue-600 hover:underline focus:outline-none font-lora flex items-center gap-1">
                     <HelpCircle className="w-4 h-4" /> Need help placing the order?
                  </button>
                  <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
               </div>

              {/* PIN Code & Delivery */}
               <div>
                 <label htmlFor="pincode-input" className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">Check Delivery {includeInstallation ? '& Installation' : ''}</label>
                 <div className="flex gap-2">
                     <input id="pincode-input" type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} className="w-32 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm" placeholder="Enter PIN code" />
                 </div>
                 {pinCode.length === 6 && ( <div className="text-xs text-green-700 mt-1 font-lora"> ✓ Delivery {includeInstallation ? '& Installation available!' : 'available!'} Expected by {getDeliveryDate()}. </div> )}
                  {pinCode.length > 0 && pinCode.length < 6 && ( <div className="text-xs text-red-600 mt-1 font-lora"> Please enter a valid 6-digit PIN code. </div> )}
               </div>

              {/* Installation Option */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="install-checkbox-roll" checked={includeInstallation} onChange={(e) => setIncludeInstallation(e.target.checked)} className="w-4 h-4 text-[#172b9b] border-gray-300 rounded focus:ring-[#172b9b] focus:ring-offset-1" />
                <label htmlFor="install-checkbox-roll" className="text-sm font-medium text-gray-700 font-lora">
                  Include installation (+ ₹{installationCostPerRoll}/roll) {/* Updated label */}
                </label>
              </div>

              {/* Final Price Display */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <div className="text-sm text-gray-600 font-lora mb-1">Total Estimated Price ({quantity} Roll{quantity > 1 ? 's' : ''}):</div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl font-bold text-[#172b9b]"> ₹{finalPrice.toLocaleString('en-IN')} </span>
                      {originalFinalPrice > finalPrice && ( <span className="text-base text-gray-400 line-through"> ₹{originalFinalPrice.toLocaleString('en-IN')} </span> )}
                  </div>
                  <div className="text-xs text-gray-500 font-lora mt-1"> (Incl. product, {includeInstallation ? 'installation &' : '&'} taxes) </div>
                  {finalPrice > 3999 && ( <div className="mt-2 text-xs text-green-700 font-semibold font-lora"> 🎉 Yay! Free shipping included! </div> )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                   <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} className={`w-full sm:flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-150 flex items-center justify-center gap-2 text-base shadow-sm ${ addedToCart ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-[#172b9b] text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-700' }`} disabled={addedToCart} > {addedToCart ? ( <> <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Added </> ) : ( <> <ShoppingCart className="w-5 h-5" /> Add to Cart </> )} </motion.button>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-600" > <FaWhatsapp className="w-5 h-5" /> WhatsApp Order </a>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWishlistToggle} disabled={isLoadingWishlist} className={`p-3 border rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${ isWishlisted ? 'bg-red-50 border-red-200 text-red-500 focus:ring-red-300' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-red-500 focus:ring-gray-300' } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} > {isLoadingWishlist ? ( <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : ( <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} /> )} </motion.button>
              </div>

               {/* Product Features */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-200 pt-6 text-center">
                  <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/non-toxic-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">Non-toxic & VOC Free</span> </div>
                 <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/high-quality-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">Covers {rollCoverageSqFt} sq ft</span> </div>
                 <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/high-quality-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">High Quality Print</span> </div>
                 <div className="flex flex-col items-center gap-1 text-gray-600"> <img src="/lasts-years-blue.png" alt="" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold font-lora">Lasts 8-10 Years</span> </div>
               </div>
            </div>
          </div>

          {/* --- Lower Sections --- */}
          {/* ... (Keep Description, Related Products, FAQ, etc.) ... */}
           <div className="mt-16 pt-8 border-t border-gray-200">
                 <h2 className="text-2xl font-semibold text-[#172b9b] mb-4 font-seasons">Product Details</h2>
                 <div className="prose prose-sm max-w-none text-gray-600 font-lora">
                     <p>{product.description || 'No description available.'}</p>
                     {product.tags && product.tags.length > 0 && ( <p><strong>Tags:</strong> {product.tags.join(', ')}</p> )}
                     {product.category && <p><strong>Category:</strong> {product.category}</p>}
                     {product.skuId && <p><strong>SKU:</strong> {product.skuId}</p>}
                     {product.materials && product.materials.length > 0 && ( <p><strong>Materials:</strong> {product.materials.join(', ')}</p> )}
                 </div>
             </div>
           {relatedProducts.length > 0 && (
             <div className="mt-16 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-semibold text-[#172b9b] mb-6 font-seasons text-center"> You Might Also Like </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {relatedProducts.map(relProd => ( <ProductCard key={relProd._id || relProd.id} product={relProd} /> ))}
               </div>
             </div>
           )}
             <div className="mt-16 pt-8 border-t border-gray-200 max-w-3xl mx-auto">
             <h2 className="text-2xl font-semibold text-[#172b9b] mb-6 font-seasons text-center"> Frequently Asked Questions </h2>
             <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm bg-white">
               {[
                 { q: "How much area does one wallpaper roll cover?", a: `Each standard roll covers approximately ${rollCoverageSqFt} square feet. Use the quantity counter to select how many rolls you need.` },
                 { q: "How is installation cost calculated?", a: `Installation is charged per roll (${installationCostPerRoll}/roll). Simply select the 'Include installation' checkbox if you require this service.` },
                 { q: "What's the difference between rolls and custom wallpaper?", a: "Wallpaper rolls come in standard sizes with repeating patterns, ideal for covering larger areas. Custom wallpaper is printed exactly to your wall's dimensions, often featuring large murals." },
                 { q: "Can I order a sample?", a: "Yes, samples are often available. Please contact support to inquire about sample availability." },
                 { q: "How do I calculate rolls needed?", a: "Measure your wall's height and width in feet. Calculate total square footage (H x W). Divide by the roll coverage (${rollCoverageSqFt} sq ft) and round *up*. Order an extra roll for waste/repairs." },
               ].map((faq, index) => (
                 <div key={index}>
                   <button onClick={() => toggleFaq(index)} className="w-full py-3 px-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none" > <span className="text-sm font-medium text-gray-800 font-lora">{faq.q}</span> <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${ openFaqs[index] ? 'rotate-180' : '' }`} /> </button>
                   {openFaqs[index] && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-3 text-gray-600 text-sm font-lora bg-gray-50 border-t border-gray-100"> <div className="pt-2">{faq.a}</div> </motion.div> )}
                 </div>
               ))}
             </div>
           </div>


        </div>
      </div>
    </>
  );
};

export default WallRollDetail;

// import React, { useState, useEffect } from 'react';
// // Simple Support Modal
// import ReviewSection from '../components/Reviews/ReviewSection';
// const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
//         <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
//         <h2 className="text-lg font-bold mb-2 text-[#172b9b]">Need Help Placing Your Order?</h2>
//         <p className="mb-4 text-gray-700">Our support team is here to help! You can chat with us, call, or email for assistance with your order.</p>
//         <div className="flex flex-col gap-2">
//           <a href="mailto:support@example.com" className="text-[#172b9b] underline">Email Support</a>
//           <a href="tel:+911234567890" className="text-[#172b9b] underline">Call: +91 12345 67890</a>
//           {/* You can add a chat widget or link here */}
//         </div>
//       </div>
//     </div>
//   );
// };
// import { useParams, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   Heart, 
//   Star, 
//   ShoppingCart, 
//   ChevronLeft,
//   ChevronRight,
//   HelpCircle,
//   ChevronDown
// } from 'lucide-react';
// import { Helmet } from 'react-helmet-async';
// import { useCartStore } from '../stores/useCartStore';
// import { useWishlistStore } from '../stores/useWishlistStore';
// import ProductCard from '../components/Product/ProductCard';
// import { API_BASE_URL } from '../api/config';
// import { Product } from '../types';
// import { useAuthStore } from '../stores/useAuthStore';
// import { useNavigate } from 'react-router-dom';
// import { FaWhatsapp } from 'react-icons/fa';

// const WallRollDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { addItem } = useCartStore();
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
//   const { user } = useAuthStore();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [selectedMaterial, setSelectedMaterial] = useState('Non-woven Smooth');
//   const [numberOfRolls, setNumberOfRolls] = useState(2); // ++ CHANGED: Replaced height/width with numberOfRolls
//   const [includeInstallation, setIncludeInstallation] = useState(true);
//   const [pinCode, setPinCode] = useState('');
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
//   const [supportModalOpen, setSupportModalOpen] = useState(false);
//   const [materialGuideOpen, setMaterialGuideOpen] = useState(false);
//   // const [wallGuideOpen, setWallGuideOpen] = useState(false); // -- REMOVED
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [showQuestionMark, setShowQuestionMark] = useState(false);
//   const [imageList, setImageList] = useState<string[]>([]);
//   const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});

//   const toggleFaq = (index: number) => {
//     setOpenFaqs(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'auto' });
//     setLoading(true);
//     fetch(`${API_BASE_URL}/api/products/${id}`)
//       .then(r => r.json())
//       .then(data => {
//         setProduct(data);
//         setLoading(false);
//         const images = data.images && data.images.length > 0 ? data.images : ['https://via.placeholder.com/400x400?text=No+Image'];
//         fetch(`${API_BASE_URL}/api/products`).then(r => r.json()).then(all => {
//           const currentId = data.id || data._id;
//           const currentCategory = data.category || '';
//           const related = all.filter((p: Product) => {
//             const pid = p.id || p._id;
//             const pCategory = p.category || '';
//             if (!pCategory || !currentCategory) return false;
//             return pCategory === currentCategory && pid !== currentId;
//           }).slice(0, 4);
//           setRelatedProducts(related);
//         });
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   useEffect(() => {
//     if (product) {
//       const checkWishlistStatus = async () => {
//         const productId = product._id || product.id;
//         if (!productId) return;
        
//         if (user) {
//           setIsLoadingWishlist(true);
//           try {
//             const status = await useWishlistStore.getState().checkWishlistStatus(productId);
//             setIsWishlisted(status);
//           } catch (error) {
//             console.error('Error checking wishlist status:', error);
//           } finally {
//             setIsLoadingWishlist(false);
//           }
//         } else {
//           setIsWishlisted(isInWishlist(productId));
//         }
//       };
//       checkWishlistStatus();
//     }
//   }, [product, user, isInWishlist]);

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4 font-seasons">Product Not Found</h1>
//           <Link to="/wallroll" className="text-primary-600 hover:underline font-lora">
//             Back to Wallroll
//           </Link>
//         </div>
//       </div>
//     );
//   }
  
//   // -- REMOVED: width, height, totalArea calculations
//   // const width = Number(wallWidth) || 0;
//   // const height = Number(wallHeight) || 0;
//   // const totalArea = (width * height) / 144; // Convert square inches to square feet

//   const getDeliveryDate = () => {
//     const today = new Date();
//     const deliveryDate = new Date(today);
//     deliveryDate.setDate(today.getDate() + 3);
//     return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
//   };

//   const materialOptions = [
//     { name: 'Non-woven Smooth', price: 99 },
//     { name: 'Vinyl Matte', price: 119 },
//     { name: 'Glitter Finish', price: 119 },
//     { name: 'Canvas Texture', price: 149 },
//     { name: 'Linen Texture', price: 149 },
//     { name: 'Sandstone Texture', price: 149 },
//     { name: 'Leather Finish', price: 149 },
//     { name: 'Stroke Oil Brush Finish', price: 149 },
//     { name: 'Gold Foiling', price: 169 },
//     { name: 'Silk Finish (Silver)', price: 199 },
//     { name: 'Silk Finish (Gold)', price: 199 }
//   ];

//   const currentMaterial = materialOptions.find(m => m.name === selectedMaterial) || materialOptions[0];
//   // ++ CHANGED: basePrice now uses numberOfRolls state
//   const basePrice = currentMaterial.price * numberOfRolls; 
//   // -- REMOVED: rollCoverage calculation
//   // const rollCoverage = 55; // Each roll covers 55 sq ft
//   // -- REMOVED: numberOfRolls calculation
//   // const numberOfRolls = totalArea > 0 ? Math.ceil(totalArea / rollCoverage) : 0;
//   const installationCostPerRoll = 450;
//   const installationCost = includeInstallation ? (numberOfRolls * installationCostPerRoll) : 0;
//   const finalPrice = basePrice + installationCost;
//   const originalPrice = product.price;

//   const handleAddToCart = async () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     setAddedToCart(true);
//     setTimeout(() => setAddedToCart(false), 1500);
//     // ++ CHANGED: Pass numberOfRolls as quantity, remove customDimensions
//     await addItem(product, numberOfRolls, {
//       selectedMaterial
//     });
//   };

//   const handleWishlistToggle = async () => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     if (!product) return;
//     const productId = product._id || product.id;
//     if (!productId) return;
//     setIsLoadingWishlist(true);
//     try {
//       if (isWishlisted) {
//         await removeFromWishlist(productId);
//         setIsWishlisted(false);
//       } else {
//         await addToWishlist(product);
//         setIsWishlisted(true);
//       }
//     } catch (error) {
//       console.error('Error toggling wishlist:', error);
//     } finally {
//       setIsLoadingWishlist(false);
//     }
//   };

//   const mainImage = imageList[selectedImageIndex] || 'https://via.placeholder.com/400x400?text=No+Image';
//   const whatsappLink = `https://wa.me/?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}`;

//   return (
//     <>
//       <Helmet>
//         <title>{product.name} - Premium Wallpaper | Nagomi</title>
//         <meta name="description" content={product.description} />
//       </Helmet>
//       <div className="min-h-screen bg-white">
//         <div className="bg-white border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <nav className="flex items-center space-x-2 text-sm text-gray-500">
//               <Link to="/" className="text-[#172b9b] italic">Home</Link>
//               <span>/</span>
//               <Link to="/wallroll" className="text-[#172b9b] italic">Wallpaper rolls</Link>
//               <span>/</span>
//               <span className="text-[#172b9b] italic">{product.name}</span>
//             </nav>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             <div className="space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="relative h-[560px] sm:h-[640px] lg:h-[800px]"
//               >
//                 <img src={mainImage}
//               alt={product.name} className="w-full h-full object-contain object-top" />
//                 {imageList.length > 1 && (
//                   <>
//                     <button
//                       onClick={() => setSelectedImageIndex(prev => prev === 0 ? imageList.length - 1 : prev - 1)}
//                       className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => setSelectedImageIndex(prev => prev === imageList.length - 1 ? 0 : prev + 1)}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </>
//                 )}
//               </motion.div>
//             </div>

//             <div className="space-y-6">
//               {product.bestseller && (
//                 <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-sm font-bold mb-4">
//                   BESTSELLER
//                 </span>
//               )}
//               <h1 className="text-[40px] font-bold text-[#172b9b] mb-2 font-seasons">{product.name}</h1>
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="flex items-center text-yellow-500">
//                   {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-current" />))}
//                 </div>
//                 <span className="text-gray-700">4.8 |</span>
//                 <span className="text-gray-700 underline cursor-pointer"> 16 ratings </span>
//               </div>
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-2xl font-bold text-[#172b9b]">
//                   <span className="line-through font-bold text-[#172b9b]">₹119</span> ₹{currentMaterial.price} per roll
//                 </span>
//                 <button
//                   onMouseEnter={() => setShowQuestionMark(true)}
//                   onMouseLeave={() => setShowQuestionMark(false)}
//                   className="w-4 h-4 mb-4 bg-[#172b9b] text-white rounded-full flex items-center justify-center"
//                 >
//                   <HelpCircle className="w-4 h-4" />
//                 </button>
//                 <span className="bg-[#172b9b] text-white px-6 py-1 rounded-full text-xs font-bold shadow-lg">SAVE 25%</span>
//                 {showQuestionMark && (
//                   <div className="absolute bg-white border rounded-lg p-3 mt-20 shadow-lg z-20">
//                     <p className="text-sm">each roll cover 55 square feet</p>
//                   </div>
//                 )}
//               </div>
//               <span className="text-m italic font-bold text-[#172b9b]">inclusive of all taxes</span>
            

//               {/* ++ MODIFICATION: Replaced Wall Size with Number of Rolls Counter ++ */}
//               <div className="mb-6">
//                 <label htmlFor="roll-counter" className="block text-sm font-bold text-[#172b9b] mb-2">
//                   Number of Rolls
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setNumberOfRolls(prev => Math.max(1, prev - 1))} // Don't allow less than 1 roll
//                     className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-lg font-bold text-gray-600 hover:bg-gray-50"
//                     aria-label="Decrement roll count"
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     id="roll-counter"
//                     value={numberOfRolls}
//                     onChange={(e) => {
//                       const val = e.target.value ? parseInt(e.target.value, 10) : 1;
//                       setNumberOfRolls(Math.max(1, val)); // Ensure at least 1
//                     }}
//                     className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg font-lora"
//                     min={1}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setNumberOfRolls(prev => prev + 1)}
//                     className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-lg font-bold text-gray-600 hover:bg-gray-50"
//                     aria-label="Increment roll count"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <span className="text-medium text-gray-700 font-bold">
//                   Need help placing the order?{' '}
//                   <button type="button" className="text-[#172b9b] underline focus:outline-none" onClick={() => setSupportModalOpen(true)}>
//                     Click here
//                   </button>
//                 </span>
//                 <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-bold text-[#172b9b] mb-2">PIN Code</label>
//                 <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} className="w-40 px-3 py-2 border border-gray-300 rounded-lg font-lora" placeholder="Enter PIN code" />
//                 {pinCode && (<div className="text-xs text-gray-700 mt-1 font-lora">Expected delivery by {getDeliveryDate()}</div>)}
//               </div>
//               <div className="mb-6 flex items-center gap-2">
//                 <input type="checkbox" checked={includeInstallation} onChange={() => setIncludeInstallation(v => !v)} className="w-5 h-5 text-[#172b9b] border-gray-300 rounded focus:ring-[#172b9b]" id="install-checkbox" />
//                 <label htmlFor="install-checkbox" className="text-sm font-medium text-[#172b9b]">Include installation (₹450/roll)</label>
//               </div>
//               <div className="mb-6">
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg font-bold text-[#172b9b]">
//                     Final Price: <span className="line-through text-[#172b9b]">₹{originalPrice}</span> ₹{finalPrice.toFixed(0)}
//                   </span>
//                 </div>
//                 <div className="text-xs italic text-[#172b9b]">inclusive of all taxes</div>
//               </div>
//               {finalPrice > 3999 && (<div className="mb-6 text-green-700 font-semibold">YAY! You are eligible for free shipping!</div>)}
//               <div className="flex gap-4 mb-8">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleAddToCart}
//                   className={`flex-1 py-2 px-2 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#172b9b] text-white hover:bg-[#1a2f8a]'}`}
//                   disabled={addedToCart}
//                 >
//                   {addedToCart ? (<span className="inline-flex items-center gap-1"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Added to Cart</span>) : (<><ShoppingCart className="w-5 h-5" />Add to Cart</>)}
//                 </motion.button>
//                 <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white py-2 px-2 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg">
//                   <FaWhatsapp className="w-6 h-6" />Order on WhatsApp
//                 </a>
//                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWishlistToggle} disabled={isLoadingWishlist} className={`p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${isWishlisted ? 'bg-red-50 border-red-300' : ''} ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                   <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}`} />
//                 </motion.button>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center border-t pt-6">
//                 <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/non-toxic-blue.png" alt="Non-toxic & VOC Free" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">Non-toxic & VOC Free</span></div>
//                 <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/custom-fit-blue.png" alt="Custom Fitting" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">Custom Fitting</span></div>
//                 <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/high-quality-blue.png" alt="High Quality Print" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">High Quality Print</span></div>
//                 <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/lasts-years-blue.png" alt="Lasts 8-10 Years" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">Lasts 8-10 Years</span></div>
//               </div>
//             </div>
//           </div>
          
//           {/* {relatedProducts.length > 0 && (
//             <div className="mt-20">
//               <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {relatedProducts.map(p => <ProductCard key={p.id || p._id} product={p} />)}
//               </div>
//             </div>
//           )} */}




//                        {/* FAQ Section */}
//                       <div className="mt-20">
//                         <h2 className="text-3xl font-bold text-[#172b9b] mb-8 text-center">
//                           Frequently Asked Questions (FAQs)
//                         </h2>
//                         <div className="space-y-0">
//                           {[
//                             {
//                               question: "Why do I have to share 'Material' and 'Wall Size'?",
//                               answer: "Material and wall size are essential for accurate pricing and ensuring the right amount of wallpaper is ordered for your specific project. Different materials have different costs and installation requirements."
//                             },
//                             {
//                               question: "What happens after I place an order?",
//                               answer: "After placing your order, you'll receive a confirmation email with order details. Our team will review your specifications and contact you within 24 hours to confirm the order and discuss installation timeline."
//                             },
//                             {
//                               question: "Are wallpapers easy to clean and durable?",
//                               answer: "Yes, our premium wallpapers are designed for durability and easy maintenance. They are washable, stain-resistant, and can last 8-10 years with proper care. Regular dusting and occasional gentle cleaning with a damp cloth is sufficient."
//                             },
//                             {
//                               question: "Do you provide customisation? Can I share a design?",
//                               answer: "Absolutely! We offer custom wallpaper designs. You can share your design ideas, photos, or inspiration, and our design team will work with you to create a unique wallpaper that matches your vision and space requirements."
//                             },
//                             {
//                               question: "How to ensure my wall is ready for wallpaper?",
//                               answer: "Your wall should be clean, dry, and smooth. Remove any existing wallpaper, fill cracks or holes, and ensure the surface is free from dust and grease. Our installation team will assess the wall condition during the site visit."
//                             },
//                             {
//                               question: "What are the payment options available?",
//                               answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. Payment is processed securely, and you can choose to pay the full amount upfront or opt for our flexible payment plans."
//                             }
//                           ].map((faq, index) => (
//                             <div key={index} className="border-b border-gray-200 last:border-b-0">
//                               <button
//                                 onClick={() => toggleFaq(index)}
//                                 className="w-full py-4 px-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
//                               >
//                                 <span className="text-gray-700 font-medium">{faq.question}</span>
//                                 <ChevronDown 
//                                   className={`w-5 h-5 text-gray-500 transition-transform ${
//                                     openFaqs[index] ? 'rotate-180' : ''
//                                   }`}
//                                 />
//                               </button>
//                               {openFaqs[index] && (
//                                 <div className="px-6 pb-4 text-gray-600 text-sm">
//                                   {faq.answer}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                       {/* <Review /> */}

//         </div>
//       </div>
//     </>
//   );
// };

// export default WallRollDetail;