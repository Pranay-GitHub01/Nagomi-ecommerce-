import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard';
import { FilterOptions, Product } from '../types';
import { API_BASE_URL } from '../api/config';
import { useLocation, useNavigate } from 'react-router-dom';

const PRODUCTS_PER_PAGE = 21;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [colors, setColors] = useState<string[]>([]);
  const rooms = ['Living Room', 'Bedroom', 'Pooja room', 'Kids room', 'Office'];

  const [openSections, setOpenSections] = useState({
    type: false,
    colour: false,
    room: false
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        const wallpapers = (Array.isArray(data) ? data : []).filter((p: any) => {
          const sku = (p?.skuId || '').toString();
          if (sku.startsWith('WA_')) return false;
          const rawCat = p?.category;
          const normalized = typeof rawCat === 'number' ? rawCat : (typeof rawCat === 'string' ? rawCat.toLowerCase() : '');
          if (normalized === 2 || normalized === '2' || normalized === 'wall-art' || normalized === 'wall art') return false;
          return true;
        });

        const skuRoomOverrides: Record<string, string[]> = {};
        const poojaKeywords = ['pooja', 'mandir', 'temple', 'krishna', 'radha', 'srinath', 'shiv', 'shiva', 'vrindavan', 'gopal', 'govind', 'gau', 'kamdhenu'];
        const kidsKeywords = ['kids', 'princess', 'astronaut', 'rocket', 'unicorn', 'football', 'avenger', 'spidey', 'parachute', 'balloon'];
        const officeKeywords = ['office', 'workspace', 'work space', 'corporate', 'stripe', 'stripes', 'concrete', 'marble', 'geometric', 'geometry', 'metallic', 'stucco', 'city', 'skyline', 'abstract', 'minimal', 'pattern'];

        const normalize = (v: any) => (typeof v === 'string' ? v.toLowerCase() : '');
        const includesAny = (text: string, words: string[]) => words.some(w => text.includes(w));

        const enriched = wallpapers.map((p: any) => {
          const existingRooms: string[] = Array.isArray(p.roomTypes) ? p.roomTypes : [];
          if (existingRooms.length > 0) return p;
          const sku = (p?.skuId || '').toString();
          const name = normalize(p?.name || '');
          const theme = normalize(p?.theme || '');
          const desc = normalize(p?.description || '');
          const text = `${name} ${theme} ${desc}`;

          let roomsForSku: string[] | undefined = skuRoomOverrides[sku];
          if (!roomsForSku) {
            if (includesAny(text, kidsKeywords) || theme === 'kids') {
              roomsForSku = ['Kids room'];
            } else if (includesAny(text, poojaKeywords)) {
              roomsForSku = ['Pooja room'];
            } else {
              roomsForSku = ['Living Room', 'Bedroom'];
            }
            const themeForOffice = ['modern', 'minimalist', '3d'].includes(theme);
            const keywordForOffice = includesAny(text, officeKeywords);
            if (themeForOffice || keywordForOffice) {
              roomsForSku = Array.from(new Set([...(roomsForSku || []), 'Office']));
            }
          }

          return { ...p, roomTypes: roomsForSku };
        });

        setProducts(enriched);
      })
      .catch(err => console.error('Error fetching products:', err));

    fetch(`${API_BASE_URL}/api/meta/categories`)
      .then(r => r.json())
      .then(data => setCategories(Array.from(new Set(['All', ...data]))))
      .catch(err => console.error('Error fetching categories:', err));

    fetch(`${API_BASE_URL}/api/meta/colors`)
      .then(r => r.json())
      .then(data => setColors(data))
      .catch(err => console.error('Error fetching colors:', err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    const cat = params.get('category') || 'all';
    setSearchTerm(q);
    setSelectedCategory(cat);
    setFilters((prev) => ({ ...prev, category: cat === 'all' ? 'All' : cat }));
    if (q) {
      const newParams = new URLSearchParams(location.search);
      newParams.delete('search');
      navigate({ pathname: location.pathname, search: newParams.toString() }, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  const filteredProducts = useMemo(() => {
    let categoryFiltered = products;
    if (selectedCategory !== 'all') {
      categoryFiltered = products.filter(product => {
        if (!product.category) return false;
        return product.category.toLowerCase() === selectedCategory.toLowerCase();
      });
    }
    
    let filteredList = categoryFiltered;
    if (sidebarSearch.trim()) {
      const q = sidebarSearch.trim().toLowerCase();
      filteredList = filteredList.filter(product =>
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q)
      );
    } else if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      filteredList = filteredList.filter(product =>
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q)
      );
    }

    const filtered = filteredList.filter(product => {
      const productColors = Array.isArray(product.colors) ? product.colors : [];
      const productRooms = Array.isArray(product.roomTypes) ? product.roomTypes : [];

      const matchesCategory =
        !filters.category ||
        filters.category === 'All' ||
        (product.category && product.category.toLowerCase() === filters.category.toLowerCase());

      const themeValue = product.theme ? product.theme : (Array.isArray(product.tags) && product.tags.length > 0 ? product.tags[0] : '');
      const matchesTheme =
        selectedThemes.length === 0 ||
        (themeValue && selectedThemes.map(t => t.toLowerCase().trim()).includes(themeValue.toLowerCase().trim()));

      const matchesColors =
        !filters.colors?.length ||
        filters.colors.some(
          color => productColors.map(c => c.toLowerCase()).includes(color.toLowerCase())
        );

      const matchesRooms =
        !filters.roomTypes?.length ||
        filters.roomTypes.some(
          room => productRooms.map(r => r.toLowerCase()).includes(room.toLowerCase())
        );

      const matchesPrice = product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1];

      return matchesCategory && matchesTheme && matchesPrice && matchesColors && matchesRooms;
    });
    
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price || (a.skuId || '').localeCompare(b.skuId || ''));
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price || (a.skuId || '').localeCompare(b.skuId || ''));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.skuId || '').localeCompare(a.skuId || '') || a.name.localeCompare(b.name));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name) || (a.skuId || '').localeCompare(b.skuId || ''));
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (a.skuId || '').localeCompare(b.skuId || ''));
        break;
      default:
        filtered.sort((a, b) => (a.skuId || '').localeCompare(b.skuId || ''));
    }

    return filtered;
  
  }, [filters, sortBy, products, selectedCategory, searchTerm, sidebarSearch, selectedThemes]);

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredProducts.forEach(p => {
      (Array.isArray(p.colors) ? p.colors : []).forEach(c => {
        counts[c] = (counts[c] || 0) + 1;
      });
    });
    return counts;
  }, [filteredProducts]);

  const productsToShow = filteredProducts;

  const totalPages = Math.ceil(productsToShow.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = productsToShow.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [productsToShow]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArrayFilter = (key: 'colors' | 'roomTypes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key]?.includes(value)
        ? prev[key].filter(item => item !== value)
        : [...(prev[key] || []), value]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Premium Wallpapers - Shop Collection | Nagomi</title>
        <meta name="description" content="Browse our extensive collection of premium wallpapers. Find the perfect design for your space with our advanced filtering options." />
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
                Customised Wallpapers
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto italic font-bold">
                Transform every wall into a masterpiece with our aesthetically curated collection
              </p>
            </motion.div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-6">
              <a href="/" className="hover:text-primary-600 italic">Home</a>
              <span>/</span>
              <span className="text-[#172b9b] italic">Premium Wallpapers</span>
            </nav>
          </div>
        </div>

        <div className="fixed lg:hidden bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 gap-2 text-center">
            <button onClick={() => setIsMobileSortOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 6.75A.75.75 0 0 1 3.75 6h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Zm0 5.25a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 3 17.25Z"/><path d="M17.47 3.72a.75.75 0 0 1 1.06 0l2.75 2.75a.75.75 0 1 1-1.06 1.06l-1.22-1.22V20a.75.75 0 0 1-1.5 0V6.31l-1.22 1.22a.75.75 0 1 1-1.06-1.06l2.75-2.75Z"/></svg>
              <span>Sort By</span>
            </button>
            <button onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center justify-center gap-2 py-2 text-sm text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10.5 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm9 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM7.5 12.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM6 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm12 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z"/></svg>
              <span>Filters</span>
            </button>
          </div>
        </div>

        {isMobileSortOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSortOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Sort By</h3>
                <button onClick={() => setIsMobileSortOpen(false)} className="text-sm text-gray-600">Close</button>
              </div>
              <div className="divide-y">
                {[{ value: 'popularity', label: 'Popularity' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }, { value: 'newest', label: 'Newest First' }, { value: 'alphabetical', label: 'Alphabetical' }].map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value as typeof sortBy); setIsMobileSortOpen(false); }} className={`w-full text-left py-3 ${sortBy === opt.value ? 'text-[#172b9b] font-semibold' : 'text-gray-700'}`}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-xl mx-auto px-4 sm:px-2 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full">
            <div className={`text-center cursor-pointer transition-all duration-200 hover:scale-105 flex-1 min-w-[180px] max-w-xs`} style={{ flexBasis: '220px' }} onClick={() => setSelectedCategory('customised')}>
              <div className={`w-full aspect-square max-w-[100px] rounded-full border-2 bg-white mb-4 mx-auto flex items-center justify-center transition-all duration-200 ${selectedCategory === 'customised' ? 'border-[#172b9b] shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}>
                <img src="/custom-fit.png" alt="Customised Wallpapers Icon" className="w-3/4 h-3/4 object-contain" />
              </div>
              <h3 className={`font-bold underline transition-colors duration-200 break-words ${selectedCategory === 'customised' ? 'text-[#172b9b]' : 'text-[#172b9b]'}`}>Customised Wallpapers</h3>
            </div>
            <div className={`text-center cursor-pointer transition-all duration-200 hover:scale-105 flex-1 min-w-[180px] max-w-xs`} style={{ flexBasis: '220px' }} onClick={() => setSelectedCategory('rolls')}>
              <div className={`w-full aspect-square max-w-[100px] rounded-full border-2 bg-white mb-4 mx-auto flex items-center justify-center transition-all duration-200 ${selectedCategory === 'rolls' ? 'border-[#172b9b] shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}>
                <img src="/high-quality-blue.png" alt="Wallpaper Rolls Icon" className="w-3/4 h-3/4 object-contain" />
              </div>
              <h3 className={`font-bold underline transition-colors duration-200 break-words ${selectedCategory === 'rolls' ? 'text-[#172b9b]' : 'text-[#172b9b]'}`}>Wallpaper Rolls</h3>
            </div>
          </div> 
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-white p-6 sticky top-24 rounded-xl border border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto">
                <div className="text-gray-400 text-sm mb-4 font-lora">{productsToShow.length} Results found</div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#172b9b] font-bold">Filters</h2>
                  <button
                    onClick={() => {
                      setFilters({
                        category: 'All',
                        priceRange: [0, 200],
                        colors: [],
                        roomTypes: []
                      });
                     
                      setSelectedThemes([]);
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
                  <div className="border-b border-gray-200 py-4">
                    <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
                    <div className="relative">
                      <input type="text" placeholder="Search wallpapers..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="border-b border-gray-200 py-4">
                    <button onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">
                      Theme
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections.type && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          {themes.map(theme => (
                            <label key={theme} className="flex items-center gap-2 text-sm font-lora text-gray-700">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" checked={selectedThemes.includes(theme)} onChange={() => { setSelectedThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]); }} />
                              <span>{theme}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-b border-gray-200 py-4">
                    <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">
                      Colour
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections.colour && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          {colors.map(color => (
                            <label key={color} className="flex items-center gap-2 text-sm font-lora text-gray-700">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" checked={!!filters.colors?.includes(color)} onChange={() => toggleArrayFilter('colors', color)} />
                              <span>{color}</span>
                              {typeof colorCounts[color] === 'number' && (<span className="text-gray-400">({colorCounts[color]})</span>)}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-b border-gray-200 py-4">
                    <button onClick={() => toggleSection('room')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">
                      Room
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.room ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections.room && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          {rooms.map(room => (
                            <label key={room} className="flex items-center gap-2 text-sm font-lora text-gray-700">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" checked={!!filters.roomTypes?.includes(room)} onChange={() => toggleArrayFilter('roomTypes', room)} />
                              <span>{room}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isMobileFiltersOpen && (
              <div className="lg:hidden fixed inset-0 z-40">
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFiltersOpen(false)} />
                <div className="absolute right-0 top-0 h-full w-11/12 max-w-xs bg-white shadow-xl p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[#172b9b] font-bold">Filters</h2>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="text-sm text-gray-600">Close</button>
                  </div>
                  <div className="border-b border-gray-200 py-4">
                    <label className="block text-[#545454] font-bold mb-2 font-lora">Search</label>
                    <div className="relative"><input type="text" placeholder="Search wallpapers..." className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm" value={sidebarSearch} onChange={e => setSidebarSearch(e.target.value)} /></div>
                  </div>
                  <div className="border-b border-gray-200 py-4">
                    <button onClick={() => toggleSection('type')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">
                      Theme<svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections.type && (<div className="mt-3"><div className="flex flex-col gap-2">{themes.map(theme => (<label key={theme} className="flex items-center gap-2 text-sm font-lora text-gray-700"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" checked={selectedThemes.includes(theme)} onChange={() => { setSelectedThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]); }} /><span>{theme}</span></label>))}</div></div>)}
                  </div>
                  <div className="border-b border-gray-200 py-4">
                    <button onClick={() => toggleSection('colour')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">
                      Colour<svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections.colour && (<div className="mt-3"><div className="flex flex-col gap-2">{colors.map(color => (<label key={color} className="flex items-center gap-2 text-sm font-lora text-gray-700"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" checked={!!filters.colors?.includes(color)} onChange={() => toggleArrayFilter('colors', color)} /><span>{color}</span>{typeof colorCounts[color] === 'number' && (<span className="text-gray-400">({colorCounts[color]})</span>)}</label>))}</div></div>)}
                  </div>
                  <div className="border-b border-gray-200 py-4">
                    <button onClick={() => toggleSection('room')} className="w-full flex items-center justify-between text-gray-700 font-medium font-lora">
                      Room<svg className={`w-4 h-4 text-gray-400 transition-transform ${openSections.room ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openSections.room && (<div className="mt-3"><div className="flex flex-col gap-2">{rooms.map(room => (<label key={room} className="flex items-center gap-2 text-sm font-lora text-gray-700"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#172b9b] focus:ring-[#172b9b]" checked={!!filters.roomTypes?.includes(room)} onChange={() => toggleArrayFilter('roomTypes', room)} /><span>{room}</span></label>))}</div></div>)}
                  </div>
                  <div className="pt-4"><button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#172b9b] text-white py-2 rounded-lg">Apply Filters</button></div>
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{productsToShow.length} results</span>
                    <select value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="popularity">Sort by Popularity</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="alphabetical">Sort Alphabetically</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={`grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr`}>
                {paginatedProducts.map((product, index) => {
                  const isFirstBatch = index < 9;
                  return (
                    <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: isFirstBatch ? index * 0.03 : 0 }} className="min-w-0 flex flex-col">
                      <ProductCard product={product} />
                    </motion.div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Prev</button>
                  {(() => { const pages = []; const maxPagesToShow = 5; let startPage = Math.max(1, currentPage - 2); let endPage = Math.min(totalPages, currentPage + 2); if (currentPage <= 3) { endPage = Math.min(totalPages, maxPagesToShow); } else if (currentPage >= totalPages - 2) { startPage = Math.max(1, totalPages - maxPagesToShow + 1); } if (startPage > 1) { pages.push(<button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>1</button>); if (startPage > 2) { pages.push(<span key="start-ellipsis" className="px-2">...</span>); } } for (let page = startPage; page <= endPage; page++) { pages.push(<button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === page ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{page}</button>); } if (endPage < totalPages) { if (endPage < totalPages - 1) { pages.push(<span key="end-ellipsis" className="px-2">...</span>); } pages.push(<button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{totalPages}</button>); } return pages; })()}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>Next</button>
                </div>
              )}
              {productsToShow.length === 0 && (
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col" style={{ minHeight: '420px' }}>
                      <div className="w-full h-64 bg-gray-200" />
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3"><div className="h-4 bg-gray-200 rounded w-1/2 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/3 mb-2" /><div className="h-3 bg-gray-200 rounded w-2/3 mb-2" /><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /></div>
                        <div className="mt-4 flex items-center gap-2"><div className="h-8 w-20 bg-gray-200 rounded" /><div className="h-8 w-16 bg-gray-200 rounded" /></div>
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

export default Products;



