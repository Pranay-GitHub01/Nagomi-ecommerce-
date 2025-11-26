// src/pages/ProductDetail.tsx
import ReviewSection from '../components/Review/ReviewSection';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  ShoppingCart,
  ChevronLeft, // Re-added ChevronLeft
  ChevronRight, // Re-added ChevronRight
  HelpCircle,
  ChevronDown,
  Loader2,
  ImageOff
} from 'lucide-react'; // Make sure Chevrons are imported
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../stores/useCartStore'; // Adjust path as needed
import { useWishlistStore } from '../stores/useWishlistStore'; // Adjust path as needed
import ProductCard from '../components/Product/ProductCard'; // Adjust path as needed
import { API_BASE_URL } from '../api/config'; // Adjust path as needed
import { Product } from '../types'; // Adjust path as needed
import { useAuthStore } from '../stores/useAuthStore'; // Adjust path as needed
import { FaWhatsapp } from 'react-icons/fa';

// --- Modals (Keep original structure) ---
// WallGuideModal, MaterialGuideModal, SupportModal...
// ... (Modal code omitted for brevity - no changes needed here) ...
const WallGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-lg font-bold mb-2 text-[#172b9b]">Wall Size Guide</h2>
        <ul className="list-disc pl-5 text-gray-700 mb-2">
          <li>Measure the height and width of your wall in inches or centimeters.</li>
          <li>Multiply height by width to get the total area in square feet.</li>
          <li>For multiple walls, add the areas together.</li>
        </ul>
        <p className="text-xs text-gray-500">Contact support if you need help measuring your wall.</p>
      </div>
    </div>
  );
};
const MaterialGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative animate-fade-in-scale">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
          <h2 className="text-xl font-semibold mb-3 text-[#172b9b] font-seasons">Wallpaper Material Guide</h2>
          <p className="mb-4 text-gray-600 font-lora text-sm">Choose the best material for your needs:</p> {/* Adjusted text size */}
          <ul className="space-y-3 text-gray-700 font-lora text-sm"> {/* Adjusted text size */}
            <li><b>Non-woven Smooth (₹99/sq ft):</b> Eco-friendly, breathable, easy to install & remove (dry strippable). Matte finish. Great for most rooms.</li>
            <li><b>Vinyl Matte (₹119/sq ft):</b> Durable and washable surface. Moisture-resistant, suitable for kitchens/bathrooms. Matte finish.</li>
            <li><b>Glitter Finish (₹119/sq ft):</b> Adds subtle sparkle. Durable vinyl base. Good for feature walls.</li>
            <li><b>Canvas Texture (₹149/sq ft):</b> Mimics painted canvas. Adds depth and a luxurious, artistic touch.</li>
            <li><b>Linen Texture (₹149/sq ft):</b> Subtle woven texture. Elegant and sophisticated.</li>
            {/* Add other materials similarly */}
            <li><b>...other materials...</b></li>
          </ul>
          <p className="text-xs text-gray-500 mt-4 font-lora italic">Contact support for personalized recommendations.</p>
        </div>
      </div>
    );
};
const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-lg font-bold mb-2 text-[#172b9b]">Need Help Placing Your Order?</h2>
        <p className="mb-4 text-gray-700">Our support team is here to help! You can chat with us, call, or email for assistance with your order.</p>
        <div className="flex flex-col gap-2">
          {/* Update email/phone if needed */}
          <a href="mailto:support@example.com" className="text-[#172b9b] underline">Email Support</a>
          <a href="tel:+911234567890" className="text-[#172b9b] underline">Call: +91 12345 67890</a>
          {/* Consider adding WhatsApp link here too */}
        </div>
      </div>
    </div>
  );
};


// --- ProductDetail Component ---

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // State variables
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<(Product & { displayImageSrc?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Re-added selectedImageIndex
  const [selectedMaterial, setSelectedMaterial] = useState('Non-woven Smooth');
  const [quantity] = useState(1);
  const [wallHeight, setWallHeight] = useState<number | ''>(10);
  const [wallWidth, setWallWidth] = useState<number | ''>(10);
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [materialGuideOpen, setMaterialGuideOpen] = useState(false);
  const [wallGuideOpen, setWallGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showQuestionMark, setShowQuestionMark] = useState(false);
  const [imageList, setImageList] = useState<string[]>(['/placeholder.jpg']);
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});

  // State for main image loading
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [mainImageLoadError, setMainImageLoadError] = useState(false);

  const toggleFaq = (index: number) => { /* ... Keep original logic ... */
    setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // --- Calculations (Keep original) ---
  // ... (Calculations code omitted for brevity) ...
   const widthInches = Number(wallWidth) || 0;
  const heightInches = Number(wallHeight) || 0;
  const totalAreaSqFt = Math.max(10, (widthInches * heightInches) / 144);

  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  };

   const materialOptions = [ /* ... Keep original options ... */
    { name: 'Non-woven Smooth', price: 99 },
    { name: 'Vinyl Matte', price: 119 },
    { name: 'Glitter Finish', price: 119 },
    { name: 'Canvas Texture', price: 149 },
    { name: 'Linen Texture', price: 149 },
    { name: 'Sandstone Texture', price: 149 },
    { name: 'Leather Finish', price: 149 },
    { name: 'Stroke Oil Brush Finish', price: 149 },
    { name: 'Gold Foiling', price: 169 },
    { name: 'Silk Finish (Silver)', price: 199 },
    { name: 'Silk Finish (Gold)', price: 199 }
   ];

  const currentMaterial = materialOptions.find(m => m.name === selectedMaterial) || materialOptions[0];
  const basePrice = currentMaterial.price * totalAreaSqFt;
  const installationCost = includeInstallation ? (9 * totalAreaSqFt) : 0;
  const finalPrice = Math.round(basePrice + installationCost);
  const originalBasePricePerSqFt = (product?.originalPrice && product?.price) ? (product.originalPrice / product.price * currentMaterial.price) : 119;
  const originalPriceCalculated = Math.round(originalBasePricePerSqFt * totalAreaSqFt + installationCost);


  // --- Data Fetching Effect (Keep corrected image logic) ---
   useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setLoading(true);
    setImageList(['/placeholder.jpg']);
    setSelectedImageIndex(0); // Reset index on new product load
    setIsMainImageLoading(true);
    setMainImageLoadError(false);

    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (!data || typeof data !== 'object') throw new Error('Invalid product data received');
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
         fetch(`${API_BASE_URL}/api/products`)
          .then(r => r.json())
          .then(allProducts => {
            if (!Array.isArray(allProducts)) return;
            const currentId = data._id || data.id;
            const currentCategory = data.category || '';
            const related = allProducts.filter((p: Product) => {
              const pId = p._id || p.id;
              const pCategory = p.category || '';
              return pCategory && pCategory === currentCategory && pId !== currentId;
            }).slice(0, 4);

             const relatedWithImages = related.map((prod: Product) => {
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
  useEffect(() => { /* ... Keep original logic ... */
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

  // --- Event Handlers ---
   const handleAddToCart = async () => { /* ... Keep original logic ... */
    if (!product) return;
    if (!user) {
      navigate('/login?redirect=/product/' + id);
      return;
    }
     const itemToAdd = {
      ...product,
      _id: product._id || product.id || '',
      name: product.name || 'Unnamed Product',
      price: currentMaterial.price, // Price per sq ft
    };
    await addItem(itemToAdd, totalAreaSqFt, { // Pass area as quantity
      selectedMaterial: selectedMaterial,
      customDimensions: { width: widthInches, height: heightInches },
      isInstallationIncluded: includeInstallation,
      finalItemPrice: finalPrice
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
   };
   const handleWishlistToggle = async () => { /* ... Keep original logic ... */
     if (!product) return;
     if (!user) {
       navigate('/login?redirect=/product/' + id);
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
  const handleMainImageLoad = () => {
      setIsMainImageLoading(false);
      setMainImageLoadError(false);
  };
  const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error(`Image Error: Failed to load ${mainImage}`, e);
      setIsMainImageLoading(false);
      setMainImageLoadError(true);
  };

   // Update Loading State when Image URL Changes
   useEffect(() => {
        setIsMainImageLoading(true);
        setMainImageLoadError(false);
    }, [selectedImageIndex, imageList]); // Reset when index or list changes


  // --- Render Logic ---
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Keep min-h-screen for loading state
  }
  if (!product) {
    return ( // Keep min-h-screen for not found state
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-seasons">Product Not Found</h1>
          <Link to="/wallpapers" className="text-primary-600 hover:underline font-lora">Back to Wallpapers</Link>
        </div>
      </div>
    );
  }

  // Use the image at the current index
  const mainImage = imageList[selectedImageIndex] || '/placeholder.jpg';
  const whatsappLink = `https://wa.me/918588825148?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(ID%3A%20${product._id || product.id}).%20My%20wall%20is%20${wallWidth}%22 W x ${wallHeight}%22 H.`;


  return (
    <>
      <Helmet>
        <title>{product.name} - Premium Wallpaper | Nagomi</title>
        <meta name="description" content={product.description || `High-quality custom wallpaper: ${product.name}`} />
      </Helmet>
      {/* --- REMOVED min-h-screen from this div --- */}
      <div className="bg-white pb-16"> {/* Add padding-bottom instead if needed */}
        {/* Breadcrumbs */}
         <div className="bg-white border-b border-gray-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
             <nav className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link to="/" className="text-[#172b9b] italic">Home</Link>
                  <span>/</span>
                  <Link to="/wallpapers" className="text-[#172b9b] italic">Wallpapers</Link>
                  <span>/</span>
                  <span className="text-[#172b9b] italic">{product.name}</span>
             </nav>
           </div>
         </div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {/* Adjusted horizontal padding */}
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

            {/* --- Left Section - Product Image (with conditional arrows) --- */}
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg shadow-sm"
              >
                 {/* Loader */}
                 {isMainImageLoading && !mainImageLoadError && ( <div className="absolute inset-0 flex items-center justify-center z-10"><Loader2 className="w-10 h-10 text-gray-400 animate-spin" /></div> )}
                 {/* Error Placeholder */}
                 {mainImageLoadError && !isMainImageLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center z-10"><ImageOff className="w-12 h-12 mb-2" /><span className="text-sm">Image cannot be loaded</span></div> )}
                 {/* Image */}
                 <motion.img
                   key={mainImage}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: (!isMainImageLoading && !mainImageLoadError) ? 1 : 0 }}
                   transition={{ duration: 0.3 }}
                   src={mainImage}
                   alt={product.name}
                   className="absolute inset-0 w-full h-full object-cover z-0" // Use object-cover
                   onLoad={handleMainImageLoad}
                   onError={handleMainImageError}
                 />

                 {/* --- CONDITIONAL Arrow Buttons --- */}
                 {imageList.length > 1 && (
                   <>
                     <button
                       onClick={() => setSelectedImageIndex(prev => prev === 0 ? imageList.length - 1 : prev - 1)}
                       className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" // Ensure z-index is high
                       aria-label="Previous image"
                     >
                       <ChevronLeft className="w-5 h-5 text-gray-800" />
                     </button>
                     <button
                       onClick={() => setSelectedImageIndex(prev => prev === imageList.length - 1 ? 0 : prev + 1)}
                       className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" // Ensure z-index is high
                       aria-label="Next image"
                     >
                       <ChevronRight className="w-5 h-5 text-gray-800" />
                     </button>
                   </>
                 )}
                 {/* --- END CONDITIONAL Arrows --- */}

              </motion.div>
              {/* Thumbnails are removed */}
            </div>


            {/* Right Section - Product Details (Keep original structure) */}
            <div className="space-y-6">
                {/* ... (Keep all original content from Bestseller badge down to Product Features) ... */}
                  {/* Bestseller Badge */}
              {product.bestseller && (
                <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-sm font-bold">
                  BESTSELLER
                </span>
              )}

              {/* Product Title */}
              <h1 className="text-[40px] font-bold text-[#172b9b] mb-2 font-seasons">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-700">4.9 |</span>
                <span className="text-gray-700 underline cursor-pointer"> 20 ratings </span>
              </div>

               {/* Pricing */}
              <div className="flex items-center gap-2 mb-1 relative">
                <span className="text-2xl font-bold text-[#172b9b]">
                   {originalBasePricePerSqFt > currentMaterial.price && (
                     <span className="line-through font-normal text-gray-400 mr-1">₹{originalBasePricePerSqFt.toFixed(0)}</span>
                   )}
                   ₹{currentMaterial.price}/square feet
                </span>
                <button
                  onMouseEnter={() => setShowQuestionMark(true)}
                  onMouseLeave={() => setShowQuestionMark(false)}
                  className="w-4 h-4 bg-[#172b9b] text-white rounded-full flex items-center justify-center relative -top-1"
                >
                  <HelpCircle className="w-4 h-4 p-0.5" />
                </button>
                 {originalBasePricePerSqFt > currentMaterial.price && (
                    <span className="bg-[#172b9b] text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ml-2">
                       SAVE {Math.round(((originalBasePricePerSqFt - currentMaterial.price) / originalBasePricePerSqFt) * 100)}%
                    </span>
                 )}
                {showQuestionMark && (
                  <div className="absolute bg-white border rounded-lg p-3 mt-1 shadow-lg z-20 top-full left-0 w-max max-w-xs">
                    <p className="text-sm">Wallpaper is custom printed per your wall size</p>
                  </div>
                )}
              </div>
              <span className="text-sm italic font-medium text-gray-600">inclusive of all taxes</span>

              {/* Material Selection */}
               <div className="mb-6">
                 <label className="block text-sm font-bold text-[#172b9b] mb-2">
                   Material{' '}
                   <span
                     className="text-[#172b9b] italic underline cursor-pointer font-normal"
                     onClick={() => setMaterialGuideOpen(true)}
                     tabIndex={0} role="button" aria-label="Open material guide"
                   >
                     (Guide)
                   </span>
                 </label>
                 <MaterialGuideModal open={materialGuideOpen} onClose={() => setMaterialGuideOpen(false)} />
                 <select
                   value={selectedMaterial}
                   onChange={(e) => setSelectedMaterial(e.target.value)}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#172b9b] focus:border-[#172b9b]"
                 >
                   {materialOptions.map(material => (
                     <option key={material.name} value={material.name}>
                       {material.name}
                     </option>
                   ))}
                 </select>
               </div>

              {/* Wall Size Input */}
               <div className="mb-6">
                 <label className="block text-sm font-bold text-[#172b9b] mb-2">
                   Wall Size{' '}
                   <span
                     className="italic text-[#172b9b] underline cursor-pointer font-normal"
                     onClick={() => setWallGuideOpen(true)}
                     tabIndex={0} role="button" aria-label="Open wall size guide"
                   >
                     (Guide)
                   </span>
                 </label>
                 <WallGuideModal open={wallGuideOpen} onClose={() => setWallGuideOpen(false)} />
                 <div className="flex gap-4 items-end">
                   <div>
                     <label className="block text-xs text-gray-500 mb-1 font-bold">Height</label>
                     <div className="flex items-center">
                       <input
                         type="number" value={wallHeight}
                         onChange={(e) => setWallHeight(e.target.value ? parseInt(e.target.value, 10) : '')}
                         className="w-20 px-2 py-1 border border-gray-300 rounded font-lora" min={1}
                       />
                       <span className="ml-1 text-xs font-lora">inches</span>
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs text-gray-500 mb-1 font-bold">Width</label>
                     <div className="flex items-center">
                       <input
                         type="number" value={wallWidth}
                         onChange={(e) => setWallWidth(e.target.value ? parseInt(e.target.value, 10) : '')}
                         className="w-20 px-2 py-1 border border-gray-300 rounded font-lora" min={1}
                       />
                       <span className="ml-1 text-xs font-lora">inches</span>
                     </div>
                   </div>
                 </div>
                 <div className="text-sm text-gray-700 mt-2 font-bold">
                   Total Area: {totalAreaSqFt.toFixed(1)} square feet
                 </div>
               </div>

               {/* Order Help */}
              <div className="mb-6">
                <span className="text-medium text-gray-700 font-bold">
                  Need help placing the order?{' '}
                  <button
                    type="button"
                    className="text-[#172b9b] underline focus:outline-none"
                    onClick={() => setSupportModalOpen(true)}
                  >
                    Click here
                  </button>
                </span>
                <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
              </div>

              {/* PIN Code */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#172b9b] mb-2">PIN Code</label>
                <input
                  type="text" value={pinCode} maxLength={6}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-lg font-lora"
                  placeholder="Enter PIN code"
                />
                 {pinCode.length === 6 && (
                   <div className="text-xs text-gray-700 mt-1 font-lora">
                     Expected delivery by {getDeliveryDate()}
                   </div>
                 )}
              </div>

              {/* Installation Option */}
              <div className="mb-6 flex items-center gap-2">
                <input
                  type="checkbox" checked={includeInstallation}
                  onChange={() => setIncludeInstallation(v => !v)}
                  className="w-5 h-5 text-[#172b9b] border-gray-300 rounded focus:ring-[#172b9b]"
                  id="install-checkbox"
                />
                <label htmlFor="install-checkbox" className="text-sm font-medium text-[#172b9b]">
                  Include installation (₹9/square feet)
                </label>
              </div>

              {/* Final Price */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#172b9b]">
                    Final Price:
                     {originalPriceCalculated > finalPrice && (
                       <span className="line-through text-gray-400 font-normal mr-1">₹{originalPriceCalculated.toLocaleString('en-IN')}</span>
                     )}
                     ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-xs italic text-[#172b9b]">inclusive of all taxes</div>
              </div>

              {/* Shipping Message */}
               {finalPrice > 3999 && (
                 <div className="mb-6 text-green-700 font-semibold">
                   YAY! You are eligible for free shipping!
                 </div>
               )}

               {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                 <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                   className={`flex-1 py-2 px-2 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${
                     addedToCart ? 'bg-green-600 text-white' : 'bg-[#172b9b] text-white hover:bg-[#1a2f8a]'
                   }`}
                  disabled={addedToCart}
                >
                  {addedToCart ? ( <span className="inline-flex items-center gap-1"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Added to Cart</span> ) : ( <> <ShoppingCart className="w-5 h-5" /> Add to Cart </> )}
                </motion.button>
                <a
                  href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-2 px-2 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <FaWhatsapp className="w-6 h-6" /> Order on WhatsApp
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleWishlistToggle} disabled={isLoadingWishlist}
                  className={`p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${ isWishlisted ? 'bg-red-50 border-red-300' : '' } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                   {isLoadingWishlist ? ( <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ) : ( <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}`} /> )}
                </motion.button>
              </div>

              {/* Product Features */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center border-t pt-6">
                <div className="flex items-center justify-center gap-3 text-gray-700"> <img src="/non-toxic-blue.png" alt="Non-toxic & VOC Free" className="w-12 h-12" /> <span className="text-[15px] font-semibold italic text-center">Non-toxic & VOC Free</span> </div>
                <div className="flex items-center justify-center gap-3 text-gray-700"> <img src="/custom-fit-blue.png" alt="Custom Fitting" className="w-12 h-12" /> <span className="text-[15px] font-semibold italic text-center">Custom Fitting</span> </div>
                <div className="flex items-center justify-center gap-3 text-gray-700"> <img src="/high-quality-blue.png" alt="High Quality Print" className="w-12 h-12" /> <span className="text-[15px] font-semibold italic text-center">High Quality Print</span> </div>
                <div className="flex items-center justify-center gap-3 text-gray-700"> <img src="/lasts-years-blue.png" alt="Lasts 8-10 Years" className="w-12 h-12" /> <span className="text-[15px] font-semibold italic text-center">Lasts 8-10 Years</span> </div>
              </div>
            </div>
          </div>

          {/* --- Lower Sections (Keep original structure) --- */}
          {/* ... (Related Products, FAQ, Customers Also Bought, etc.) ... */}
           {/* Related Products Section */}
      

           {/* FAQ Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-[#172b9b] mb-8 text-center">
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-0 max-w-3xl mx-auto">
                 {[
                  { question: "Why do I have to share 'Material' and 'Wall Size'?", answer: "Material and wall size are essential for accurate pricing and ensuring the right amount of wallpaper is ordered for your specific project. Different materials have different costs and installation requirements." },
                  { question: "What happens after I place an order?", answer: "After placing your order, you'll receive a confirmation email with order details. Our team will review your specifications and contact you within 24 hours to confirm the order and discuss installation timeline." },
                  { question: "Are wallpapers easy to clean and durable?", answer: "Yes, our premium wallpapers are designed for durability and easy maintenance. They are washable, stain-resistant, and can last 8-10 years with proper care. Regular dusting and occasional gentle cleaning with a damp cloth is sufficient." },
                  { question: "Do you provide customisation? Can I share a design?", answer: "Absolutely! We offer custom wallpaper designs. You can share your design ideas, photos, or inspiration, and our design team will work with you to create a unique wallpaper that matches your vision and space requirements." },
                  { question: "How to ensure my wall is ready for wallpaper?", answer: "Your wall should be clean, dry, and smooth. Remove any existing wallpaper, fill cracks or holes, and ensure the surface is free from dust and grease. Our installation team will assess the wall condition during the site visit." },
                  { question: "What are the payment options available?", answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. Payment is processed securely, and you can choose to pay the full amount upfront or opt for our flexible payment plans." }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full py-4 px-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 font-medium">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${ openFaqs[index] ? 'rotate-180' : '' }`} />
                    </button>
                    {openFaqs[index] && (
                      <motion.div
                         initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                         className="px-6 pb-4 text-gray-600 text-sm bg-gray-50 border-t"
                       >
                         {faq.answer}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

           {/* Customers Also Bought */}
            {/* ... placeholder ... */}
           {/* Recently Viewed */}
            {/* ... placeholder ... */}
           {/* Reviews Section */}
<ReviewSection   productId={product._id || product.id} 
    productName={product.name}/>
            {/* ... placeholder ... */}


        </div> {/* End max-w-7xl */}
      </div> {/* End main wrapper div */}
    </>
  );
};

export default ProductDetail;