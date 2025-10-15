import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { WallArt } from "../../types/index";
import { useWishlistStore } from "../../stores/useWishlistStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { API_BASE_URL } from "../../api/config";

interface WallArtCardProps {
  wallArt: WallArt;
}

const WallArtCard: React.FC<WallArtCardProps> = ({ wallArt }) => {
//   console.log("*********************************")
// console.log(wallArt)
// console.log("*********************************")
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    checkWishlistStatus,
  } = useWishlistStore();
  const { user } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);
  // Simple toast for unauthenticated wishlist
  const [showWishlistToast, setShowWishlistToast] = useState(false);



  const selected = wallArt.variants?.[selectedVariant];
  const isWhite = selected?.color?.toLowerCase() === "white";


  // Check wishlist status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const wallArtId = wallArt._id || wallArt.id;
      if (!wallArtId) return;

      if (user) {
        setIsLoadingWishlist(true);
        try {
          const status = await checkWishlistStatus(wallArtId);
          setIsWishlisted(status);
        } catch (error) {
          console.error("Error checking wishlist status:", error);
        } finally {
          setIsLoadingWishlist(false);
        }
      } else {
        // For non-logged in users, check local state
        setIsWishlisted(isInWishlist(wallArtId));
      }
    };

    checkStatus();
  }, [user, wallArt._id, wallArt.id, checkWishlistStatus, isInWishlist]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wallArtId = wallArt._id || wallArt.id;
    if (!wallArtId) return;

    setIsLoadingWishlist(true);
    if (!user) {
      // Unauthenticated: use localStorage wishlist
      if (!isWishlisted) {
        setIsWishlisted(true); // Optimistic update
        await addToWishlist(wallArt);
        setShowWishlistToast(true);
        setTimeout(() => setShowWishlistToast(false), 2000);
      } else {
        setIsWishlisted(false); // Optimistic update
        await removeFromWishlist(wallArtId);
      }
      setIsLoadingWishlist(false);
      return;
    }
    // Authenticated: use API
    if (isWishlisted) {
      setIsWishlisted(false); // Optimistic update
      removeFromWishlist(wallArtId)
        .catch((error) => {
          setIsWishlisted(true); // Revert if error
          console.error("Error removing from wishlist:", error);
        })
        .finally(() => setIsLoadingWishlist(false));
    } else {
      setIsWishlisted(true); // Optimistic update
      addToWishlist(wallArt)
        .catch((error) => {
          setIsWishlisted(false); // Revert if error
          console.error("Error adding to wishlist:", error);
        })
        .finally(() => setIsLoadingWishlist(false));
    }
  };
console.log("***********************")
console.log(((wallArt.skuId)))
console.log("***********************")
  // Get the current variant's image
  const cleanImageUrl = (url: string) => {
   const lastSlash = url.lastIndexOf('/');
  if (lastSlash === -1) return url;

  const folder = url.slice(0, lastSlash + 1);
  let filename = url.slice(lastSlash + 1);


  filename = filename.replace(/^0+/, '');


  if (!isWhite) {
    filename = filename.replace(/_W_(?=WA)/g, '');
  }

  return folder + filename;

  };
  const normalizeImageUrl = (raw?: string) => {
    const sku = wallArt.skuId || wallArt.id || wallArt._id || "";
    const img = (raw || "").toString();
    const newUrl = cleanImageUrl(img);
    if (!img) return raw;

    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("/uploads/")) return `${API_BASE_URL}${img}`;
    if (img.startsWith("/images/")) return `${API_BASE_URL}${img}`;
    // if (img.startsWith('/wall_art/')) return const newUrl = remove00FromUrl(img); `${API_BASE_URL}${img}`;
    if (img.startsWith("@uploads/"))
      return `${API_BASE_URL}/uploads/${img.substring("@uploads/".length)}`;
    if (img.startsWith("uploads/")) return `${API_BASE_URL}/${img}`;
    if (img.startsWith("@images/"))
      return `${API_BASE_URL}/images/${img.substring("@images/".length)}`;
    if (img.startsWith("images/")) return `${img}`;
    if (img.startsWith("wall_art/")) return `${API_BASE_URL}${img}`;
    // If this is a wall art SKU, assume file is located under /wall_art/<SKU>/<file>
    if (typeof sku === "string" && sku.startsWith("WA_")) return `${newUrl}`;
    // Default to images bucket
    return `${API_BASE_URL}/images/${img}`;
  };

  const currentVariant = wallArt.variants[selectedVariant];
  const imageUrl =
    currentVariant && currentVariant.images && currentVariant.images.length > 0
      ? normalizeImageUrl(currentVariant.images[0])
      : Array.isArray(wallArt.images) && wallArt.images.length > 0
      ? normalizeImageUrl(wallArt.images[0])
      : "https://www.nopcommerce.com/images/thumbs/0005720_coming-soon-page_550.jpeg";

  // Debug log
  // console.log("WallArtCard:", wallArt.name, imageUrl);

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
        <Link to={`/wallart/${wallArt._id || wallArt.id}`} className="block">
          <div className="relative overflow-hidden">
            <motion.img
              src={`https://server-hule.onrender.com/images/wall_art/WA_${wallArt.skuId.slice(-3)}/${parseInt(wallArt.skuId.slice(-3))}.1_${wallArt.colors[0][0]}_WA.png`}
              alt={wallArt.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              whileHover={{ scale: 1.12 }}
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {wallArt.bestseller && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse">
                  Bestseller
                </span>
              )}
              {wallArt.originalPrice && (
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
                  ? "bg-red-500 text-white"
                  : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white"
              } ${isLoadingWishlist ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </motion.button>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-[#172b9b] mb-2 line-clamp-2">
              {wallArt.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {wallArt.description}
            </p>
            <p className="font-bold italic text-[#545454] mb-2">
              {wallArt.originalPrice ? (
                <>
                  <span className="font-bold italic text-[#545454] line-through">
                    ₹{wallArt.originalPrice}
                  </span>{" "}
                  ₹{wallArt.price}
                </>
              ) : (
                <>₹{wallArt.price}</>
              )}
            </p>
            {Array.isArray(wallArt.colors) && wallArt.colors.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {wallArt.colors.slice(0, 4).map((c) => (
                  <span
                    key={c}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200"
                  >
                    {c}
                  </span>
                ))}
                {wallArt.colors.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    +{wallArt.colors.length - 4} more
                  </span>
                )}
              </div>
            )}
            {/* Color Variant Buttons */}

            {wallArt.variants && wallArt.variants.length > 1 && (
              <div className="mt-3 flex gap-2 justify-center">
                {wallArt.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(index);
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      selectedVariant === index
                        ? "border-gray-800 scale-110 shadow-md"
                        : "border-gray-300 hover:border-gray-500 hover:scale-105"
                    }`}
                    style={{ backgroundColor: variant.colorCode || "#6B7280" }}
                    title={variant.color}
                  />
                ))}
              </div>
            )}
            {wallArt.variants && wallArt.variants.length > 1 && (
              <div className="mt-3 flex gap-2 justify-center">
                {wallArt.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(index);
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      selectedVariant === index
                        ? "border-gray-800 scale-110 shadow-md"
                        : "border-gray-300 hover:border-gray-500 hover:scale-105"
                    }`}
                    style={{ backgroundColor: variant.colorCode || "#6B7280" }}
                    title={variant.color}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default WallArtCard;

