// 
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Product } from "../../types";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react"; // Added ChevronDown
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../stores/useAuthStore";
import { useCartStore } from "../../stores/useCartStore";
import { useWishlistStore } from "../../stores/useWishlistStore";
import { API_BASE_URL } from "../../api/config";
// import { CgProductHunt } from "react-icons/cg"; // Unused import removed for cleanliness

import { FaWhatsapp } from 'react-icons/fa';




const PRIMARY_COLOR_TEXT = "text-blue-900";
const SECONDARY_COLOR_TEXT = "text-blue-800";
const ACCENT_COLOR_HOVER = "hover:text-blue-900";
const ACCENT_BG = "bg-blue-700";
const BG_COLOR_LIGHT = "bg-white";

const ACTIVE_LINK_CLASSES = `${PRIMARY_COLOR_TEXT} font-bold border-b-2 border-blue-700 pb-1`;
const INACTIVE_LINK_CLASSES = `${SECONDARY_COLOR_TEXT} font-semibold ${ACCENT_COLOR_HOVER} hover:border-b-2 hover:border-blue-300 pb-1`;

// Define Shop Categories
const shopCategories = [
  { name: "Peel-n-Stick", href: "/peel-n-stick" },
  { name: "Wallpaper Rolls", href: "/wallroll" },
  { name: "Customised Wallpapers", href: "/wallpapers" },
  {name:"Luxe Collections",href:"/luxe"} // Added an extra one for layout balance
];

const navigation = [
  { name: "Bestsellers", href: "/bestsellers" },
  { name: "Custom Design", href: "/custom-design" },
  { name: "About Us", href: "/about" },
];

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // New States for Shop Dropdowns
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isMobileShopExpanded, setIsMobileShopExpanded] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { user, logout } = useAuthStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const { getTotalItems: getWishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      const timer = setTimeout(() => {
        fetch(`${API_BASE_URL}/api/products`)
          .then((r) => r.json())
          .then((data) => setAllProducts(data))
          .catch((err) =>
            console.error("Failed to fetch products for search:", err)
          );
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isSearchOpen, allProducts.length]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue.trim() && allProducts.length > 0) {
        const q = searchValue.trim().toLowerCase();
        setSearchResults(
          allProducts
            .filter(
              (product) =>
                product.name?.toLowerCase().includes(q) ||
                product.description?.toLowerCase().includes(q) ||
                product.category?.toLowerCase().includes(q)
            )
            .slice(0, 4)
        );
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [searchValue, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node) &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSearch = () => {
    if (searchValue.trim()) {
      setIsSearchOpen(false);
      navigate(`/wallpapers?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  const navigateAndClose = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsMobileShopExpanded(false);
  };

  const getLinkClasses = (href: string) => {
    if (
      location.pathname === href ||
      (href !== "/" && location.pathname.startsWith(href))
    ) {
      return ACTIVE_LINK_CLASSES;
    }
    return INACTIVE_LINK_CLASSES;
  };

  return (
    <>
      {/* Announcement Banner */}
      <div className="w-full z-50 flex">
        <div
          className="relative w-full h-8 flex items-center overflow-hidden"
          style={{ background: "#1d4ed8" }}
        >
          <div className="flex-1 h-full flex items-center justify-center">
            <div
              className="whitespace-nowrap font-medium text-sm animate-marquee px-4 text-white"
              style={{
                animation: "marquee 19s linear infinite",
                minWidth: "100%",
              }}
            >
              FREE Customisation & Installation Support | FREE Shipping on
              Orders &gt; Rs. 3999

              
            </div>
            
          </div>
          
        </div>
        <div className="bg-green-500 h-8 w-20 flex justify-center
          items-center gap-2"> <FaWhatsapp></FaWhatsapp><a href="https://wa.me/919999999999" className="text-white font-500">Order</a></div>
      </div>
      {/* Main Navbar */}
      <nav className={`${BG_COLOR_LIGHT} border-b w-full h-18 border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="Nagomi"
                className="h-14 w-auto filter drop-shadow-sm"
              />
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8">
              
              {/* --- NEW SHOP NOW DROPDOWN --- */}
              <div 
                className="relative group h-full flex items-center"
                onMouseEnter={() => setIsShopHovered(true)}
                onMouseLeave={() => setIsShopHovered(false)}
              >
                <button 
                  className={`flex items-center gap-1 text-base tracking-wide transition-colors ${INACTIVE_LINK_CLASSES} border-none`}
                >
                  Shop Now
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isShopHovered ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isShopHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      {shopCategories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.href}
                          className={`block px-4 py-3 text-sm ${SECONDARY_COLOR_TEXT} hover:bg-blue-50 hover:text-blue-900 transition-colors`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* --- END SHOP NOW DROPDOWN --- */}

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base tracking-wide transition-colors ${getLinkClasses(
                    item.href
                  )}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side icons & Mobile Menu Toggle */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 ${SECONDARY_COLOR_TEXT} ${ACCENT_COLOR_HOVER} transition-colors`}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Wishlist Button (Hidden on XS/S mobile screens) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={useWishlistStore.getState().toggleWishlist}
                className={`relative p-2 hidden sm:flex ${SECONDARY_COLOR_TEXT} ${ACCENT_COLOR_HOVER} transition-colors`}
              >
                <Heart className="w-5 h-5" />
                {getWishlistItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-1 -right-1 ${ACCENT_BG} text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold`}
                  >
                    {getWishlistItems()}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className={`relative p-2 ${SECONDARY_COLOR_TEXT} ${ACCENT_COLOR_HOVER} transition-colors`}
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-1 -right-1 ${ACCENT_BG} text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold`}
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>

              {/* User/Profile Dropdown */}
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className={`p-2 ${SECONDARY_COLOR_TEXT} ${ACCENT_COLOR_HOVER} transition-colors focus:outline-none`}
                >
                  <User className="w-5 h-5" />
                </button>
                {/* Profile dropdown content */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      ref={profileDropdownRef}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-3"
                    >
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className={`absolute top-2 right-2 p-1 rounded-full ${SECONDARY_COLOR_TEXT} hover:bg-blue-50 ${ACCENT_COLOR_HOVER}`}
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {user ? (
                        <div className="flex flex-col gap-1">
                          <div
                            className={`font-bold ${PRIMARY_COLOR_TEXT} truncate mb-2 border-b border-gray-100 pb-2 pr-6`}
                          >
                            Hello, {user.name.split(" ")[0]}
                          </div>
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className={`block w-full text-left text-sm ${SECONDARY_COLOR_TEXT} hover:text-blue-900 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors`}
                          >
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className={`block w-full text-left text-sm ${SECONDARY_COLOR_TEXT} hover:text-blue-900 hover:bg-blue-50 py-2 px-3 rounded-lg transition-colors`}
                          >
                            My Orders
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="mt-2 w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Logout
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 pt-6">
                          <Link
                            to="/login"
                            onClick={() => setIsProfileOpen(false)}
                            className={`w-full text-center ${ACCENT_BG} text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition`}
                          >
                            Log in
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsProfileOpen(false)}
                            className={`w-full text-center text-sm ${SECONDARY_COLOR_TEXT} hover:underline`}
                          >
                            Create Account
                          </Link>

                          <div className="border-t border-gray-100 my-2"></div>
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className={`w-full text-center text-sm ${SECONDARY_COLOR_TEXT} hover:underline`}
                          >
                            Admin Panel
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MOBILE HAMBURGER MENU BUTTON */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 ${SECONDARY_COLOR_TEXT} ${ACCENT_COLOR_HOVER} transition-colors`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-stone-50 border-t border-gray-100 shadow-inner z-40 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 space-y-2">
              
              {/* --- MOBILE SHOP NOW EXPANDABLE --- */}
              <div>
                <button
                  onClick={() => setIsMobileShopExpanded(!isMobileShopExpanded)}
                  className={`flex items-center justify-between w-full text-left py-2 px-3 text-lg font-medium transition-colors rounded-lg text-blue-900 hover:bg-blue-50`}
                >
                  Shop Now
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isMobileShopExpanded ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isMobileShopExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-6 space-y-1 overflow-hidden"
                    >
                       {shopCategories.map((category) => (
                          <button
                            key={category.name}
                            onClick={() => navigateAndClose(category.href)}
                            className="block w-full text-left py-2 px-3 text-base text-blue-800 hover:text-blue-900"
                          >
                            {category.name}
                          </button>
                       ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* --- END MOBILE SHOP NOW --- */}

              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigateAndClose(item.href)}
                  className={`block w-full text-left py-2 px-3 text-lg font-medium transition-colors rounded-lg
                    ${
                      location.pathname === item.href ||
                      (item.href !== "/" &&
                        location.pathname.startsWith(item.href))
                        ? "bg-blue-100 text-blue-800 font-bold"
                        : "text-blue-900 hover:bg-blue-50"
                    }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => {
                  useWishlistStore.getState().toggleWishlist();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full text-left py-2 px-3 ${PRIMARY_COLOR_TEXT} text-lg font-medium hover:bg-blue-50 rounded-lg transition-colors`}
              >
                <Heart className="w-5 h-5 mr-2" /> Wishlist (
                {getWishlistItems()})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4 border-b border-gray-200 pb-3">
                <Search className={`w-6 h-6 ${SECONDARY_COLOR_TEXT}`} />
                <input
                  type="text"
                  placeholder="Search wallpapers and wall art..."
                  className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSearch}
                  className={`p-2 rounded-full ${ACCENT_COLOR_HOVER} transition-colors`}
                >
                  <Search className={`w-5 h-5 ${PRIMARY_COLOR_TEXT}`} />
                </motion.button>
              </div>
              {searchValue && (
                <div className="mt-4 pt-2 min-h-[120px]">
                  {allProducts.length === 0 ? (
                    <div className="flex justify-center items-center h-20 text-blue-700">
                      <svg
                        className="animate-spin h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id || product.id}
                          to={`${product.category}/${product._id || product.id}`}
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <div className="flex items-center space-x-4 p-2 hover:bg-blue-50 rounded-lg transition">
                            <img
                              src={`${API_BASE_URL}${product.images[0]}` || "/logo.png"}
                              alt={product.name}
                              className="h-14 w-14 object-cover rounded-md flex-shrink-0 border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-base font-semibold ${PRIMARY_COLOR_TEXT} truncate`}
                              >
                                {product.name}
                              </div>
                              <div
                                className={`text-sm ${SECONDARY_COLOR_TEXT} truncate`}
                              >
                                {product.category}
                              </div>
                            </div>
                            <span className="text-xs text-blue-700 font-bold flex-shrink-0">
                              VIEW
                            </span>
                          </div>
                        </Link>
                      ))}
                      <Link
                        to={`/${allProducts.category}?search=${encodeURIComponent(
                          searchValue.trim()
                        )}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="block w-full text-center text-sm font-semibold text-blue-700 hover:text-blue-900 pt-2 border-t mt-2"
                      >
                        View All Results for "{searchValue}" &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No matching products found. Try a different term.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;