import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  // Removed Plus, Minus as quantity counter is removed
  Loader2,
  ImageOff,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Review from "../components/Review/Review"; // Assuming Review component exists
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { Product } from "../types/index";
import { useAuthStore } from "../stores/useAuthStore";
import { FaWhatsapp } from "react-icons/fa";
import { API_BASE_URL } from "../api/config";

// --- MODALS (Keep Unchanged) ---
const WallGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    if (!open) return null;
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"> <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"> <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" > &times; </button> <h2 className="text-lg font-bold mb-2 text-[#172b9b]"> Wall Size Guide </h2> <ul className="list-disc pl-5 text-gray-700 mb-2"> <li> Measure the height and width of your wall in inches or centimeters. </li> <li> Multiply height by width to get the total area in square feet. </li> <li> For multiple walls, add the areas together. </li> </ul> <p className="text-xs text-gray-500"> Contact support if you need help measuring your wall. </p> </div> </div> );
};
const MaterialGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    if (!open) return null;
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"> <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"> <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" > &times; </button> <h2 className="text-lg font-bold mb-2 text-[#172b9b]"> Material Guide </h2> <ul className="list-disc pl-5 text-gray-700 mb-2"> <li> <b>Canvas:</b> Premium quality, durable, and perfect for wall art display. </li> <li> <b>Premium Paper:</b> High-quality paper with excellent color reproduction. </li> <li> <b>Vinyl:</b> Water-resistant and easy to clean, ideal for any room. </li> </ul> <p className="text-xs text-gray-500"> Contact support for more details on material options. </p> </div> </div> );
};
const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    if (!open) return null;
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"> <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"> <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" > &times; </button> <h2 className="text-lg font-bold mb-2 text-[#172b9b]"> Need Help Placing Your Order? </h2> <p className="mb-4 text-gray-700"> Our support team is here to help! You can chat with us, call, or email for assistance with your order. </p> <div className="flex flex-col gap-2"> <a href="mailto:support@example.com" className="text-[#172b9b] underline" > Email Support </a> <a href="tel:+919876543210" className="text-[#172b9b] underline" > Call: +91 98765 43210 </a> </div> </div> </div> );
};
// --- END MODALS ---

const WallArtDetail: React.FC = () => {
  // --- Hooks ---
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // --- State ---
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  // Quantity is now fixed at 1 for Wall Art based on this change
  const quantity = 1;
  const [pinCode, setPinCode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [materialGuideOpen, setMaterialGuideOpen] = useState(false);
  const [wallGuideOpen, setWallGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});
  const [pinCodeChecked, setPinCodeChecked] = useState(false);
  const [isPinCodeValid, setIsPinCodeValid] = useState(false);
  const [includeInstallation, setIncludeInstallation] = useState(false);

  // Custom size state (potentially remove if wall art never uses custom size)
  const [selectedMaterial, setSelectedMaterial] = useState("Canvas");
  const [wallHeight, setWallHeight] = useState<number | "">(24);
  const [wallWidth, setWallWidth] = useState<number | "">(36);

  // --- Image state ---
  const [imageList, setImageList] = useState<string[]>(['/placeholder.jpg']);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [mainImageLoadError, setMainImageLoadError] = useState(false);

  // --- Constants ---
  const INSTALLATION_CHARGE = 499;
  const eligiblePinCodes = [ "110001", "110021", "110048", "122001", "400001", "560001", "700001" ];

  // --- Data Fetching Effect ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setLoading(true);
    setImageList(['/placeholder.jpg']);
    setSelectedImageIndex(0);
    setIsMainImageLoading(true);
    setMainImageLoadError(false);
    setProduct(null);

    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((r) => { if (!r.ok) return Promise.reject(new Error("Product not found")); return r.json(); })
      .then((data: Product) => {
        if ((data.category || '').toLowerCase() !== 'wall-art') { console.warn("Fetched product category might not be wall-art:", data.category); }
        setProduct(data);
        setSelectedVariantIndex(0);
        setSelectedSizeIndex(0);
      })
      .catch((err) => { console.error("Error fetching product details:", err); setProduct(null); })
      .finally(() => setLoading(false));
  }, [id]);

  // --- Effect to update imageList based on product data and variant ---
  useEffect(() => {
    if (!product) {
        setImageList(['/placeholder.jpg']); setIsMainImageLoading(false); setMainImageLoadError(true); return;
    };
    let sourceImageArray: (string | null | undefined)[] | undefined = [];
    const currentVariantData = product.variants?.[selectedVariantIndex];
    if (Array.isArray(currentVariantData?.images) && currentVariantData.images.length > 0 && currentVariantData.images[0]) {
        sourceImageArray = currentVariantData.images;
    } else if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
        sourceImageArray = product.images;
    }
    let processedImages: string[] = [];
    if (sourceImageArray && sourceImageArray.length > 0) {
      processedImages = sourceImageArray
        .map((pathStr): string => {
          if (!pathStr) return '';
          if (pathStr.startsWith('http')) return pathStr;
          const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
          const imagePath = pathStr.startsWith('/') ? pathStr.substring(1) : pathStr;
          return `${baseUrl}/${imagePath}`;
        })
        .filter(url => url !== '');
    }
    setImageList(processedImages.length > 0 ? processedImages : ['/placeholder.jpg']);
    setSelectedImageIndex(0); setIsMainImageLoading(true); setMainImageLoadError(false);
  }, [product, selectedVariantIndex]);

  // --- Wishlist Status Effect ---
  useEffect(() => {
     if (product) {
       const productId = product._id || product.id; if (!productId) return;
       const checkStatus = async () => {
         setIsLoadingWishlist(true);
         try { const status = user ? await checkWishlistStatus(productId) : isInWishlist(productId); setIsWishlisted(status); }
         catch (error) { console.error("Error checking wishlist status:", error); setIsWishlisted(false); }
         finally { setIsLoadingWishlist(false); }
       }; checkStatus();
     } else { setIsWishlisted(false); }
  }, [product, user, isInWishlist, checkWishlistStatus]);

  // --- Derived State & Price Logic ---
  const currentVariant = product?.variants?.[selectedVariantIndex];
  const hasPredefinedSizes = product?.category?.toLowerCase() === 'wall-art' && Array.isArray(currentVariant?.size) && currentVariant.size.length > 0 && !!currentVariant.size[0];
 const parsePrice = (priceStr?: string | number): number => {
    if (priceStr === undefined || priceStr === null) return 0;
    if (typeof priceStr === 'number') return isNaN(priceStr) ? 0 : priceStr;

    // Remove currency symbols, commas, and any non-numeric characters except the decimal point
    const cleanedString = String(priceStr).replace(/[^0-9.]/g, "");
    if (!cleanedString) return 0; // Return 0 if the string becomes empty after cleaning

    const num = parseFloat(cleanedString); // Use parseFloat for better decimal handling

    return isNaN(num) ? 0 : num; // Return 0 if the result is NaN
  };

    // --- Recalculate Prices ---
    let pricePerItem = 0;
    let originalPricePerItem = 0;

    if (hasPredefinedSizes && currentVariant) {
      pricePerItem = parsePrice(currentVariant.sellingPrice?.[selectedSizeIndex]);
      originalPricePerItem = parsePrice(currentVariant.mrp?.[selectedSizeIndex]);
    } else {
      pricePerItem = product?.price ?? 0;
      originalPricePerItem = product?.originalPrice ?? 0;
    }

    // Now quantity is always 1 for price calculations
    const basePrice = pricePerItem * 1; // quantity is 1
    const installationCost = (hasPredefinedSizes && includeInstallation) ? (INSTALLATION_CHARGE * 1) : 0; // quantity is 1
    const finalPrice = basePrice + installationCost;
    const originalFinalPrice = originalPricePerItem > pricePerItem ? Math.round(originalPricePerItem * 1 + installationCost) : 0; // quantity is 1
    const discountPercentage = (originalPricePerItem > 0 && pricePerItem < originalPricePerItem) ? Math.round(((originalPricePerItem - pricePerItem) / originalPricePerItem) * 100) : 0;


  // --- **MOVED HERE** Define mainImage and totalImages ---
  const mainImage = imageList[selectedImageIndex] || '/placeholder.jpg';
  const totalImages = imageList.length;

  // --- Image Load Handlers ---
  const handleMainImageLoad = () => { setIsMainImageLoading(false); setMainImageLoadError(false); };
  const handleMainImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { console.error(`Image Error: Failed to load ${mainImage}`, e); setIsMainImageLoading(false); setMainImageLoadError(true); };

  // --- Other Event Handlers ---
  const handleColorChange = (newVariantIndex: number) => { if (newVariantIndex !== selectedVariantIndex) { setSelectedVariantIndex(newVariantIndex); setSelectedSizeIndex(0); } };
  const toggleFaq = (index: number) => setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  const getDeliveryDate = () => { return '3-5 days'; };
  const handlePinCheck = () => { setPinCodeChecked(true); const isValid = eligiblePinCodes.includes(pinCode); setIsPinCodeValid(isValid); if (!isValid) setIncludeInstallation(false); };
  // Removed handleQuantityChange

  const handleAddToCart = async () => {
      if (!product) return; if (!user) { navigate(`/login?redirect=/wallart/${id}`); return; }
      setAddedToCart(true); setTimeout(() => setAddedToCart(false), 1500);
      const itemToAdd = { _id: product._id || product.id || '', name: product.name || 'Unnamed Wall Art', price: pricePerItem, skuId: product.skuId, category: product.category, images: product.images };
      const options = { size: hasPredefinedSizes ? currentVariant?.size[selectedSizeIndex] : 'Default', color: product.colors?.[selectedVariantIndex], installationIncluded: hasPredefinedSizes && includeInstallation, finalItemPrice: finalPrice }; // finalPrice is already for quantity 1
      await addItem(itemToAdd, 1, options); // quantity is always 1
  };

  const handleWishlistToggle = async () => {
    if (!product) return; if (!user) { navigate(`/login?redirect=/wallart/${id}`); return; }
    const productId = product._id || product.id; if (!productId) return;
    setIsLoadingWishlist(true);
    try {
      if (isWishlisted) { await removeFromWishlist(productId); setIsWishlisted(false); }
      else { await addToWishlist({ _id: productId, name: product.name, price: pricePerItem, images: product.images, category: product.category, skuId: product.skuId, }); setIsWishlisted(true); }
    } catch (error) { console.error("Error toggling wishlist:", error); }
    finally { setIsLoadingWishlist(false); }
  };

  // --- Early Returns ---
  if (loading) { return ( <div className="min-h-screen flex items-center justify-center"> <Loader2 className="w-12 h-12 text-[#172b9b] animate-spin" /> </div> ); }
  if (!product) { return ( <div className="min-h-screen flex items-center justify-center"> <div className="text-center"> <h1 className="text-2xl font-bold text-gray-900 mb-4 font-seasons"> Product Not Found </h1> <Link to="/wallart" className="text-[#172b9b] hover:underline font-lora"> Back to Products </Link> </div> </div> ); }

  // --- Final Variables ---
  const productNameForLink = product.name || 'this Wall Art';
  // Updated WhatsApp link to reflect quantity 1
  const whatsappLink = `https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%201%20x%20${encodeURIComponent(productNameForLink)}%20(ID%3A%20${product._id || product.id}).%20Selected%20size%3A%20${hasPredefinedSizes ? encodeURIComponent(currentVariant?.size[selectedSizeIndex] || 'N/A') : 'Default'}.`; // Replace number
  const selectedColorName = product.colors?.[selectedVariantIndex] ?? 'Default';

  // --- RENDER ---
  return (
    <>
      <Helmet> <title>{product.name || 'Wall Art'} - Premium Wall Art | Nagomi</title> <meta name="description" content={product.description || `Details for ${product.name}`} /> </Helmet>
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> <nav className="flex items-center space-x-2 text-sm text-gray-500"> <Link to="/" className="hover:text-[#172b9b] transition-colors">Home</Link> <span>/</span> <Link to="/wallart" className="hover:text-[#172b9b] transition-colors">Wall Art</Link> <span>/</span> <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name || 'Detail'}</span> </nav> </div> </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* --- Image Section --- */}
            <div className="w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative w-full aspect-[1] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg shadow-sm" >
                    {isMainImageLoading && !mainImageLoadError && ( <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50"> <Loader2 className="w-10 h-10 text-[#172b9b] animate-spin" /> </div> )}
                    {mainImageLoadError && !isMainImageLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center z-10"> <ImageOff className="w-12 h-12 mb-2" /> <span className="text-sm">Image cannot be loaded</span> </div> )}
                    <motion.img key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: (!isMainImageLoading && !mainImageLoadError) ? 1 : 0 }} transition={{ duration: 0.3 }} src={mainImage} alt={product.name || 'Wall Art'} className="absolute inset-0 w-full h-full object-cotain z-0" onLoad={handleMainImageLoad} onError={handleMainImageError} />
                    {totalImages > 1 && ( <> <button onClick={() => setSelectedImageIndex(prev => prev === 0 ? totalImages - 1 : prev - 1)} className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" aria-label="Previous image"> <ChevronLeft className="w-5 h-5 text-gray-800" /> </button> <button onClick={() => setSelectedImageIndex(prev => prev === totalImages - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#172b9b] transition-all z-20" aria-label="Next image"> <ChevronRight className="w-5 h-5 text-gray-800" /> </button> </> )}
                </motion.div>
                {totalImages > 1 && (
                    <div className="flex gap-2 overflow-x-auto mt-4 pb-2 -mx-1 px-1 justify-center">
                    {imageList.map((imgSrc, index) => ( <button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#172b9b] ${ selectedImageIndex === index ? 'border-[#172b9b]' : 'border-gray-200 hover:border-gray-400' }`} aria-label={`View image ${index + 1}`} > <img src={imgSrc} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} /> </button> ))}
                    </div>
                )}
            </div>
            {/* --- End Image Section --- */}

            {/* --- Right Section - Product Details --- */}
            <div className="space-y-5">
               {product.bestseller && ( <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide"> BESTSELLER </span> )}
               <h1 className="text-3xl sm:text-4xl font-bold text-[#172b9b] font-seasons leading-tight">{product.name}</h1>
               <div className="flex items-center gap-2"> <div className="flex items-center text-yellow-500"> {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current" />))} </div> <span className="text-sm text-gray-700 font-medium">{product.rating || '4.9'} |</span> <span className="text-sm text-gray-500 hover:underline cursor-pointer"> {product.reviews || 20} ratings </span> </div>

               {/* Price Display */}
               <div className="flex items-center gap-3 flex-wrap relative">
                  {originalPricePerItem > pricePerItem && ( <span className="text-xl text-gray-400 line-through"> ₹{originalPricePerItem.toLocaleString('en-IN')} </span> )}
                 <span className="text-3xl font-bold text-[#1428a0]"> ₹{pricePerItem.toLocaleString('en-IN')} </span>
                  {discountPercentage > 0 && ( <span className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold shadow-sm"> SAVE {discountPercentage}% </span> )}
               </div>
               <p className="text-xs text-gray-500 font-lora -mt-4">inclusive of all taxes</p>

               {/* Color Selection */}
               {product.colors && product.colors.length &&  product.variants && product.colors.length === product.variants.length && (
                  <div>
                    <label className="block text-sm font-semibold text-[#172b9b] mb-2 font-lora"> Color: <span className="text-gray-700 font-medium ml-1">{selectedColorName}</span> </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((colorName, index) => {
                        if (!colorName) return null; const isSelected = index === selectedVariantIndex;
                        return ( <button key={`${colorName}-${index}`} onClick={() => handleColorChange(index)} title={colorName} className={`text-sm block font-medium px-3 py-1.5 border-2 rounded-md font-lora transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#172b9b] ${ isSelected ? "bg-[#172b9b] text-white border-[#172b9b]" : "text-[#172b9b] border-[#172b9b] hover:bg-blue-50" }`} > {colorName} </button> );
                      })}
                    </div>
                  </div>
                )}
              {/**/} 

               {/* --- REPLACED Quantity with Size Selection --- */}
               {hasPredefinedSizes && currentVariant && (
                 <div>
                   <label className="block text-sm font-semibold text-[#172b9b] mb-2 font-lora">
                     Size: <span className="text-gray-700 font-medium ml-1">{currentVariant.size[selectedSizeIndex]}</span>
                   </label>
                   <div className="flex gap-2 flex-wrap">
                     {currentVariant.size.map((size, index) => (
                       <button
                         key={`${size}-${index}`}
                         onClick={() => setSelectedSizeIndex(index)}
                         className={`px-3 py-1.5 rounded-md border text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#172b9b] ${
                           selectedSizeIndex === index ? "border-[#172b9b] bg-blue-50 text-[#172b9b] font-semibold" : "border-gray-300 text-gray-600 hover:border-gray-400"
                         }`}
                       >
                         {size}
                       </button>
                     ))}
                   </div>
                 </div>
               )}
               {/* --- END REPLACEMENT --- */}

                {/* Order Help Button */}
                <button type="button" onClick={() => setSupportModalOpen(true)} className="text-sm text-blue-600 hover:underline focus:outline-none font-lora flex items-center gap-1"> <HelpCircle className="w-4 h-4" /> Need help placing the order? </button>
                <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />

               {/* PIN Code & Delivery */}
                <div>
                  <label htmlFor="pincode-input" className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">Check Delivery {hasPredefinedSizes ? '& Installation' : ''} Availability</label>
                   <div className="flex gap-2">
                      <input id="pincode-input" type="text" value={pinCode} onChange={(e) => { setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinCodeChecked(false); setIsPinCodeValid(false); }} maxLength={6} className="w-32 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm" placeholder="Enter PIN code" />
                      <button onClick={handlePinCheck} disabled={pinCode.length !== 6} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#172b9b] rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" > Check </button>
                  </div>
                  {pinCodeChecked && ( <div className="text-xs mt-1 font-lora"> {isPinCodeValid ? <span className="text-green-700">✓ Delivery {hasPredefinedSizes ? '& Installation available!' : 'available!'} Expected by {getDeliveryDate()}.</span> : <span className="text-red-600">✗ Delivery {hasPredefinedSizes ? '/ Installation' : ''} not available for this PIN code.</span>} </div> )}
                </div>

               {/* Installation Option */}
               {hasPredefinedSizes && isPinCodeValid && (
                 <div className="flex items-center gap-2">
                   <input type="checkbox" id="installation-checkbox" checked={includeInstallation} onChange={() => setIncludeInstallation((prev) => !prev)} className="w-4 h-4 text-[#172b9b] border-gray-300 rounded focus:ring-[#172b9b] focus:ring-offset-1" />
                   <label htmlFor="installation-checkbox" className="text-sm font-medium text-gray-700 font-lora"> Include Installation (+₹{INSTALLATION_CHARGE}/item) </label>
                 </div>
               )}

                {/* Final Price Display */}
              

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-3 pt-2">
                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} className={`w-full sm:flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-150 flex items-center justify-center gap-2 text-base shadow-sm ${ addedToCart ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-[#172b9b] text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-700' }`} disabled={addedToCart} > {addedToCart ? ( <> <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Added </> ) : ( <> <ShoppingCart className="w-5 h-5" /> Add to Cart </> )} </motion.button>
                     <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-600" > <FaWhatsapp className="w-5 h-5" /> Order on WhatsApp </a>
                     <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWishlistToggle} disabled={isLoadingWishlist} className={`p-3 border rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${ isWishlisted ? 'bg-red-50 border-red-200 text-red-500 focus:ring-red-300' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-red-500 focus:ring-gray-300' } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} > {isLoadingWishlist ? ( <Loader2 className="animate-spin h-5 w-5 text-gray-400" /> ) : ( <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} /> )} </motion.button>
               </div>

                {/* Product Features */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-200 pt-6 text-center">
                   <div className="flex flex-col items-center"> <img src="/high-quality-blue.png" alt="High Quality" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold text-gray-600">High Quality Print</span> </div>
                    <div className="flex flex-col items-center"> <img src="/custom-fit-blue.png" alt="Custom Fit" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold text-gray-600">Custom Fit Available</span> </div>
                    <div className="flex flex-col items-center"> <img src="/non-toxic-blue.png" alt="Eco Friendly" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold text-gray-600">Non-Toxic Inks</span> </div>
                    <div className="flex flex-col items-center"> <img src="/lasts-years-blue.png" alt="Durable" className="w-10 h-10 mb-1" /> <span className="text-xs font-semibold text-gray-600">Durable Material</span> </div>
                </div>
            </div> {/* End Right Column */}
          </div> {/* End Grid */}

          {/* --- Lower Sections --- */}
          {/* FAQ Section */}
           <div className="mt-16 pt-8 border-t border-gray-200 max-w-3xl mx-auto">
             <h2 className="text-2xl font-semibold text-[#172b9b] mb-6 font-seasons text-center"> Frequently Asked Questions </h2>
             <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm bg-white">
               {[
                 { q: "What sizes are available for this wall art?", a: "This wall art is available in the sizes listed in the 'Size' section above. Please select the size that best fits your wall space." },
                 { q: "How is installation handled for wall art?", a: `Installation service is available for eligible PIN codes at an additional charge of ₹${INSTALLATION_CHARGE} per piece. You can select this option after verifying your PIN code is serviceable.` },
                 { q: "Are the wall arts durable?", a: "Yes, our premium wall arts are printed on high-quality materials designed for longevity. They are easy to maintain with gentle cleaning." },
                 { q: "Can I request a custom size or design?", a: "Absolutely! We specialize in custom designs. Please contact our support team via email or WhatsApp to discuss your specific requirements." },
                 { q: "How should I prepare my wall?", a: "Ensure the wall is clean, dry, and smooth before installation. If you opt for our installation service, our team will handle the final preparation and mounting." },
               ].map((faq, index) => (
                 <div key={index}>
                   <button onClick={() => toggleFaq(index)} className="w-full py-3 px-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none" > <span className="text-sm font-medium text-gray-800 font-lora">{faq.q}</span> <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${ openFaqs[index] ? 'rotate-180' : '' }`} /> </button>
                   {openFaqs[index] && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="px-4 pb-3 text-gray-600 text-sm font-lora bg-gray-50 border-t border-gray-100"> <div className="pt-2">{faq.a}</div> </motion.div> )}
                 </div>
               ))}
             </div>
           </div>

           {/* Reviews Section */}
           <Review />

        </div> {/* End Max Width Container */}
      </div> {/* End Page BG */}
    </>
  );
};

export default WallArtDetail;