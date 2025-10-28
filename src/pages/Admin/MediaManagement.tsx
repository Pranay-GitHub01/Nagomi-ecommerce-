import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Loader2,
  AlertCircle,
  Upload,
  X,
  Image,
} from "lucide-react";
import { API_BASE_URL } from "../../api/config"; // Assuming this is the correct path

// Interface for the product data we expect back
interface FoundProduct {
  _id: string; // This will be our 'productId'
  name: string;
  skuId: string;
  category: string;
  images: string[];
}

// Interface for the search form
interface SearchFormData {
  skuId: string;
  category: string;
}

const MediaManagement: React.FC = () => {
  // State for search
  const { register, handleSubmit } = useForm<SearchFormData>();
  const [categories] = useState<string[]>([
    "Wallpaper",
    "Wallpaper-Roll",
    "Wallart",
  ]); // Example categories

  // State for results
  const [foundProduct, setFoundProduct] = useState<FoundProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For search loading
  const [isUploading, setIsUploading] = useState(false); // For upload loading
  const [error, setError] = useState<string | null>(null);

  /**
   * Searches for a product based on SKU and Category using the ADMIN endpoint
   */
  const handleSearch = async (data: SearchFormData) => {
    setIsLoading(true);
    setError(null);
    setFoundProduct(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams({
        skuId: data.skuId,
        category: data.category,
      }).toString();

      // --- CORRECTED TO USE ADMIN ENDPOINT ---
      const response = await fetch(`${API_BASE_URL}/api/admin/products?${query}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Token required for admin route
        },
      });
      // --- END OF CORRECTION ---

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication failed. Please log in again.");
        }
        // Attempt to get backend error message
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to search for product.");
      }

      const products: FoundProduct[] = await response.json();

      if (products.length > 0) {
        setFoundProduct(products[0]); // Set the first match
      } else {
        setError("No product found matching that SKU ID and Category.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during search.");
    }
    setIsLoading(false);
  };

  /**
   * Uploads new images for the found product
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !foundProduct) return;

    setIsUploading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Use 'image' (singular) based on backend developer's feedback
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }

    try {
      // Use the endpoint structure confirmed by backend developer
      const response = await fetch(
        `${API_BASE_URL}/api/admin/products/${foundProduct.category}/${foundProduct.skuId}/images`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            // No 'Content-Type', browser sets it for FormData
          },
          body: formData,
        }
      );

      // Improved Error Handling from previous step
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorText = `Upload failed: ${response.statusText}`;

        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorText = errData.message || errorText;
        } else {
          errorText = `Upload failed (${response.status}). The server sent back an invalid response (HTML/Text). Check server logs, auth token or API route.`;
          console.error("Server response was not JSON:", await response.text());
        }
        throw new Error(errorText);
      }

      // API should return the new, complete list of images
      // NOTE: Adjust parsing if backend response is different (e.g., { images: [...] })
      const uploadResult = await response.json();

      // Assuming result is { images: [...] } or just [...]
      const newImages = Array.isArray(uploadResult) ? uploadResult : uploadResult?.images;

      if (Array.isArray(newImages)) {
         setFoundProduct({ ...foundProduct, images: newImages });
      } else {
         console.warn("Upload response did not contain expected image list:", uploadResult);
         // Optionally, re-fetch the product to get the updated list
      }


    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    }
    setIsUploading(false);
  };

  /**
   * Deletes a specific image from the product
   */
  const handleImageDelete = async (imageUrl: string) => {
    if (!foundProduct || !window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setError(null);
    const token = localStorage.getItem("token");

    try {
      // Assuming DELETE uses the same endpoint structure but with DELETE method
      // And backend expects { imageUrl: "..." } in the body
      const response = await fetch(
        `${API_BASE_URL}/api/admin/products/${foundProduct.category}/${foundProduct.skuId}/images`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // Required for JSON body
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ imageUrl: imageUrl }), // Send the URL of the image to delete
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to delete image.");
      }

      // API should return the updated list of images
      // NOTE: Adjust parsing if backend response is different
      const deleteResult = await response.json();
      const newImages = Array.isArray(deleteResult) ? deleteResult : deleteResult?.images;


      if (Array.isArray(newImages)) {
        setFoundProduct({ ...foundProduct, images: newImages });
      } else {
         console.warn("Delete response did not contain expected image list:", deleteResult);
         // Optionally, re-fetch the product
      }

    } catch (err: any) {
      setError(err.message || "An error occurred during deletion.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Media Management</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
      >
        {/* 1. Search Form Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Find Product to Manage Media
          </h2>
          <form
            onSubmit={handleSubmit(handleSearch)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label htmlFor="skuId" className="block text-sm font-medium text-gray-700 mb-1">
                SKU ID
              </label>
              <input
                id="skuId"
                {...register("skuId", { required: true })}
                className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                {...register("category", { required: true })}
                className="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm sm:text-sm"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Media Management Card (if product is found) */}
        <AnimatePresence>
          {foundProduct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h2 className="text-lg font-medium leading-6 text-gray-900 mb-1">
                Manage Media for:
              </h2>
              <p className="text-xl font-semibold text-blue-700 mb-4">
                {foundProduct.name} ({foundProduct.skuId})
              </p>

              {/* Upload Area */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Upload New Images
                </h3>
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg ${isUploading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer bg-gray-50 hover:bg-gray-100'}`}>
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                       <p className="text-xs text-gray-500">PNG, JPG, WEBP, GIF</p>
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                    accept="image/*" // Accept common image types
                  />
                </label>
              </div>

              {/* Existing Images Grid */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-4">
                  Existing Images
                </h3>
                <AnimatePresence>
                  {foundProduct.images.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border"
                    >
                      <Image className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-500">
                        No images found for this product.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {foundProduct.images.map((imgUrl, i) => (
                        <motion.div
                          key={imgUrl} // Use imgUrl as key for stable animation
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="relative aspect-square group" // Added group for hover effect
                        >
                          <img
                            // Prepend API base URL if the path is relative
                            src={imgUrl.startsWith('/') ? `${API_BASE_URL}${imgUrl}` : imgUrl}
                            alt={`Product image ${i + 1}`}
                            className="w-full h-full object-cover rounded-md border border-gray-200"
                            // Add error handling for individual images if needed
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src = '/placeholder.jpg'; // Fallback
                            }}
                          />
                          <button
                            onClick={() => handleImageDelete(imgUrl)}
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 leading-none shadow-md hover:bg-red-700 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity" // Show button on hover
                            title="Delete Image"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default MediaManagement;