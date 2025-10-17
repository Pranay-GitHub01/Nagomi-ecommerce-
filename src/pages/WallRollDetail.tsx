// Simple Wall Guide Modal
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
// Simple Material Guide Modal
const MaterialGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-lg font-bold mb-2 text-[#172b9b]">Material Guide</h2>
        <ul className="list-disc pl-5 text-gray-700 mb-2">
          <li><b>Non-woven:</b> Durable, easy to install, and remove. Good for most walls.</li>
          <li><b>Vinyl:</b> Washable, moisture-resistant, ideal for kitchens and bathrooms.</li>
          <li><b>Textured:</b> Adds depth and luxury, best for feature walls.</li>
        </ul>
        <p className="text-xs text-gray-500">Contact support for more details on material options.</p>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
// Simple Support Modal
const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-lg font-bold mb-2 text-[#172b9b]">Need Help Placing Your Order?</h2>
        <p className="mb-4 text-gray-700">Our support team is here to help! You can chat with us, call, or email for assistance with your order.</p>
        <div className="flex flex-col gap-2">
          <a href="mailto:support@example.com" className="text-[#172b9b] underline">Email Support</a>
          <a href="tel:+911234567890" className="text-[#172b9b] underline">Call: +91 12345 67890</a>
          {/* You can add a chat widget or link here */}
        </div>
      </div>
    </div>
  );
};
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import ProductCard from '../components/Product/ProductCard';
import { API_BASE_URL } from '../api/config';
import { Product } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const WallRollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('Non-woven Smooth');
  const [quantity] = useState(1);
  const [wallHeight, setWallHeight] = useState<number | ''>(120); // Default to 10 feet (120 inches)
  const [wallWidth, setWallWidth] = useState<number | ''>(120); // Default to 10 feet (120 inches)
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [materialGuideOpen, setMaterialGuideOpen] = useState(false);
  const [wallGuideOpen, setWallGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showQuestionMark, setShowQuestionMark] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setLoading(true);
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        (async () => {
          try {
            const candidateUrls: string[] = [];
            const skuId: string | undefined = (data && (data.skuId || data.sku || data.SKU || data.sku_id)) as string | undefined;
            const possibleExtensions = ['webp', 'jpg', 'jpeg', 'png'];
            if (Array.isArray(data?.images) && data.images.length > 0) {
              const normalized = data.images.map((pathStr: string) => {
                if (!pathStr) return '/placeholder.jpg';
                if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
                if (pathStr.startsWith('@images/')) return `/images/${pathStr.substring('@images/'.length)}`;
                if (pathStr.startsWith('images/')) return `/images/${pathStr.substring('images/'.length)}`;
                if (pathStr.startsWith('/images/')) return pathStr;
                if (pathStr.startsWith('@uploads/')) return `/uploads/${pathStr.substring('@uploads/'.length)}`;
                if (pathStr.startsWith('uploads/')) return `/uploads/${pathStr.substring('uploads/'.length)}`;
                if (pathStr.startsWith('/uploads/')) return pathStr;
                if (pathStr.startsWith('/')) return pathStr;
                const file = pathStr.split('/').pop() || pathStr;
                return `/images/${file}`;
              });
              candidateUrls.push(...normalized);
            } else if (skuId) {
              const skuBase = skuId.replace(/-WP$/i, '');
              const skuRaw = skuId;
              possibleExtensions.forEach(ext => candidateUrls.push(`/images/${skuRaw}.${ext}`));
              possibleExtensions.forEach(ext => candidateUrls.push(`/images/${skuBase}.${ext}`));
              possibleExtensions.forEach(ext => candidateUrls.push(`/images/${skuBase}-WP.${ext}`));
              for (let i = 1; i <= 6; i++) {
                possibleExtensions.forEach(ext => candidateUrls.push(`/images/${i}-${skuBase}-WP.${ext}`));
              }
              for (let i = 1; i <= 6; i++) {
                possibleExtensions.forEach(ext => candidateUrls.push(`/images/${skuBase}-${i}.${ext}`));
              }
            }
            const loadChecks = await Promise.all(
              candidateUrls.map(url => new Promise<{ url: string; ok: boolean }>(resolve => {
                const img = new Image();
                img.onload = () => resolve({ url, ok: true });
                img.onerror = () => resolve({ url, ok: false });
                img.src = url;
              }))
            );
            const available = loadChecks.filter(x => x.ok).map(x => x.url);
            setImageList(available.length > 0 ? available : ['/placeholder.jpg']);
          } catch {
            setImageList(['/placeholder.jpg']);
          }
        })();
        fetch(`${API_BASE_URL}/api/products`).then(r => r.json()).then(all => {
          const currentId = data.id || data._id;
          const currentCategory = data.category || '';
          const related = all.filter((p: Product) => {
            const pid = p.id || p._id;
            const pCategory = p.category || '';
            if (!pCategory || !currentCategory) return false;
            return pCategory === currentCategory && pid !== currentId;
          }).slice(0, 4);
          setRelatedProducts(related);
        });
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      const checkWishlistStatus = async () => {
        const productId = product._id || product.id;
        if (!productId) return;
        
        if (user) {
          setIsLoadingWishlist(true);
          try {
            const status = await useWishlistStore.getState().checkWishlistStatus(productId);
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
      checkWishlistStatus();
    }
  }, [product, user, isInWishlist]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-seasons">Product Not Found</h1>
          <Link to="/wallpapers" className="text-primary-600 hover:underline font-lora">
            Back to Wallpapers
          </Link>
        </div>
      </div>
    );
  }
  
  const width = Number(wallWidth) || 0;
  const height = Number(wallHeight) || 0;
  const totalArea = (width * height) / 144; // Convert square inches to square feet

  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const materialOptions = [
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
  const basePrice = currentMaterial.price * totalArea;
  const rollCoverage = 55; // Each roll covers 55 sq ft
  const numberOfRolls = totalArea > 0 ? Math.ceil(totalArea / rollCoverage) : 0;
  const installationCostPerRoll = 450;
  const installationCost = includeInstallation ? (numberOfRolls * installationCostPerRoll) : 0;
  const finalPrice = basePrice + installationCost;
  const originalPrice = product.price;

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
    await addItem(product, quantity, {
      selectedMaterial,
      customDimensions: { width, height }
    });
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product) return;
    const productId = product._id || product.id;
    if (!productId) return;
    setIsLoadingWishlist(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const mainImage = imageList[selectedImageIndex] || 'https://via.placeholder.com/400x400?text=No+Image';
  const whatsappLink = `https://wa.me/?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}`;

  return (
    <>
      <Helmet>
        <title>{product.name} - Premium Wallpaper | Nagomi</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="min-h-screen bg-white">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-[560px] sm:h-[640px] lg:h-[800px]"
              >
                <img src={mainImage} alt={product.name} className="w-full h-full object-contain object-top" />
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === 0 ? imageList.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === imageList.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </motion.div>
            </div>

            <div className="space-y-6">
              {product.bestseller && (
                <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-sm font-bold mb-4">
                  BESTSELLER
                </span>
              )}
              <h1 className="text-[40px] font-bold text-[#172b9b] mb-2 font-seasons">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-current" />))}
                </div>
                <span className="text-gray-700">4.8 |</span>
                <span className="text-gray-700 underline cursor-pointer"> 16 ratings </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-[#172b9b]">
                  <span className="line-through font-bold text-[#172b9b]">₹119</span> ₹{currentMaterial.price} per roll
                </span>
                <button
                  onMouseEnter={() => setShowQuestionMark(true)}
                  onMouseLeave={() => setShowQuestionMark(false)}
                  className="w-4 h-4 mb-4 bg-[#172b9b] text-white rounded-full flex items-center justify-center"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                <span className="bg-[#172b9b] text-white px-6 py-1 rounded-full text-xs font-bold shadow-lg">SAVE 25%</span>
                {showQuestionMark && (
                  <div className="absolute bg-white border rounded-lg p-3 mt-20 shadow-lg z-20">
                    <p className="text-sm">each roll cover 55 square feet</p>
                  </div>
                )}
              </div>
              <span className="text-m italic font-bold text-[#172b9b]">inclusive of all taxes</span>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#172b9b] mb-2">
                  Material{' '}
                  <span className="text-[#172b9b] italic underline cursor-pointer" onClick={() => setMaterialGuideOpen(true)} tabIndex={0} role="button" aria-label="Open material guide">
                    (Guide)
                  </span>
                </label>
                <MaterialGuideModal open={materialGuideOpen} onClose={() => setMaterialGuideOpen(false)} />
                <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#172b9b] focus:border-[#172b9b]">
                  {materialOptions.map(material => (<option key={material.name} value={material.name}>{material.name}</option>))}
                </select>
              </div>

              {/* ++ ADDITION: Wall Size Input section is now enabled ++ */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#172b9b] mb-2">
                  Wall Size{' '}
                  <span className="italic text-[#172b9b] underline cursor-pointer" onClick={() => setWallGuideOpen(true)} tabIndex={0} role="button" aria-label="Open wall size guide">
                    (Guide)
                  </span>
                </label>
                <WallGuideModal open={wallGuideOpen} onClose={() => setWallGuideOpen(false)} />
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-bold">Height</label>
                    <div className="flex items-center">
                      <input type="number" value={wallHeight} onChange={(e) => setWallHeight(e.target.value ? parseInt(e.target.value, 10) : '')} className="w-20 px-2 py-1 border border-gray-300 rounded font-lora" min={1} />
                      <span className="ml-1 text-xs font-lora">inches</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-bold">Width</label>
                    <div className="flex items-center">
                      <input type="number" value={wallWidth} onChange={(e) => setWallWidth(e.target.value ? parseInt(e.target.value, 10) : '')} className="w-20 px-2 py-1 border border-gray-300 rounded font-lora" min={1} />
                      <span className="ml-1 text-xs font-lora">inches</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mt-2 font-bold">
                  Total Area: {totalArea.toFixed(1)} square feet
                </div>
                {/* ++ ADDITION: Display the number of rolls ++ */}
                <div className="text-sm text-gray-700 mt-1 font-bold">
                  Number of Rolls Needed: {numberOfRolls}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-medium text-gray-700 font-bold">
                  Need help placing the order?{' '}
                  <button type="button" className="text-[#172b9b] underline focus:outline-none" onClick={() => setSupportModalOpen(true)}>
                    Click here
                  </button>
                </span>
                <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#172b9b] mb-2">PIN Code</label>
                <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} className="w-40 px-3 py-2 border border-gray-300 rounded-lg font-lora" placeholder="Enter PIN code" />
                {pinCode && (<div className="text-xs text-gray-700 mt-1 font-lora">Expected delivery by {getDeliveryDate()}</div>)}
              </div>
              <div className="mb-6 flex items-center gap-2">
                <input type="checkbox" checked={includeInstallation} onChange={() => setIncludeInstallation(v => !v)} className="w-5 h-5 text-[#172b9b] border-gray-300 rounded focus:ring-[#172b9b]" id="install-checkbox" />
                <label htmlFor="install-checkbox" className="text-sm font-medium text-[#172b9b]">Include installation (₹450/roll)</label>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#172b9b]">
                    Final Price: <span className="line-through text-[#172b9b]">₹{originalPrice}</span> ₹{finalPrice.toFixed(0)}
                  </span>
                </div>
                <div className="text-xs italic text-[#172b9b]">inclusive of all taxes</div>
              </div>
              {finalPrice > 3999 && (<div className="mb-6 text-green-700 font-semibold">YAY! You are eligible for free shipping!</div>)}
              <div className="flex gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`flex-1 py-2 px-2 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#172b9b] text-white hover:bg-[#1a2f8a]'}`}
                  disabled={addedToCart}
                >
                  {addedToCart ? (<span className="inline-flex items-center gap-1"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Added to Cart</span>) : (<><ShoppingCart className="w-5 h-5" />Add to Cart</>)}
                </motion.button>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-500 text-white py-2 px-2 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg">
                  <FaWhatsapp className="w-6 h-6" />Order on WhatsApp
                </a>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleWishlistToggle} disabled={isLoadingWishlist} className={`p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${isWishlisted ? 'bg-red-50 border-red-300' : ''} ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-600'}`} />
                </motion.button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center border-t pt-6">
                <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/non-toxic-blue.png" alt="Non-toxic & VOC Free" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">Non-toxic & VOC Free</span></div>
                <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/custom-fit-blue.png" alt="Custom Fitting" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">Custom Fitting</span></div>
                <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/high-quality-blue.png" alt="High Quality Print" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">High Quality Print</span></div>
                <div className="flex items-center justify-center gap-3 text-gray-700"><img src="/lasts-years-blue.png" alt="Lasts 8-10 Years" className="w-12 h-12" /><span className="text-[15px] font-semibold italic text-center">Lasts 8-10 Years</span></div>
              </div>
            </div>
          </div>
          
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(p => <ProductCard key={p.id || p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WallRollDetail;