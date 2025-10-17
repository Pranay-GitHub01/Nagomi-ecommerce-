// // import React, { useState, useMemo, useEffect, useCallback } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Helmet } from 'react-helmet-async';
// // import WallArtCard from '../components/WallArt/WallArtCard';
// // import { FilterOptions, WallArt } from '../types/index';
// // import { wallArtData } from '../data/wallArt';
// // import { useLocation, useNavigate, Link } from 'react-router-dom';
// // import { API_BASE_URL } from '../api/config';
// // import { ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowDownWideNarrow, ListFilter } from 'lucide-react';

// // const WALLART_PER_PAGE = 21;

// // // --- Helper Components for Filters (Remain unchanged for desktop/mobile consistency) ---

// // const FilterSection: React.FC<{ title: string; sectionKey: keyof WallArtPageState['openSections']; children: React.ReactNode; openSections: WallArtPageState['openSections']; setOpenSections: React.Dispatch<React.SetStateAction<WallArtPageState['openSections']>> }> = ({ title, sectionKey, children, openSections, setOpenSections }) => {
// //     return (
// //       <div className="border-b border-blue-100 py-4">
// //         <button onClick={() => setOpenSections(prev => ({...prev, [sectionKey]: !prev[sectionKey]}))} className="w-full flex justify-between items-center">
// //           <span className="font-bold text-[#172b9b] font-lora">{title}</span>
// //           <ChevronDown className={`w-5 h-5 text-[#1428a0] transition-transform ${openSections[sectionKey] ? 'rotate-180' : ''}`} />
// //         </button>
// //         {openSections[sectionKey] && <div className="mt-4 space-y-3">{children}</div>}
// //       </div>
// //     );
// // };

// // const FilterCheckbox: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
// //     <label className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer group">
// //       <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={checked} onChange={onChange} />
// //       <span className="group-hover:text-blue-700 transition-colors">{label}</span>
// //     </label>
// // );

// // // --- Main WallArtPage Component ---

// // interface WallArtPageState {
// //     openSections: {
// //         theme: boolean;
// //         colour: boolean;
// //         materials: boolean;
// //     }
// // }

// // const WallArtPage: React.FC = () => {
// //     const [wallArtItems, setWallArtItems] = useState<WallArt[]>([]);
// //     const [isLoading, setIsLoading] = useState(true);
    
// //     // REDESIGNED MOBILE FILTER/SORT STATE
// //     const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
// //     const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

// //     const [colors, setColors] = useState<string[]>([]);
// //     const [materials, setMaterials] = useState<string[]>([]);
    
// //     const [openSections, setOpenSections] = useState<WallArtPageState['openSections']>({
// //         theme: true,
// //         colour: false,
// //         materials: false
// //     });

// //     const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
// //     const [filters, setFilters] = useState<FilterOptions>({
// //         category: 'All',
// //         theme: 'All',
// //         priceRange: [0, 500],
// //         colors: [],
// //         materials: []
// //     });
    
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [sidebarSearch, setSearchbarSearch] = useState('');
    
// //     const themes = ['Modern', 'Elegant', 'Decorative', 'Abstract', 'Minimalist', 'Vintage'];

// //     // --- Helper Functions (Memoized) ---

// //     const handleClearAllFilters = useCallback(() => {
// //         setFilters({
// //             category: 'All',
// //             theme: 'All',
// //             priceRange: [0, 500],
// //             colors: [],
// //             materials: []
// //         });
// //         setSearchbarSearch('');
// //         setSearchTerm('');
// //         setSortBy('popularity');
// //     }, []);

// //     const handleFilterChange = useCallback((key: 'theme', value: string) => {
// //         setFilters((prev: FilterOptions) => ({ ...prev, [key]: value }));
// //     }, []);

// //     const toggleArrayFilter = useCallback((key: 'colors' | 'materials', value: string) => {
// //         setFilters(prev => {
// //             const newFilters = {
// //                 ...prev,
// //                 [key]: prev[key]?.includes(value)
// //                     ? prev[key].filter(item => item !== value)
// //                     : [...(prev[key] || []), value]
// //             };
// //             return newFilters;
// //         });
// //     }, []);



// // useEffect(() => {
// //     setIsLoading(true);
// //     fetch(`${API_BASE_URL}/api/wallart`)
// //         .then(r => {
// //             if (!r.ok) {
// //                 console.error("Failed to fetch wall art data:", r.statusText);
// //                 return []; 
// //             }
// //             return r.json();
// //         })
// //         .then((wallArtList) => {
// //             console.log("wallArtList",wallArtList)
// //             const listA = (Array.isArray(wallArtList) ? wallArtList : [])
// //                 .filter((p: any) => {
// //                     const sku = (p?.skuId || '').toString();
// //                     if (sku.startsWith('WA-')) return true;
// //                     const rawCat = p?.category;
                    
// //                     if (typeof rawCat === 'number') return rawCat === 2;
                    
// //                     if (typeof rawCat === 'string') {
// //                         const lc = rawCat.toLowerCase();
// //                         return lc === 'wall-art';
// //                     }
// //                     return false;
// //                 });
// //             setWallArtItems(listA.length > 0 ? listA : wallArtData);
            
// //             setIsLoading(false);
// //         })
// //         .catch(() => {
// //             setWallArtItems(wallArtData);
// //             setIsLoading(false);
// //         });
// // }, []);




// //     // --- Metadata (Colors/Materials) Update Effect (Omitted for brevity, assumed functional) ---

// //     useEffect(() => {
// //         const uniqueColors = Array.from(new Set(wallArtItems.flatMap(item => item.colors).filter(Boolean)));
// //         const uniqueMaterials = Array.from(new Set(wallArtItems.flatMap(item => item.materials).filter(Boolean)));

// //         setColors(uniqueColors);
// //         setMaterials(uniqueMaterials);
// //     }, [wallArtItems]);


// //     // --- URL Param Handling Effect (Omitted for brevity, assumed functional) ---

// //     useEffect(() => {
// //         const params = new URLSearchParams(location.search);
// //         const q = params.get('search') || '';
// //         const cat = params.get('category') || 'all';
// //         setSearchTerm(q);
// //         setFilters((prev) => ({ ...prev, category: cat === 'all' ? 'All' : cat }));
        
// //         if (q) {
// //             const newParams = new URLSearchParams(location.search);
// //             newParams.delete('search');
// //             navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
// //         }
// //     }, [location.search, navigate, location.pathname]);




// //     const filteredWallArt = useMemo(() => {
// //         let workingList = wallArtItems;
// //         const sorted = [...workingList];
// //         switch (sortBy) {
// //             case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
// //             case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
// //             case 'newest': sorted.sort((a, b) => (b.skuId || '').localeCompare(a.skuId || '')); break;
// //             case 'alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
// //             case 'popularity':
// //             default: sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
// //         }

// //         return sorted;
        
// //     }, [sortBy, wallArtItems]);

// //     const wallArtToShow = filteredWallArt;

// //     // --- Pagination and Scroll Effects (Omitted for brevity, assumed functional) ---
// //     useEffect(() => { setCurrentPage(1); }, [wallArtToShow]);
// //     useEffect(() => { if (currentPage > 1) { window.scrollTo({ top: 0, behavior: 'smooth' }); } }, [currentPage]);

// //     const totalPages = Math.ceil(wallArtToShow.length / WALLART_PER_PAGE);
// //     const paginatedWallArt = wallArtToShow.slice(
// //         (currentPage - 1) * WALLART_PER_PAGE,
// //         currentPage * WALLART_PER_PAGE
// //     );

// //     // --- Filter Content Rendering (Mobile/Desktop) ---

// //     const renderFilterContent = (isMobile: boolean) => (
// //         <aside className="w-full">
// //             {/* Header only visible on Desktop in the sidebar, for mobile it's in the modal header */}
// //             <div className="hidden lg:flex justify-between items-center mb-4">
// //                 <h2 className="text-xl font-bold text-[#172b9b] font-seasons">Filters</h2>
// //                 <button onClick={handleClearAllFilters} className="text-sm text-blue-600 hover:underline font-lora font-semibold">Clear All</button>
// //             </div>
            
// //             {/* SEARCH - Only in DESKTOP sidebar (as search is separate on mobile) */}
// //             {!isMobile && (
// //                 <div className="border-b border-blue-100 py-4">
// //                     <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
// //                     <input
// //                         type="text"
// //                         placeholder="Search wall art..."
// //                         className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm"
// //                         value={sidebarSearch}
// //                         onChange={e => setSearchbarSearch(e.target.value)}
// //                     />
// //                 </div>
// //             )}
            
// //             {/* THEME */}
// //             <FilterSection title="Theme" sectionKey="theme" openSections={openSections} setOpenSections={setOpenSections}>
// //                 <div className="flex flex-col gap-3">
// //                     <label key="All" className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer">
// //                         <input type="radio" name="wallArtTheme" value="All" checked={filters.theme === 'All'} onChange={() => handleFilterChange('theme', 'All')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
// //                         <span className={`transition-colors ${filters.theme === 'All' ? 'text-blue-700 font-bold' : ''}`}>All Themes</span>
// //                     </label>
// //                     {themes.map(theme => (
// //                         <label key={theme} className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer">
// //                             <input type="radio" name="wallArtTheme" value={theme} checked={filters.theme === theme} onChange={() => handleFilterChange('theme', theme)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
// //                             <span className={`transition-colors ${filters.theme === theme ? 'text-blue-700 font-bold' : ''}`}>{theme}</span>
// //                         </label>
// //                     ))}
// //                 </div>
// //             </FilterSection>

// //             {/* COLOUR */}
// //             <FilterSection title="Colour" sectionKey="colour" openSections={openSections} setOpenSections={setOpenSections}>
// //                 {colors.map(color => (
// //                     <FilterCheckbox 
// //                         key={color} 
// //                         label={color} 
// //                         checked={filters.colors?.includes(color) || false} 
// //                         onChange={() => toggleArrayFilter('colors', color)} 
// //                     />
// //                 ))}
// //             </FilterSection>

// //             {/* MATERIALS */}
// //             {/* <FilterSection title="Materials" sectionKey="materials" openSections={openSections} setOpenSections={setOpenSections}>
// //                 {materials.map(material => (
// //                     <FilterCheckbox 
// //                         key={material} 
// //                         label={material} 
// //                         checked={filters.materials?.includes(material) || false} 
// //                         onChange={() => toggleArrayFilter('materials', material)} 
// //                     />
// //                 ))}
// //             </FilterSection> */}
// //         </aside>
// //     );

// //     // --- Utility Components (Skeleton) ---
// //     const SkeletonGrid = () => (
// //         <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mt-8">
// //             {Array.from({ length: 9 }).map((_, i) => (
// //                 <div
// //                     key={i}
// //                     className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col border border-blue-100"
// //                     style={{ minHeight: '420px' }}
// //                 >
// //                     <div className="w-full h-64 bg-gray-200" />
// //                     <div className="p-6 flex-1 flex flex-col justify-between">
// //                         <div className="space-y-3">
// //                             <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
// //                             <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
// //                         </div>
// //                         <div className="mt-4 flex items-center gap-2">
// //                             <div className="h-8 w-20 bg-gray-200 rounded" />
// //                         </div>
// //                     </div>
// //                 </div>
// //             ))}
// //         </div>
// //     );


// //     // --- Main Render ---

// //     return (
// //         <>
// //             <Helmet>
// //                 <title>Premium Wall Art - Decorative Collection | Nagomi</title>
// //                 <meta name="description" content="Browse our extensive collection of premium wall art. Find the perfect decorative piece for your space with our advanced filtering options." />
// //             </Helmet>

// //             <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
// //                 <section className="relative py-16 bg-white border-b-2 border-blue-100">
// //                     <div className="absolute inset-0 bg-fixed bg-cover opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d')" }} />
// //                     <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
// //                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
// //                             <nav className="text-sm font-lora text-[#1428a0] mb-2">
// //                                 <Link to="/" className="hover:underline">Home</Link> 
// //                                 <span className="mx-2">/</span>
// //                                 <span>Premium Wall Art</span>
// //                             </nav>
// //                             <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons">
// //                                 Premium Wall Art
// //                             </h1>
// //                             <p className="text-xl text-gray-600 max-w-4xl mx-auto italic font-bold font-lora">
// //                                 Transform every wall into a masterpiece with our aesthetically curated wall art collection
// //                             </p>
// //                         </motion.div>
// //                     </div>
// //                 </section>

// //                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
// //                     <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

// //                         {/* DESKTOP FILTERS SIDEBAR */}
// //                         <div className="hidden lg:block lg:w-72 flex-shrink-0">
// //                             <div className="bg-white/80 backdrop-blur-sm p-6 sticky top-24 rounded-xl shadow-lg border border-blue-100 border-t-4 border-t-blue-500">
// //                                 <div className="text-gray-400 text-sm mb-4 font-lora">
// //                                     {isLoading ? 'Loading...' : `${wallArtToShow.length} Results found`}
// //                                 </div>
// //                                 {renderFilterContent(false)}
// //                             </div>
// //                         </div>

// //                         {/* Main Content */}
// //                         <div className="flex-1 min-w-0">
// //                             {/* Toolbar (Desktop Sort/Count) */}
// //                             <div className="hidden lg:flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-md border border-blue-100">
// //                                 <p className="text-sm text-[#1428a0] font-lora">{wallArtToShow.length} Results</p>
// //                                 <div className="flex items-center gap-3">
// //                                     <label htmlFor="sort-by" className="text-sm font-bold text-[#172b9b] font-lora">Sort by:</label>
// //                                     <select
// //                                         id="sort-by"
// //                                         value={sortBy}
// //                                         onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
// //                                         className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
// //                                     >
// //                                         <option value="popularity">Popularity</option>
// //                                         <option value="price-low">Price: Low to High</option>
// //                                         <option value="price-high">Price: High to Low</option>
// //                                         <option value="newest">Newest First</option>
// //                                         <option value="alphabetical">Sort alphabetically</option>
// //                                     </select>
// //                                 </div>
// //                             </div>

// //                             {/* Conditional Rendering: Loading, No Results, or Grid */}
// //                             {isLoading ? (
// //                                 <SkeletonGrid />
// //                             ) : wallArtToShow.length === 0 ? (
// //                                 <div className="mt-8 text-center py-12 bg-white rounded-xl shadow-lg border border-blue-100">
// //                                     <h3 className="text-xl font-bold text-gray-700">No Wall Art Found</h3>
// //                                     <p className="text-gray-500 mt-2">Try clearing your filters or changing your search terms.</p>
// //                                     <button onClick={handleClearAllFilters} className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform">Clear Filters</button>
// //                                 </div>
// //                             ) : (
// //                                 <>
// //                                     {/* Wall Art Grid */}
// //                                     <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
// //                                         {paginatedWallArt.map((wallArt, index) => {
// //                                             const isFirstBatch = index < 9;
// //                                             return (
// //                                                 <motion.div
// //                                                     key={wallArt._id || wallArt.id}
// //                                                     initial={{ opacity: 0, y: 30 }}
// //                                                     animate={{ opacity: 1, y: 0 }}
// //                                                     transition={{ duration: 0.18, delay: isFirstBatch ? index * 0.03 : 0 }}
// //                                                     className="min-w-0 flex flex-col"
// //                                                 >
// //                                                     <WallArtCard wallArt={wallArt} />
                                                
// //                                                 </motion.div>
// //                                             );
// //                                         })}
// //                                     </div>

// //                                     {/* Pagination Controls */}
// //                                     {totalPages > 1 && (
// //                                         <div className="flex justify-center items-center gap-2 mt-8">
// //                                             <button
// //                                                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
// //                                                 disabled={currentPage === 1}
// //                                                 className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
// //                                             >
// //                                                 <ChevronLeft className='w-4 h-4'/>
// //                                             </button>
// //                                             {/* Pagination buttons logic (omitted for brevity) */}
// //                                             <button
// //                                                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
// //                                                 disabled={currentPage === totalPages}
// //                                                 className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
// //                                             >
// //                                                 <ChevronRight className='w-4 h-4'/>
// //                                             </button>
// //                                         </div>
// //                                     )}
// //                                 </>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* --- MOBILE UI REDESIGN --- */}

// //             {/* 1. FIXED MOBILE FOOTER BAR (from Products.tsx) */}
// //             <div className="fixed lg:hidden bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
// //                 <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
// //                     <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold border-r border-gray-200">
// //                         <ArrowDownWideNarrow className="w-5 h-5" />
// //                         <span>Sort By</span>
// //                     </button>
// //                     <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold">
// //                         <ListFilter className="w-5 h-5" />
// //                         <span>Filters</span>
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* 2. MOBILE SORT MODAL (Bottom Sheet, from Products.tsx) */}
// //             <AnimatePresence>
// //                 {isMobileSortOpen && (
// //                     <div className="lg:hidden fixed inset-0 z-40">
// //                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} />
// //                         <motion.div 
// //                             initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
// //                             className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-xl max-h-3/4 overflow-y-auto"
// //                         >
// //                             <div className="flex items-center justify-between mb-4">
// //                                 <h3 className="font-semibold text-lg text-[#172b9b]">Sort By</h3>
// //                                 <button onClick={() => setIsMobileSortOpen(false)} className="text-gray-500 hover:text-gray-700 p-1">
// //                                     <X className="w-5 h-5" />
// //                                 </button>
// //                             </div>
// //                             <div className="divide-y divide-gray-100">
// //                                 {[{ value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' }].map(opt => (
// //                                     <button 
// //                                         key={opt.value} 
// //                                         onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }} 
// //                                         className={`w-full text-left py-3 transition-colors ${sortBy === opt.value ? 'text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
// //                                     >
// //                                         {opt.label}
// //                                     </button>
// //                                 ))}
// //                             </div>
// //                         </motion.div>
// //                     </div>
// //                 )}
// //             </AnimatePresence>


// //             {/* 3. MOBILE FILTER MODAL (Full-Screen Slide-over) */}
// //             <AnimatePresence>
// //                 {isMobileFiltersOpen && (
// //                     <div className="lg:hidden fixed inset-0 z-50">
// //                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} />
// //                         <motion.div
// //                             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
// //                             className="absolute right-0 top-0 h-full w-full bg-white shadow-xl flex flex-col"
// //                         >
// //                             {/* Modal Header (Sticky Top) */}
// //                             <div className="flex justify-between items-center p-4 shadow-md sticky top-0 bg-white z-10">
// //                                 <h2 className="text-xl font-bold text-[#172b9b] font-seasons">Filter Options</h2>
// //                                 <button
// //                                     onClick={() => setIsMobileFiltersOpen(false)}
// //                                     className="p-2 text-gray-500 hover:text-gray-700"
// //                                     aria-label="Close Filters"
// //                                 >
// //                                     <X className="w-6 h-6" />
// //                                 </button>
// //                             </div>

// //                             {/* Filter Content Body */}
// //                             <div className="flex-1 overflow-y-auto px-6 py-4 pb-4">
// //                                 {renderFilterContent(true)} {/* Pass 'true' to indicate mobile context, hiding the search bar */}
// //                             </div>

// //                             {/* Sticky Action Bar (Footer) */}
// //                             <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl z-10">
// //                                 <div className="flex justify-between gap-3">
// //                                     <button
// //                                         onClick={() => {
// //                                             handleClearAllFilters();
// //                                             setIsMobileFiltersOpen(false);
// //                                         }}
// //                                         className="w-1/3 py-3 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
// //                                     >
// //                                         Clear All
// //                                     </button>
// //                                     <button
// //                                         onClick={() => setIsMobileFiltersOpen(false)}
// //                                         className="w-2/3 py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-colors"
// //                                     >
// //                                         View Results ({wallArtToShow.length})
// //                                     </button>
// //                                 </div>
// //                             </div>

// //                         </motion.div>
// //                     </div>
// //                 )}
// //             </AnimatePresence>
// //         </>
// //     );
// // };

// // export default WallArtPage;




// import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import WallArtCard from '../components/WallArt/WallArtCard';
// import { FilterOptions, WallArt } from '../types/index';
// import { wallArtData } from '../data/wallArt';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { API_BASE_URL } from '../api/config';
// import { ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowDownWideNarrow, ListFilter } from 'lucide-react';

// const WALLART_PER_PAGE = 21;

// // --- Helper Components for Filters (Remain unchanged for desktop/mobile consistency) ---

// const FilterSection: React.FC<{ title: string; sectionKey: keyof WallArtPageState['openSections']; children: React.ReactNode; openSections: WallArtPageState['openSections']; setOpenSections: React.Dispatch<React.SetStateAction<WallArtPageState['openSections']>> }> = ({ title, sectionKey, children, openSections, setOpenSections }) => {
//     return (
//       <div className="border-b border-blue-100 py-4">
//         <button onClick={() => setOpenSections(prev => ({...prev, [sectionKey]: !prev[sectionKey]}))} className="w-full flex justify-between items-center">
//           <span className="font-bold text-[#172b9b] font-lora">{title}</span>
//           <ChevronDown className={`w-5 h-5 text-[#1428a0] transition-transform ${openSections[sectionKey] ? 'rotate-180' : ''}`} />
//         </button>
//         {openSections[sectionKey] && <div className="mt-4 space-y-3">{children}</div>}
//       </div>
//     );
// };

// const FilterCheckbox: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
//     <label className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer group">
//       <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={checked} onChange={onChange} />
//       <span className="group-hover:text-blue-700 transition-colors">{label}</span>
//     </label>
// );

// // --- Main WallArtPage Component ---

// interface WallArtPageState {
//     openSections: {
//         theme: boolean;
//         colour: boolean;
//         materials: boolean;
//     }
// }

// const WallArtPage: React.FC = () => {
//     const [wallArtItems, setWallArtItems] = useState<WallArt[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
    
//     // REDESIGNED MOBILE FILTER/SORT STATE
//     const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
//     const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

//     const [colors, setColors] = useState<string[]>([]);
//     const [materials, setMaterials] = useState<string[]>([]);
    
//     const [openSections, setOpenSections] = useState<WallArtPageState['openSections']>({
//         theme: true,
//         colour: false,
//         materials: false
//     });

//     const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
//     const [filters, setFilters] = useState<FilterOptions>({
//         category: 'All',
//         theme: 'All',
//         priceRange: [0, 500],
//         colors: [],
//         materials: []
//     });
    
//     const [currentPage, setCurrentPage] = useState(1);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sidebarSearch, setSearchbarSearch] = useState('');
    
//     const themes = ['Modern', 'Elegant', 'Decorative', 'Abstract', 'Minimalist', 'Vintage'];

//     // --- Helper Functions (Memoized) ---

//     const handleClearAllFilters = useCallback(() => {
//         setFilters({
//             category: 'All',
//             theme: 'All',
//             priceRange: [0, 500],
//             colors: [],
//             materials: []
//         });
//         setSearchbarSearch('');
//         setSearchTerm('');
//         setSortBy('popularity');
//     }, []);

//     const handleFilterChange = useCallback((key: 'theme', value: string) => {
//         setFilters((prev: FilterOptions) => ({ ...prev, [key]: value }));
//     }, []);

//     const toggleArrayFilter = useCallback((key: 'colors' | 'materials', value: string) => {
//         setFilters(prev => {
//             const newFilters = {
//                 ...prev,
//                 [key]: prev[key]?.includes(value)
//                     ? prev[key].filter(item => item !== value)
//                     : [...(prev[key] || []), value]
//             };
//             return newFilters;
//         });
//     }, []);



// useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE_URL}/api/wallart`)
//         .then(r => {
//             if (!r.ok) {
//                 console.error("Failed to fetch wall art data:", r.statusText);
//                 return []; 
//             }
//             return r.json();
//         })
//         .then((wallArtList) => {
//             console.log("wallArtList",wallArtList)
//             const listA = (Array.isArray(wallArtList) ? wallArtList : [])
//                 .filter((p: any) => {
//                     const sku = (p?.skuId || '').toString();
//                     if (sku.startsWith('WA-')) return true;
//                     const rawCat = p?.category;
                    
//                     if (typeof rawCat === 'number') return rawCat === 2;
                    
//                     if (typeof rawCat === 'string') {
//                         const lc = rawCat.toLowerCase();
//                         return lc === 'wall-art';
//                     }
//                     return false;
//                 });
//             setWallArtItems(listA.length > 0 ? listA : wallArtData);
            
//             setIsLoading(false);
//         })
//         .catch(() => {
//             setWallArtItems(wallArtData);
//             setIsLoading(false);
//         });
// }, []);




//     // --- Metadata (Colors/Materials) Update Effect (Omitted for brevity, assumed functional) ---

//     useEffect(() => {
//         const uniqueColors = Array.from(new Set(wallArtItems.flatMap(item => item.colors).filter(Boolean)));
//         const uniqueMaterials = Array.from(new Set(wallArtItems.flatMap(item => item.materials).filter(Boolean)));

//         setColors(uniqueColors);
//         setMaterials(uniqueMaterials);
//     }, [wallArtItems]);


//     // --- URL Param Handling Effect (Omitted for brevity, assumed functional) ---

//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const q = params.get('search') || '';
//         const cat = params.get('category') || 'all';
//         setSearchTerm(q);
//         setFilters((prev) => ({ ...prev, category: cat === 'all' ? 'All' : cat }));
        
//         if (q) {
//             const newParams = new URLSearchParams(location.search);
//             newParams.delete('search');
//             navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
//         }
//     }, [location.search, navigate, location.pathname]);


//     // --- CORE FILTERING AND SORTING LOGIC FIX ---
//     const filteredWallArt = useMemo(() => {
//         let workingList = wallArtItems;
        
//         // 1. Apply Search Filter
//         const activeSearchTerm = sidebarSearch || searchTerm;
//         if (activeSearchTerm) {
//             const lowerCaseSearch = activeSearchTerm.toLowerCase();
//             workingList = workingList.filter(item =>
//                 item.name.toLowerCase().includes(lowerCaseSearch) ||
//                 (item.description && item.description.toLowerCase().includes(lowerCaseSearch)) ||
//                 (item.tags && Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch)))
//             );
//         }

//         // 2. Apply Theme Filter (Radio buttons)
//         if (filters.theme && filters.theme !== 'All') {
//             workingList = workingList.filter(item => item.theme === filters.theme);
//         }

//         // 3. Apply Color Filter (Checkboxes)
//         if (filters.colors && filters.colors.length > 0) {
//             const lowerCaseSelectedColors = filters.colors.map(c => c.toLowerCase());
//             workingList = workingList.filter(item => 
//                 item.colors && Array.isArray(item.colors) && item.colors.some(itemColor => 
//                     lowerCaseSelectedColors.includes(itemColor.toLowerCase())
//                 )
//             );
//         }

//         // 4. Apply Materials Filter (Checkboxes - currently commented out in UI, but logic is here)
//         if (filters.materials && filters.materials.length > 0) {
//             const lowerCaseSelectedMaterials = filters.materials.map(m => m.toLowerCase());
//             workingList = workingList.filter(item =>
//                 item.materials && Array.isArray(item.materials) && item.materials.some(itemMaterial =>
//                     lowerCaseSelectedMaterials.includes(itemMaterial.toLowerCase())
//                 )
//             );
//         }

//         // 5. Apply Sorting
//         const sorted = [...workingList];
//         switch (sortBy) {
//             case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
//             case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
//             case 'newest': sorted.sort((a, b) => (b.skuId || '').localeCompare(a.skuId || '')); break;
//             case 'alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
//             case 'popularity':
//             default: sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
//         }

//         return sorted;
        
//     }, [sortBy, wallArtItems, filters, sidebarSearch, searchTerm]); // <-- IMPORTANT: Dependencies updated

//     const wallArtToShow = filteredWallArt;
//     // --- END CORE FILTERING AND SORTING LOGIC FIX ---


//     // --- Pagination and Scroll Effects (Omitted for brevity, assumed functional) ---
//     useEffect(() => { setCurrentPage(1); }, [wallArtToShow]);
//     useEffect(() => { if (currentPage > 1) { window.scrollTo({ top: 0, behavior: 'smooth' }); } }, [currentPage]);

//     const totalPages = Math.ceil(wallArtToShow.length / WALLART_PER_PAGE);
//     const paginatedWallArt = wallArtToShow.slice(
//         (currentPage - 1) * WALLART_PER_PAGE,
//         currentPage * WALLART_PER_PAGE
//     );

//     // --- Filter Content Rendering (Mobile/Desktop) ---

//     const renderFilterContent = (isMobile: boolean) => (
//         <aside className="w-full">
//             {/* Header only visible on Desktop in the sidebar, for mobile it's in the modal header */}
//             <div className="hidden lg:flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-[#172b9b] font-seasons">Filters</h2>
//                 <button onClick={handleClearAllFilters} className="text-sm text-blue-600 hover:underline font-lora font-semibold">Clear All</button>
//             </div>
            
//             {/* SEARCH - Only in DESKTOP sidebar (as search is separate on mobile) */}
//             {!isMobile && (
//                 <div className="border-b border-blue-100 py-4">
//                     <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
//                     <input
//                         type="text"
//                         placeholder="Search wall art..."
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm"
//                         value={sidebarSearch}
//                         onChange={e => setSearchbarSearch(e.target.value)}
//                     />
//                 </div>
//             )}
            
//             {/* THEME
//             <FilterSection title="Theme" sectionKey="theme" openSections={openSections} setOpenSections={setOpenSections}>
//                 <div className="flex flex-col gap-3">
//                     <label key="All" className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer">
//                         <input type="radio" name="wallArtTheme" value="All" checked={filters.theme === 'All'} onChange={() => handleFilterChange('theme', 'All')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
//                         <span className={`transition-colors ${filters.theme === 'All' ? 'text-blue-700 font-bold' : ''}`}>All Themes</span>
//                     </label>
//                     {themes.map(theme => (
//                         <label key={theme} className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer">
//                             <input type="radio" name="wallArtTheme" value={theme} checked={filters.theme === theme} onChange={() => handleFilterChange('theme', theme)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
//                             <span className={`transition-colors ${filters.theme === theme ? 'text-blue-700 font-bold' : ''}`}>{theme}</span>
//                         </label>
//                     ))}
//                 </div>
//             </FilterSection> */}

//             {/* COLOUR */}
//             <FilterSection title="Colour" sectionKey="colour" openSections={openSections} setOpenSections={setOpenSections}>
//                 {colors.map(color => (
//                     <FilterCheckbox 
//                         key={color} 
//                         label={color} 
//                         checked={filters.colors?.includes(color) || false} 
//                         onChange={() => toggleArrayFilter('colors', color)} 
//                     />
//                 ))}
//             </FilterSection>

//             {/* MATERIALS */}
//             {/* <FilterSection title="Materials" sectionKey="materials" openSections={openSections} setOpenSections={setOpenSections}>
//                 {materials.map(material => (
//                     <FilterCheckbox 
//                         key={material} 
//                         label={material} 
//                         checked={filters.materials?.includes(material) || false} 
//                         onChange={() => toggleArrayFilter('materials', material)} 
//                     />
//                 ))}
//             </FilterSection> */}
//         </aside>
//     );

//     // --- Utility Components (Skeleton) ---
//     const SkeletonGrid = () => (
//         <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mt-8">
//             {Array.from({ length: 9 }).map((_, i) => (
//                 <div
//                     key={i}
//                     className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col border border-blue-100"
//                     style={{ minHeight: '420px' }}
//                 >
//                     <div className="w-full h-64 bg-gray-200" />
//                     <div className="p-6 flex-1 flex flex-col justify-between">
//                         <div className="space-y-3">
//                             <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
//                             <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
//                         </div>
//                         <div className="mt-4 flex items-center gap-2">
//                             <div className="h-8 w-20 bg-gray-200 rounded" />
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );


//     // --- Main Render ---

//     return (
//         <>
//             <Helmet>
//                 <title>Premium Wall Art - Decorative Collection | Nagomi</title>
//                 <meta name="description" content="Browse our extensive collection of premium wall art. Find the perfect decorative piece for your space with our advanced filtering options." />
//             </Helmet>

//             <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
//                 <section className="relative py-16 bg-white border-b-2 border-blue-100">
//                     <div className="absolute inset-0 bg-fixed bg-cover opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d')" }} />
//                     <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//                             <nav className="text-sm font-lora text-[#1428a0] mb-2">
//                                 <Link to="/" className="hover:underline">Home</Link> 
//                                 <span className="mx-2">/</span>
//                                 <span>Premium Wall Art</span>
//                             </nav>
//                             <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons">
//                                 Premium Wall Art
//                             </h1>
//                             <p className="text-xl text-gray-600 max-w-4xl mx-auto italic font-bold font-lora">
//                                 Transform every wall into a masterpiece with our aesthetically curated wall art collection
//                             </p>
//                         </motion.div>
//                     </div>
//                 </section>

//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                     <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

//                         {/* DESKTOP FILTERS SIDEBAR */}
//                         <div className="hidden lg:block lg:w-72 flex-shrink-0">
//                             <div className="bg-white/80 backdrop-blur-sm p-6 sticky top-24 rounded-xl shadow-lg border border-blue-100 border-t-4 border-t-blue-500">
//                                 <div className="text-gray-400 text-sm mb-4 font-lora">
//                                     {isLoading ? 'Loading...' : `${wallArtToShow.length} Results found`}
//                                 </div>
//                                 {renderFilterContent(false)}
//                             </div>
//                         </div>

//                         {/* Main Content */}
//                         <div className="flex-1 min-w-0">
//                             {/* Toolbar (Desktop Sort/Count) */}
//                             <div className="hidden lg:flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-md border border-blue-100">
//                                 <p className="text-sm text-[#1428a0] font-lora">{wallArtToShow.length} Results</p>
//                                 <div className="flex items-center gap-3">
//                                     <label htmlFor="sort-by" className="text-sm font-bold text-[#172b9b] font-lora">Sort by:</label>
//                                     <select
//                                         id="sort-by"
//                                         value={sortBy}
//                                         onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
//                                         className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                                     >
//                                         <option value="popularity">Popularity</option>
//                                         <option value="price-low">Price: Low to High</option>
//                                         <option value="price-high">Price: High to Low</option>
//                                         <option value="newest">Newest First</option>
//                                         <option value="alphabetical">Sort alphabetically</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Conditional Rendering: Loading, No Results, or Grid */}
//                             {isLoading ? (
//                                 <SkeletonGrid />
//                             ) : wallArtToShow.length === 0 ? (
//                                 <div className="mt-8 text-center py-12 bg-white rounded-xl shadow-lg border border-blue-100">
//                                     <h3 className="text-xl font-bold text-gray-700">No Wall Art Found</h3>
//                                     <p className="text-gray-500 mt-2">Try clearing your filters or changing your search terms.</p>
//                                     <button onClick={handleClearAllFilters} className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform">Clear Filters</button>
//                                 </div>
//                             ) : (
//                                 <>
//                                     {/* Wall Art Grid */}
//                                     <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
//                                         {paginatedWallArt.map((wallArt, index) => {
//                                             const isFirstBatch = index < 9;
//                                             return (
//                                                 <motion.div
//                                                     key={wallArt._id || wallArt.id}
//                                                     initial={{ opacity: 0, y: 30 }}
//                                                     animate={{ opacity: 1, y: 0 }}
//                                                     transition={{ duration: 0.18, delay: isFirstBatch ? index * 0.03 : 0 }}
//                                                     className="min-w-0 flex flex-col"
//                                                 >
//                                                     <WallArtCard wallArt={wallArt} />
                                                
//                                                 </motion.div>
//                                             );
//                                         })}
//                                     </div>

//                                     {/* Pagination Controls */}
//                                     {totalPages > 1 && (
//                                         <div className="flex justify-center items-center gap-2 mt-8">
//                                             <button
//                                                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                                                 disabled={currentPage === 1}
//                                                 className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
//                                             >
//                                                 <ChevronLeft className='w-4 h-4'/>
//                                             </button>
//                                             {/* Pagination buttons logic (omitted for brevity) */}
//                                             <button
//                                                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                                                 disabled={currentPage === totalPages}
//                                                 className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
//                                             >
//                                                 <ChevronRight className='w-4 h-4'/>
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* --- MOBILE UI REDESIGN --- */}

//             {/* 1. FIXED MOBILE FOOTER BAR (from Products.tsx) */}
//             <div className="fixed lg:hidden bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
//                     <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold border-r border-gray-200">
//                         <ArrowDownWideNarrow className="w-5 h-5" />
//                         <span>Sort By</span>
//                     </button>
//                     <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold">
//                         <ListFilter className="w-5 h-5" />
//                         <span>Filters</span>
//                     </button>
//                 </div>
//             </div>

//             {/* 2. MOBILE SORT MODAL (Bottom Sheet, from Products.tsx) */}
//             <AnimatePresence>
//                 {isMobileSortOpen && (
//                     <div className="lg:hidden fixed inset-0 z-40">
//                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} />
//                         <motion.div 
//                             initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
//                             className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-xl max-h-3/4 overflow-y-auto"
//                         >
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="font-semibold text-lg text-[#172b9b]">Sort By</h3>
//                                 <button onClick={() => setIsMobileSortOpen(false)} className="text-gray-500 hover:text-gray-700 p-1">
//                                     <X className="w-5 h-5" />
//                                 </button>
//                             </div>
//                             <div className="divide-y divide-gray-100">
//                                 {[{ value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' }].map(opt => (
//                                     <button 
//                                         key={opt.value} 
//                                         onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }} 
//                                         className={`w-full text-left py-3 transition-colors ${sortBy === opt.value ? 'text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
//                                     >
//                                         {opt.label}
//                                     </button>
//                                 ))}
//                             </div>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>


//             {/* 3. MOBILE FILTER MODAL (Full-Screen Slide-over) */}
//             <AnimatePresence>
//                 {isMobileFiltersOpen && (
//                     <div className="lg:hidden fixed inset-0 z-50">
//                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} />
//                         <motion.div
//                             initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
//                             className="absolute right-0 top-0 h-full w-full bg-white shadow-xl flex flex-col"
//                         >
//                             {/* Modal Header (Sticky Top) */}
//                             <div className="flex justify-between items-center p-4 shadow-md sticky top-0 bg-white z-10">
//                                 <h2 className="text-xl font-bold text-[#172b9b] font-seasons">Filter Options</h2>
//                                 <button
//                                     onClick={() => setIsMobileFiltersOpen(false)}
//                                     className="p-2 text-gray-500 hover:text-gray-700"
//                                     aria-label="Close Filters"
//                                 >
//                                     <X className="w-6 h-6" />
//                                 </button>
//                             </div>

//                             {/* Filter Content Body */}
//                             <div className="flex-1 overflow-y-auto px-6 py-4 pb-4">
//                                 {renderFilterContent(true)} {/* Pass 'true' to indicate mobile context, hiding the search bar */}
//                             </div>

//                             {/* Sticky Action Bar (Footer) */}
//                             <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl z-10">
//                                 <div className="flex justify-between gap-3">
//                                     <button
//                                         onClick={() => {
//                                             handleClearAllFilters();
//                                             setIsMobileFiltersOpen(false);
//                                         }}
//                                         className="w-1/3 py-3 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
//                                     >
//                                         Clear All
//                                     </button>
//                                     <button
//                                         onClick={() => setIsMobileFiltersOpen(false)}
//                                         className="w-2/3 py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-colors"
//                                     >
//                                         View Results ({wallArtToShow.length})
//                                     </button>
//                                 </div>
//                             </div>

//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// };

// export default WallArtPage;


import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import WallArtCard from '../components/WallArt/WallArtCard';
import { FilterOptions, WallArt } from '../types/index';
import { wallArtData } from '../data/wallArt';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowDownWideNarrow, ListFilter } from 'lucide-react';

const WALLART_PER_PAGE = 21;

// --- Helper Components for Filters (Remain unchanged for desktop/mobile consistency) ---

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
        theme: boolean;
        colour: boolean;
        materials: boolean;
    }
}

const WallArtPage: React.FC = () => {
    const [wallArtItems, setWallArtItems] = useState<WallArt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // REDESIGNED MOBILE FILTER/SORT STATE
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

    const [colors, setColors] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    
    const [openSections, setOpenSections] = useState<WallArtPageState['openSections']>({
        theme: true,
        colour: false,
        materials: false
    });

    const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
    const [filters, setFilters] = useState<FilterOptions>({
        category: 'All',
        theme: 'All',
        priceRange: [0, 500],
        colors: [],
        materials: []
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarSearch, setSearchbarSearch] = useState('');
    
    const themes = ['Modern', 'Elegant', 'Decorative', 'Abstract', 'Minimalist', 'Vintage'];

    // --- Helper Functions (Memoized) ---

    const handleClearAllFilters = useCallback(() => {
        setFilters({
            category: 'All',
            theme: 'All',
            priceRange: [0, 500],
            colors: [],
            materials: []
        });
        setSearchbarSearch('');
        setSearchTerm('');
        setSortBy('popularity');
    }, []);

    const handleFilterChange = useCallback((key: 'theme', value: string) => {
        setFilters((prev: FilterOptions) => ({ ...prev, [key]: value }));
    }, []);

    const toggleArrayFilter = useCallback((key: 'colors' | 'materials', value: string) => {
        setFilters(prev => {
            const newFilters = {
                ...prev,
                [key]: prev[key]?.includes(value)
                    ? prev[key].filter(item => item !== value)
                    : [...(prev[key] || []), value]
            };
            return newFilters;
        });
    }, []);



useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/wallart`)
        .then(r => {
            if (!r.ok) {
                console.error("Failed to fetch wall art data:", r.statusText);
                return []; 
            }
            return r.json();
        })
        .then((wallArtList) => {
            console.log("wallArtList",wallArtList)
            const listA = (Array.isArray(wallArtList) ? wallArtList : [])
                .filter((p: any) => {
                    const sku = (p?.skuId || '').toString();
                    if (sku.startsWith('WA-')) return true;
                    const rawCat = p?.category;
                    
                    if (typeof rawCat === 'number') return rawCat === 2;
                    
                    if (typeof rawCat === 'string') {
                        const lc = rawCat.toLowerCase();
                        return lc === 'wall-art';
                    }
                    return false;
                });
            setWallArtItems(listA.length > 0 ? listA : wallArtData);
            
            setIsLoading(false);
        })
        .catch(() => {
            setWallArtItems(wallArtData);
            setIsLoading(false);
        });
}, []);




    // --- Metadata (Colors/Materials) Update Effect ---
    useEffect(() => {
        const uniqueColors = Array.from(new Set(wallArtItems.flatMap(item => item.colors).filter(Boolean)));
        const uniqueMaterials = Array.from(new Set(wallArtItems.flatMap(item => item.materials).filter(Boolean)));
        setColors(uniqueColors);
        setMaterials(uniqueMaterials);
    }, [wallArtItems]);


    // --- URL Param Handling Effect ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('search') || '';
        const cat = params.get('category') || 'all';
        setSearchTerm(q);
        setFilters((prev) => ({ ...prev, category: cat === 'all' ? 'All' : cat }));
        
        if (q) {
            const newParams = new URLSearchParams(location.search);
            newParams.delete('search');
            navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
        }
    }, [location.search, navigate, location.pathname]);


    // --- CORE FILTERING AND SORTING LOGIC ---
    const filteredWallArt = useMemo(() => {
        let workingList = wallArtItems;
        
        // 1. Apply Search Filter
        const activeSearchTerm = sidebarSearch || searchTerm;
        if (activeSearchTerm) {
            const lowerCaseSearch = activeSearchTerm.toLowerCase();
            workingList = workingList.filter(item =>
                item.name.toLowerCase().includes(lowerCaseSearch) ||
                (item.description && item.description.toLowerCase().includes(lowerCaseSearch)) ||
                (item.tags && Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch)))
            );
        }

        // 2. Apply Theme Filter (Radio buttons)
        if (filters.theme && filters.theme !== 'All') {
            workingList = workingList.filter(item => item.theme === filters.theme);
        }

        // 3. Apply Color Filter (Checkboxes)
        if (filters.colors && filters.colors.length > 0) {
            const lowerCaseSelectedColors = filters.colors.map(c => c.toLowerCase());
            workingList = workingList.filter(item => 
                item.colors && Array.isArray(item.colors) && item.colors.some(itemColor => 
                    lowerCaseSelectedColors.includes(itemColor.toLowerCase())
                )
            );
        }

        // 4. Apply Materials Filter (Checkboxes)
        if (filters.materials && filters.materials.length > 0) {
            const lowerCaseSelectedMaterials = filters.materials.map(m => m.toLowerCase());
            workingList = workingList.filter(item =>
                item.materials && Array.isArray(item.materials) && item.materials.some(itemMaterial =>
                    lowerCaseSelectedMaterials.includes(itemMaterial.toLowerCase())
                )
            );
        }

        // 5. Apply Sorting
        const sorted = [...workingList];
        switch (sortBy) {
            case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
            case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
            case 'newest': sorted.sort((a, b) => (b.skuId || '').localeCompare(a.skuId || '')); break;
            case 'alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'popularity':
            default: sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        }

        return sorted;
        
    }, [sortBy, wallArtItems, filters, sidebarSearch, searchTerm]);

    const wallArtToShow = filteredWallArt;

    // --- Pagination and Scroll Effects ---
    useEffect(() => { setCurrentPage(1); }, [wallArtToShow]);
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

    const totalPages = Math.ceil(wallArtToShow.length / WALLART_PER_PAGE);
    const paginatedWallArt = wallArtToShow.slice(
        (currentPage - 1) * WALLART_PER_PAGE,
        currentPage * WALLART_PER_PAGE
    );

    // NEW: A constant to check if any filters are currently active
    const isAnyFilterActive = 
        sidebarSearch.trim() !== '' ||
        filters.theme !== 'All' ||
        (filters.colors && filters.colors.length > 0) ||
        (filters.materials && filters.materials.length > 0);

    // --- Filter Content Rendering (Mobile/Desktop) ---
    const renderFilterContent = (isMobile: boolean) => (
        <aside className="w-full">
            {/* Header only visible on Desktop in the sidebar */}
            <div className="hidden lg:flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#172b9b] font-seasons">Filters</h2>
                {/* MODIFIED: "Clear All" button only shows when a filter is active */}
                {isAnyFilterActive && (
                    <button onClick={handleClearAllFilters} className="text-sm text-blue-600 hover:underline font-lora font-semibold">Clear All</button>
                )}
            </div>
            
            {/* SEARCH - Only in DESKTOP sidebar */}
            {!isMobile && (
                <div className="border-b border-blue-100 py-4">
                    <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
                    <input
                        type="text"
                        placeholder="Search wall art..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm"
                        value={sidebarSearch}
                        onChange={e => setSearchbarSearch(e.target.value)}
                    />
                </div>
            )}
            
            {/* THEME */}
            {/* <FilterSection title="Theme" sectionKey="theme" openSections={openSections} setOpenSections={setOpenSections}>
                <div className="flex flex-col gap-3">
                    <label key="All" className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer">
                        <input type="radio" name="wallArtTheme" value="All" checked={filters.theme === 'All'} onChange={() => handleFilterChange('theme', 'All')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
                        <span className={`transition-colors ${filters.theme === 'All' ? 'text-blue-700 font-bold' : ''}`}>All Themes</span>
                    </label>
                    {themes.map(theme => (
                        <label key={theme} className="flex items-center gap-3 text-sm font-lora text-[#1428a0] cursor-pointer">
                            <input type="radio" name="wallArtTheme" value={theme} checked={filters.theme === theme} onChange={() => handleFilterChange('theme', theme)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
                            <span className={`transition-colors ${filters.theme === theme ? 'text-blue-700 font-bold' : ''}`}>{theme}</span>
                        </label>
                    ))}
                </div>
            </FilterSection> */}

            {/* COLOUR */}
            <FilterSection title="Colour" sectionKey="colour" openSections={openSections} setOpenSections={setOpenSections}>
                {colors.map(color => (
                    <FilterCheckbox 
                        key={color} 
                        label={color} 
                        checked={filters.colors?.includes(color) || false} 
                        onChange={() => toggleArrayFilter('colors', color)} 
                    />
                ))}
            </FilterSection>
        </aside>
    );

    // --- Utility Components (Skeleton) ---
    const SkeletonGrid = () => (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {Array.from({ length: 9 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col border border-blue-100"
                    style={{ minHeight: '420px' }}
                >
                    <div className="w-full h-64 bg-gray-200" />
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="h-8 w-20 bg-gray-200 rounded" />
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
                <title>Premium Wall - Decorative Collection | Nagomi</title>
                <meta name="description" content="Browse our extensive collection of premium wall art. Find the perfect decorative piece for your space with our advanced filtering options." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
                <section className="relative py-16 bg-white border-b-2 border-blue-100">
                    <div className="absolute inset-0 bg-fixed bg-cover opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d')" }} />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <nav className="text-sm font-lora text-[#1428a0] mb-2">
                                <Link to="/" className="hover:underline">Home</Link> 
                                <span className="mx-2">/</span>
                                <span>Premium Wall Art</span>
                            </nav>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons">
                                Signature Wall Art
                            </h1>
                            <p className="text-xl text-gray-600 max-w-4xl mx-auto italic font-bold font-lora">
                                Transform every wall into a masterpiece with our aesthetically curated wall art collection
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                        {/* DESKTOP FILTERS SIDEBAR */}
                        <div className="hidden lg:block lg:w-72 flex-shrink-0">
                            <div className="bg-white/80 backdrop-blur-sm p-6 sticky top-24 rounded-xl shadow-lg border border-blue-100 border-t-4 border-t-blue-500">
                                <div className="text-gray-400 text-sm mb-4 font-lora">
                                    {isLoading ? 'Loading...' : `${wallArtToShow.length} Results found`}
                                </div>
                                {renderFilterContent(false)}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Toolbar (Desktop Sort/Count) */}
                            <div className="hidden lg:flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-md border border-blue-100">
                                <p className="text-sm text-[#1428a0] font-lora">{wallArtToShow.length} Results</p>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="sort-by" className="text-sm font-bold text-[#172b9b] font-lora">Sort by:</label>
                                    <select
                                        id="sort-by"
                                        value={sortBy}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    >
                                        <option value="popularity">Popularity</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="newest">Newest First</option>
                                        <option value="alphabetical">Sort alphabetically</option>
                                    </select>
                                </div>
                            </div>

                            {/* Conditional Rendering: Loading, No Results, or Grid */}
                            {isLoading ? (
                                <SkeletonGrid />
                            ) : wallArtToShow.length === 0 ? (
                                <div className="mt-8 text-center py-12 bg-white rounded-xl shadow-lg border border-blue-100">
                                    <h3 className="text-xl font-bold text-gray-700">No Wall Art Found</h3>
                                    <p className="text-gray-500 mt-2">Try clearing your filters or changing your search terms.</p>
                                    {/* MODIFIED: "Clear Filters" button in "No Results" also conditional */}
                                    {isAnyFilterActive && (
                                       <button onClick={handleClearAllFilters} className="mt-6 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform">Clear Filters</button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Wall Art Grid */}
                                    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                                        {paginatedWallArt.map((wallArt, index) => {
                                            const isFirstBatch = index < 9;
                                            return (
                                                <motion.div
                                                    key={wallArt._id || wallArt.id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.18, delay: isFirstBatch ? index * 0.03 : 0 }}
                                                    className="min-w-0 flex flex-col"
                                                >
                                                    <WallArtCard wallArt={wallArt} />
                                                
                                                </motion.div>
                                            );
                                            })}
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8">
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                            >
                                                <ChevronLeft className='w-4 h-4'/>
                                            </button>
                                            {/* Pagination buttons logic (omitted for brevity) */}
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                            >
                                                <ChevronRight className='w-4 h-4'/>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MOBILE UI --- */}

            <div className="fixed lg:hidden bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
                    <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold border-r border-gray-200">
                        <ArrowDownWideNarrow className="w-5 h-5" />
                        <span>Sort By</span>
                    </button>
                    <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700 font-semibold">
                        <ListFilter className="w-5 h-5" />
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileSortOpen && (
                    <div className="lg:hidden fixed inset-0 z-40">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} />
                        <motion.div 
                            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-xl max-h-3/4 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-[#172b9b]">Sort By</h3>
                                <button onClick={() => setIsMobileSortOpen(false)} className="text-gray-500 hover:text-gray-700 p-1">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[{ value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' }].map(opt => (
                                    <button 
                                        key={opt.value} 
                                        onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }} 
                                        className={`w-full text-left py-3 transition-colors ${sortBy === opt.value ? 'text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
                            className="absolute right-0 top-0 h-full w-full bg-white shadow-xl flex flex-col"
                        >
                            <div className="flex justify-between items-center p-4 shadow-md sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-[#172b9b] font-seasons">Filter Options</h2>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                    aria-label="Close Filters"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-4 pb-4">
                                {renderFilterContent(true)}
                            </div>

                            {/* MODIFIED: Sticky Action Bar (Footer) with adaptive layout */}
                            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-2xl z-10">
                                <div className="flex justify-between gap-3">
                                    {isAnyFilterActive && (
                                        <button
                                            onClick={() => {
                                                handleClearAllFilters();
                                                setIsMobileFiltersOpen(false);
                                            }}
                                            className="w-1/3 py-3 text-sm font-bold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className={`${isAnyFilterActive ? 'w-2/3' : 'w-full'} py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-colors`}
                                    >
                                        View Results ({wallArtToShow.length})
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default WallArtPage;