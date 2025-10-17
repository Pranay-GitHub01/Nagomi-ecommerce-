import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  Watch,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import WallArtCard from "../components/WallArt/WallArtCard";
import { wallArtData } from "../data/wallArt";
import { WallArt } from "../types/index";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { API_BASE_URL } from "../api/config";

// --- MODALS (WallGuideModal, MaterialGuideModal, SupportModal) remain unchanged ---

// Simple Wall Guide Modal
const WallGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2 text-[#172b9b]">
          Wall Size Guide
        </h2>
        <ul className="list-disc pl-5 text-gray-700 mb-2">
          <li>
            Measure the height and width of your wall in inches or centimeters.
          </li>
          <li>
            Multiply height by width to get the total area in square feet.
          </li>
          <li>For multiple walls, add the areas together.</li>
        </ul>
        <p className="text-xs text-gray-500">
          Contact support if you need help measuring your wall.
        </p>
      </div>
    </div>
  );
};

// Simple Material Guide Modal
const MaterialGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2 text-[#172b9b]">
          Material Guide
        </h2>
        <ul className="list-disc pl-5 text-gray-700 mb-2">
          <li>
            <b>Canvas:</b> Premium quality, durable, and perfect for wall art
            display.
          </li>
          <li>
            <b>Premium Paper:</b> High-quality paper with excellent color
            reproduction.
          </li>
          <li>
            <b>Vinyl:</b> Water-resistant and easy to clean, ideal for any room.
          </li>
        </ul>
        <p className="text-xs text-gray-500">
          Contact support for more details on material options.
        </p>
      </div>
    </div>
  );
};

// Simple Support Modal
const SupportModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2 text-[#172b9b]">
          Need Help Placing Your Order?
        </h2>
        <p className="mb-4 text-gray-700">
          Our support team is here to help! You can chat with us, call, or email
          for assistance with your order.
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="mailto:support@example.com"
            className="text-[#172b9b] underline"
          >
            Email Support
          </a>
          <a href="tel:+911234567890" className="text-[#172b9b] underline">
            Call: +91 12345 67890
          </a>
        </div>
      </div>
    </div>
  );
};

const WallArtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [wallArt, setWallArt] = useState<WallArt | null>(null);
  const [relatedWallArt, setRelatedWallArt] = useState<WallArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState("Canvas");
  const [quantity] = useState(1);
  const [wallHeight, setWallHeight] = useState<number | "">(24);
  const [wallWidth, setWallWidth] = useState<number | "">(36);
  const [pinCode, setPinCode] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [materialGuideOpen, setMaterialGuideOpen] = useState(false);
  const [wallGuideOpen, setWallGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showQuestionMark, setShowQuestionMark] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({});
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  
  // ... previous code
  const [selectedColor, setSelectedColor] = useState(
    wallArt?.colors?.[0]?.[0] ?? "W"
  );
  // Fix: Use optional chaining (?.) to prevent access if wallArt or skuId is null/undefined
  const skuShort = wallArt?.skuId?.slice(-3);

  {
    /*............................... */
  }
  //... rest of the component............................ */}
  //... inside the WallArtDetail component

  const handleColorChange = (colorCode: string) => {
    // Only update if a new color is selected to avoid unnecessary re-renders
    if (colorCode !== selectedColor) {
      setImgLoading(true);
      setImgError(false);
      setSelectedColor(colorCode);
    }
  };

  // ... rest of the code

  {
    /*............................... */
  }

  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    if (wallArt?.colors?.length) {
      setSelectedColor(wallArt.colors[0][0]);
      // reset image states when wallArt changes
      setImgLoading(true);
      setImgError(false);
    }
  }, [wallArt]);
  const eligiblePinCodes = [
    "110001",
    "110021",
    "110048",
    "122001",
    "400001",
    "560001",
    "700001",
  ];
  const [pinCodeChecked, setPinCodeChecked] = useState(false);
  const [isPinCodeValid, setIsPinCodeValid] = useState(false);

  // --- NEW --- Installation charge constant and state
  const INSTALLATION_CHARGE = 499;
  const [includeInstallation, setIncludeInstallation] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const handlePinCheck = () => {
    setPinCodeChecked(true);
    if (eligiblePinCodes.includes(pinCode)) {
      setIsPinCodeValid(true);
    } else {
      setIsPinCodeValid(false);
      setIncludeInstallation(false); // Reset installation if PIN is invalid
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setLoading(true);

    const processData = (data: WallArt) => {
      setWallArt(data);
      setSelectedVariant(0);
      setSelectedImageIndex(0);
      setSelectedSizeIndex(0);

      fetch(`${API_BASE_URL}/api/wallart`)
        .then((r) => (r.ok ? r.json() : []))
        .then((all: any[]) => {
          const currentId = data.id || data._id;
          const currentCategory = data.category;
          const related = (Array.isArray(all) ? all : [])
            .filter((p) => {
              const pid = p.id || p._id;
              return p.category === currentCategory && pid !== currentId;
            })
            .slice(0, 4);
          setRelatedWallArt(related);
        });
    };

    fetch(`${API_BASE_URL}/api/wallart/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Not found"))))
      .then(processData)
      .catch(() => {
        const foundWallArt = wallArtData.find(
          (item) => (item._id || item.id) === id
        );
        if (foundWallArt) {
          processData(foundWallArt);
          setRelatedWallArt(
            wallArtData
              .filter(
                (item) =>
                  item.category === foundWallArt.category &&
                  (item.id || item._id) !==
                    (foundWallArt.id || foundWallArt._id)
              )
              .slice(0, 4)
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  //random -wallart

  useEffect(() => {
    if (wallArt) {
      const checkWishlistStatus = async () => {
        const wallArtId = wallArt._id || wallArt.id;
        if (!wallArtId) return;

        if (user) {
          setIsLoadingWishlist(true);
          try {
            const status = await useWishlistStore
              .getState()
              .checkWishlistStatus(wallArtId);
            setIsWishlisted(status);
          } catch (error) {
            console.error("Error checking wishlist status:", error);
          } finally {
            setIsLoadingWishlist(false);
          }
        } else {
          setIsWishlisted(isInWishlist(wallArtId));
        }
      };

      checkWishlistStatus();
    }
  }, [wallArt, user, isInWishlist]);

  const currentVariant = wallArt?.variants?.[selectedVariant];
  const isWhite = currentVariant?.color?.toLowerCase() === "white";
  const hasPredefinedSizes =
    currentVariant?.size?.length > 0 && currentVariant?.size[0];

  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    return Number(String(priceStr).replace(/[^0-9.]/g, ""));
  };

  let finalPrice = 0;
  let originalPrice = 0;
  let discountPercentage = 0;

  if (hasPredefinedSizes) {
    const sellingPriceStr = currentVariant.sellingPrice?.[selectedSizeIndex];
    const mrpStr = currentVariant.mrp?.[selectedSizeIndex];
    let baseSellingPrice = parsePrice(sellingPriceStr);
    originalPrice = parsePrice(mrpStr);

    // --- MODIFIED --- Add installation charge if selected
    finalPrice =
      baseSellingPrice + (includeInstallation ? INSTALLATION_CHARGE : 0);
  } else {
    // This logic is for custom-sized items and remains unchanged
    const materialOptions = [
      { name: "Canvas", price: 299 },
      { name: "Premium Paper", price: 199 },
      { name: "Vinyl", price: 249 },
    ];
    const currentMaterial =
      materialOptions.find((m) => m.name === selectedMaterial) ||
      materialOptions[0];
    const width = Number(wallWidth) || 0;
    const height = Number(wallHeight) || 0;
    const totalArea = (width * height) / 144;
    const basePrice = currentMaterial.price * totalArea;
    const installationCost = 9 * totalArea; // Per-sq-ft installation
    finalPrice = basePrice + installationCost;
    originalPrice = 399 * totalArea;
  }

  if (originalPrice > 0 && finalPrice < originalPrice) {
    discountPercentage = Math.round(
      ((originalPrice - finalPrice) / originalPrice) * 100
    );
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!wallArt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-seasons">
            Wall Art Not Found
          </h1>
          <Link
            to="/wallart"
            className="text-primary-600 hover:underline font-lora"
          >
            Back to Wall Art
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
    // --- MODIFIED --- Add installation info to cart details
    const details = hasPredefinedSizes
      ? {
          size: currentVariant.size[selectedSizeIndex],
          price: finalPrice,
          installationIncluded: includeInstallation,
        }
      : {
          selectedMaterial,
          customDimensions: {
            width: Number(wallWidth) || 0,
            height: Number(wallHeight) || 0,
          },
          price: finalPrice,
        };
    await addItem(wallArt, quantity, details);
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!wallArt) return;
    const wallArtId = wallArt._id || wallArt.id;
    if (!wallArtId) return;
    setIsLoadingWishlist(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(wallArtId);
        setIsWishlisted(false);
      } else {
        await addToWishlist(wallArt);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const normalizeImageUrl = (raw?: string) => {
    if (!raw) return "";
    const img = raw.toString();
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${API_BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  };

  const variantImages =
    currentVariant?.images?.length > 0
      ? currentVariant.images.map(normalizeImageUrl)
      : wallArt.images?.length > 0
      ? wallArt.images.map(normalizeImageUrl)
      : ["https://via.placeholder.com/400x400?text=No+Image"];
  const mainImage =
    variantImages[selectedImageIndex] ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const whatsappLink = `https://wa.me/?text=I'm%20interested%20in%20${encodeURIComponent(
    wallArt.name
  )}`;
  // if (!wallArt) {
  //     return (
  //       <div className="flex items-center justify-center h-48">
  //         <div className="flex flex-col items-center gap-2">
  //           <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" />
  //           <span className="text-sm text-gray-500">Loading art...</span>
  //         </div>
  //       </div>
  //     );
  //   }

  // const skuShort = wallArt.skuId.slice(-3);
  const skuNum = parseInt(skuShort, 10);

  const selectedColorName = wallArt.colors.find(c => c[0] === selectedColor) || wallArt.colors[0];

  const imgSrc = `${API_BASE_URL}/images/wall_art/WA_${skuShort}/${skuNum}.1_${selectedColor}_WA.png`;
  return (
    <>
      <Helmet>
        <title>{wallArt.name} - Premium Wall Art | Nagomi</title>
        <meta name="description" content={wallArt.description} />
      </Helmet>
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/" className="text-[#172b9b] italic">
                Home
              </Link>
              <span>/</span>
              <Link to="/wallart" className="text-[#172b9b] italic">
                Wall Art
              </Link>
              <span>/</span>
              <span className="text-[#172b9b] italic">{wallArt.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                {/* <img
                  src={`${API_BASE_URL}/images/wall_art/WA_${wallArt.skuId.slice(
                    -3
                  )}/${parseInt(wallArt.skuId.slice(-3))}.1_${
                    wallArt.colors[0][0]
                  }_WA.png`}

                  alt={wallArt.name}
                  className="w-full h-full object-cover"
                /> */}
                {imgLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-600">
                        Loading image...
                      </span>
                    </div>
                  </div>
                )}
                {!imgError ? (
                  <img
                    src={imgSrc}
                    alt={wallArt.name}
                    className="w-full h-full object-cover"
                    onLoad={() => setImgLoading(false)}
                    onError={() => {
                      setImgLoading(false);
                      setImgError(true);
                    }}
                    // optional: let browser lazy-load offscreen images
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                    <svg
                      className="w-12 h-12 mb-2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 14l2-2 4 4M7 7h10"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Failed to load image
                    </p>
                  </div>
                )}

                {variantImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((p) =>
                          p === 0 ? variantImages.length - 1 : p - 1
                        )
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((p) =>
                          p === variantImages.length - 1 ? 0 : p + 1
                        )
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </motion.div>
            </div>

            <div className="space-y-6">
              {wallArt.bestseller && (
                <span className="inline-block bg-[#172b9b] text-white px-3 py-1 rounded text-sm font-bold mb-4">
                  BESTSELLER
                </span>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-2 font-seasons">
                {wallArt.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-700">{wallArt.rating} |</span>
                <span className="text-gray-700 underline cursor-pointer">
                  {wallArt.reviews} ratings
                </span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold text-[#172b9b]">
                  ₹{finalPrice.toFixed(0)}
                </span>
                {originalPrice > finalPrice && (
                  <span className="text-xl font-medium text-gray-500 line-through">
                    ₹{originalPrice.toFixed(0)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    SAVE {discountPercentage}%
                  </span>
                )}
              </div>
              {/*Size Div*/}
              {hasPredefinedSizes ? (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#172b9b] mb-2">
                Size: 
                <span className="text-gray-700 font-medium ml-2">
                  {currentVariant.size[selectedSizeIndex]}
                </span>
                </label>
                  <div className="flex gap-3 flex-wrap">
                    {currentVariant.size.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSizeIndex(index)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          selectedSizeIndex === index
                            ? "border-[#172b9b] bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <span className="text-sm font-medium">{size}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-[#172b9b] mb-2">
                      Material{" "}
                      <span
                        className="text-[#172b9b] italic underline cursor-pointer"
                        onClick={() => setMaterialGuideOpen(true)}
                      >
                        (Guide)
                      </span>
                    </label>
                    <MaterialGuideModal
                      open={materialGuideOpen}
                      onClose={() => setMaterialGuideOpen(false)}
                    />
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#172b9b] focus:border-[#172b9b]"
                    >
                      <option value="Canvas">Canvas</option>
                      <option value="Premium Paper">Premium Paper</option>
                      <option value="Vinyl">Vinyl</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-[#172b9b] mb-2">
                      Wall Size{" "}
                      <span
                        className="italic text-[#172b9b] underline cursor-pointer"
                        onClick={() => setWallGuideOpen(true)}
                      >
                        (Guide)
                      </span>
                    </label>
                    <WallGuideModal
                      open={wallGuideOpen}
                      onClose={() => setWallGuideOpen(false)}
                    />
                    <div className="flex gap-4 items-end">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-bold">
                          Height
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={wallHeight}
                            onChange={(e) =>
                              setWallHeight(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : ""
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded font-lora"
                            min={1}
                          />
                          <span className="ml-1 text-xs font-lora">in</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-bold">
                          Width
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={wallWidth}
                            onChange={(e) =>
                              setWallWidth(
                                e.target.value
                                  ? parseInt(e.target.value, 10)
                                  : ""
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded font-lora"
                            min={1}
                          />
                          <span className="ml-1 text-xs font-lora">in</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

             {/*color div*/}

              {/* <div className="flex justify-start gap-2 mt-4">
                {wallArt.colors.map((color) => {
                  const firstLetter = color[0];
                  const isSelected = firstLetter === selectedColor;

                  return (
                    <button
                      key={color}
                      // --- THIS IS THE LINE TO CHANGE ---
                      onClick={() => handleColorChange(firstLetter)}
                      className={`text-lg block font-bold mb-2 w-20 px-2 py-1 border-2 rounded-md font-lora 
          ${
            isSelected
              ? "bg-[#172b9b] text-white border-[#172b9b]"
              : "text-[#172b9b] border-[#172b9b]"
          }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div> */}

{/* --- Color Section --- */}
          <label className="block text-sm font-bold text-[#172b9b] mb-2 mt-4">
            Color:
            <span className="text-gray-700 font-medium ml-2">
              {selectedColorName}
            </span>
          </label>
          
          <div className="flex justify-start gap-2">
            {wallArt.colors.map((color) => {
              const firstLetter = color[0]; 
              const isSelected = firstLetter === selectedColor;

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(firstLetter)}
                  className={`text-lg block font-bold mb-2 w-20 px-2 py-1 border-2 rounded-md font-lora 
                    ${
                      isSelected
                        ? "bg-[#172b9b] text-white border-[#172b9b]"
                        : "text-[#172b9b] border-[#172b9b]"
                    }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
          {/* --- End of Color Section --- */}



              <div className="mb-6">
                <span className="text-medium text-gray-700 font-bold">
                  Need help placing the order?{" "}
                  <button
                    type="button"
                    className="text-[#172b9b] underline focus:outline-none"
                    onClick={() => setSupportModalOpen(true)}
                  >
                    Click here
                  </button>
                </span>
                <SupportModal
                  open={supportModalOpen}
                  onClose={() => setSupportModalOpen(false)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-[#172b9b] mb-2">
                  Check Delivery
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => {
                      setPinCode(e.target.value);
                      setPinCodeChecked(false);
                      setIsPinCodeValid(false);
                    }}
                    className="w-40 px-3 py-2 border border-gray-300 rounded-lg font-lora"
                    placeholder="Enter PIN code"
                    maxLength={6}
                  />
                  <button
                    onClick={handlePinCheck}
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#172b9b] rounded-lg hover:bg-[#1a2f8a]"
                  >
                    Check
                  </button>
                </div>
                {pinCodeChecked && (
                  <div className="mt-2 text-sm">
                    {isPinCodeValid ? (
                      <div className="text-green-700 font-semibold">
                        <p>YAY! You are eligible for free shipping!</p>
                        <p>Expected delivery by {getDeliveryDate()}.</p>
                      </div>
                    ) : (
                      <p className="text-red-600 font-semibold">
                        Sorry, delivery is not available for this PIN code.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* --- NEW --- Installation checkbox appears conditionally */}
              {hasPredefinedSizes && isPinCodeValid && (
                <div className="mb-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="installation-checkbox"
                    checked={includeInstallation}
                    onChange={() => setIncludeInstallation((prev) => !prev)}
                    className="w-5 h-5 text-[#172b9b] border-gray-300 rounded focus:ring-[#172b9b]"
                  />
                  <label
                    htmlFor="installation-checkbox"
                    className="text-sm font-medium text-[#172b9b]"
                  >
                    Include Installation (+₹{INSTALLATION_CHARGE})
                  </label>
                </div>
              )}

              {!hasPredefinedSizes && (
                <div className="mb-6">
                  <div className="text-xs italic text-[#172b9b]">
                    inclusive of all taxes
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`flex-1 py-2 px-2 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 text-lg ${
                    addedToCart
                      ? "bg-green-600 text-white"
                      : "bg-[#172b9b] text-white hover:bg-[#1a2f8a]"
                  }`}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added to Cart
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </motion.button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-2 px-2 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <FaWhatsapp className="w-6 h-6" />
                  Order on WhatsApp
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWishlistToggle}
                  disabled={isLoadingWishlist}
                  className={`p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                    isWishlisted ? "bg-red-50 border-red-300" : ""
                  } ${
                    isLoadingWishlist ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isWishlisted
                        ? "fill-current text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </motion.button>
              </div>

              <div className="flex w-max flex-wrap gap-6 justify-center border-t pt-6">
                <div className="flex flex-row items-center text-gray-700">
                  <img
                    src="/non-toxic-blue.png"
                    alt="Non-toxic & VOC Free"
                    className="w-16 h-16 mb-1"
                  />
                  <span className="text-base font-semibold italic">
                    Non-toxic <br /> & VOC Free
                  </span>
                </div>
                <div className="flex flex-row items-center text-gray-700">
                  <img
                    src="/custom-fit-blue.png"
                    alt="Custom Fitting"
                    className="w-16 h-16 mb-1"
                  />
                  <span className="text-base font-semibold italic">
                    Custom <br /> Fitting
                  </span>
                </div>
                <div className="flex flex-row items-center text-gray-700">
                  <img
                    src="/high-quality-blue.png"
                    alt="High Quality Print"
                    className="w-16 h-16 mb-1"
                  />
                  <span className="text-base font-semibold italic">
                    High Quality <br /> Print
                  </span>
                </div>
                <div className="flex flex-row items-center text-gray-700">
                  <img
                    src="/lasts-years-blue.png"
                    alt="Lasts Years"
                    className="w-16 h-16 mb-1"
                  />
                  <span className="text-base font-semibold italic">
                    Lasts <br /> 8-10 Years
                  </span>
                </div>
              </div>
            </div>
          </div>

          {relatedWallArt.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Related Wall Art
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedWallArt.map((relatedArt) => (
                  <WallArtCard
                    key={relatedArt.id || relatedArt._id}
                    wallArt={relatedArt}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-[#172b9b] mb-8 text-center">
              Frequently Asked Questions (FAQs)
            </h2>
            <div className="space-y-0">
              {[
                {
                  question:
                    "Why do I have to share 'Material' and 'Wall Size'?",
                  answer:
                    "For custom orders, material and wall size are essential for accurate pricing and ensuring the right amount of wall art is printed for your specific project. For products with predefined sizes, this is not required.",
                },
                {
                  question: "What happens after I place an order?",
                  answer:
                    "After placing your order, you'll receive a confirmation email with order details. Our team will review your specifications and contact you within 24 hours to confirm the order and discuss the delivery/installation timeline.",
                },
                {
                  question: "Are wall arts easy to clean and durable?",
                  answer:
                    "Yes, our premium wall arts are designed for durability and easy maintenance. They are washable, stain-resistant, and can last 8-10 years with proper care. Regular dusting and occasional gentle cleaning with a damp cloth is sufficient.",
                },
                {
                  question:
                    "Do you provide customisation? Can I share a design?",
                  answer:
                    "Absolutely! We offer custom wall art designs. You can share your design ideas, photos, or inspiration, and our design team will work with you to create a unique wall art that matches your vision and space requirements.",
                },
                {
                  question: "How to ensure my wall is ready for wall art?",
                  answer:
                    "Your wall should be clean, dry, and smooth. Remove any existing wallpaper, fill cracks or holes, and ensure the surface is free from dust and grease. Our installation team will assess the wall condition during a site visit if installation is requested.",
                },
                {
                  question: "What are the payment options available?",
                  answer:
                    "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. Payment is processed securely, and you can choose to pay the full amount upfront or opt for our flexible payment plans.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 font-medium">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        openFaqs[index] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaqs[index] && (
                    <div className="px-6 pb-4 text-gray-600 text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 w-full ">
            <div className="flex items-center justify-center  gap-8">
              <div className="flex-shrink-0">
                <h2 className="text-3xl font-bold text-[#172b9b] mb-4 font-seasons">
                  Reviews
                </h2>
                <div className="text-4xl font-bold text-[#172b9b] mb-2">
                  {wallArt.rating}
                </div>
                <div className="flex items-center text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Based on {wallArt.reviews} reviews
                </div>
                <button className="bg-[#172b9b] text-white px-6 py-2 rounded-lg font-semibold shadow-lg">
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WallArtDetail;
