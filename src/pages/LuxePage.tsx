// src/pages/WallArtPage.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard'; // Use ProductCard
import { FilterOptions, WallArt, Product } from '../types/index'; // Add Product type
import { wallArtData } from '../data/wallArt'; // Fallback data
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowDownWideNarrow, ListFilter } from 'lucide-react';

const WALLART_PER_PAGE = 21;

// --- Helper Components for Filters ---
const FilterSection: React.FC<{ title: string; sectionKey: keyof WallArtPageState['openSections']; children: React.ReactNode; openSections: WallArtPageState['openSections']; setOpenSections: React.Dispatch<React.SetStateAction<WallArtPageState['openSections']>> }> = ({ title, sectionKey, children, openSections, setOpenSections }) => {
    return (
      <div className="border-b border-blue-100 py-4">
        <button onClick={() => setOpenSections(prev => ({...prev, [sectionKey]: !prev[sectionKey]}))} className="w-full flex justify-between items-center">
          <span className="font-bold text-[#172b9b] font-lora">{title}</span>
          <ChevronDown className={`w-5 h-5 text-[#1428a0] transition-transform ${openSections[sectionKey] ? 'rotate-180' : ''}`} />
        </button>
        {openSections[sectionKey] && <div className="mt-4 space-y-3">{children}</div>}
      </div>
    );
};

const FilterCheckbox: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer group">
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={checked} onChange={onChange} />
      <span className="group-hover:text-blue-700 transition-colors">{label}</span>
    </label>
);

// --- Main WallArtPage Component ---

interface WallArtPageState {
    openSections: {
        // theme: boolean; // Theme filter commented out
        colour: boolean;
        materials: boolean;
    }
}

// Use Product type enhanced with optional displayImageSrc
type ProductWithDisplaySrc = Product & { displayImageSrc?: string };

const LuxePage: React.FC = () => {
    const [wallArtItems, setWallArtItems] = useState<ProductWithDisplaySrc[]>([]); // State holds enhanced Product[]
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
    const [colors, setColors] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);

    const [openSections, setOpenSections] = useState<WallArtPageState['openSections']>({
        // theme: true,
        colour: true,
        materials: false
    });

    const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
    const [filters, setFilters] = useState<FilterOptions>({
        theme: 'All',
        priceRange: [0, 50000],
        colors: [],
        materials: []
    });

    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarSearch, setSearchbarSearch] = useState('');

    // --- Helper Functions ---
    const handleClearAllFilters = useCallback(() => { /* ... keep original ... */
        setFilters({
            theme: 'All',
            priceRange: [0, 50000],
            colors: [],
            materials: []
        });
        setSearchbarSearch('');
        setSearchTerm(''); // Clear URL search term if needed via navigate
        setSortBy('popularity');
    }, []);
    // const handleFilterChange = useCallback((key: 'theme', value: string) => { /* ... keep original ... */ }, []);
    const toggleArrayFilter = useCallback((key: 'colors' | 'materials', value: string) => { /* ... keep original ... */
        setFilters(prev => {
            const currentValues = prev[key] || [];
            const updatedValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [key]: updatedValues };
        });
    }, []);

    // --- Data Fetching Effect - MODIFIED to add displayImageSrc ---
    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/api/products`)
            .then(r => {
                if (!r.ok) throw new Error(`Failed to fetch products: ${r.statusText}`);
                return r.json();
            })
            .then((allProducts) => {
                if (!Array.isArray(allProducts)) throw new Error("Invalid data received from API");

                // Filter for 'wall-art'
                const filteredList = allProducts.filter((item: any): item is Product => {
                    const category = (item?.category || '').toString().toLowerCase();
                    return category === 'luxe';
                });

                // **Map to add displayImageSrc**
                const itemsWithDisplaySrc = filteredList.map((item): ProductWithDisplaySrc => {
                    let displaySrc = '/placeholder.jpg'; // Default
                    if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]) {
                        // Ensure the path is root-relative for ProductCard to handle
                        displaySrc = item.images[0].startsWith('/') ? item.images[0] : `/${item.images[0]}`;
                    }
                    return { ...item, displayImageSrc: displaySrc };
                });

                console.log("Wall Art Items with displayImageSrc:", itemsWithDisplaySrc);
                setWallArtItems(itemsWithDisplaySrc.length > 0 ? itemsWithDisplaySrc : []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching or processing products:", error);
                // Fallback to empty array on error
                setWallArtItems([]);
                setIsLoading(false);
            });
    }, []); // Run only once

    // --- Metadata (Colors/Materials) Update Effect ---
    useEffect(() => { /* ... Keep original ... */
        const uniqueColors = Array.from(new Set(wallArtItems.flatMap(item => item.colors || []).filter(Boolean)));
        const uniqueMaterials = Array.from(new Set(wallArtItems.flatMap(item => item.materials || []).filter(Boolean)));
        uniqueColors.sort((a, b) => a.localeCompare(b));
        uniqueMaterials.sort((a, b) => a.localeCompare(b));
        setColors(uniqueColors);
        setMaterials(uniqueMaterials);
     }, [wallArtItems]);

    // --- URL Param Handling Effect ---
    useEffect(() => { /* ... Keep original ... */
        const params = new URLSearchParams(location.search);
        const q = params.get('search') || '';
        setSearchTerm(q);
    }, [location.search]);

    // --- CORE FILTERING AND SORTING LOGIC ---
    const filteredWallArt = useMemo(() => { /* ... Keep original filtering/sorting logic ... */
        let workingList = wallArtItems; // Already filtered by category='wall-art' and has displayImageSrc

        // 1. Apply Search Filter
        const activeSearchTerm = sidebarSearch || searchTerm;
        if (activeSearchTerm) {
            const lowerCaseSearch = activeSearchTerm.toLowerCase();
            workingList = workingList.filter(item =>
                (item.name || '').toLowerCase().includes(lowerCaseSearch) ||
                (item.description || '').toLowerCase().includes(lowerCaseSearch) ||
                (item.tags && Array.isArray(item.tags) && item.tags.some(tag => (tag || '').toLowerCase().includes(lowerCaseSearch)))
            );
        }

        // 2. Apply Theme Filter (if using theme field from product data)
        // if (filters.theme && filters.theme !== 'All') {
        //     workingList = workingList.filter(item => (item.theme || '') === filters.theme);
        // }

        // 3. Apply Color Filter
        if (filters.colors && filters.colors.length > 0) {
            const lowerCaseSelectedColors = filters.colors.map(c => c.toLowerCase());
            workingList = workingList.filter(item =>
                item.colors && Array.isArray(item.colors) && item.colors.some(itemColor =>
                    lowerCaseSelectedColors.includes((itemColor || '').toLowerCase())
                )
            );
        }

        // 4. Apply Materials Filter
        if (filters.materials && filters.materials.length > 0) {
            const lowerCaseSelectedMaterials = filters.materials.map(m => m.toLowerCase());
            workingList = workingList.filter(item =>
                item.materials && Array.isArray(item.materials) && item.materials.some(itemMaterial =>
                    lowerCaseSelectedMaterials.includes((itemMaterial || '').toLowerCase())
                )
            );
        }

        // 5. Apply Sorting
        const sorted = [...workingList];
        switch (sortBy) {
            case 'price-low': sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
            case 'price-high': sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity)); break;
            case 'newest': sorted.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || (b.skuId || '').localeCompare(a.skuId || '')); break; // Use createdAt if available
            case 'alphabetical': sorted.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
            case 'popularity':
            default: sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (a.skuId || '').localeCompare(b.skuId || '')); // Sort by bestseller status first
        }

        return sorted;

    }, [sortBy, wallArtItems, filters, sidebarSearch, searchTerm]);

    const wallArtToShow = filteredWallArt;

    // --- Pagination and Scroll Effects ---
    useEffect(() => { setCurrentPage(1); }, [wallArtToShow]);
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

    const totalPages = Math.ceil(wallArtToShow.length / WALLART_PER_PAGE);
    const paginatedWallArt = useMemo(() => {
        return wallArtToShow.slice(
            (currentPage - 1) * WALLART_PER_PAGE,
            currentPage * WALLART_PER_PAGE
        );
    }, [wallArtToShow, currentPage]);

    const isAnyFilterActive = /* ... Keep original logic ... */
        sidebarSearch.trim() !== '' ||
        // filters.theme !== 'All' || // Uncomment if theme filter is used
        (filters.colors && filters.colors.length > 0) ||
        (filters.materials && filters.materials.length > 0);


    // --- Filter Content Rendering ---
    const renderFilterContent = (isMobile: boolean) => ( /* ... Keep original ... */
        <aside className="w-full">
            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#172b9b] font-seasons">Filters</h2>
                {isAnyFilterActive && (
                    <button onClick={handleClearAllFilters} className="text-sm text-blue-600 hover:underline font-lora font-semibold">Clear All</button>
                )}
            </div>

            {/* Desktop Search */}
            {!isMobile && (
                <div className="border-b border-blue-100 py-4">
                    <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
                    <input
                        type="text" placeholder="Search wall art..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm"
                        value={sidebarSearch}
                        onChange={e => setSearchbarSearch(e.target.value)}
                    />
                </div>
            )}

            {/* Theme Filter (Commented out) */}
            {/* <FilterSection title="Theme" ... /> */}

            {/* Colour Filter */}
            {colors.length > 0 && (
                <FilterSection title="Colour" sectionKey="colour" openSections={openSections} setOpenSections={setOpenSections}>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
                        {colors.map(color => (
                            <FilterCheckbox
                                key={color} label={color}
                                checked={filters.colors?.includes(color) || false}
                                onChange={() => toggleArrayFilter('colors', color)}
                            />
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Materials Filter */}
            {materials.length > 0 && (
                <FilterSection title="Materials" sectionKey="materials" openSections={openSections} setOpenSections={setOpenSections}>
                     <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
                        {materials.map(material => (
                            <FilterCheckbox
                                key={material} label={material}
                                checked={filters.materials?.includes(material) || false}
                                onChange={() => toggleArrayFilter('materials', material)}
                            />
                        ))}
                    </div>
                </FilterSection>
            )}
        </aside>
    );

    // --- Skeleton Grid ---
    const SkeletonGrid = () => ( /* ... Keep original ... */
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {Array.from({ length: 9 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col border border-blue-100"
                    style={{ minHeight: '420px' }} // Keep explicit height for skeleton consistency
                >
                    <div className="w-full aspect-[4/3] bg-gray-200" /> {/* Use aspect ratio */}
                    <div className="p-4 flex-1 flex flex-col justify-between"> {/* Adjusted padding */}
                        <div className="space-y-2"> {/* Adjusted spacing */}
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="mt-4">
                            <div className="h-6 w-1/3 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );


    // --- Main Render ---
    return (
        <>
            <Helmet>
                <title>Premium Wall Art - Decorative Collection | Nagomi</title>
                <meta name="description" content="Browse our extensive collection of premium wall art..." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
                {/* Header Section */}
                <section className="relative py-16 bg-white border-b-2 border-blue-100">
                     {/* ... (Keep header content) ... */}
                     <div className="absolute inset-0 bg-fixed bg-cover opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d')" }} />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            {/* Breadcrumbs */}
                            <nav className="text-sm font-lora text-[#1428a0] mb-2">
                                <Link to="/" className="hover:underline">Home</Link>
                                <span className="mx-2">/</span>
                                <span>Luxe Collections</span>
                            </nav>
                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons">
                                Luxe Collections {/* Updated Title */}
                            </h1>
                            {/* Subtitle */}
                            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto italic font-semibold font-lora"> {/* Adjusted font weight */}
                                Transform every wall into a masterpiece with our aesthetically curated wall art collection
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                        {/* DESKTOP FILTERS SIDEBAR */}
                        <div className="hidden lg:block lg:w-72 flex-shrink-0">
                            {/* ... (Keep sidebar structure) ... */}
                            <div className="bg-white/80 backdrop-blur-sm p-6 sticky top-24 rounded-xl shadow-lg border border-blue-100 border-t-4 border-t-blue-500 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                <div className="text-gray-400 text-sm mb-4 font-lora">
                                    {isLoading ? 'Loading...' : `${wallArtToShow.length} Results found`}
                                </div>
                                {renderFilterContent(false)}
                            </div>
                        </div>

                        {/* Main Grid Area */}
                        <div className="flex-1 min-w-0">
                            {/* Desktop Toolbar */}
                            <div className="hidden lg:flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-md border border-blue-100">
                                {/* ... (Keep toolbar content) ... */}
                                <p className="text-sm text-[#1428a0] font-lora">{wallArtToShow.length} Results found</p> {/* Adjusted text */}
                                <div className="flex items-center gap-3">
                                    <label htmlFor="sort-by" className="text-sm font-bold text-[#172b9b] font-lora">Sort by:</label>
                                    <select
                                        id="sort-by" value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm font-lora appearance-none bg-white pr-8" // Added font, appearance, padding-right
                                        style={{ background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") no-repeat right 0.75rem center/1em` }} // Added dropdown arrow
                                    >
                                        <option value="popularity">Popularity</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="newest">Newest First</option>
                                        <option value="alphabetical">Alphabetical</option>
                                    </select>
                                </div>
                            </div>

                            {/* Conditional Rendering */}
                            {isLoading ? (
                                <SkeletonGrid />
                            ) : wallArtToShow.length === 0 ? (
                                <div className="mt-8 text-center py-12 bg-white rounded-xl shadow-lg border border-blue-100">
                                    {/* ... (Keep No Results content) ... */}
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    <h3 className="text-xl font-semibold text-gray-700 font-lora">No Product Found</h3>
                                    <p className="text-gray-500 mt-2 font-lora">Try adjusting your filters or search terms.</p>
                                    {isAnyFilterActive && (
                                       <button onClick={handleClearAllFilters} className="mt-6 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-150">Clear Filters</button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Grid - Ensure ProductCard is used */}
                                    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                        {paginatedWallArt.map((productItem, index) => ( // Renamed variable
                                            <motion.div
                                                key={productItem._id || productItem.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                                className="min-w-0"
                                            >
                                                {/* --- Corrected Prop Name --- */}
                                                <ProductCard product={productItem} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                         <div className="flex justify-center items-center gap-1.5 mt-12 text-sm font-lora">
                                            {/* ... (Keep pagination buttons) ... */}
                                            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Previous page"> Prev </button>
                                            {(() => { const pages = []; const maxPagesToShow = 5; const halfPages = Math.floor(maxPagesToShow / 2); let startPage = Math.max(1, currentPage - halfPages); let endPage = Math.min(totalPages, currentPage + halfPages); if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; } else if (currentPage <= halfPages) { endPage = maxPagesToShow; } else if (currentPage + halfPages >= totalPages) { startPage = totalPages - maxPagesToShow + 1; } if (startPage > 1) { pages.push( <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label="Go to page 1">1</button> ); if (startPage > 2) { pages.push(<span key="start-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } } for (let page = startPage; page <= endPage; page++) { pages.push( <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === page ? 'bg-[#172b9b] text-white border-[#172b9b] font-semibold z-10' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-current={currentPage === page ? 'page' : undefined} aria-label={`Go to page ${page}`}> {page} </button> ); } if (endPage < totalPages) { if (endPage < totalPages - 1) { pages.push(<span key="end-ellipsis" className="px-2 text-gray-400 hidden sm:inline-block">...</span>); } pages.push( <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1.5 rounded-md border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-colors hidden sm:inline-block`} aria-label={`Go to page ${totalPages}`}>{totalPages}</button> ); } return pages; })()}
                                            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1.5 rounded-md border transition-colors ${ currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50' }`} aria-label="Next page"> Next </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MOBILE UI (Keep original structure) --- */}
            {/* ... (Mobile Footer Bar, Sort Modal, Filter Modal) ... */}
              {/* 1. FIXED MOBILE FOOTER BAR */}
             <div className="fixed lg:hidden bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
                 <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
                     <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold border-r border-gray-200">
                         <ArrowDownWideNarrow className="w-5 h-5" />
                         <span>Sort By</span>
                     </button>
                     <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold">
                         <ListFilter className="w-5 h-5" />
                         <span>Filters</span>
                         {isAnyFilterActive && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block ml-1"></span>}
                     </button>
                 </div>
             </div>

             {/* 2. MOBILE SORT MODAL */}
             <AnimatePresence>
                 {isMobileSortOpen && (
                     <div className="lg:hidden fixed inset-0 z-40 flex items-end">
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} />
                         <motion.div
                             initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'tween', ease: "easeInOut", duration: 0.3 }}
                             className="relative w-full bg-white rounded-t-2xl p-4 shadow-xl max-h-[70vh] flex flex-col"
                         >
                             <div className="flex items-center justify-between mb-3 pb-2 border-b flex-shrink-0">
                                 <h3 className="font-semibold text-gray-800 text-lg">Sort By</h3>
                                 <button onClick={() => setIsMobileSortOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button>
                             </div>
                             <div className="divide-y divide-gray-100 overflow-y-auto">
                                 {[ /* Sort Options */
                                     { value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' }
                                 ].map(opt => (
                                     <button
                                         key={opt.value}
                                         onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }}
                                         className={`w-full text-left py-3 px-2 text-sm rounded-md transition-colors ${ sortBy === opt.value ? 'text-[#172b9b] font-semibold bg-blue-50' : 'text-gray-700 hover:bg-gray-50' }`}
                                     >
                                         {opt.label}
                                     </button>
                                 ))}
                             </div>
                         </motion.div>
                     </div>
                 )}
             </AnimatePresence>

             {/* 3. MOBILE FILTER MODAL */}
            <AnimatePresence>
                 {isMobileFiltersOpen && (
                     <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} />
                         <motion.div
                             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', ease: "easeInOut", duration: 0.3 }}
                             className="relative h-full w-11/12 max-w-sm bg-white shadow-xl flex flex-col"
                         >
                             {/* Modal Header */}
                             <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                                 <h2 className="text-lg font-semibold text-[#172b9b] font-seasons">Filter Options</h2>
                                  {isAnyFilterActive && (
                                    <button onClick={() => { handleClearAllFilters(); }} className="text-xs text-gray-500 hover:text-red-600 font-lora"> Clear All </button>
                                 )}
                                 <button onClick={() => setIsMobileFiltersOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">&times; Close</button>
                             </div>
                             {/* Filter Content Body */}
                             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                 {/* Mobile Search Input */}
                                 <div className="border-b border-gray-100 pb-4">
                                     <label htmlFor="mobile-sidebar-search" className="block text-sm font-medium text-gray-600 mb-2 font-lora">Search Wall Art</label>
                                     <input
                                         id="mobile-sidebar-search" type="text" placeholder="e.g., Abstract Gold"
                                         className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#172b9b] focus:border-[#172b9b] font-lora text-sm shadow-sm"
                                         value={sidebarSearch}
                                         onChange={e => setSearchbarSearch(e.target.value)}
                                     />
                                 </div>
                                 {renderFilterContent(true)}
                             </div>
                             {/* Sticky Action Bar */}
                             <div className="p-4 border-t sticky bottom-0 bg-white flex-shrink-0">
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full bg-[#172b9b] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
                                >
                                    Apply Filters ({wallArtToShow.length})
                                </button>
                             </div>
                         </motion.div>
                     </div>
                 )}
             </AnimatePresence>
        </>
    );
};

export default LuxePage;