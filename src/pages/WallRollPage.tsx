// src/pages/WallRollPage.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard'; // Use ProductCard
import { FilterOptions, Product } from '../types/index';
// Removed unused wallArtData import
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowDownWideNarrow, ListFilter } from 'lucide-react';
import ReviewSection from '../components/Review/Review';

const PRODUCTS_PER_PAGE = 21;

// --- Helper Components ---
// ... (FilterSection, FilterCheckbox remain the same) ...
interface WallRollPageState {
    openSections: {
        colour: boolean;
        // materials: boolean; // Add back if material filter is needed
    }
}

const FilterSection: React.FC<{ title: string; sectionKey: keyof WallRollPageState['openSections']; children: React.ReactNode; openSections: WallRollPageState['openSections']; setOpenSections: React.Dispatch<React.SetStateAction<WallRollPageState['openSections']>> }> = ({ title, sectionKey, children, openSections, setOpenSections }) => {
    return (
      <div className="border-b border-gray-200 py-4">
        <button onClick={() => setOpenSections(prev => ({...prev, [sectionKey]: !prev[sectionKey]}))} className="w-full flex justify-between items-center text-left">
          <span className="font-semibold text-gray-700 font-lora">{title}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openSections[sectionKey] ? 'rotate-180' : ''}`} />
        </button>
        {openSections[sectionKey] && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-2 overflow-hidden"><div className="pt-1">{children}</div></motion.div>}
      </div>
    );
};

const FilterCheckbox: React.FC<{ label: string, count?: number, checked: boolean, onChange: () => void }> = ({ label, count, checked, onChange }) => (
    <label className="flex items-center justify-between gap-2 text-sm font-lora text-gray-700 cursor-pointer group">
      <div className="flex items-center gap-2">
         <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b] focus:ring-offset-0 focus:ring-1" checked={checked} onChange={onChange} />
         <span className="group-hover:text-[#172b9b] transition-colors">{label}</span>
      </div>
       {typeof count === 'number' && count > 0 && (
         <span className="text-xs text-gray-400">({count})</span>
       )}
    </label>
);
// --- END Helper Components ---

type ProductWithDisplaySrc = Product & { displayImageSrc?: string };

const WallRollPage: React.FC = () => {
  const [products, setProducts] = useState<ProductWithDisplaySrc[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openSections, setOpenSections] = useState<WallRollPageState['openSections']>({
    colour: true,
  });

  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 50000],
    colors: [],
    // materials: [], // Add back if needed
  });

  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  // --- Data Fetching Effect - MODIFIED ---
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/products`) // Fetch all products
      .then(r => {
          if (!r.ok) throw new Error(`HTTP error ${r.status}`);
          return r.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid API response");

        // **MODIFIED:** Filter ONLY for 'wallpaper-roll' category
        const wallpaperRolls = data.filter((p: any): p is Product => {
          const category = (p?.category || '').toString().toLowerCase().trim();
          return category === 'wallpaper-roll'; // Only check category
        });

        // Map to add displayImageSrc
        const rollsWithDisplaySrc = wallpaperRolls.map((item): ProductWithDisplaySrc => {
             let displaySrc = '/placeholder.jpg'; // Default
             if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]) {
                 displaySrc = item.images[0].startsWith('/') ? item.images[0] : `/${item.images[0]}`;
             }
             return { ...item, displayImageSrc: displaySrc };
         });

        setProducts(rollsWithDisplaySrc);
      })
      .catch(err => {
          console.error('Error fetching products:', err);
          setProducts([]); // Set empty array on error
      })
      .finally(() => setIsLoading(false));

    // Fetch colors
    fetch(`${API_BASE_URL}/api/meta/colors`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setColors(Array.isArray(data) ? data.sort() : []))
      .catch(err => console.error('Error fetching colors:', err));
  }, []); // Run only once

  // --- URL Search Term Effect ---
  // ... (Keep original logic) ...
   useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchTerm(q);
    if (q) {
      const newParams = new URLSearchParams(location.search);
      newParams.delete('search');
      navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);


  // --- Filtering and Sorting Logic ---
  const filteredProducts = useMemo(() => {
    let workingList = products; // Already filtered by category='wallpaper-roll'

    // 1. Apply Search
    const activeSearch = (sidebarSearch.trim() || searchTerm.trim()).toLowerCase();
    if (activeSearch) {
      workingList = workingList.filter(p =>
        (p.name || '').toLowerCase().includes(activeSearch) ||
        (p.description || '').toLowerCase().includes(activeSearch) ||
        (Array.isArray(p.tags) && p.tags.some(tag => (tag || '').toLowerCase().includes(activeSearch)))
      );
    }

    // 2. Apply Color Filter
    if (filters.colors && filters.colors.length > 0) {
      const lowerSelectedColors = filters.colors.map(c => c.toLowerCase());
      workingList = workingList.filter(p =>
        Array.isArray(p.colors) && p.colors.some(c => lowerSelectedColors.includes((c || '').toLowerCase()))
      );
    }

    // Add other filters (e.g., price range) here if needed

    // 3. Apply Sorting
    const sorted = [...workingList];
    switch (sortBy) {
        case 'price-low': sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
        case 'price-high': sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity)); break;
        case 'newest': sorted.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || (b.skuId || '').localeCompare(a.skuId || '')); break;
        case 'alphabetical': sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
        case 'popularity':
        default: sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (a.skuId || '').localeCompare(b.skuId || ''));
    }
    return sorted;
  }, [filters, sortBy, products, searchTerm, sidebarSearch]);

   // Calculate color counts (Keep original logic)
    const colorCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        let listForCounting = products;
        const activeSearch = (sidebarSearch.trim() || searchTerm.trim()).toLowerCase();
        if (activeSearch) {
            listForCounting = listForCounting.filter(p =>
                (p.name || '').toLowerCase().includes(activeSearch) ||
                (p.description || '').toLowerCase().includes(activeSearch) ||
                (Array.isArray(p.tags) && p.tags.some(tag => (tag || '').toLowerCase().includes(activeSearch)))
            );
        }
        // Apply other filters except color here if needed
        listForCounting.forEach(p => {
            (Array.isArray(p.colors) ? p.colors : []).forEach(c => {
                if (c) counts[c] = (counts[c] || 0) + 1;
            });
        });
        return counts;
    }, [products, searchTerm, sidebarSearch /* other filters except color */]);


  const productsToShow = filteredProducts;
  const totalPages = Math.ceil(productsToShow.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
      return productsToShow.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  }, [productsToShow, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [productsToShow]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

  // --- Filter Helper Functions ---
  const toggleSection = (section: keyof WallRollPageState['openSections']) => setOpenSections(p => ({ ...p, [section]: !p[section] }));
  const toggleArrayFilter = useCallback((key: 'colors' /* | 'materials' */, value: string) => {
    setFilters(p => {
        const currentValues = p[key] || [];
        const updatedValues = currentValues.includes(value)
            ? currentValues.filter(i => i !== value)
            : [...currentValues, value];
        return { ...p, [key]: updatedValues };
    });
  }, []);

  const isAnyFilterActive = (filters.colors && filters.colors.length > 0) || sidebarSearch.trim() !== '';

  const handleClearFilters = useCallback(() => {
    setFilters({ priceRange: [0, 50000], colors: [] }); // Reset relevant filters
    setSidebarSearch('');
  }, []);

   // --- Filter Content Rendering ---
    const renderFilterContent = (isMobile: boolean) => (
         <aside className="w-full">
            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#172b9b] font-seasons">Filters</h2>
                {isAnyFilterActive && (
                    <button onClick={handleClearFilters} className="text-xs text-blue-600 hover:underline font-lora font-semibold">Clear All</button>
                )}
            </div>
             {/* Desktop Search */}
            {!isMobile && (
                <div className="border-b border-gray-200 py-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 font-lora">Search</label>
                    <input
                        type="text" placeholder="Search rolls..."
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm shadow-sm"
                        value={sidebarSearch}
                        onChange={e => setSidebarSearch(e.target.value)}
                    />
                </div>
            )}
             {/* Colour Filter */}
            {colors.length > 0 && (
                <FilterSection title="Colour" sectionKey="colour" openSections={openSections} setOpenSections={setOpenSections}>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                        {colors.map(color => (
                            <FilterCheckbox
                                key={color} label={color}
                                count={colorCounts[color]} // Pass count
                                checked={filters.colors?.includes(color) || false}
                                onChange={() => toggleArrayFilter('colors', color)}
                            />
                        ))}
                    </div>
                </FilterSection>
            )}
             {/* Add Materials Filter Section here if needed */}
        </aside>
    );

    // --- Skeleton Grid ---
    const SkeletonGrid = () => ( /* ... Keep original SkeletonGrid ... */
         <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 9 }).map((_, i) => (
                 <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                     <div className="w-full aspect-[4/3] bg-gray-200"></div>
                     <div className="p-3 space-y-2">
                         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                     </div>
                 </div>
             ))}
         </div>
    );

  return (
    <>
      <Helmet>
        <title>Wallpaper Rolls - Shop Collection | Nagomi</title> {/* Updated Title */}
        <meta name="description" content="Browse our curated collection of high-quality wallpaper rolls for modern interiors." /> {/* Updated Description */}
      </Helmet>
       {/* Main container */}
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
         {/* Header Section */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#172b9b] mb-3 font-seasons leading-tight"> Wallpaper Rolls</h1>
               {/* Updated subtitle */}
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-lora italic">Explore our collection of premium wallpaper rolls.</p>
            </motion.div>
             {/* Breadcrumbs */}
             <nav className="flex items-center justify-center space-x-1.5 text-xs sm:text-sm text-gray-500 mt-4 font-lora">
               <Link to="/" className="hover:text-[#172b9b] transition-colors">Home</Link>
               <span>/</span>
               <span className="text-gray-700 font-medium">Wallpaper Rolls</span>
             </nav>
          </div>
        </div>

        {/* --- Mobile UI elements --- */}
         {/* ... (Keep Mobile Footer Bar) ... */}
         <div className="sticky top-0 lg:hidden z-30 bg-white border-t border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
             <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-700 hover:text-[#172b9b] transition-colors">
                 <ArrowDownWideNarrow className="w-4 h-4" /> Sort By
             </button>
             <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-700 hover:text-[#172b9b] transition-colors">
                 <ListFilter className="w-4 h-4" /> Filters {isAnyFilterActive && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block ml-1"></span>}
             </button>
           </div>
         </div>
         {/* --- End Mobile UI elements --- */}


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
              <div className="bg-white p-5 sticky top-24 rounded-lg border border-gray-100 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
                 {/* ... (Keep sidebar header) ... */}
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#172b9b] font-seasons">Filters</h2>
                    {isAnyFilterActive && (<button onClick={handleClearFilters} className="text-xs text-gray-500 hover:text-red-600 font-lora transition-colors"> Clear All </button> )}
                 </div>
                  <p className="text-xs text-gray-400 mb-4 font-lora italic">{productsToShow.length} results found</p>
                  <div className="space-y-0">
                    {renderFilterContent(false)}
                  </div>
               </div>
            </aside>

             {/* Main Content Area */}
            <main className="flex-1 min-w-0">
               {/* Desktop Toolbar */}
                 <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-6">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                   {/* ... (Keep toolbar content) ... */}
                   <span className="text-sm text-gray-500 font-lora">
                      Showing {paginatedProducts.length > 0 ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0}-{(currentPage - 1) * PRODUCTS_PER_PAGE + paginatedProducts.length} of {productsToShow.length} results
                   </span>
                   <div className="flex items-center gap-2">
                     <label htmlFor="sort-by" className="text-sm text-gray-500 font-lora shrink-0">Sort by:</label>
                     <select
                        id="sort-by" value={sortBy}
                        onChange={e => setSortBy(e.target.value as typeof sortBy)}
                        className="px-2 py-1 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] text-sm font-lora shadow-sm appearance-none bg-white pr-6"
                        style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") no-repeat right 0.5rem center/1em`}}
                      >
                        <option value="popularity">Popularity</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                        <option value="alphabetical">Alphabetical</option>
                      </select>
                    </div>
                 </div>
               </div>

              {/* Conditional Rendering */}
              {isLoading ? (
                  <SkeletonGrid />
              ) : productsToShow.length > 0 ? (
                <>
                  {/* Grid */}
                  <motion.div layout className="grid gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                    {paginatedProducts.map((product, index) => (
                      <motion.div
                         key={product._id || product.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.2, delay: index * 0.03 }}
                         className="min-w-0"
                      >
                         {/* Pass product to WallRollCard */}
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                     <div className="flex justify-center items-center gap-1.5 mt-8 md:mt-12 text-sm font-lora">
                         {/* ... (Keep pagination buttons) ... */}
                         <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Previous page"> Prev </button>
                         {(() => { const pages = []; const maxPagesToShow = 5; const halfPages = Math.floor(maxPagesToShow / 2); let startPage = Math.max(1, currentPage - halfPages); let endPage = Math.min(totalPages, currentPage + halfPages); if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; } else if (currentPage <= halfPages) { endPage = maxPagesToShow; } else if (currentPage + halfPages >= totalPages) { startPage = totalPages - maxPagesToShow + 1; } if (startPage > 1) { pages.push( <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label="Go to page 1">1</button> ); if (startPage > 2) { pages.push(<span key="start-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } } for (let page = startPage; page <= endPage; page++) { pages.push( <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === page ? 'bg-[#172b9b] text-white border-[#172b9b] font-semibold z-10' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-current={currentPage === page ? 'page' : undefined} aria-label={`Go to page ${page}`}> {page} </button> ); } if (endPage < totalPages) { if (endPage < totalPages - 1) { pages.push(<span key="end-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } pages.push( <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label={`Go to page ${totalPages}`}>{totalPages}</button> ); } return pages; })()}
                         <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Next page"> Next </button>
                     </div>
                  )}
                </>
              ) : (
                 // No Results Message
                 <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <p className="text-gray-500 font-lora mb-4">No wallpaper rolls found matching your criteria.</p>
                     {isAnyFilterActive && (
                        <button onClick={handleClearFilters} className="text-sm text-[#172b9b] underline hover:text-blue-800 font-lora"> Clear all filters and try again </button>
                     )}
                 </div>
              )}
            </main>
          </div>
        </div>

         {/* --- Mobile Modals --- */}
          {/* ... (Keep Mobile Sort Modal) ... */}
           {/* Mobile Sort Options */}
         <AnimatePresence>
            {isMobileSortOpen && (
                 <div className="lg:hidden fixed inset-0 z-40 flex items-end">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} />
                     <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }} className="relative w-full bg-white rounded-t-2xl p-4 shadow-xl max-h-[70vh] flex flex-col">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b flex-shrink-0"> <h3 className="font-semibold text-gray-800 text-lg">Sort By</h3> <button onClick={() => setIsMobileSortOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button> </div>
                        <div className="divide-y divide-gray-100 overflow-y-auto">
                           {[ { value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' } ].map(opt => ( <button key={opt.value} onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }} className={`w-full text-left py-3 px-2 text-sm rounded-md transition-colors ${ sortBy === opt.value ? 'text-[#172b9b] font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50' }`} > {opt.label} </button> ))}
                        </div>
                     </motion.div>
                 </div>
            )}
         </AnimatePresence>
          {/* ... (Keep Mobile Filter Modal) ... */}
           {/* Mobile Filters Panel */}
         <AnimatePresence>
            {isMobileFiltersOpen && (
                 <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} />
                     <motion.div initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }} transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }} className="relative h-full w-11/12 max-w-sm bg-white shadow-xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                           <h2 className="text-lg font-semibold text-[#172b9b] font-seasons">Filter Rolls</h2>
                           {isAnyFilterActive && ( <button onClick={() => { handleClearFilters(); }} className="text-xs text-gray-500 hover:text-red-600 font-lora"> Clear All </button> )}
                           <button onClick={() => setIsMobileFiltersOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button>
                        </div>
                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                           {/* Mobile Search */}
                            <div className="border-b border-gray-100 pb-4">
                               <label htmlFor="mobile-roll-search" className="block text-sm font-medium text-gray-600 mb-2 font-lora">Search Rolls</label>
                               <input id="mobile-roll-search" type="text" placeholder="Search..." className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm shadow-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} />
                           </div>
                           {renderFilterContent(true)}
                        </div>
                        {/* Footer */}
                         <div className="p-4 border-t sticky bottom-0 bg-white flex-shrink-0">
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#172b9b] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm">
                                Apply Filters ({productsToShow.length})
                           </button>
                         </div>
                     </motion.div>
                 </div>
            )}
         </AnimatePresence>
<ReviewSection/>
      </div>
    </>
  );
};

export default WallRollPage;