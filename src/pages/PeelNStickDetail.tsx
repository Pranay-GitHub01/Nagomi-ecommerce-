import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReviewSection from "../components/Review/ReviewSection";
import {
  Heart,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  Loader2,
  ImageOff,
  Droplets,
  FlaskConical,
  Layers,
  Award
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { Product } from "../types/index";
import { useAuthStore } from "../stores/useAuthStore";
import { FaWhatsapp } from "react-icons/fa";
import { API_BASE_URL } from "../api/config";

// --- MODALS ---
const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    if (!open) return null;
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"> <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"> <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" > &times; </button> <h2 className="text-lg font-bold mb-2 text-[#172b9b]"> Need Help? </h2> <p className="mb-4 text-gray-700"> Our support team is here to help! </p> <div className="flex flex-col gap-2"> <a href="mailto:support@example.com" className="text-[#172b9b] underline" > Email Support </a> <a href="tel:+919876543210" className="text-[#172b9b] underline" > Call: +91 98765 43210 </a> </div> </div> </div> );
};

const PeelNStickDetail: React.FC = () => {
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
  
  // Logic: Peel-n-Stick allows quantity selection
  const [quantity, setQuantity] = useState(1);
  
  const [pinCode, setPinCode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});
  const [pinCodeChecked, setPinCodeChecked] = useState(false);
  const [isPinCodeValid, setIsPinCodeValid] = useState(false);

  // --- Image state ---
  const [imageList, setImageList] = useState<string[]>(['/placeholder.jpg']);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [mainImageLoadError, setMainImageLoadError] = useState(false);

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
        setProduct(data);
        setSelectedVariantIndex(0);
        setSelectedSizeIndex(0);
      })
      .catch((err) => { console.error("Error fetching product details:", err); setProduct(null); })
      .finally(() => setLoading(false));
  }, [id]);

  // --- Image Logic ---
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

  // --- Wishlist Logic ---
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

  // --- Price Logic ---
  const parsePrice = (priceStr?: string | number): number => {
    if (priceStr === undefined || priceStr === null) return 0;
    if (typeof priceStr === 'number') return isNaN(priceStr) ? 0 : priceStr;
    const cleanedString = String(priceStr).replace(/[^0-9.]/g, "");
    const num = parseFloat(cleanedString); 
    return isNaN(num) ? 0 : num;
  };

  const currentVariant = product?.variants?.[selectedVariantIndex];
  
  // Calculate Unit Price based on Size
  let unitPrice = 0;
  let unitMrp = 0;

  if (currentVariant && currentVariant.size && currentVariant.size.length > 0) {
      unitPrice = parsePrice(currentVariant.sellingPrice?.[selectedSizeIndex]);
      unitMrp = parsePrice(currentVariant.mrp?.[selectedSizeIndex]);
  } else {
      unitPrice = product?.price ?? 0;
      unitMrp = product?.originalPrice ?? 0;
  }

  const finalTotalPrice = unitPrice * quantity;
  const originalTotalPrice = unitMrp * quantity;
  const discountPercentage = (unitMrp > 0 && unitPrice < unitMrp) ? Math.round(((unitMrp - unitPrice) / unitMrp) * 100) : 0;

  // --- Handlers ---
  const mainImage = imageList[selectedImageIndex] || '/placeholder.jpg';
  const totalImages = imageList.length;
  const handleMainImageLoad = () => { setIsMainImageLoading(false); setMainImageLoadError(false); };
  const handleMainImageError = () => { setIsMainImageLoading(false); setMainImageLoadError(true); };
  
  const handleColorChange = (newVariantIndex: number) => { 
      if (newVariantIndex !== selectedVariantIndex) { 
          setSelectedVariantIndex(newVariantIndex); 
          setSelectedSizeIndex(0); 
      } 
  };
  
  const toggleFaq = (index: number) => setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  const handlePinCheck = () => { setPinCodeChecked(true); const isValid = eligiblePinCodes.includes(pinCode); setIsPinCodeValid(isValid); };

  const handleAddToCart = async () => {
      if (!product) return; if (!user) { navigate(`/login?redirect=/peel-n-stick/${id}`); return; }
      setAddedToCart(true); setTimeout(() => setAddedToCart(false), 1500);
      const itemToAdd = { _id: product._id || product.id || '', name: product.name || 'Peel N Stick', price: unitPrice, skuId: product.skuId, category: 'peel-n-stick', images: product.images };
      const options = { size: currentVariant?.size?.[selectedSizeIndex] || 'Default', color: product.colors?.[selectedVariantIndex], finalItemPrice: unitPrice }; 
      await addItem(itemToAdd, quantity, options);
  };

  const handleWishlistToggle = async () => {
    if (!product) return; if (!user) { navigate(`/login?redirect=/peel-n-stick/${id}`); return; }
    const productId = product._id || product.id; if (!productId) return;
    setIsLoadingWishlist(true);
    try {
      if (isWishlisted) { await removeFromWishlist(productId); setIsWishlisted(false); }
      else { await addToWishlist({ _id: productId, name: product.name, price: unitPrice, images: product.images, category: product.category, skuId: product.skuId, }); setIsWishlisted(true); }
    } catch (error) { console.error("Error toggling wishlist:", error); }
    finally { setIsLoadingWishlist(false); }
  };

  // --- Render Logic ---
  if (loading) return ( <div className="min-h-screen flex items-center justify-center"> <Loader2 className="w-12 h-12 text-[#172b9b] animate-spin" /> </div> );
  if (!product) return ( <div className="min-h-screen flex items-center justify-center">Product Not Found</div> );

  const whatsappLink = `https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%20${quantity}%20x%20${encodeURIComponent(product.name || '')}.%20Size%3A%20${currentVariant?.size?.[selectedSizeIndex]}`;
  const selectedColorName = product.colors?.[selectedVariantIndex] ?? 'Default';

  return (
    <>
      <Helmet> <title>{product.name} - Peel-n-Stick Wallpaper</title> </Helmet>
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> <nav className="flex items-center space-x-2 text-sm text-gray-500"> <Link to="/" className="hover:text-[#172b9b]">Home</Link> <span>/</span> <Link to="/peel-n-stick" className="hover:text-[#172b9b]">Peel-n-Stick Collection</Link> <span>/</span> <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span> </nav> </div> </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* --- Image Section (Left) --- */}
            <div className="w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full aspect-[1] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg shadow-sm" >
                    {isMainImageLoading && !mainImageLoadError && ( <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10"> <Loader2 className="w-10 h-10 text-[#172b9b] animate-spin" /> </div> )}
                    {mainImageLoadError && ( <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 z-10"> <ImageOff className="w-12 h-12" /> </div> )}
                    <motion.img key={mainImage} src={mainImage} alt={product.name} className="absolute inset-0 w-full h-full object-contain" onLoad={handleMainImageLoad} onError={handleMainImageError} />
                    {totalImages > 1 && ( <> <button onClick={() => setSelectedImageIndex(prev => prev === 0 ? totalImages - 1 : prev - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full shadow hover:bg-white z-20"> <ChevronLeft className="w-5 h-5" /> </button> <button onClick={() => setSelectedImageIndex(prev => prev === totalImages - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 p-2 rounded-full shadow hover:bg-white z-20"> <ChevronRight className="w-5 h-5" /> </button> </> )}
                </motion.div>
                {totalImages > 1 && (
                    <div className="flex gap-2 overflow-x-auto mt-4 pb-2 justify-center">
                    {imageList.map((imgSrc, index) => ( <button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${ selectedImageIndex === index ? 'border-[#172b9b]' : 'border-gray-200' }`} > <img src={imgSrc} alt="thumb" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.jpg'} /> </button> ))}
                    </div>
                )}
            </div>

            {/* --- Product Details (Right) --- */}
            <div className="space-y-6">
               {product.bestseller && ( <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide"> BESTSELLER </span> )}
               <h1 className="text-3xl sm:text-4xl font-bold text-[#172b9b] font-seasons leading-tight">{product.name}</h1>
               
               <div className="flex items-center gap-2"> 
                   <div className="flex text-yellow-500"> {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)} </div> 
                   <span className="text-sm text-gray-700 font-medium">4.8 |</span> 
                   <span className="text-sm text-gray-500 underline cursor-pointer"> {product.reviews || 16} ratings </span> 
               </div>

               {/* Main Price Display */}
               <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#1428a0]"> ₹{unitPrice.toLocaleString('en-IN')} </span>
                  {unitMrp > unitPrice && ( <span className="text-xl text-gray-400 line-through"> ₹{unitMrp.toLocaleString('en-IN')} </span> )}
                  {discountPercentage > 0 && ( <span className="bg-[#172b9b] text-white px-2 py-1 rounded-full text-xs font-bold"> SAVE {discountPercentage}% </span> )}
               </div>
               <p className="text-xs text-gray-500 font-lora -mt-4">inclusive of all taxes</p>

               {/* Size Selector with Price Tags */}
               {currentVariant?.size && currentVariant.size.length > 0 && (
                 <div className="mt-6">
                   <label className="block text-sm font-semibold text-[#172b9b] mb-4 font-lora">Size</label>
                   <div className="flex gap-4 flex-wrap">
                     {currentVariant.size.map((size, index) => {
                       // Get price for this specific size
                       const sizePrice = parsePrice(currentVariant.sellingPrice?.[index]);
                       return (
                         <div key={`${size}-${index}`} className="flex flex-col items-center group relative">
                           {/* Price Tag Bubble */}
                           <div className={`mb-1 px-2 py-0.5 text-xs text-white font-bold rounded shadow-sm transition-colors ${selectedSizeIndex === index ? 'bg-green-600' : 'bg-green-500 opacity-90'}`}>
                             Rs {sizePrice}
                           </div>
                           
                           <button
                             onClick={() => setSelectedSizeIndex(index)}
                             className={`px-4 py-2 rounded border text-sm font-medium transition-all w-full
                               ${selectedSizeIndex === index 
                                 ? "border-[#172b9b] bg-blue-50 text-[#172b9b] ring-1 ring-[#172b9b]" 
                                 : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
                           >
                             {size}
                           </button>
                         </div>
                       )
                     })}
                   </div>
                 </div>
               )}

               {/* Quantity Selector */}
               <div className="mt-4">
                   <label className="block text-sm font-semibold text-[#172b9b] mb-2 font-lora">Quantity</label>
                   <div className="flex items-center gap-3">
                        <select 
                            value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-gray-300 rounded px-3 py-2 text-sm font-lora focus:ring-[#172b9b] focus:border-[#172b9b] bg-white w-20"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        {quantity > 3 && <span className="text-xs text-green-600 font-semibold animate-pulse">Great choice for a full wall!</span>}
                   </div>
               </div>

               {/* PIN Code */}
               <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#172b9b] mb-1 font-lora">PIN Code</label>
                   <div className="flex gap-2">
                      <input type="text" value={pinCode} onChange={(e) => { setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinCodeChecked(false); }} maxLength={6} className="w-32 px-3 py-1.5 border border-gray-300 rounded text-sm" placeholder="Enter PIN" />
                      <button onClick={handlePinCheck} disabled={pinCode.length !== 6} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#172b9b] rounded hover:bg-blue-800 disabled:opacity-50" > Check </button>
                  </div>
                  {pinCodeChecked && ( <div className="text-xs mt-1"> {isPinCodeValid ? <span className="text-green-700">Expected delivery by Friday.</span> : <span className="text-red-600">Delivery not available.</span>} </div> )}
               </div>

                {/* Final Price Calculation Block */}
                <div className="mt-6 border-t border-b border-gray-100 py-4">
                     <div className="flex items-baseline gap-2 text-lg">
                        <span className="font-bold text-[#172b9b]">Final Price:</span>
                        <span className="font-bold text-gray-800">₹{finalTotalPrice.toLocaleString('en-IN')}</span>
                        {originalTotalPrice > finalTotalPrice && <span className="text-sm text-gray-400 line-through">₹{originalTotalPrice.toLocaleString('en-IN')}</span>}
                        
                        {/* Math breakdown visual */}
                        <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-mono">
                            {/* price * quantity */}
                        </div>
                     </div>
                     <p className="text-xs text-gray-500 mt-1">inclusive of all taxes</p>
                     <p className="text-sm font-semibold text-green-600 mt-2">YAY! You are eligible for free shipping!</p>
                </div>

               {/* Buttons */}
               <div className="flex flex-col sm:flex-row gap-3 pt-2">
                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} className={`w-full sm:flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 text-white bg-[#172b9b] hover:bg-blue-800`} disabled={addedToCart} > 
                        {addedToCart ? "Added!" : <> <ShoppingCart className="w-5 h-5" /> Add to Cart </>} 
                     </motion.button>
                     <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2" > 
                        <FaWhatsapp className="w-5 h-5" /> Order on WhatsApp 
                     </a>
                     <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWishlistToggle} className={`p-3 border rounded-lg ${ isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 border-gray-300' }`} > 
                        {isLoadingWishlist ? <Loader2 className="animate-spin" /> : <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />} 
                     </motion.button>
               </div>

                {/* Peel-n-Stick Specific Features */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
                   <div className="flex flex-col items-center gap-2"> <FlaskConical className="w-8 h-8 text-[#172b9b]"/> <span className="text-xs font-semibold text-gray-700">Non-toxic & VOC Free</span> </div>
                   <div className="flex flex-col items-center gap-2"> <Layers className="w-8 h-8 text-[#172b9b]"/> <span className="text-xs font-semibold text-gray-700">Self Adhesive</span> </div>
                   <div className="flex flex-col items-center gap-2"> <Award className="w-8 h-8 text-[#172b9b]"/> <span className="text-xs font-semibold text-gray-700">High Quality Print</span> </div>
                   <div className="flex flex-col items-center gap-2"> <Droplets className="w-8 h-8 text-[#172b9b]"/> <span className="text-xs font-semibold text-gray-700">Water Resistant</span> </div>
                </div>

            </div> {/* End Right Column */}
          </div> 

          {/* FAQ Section */}
           <div className="mt-16 pt-8 border-t border-gray-200 max-w-3xl mx-auto">
             <h2 className="text-2xl font-semibold text-[#172b9b] mb-6 font-seasons text-center"> Frequently Asked Questions </h2>
             <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm bg-white">
               {[
                 { q: "Is this wallpaper easy to apply?", a: "Yes! It's peel-and-stick. Just peel off the backing and stick it to a smooth, clean surface." },
                 { q: "Will it damage my walls?", a: "No, our wallpaper is designed to be removable without leaving sticky residue or damaging paint, making it renter-friendly." },
                 { q: "Is it water resistant?", a: "Yes, it is water-resistant and can be gently wiped clean with a damp cloth." },
               ].map((faq, index) => (
                 <div key={index}>
                   <button onClick={() => toggleFaq(index)} className="w-full py-3 px-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors" > 
                        <span className="text-sm font-medium text-gray-800 font-lora">{faq.q}</span> 
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${ openFaqs[index] ? 'rotate-180' : '' }`} /> 
                   </button>
                   {openFaqs[index] && ( <div className="px-4 pb-3 text-gray-600 text-sm font-lora bg-gray-50 border-t border-gray-100 pt-2">{faq.a}</div> )}
                 </div>
               ))}
             </div>
           </div>

          <ReviewSection   productId={product._id || product.id} 
    productName={product.name}/>
           <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
        </div> 
      </div>
    </>
  );
};

export default PeelNStickDetail;