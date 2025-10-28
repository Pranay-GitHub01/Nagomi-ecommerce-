// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Helmet } from "react-helmet-async";
// import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";

// // Interface for the form data
// interface UploadFormData {
//   category: string;
//   skuId: string;
// }

// // Define your base API URL
// import { API_BASE_URL } from "../../api/config";

// const UploadProductImagePage: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset, // Import reset to clear the form
//   } = useForm<UploadFormData>();

//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // Example categories - ensure these match backend expectations if needed
//   const categories = ["Wallpaper", "Wallpaper-Roll", "wall-art"]; // Corrected category names based on API data

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFiles(e.target.files);
//     setSuccessMessage(null); // Clear previous success message
//     setError(null); // Clear previous error
//   };

//   const onSubmit = async (data: UploadFormData) => {
//     if (!selectedFiles || selectedFiles.length === 0) {
//       setError("Please select at least one image file to upload.");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);
//     setSuccessMessage(null);
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setError("Authentication token not found. Please log in.");
//       setIsUploading(false);
//       return;
//     }

//     // --- USE THIS DYNAMIC URL (Corrected ending based on error and developer feedback) ---
//     // const uploadUrl = `${API_BASE_URL}/api/products/${encodeURIComponent(
//     //   data.category
//     // )}/${encodeURIComponent(data.skuId)}/images`; // <--- Ends with /images
// const uploadUrl = `${API_BASE_URL}/api/products/${encodeURIComponent(
//       data.category
//     )}/${encodeURIComponent(data.skuId)}/images`; // <--- Ends with /image
//     const formData = new FormData();
//     for (let i = 0; i < selectedFiles.length; i++) {
//       // --- USE SINGULAR 'image' KEY as requested by backend dev ---
//       formData.append("image", selectedFiles[i]);
//     }

//     try {
//       const response = await fetch(uploadUrl, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // No 'Content-Type', browser sets it for FormData
//         },
//         body: formData,
//       });

//       // Handle potential errors (including 500)
//       if (!response.ok) {
//         let errorText = `Upload failed: ${response.statusText}`;
//         try {
//           const errData = await response.json();
//           errorText = errData.message || errorText;
//         } catch (jsonError) {
//           console.error("Non-JSON error response:", await response.text());
//           errorText = `Upload failed (${response.status}). Check server logs or network tab.`;
//         }
//         throw new Error(errorText);
//       }

//       // Process success response
//       const result = await response.json();
//       console.log("Upload successful:", result);
//       setSuccessMessage(
//         `Successfully uploaded ${selectedFiles.length} image(s) for ${data.skuId}.`
//       );

//       // Clear the form and file input
//       reset(); // Reset react-hook-form fields
//       setSelectedFiles(null);
//       const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
//       if (fileInput) fileInput.value = '';

//     } catch (err: any) {
//       setError(err.message || "An unexpected error occurred during upload.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Upload Product Images</title>
//       </Helmet>
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-200">
//           <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
//             Upload Product Images by SKU
//           </h1>

//           {/* Error Message Display */}
//           {error && (
//             <div
//               className="mb-4 bg-red-50 border border-red-300 text-red-800 p-3 rounded-lg flex items-center gap-2 text-sm"
//               role="alert"
//             >
//               <AlertCircle className="w-5 h-5 flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Success Message Display */}
//           {successMessage && (
//              <div
//                className="mb-4 bg-green-50 border border-green-300 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm"
//                role="alert"
//              >
//                <CheckCircle className="w-5 h-5 flex-shrink-0" />
//                <span>{successMessage}</span>
//              </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Category Input */}
//             <div>
//               <label
//                 htmlFor="category"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Product Category <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="category"
//                 {...register("category", { required: "Category is required" })}
//                 className={`block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//                   errors.category
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-gray-50"
//                 }`}
//                 disabled={isUploading}
//               >
//                 <option value="">Select Category...</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//               {errors.category && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.category.message}
//                 </p>
//               )}
//             </div>

//             {/* SKU ID Input */}
//             <div>
//               <label
//                 htmlFor="skuId"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Product SKU ID <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="skuId"
//                 type="text"
//                 {...register("skuId", { required: "SKU ID is required" })}
//                 placeholder="e.g., WP-001 or WA-123"
//                 className={`block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
//                   errors.skuId
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 bg-gray-50"
//                 }`}
//                 disabled={isUploading}
//               />
//               {errors.skuId && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.skuId.message}
//                 </p>
//               )}
//             </div>

//             {/* File Input */}
//             <div>
//               <label
//                 htmlFor="imageUpload"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Image Files <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="imageUpload"
//                 type="file"
//                 multiple
//                 accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isUploading}
//               />
//               {selectedFiles && selectedFiles.length > 0 && (
//                 <p className="mt-1 text-sm text-gray-600">
//                   {selectedFiles.length} file(s) selected.
//                 </p>
//               )}
//                {/* Display error if no files are selected on submit attempt */}
//                {!selectedFiles && error?.includes("Please select") && (
//                  <p className="mt-1 text-sm text-red-600">{error}</p>
//                )}
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={isUploading}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isUploading ? (
//                   <>
//                     <Loader2 size={16} className="animate-spin" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload size={16} />
//                     Upload Images
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UploadProductImagePage;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";

// Interface for the form data
interface UploadFormData {
  category: string;
  skuId: string;
}

// Define your base API URL
const API_BASE_URL = "https://server-hule.onrender.com";

const UploadProductImagePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Import reset to clear the form
  } = useForm<UploadFormData>();

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Example categories - ensure these match backend expectations if needed
  const categories = ["Wallpaper", "Wallpaper-Roll", "wall-art"]; // Corrected category names based on API data

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
    setSuccessMessage(null); // Clear previous success message
    setError(null); // Clear previous error
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select at least one image file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setIsUploading(false);
      return;
    }

    // --- USE THIS DYNAMIC URL (Corrected ending) ---
    const uploadUrl = `${API_BASE_URL}/api/admin/products/${encodeURIComponent(
      data.category
    )}/${encodeURIComponent(data.skuId)}/images`; // <--- Ends with /images

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      // --- USE SINGULAR 'image' KEY as requested by backend dev ---
      formData.append("image", selectedFiles[i]);
    }

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // No 'Content-Type', browser sets it for FormData
        },
        body: formData,
      });

      // Handle potential errors (including 500)
      if (!response.ok) {
        let errorText = `Upload failed: ${response.statusText}`;
        try {
          // Try to parse the specific validation error message
          const errData = await response.json();
          // Include the detailed message if available
          errorText = errData.message ? `Upload failed (${response.status}): ${errData.message}` : errorText;
        } catch (jsonError) {
          // Fallback if the response isn't JSON
          const textResponse = await response.text();
          console.error("Non-JSON error response:", textResponse);
          errorText = `Upload failed (${response.status}). Check server logs or network tab. Response: ${textResponse.substring(0, 100)}...`; // Show snippet
        }
        throw new Error(errorText);
      }

      // Process success response
      const result = await response.json();
      console.log("Upload successful:", result);
      setSuccessMessage(
        `Successfully uploaded ${selectedFiles.length} image(s) for ${data.skuId}.`
      );

      // Clear the form and file input
      reset(); // Reset react-hook-form fields
      setSelectedFiles(null);
      const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- JSX Form ---
  return (
    <>
      <Helmet>
        <title>Upload Product Images</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Upload Product Images by SKU
          </h1>

          {/* Error Message Display */}
          {error && (
            <div
              className="mb-4 bg-red-50 border border-red-300 text-red-800 p-3 rounded-lg flex items-center gap-2 text-sm"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {/* Break long error messages */}
              <span className="break-words">{error}</span>
            </div>
          )}

          {/* Success Message Display */}
          {successMessage && (
             <div
               className="mb-4 bg-green-50 border border-green-300 text-green-800 p-3 rounded-lg flex items-center gap-2 text-sm"
               role="alert"
             >
               <CheckCircle className="w-5 h-5 flex-shrink-0" />
               <span>{successMessage}</span>
             </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Input */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className={`block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.category
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                disabled={isUploading}
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* SKU ID Input */}
            <div>
              <label
                htmlFor="skuId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product SKU ID <span className="text-red-500">*</span>
              </label>
              <input
                id="skuId"
                type="text"
                {...register("skuId", { required: "SKU ID is required" })}
                placeholder="e.g., WP-001 or WA-123"
                className={`block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.skuId
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                disabled={isUploading}
              />
              {errors.skuId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.skuId.message}
                </p>
              )}
            </div>

            {/* File Input */}
            <div>
              <label
                htmlFor="imageUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image Files <span className="text-red-500">*</span>
              </label>
              <input
                id="imageUpload"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}
              />
              {selectedFiles && selectedFiles.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedFiles.length} file(s) selected.
                </p>
              )}
               {/* Display file selection error */}
               {error && error.includes("Please select") && (
                 <p className="mt-1 text-sm text-red-600">{error}</p>
               )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Images
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadProductImagePage;