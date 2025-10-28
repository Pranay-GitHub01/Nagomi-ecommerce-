// src/components/admin/ProductThumbnail.tsx

import React, { useState, useEffect } from "react";
import { Product } from "../../types"; // Adjust path as needed
import { API_BASE_URL } from "../../api/config"; // Adjust path as needed

interface ProductThumbnailProps {
  product: Product;
  className?: string; // Allow passing custom classes (e.g., w-10 h-10)
}

// This component determines the image source based on SKU and handles loading/fallbacks
const ProductThumbnail: React.FC<ProductThumbnailProps> = ({ product, className = "w-12 h-12" }) => {
  const [imgSrc, setImgSrc] = useState<string>('/placeholder.jpg');
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<string[]>(['/placeholder.jpg']);

  // --- Logic for Wallpapers ---
  const getWallpaperCandidates = (): string[] => {
    const urls: string[] = [];
    // 1. Use image path from backend data first
    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      const raw = product.images[0];
      urls.push(raw.startsWith('/') ? `${API_BASE_URL}${raw}` : raw); // Prepend base URL if relative
    }

    // 2. Fallback guesses based on SKU
    const sku = product.skuId || (product as any).sku || ""; // Handle potential 'sku' property
    if (sku) {
      const base = String(sku).replace(/-WP$/i, ''); // Remove trailing -WP if present
      const rawSku = String(sku);
      // Construct potential paths (adjust '/images/' if needed)
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`${API_BASE_URL}/images/${rawSku}.${ext}`));
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`${API_BASE_URL}/images/${base}.${ext}`));
      ['webp', 'jpg', 'jpeg', 'png'].forEach(ext => urls.push(`${API_BASE_URL}/images/${base}-WP.${ext}`));
    }
    urls.push('/placeholder.jpg'); // Final fallback
    return Array.from(new Set(urls)); // Remove duplicates
  };

  // --- Logic for Wall Art ---
  const getWallArtUrl = (): string => {
    // 1. Use image path from backend data first
    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      const raw = product.images[0];
      return raw.startsWith('/') ? `${API_BASE_URL}${raw}` : raw; // Prepend base URL if relative
    }

    // 2. Fallback logic using SKU structure (adjust path as needed)
    const sku = product.skuId || "";
    if (!sku) return '/placeholder.jpg';

    const skuNum = sku.slice(-3); // Get last 3 digits
    const skuInt = parseInt(skuNum);
    if (isNaN(skuInt)) return '/placeholder.jpg'; // Invalid SKU format

    const colorInitial = (product.colors && product.colors.length > 0 && product.colors[0])
      ? product.colors[0][0].toUpperCase() // First letter of first color
      : 'G'; // Default color initial if none provided
    // Adjust this path based on your actual server structure
    return `${API_BASE_URL}/images/wall_art/WA_${skuNum}/${skuInt}.1_${colorInitial}_WA.png`;
  };

  useEffect(() => {
    setIsLoading(true);
    setCandidateIndex(0); // Reset index when product changes

    const sku = product.skuId || "";
    let newCandidates: string[] = [];

    // Determine candidates based on SKU prefix or category
    if (sku.startsWith("WA_") || sku.startsWith("WA-") || product.category?.toLowerCase() === 'wall-art') {
      newCandidates = [getWallArtUrl(), '/placeholder.jpg']; // Wall art logic
    } else {
      newCandidates = getWallpaperCandidates(); // Default to wallpaper logic
    }

    setCandidates(newCandidates);
    setImgSrc(newCandidates[0] || '/placeholder.jpg'); // Set initial image candidate

    // Dependencies: Rerun if product ID, SKU, main image, or category potentially change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id, product.skuId, product.images, product.category]);

  const handleImgError = () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidates.length) {
      // Try the next candidate image in the list
      setCandidateIndex(nextIndex);
      setImgSrc(candidates[nextIndex]);
      // Keep isLoading true until an image loads or all candidates fail
    } else {
      // All candidates failed, show placeholder definitively
      setImgSrc('/placeholder.jpg');
      setIsLoading(false); // Stop loading, show placeholder
    }
  };

  const handleImgLoad = () => {
    // An image (either a candidate or the final placeholder) successfully loaded
    setIsLoading(false);
  };

  return (
    <div className={`${className} rounded-md flex-shrink-0 bg-gray-200 relative overflow-hidden`}>
      {/* Show loading overlay only if loading AND the current src isn't the final placeholder */}
      {isLoading && imgSrc !== '/placeholder.jpg' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse" />
      )}
      <img
        key={imgSrc} // Add key to help React re-render correctly if src changes to the same failed URL type
        src={imgSrc}
        alt={product.name || 'Product Thumbnail'} // Add default alt text
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImgError}
        onLoad={handleImgLoad}
        loading="lazy" // Improves performance for lists
      />
    </div>
  );
};

export default ProductThumbnail;