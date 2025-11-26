// 

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard'; // Ensure this path is correct
import { FilterOptions, Product } from '../types'; // Ensure Product type is defined correctly
import { API_BASE_URL } from '../api/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const PRODUCTS_PER_PAGE = 21;

// --- Helper Function to Get Image Source ---
const getDisplayImageSrc = (product: Product): string => {
  if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
    const imageUrl = product.images[0];
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      return imageUrl;
    }
    const parts = imageUrl.split(/[\\/]/);
    const filename = parts.pop() || imageUrl;
    const categoryFolder = product.category?.toLowerCase().includes('roll') ? 'wallpaper_roll' :
                           product.category?.toLowerCase().includes('art') ? 'wall_art' : 'wallpaper';

    if (imageUrl.includes(categoryFolder)) {
        return `/images/${imageUrl}`;
    }

    const skuId = product.skuId || '';
    if (skuId && (filename.includes(skuId) || filename.includes(skuId.replace('-WP','')))) {
       if (imageUrl.includes(skuId)) {
         return `/images/${categoryFolder}/${imageUrl}`;
       }
       return `/images/${categoryFolder}/${skuId}/${filename}`;
    }
    return `/images/${categoryFolder}/${filename}`;
  }
  return '/placeholder.jpg';
};

interface ProductWithImage extends Product {
  displayImageSrc: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]); 
  const [allCategories, setAllCategories] = useState<string[]>(['All', 'Wallpaper']); 
  const [colors, setColors] = useState<string[]>([]);
  const rooms = ['Living Room', 'Bedroom', 'Pooja room', 'Kids room', 'Office']; 

  const [openSections, setOpenSections] = useState({
    type: true,  
    colour: true, 
    room: true   
  });

  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    priceRange: [0, 200], 
    colors: [],
    roomTypes: []
  });
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const themes = ['Tropical', 'Indian', 'Modern', 'Kids', '3D', 'Global Destinations', 'Ceiling'];
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); 
  const [sidebarSearch, setSidebarSearch] = useState(''); 
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // --- Main useEffect Hook for Fetching, Filtering, and Processing ---
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(fetchedProducts => {
        const allProducts = Array.isArray(fetchedProducts) ? fetchedProducts : [];

        // 1. Filter for 'Wallpaper' category ONLY
        const wallpaperProducts = allProducts.filter((p: any): p is Product => {
            const rawCat = p?.category;
            const normalizedCat = typeof rawCat === 'string' ? rawCat.toLowerCase().trim() : '';
            return normalizedCat === 'wallpaper'; 
        });

        // 2. Generate displayImageSrc
        const wallpapersWithImageSrc = wallpaperProducts.map((product): ProductWithImage => {
           const displayImageSrc = getDisplayImageSrc(product);
           return {
             ...product,
             displayImageSrc,
           };
        });

        // 3. Enrich with Room Types
        const poojaKeywords = ['pooja', 'mandir', 'temple', 'krishna', 'radha', 'srinath', 'shiv', 'shiva', 'vrindavan', 'gopal', 'govind', 'gau', 'kamdhenu', 'spiritual', 'divine', 'sacred', 'pichwai'];
        const kidsKeywords = ['kids', 'princess', 'astronaut', 'rocket', 'unicorn', 'football', 'avenger', 'spidey', 'parachute', 'balloon', 'safari', 'animal', 'fairy', 'cartoon', 'playful', 'whimsy'];
        const officeKeywords = ['office', 'workspace', 'work space', 'corporate', 'stripe', 'stripes', 'concrete', 'marble', 'geometric', 'geometry', 'metallic', 'stucco', 'city', 'skyline', 'abstract', 'pattern', 'modern', '3d'];

        const normalize = (v: any): string => (typeof v === 'string' ? v.toLowerCase().trim() : '');
        const includesAny = (text: string, words: string[]): boolean => words.some(w => text.includes(w));

        const enrichedWallpapers = wallpapersWithImageSrc.map((p): ProductWithImage => {
           // Use existing roomTypes if valid and specific, otherwise infer
           const existingRooms = (Array.isArray(p.roomTypes) ? p.roomTypes : [])
             .map(normalize)
             .filter(r => rooms.map(br => br.toLowerCase()).includes(r)); 

           if (existingRooms.length > 0) {
              return { ...p, roomTypes: existingRooms }; 
           }

           // Infer if no valid existing rooms
           const name = normalize(p?.name);
           const theme = normalize(p?.theme || (Array.isArray(p.tags) && p.tags[0] ? p.tags[0] : ''));
           const desc = normalize(p?.description);
           const text = `${name} ${theme} ${desc}`;

           let inferredRooms: string[] = [];

           if (includesAny(text, kidsKeywords) || theme === 'kids') inferredRooms.push('Kids room');
           if (includesAny(text, poojaKeywords) || theme === 'indian') inferredRooms.push('Pooja room');
           if (includesAny(text, officeKeywords) || ['modern', '3d', 'abstract', 'geometric'].includes(theme)) inferredRooms.push('Office');

           if (inferredRooms.length === 0 || ['tropical', 'modern', 'global destinations', '3d'].includes(theme) || inferredRooms.includes('Office') ) {
               if (!inferredRooms.includes('Living Room')) inferredRooms.push('Living Room');
               if (!inferredRooms.includes('Bedroom')) inferredRooms.push('Bedroom');
           }

           const finalRooms = Array.from(new Set(inferredRooms));
           return { ...p, roomTypes: finalRooms.length > 0 ? finalRooms : ['Living Room', 'Bedroom'] }; 
        });

        setProducts(enrichedWallpapers); 
      })
      .catch(err => console.error('Error fetching or processing products:', err));

    fetch(`${API_BASE_URL}/api/meta/colors`)
      .then(r => r.json())
      .then(data => setColors(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching colors:', err));

    setAllCategories(['All', 'Wallpaper']);

  }, []); 

 // Effect to handle URL parameters (search)
 useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchTerm(q); 
    setCurrentPage(1); 
  }, [location.search]);


  // --- Filtering and Sorting Logic (useMemo) ---
  const filteredProducts = useMemo(() => {
    let listToFilter = products; 

    // 1. Filter by Search Term 
    const currentSearch = sidebarSearch.trim() ? sidebarSearch.trim().toLowerCase() : searchTerm.trim().toLowerCase();
    if (currentSearch) {
      listToFilter = listToFilter.filter(product =>
        product.name?.toLowerCase().includes(currentSearch) ||
        product.description?.toLowerCase().includes(currentSearch) ||
        product.tags?.some(tag => tag.toLowerCase().includes(currentSearch))
      );
    }

    // 2. Filter by Selected Themes
    if (selectedThemes.length > 0) {
      const lowerSelectedThemes = selectedThemes.map(t => t.toLowerCase());
      listToFilter = listToFilter.filter(product => {
        const productTheme = product.theme ? product.theme.toLowerCase() : (Array.isArray(product.tags) && product.tags.length > 0 ? product.tags[0].toLowerCase() : '');
        return lowerSelectedThemes.includes(productTheme);
      });
    }

    // 3. Filter by Color
    if (filters.colors && filters.colors.length > 0) {
      const lowerSelectedColors = filters.colors.map(c => c.toLowerCase());
      listToFilter = listToFilter.filter(product =>
        product.colors?.some(color => lowerSelectedColors.includes(color.toLowerCase()))
      );
    }

    // 4. Filter by Room Type
    if (filters.roomTypes && filters.roomTypes.length > 0) {
      const lowerSelectedRooms = filters.roomTypes.map(r => r.toLowerCase());
      listToFilter = listToFilter.filter(product =>
        product.roomTypes?.some(room => lowerSelectedRooms.includes(room.toLowerCase()))
      );
    }

    // --- Sorting ---
    const sortedList = [...listToFilter];
     switch (sortBy) {
       case 'price-low':
         sortedList.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
         break;
       case 'price-high':
         sortedList.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
         break;
       case 'newest':
         sortedList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || (b.skuId || '').localeCompare(a.skuId || ''));
         break;
       case 'alphabetical':
         sortedList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
         break;
       case 'popularity':
       default:
          // --- FIXED SORTING LOGIC HERE ---
         sortedList.sort((a, b) => {
            const seqA = a.sequence;
            const seqB = b.sequence;

            // Check if sequence is a valid string
            const hasSeqA = seqA && typeof seqA === 'string' && seqA.trim().length > 0;
            const hasSeqB = seqB && typeof seqB === 'string' && seqB.trim().length > 0;

            // 1. Both have sequence -> Sort numerically (treating strings as numbers)
            if (hasSeqA && hasSeqB) {
              return seqA.localeCompare(seqB, undefined, { numeric: true, sensitivity: 'base' });
            }

            // 2. Only A has sequence -> A comes first
            if (hasSeqA) return -1;

            // 3. Only B has sequence -> B comes first
            if (hasSeqB) return 1;

            // 4. Neither has sequence -> Fallback to Bestseller then SKU
            return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (a.skuId || '').localeCompare(b.skuId || '');
         });
         break;
     }
    return sortedList;

  }, [products, filters, sortBy, searchTerm, sidebarSearch, selectedThemes]); 


  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
     return filteredProducts.slice(
       (currentPage - 1) * PRODUCTS_PER_PAGE,
       currentPage * PRODUCTS_PER_PAGE
     );
  }, [filteredProducts, currentPage]);


  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchTerm, sidebarSearch, selectedThemes]);

  // Scroll to top when page changes
  useEffect(() => {
    const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentPage]);


  // --- Filter Helper Functions ---
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArrayFilter = (key: 'colors' | 'roomTypes', value: string) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [key]: updatedValues };
    });
  };

  const clearAllFilters = () => {
       setFilters({
         category: 'All',
         priceRange: [0, 200],
         colors: [],
         roomTypes: []
       });
       setSelectedThemes([]);
       setSidebarSearch('');
       setSearchTerm('');
       const params = new URLSearchParams(location.search);
       if (params.has('search')) {
            params.delete('search');
            navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
       } else {
            navigate(location.pathname, { replace: true });
       }
     };

     const isFilterActive = useMemo(() => {
         return (
           (filters.colors && filters.colors.length > 0) ||
           (filters.roomTypes && filters.roomTypes.length > 0) ||
           selectedThemes.length > 0 ||
           sidebarSearch.trim() !== '' ||
           searchTerm.trim() !== ''
         );
     }, [filters, selectedThemes, sidebarSearch, searchTerm]);


  // --- Render JSX ---
  return (
    <>
      <Helmet>
        <title>Premium Wallpapers - Shop Collection | Nagomi</title>
        <meta name="description" content="Browse our extensive collection of premium wallpapers. Find the perfect design for your space with our advanced filtering options." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#172b9b] mb-3 font-seasons leading-tight"> Customised Wallpapers </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-lora italic"> Transform every wall into a masterpiece with our aesthetically curated collection. </p>
            </motion.div>
             <nav className="flex items-center justify-center space-x-1.5 text-xs sm:text-sm text-gray-500 mt-4 font-lora">
               <Link to="/" className="hover:text-[#172b9b] transition-colors">Home</Link>
               <span>/</span>
               <span className="text-gray-700 font-medium">Wallpapers</span>
             </nav>
          </div>
        </div>

         {/* Mobile Filter/Sort Buttons */}
         <div className="sticky top-0 lg:hidden z-30 bg-white border-t border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
             <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-700 hover:text-[#172b9b] transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2.75 4A.75.75 0 0 1 3.5 3.25h13a.75.75 0 0 1 0 1.5h-13A.75.75 0 0 1 2.75 4Zm0 5A.75.75 0 0 1 3.5 8.25h9a.75.75 0 0 1 0 1.5h-9A.75.75 0 0 1 2.75 9Zm0 5A.75.75 0 0 1 3.5 13.25h5a.75.75 0 0 1 0 1.5h-5A.75.75 0 0 1 2.75 14Z"/></svg> Sort By </button>
             <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-700 hover:text-[#172b9b] transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.59L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" /></svg> Filters {isFilterActive && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-1"></span>} </button>
           </div>
         </div>


        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* --- Desktop Sidebar --- */}
            <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
                <div className="bg-white p-5 sticky top-24 rounded-lg border border-gray-100 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
                 <div className="flex items-center justify-between mb-4"> <h2 className="text-lg font-semibold text-[#172b9b] font-seasons">Filters</h2> {isFilterActive && ( <button onClick={clearAllFilters} className="text-xs text-gray-500 hover:text-red-600 font-lora transition-colors"> Clear All </button> )} </div>
                  <p className="text-xs text-gray-400 mb-4 font-lora italic">{filteredProducts.length} results found</p>
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="border-b border-gray-100 pb-4"> <label htmlFor="sidebar-search" className="block text-sm font-medium text-gray-600 mb-2 font-lora">Search</label> <input id="sidebar-search" type="text" placeholder="e.g., Bahama Breeze" className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm shadow-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} /> </div>
                    {/* Theme */}
                    <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Theme <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} /> </button> {openSections.type && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1"> {themes.map(theme => ( <label key={theme} className="flex items-center gap-2 text-xs font-lora text-gray-700 cursor-pointer"> <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={selectedThemes.includes(theme)} onChange={() => { setSelectedThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]); }} /> <span>{theme}</span> </label> ))} </motion.div> )} </div>
                    {/* Color */}
                    <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Colour <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} /> </button> {openSections.colour && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1"> {colors.map(color => ( <label key={color} className="flex items-center gap-2 text-xs font-lora text-gray-700 cursor-pointer"> <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.colors?.includes(color)} onChange={() => toggleArrayFilter('colors', color)} /> <span>{color}</span> </label> ))} </motion.div> )} </div>
                    {/* Room */}
                    <div className="pb-4"> <button onClick={() => toggleSection('room')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Room <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.room ? 'rotate-180' : ''}`} /> </button> {openSections.room && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1"> {rooms.map(room => ( <label key={room} className="flex items-center gap-2 text-xs font-lora text-gray-700 cursor-pointer"> <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.roomTypes?.includes(room)} onChange={() => toggleArrayFilter('roomTypes', room)} /> <span>{room}</span> </label> ))} </motion.div> )} </div>
                  </div>
               </div>
            </aside>


            {/* --- Main Product Grid Area --- */}
            <main className="flex-1 min-w-0">
               {/* Sort Dropdown & Result Count */}
                 <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-6">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                   <span className="text-sm text-gray-500 font-lora"> Showing {paginatedProducts.length > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0}-{(currentPage - 1) * PRODUCTS_PER_PAGE + paginatedProducts.length} of {filteredProducts.length} results </span>
                   <div className="flex items-center gap-2"> <label htmlFor="sort-by" className="text-sm text-gray-500 font-lora">Sort by:</label> <select id="sort-by" value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)} className="px-2 py-1 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] text-sm font-lora shadow-sm appearance-none bg-white pr-6" style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") no-repeat right 0.5rem center/1em`}} > <option value="popularity">Popularity</option> <option value="price-low">Price: Low to High</option> <option value="price-high">Price: High to Low</option> <option value="newest">Newest First</option> <option value="alphabetical">Alphabetical</option> </select> </div>
                 </div>
               </div>

              {/* Product Grid */}
              {paginatedProducts.length > 0 ? (
                <motion.div layout className="grid gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => ( <ProductCard key={product._id || product.id} product={product} /> ))}
                </motion.div>
              ) : (
                 // --- Loading / No Results ---
                 !products.length ? ( // Still loading initial products
                     <div className="grid gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"> {Array.from({ length: 9 }).map((_, i) => ( <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"> <div className="w-full aspect-[4/3] bg-gray-200"></div> <div className="p-3 space-y-2"> <div className="h-4 bg-gray-200 rounded w-3/4"></div> <div className="h-4 bg-gray-200 rounded w-1/2"></div> </div> </div> ))} </div>
                 ) : ( // Filters resulted in no matches
                   <div className="text-center py-16 px-4"> <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <p className="text-gray-500 font-lora mb-4">No wallpapers found matching your criteria.</p> <button onClick={clearAllFilters} className="text-sm text-[#172b9b] underline hover:text-blue-800 font-lora"> Clear all filters and try again </button> </div>
                 )
              )}


              {/* Pagination */}
              {totalPages > 1 && (
                 <div className="flex justify-center items-center gap-1.5 mt-8 md:mt-12 text-sm font-lora">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Previous page"> Prev </button>
                    {(() => { const pages = []; const maxPagesToShow = 5; const halfPages = Math.floor(maxPagesToShow / 2); let startPage = Math.max(1, currentPage - halfPages); let endPage = Math.min(totalPages, currentPage + halfPages); if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; } else if (currentPage <= halfPages) { startPage = 1; endPage = maxPagesToShow; } else if (currentPage + halfPages >= totalPages) { startPage = totalPages - maxPagesToShow + 1; endPage = totalPages; } if (startPage > 1) { pages.push( <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label="Go to page 1">1</button> ); if (startPage > 2) { pages.push(<span key="start-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } } for (let page = startPage; page <= endPage; page++) { pages.push( <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === page ? 'bg-[#172b9b] text-white border-[#172b9b] font-semibold z-10' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-current={currentPage === page ? 'page' : undefined} aria-label={`Go to page ${page}`}> {page} </button> ); } if (endPage < totalPages) { if (endPage < totalPages - 1) { pages.push(<span key="end-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } pages.push( <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label={`Go to page ${totalPages}`}>{totalPages}</button> ); } return pages; })()}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Next page"> Next </button>
                 </div>
               )}

            </main>
          </div>
        </div>

        {/* --- Mobile Modals for Filter/Sort --- */}
        {/* Mobile Sort Options */}
        {isMobileSortOpen && (
             <div className="lg:hidden fixed inset-0 z-50 flex items-end">
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} aria-hidden="true" />
                <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }} className="relative w-full bg-white rounded-t-2xl p-4 shadow-xl max-h-[70vh] flex flex-col">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b flex-shrink-0"> <h3 className="font-semibold text-gray-800 text-lg">Sort By</h3> <button onClick={() => setIsMobileSortOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button> </div>
                  <div className="divide-y divide-gray-100 overflow-y-auto">
                    {[ { value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' } ].map(opt => ( <button key={opt.value} onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }} className={`w-full text-left py-3 px-2 text-sm rounded-md transition-colors ${ sortBy === opt.value ? 'text-[#172b9b] font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50' }`} > {opt.label} </button> ))}
                  </div>
                </motion.div>
             </div>
        )}

        {/* Mobile Filters Panel */}
        {isMobileFiltersOpen && (
             <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} aria-hidden="true" />
                <motion.div initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }} transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }} className="relative h-full w-11/12 max-w-sm bg-white shadow-xl flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b flex-shrink-0"> <h2 className="text-lg font-semibold text-[#172b9b]">Filters</h2> {isFilterActive && ( <button onClick={() => { clearAllFilters(); /* Keep panel open after clearing */ }} className="text-xs text-gray-500 hover:text-red-600"> Clear All </button> )} <button onClick={() => setIsMobileFiltersOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button> </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Mobile Search */}
                     <div className="border-b border-gray-100 pb-4"> <label htmlFor="mobile-sidebar-search" className="block text-sm font-medium text-gray-600 mb-2 font-lora">Search</label> <input id="mobile-sidebar-search" type="text" placeholder="Search wallpapers..." className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm shadow-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} /> </div>
                    {/* Mobile Theme */}
                     <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Theme <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} /> </button> {openSections.type && ( <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto"> {themes.map(theme => ( <label key={theme} className="flex items-center gap-2 text-xs font-lora text-gray-700"><input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={selectedThemes.includes(theme)} onChange={() => { setSelectedThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]); }} /><span>{theme}</span></label> ))} </div> )} </div>
                    {/* Mobile Color */}
                     <div className="border-b border-gray-100 pb-4"> <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Colour <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} /> </button> {openSections.colour && ( <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto"> {colors.map(color => ( <label key={color} className="flex items-center gap-2 text-xs font-lora text-gray-700"><input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.colors?.includes(color)} onChange={() => toggleArrayFilter('colors', color)} /><span>{color}</span></label> ))} </div> )} </div>
                    {/* Mobile Room */}
                     <div className="pb-4"> <button onClick={() => toggleSection('room')} className="w-full flex items-center justify-between text-sm font-medium text-gray-600 font-lora mb-2"> Room <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections.room ? 'rotate-180' : ''}`} /> </button> {openSections.room && ( <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto"> {rooms.map(room => ( <label key={room} className="flex items-center gap-2 text-xs font-lora text-gray-700"><input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={!!filters.roomTypes?.includes(room)} onChange={() => toggleArrayFilter('roomTypes', room)} /><span>{room}</span></label> ))} </div> )} </div>
                  </div>
                  {/* Apply Button Footer */}
                   <div className="p-4 border-t sticky bottom-0 bg-white flex-shrink-0"> <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#172b9b] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"> Apply Filters ({filteredProducts.length}) </button> </div>
                </motion.div>
             </div>
        )}

      </div> {/* End min-h-screen */}
    </>
  );
};

export default Products;