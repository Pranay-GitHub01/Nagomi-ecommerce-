// import React, { useState, useCallback } from "react"; // Added useCallback
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import { ArrowLeft, X, Upload, Save, Image as ImageIcon, Loader2 } from "lucide-react"; // Added Loader2
// import { API_BASE_URL } from "../../api/config";
// import { Product } from "../../types"; // Assuming Product type exists
// import { PlusCircle } from "lucide-react";
// // Interface for form data (can use Partial<Product> or define specific fields)
// interface ProductFormData {
//   skuId: string;
//   name: string;
//   description: string;
//   category: string;
//   price: number;
//   originalPrice?: number | null; // Allow null for optional number
//   colors?: string[]; // Made optional
//   materials?: string[]; // Made optional
//   tags?: string[]; // Made optional
//   roomTypes?: string[]; // Made optional
//   inStock: boolean;
//   bestseller: boolean;
//   images?: string[]; // URLs of uploaded images
//   // Add variants if needed for Wall Art initially
//   variants?: Array<{
//     images?: string[];
//     size: string[];
//     mrp: string[]; // Keep as string if input is string
//     sellingPrice: string[]; // Keep as string if input is string
//   }>;
// }

// // Updated Schema
// const schema = yup.object({
//   skuId: yup.string().required("SKU ID is required"),
//   name: yup.string().required("Product name is required"),
//   description: yup.string().required("Description is required"),
//   category: yup.string().required("Category is required"),
//   price: yup.number().typeError("Price must be a number").positive("Price must be positive").required("Price is required"),
//   originalPrice: yup.number().typeError("Original Price must be a number").positive("Original Price must be positive").nullable().optional(),
//   inStock: yup.boolean().default(true),
//   bestseller: yup.boolean().default(false),
//   // Arrays are optional; validation happens if they exist
//   tags: yup.array().of(yup.string().required()).optional().default([]), // Default to empty array
//   colors: yup.array().of(yup.string().required()).optional().default([]),
//   materials: yup.array().of(yup.string().required()).optional().default([]),
//   roomTypes: yup.array().of(yup.string().required()).optional().default([]),
//   images: yup.array().of(yup.string().required()).min(1, "At least one image is required").optional().default([]), // Example: require at least one image
//   // Add basic variant validation if needed
//   variants: yup.array().of(
//     yup.object({
//         images: yup.array().of(yup.string().required()).optional(),
//         size: yup.array().of(yup.string().required()).min(1, "Variant size is required"),
//         mrp: yup.array().of(yup.string().required()).min(1, "Variant MRP is required"), // Validate as string first
//         sellingPrice: yup.array().of(yup.string().required()).min(1, "Variant Selling Price is required"), // Validate as string first
//     })
//   ).optional().default([]), // Default variants to empty array
// });

// // Array Input Component (Helper for Tags, Colors, etc.)
// const ArrayInput: React.FC<{
//   label: string;
//   items: string[];
//   setItems: (items: string[]) => void; // Simplified setter function type
//   placeholder?: string;
//   formFieldName?: keyof ProductFormData; // Optional: Link to RHF field name
//   setValue?: (name: keyof ProductFormData, value: any) => void; // Optional: RHF setValue
// }> = ({ label, items, setItems, placeholder, formFieldName, setValue }) => {
//   const [inputValue, setInputValue] = useState('');

//   const handleAddItem = () => {
//     const newItem = inputValue.trim();
//     if (newItem && !items.includes(newItem)) {
//       const updatedItems = [...items, newItem];
//       setItems(updatedItems);
//       // If linked to RHF, update its value too
//       if (formFieldName && setValue) {
//         setValue(formFieldName, updatedItems);
//       }
//       setInputValue('');
//     }
//   };

//   const handleRemoveItem = (itemToRemove: string) => {
//     const updatedItems = items.filter(item => item !== itemToRemove);
//     setItems(updatedItems);
//      // If linked to RHF, update its value too
//      if (formFieldName && setValue) {
//         setValue(formFieldName, updatedItems);
//       }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleAddItem();
//     }
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <div className="flex items-center space-x-2 mb-2">
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="flex-grow shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 bg-gray-50" // Added styles
//           placeholder={placeholder || `Add ${label.toLowerCase()}...`}
//         />
//         <button
//           type="button"
//           onClick={handleAddItem}
//           className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//         >
//           <PlusCircle className="w-5 h-5" />
//         </button>
//       </div>
//       <div className="flex flex-wrap gap-2 min-h-[24px]"> {/* Added min-height */}
//         {items.map((item, index) => (
//           <span
//             key={`${item}-${index}`} // Use index for key stability if items aren't unique enough
//             className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//           >
//             {item}
//             <button
//               type="button"
//               onClick={() => handleRemoveItem(item)}
//               className="ml-1.5 flex-shrink-0 text-blue-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
//               aria-label={`Remove ${item}`}
//             >
//               <X className="h-3 w-3" />
//             </button>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AddProduct: React.FC = () => {
//   const navigate = useNavigate();
//   // Keep separate state for UI interaction if needed, but RHF is the source of truth for submission
//   const [tags, setTags] = useState<string[]>([]);
//   const [colors, setColors] = useState<string[]>([]);
//   const [materials, setMaterials] = useState<string[]>([]);
//   const [roomTypes, setRoomTypes] = useState<string[]>([]);
//   const [images, setImages] = useState<string[]>([]); // URLs of uploaded images
//   const [uploading, setUploading] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null); // For submit errors

//   const [categories] = useState<string[]>([
//     "Wallpaper",
//     "Wallpaper-Roll",
//     "wall-art", // Use consistent casing with backend/validation
//   ]);

//   const {
//     register,
//     handleSubmit,
//     setValue, // Get setValue from RHF
//     watch, // Get watch to observe category changes
//     formState: { errors, isSubmitting },
//   } = useForm<ProductFormData>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       inStock: true,
//       bestseller: false,
//       tags: [],
//       colors: [],
//       materials: [],
//       roomTypes: [],
//       images: [],
//       price: undefined,
//       originalPrice: null, // Use null for optional number default
//       variants: [],
//     },
//   });

//   // Watch the category field to conditionally show variants
//   const selectedCategory = watch("category");

//   // --- Image Upload ---
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//       const selectedFiles = e.target.files;
//       if (!selectedFiles || selectedFiles.length === 0) return;
//       setUploading(true);
//       setSubmitError(null); // Clear previous errors
//       const uploadedUrls: string[] = [];
//       const token = localStorage.getItem("token");

//       if (!token) {
//           console.error("Authentication token not found for upload.");
//           setSubmitError("Authentication required. Please log in again.");
//           setUploading(false);
//           return;
//       }

//       for (let i = 0; i < selectedFiles.length; i++) {
//           const formData = new FormData();
//           formData.append("image", selectedFiles[i]);

//           try {
//               const res = await fetch(`${API_BASE_URL}/api/prodcuts`, {
//                   method: "POST",
//                   headers: { "Authorization": `Bearer ${token}` },
//                   body: formData,
//               });

//               if (!res.ok) {
//                   const errorData = await res.json().catch(() => ({ message: `Upload failed: ${res.statusText}` }));
//                   console.error("Image upload failed:", errorData.message);
//                   setSubmitError(`Failed to upload ${selectedFiles[i].name}: ${errorData.message}`);
//                   // Optionally break or continue based on preference
//                   continue;
//               }

//               const data = await res.json();
//               if (data.url) {
//                   uploadedUrls.push(data.url);
//               } else {
//                   console.error("Upload response missing URL:", data);
//                   setSubmitError(`Upload succeeded for ${selectedFiles[i].name}, but response format was unexpected.`);
//               }
//           } catch (error: any) {
//               console.error("Error during image upload:", error);
//               setSubmitError(`Network or server error during upload: ${error.message}`);
//           }
//       }

//       const updatedImages = [...images, ...uploadedUrls];
//       setImages(updatedImages);
//       setValue("images", updatedImages, { shouldValidate: true }); // Update RHF state and trigger validation
//       setUploading(false);

//       if (e.target) e.target.value = ''; // Clear file input
//   };

//   const handleRemoveImage = (index: number) => {
//     // Optionally: Add logic here to delete the image from the server if needed
//     const updatedImages = images.filter((_, idx) => idx !== index);
//     setImages(updatedImages);
//     setValue("images", updatedImages, { shouldValidate: true });
//   };

//   // --- Submit Handler ---
//   const onSubmit = async (data: ProductFormData) => {
//     setSubmitError(null); // Clear previous errors
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setSubmitError("Authentication required. Please log in again.");
//       return;
//     }

//     // Ensure array data from local state (if used) is included if not directly registered
//     // Or better, ensure RHF holds the final array values via setValue in handlers
//     const finalData: Partial<Product> = { // Use Partial<Product> for submission type safety
//       ...data,
//       // Use RHF values directly if setValue was used correctly
//       tags: data.tags || [],
//       colors: data.colors || [],
//       materials: data.materials || [],
//       roomTypes: data.roomTypes || [],
//       images: data.images || [],
//       variants: data.variants || [], // Include variants from RHF
//       // Omit createdAt/updatedAt, let backend handle it
//     };

//     // Clean up optional fields that might be empty strings from the form
//      if (finalData.originalPrice === null || finalData.originalPrice === undefined || finalData.originalPrice <= 0) {
//        delete finalData.originalPrice;
//      }

//     console.log("Submitting Product Data:", finalData);

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/admin/products`, { // Use ADMIN endpoint
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify(finalData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: `Request failed: ${response.statusText}` }));
//         throw new Error(errorData.message || "Failed to add product.");
//       }

//       console.log("Product added successfully!");
//       alert("Product added successfully!");
//       navigate("/admin/adminproducts"); // Navigate on success

//     } catch (error: any) {
//       console.error("An error occurred while submitting the product:", error);
//       setSubmitError(error.message || "An unexpected error occurred.");
//     }
//   };

//   // --- Input Styling ---
//   const getInputClasses = (field: keyof ProductFormData | 'tags' | string) => // Allow generic string for dynamic fields
//     `block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm
//      focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
//      ${
//        errors[field as keyof ProductFormData]
//          ? "border-red-500 bg-red-50 text-red-900 placeholder-red-400"
//          : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
//      }`;

//   const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
//   const errorClasses = "mt-1 text-sm text-red-600";

//   return (
//     <>
//       <Helmet> <title>Add New Product</title> </Helmet>

//       {/* Form fills the height and uses flex column */}
//       <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">

//         {/* Header Bar (Sticky) */}
//         <div className="flex-shrink-0 sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center h-16">
//               <div className="flex items-center gap-4">
//                 <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900" >
//                   <ArrowLeft size={16} /> Back
//                 </button>
//                 <h1 className="text-xl font-semibold text-gray-900"> Add New Product </h1>
//               </div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting || uploading}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? ( <> <Loader2 size={16} className="animate-spin" /> Saving... </> ) : ( <> <Save size={16} /> Save Product </> )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* SCROLLABLE CONTENT AREA */}
//         <div className="flex-1 overflow-y-auto bg-gray-100">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
//             className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
//           >
//             {/* Display Submit Error */}
//             {submitError && (
//               <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
//                 <strong>Error:</strong> {submitError}
//               </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Main Column */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Card: Core Details */}
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Core Details </h2>
//                    <div className="space-y-4">
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                        <div>
//                          <label htmlFor="skuId" className={labelClasses}> SKU ID </label>
//                          <input id="skuId" {...register("skuId")} className={getInputClasses("skuId")} />
//                          <p className={errorClasses}>{errors.skuId?.message}</p>
//                        </div>
//                        <div>
//                          <label htmlFor="name" className={labelClasses}> Product Name </label>
//                          <input id="name" {...register("name")} className={getInputClasses("name")} />
//                          <p className={errorClasses}>{errors.name?.message}</p>
//                        </div>
//                      </div>
//                      <div>
//                        <label htmlFor="description" className={labelClasses}> Description </label>
//                        <textarea id="description" {...register("description")} rows={4} className={getInputClasses("description")} />
//                        <p className={errorClasses}> {errors.description?.message} </p>
//                      </div>
//                    </div>
//                 </div>

//                 {/* Card: Media */}
//                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                     <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Media </h2>
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
//                         <input type="file" id="image-upload" multiple accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} className="hidden" disabled={uploading} />
//                         <label htmlFor="image-upload" className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} >
//                             {uploading ? ( <div className="flex flex-col items-center justify-center text-gray-500"> <Loader2 size={32} className="animate-spin mb-2 text-blue-500" /> <span>Uploading...</span> </div> ) : ( <div className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600"> <Upload size={32} className="mb-2" /> <span className="font-medium text-blue-600">Click to upload</span> <span>or drag and drop</span> <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p> </div> )}
//                         </label>
//                     </div>
//                     {/* Image Previews */}
//                     {images.length > 0 && (
//                         <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
//                             {images.map((imgUrl, index) => (
//                                 <div key={index} className="relative group aspect-square">
//                                     <img src={imgUrl.startsWith('/') ? `${API_BASE_URL}${imgUrl}` : imgUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md border border-gray-200" />
//                                     <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1" aria-label="Remove image" >
//                                         <X size={14} />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                      {errors.images && <p className={errorClasses}>{errors.images.message}</p>}
//                 </div>

//                  {/* --- Conditionally Render Variants for Wall Art --- */}
//                  {selectedCategory === 'wall-art' && (
//                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
//                              Wall Art Variants (Size & Price)
//                          </h2>
//                          {/* Basic example for one variant, expand if multiple needed */}
//                          <div className="space-y-4 border p-4 rounded-md">
//                              <h3 className="text-md font-medium text-gray-700">Variant 1</h3>
//                               <div>
//                                  <label htmlFor="variants.0.size" className={labelClasses}> Size(s) (comma-separated)</label>
//                                  <input
//                                      id="variants.0.size"
//                                      {...register("variants.0.size")} // Register with array index
//                                      placeholder="e.g., 3x2 feet, 6x3 feet"
//                                      className={getInputClasses(`variants.0.size`)}
//                                  />
//                                   {/* Manually display error for nested array field */}
//                                   {errors.variants?.[0]?.size && <p className={errorClasses}>{errors.variants[0].size.message}</p>}
//                              </div>
//                              <div>
//                                  <label htmlFor="variants.0.mrp" className={labelClasses}> MRP(s) (comma-separated, match size order)</label>
//                                  <input
//                                      id="variants.0.mrp"
//                                      {...register("variants.0.mrp")}
//                                      placeholder="e.g., ₹17000.00, ₹40000.00"
//                                      className={getInputClasses(`variants.0.mrp`)}
//                                  />
//                                  {errors.variants?.[0]?.mrp && <p className={errorClasses}>{errors.variants[0].mrp.message}</p>}
//                              </div>
//                               <div>
//                                  <label htmlFor="variants.0.sellingPrice" className={labelClasses}> Selling Price(s) (comma-separated, match size order)</label>
//                                  <input
//                                      id="variants.0.sellingPrice"
//                                      {...register("variants.0.sellingPrice")}
//                                      placeholder="e.g., ₹9500.00, ₹23000.00"
//                                      className={getInputClasses(`variants.0.sellingPrice`)}
//                                  />
//                                  {errors.variants?.[0]?.sellingPrice && <p className={errorClasses}>{errors.variants[0].sellingPrice.message}</p>}
//                              </div>
//                          </div>
//                          <p className="mt-2 text-xs text-gray-500">
//                              Enter sizes and corresponding prices separated by commas. Ensure the order matches.
//                          </p>
//                      </div>
//                  )}
//                  {/* --- End Variants Section --- */}

//               </div> {/* End Main Column */}

//               {/* Sidebar Column */}
//               <div className="lg:col-span-1 space-y-6">
//                 {/* Card: Status */}
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Status </h2>
//                    <div className="space-y-4">
//                      <label className="flex items-center justify-between"> <span className="text-sm font-medium text-gray-700"> In Stock </span> <input type="checkbox" {...register("inStock")} className="rounded h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" /> </label>
//                      <label className="flex items-center justify-between"> <span className="text-sm font-medium text-gray-700"> Bestseller </span> <input type="checkbox" {...register("bestseller")} className="rounded h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" /> </label>
//                    </div>
//                 </div>

//                 {/* Card: Categorization */}
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Categorization </h2>
//                    <div className="space-y-4">
//                      <div>
//                        <label htmlFor="category" className={labelClasses}> Category </label>
//                        <select id="category" {...register("category")} className={getInputClasses("category")} >
//                          <option value="">Select Category</option>
//                          {categories.map((category) => ( <option key={category} value={category}> {category} </option> ))}
//                        </select>
//                        <p className={errorClasses}> {errors.category?.message} </p>
//                      </div>
//                      {/* Use ArrayInput component for tags */}
//                      <ArrayInput
//                         label="Tags"
//                         items={tags}
//                         setItems={setTags} // Local state setter
//                         placeholder="Type tag and press Enter"
//                         formFieldName="tags" // Link to RHF field
//                         setValue={setValue} // Pass RHF setValue
//                      />
//                      {/* Add ArrayInput components for colors, materials, roomTypes similarly */}
//                       <ArrayInput label="Colors" items={colors} setItems={setColors} formFieldName="colors" setValue={setValue} />
//                       <ArrayInput label="Materials" items={materials} setItems={setMaterials} formFieldName="materials" setValue={setValue} />
//                       <ArrayInput label="Room Types" items={roomTypes} setItems={setRoomTypes} formFieldName="roomTypes" setValue={setValue} />
//                    </div>
//                 </div>

//                 {/* Card: Pricing */}
//                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Pricing </h2>
//                    <div className="space-y-4">
//                      <div>
//                        <label htmlFor="price" className={labelClasses}> Price (₹) </label>
//                        <input type="number" id="price" step="0.01" {...register("price", { valueAsNumber: true })} className={getInputClasses("price")} placeholder="0.00" />
//                        <p className={errorClasses}>{errors.price?.message}</p>
//                      </div>
//                      <div>
//                        <label htmlFor="originalPrice" className={labelClasses}> Original Price (₹) (Optional) </label>
//                        <input type="number" id="originalPrice" step="0.01" {...register("originalPrice", { valueAsNumber: true })} className={getInputClasses("originalPrice")} placeholder="0.00" />
//                        <p className={errorClasses}>{errors.originalPrice?.message}</p>
//                      </div>
//                    </div>
//                 </div>
//               </div> {/* End Sidebar Column */}
//             </div> {/* End Grid */}
//           </motion.div>
//         </div> {/* End Scrollable Area */}
//       </form> {/* End Form */}
//     </>
//   );
// };

// export default AddProduct;

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, X, Save, Loader2, PlusCircle } from "lucide-react"; // Removed Upload, Image
import { API_BASE_URL } from "../../api/config";
import { Product } from "../../types";

// Interface for form data
interface ProductFormData {
  skuId: string;
  sequence: string; // Optional sequenceId
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  colors?: string[];
  materials?: string[];
  tags?: string[];
  roomTypes?: string[];
  inStock: boolean;
  bestseller: boolean;
  // images?: string[]; // Removed images
  variants?: Array<{
    images?: string[];
    size: string[];
    mrp: string[];
    sellingPrice: string[];

    id: string; // <-- ADD THIS
    color: string; // <-- ADD THIS
  }>;
}

// Updated Schema
const schema = yup.object({
  skuId: yup.string().required("SKU ID is required"),
  sequence: yup
    .string()
    .typeError("Sequence must be a number")
    .required("Sequence is required"),
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  originalPrice: yup
    .number()
    .typeError("Original Price must be a number")
    .positive("Original Price must be positive")
    .nullable()
    .optional(),
  inStock: yup.boolean().default(true),
  bestseller: yup.boolean().default(false),
  tags: yup.array().of(yup.string().required()).optional().default([]),
  colors: yup.array().of(yup.string().required()).optional().default([]),
  materials: yup.array().of(yup.string().required()).optional().default([]),
  roomTypes: yup.array().of(yup.string().required()).optional().default([]),
  // images: yup.array()... // Removed images validation
  // ...
  variants: yup
    .array()
    .of(
      yup.object({
        images: yup.array().of(yup.string().required()).optional(),

        // --- UPDATED FIELDS START HERE ---

        id: yup.string().required("Variant ID is required"),
        color: yup.string().required("Variant color is required"),

        size: yup
          .array()
          .of(yup.string().required())
          .transform((value, originalValue) => {
            if (typeof originalValue === "string") {
              // Split the string by comma, trim whitespace, and filter out empty strings
              return originalValue
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
            return value; // Return the value as-is if it's not a string
          })
          .min(1, "Variant size is required"),

        mrp: yup
          .array()
          .of(yup.string().required())
          .transform((value, originalValue) => {
            if (typeof originalValue === "string") {
              return originalValue
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
            return value;
          })
          .min(1, "Variant MRP is required"),

        sellingPrice: yup
          .array()
          .of(yup.string().required())
          .transform((value, originalValue) => {
            if (typeof originalValue === "string") {
              return originalValue
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
            return value;
          })
          .min(1, "Variant Selling Price is required"),

        // --- UPDATED FIELDS END HERE ---
      })
    )
    .optional()
    .default([]),
  // ...
});

// Array Input Component (Helper for Tags, Colors, etc.)
const ArrayInput: React.FC<{
  label: string;
  items: string[];
  setItems: (items: string[]) => void;
  placeholder?: string;
  formFieldName?: keyof ProductFormData;
  setValue?: (name: keyof ProductFormData, value: any) => void;
}> = ({ label, items, setItems, placeholder, formFieldName, setValue }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddItem = () => {
    const newItem = inputValue.trim();
    if (newItem && !items.includes(newItem)) {
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      if (formFieldName && setValue) {
        setValue(formFieldName, updatedItems);
      }
      setInputValue("");
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    const updatedItems = items.filter((item) => item !== itemToRemove);
    setItems(updatedItems);
    if (formFieldName && setValue) {
      setValue(formFieldName, updatedItems);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 bg-gray-50"
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[24px]">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {item}
            <button
              type="button"
              onClick={() => handleRemoveItem(item)}
              className="ml-1.5 flex-shrink-0 text-blue-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              aria-label={`Remove ${item}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  // State for array inputs
  const [tags, setTags] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  // const [images, setImages] = useState<string[]>([]); // Removed
  // const [uploading, setUploading] = useState(false); // Removed
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [categories] = useState<string[]>([
    "Wallpaper",
    "Wallpaper-Roll",
    "wall-art",
    "peel-n-stick",
    "luxe",
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      inStock: true,
      bestseller: false,
      tags: [],
      colors: [],
      materials: [],
      roomTypes: [],
      // images: [], // Removed
      price: undefined,
      originalPrice: null,
      variants: [],
    },
  });

  const selectedCategory = watch("category");

  // --- Image Upload Logic Removed ---
  // const handleImageUpload = ... // Removed
  // const handleRemoveImage = ... // Removed

  // --- Submit Handler ---
  const onSubmit = async (data: ProductFormData) => {
    setSubmitError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitError("Authentication required. Please log in again.");
      return;
    }

    const finalData: Partial<Product> = {
      ...data,
      tags: data.tags || [],
      colors: data.colors || [],
      materials: data.materials || [],
      roomTypes: data.roomTypes || [],
      // images: data.images || [], // Removed
      variants: data.variants || [],
    };

    if (
      finalData.originalPrice === null ||
      finalData.originalPrice === undefined ||
      finalData.originalPrice <= 0
    ) {
      delete finalData.originalPrice;
    }

    console.log("Submitting Product Data:", finalData);

    try {
      // --- UPDATED URL ---
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        // Removed /admin/
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `Request failed: ${response.statusText}` }));
        throw new Error(errorData.message || "Failed to add product.");
      }

      console.log("Product added successfully!");
      alert("Product added successfully!");
      navigate("/admin/dashboard"); 
    } catch (error: any) {
      console.error("An error occurred while submitting the product:", error);
      setSubmitError(error.message || "An unexpected error occurred.");
    }
  };

  // --- Input Styling ---
  const getInputClasses = (field: keyof ProductFormData | "tags" | string) =>
    `block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm
     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
     ${
       errors[field as keyof ProductFormData]
         ? "border-red-500 bg-red-50 text-red-900 placeholder-red-400"
         : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500"
     }`;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "mt-1 text-sm text-red-600";

  return (
    <>
      <Helmet>
        {" "}
        <title>Add New Product</title>{" "}
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        {/* Header Bar (Sticky) */}
        <div className="flex-shrink-0 sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  {" "}
                  Add New Product{" "}
                </h1>
              </div>
              <button
                type="submit"
                disabled={isSubmitting} // Removed 'uploading' from disabled check
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    {" "}
                    <Loader2
                      size={16}
                      className="animate-spin"
                    /> Saving...{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Save size={16} /> Save Product{" "}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
          >
            {/* Display Submit Error */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                <strong>Error:</strong> {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Card: Core Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {" "}
                    Core Details{" "}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="skuId" className={labelClasses}>
                          {" "}
                          SKU ID{" "}
                        </label>
                        <input
                          id="skuId"
                          {...register("skuId")}
                          className={getInputClasses("skuId")}
                        />
                        <p className={errorClasses}>{errors.skuId?.message}</p>
                      </div>

                      {/*___________SEQUENCE number addition for products__________*/}
                      <div>
                        <label htmlFor="sequence" className={labelClasses}>
                          Sequence
                        </label>
                        <input
                          id="sequence"
                          type="text" // 1. Enforce number input in browser
                          {...register("sequence", { valueAsNumber: true })} // 2. Ensure React treats it as number
                          className={getInputClasses("sequence")}
                        />
                        <p className={errorClasses}>
                          {errors.sequence?.message}
                        </p>
                      </div>
                      {/*___________SEQUENCE number addition for products__________*/}

                      <div>
                        <label htmlFor="name" className={labelClasses}>
                          {" "}
                          Product Name{" "}
                        </label>
                        <input
                          id="name"
                          {...register("name")}
                          className={getInputClasses("name")}
                        />
                        <p className={errorClasses}>{errors.name?.message}</p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="description" className={labelClasses}>
                        {" "}
                        Description{" "}
                      </label>
                      <textarea
                        id="description"
                        {...register("description")}
                        rows={4}
                        className={getInputClasses("description")}
                      />
                      <p className={errorClasses}>
                        {" "}
                        {errors.description?.message}{" "}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card: Media (Removed) */}

                {/* Card: Variants (Conditionally Rendered) */}
                {(selectedCategory === "wall-art" ||
                  selectedCategory === "peel-n-stick" ||
                  selectedCategory === "luxe") && (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Variants (Size & Price)
                    </h2>
                    <div className="space-y-4 border p-4 rounded-md">
                      <h3 className="text-md font-medium text-gray-700">
                        Variant 1
                      </h3>

                      {/* --- ADD THIS GRID --- */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="variants.0.id"
                            className={labelClasses}
                          >
                            {" "}
                            Variant ID (SKU){" "}
                          </label>
                          <input
                            id="variants.0.id"
                            {...register("variants.0.id")}
                            placeholder="e.g., WA-ART-001A"
                            className={getInputClasses(`variants.0.id`)}
                          />
                          {errors.variants?.[0]?.id && (
                            <p className={errorClasses}>
                              {errors.variants[0].id.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="variants.0.color"
                            className={labelClasses}
                          >
                            {" "}
                            Variant Color{" "}
                          </label>
                          <input
                            id="variants.0.color"
                            {...register("variants.0.color")}
                            placeholder="e.g., Rustic Brown"
                            className={getInputClasses(`variants.0.color`)}
                          />
                          {errors.variants?.[0]?.color && (
                            <p className={errorClasses}>
                              {errors.variants[0].color.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* --- END OF ADDED GRID --- */}

                      <div>
                        <label
                          htmlFor="variants.0.size"
                          className={labelClasses}
                        >
                          {" "}
                          Size(s) (comma-separated)
                        </label>
                        <input
                          id="variants.0.size"
                          {...register("variants.0.size")}
                          placeholder="e.g., 3x2 feet, 6x3 feet"
                          className={getInputClasses(`variants.0.size`)}
                        />
                        {errors.variants?.[0]?.size && (
                          <p className={errorClasses}>
                            {errors.variants[0].size.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="variants.0.mrp"
                          className={labelClasses}
                        >
                          {" "}
                          MRP(s) (comma-separated, match size order)
                        </label>
                        <input
                          id="variants.0.mrp"
                          {...register("variants.0.mrp")}
                          placeholder="e.g., ₹17000.00, ₹40000.00"
                          className={getInputClasses(`variants.0.mrp`)}
                        />
                        {errors.variants?.[0]?.mrp && (
                          <p className={errorClasses}>
                            {errors.variants[0].mrp.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="variants.0.sellingPrice"
                          className={labelClasses}
                        >
                          {" "}
                          Selling Price(s) (comma-separated, match size order)
                        </label>
                        <input
                          id="variants.0.sellingPrice"
                          {...register("variants.0.sellingPrice")}
                          placeholder="e.g., ₹9500.00, ₹23000.00"
                          className={getInputClasses(`variants.0.sellingPrice`)}
                        />
                        {errors.variants?.[0]?.sellingPrice && (
                          <p className={errorClasses}>
                            {errors.variants[0].sellingPrice.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Enter sizes and corresponding prices separated by commas.
                      Ensure the order matches.
                    </p>
                  </div>
                )}
              </div>{" "}
              {/* End Main Column */}
              {/* Sidebar Column */}
              <div className="lg:col-span-1 space-y-6">
                {/* Card: Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {" "}
                    Status{" "}
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      {" "}
                      <span className="text-sm font-medium text-gray-700">
                        {" "}
                        In Stock{" "}
                      </span>{" "}
                      <input
                        type="checkbox"
                        {...register("inStock")}
                        className="rounded h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />{" "}
                    </label>
                    <label className="flex items-center justify-between">
                      {" "}
                      <span className="text-sm font-medium text-gray-700">
                        {" "}
                        Bestseller{" "}
                      </span>{" "}
                      <input
                        type="checkbox"
                        {...register("bestseller")}
                        className="rounded h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />{" "}
                    </label>
                  </div>
                </div>

                {/* Card: Categorization */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {" "}
                    Categorization{" "}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="category" className={labelClasses}>
                        {" "}
                        Category{" "}
                      </label>
                      <select
                        id="category"
                        {...register("category")}
                        className={getInputClasses("category")}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {" "}
                            {category}{" "}
                          </option>
                        ))}
                      </select>
                      <p className={errorClasses}>
                        {" "}
                        {errors.category?.message}{" "}
                      </p>
                    </div>
                    <ArrayInput
                      label="Tags"
                      items={tags}
                      setItems={setTags}
                      placeholder="Type tag and press Enter"
                      formFieldName="tags"
                      setValue={setValue}
                    />
                    <ArrayInput
                      label="Colors"
                      items={colors}
                      setItems={setColors}
                      formFieldName="colors"
                      setValue={setValue}
                    />
                    <ArrayInput
                      label="Materials"
                      items={materials}
                      setItems={setMaterials}
                      formFieldName="materials"
                      setValue={setValue}
                    />
                    <ArrayInput
                      label="Room Types"
                      items={roomTypes}
                      setItems={setRoomTypes}
                      formFieldName="roomTypes"
                      setValue={setValue}
                    />
                  </div>
                </div>

                {/* Card: Pricing */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {" "}
                    Pricing{" "}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="price" className={labelClasses}>
                        {" "}
                        Price (₹){" "}
                      </label>
                      <input
                        type="number"
                        id="price"
                        step="0.01"
                        {...register("price", { valueAsNumber: true })}
                        className={getInputClasses("price")}
                        placeholder="0.00"
                      />
                      <p className={errorClasses}>{errors.price?.message}</p>
                    </div>
                    <div>
                      <label htmlFor="originalPrice" className={labelClasses}>
                        {" "}
                        Original Price (₹) (Optional){" "}
                      </label>
                      <input
                        type="number"
                        id="originalPrice"
                        step="0.01"
                        {...register("originalPrice", { valueAsNumber: true })}
                        className={getInputClasses("originalPrice")}
                        placeholder="0.00"
                      />
                      <p className={errorClasses}>
                        {errors.originalPrice?.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* End Sidebar Column */}
            </div>{" "}
            {/* End Grid */}
          </motion.div>
        </div>{" "}
        {/* End Scrollable Area */}
      </form>{" "}
      {/* End Form */}
    </>
  );
};

export default AddProduct;
