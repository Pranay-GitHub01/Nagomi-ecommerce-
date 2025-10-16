// import React, { useState, useMemo, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Helmet } from 'react-helmet-async';
// import { FilterOptions, Product } from '../types';
// import { API_BASE_URL } from '../api/config';
// import { useLocation, useNavigate } from 'react-router-dom';
// import WallRollCard from '../components/wallrolls/WallRollCard';

// const PRODUCTS_PER_PAGE = 21;

// const WallRollPage: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [colors, setColors] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const [openSections, setOpenSections] = useState({
//     colour: false,
//   });

//   const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
//   const [filters, setFilters] = useState<Omit<FilterOptions, 'roomTypes'>>({
//     category: 'All',
//     priceRange: [0, 50000],
//     colors: [],
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sidebarSearch, setSidebarSearch] = useState('');
//   const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
//   const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

//   useEffect(() => {
//     setIsLoading(true);
//     fetch(`${API_BASE_URL}/api/products`)
//       .then(r => r.json())
//       .then(data => {
//         const wallpaperRolls = (Array.isArray(data) ? data : []).filter((p: any) => {
//           const category = (p?.category || '').toString().toLowerCase().trim();
//           const tags = Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase().trim()) : [];
//           const isWallpaperRoll = category === 'wallpaper-roll';
//           const hasMinimalistTag = tags.includes('minimalist');
//           return isWallpaperRoll && hasMinimalistTag;
//         });
//         setProducts(wallpaperRolls);
//       })
//       .catch(err => console.error('Error fetching products:', err))
//       .finally(() => setIsLoading(false));

//     fetch(`${API_BASE_URL}/api/meta/colors`)
//       .then(r => r.json())
//       .then(data => setColors(data))
//       .catch(err => console.error('Error fetching colors:', err));
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const q = params.get('search') || '';
//     setSearchTerm(q);
//     if (q) {
//       const newParams = new URLSearchParams(location.search);
//       newParams.delete('search');
//       navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
//     }
//   }, [location.search, navigate, location.pathname]);

//   const filteredProducts = useMemo(() => {
//     let filteredList = products;
//     const activeSearch = sidebarSearch.trim() || searchTerm.trim();
//     if (activeSearch) {
//       const q = activeSearch.toLowerCase();
//       filteredList = filteredList.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
//     }

//     const filtered = filteredList.filter(product => {
//       const productColors = Array.isArray(product.colors) ? product.colors.map(c => c.toLowerCase()) : [];
//       const matchesColors = !filters.colors?.length || filters.colors.every(c => productColors.includes(c.toLowerCase()));
//       const matchesPrice = product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1];
//       return matchesPrice && matchesColors;
//     });

//     const sorted = [...filtered];
//     switch (sortBy) {
//       case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
//       case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
//       case 'newest': sorted.sort((a, b) => (b.skuId || '').localeCompare(a.skuId || '')); break;
//       case 'alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
//       default: sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
//     }
//     return sorted;
//   }, [filters, sortBy, products, searchTerm, sidebarSearch]);

//   const colorCounts = useMemo(() => {
//     const counts: Record<string, number> = {};
//     filteredProducts.forEach(p => { (Array.isArray(p.colors) ? p.colors : []).forEach(c => { counts[c] = (counts[c] || 0) + 1; }); });
//     return counts;
//   }, [filteredProducts]);

//   const productsToShow = filteredProducts;
//   const totalPages = Math.ceil(productsToShow.length / PRODUCTS_PER_PAGE);
//   const paginatedProducts = productsToShow.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

//   useEffect(() => { setCurrentPage(1); }, [productsToShow]);
//   useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

//   const toggleSection = (section: keyof typeof openSections) => setOpenSections(p => ({ ...p, [section]: !p[section] }));
//   const toggleColorFilter = (value: string) => setFilters(p => ({ ...p, colors: p.colors?.includes(value) ? p.colors.filter(i => i !== value) : [...(p.colors || []), value] }));
//   const isAnyFilterActive = (filters.colors && filters.colors.length > 0) || sidebarSearch.trim() !== '';
  
//   const handleClearFilters = () => {
//     setFilters({ category: 'All', priceRange: [0, 50000], colors: [] });
//     setSidebarSearch('');
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Minimalist Wallpaper Rolls - Shop Collection | Nagomi</title>
//         <meta name="description" content="Browse our curated collection of minimalist wallpaper rolls, perfect for modern and serene interiors." />
//       </Helmet>
//       <div className="min-h-screen bg-gray-50">
//         <div className="bg-white border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
//               <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons">Minimalist Wallpaper Rolls</h1>
//               <p className="text-xl text-gray-600 max-w-4xl mx-auto italic font-bold">Discover clean lines and subtle textures for a tranquil space.</p>
//             </motion.div>
//             <nav className="flex items-center space-x-2 text-sm text-gray-700 mt-6">
//               <a href="/" className="hover:text-primary-600 italic">Home</a><span>/</span><span className="text-[#172b9b] italic">Minimalist Wallpaper Rolls</span>
//             </nav>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="hidden lg:block lg:w-64 flex-shrink-0">
//               <div className="bg-white p-6 sticky top-24 rounded-xl border border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto">
//                 <div className="text-gray-400 text-sm mb-4 font-lora">{productsToShow.length} Results found</div>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-[#172b9b] font-bold">Filters</h2>
//                   {isAnyFilterActive && (<button onClick={handleClearFilters} className="text-xs text-gray-700 hover:text-blue-700 font-lora">Clear All</button>)}
//                 </div>
//                 <div className="space-y-0">
//                   <div className="border-b border-gray-200 py-4">
//                     <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
//                     <div className="relative"><input type="text" placeholder="Search rolls..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} /></div>
//                   </div>
//                   <div className="border-b border-gray-200 py-4">
//                     <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">Colour<svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
//                     {openSections.colour && <div className="mt-3"><div className="flex flex-col gap-2">{colors.map(c => <label key={c} className="flex items-center gap-2 text-sm font-lora text-gray-700"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" checked={!!filters.colors?.includes(c)} onChange={() => toggleColorFilter(c)} /><span>{c}</span>{typeof colorCounts[c] === 'number' && <span className="text-gray-400">({colorCounts[c]})</span>}</label>)}</div></div>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex-1">
//               <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
//                 <div className="flex items-center gap-4"><span className="text-sm text-gray-600">{productsToShow.length} results</span><select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value="popularity">Sort by Popularity</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="newest">Newest First</option><option value="alphabetical">Sort Alphabetically</option></select></div>
//               </div>
//               {isLoading ? (
//                   <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col" style={{ minHeight: '420px' }}><div className="w-full h-64 bg-gray-200" /><div className="p-6 flex-1 flex flex-col justify-between"><div className="space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div><div className="mt-4 h-8 w-24 bg-gray-200 rounded" /></div></div>)}</div>
//               ) : productsToShow.length > 0 ? (
//                 <>
//                   <div className={`grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr`}>
//                     {paginatedProducts.map((product) => (
//                       <motion.div key={product._id || product.id} className="min-w-0 flex flex-col">
//                         <WallRollCard product={product} />
//                       </motion.div>
//                     ))}
//                   </div>
//                   {totalPages > 1 && <div className="flex justify-center items-center gap-2 mt-8">{/* Pagination buttons go here */}</div>}
//                 </>
//               ) : (
//                 <div className="text-center py-16 bg-white rounded-xl shadow-md">
//                   <h3 className="text-xl font-bold text-gray-800">No Products Found</h3>
//                   <p className="text-gray-500 mt-2">No minimalist wallpaper rolls matched your current filters.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default WallRollPage;
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FilterOptions, Product } from '../types';
import { API_BASE_URL } from '../api/config';
import { useLocation, useNavigate } from 'react-router-dom';
import WallRollCard from '../components/wallrolls/WallRollCard';

const PRODUCTS_PER_PAGE = 21;

const WallRollPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openSections, setOpenSections] = useState({
    colour: true, // Set to true to be open by default
    room: false,
  });

  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('popularity');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    priceRange: [0, 50000],
    colors: [],
    roomTypes: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        const wallpaperRolls = (Array.isArray(data) ? data : []).filter((p: any) => {
          const category = (p?.category || '').toString().toLowerCase().trim();
          const tags = Array.isArray(p.tags) ? p.tags.map(t => t.toLowerCase().trim()) : [];
          return category === 'wallpaper-roll' && tags.includes('minimalist');
        });
        setProducts(wallpaperRolls);
      })
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setIsLoading(false));

    fetch(`${API_BASE_URL}/api/meta/colors`)
      .then(r => r.json())
      .then(data => setColors(data))
      .catch(err => console.error('Error fetching colors:', err));
  }, []);

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

  const filteredProducts = useMemo(() => {
    let filteredList = products;
    const activeSearch = sidebarSearch.trim() || searchTerm.trim();
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      filteredList = filteredList.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    const filtered = filteredList.filter(product => {
      const productColors = Array.isArray(product.colors) ? product.colors.map(c => c.toLowerCase()) : [];
      const matchesColors = !filters.colors?.length || filters.colors.some(c => productColors.includes(c.toLowerCase()));
      const matchesPrice = product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1];
      return matchesPrice && matchesColors;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
      case 'newest': sorted.sort((a, b) => (b.skuId || '').localeCompare(a.skuId || '')); break;
      case 'alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }
    return sorted;
  }, [filters, sortBy, products, searchTerm, sidebarSearch]);

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    // Use the base filtered list (before color filtering) to get accurate counts
    const listForCounting = products.filter(p => {
        const activeSearch = sidebarSearch.trim() || searchTerm.trim();
        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            return p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
        }
        return true;
    });
    listForCounting.forEach(p => { (Array.isArray(p.colors) ? p.colors : []).forEach(c => { counts[c] = (counts[c] || 0) + 1; }); });
    return counts;
  }, [products, searchTerm, sidebarSearch]);

  const productsToShow = filteredProducts;
  const totalPages = Math.ceil(productsToShow.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = productsToShow.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [productsToShow]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

  const toggleSection = (section: keyof typeof openSections) => setOpenSections(p => ({ ...p, [section]: !p[section] }));
  const toggleArrayFilter = (key: 'colors' | 'roomTypes', value: string) => setFilters(p => ({ ...p, [key]: p[key]?.includes(value) ? p[key].filter(i => i !== value) : [...(p[key] || []), value] }));
  const isAnyFilterActive = (filters.colors && filters.colors.length > 0) || sidebarSearch.trim() !== '';

  const handleClearFilters = () => {
    setFilters({ category: 'All', priceRange: [0, 50000], colors: [], roomTypes: [] });
    setSidebarSearch('');
  };

  return (
    <>
      <Helmet>
        <title>Minimalist Wallpaper Rolls - Shop Collection | Nagomi</title>
        <meta name="description" content="Browse our curated collection of minimalist wallpaper rolls, perfect for modern and serene interiors." />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons"> Wallpaper Rolls</h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto italic font-bold">Discover clean lines and subtle textures for a tranquil space.</p>
            </motion.div>
            <nav className="flex items-center space-x-2 text-sm text-gray-700 mt-6">
              <a href="/" className="hover:text-primary-600 italic">Home</a><span>/</span><span className="text-[#172b9b] italic">Wallpaper Rolls</span>
            </nav>
          </div>
        </div>
        
        {/* Mobile UI elements... */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-white p-6 sticky top-24 rounded-xl border border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto">
                <div className="text-gray-400 text-sm mb-4 font-lora">{productsToShow.length} Results found</div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#172b9b] font-bold">Filters</h2>
                  {isAnyFilterActive && (<button onClick={handleClearFilters} className="text-xs text-gray-700 hover:text-blue-700 font-lora">Clear All</button>)}
                </div>
                <div className="space-y-0">
                  <div className="border-b border-gray-200 py-4">
                    <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
                    <div className="relative"><input type="text" placeholder="Search rolls..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} /></div>
                  </div>
                  
                  {/* ### COLOR FILTER UI ADDED ### */}
                  <div className="border-b border-gray-200 py-4">
                    <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">
                        Colour
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections.colour && (
                        <div className="mt-3">
                            <div className="flex flex-col gap-2">
                                {colors.map(color => (
                                    <label key={color} className="flex items-center gap-2 text-sm font-lora text-gray-700 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" 
                                            checked={filters.colors?.includes(color) || false} 
                                            onChange={() => toggleArrayFilter('colors', color)} 
                                        />
                                        <span>{color}</span>
                                        {typeof colorCounts[color] === 'number' && colorCounts[color] > 0 && (
                                            <span className="text-gray-400 text-xs">({colorCounts[color]})</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{productsToShow.length} results</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="popularity">Sort by Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="alphabetical">Sort Alphabetically</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col" style={{ minHeight: '420px' }}><div className="w-full h-64 bg-gray-200" /><div className="p-6 flex-1 flex flex-col justify-between"><div className="space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div><div className="mt-4 h-8 w-24 bg-gray-200 rounded" /></div></div>)}</div>
              ) : productsToShow.length > 0 ? (
                <>
                  <div className={`grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr`}>
                    {paginatedProducts.map((product) => (
                      <motion.div key={product._id || product.id} className="min-w-0 flex flex-col">
                        <WallRollCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Prev</button>
                      {(() => { const pages = []; const maxPagesToShow = 5; let startPage = Math.max(1, currentPage - 2); let endPage = Math.min(totalPages, currentPage + 2); if (totalPages <= maxPagesToShow) { startPage = 1; endPage = totalPages; } else if (currentPage <= 3) { endPage = maxPagesToShow; } else if (currentPage >= totalPages - 2) { startPage = totalPages - maxPagesToShow + 1; } if (startPage > 1) { pages.push(<button key={1} onClick={() => setCurrentPage(1)} className="px-3 py-1 rounded-lg border text-sm font-medium transition-all bg-white text-gray-700 border-gray-300 hover:bg-gray-100">1</button>); if (startPage > 2) { pages.push(<span key="start-ellipsis" className="px-3 py-1">...</span>); } } for (let page = startPage; page <= endPage; page++) { pages.push(<button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{page}</button>); } if (endPage < totalPages) { if (endPage < totalPages - 1) { pages.push(<span key="end-ellipsis" className="px-3 py-1">...</span>); } pages.push(<button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 rounded-lg border text-sm font-medium transition-all bg-white text-gray-700 border-gray-300 hover:bg-gray-100">{totalPages}</button>); } return pages; })()}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Next</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-gray-800">No Products Found</h3>
                  <p className="text-gray-500 mt-2">No minimalist wallpaper rolls matched your current filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WallRollPage;