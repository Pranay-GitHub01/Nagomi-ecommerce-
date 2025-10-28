import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// Added AlertTriangle for error display consistency
import { Loader2, Save, Trash2, PlusCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Product } from '../../types'; // Adjust path as needed
import { API_BASE_URL } from '../../api/config'; // Adjust path as needed

// --- Helper component for managing array inputs ---
const ArrayInput: React.FC<{
  label: string;
  items: string[];
  setItems: (items: string[]) => void; // Simplified prop type
}> = ({ label, items, setItems }) => {
  const [newItem, setNewItem] = React.useState('');

  const handleAddItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleAddItem();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={`Add a new ${label.toLowerCase()}...`}
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
          aria-label={`Add ${label}`}
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {item}
            <button
              type="button"
              onClick={() => handleRemoveItem(item)}
              className="ml-1.5 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
              aria-label={`Remove ${item}`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// --- Main Edit Product Page Component ---
const EditProductPage: React.FC = () => {
  // Get product 'id' from URL parameter
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for product data, loading, saving, deleting, and errors
  const [product, setProduct] = React.useState<Partial<Product>>({});
  const [initialProduct, setInitialProduct] = React.useState<Partial<Product>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // --- Fetch Product Data on Mount ---
  React.useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing from URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch from the ADMIN endpoint using GET
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch product details.' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: Product = await response.json();

        // Initialize state, ensuring arrays are properly handled
        const initialData = {
          ...data,
          colors: Array.isArray(data.colors) ? data.colors : [],
          materials: Array.isArray(data.materials) ? data.materials : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
          roomTypes: Array.isArray(data.roomTypes) ? data.roomTypes : [],
          images: Array.isArray(data.images) ? data.images : [],
          variants: Array.isArray(data.variants) ? data.variants : [],
        };
        setProduct(initialData);
        setInitialProduct(initialData); // Store initial state
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-fetch if ID changes

  // --- Handle Standard Input Changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle checkboxes
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setProduct(prev => ({ ...prev, [name]: e.target.checked }));
      return;
    }
    // Handle number inputs (allow empty string, convert to number or null)
    if (type === 'number') {
      setProduct(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
      return;
    }
    // Handle text, textarea, select
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // --- Handlers for Array States using useCallback ---
  const setColors = React.useCallback((items: string[]) => setProduct(prev => ({ ...prev, colors: items })), []);
  const setMaterials = React.useCallback((items: string[]) => setProduct(prev => ({ ...prev, materials: items })), []);
  const setTags = React.useCallback((items: string[]) => setProduct(prev => ({ ...prev, tags: items })), []);
  const setRoomTypes = React.useCallback((items: string[]) => setProduct(prev => ({ ...prev, roomTypes: items })), []);
  const setImages = React.useCallback((items: string[]) => setProduct(prev => ({ ...prev, images: items })), []);

  // --- Handle Form Submission (Save Changes) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      setError("Cannot save without a Product ID.");
      return;
    }

    setSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setSaving(false);
      return;
    }

    try {
      console.log("Submitting updated product data:", product);
      // Use PUT request to update the product via ADMIN endpoint
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product), // Send the current product state
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update product.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedProductResult = await response.json();
      console.log("Product updated successfully:", updatedProductResult);
      setInitialProduct(product); // Update baseline for future comparisons
      alert("Product updated successfully!");
      navigate('/admin/adminproducts'); // Navigate back to product list on success

    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // --- Handle Product Deletion ---
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${product.name || 'this product'}"? This action cannot be undone.`)) {
      return;
    }
    if (!id) {
      setError("Cannot delete without a Product ID.");
      return;
    }

    setDeleting(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setDeleting(false);
      return;
    }

    try {
      console.log("Attempting to delete product with ID:", id);
      // Use DELETE request via ADMIN endpoint
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete product.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      console.log("Product deleted successfully");
      alert("Product deleted successfully!");
      navigate('/admin/dashboard'); // Navigate back to product list on success

    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product.");
      setDeleting(false); // Reset deleting state only on error
    }
  };

  // --- Conditional Rendering for Loading/Initial Error ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  // If initial fetch failed completely (no product._id)
  if (error && !product._id) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 rounded-md text-red-700">
        <h2 className="text-lg font-semibold mb-2">Error Loading Product</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>
      </div>
    );
  }

  // --- Render the Edit Form ---
  return (
    <>
      <Helmet>
        <title>Edit Product - {product?.name || 'Loading...'}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => navigate(-1)} // Go back
          className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Edit Product: {initialProduct?.name || ''}
        </h1>

        {/* Display subsequent save/delete errors */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          {/* Basic Info Section */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-medium text-gray-900 mb-2 border-b pb-2">Basic Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" value={product.name || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="skuId" className="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" name="skuId" id="skuId" value={product.skuId || ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" rows={4} value={product.description || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
            </div>
          </fieldset>

          {/* Pricing Section */}
          <fieldset className="space-y-4 border-t pt-4">
             <legend className="text-lg font-medium text-gray-900 mb-2">Pricing</legend>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input type="number" name="price" id="price" step="0.01" value={product.price ?? ''} onChange={handleChange} required className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
                 </div>
                 <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price (₹)</label>
                    <input type="number" name="originalPrice" id="originalPrice" step="0.01" value={product.originalPrice ?? ''} onChange={handleChange} className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
                 </div>
             </div>
          </fieldset>

           {/* Category & Status Section */}
           <fieldset className="space-y-4 border-t pt-4">
             <legend className="text-lg font-medium text-gray-900 mb-2">Category & Status</legend>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                   <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                   <select id="category" name="category" value={product.category || ''} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                     <option value="">Select Category</option>
                     <option value="Wallpaper">Wallpaper</option>
                     <option value="wall-art">Wall Art</option>
                     <option value="Wallpaper-Roll">Wallpaper Roll</option>
                   </select>
                 </div>
                 <div className="flex items-center pt-6">
                   <input id="inStock" name="inStock" type="checkbox" checked={product.inStock || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                   <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">In Stock</label>
                 </div>
                 <div className="flex items-center pt-6">
                   <input id="bestseller" name="bestseller" type="checkbox" checked={product.bestseller || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                   <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-900">Bestseller</label>
                 </div>
             </div>
           </fieldset>

            {/* Attributes Section */}
            <fieldset className="space-y-4 border-t pt-4">
                <legend className="text-lg font-medium text-gray-900 mb-2">Attributes</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ArrayInput label="Colors" items={product.colors || []} setItems={setColors} />
                    <ArrayInput label="Materials" items={product.materials || []} setItems={setMaterials} />
                    <ArrayInput label="Tags" items={product.tags || []} setItems={setTags} />
                    <ArrayInput label="Room Types" items={product.roomTypes || []} setItems={setRoomTypes} />
                </div>
            </fieldset>

             {/* Images Section */}
             <fieldset className="space-y-4 border-t pt-4">
                <legend className="text-lg font-medium text-gray-900 mb-2">Images</legend>
                 <div>
                   <ArrayInput label="Image Paths/URLs" items={product.images || []} setItems={setImages} />
                   <p className="mt-1 text-xs text-gray-500">
                     Enter the full URL or the relative path (e.g., /images/wallpaper/WP_001/1-001-WP.png). First image is primary. Manage uploads separately.
                   </p>
                 </div>
             </fieldset>

            {/* Variants Section (Keep as is, basic example) */}
            {product.category === 'wall-art' && (
              <fieldset className="space-y-4 border-t pt-4">
                 <legend className="text-lg font-medium text-gray-900 mb-2">Variants (Basic Example)</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Size Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Size (Variant 1)</label>
                        <input type="text" value={product.variants?.[0]?.size?.[0] || ''} onChange={e => { const newVariants = [...(product.variants || [])]; if (!newVariants[0]) newVariants[0] = { size: [], mrp: [], sellingPrice: [] }; newVariants[0].size = [e.target.value]; setProduct(prev => ({ ...prev, variants: newVariants })); }} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                     {/* MRP Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">MRP (₹) (Variant 1)</label>
                        <input type="text" value={product.variants?.[0]?.mrp?.[0] || ''} onChange={e => { const newVariants = [...(product.variants || [])]; if (!newVariants[0]) newVariants[0] = { size: [], mrp: [], sellingPrice: [] }; newVariants[0].mrp = [e.target.value]; setProduct(prev => ({ ...prev, variants: newVariants })); }} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                     {/* Selling Price Input */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Selling Price (₹) (Variant 1)</label>
                        <input type="text" value={product.variants?.[0]?.sellingPrice?.[0] || ''} onChange={e => { const newVariants = [...(product.variants || [])]; if (!newVariants[0]) newVariants[0] = { size: [], mrp: [], sellingPrice: [] }; newVariants[0].sellingPrice = [e.target.value]; setProduct(prev => ({ ...prev, variants: newVariants })); }} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                    </div>
                </div>
                 <p className="mt-2 text-xs text-gray-500">Note: Variant editing is simplified. Implement full add/edit/delete logic as needed.</p>
              </fieldset>
            )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-5 border-t mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              disabled={saving || deleting}
            >
              {deleting ? ( <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> ) : ( <><Trash2 className="w-4 h-4 mr-2" /> Delete Product</> )}
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={saving || deleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={saving || deleting}
              >
                {saving ? ( <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> ) : ( <><Save className="w-4 h-4 mr-2" /> Save Changes</> )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProductPage;