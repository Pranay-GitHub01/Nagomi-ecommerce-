import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import WallArtCard from '../../components/WallArt/WallArtCard';
import { FilterOptions, WallArt } from "../../types"
import { wallArtData } from '../data/wallArt';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

const WALLART_PER_PAGE = 21;

const WallArtPage: React.FC = () => {
  const [wallArtItems, setWallArtItems] = useState<WallArt[]>(wallArtData);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [colors, setColors] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);

  const [openSections, setOpenSections] = useState({
    type: false,
    colour: false,
    materials: false
  });

  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    theme: 'All',
    priceRange: [0, 500],
    colors: [],
    materials: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');

  useEffect(() => {
    // Fetch from both sources and merge: /api/wallart and /api/products filtered by 'wall-art'
    Promise.all([
      fetch(`${API_BASE_URL}/api/wallart`).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE_URL}/api/products`).then(r => r.ok ? r.json() : [])
    ]).then(([wallArtList, allProducts]) => {
      const listA = Array.isArray(wallArtList) ? wallArtList : [];
      const listB = (Array.isArray(allProducts) ? allProducts : []).filter((p: any) => {
        const sku = (p?.skuId || '').toString();
        if (sku.startsWith('WA_')) return true;
        const rawCat = p?.category;
        if (typeof rawCat === 'number') return rawCat === 2;
        if (typeof rawCat === 'string') {
          const lc = rawCat.toLowerCase();
          return lc === 'wall-art' || lc === 'wall art';
        }
        return false;
      });
      const seen = new Set<string>();
      const merged: any[] = [];
      const addUnique = (item: any) => {
        const key = (item._id || item.id || item.skuId || '').toString();
        if (!key || seen.has(key)) return;
        seen.add(key);
        merged.push(item);
      };
      listA.forEach(addUnique);
      listB.forEach(addUnique);
      if (merged.length > 0) {
        setWallArtItems(merged);
      } else {
        // fall back to static
        setWallArtItems(wallArtData);
      }
    }).catch(() => {
      // final fallback
      setWallArtItems(wallArtData);
    });
  }, []);

  useEffect(() => {
    // Extract unique categories, colors, and materials from current data
    const uniqueCategories = Array.from(new Set(['All', ...wallArtItems.map(item => item.category)]));
    const uniqueColors = Array.from(new Set(wallArtItems.flatMap(item => item.colors)));
    const uniqueMaterials = Array.from(new Set(wallArtItems.flatMap(item => item.materials)));

    setCategories(uniqueCategories);
    setColors(uniqueColors);
    setMaterials(uniqueMaterials);

    console.log('Wall Art Data:', wallArtItems);
    console.log('Categories:', uniqueCategories);
    console.log('Colors:', uniqueColors);
    console.log('Materials:', uniqueMaterials);
  }, [wallArtItems]);

  // Read search from query param on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    const cat = params.get('category') || 'all';
    setSearchTerm(q);
    setSelectedCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat === 'all' ? 'All' : cat }));
    // Remove search param from URL on initial load so grid resets on reload
    if (q) {
      const newParams = new URLSearchParams(location.search);
      newParams.delete('search');
      navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  const filteredWallArt = useMemo(() => {
    console.log('Filtering wall art with filters:', filters, 'Selected category:', selectedCategory);
    console.log('Total wall art before filtering:', wallArtItems.length);
    
    // First filter by category
    let categoryFiltered = wallArtItems;
    if (selectedCategory !== 'all') {
      categoryFiltered = wallArtItems.filter(item => {
        if (!item.category) return false;
        return item.category.toLowerCase() === selectedCategory.toLowerCase();
      });
      console.log('Wall art after category filter:', categoryFiltered.length);
    }
    
    let filteredList = categoryFiltered;
    // Apply sidebar search filter if present
    if (sidebarSearch.trim()) {
      const q = sidebarSearch.trim().toLowerCase();
      filteredList = filteredList.filter(item =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
      console.log('Wall art after search filter:', filteredList.length);
    } else if (searchTerm.trim()) {
      // Fallback to navbar search if sidebar search is empty
      const q = searchTerm.trim().toLowerCase();
      filteredList = filteredList.filter(item =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
      console.log('Wall art after search filter:', filteredList.length);
    }

    const filtered = filteredList.filter(item => {
      // Defensive: default to empty array if null
      const itemColors = Array.isArray(item.colors) ? item.colors : [];
      const itemMaterials = Array.isArray(item.materials) ? item.materials : [];

      // Case-insensitive category filter
      const matchesCategory =
        !filters.category ||
        filters.category === 'All' ||
        (item.category && item.category.toLowerCase() === filters.category.toLowerCase());

      // Case-insensitive theme filter (uses item.tags[0])
      const themeValue = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags[0] : '';
      const matchesTheme =
        !filters.theme ||
        filters.theme === 'All' ||
        (themeValue && themeValue.toLowerCase().trim() === filters.theme.toLowerCase().trim());

      // Case-insensitive color filter
      const matchesColors =
        !filters.colors?.length ||
        filters.colors.some(
          color => itemColors.map(c => c.toLowerCase()).includes(color.toLowerCase())
        );

      // Case-insensitive materials filter
      const matchesMaterials =
        !filters.materials?.length ||
        filters.materials.some(
          material => itemMaterials.map(m => m.toLowerCase()).includes(material.toLowerCase())
        );

      const matchesPrice = item.price >= filters.priceRange![0] && item.price <= filters.priceRange![1];

      const isMatch = matchesCategory && matchesTheme && matchesPrice && matchesColors && matchesMaterials;
      
      return isMatch;
    });

    console.log('Final filtered wall art count:', filtered.length);
    
    // Sort wall art based on selected option, default to SKU ID sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceComparison = a.price - b.price;
          if (priceComparison !== 0) return priceComparison;
          return (a.skuId || '').localeCompare(b.skuId || '');
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceComparison = b.price - a.price;
          if (priceComparison !== 0) return priceComparison;
          return (a.skuId || '').localeCompare(b.skuId || '');
        });
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const skuComparison = (b.skuId || '').localeCompare(a.skuId || '');
          if (skuComparison !== 0) return skuComparison;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => {
          const nameComparison = a.name.localeCompare(b.name);
          if (nameComparison !== 0) return nameComparison;
          return (a.skuId || '').localeCompare(b.skuId || '');
        });
        break;
      case 'popularity':
        filtered.sort((a, b) => {
          const bestComparison = (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
          if (bestComparison !== 0) return bestComparison;
          return (a.skuId || '').localeCompare(b.skuId || '');
        });
        break;
      default:
        // Default sorting: SKU ID only (when no sort option is selected)
        filtered.sort((a, b) => (a.skuId || '').localeCompare(b.skuId || ''));
    }

    return filtered;
  }, [filters, sortBy, wallArtItems, selectedCategory, searchTerm, sidebarSearch]);

  // Always show filtered results (can be empty when filters exclude all)
  const wallArtToShow = filteredWallArt;

  // Pagination logic
  const totalPages = Math.ceil(wallArtToShow.length / WALLART_PER_PAGE);
  const paginatedWallArt = wallArtToShow.slice(
    (currentPage - 1) * WALLART_PER_PAGE,
    currentPage * WALLART_PER_PAGE
  );

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [wallArtToShow]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    console.log(`Changing ${key} filter to:`, value);
    setFilters((prev: FilterOptions) => {
      const newFilters = { ...prev, [key]: value };
      console.log('New filters state:', newFilters);
      return newFilters;
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleArrayFilter = (key: 'colors' | 'materials', value: string) => {
    console.log(`Toggling ${key} filter with value:`, value);
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: prev[key]?.includes(value)
          ? prev[key].filter(item => item !== value)
          : [...(prev[key] || []), value]
      };
      console.log('New filters state:', newFilters);
      return newFilters;
    });
  };

  return (
    <>
      <Helmet>
        <title>Premium Wall Art - Decorative Collection | Nagomi</title>
        <meta name="description" content="Browse our extensive collection of premium wall art. Find the perfect decorative piece for your space with our advanced filtering options." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons">
                Premium Wall Art
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto italic font-bold">
                Transform every wall into a masterpiece with our aesthetically curated wall art collection
              </p>
            </motion.div>
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-6">
              <a href="/" className="hover:text-primary-600 italic">Home</a>
              <span>/</span>
              <span className="text-[#172b9b] italic">Premium Wall Art</span>
            </nav>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white p-6 sticky top-24 max-h-[70vh] overflow-y-auto">
                {/* Results count */}
                <div className="text-gray-400 text-sm mb-4 font-lora">
                  {wallArtToShow.length} Results found
                </div>
                
                {/* Filters heading */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#172b9b] font-bold">Filters</h2>
                  <button
                    onClick={() => {
                      console.log('Clearing all filters');
                      setFilters({
                        category: 'All',
                        theme: 'All',
                        priceRange: [0, 500],
                        colors: [],
                        materials: []
                      });
                      setSidebarSearch('');
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 font-lora"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-0">
                  {/* SEARCH */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <label className="block text-[#545454] font-bold mb-2 font-lora">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search wall art..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm"
                        value={sidebarSearch}
                        onChange={e => setSidebarSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* THEME */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleSection('type')}
                      className="w-full flex items-center justify-between text-gray-700 font-medium font-lora"
                    >
                      Theme
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSections.type && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleFilterChange('theme', 'All')}
                            className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.theme === 'All' ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            No theme filter
                          </button>
                          {['Modern', 'Elegant', 'Decorative', 'Abstract', 'Minimalist', 'Vintage'].map(theme => (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => handleFilterChange('theme', theme)}
                              className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.theme === theme ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COLOUR */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleSection('colour')}
                      className="w-full flex items-center justify-between text-gray-700 font-medium font-lora"
                    >
                      Colour
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSections.colour && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          {colors.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => toggleArrayFilter('colors', color)}
                              className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.colors?.includes(color) ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* MATERIALS */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleSection('materials')}
                      className="w-full flex items-center justify-between text-gray-700 font-medium font-lora"
                    >
                      Materials
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${openSections.materials ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSections.materials && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          {materials.map(material => (
                            <button
                              key={material}
                              type="button"
                              onClick={() => toggleArrayFilter('materials', material)}
                              className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.materials?.includes(material) ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {material}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {wallArtToShow.length} results
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Sort by</option>
                      <option value="popularity">Sort by Popularity</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="alphabetical">Sort Alphabetically</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Wall Art Grid */}
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                {paginatedWallArt.map((wallArt, index) => {
                  // Only stagger delay for the first batch on each page
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
                    Prev
                  </button>
                  {/* Page numbers with ellipsis for large page counts */}
                  {(() => {
                    const pages = [];
                    const maxPagesToShow = 5;
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalPages, currentPage + 2);
                    if (currentPage <= 3) {
                      endPage = Math.min(totalPages, maxPagesToShow);
                    } else if (currentPage >= totalPages - 2) {
                      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
                    }
                    if (startPage > 1) {
                      pages.push(
                        <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>1</button>
                      );
                      if (startPage > 2) {
                        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
                      }
                    }
                    for (let page = startPage; page <= endPage; page++) {
                      pages.push(
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === page ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
                      }
                      pages.push(
                        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{totalPages}</button>
                      );
                    }
                    return pages;
                  })()}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* No Results */}
              {wallArtToShow.length === 0 && (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col"
                      style={{ minHeight: '420px' }}
                    >
                      <div className="w-full h-64 bg-gray-200" />
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-8 w-20 bg-gray-200 rounded" />
                          <div className="h-8 w-16 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WallArtPage;
