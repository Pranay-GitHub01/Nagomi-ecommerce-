import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import { API_BASE_URL } from "../api/config";
import { motion } from "framer-motion";

import { useRef } from "react";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    title: "Elegant Living Spaces",
    description: "Transform your home with our handcrafted furniture collections",
    cta: "Explore Collection"
  },
  {
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    title: "Artisan Craftsmanship",
    description: "Each piece tells a story of tradition and innovation",
    cta: "Discover Our Process"
  },
  {
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    title: "Sustainable Luxury",
    description: "Eco-friendly materials meet timeless design",
    cta: "Shop Sustainable"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topPicksScroll, setTopPicksScroll] = useState(6); // Start with 7th card (index 6) to show it as half on left
  const [transformScroll, setTransformScroll] = useState(6); // Start with 7th card (index 6) to show it as half on left
  const [testimonialsScroll, setTestimonialsScroll] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const topPicksContainerRef = useRef<HTMLDivElement>(null);
  const transformContainerRef = useRef<HTMLDivElement>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement>(null);
  // Removed unused navigate
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Pick bestsellers or first 15 products as demo
  const bestsellers: Product[] = products.filter((p) => p.bestseller).slice(0, 15);
  const fallback: Product[] = products.slice(0, 15);
  const featured: Product[] = useMemo(() => {
    return bestsellers.length > 0 ? bestsellers : fallback;
  }, [bestsellers, fallback]);

  // For Top Picks, pick 15 products that are not in featured
  const topPicks: Product[] = useMemo(() => {
    return products.filter((p) => !featured.includes(p)).slice(0, 15);
  }, [products, featured]);

  // Add category data for 'Shop by Category' section
  const shopCategories = [
    {
      name: 'Premium Wallpapers',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400',
    },
    {
      name: 'Designer Walls',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400',
    },
    {
      name: 'Signature Art',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400',
    },
    {
      name: 'Wall Muralists',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400',
    },
  ];

  const testimonials = [
    {
      name: 'Aarav Mehta',
      review: 'The transformation was magical! My living room feels like a luxury hotel now. Highly recommend Nagomi for anyone looking to elevate their space.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      stars: 5
    },
    {
      name: 'Saanvi Sharma',
      review: 'Absolutely in love with the Signature Art collection. The quality and detail are unmatched. The team was so helpful throughout the process!',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      stars: 5
    },
    {
      name: 'Kabir Singh',
      review: 'From consultation to installation, everything was seamless. The Designer Walls are a conversation starter for every guest!',
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
      stars: 5
    },
    {
      name: 'Mira Kapoor',
      review: 'Nagomi turned my bedroom into a tranquil retreat. The muralists are true artists. I wake up inspired every day!',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      stars: 5
    },
    {
      name: 'Riya Patel',
      review: 'The Premium Wallpapers collection exceeded all expectations. The texture and colors are absolutely stunning. My dining room is now the highlight of my home!',
      image: 'https://randomuser.me/api/portraits/women/23.jpg',
      stars: 5
    },
    {
      name: 'Vikram Malhotra',
      review: 'Professional service from start to finish. The installation team was punctual, skilled, and left my space spotless. The wall mural is breathtaking!',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      stars: 5
    },
    {
      name: 'Priya Gupta',
      review: 'I was skeptical about wall murals, but Nagomi proved me wrong. The quality is exceptional and the design perfectly matches my aesthetic. Love it!',
      image: 'https://randomuser.me/api/portraits/women/67.jpg',
      stars: 5
    },
    {
      name: 'Arjun Reddy',
      review: 'The custom design service is incredible. They took my vision and made it reality. The attention to detail is remarkable. Worth every penny!',
      image: 'https://randomuser.me/api/portraits/men/89.jpg',
      stars: 5
    }
  ];

  // Infinite array for Top Picks
  const topPicksInfinite = useMemo(() => {
    if (topPicks.length === 0) return [];
    return [topPicks[topPicks.length - 1], ...topPicks, topPicks[0]];
  }, [topPicks]);
  // Infinite array for Transform section
  const featuredInfinite = useMemo(() => {
    if (featured.length === 0) return [];
    return [featured[featured.length - 1], ...featured, featured[0]];
  }, [featured]);

  // Infinite array for testimonials
  const testimonialsInfinite = useMemo(() => {
    if (testimonials.length === 0) return [];
    return [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]];
  }, [testimonials]);

  // State for Top Picks scroll, start at 1
  useEffect(() => { setTopPicksScroll(1); }, [topPicks.length]);
  // State for Transform scroll, start at 1
  useEffect(() => { setTransformScroll(1); }, [featured.length]);

  // Seamless reset for Top Picks (forward and backward)
  useEffect(() => {
    if (topPicksScroll === topPicksInfinite.length - 1) {
      setTimeout(() => {
        const container = topPicksContainerRef.current;
        if (container) {
          container.style.transition = 'none';
          scrollToCard(1);
          setTopPicksScroll(1);
          setTimeout(() => {
            if (container) container.style.transition = '';
          }, 50);
        }
      }, 700);
    } else if (topPicksScroll === 0) {
      setTimeout(() => {
        const container = topPicksContainerRef.current;
        if (container) {
          container.style.transition = 'none';
          scrollToCard(topPicksInfinite.length - 2);
          setTopPicksScroll(topPicksInfinite.length - 2);
          setTimeout(() => {
            if (container) container.style.transition = '';
          }, 50);
        }
      }, 700);
    }
  }, [topPicksScroll, topPicksInfinite.length]);

  // Update scroll position when topPicksScroll changes
  useEffect(() => {
    if (topPicksInfinite.length > 0) {
      scrollToCard(topPicksScroll);
    }
  }, [topPicksScroll, topPicksInfinite.length]);

  // Seamless reset for Transform section (forward and backward)
  useEffect(() => {
    if (transformScroll === featuredInfinite.length - 1) {
      setTimeout(() => {
        const container = transformContainerRef.current;
        if (container) {
          container.style.transition = 'none';
          scrollToTransformCard(1);
          setTransformScroll(1);
          setTimeout(() => {
            if (container) container.style.transition = '';
          }, 50);
        }
      }, 700);
    } else if (transformScroll === 0) {
      setTimeout(() => {
        const container = transformContainerRef.current;
        if (container) {
          container.style.transition = 'none';
          scrollToTransformCard(featuredInfinite.length - 2);
          setTransformScroll(featuredInfinite.length - 2);
          setTimeout(() => {
            if (container) container.style.transition = '';
          }, 50);
        }
      }, 700);
    }
  }, [transformScroll, featuredInfinite.length]);

  // Update scroll position when transformScroll changes
  useEffect(() => {
    if (featuredInfinite.length > 0) {
      scrollToTransformCard(transformScroll);
    }
  }, [transformScroll, featuredInfinite.length]);

  // Auto-slide Testimonials section
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setTestimonialsScroll((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Seamless reset for Testimonials (forward and backward)
  useEffect(() => {
    if (testimonialsScroll === testimonialsInfinite.length - 1) {
      setTimeout(() => {
        const container = testimonialsContainerRef.current;
        if (container) {
          container.style.transition = 'none';
          scrollToTestimonials(1);
          setTestimonialsScroll(1);
          setTimeout(() => {
            if (container) container.style.transition = '';
          }, 50);
        }
      }, 700);
    } else if (testimonialsScroll === 0) {
      setTimeout(() => {
        const container = testimonialsContainerRef.current;
        if (container) {
          container.style.transition = 'none';
          scrollToTestimonials(testimonialsInfinite.length - 2);
          setTestimonialsScroll(testimonialsInfinite.length - 2);
          setTimeout(() => {
            if (container) container.style.transition = '';
          }, 50);
        }
      }, 700);
    }
  }, [testimonialsScroll, testimonialsInfinite.length]);

  // Update scroll position when testimonialsScroll changes
  useEffect(() => {
    if (testimonialsInfinite.length > 0) {
      scrollToTestimonials(testimonialsScroll);
    }
  }, [testimonialsScroll, testimonialsInfinite.length]);

  // Auto-slide Top Picks section
  useEffect(() => {
    if (topPicksInfinite.length === 0) return;
    const interval = setInterval(() => {
      setTopPicksScroll((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [topPicksInfinite.length]);

  // Auto-slide Transform Your Space Today section
  useEffect(() => {
    if (featuredInfinite.length === 0) return;
    const interval = setInterval(() => {
      setTransformScroll((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredInfinite.length]);

  // Manual navigation functions
  const goToNext = () => {
    setTopPicksScroll((prev) => prev + 1);
  };

  const goToPrev = () => {
    setTopPicksScroll((prev) => Math.max(0, prev - 1));
  };

  // Manual navigation functions for Transform section
  const goToTransformNext = () => {
    setTransformScroll((prev) => prev + 1);
  };

  const goToTransformPrev = () => {
    setTransformScroll((prev) => Math.max(0, prev - 1));
  };

  // Scroll to specific card
  const scrollToCard = (index: number) => {
    const container = topPicksContainerRef.current;
    if (container) {
      const cardWidth = 320; // w-80 = 320px
      const gap = 16; // px-2 = 16px
      const translateX = -index * (cardWidth + gap);
      container.style.transform = `translateX(${translateX}px)`;
    }
  };

  // Scroll to specific card for Transform section
  const scrollToTransformCard = (index: number) => {
    const container = transformContainerRef.current;
    if (container) {
      const cardWidth = 320; // w-80 = 320px
      const gap = 16; // px-2 = 16px
      const translateX = -index * (cardWidth + gap);
      container.style.transform = `translateX(${translateX}px)`;
    }
  };

  // Scroll to specific card for Testimonials section
  const scrollToTestimonials = (index: number) => {
    const container = testimonialsContainerRef.current;
    if (container) {
      const cardWidth = container.offsetWidth;
      const gap = 0;
      const translateX = -index * (cardWidth + gap);
      container.style.transform = `translateX(${translateX}px)`;
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => setProducts(data));
  }, []);



  return (
    <div className="flex flex-col min-h-screen w-full bg-[#d9d9d9]">
      {/* Minimalist Hero Section with Moving Images */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center h-[70vh] min-h-[400px] w-full bg-gradient-to-br from-blue-100 via-blue-200 to-white animate-gradient-move"
      >
        {/* Animated hero image slider in the background */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 z-0 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={idx !== currentSlide}
          >
            <img
              src={slide.image}
              alt="Hero background"
              className="w-full h-full object-cover object-center scale-105 blur-sm brightness-90"
              draggable="false"
            />
            <div className="absolute inset-0 bg-blue-900/30" />
        </div>
        ))}
        {/* Glassmorphism overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4"
        >
          <div className="backdrop-blur-md bg-white/60 rounded-3xl shadow-xl px-8 py-10 max-w-2xl mx-auto flex flex-col items-center animate-fade-slide-in">
            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-serif text-4xl md:text-6xl font-bold text-blue-900 mb-4 text-center tracking-tight animate-fade-slide-in"
            >
              Transform Your Space with Nagomi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-sans text-lg md:text-2xl text-blue-700 mb-8 text-center animate-fade-slide-in delay-200"
            >
              Minimalist, modern, and soothing wallpapers for every mood. Discover the art of tranquility.
            </motion.p>
            <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-300 focus:outline-none"
              style={{ boxShadow: '0 4px 32px 0 rgba(37, 99, 235, 0.10)' }}
              onClick={() => navigate('/wallpapers')}
            >
              Explore Designs
            </motion.button>
          </div>
        </motion.div>
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-blue-600' : 'bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Shop by Category Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="py-12 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative">
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
          <div className="pt-8 pb-12 px-8">
            <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-left mb-12 text-blue-900 tracking-tight relative"
            >
              Shop by Category
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
              {shopCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white group-hover:border-blue-300 transition-all duration-300"
                      />
                      {/* Animated 'New' badge for first category */}
                      {i === 0 && (
                        <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
                          New
                        </span>
                      )}
                    </div>
                    <Link to={
                      cat.name === 'Signature Art' ? '/wallart' :
                      cat.name === 'Premium Wallpapers' ? '/wallpapers' :
                      `/wallpapers?category=${encodeURIComponent(cat.name)}`
                    } className="absolute inset-0 rounded-full" tabIndex={-1} aria-label={`Go to ${cat.name}`}></Link>
                  </div>
                  <span className="mt-6 text-lg font-semibold text-blue-800 text-center">
                    {cat.name}
                  </span>
          </motion.div>
            ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Top Picks Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="py-12 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative">
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
          <div className="pt-8 pb-12 px-8">
            <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-left mb-12 text-blue-900 tracking-tight relative"
            >
              Top Picks: Watch & Shop
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>
            </motion.h3>
            {/* Top Picks: Watch & Shop */}
            <section className="py-12">
              <div className="max-w-7xl mx-auto px-4">

                <div className="relative max-w-4xl mx-auto">
                  {/* Main Carousel Container */}
                  <div className="relative overflow-hidden">
                    <div className="flex justify-center">
                      <div className="w-80">
                        <div ref={topPicksContainerRef} className="flex transition-transform duration-700 ease-in-out">
                          {/* Original cards */}
                          {topPicksInfinite.map((product: Product, i) => (
                            <div key={`${product._id || product.id}-${i}`} className="flex-shrink-0 w-80 px-2">
                              <div className="block group w-full">
                                <Link
                                  to={`/wallpapers/${product._id || product.id}`}
                                  tabIndex={0}
                                  aria-label={`View details for ${product.name}`}
                                >
                                  <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 overflow-hidden group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
                                    {/* Video/Image Section */}
                                    <div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
                                      {product.bestseller && (
                                        <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-tl-xl rounded-br-xl text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                                          Bestseller
                                        </span>
                                      )}
                                      {/* Play button overlay for video */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                                          <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                          </svg>
                                        </div>
                                      </div>
                                      <img
                                        src={Array.isArray(product.images) && product.images.length > 0 ? `/images/${product.images[0].split('/').pop()}` : '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                    {/* Product Info Section */}
                                    <div className="p-4">
                                      <h4 className="font-bold text-lg text-blue-900 mb-2 text-center line-clamp-2 font-seasons">{product.name}</h4>
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="text-xl font-bold text-blue-700">₹99 per square feet</span>
                                        {product.originalPrice && (
                                          <span className="text-base text-blue-300 line-through">₹120 per square feet</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          ))}
                          {/* Duplicated cards for infinite scroll */}
                          {topPicksInfinite.map((product: Product, i) => (
                            <div key={`${product._id || product.id}-duplicate-${i}`} className="flex-shrink-0 w-80 px-2">
                              <div className="block group w-full">
                                <Link
                                  to={`/wallpapers/${product._id || product.id}`}
                                  tabIndex={0}
                                  aria-label={`View details for ${product.name}`}
                                >
                                  <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 overflow-hidden group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
                                    {/* Video/Image Section */}
                                    <div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
                                      {product.bestseller && (
                                        <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-tl-xl rounded-br-xl text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                                          Bestseller
                                        </span>
                                      )}
                                      {/* Play button overlay for video */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                                          <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                          </svg>
                                        </div>
                                      </div>
                                      <img
                                        src={Array.isArray(product.images) && product.images.length > 0 ? `/images/${product.images[0].split('/').pop()}` : '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                    {/* Product Info Section */}
                                    <div className="p-4">
                                      <h4 className="font-bold text-lg text-blue-900 mb-2 text-center line-clamp-2 font-seasons">{product.name}</h4>
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="text-xl font-bold text-blue-700">₹99 per square feet</span>
                                        {product.originalPrice && (
                                          <span className="text-base text-blue-300 line-through">₹120 per square feet</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                      aria-label="Previous slide"
                    >
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                      aria-label="Next slide"
                    >
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                </div>
            </div>
            </section>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative py-12 px-4 w-full bg-white"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* New Promotional Banner */}
          <div className="relative flex justify-center w-full mb-12 animate-fade-slide-in">
            <div className="w-full bg-[#f5f5dc] shadow-lg overflow-hidden">
              {/* Web Version */}
              <div className="hidden md:flex items-center justify-between px-8 py-12">
                {/* Left Section */}
                <div className="flex-1 text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1428a0] font-seasons leading-tight">
                    <span className="block">Why choose</span>
                    <span className="block">Nagomi?</span>
                  </h2>
                </div>
                
                {/* Middle Section - Three Icons */}
                <div className="flex-1 flex justify-center items-center gap-8">
                  {/* Assured Quality */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#1428a0] font-lora text-center">Assured quality</span>
                  </div>
                  
                  {/* Custom Fit */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#1428a0] font-lora text-center">Custom Fit</span>
                  </div>
                  
                  {/* Non-toxic & VOC Free */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#1428a0] font-lora text-center">Non-toxic & VOC Free</span>
                  </div>
                </div>
                
                {/* Right Section */}
                <div className="flex-1 text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1428a0] font-seasons leading-tight">
                    <span className="block">Quality meets</span>
                    <span className="block">Personality</span>
                  </h2>
                </div>
              </div>
              
              {/* Mobile Version */}
              <div className="md:hidden flex flex-col items-center px-6 py-8">
                {/* Top Section */}
                <div className="w-full text-center mb-6">
                  <h2 className="text-3xl font-bold text-[#1428a0] font-seasons leading-tight">
                    <span className="block">Quality meets</span>
                    <span className="block">Personality</span>
                  </h2>
                </div>
                
                {/* Bottom Section - Three Icons */}
                <div className="w-full flex justify-center items-center gap-6">
                  {/* Assured Quality */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-[#1428a0] font-lora text-center">Assured quality</span>
                  </div>
                  
                  {/* Custom Fit */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-[#1428a0] font-lora text-center">Custom Fit</span>
                  </div>
                  
                  {/* Non-toxic & VOC Free */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-[#1428a0] font-lora text-center">Non-toxic & VOC Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Move heading here */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-4xl font-bold text-center text-primary-600 mb-10 flex items-center justify-center gap-2"
          >
            <span className="text-3xl animate-heartbeat">♥</span> From Our Customers
          </motion.h3>
          <div className="relative overflow-hidden mb-12 w-full">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl"> {/* Centered container */}
                <div ref={testimonialsContainerRef} className="flex transition-transform duration-700 ease-in-out">
                  {testimonialsInfinite.map((t, i) => (
                    <div key={`${t.name}-${i}`} className="flex flex-col items-center bg-white shadow px-8 md:px-16 py-8 md:py-12 flex-shrink-0 w-full min-h-[260px] md:min-h-[320px] rounded-2xl">
                      <div className="flex flex-col items-center w-full">
                        {/* Installation Photo */}
                        <div className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-16 h-16 text-blue-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-blue-400 text-sm font-lora">Installation Photo Placeholder</p>
                          </div>
                        </div>
                        
                        {/* Quote Icon */}
                        <div className="flex justify-center mb-4">
                          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 7h.01M15 7h.01M7 11h10M7 15h10" strokeLinecap="round" strokeLinejoin="round"/>
                            <text x="2" y="20" fontSize="24" fill="#3b82f6" fontFamily="serif">"</text>
                          </svg>
                        </div>
                        
                        {/* Review Text */}
                        <div className="text-gray-700 text-lg text-center font-lora mb-4">{t.review}</div>
                        
                        {/* Customer Name */}
                        <div className="font-bold text-blue-900 text-base text-center mb-2 font-seasons">{t.name}</div>
                        
                        {/* Star Rating */}
                        <div className="flex justify-center">
                          {[...Array(t.stars)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      
                      {/* Decorative Line */}
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-6 mx-auto" />
                    </div>
                  ))}
          </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Transform Your Space Today Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="py-12 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative">
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
          <div className="pt-8 pb-12 px-8">
            <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-left mb-10 text-blue-900 tracking-tight relative font-seasons"
              >
              Transform Your Space Today
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>
            </motion.h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="relative overflow-hidden">
                <div className="flex justify-center">
                  <div className="w-80">
                    <div ref={transformContainerRef} className="flex transition-transform duration-700 ease-in-out">
                      {/* Original cards */}
                      {featuredInfinite.map((product: Product, i) => (
                        <div key={`${product._id || product.id}-${i}`} className="flex-shrink-0 w-80 px-2">
                          <div className="block group w-full">
                            <Link
                              to={`/products/${product._id || product.id}`}
                              tabIndex={0}
                              aria-label={`View details for ${product.name}`}
                            >
                              <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
                                <div className="w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center mb-4 relative">
                                  {product.bestseller && (
                                    <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                                      Bestseller
                                    </span>
                                  )}
                                  <img
                                    src={Array.isArray(product.images) && product.images.length > 0 ? `/images/${product.images[0].split('/').pop()}` : '/placeholder.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2 text-center line-clamp-2">{product.name}</h4>
                                <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">{product.description || 'No description'}</p>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl font-bold text-blue-700">₹99 per square feet</span>
                                  {product.originalPrice && (
                                    <span className="text-base text-blue-300 line-through">₹120 per square feet</span>
                                  )}
                                </div>
                                <span className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm shadow-sm">
                                  Buy Now
                                </span>
                              </div>
                            </Link>
                          </div>
          </div>
                      ))}
                      {/* Duplicated cards for infinite scroll */}
                      {featuredInfinite.map((product: Product, i) => (
                        <div key={`${product._id || product.id}-duplicate-${i}`} className="flex-shrink-0 w-80 px-2">
                          <div className="block group w-full">
                            <Link
                              to={`/products/${product._id || product.id}`}
                              tabIndex={0}
                              aria-label={`View details for ${product.name}`}
                            >
                              <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
                                <div className="w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center mb-4 relative">
                                  {product.bestseller && (
                                    <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                                      Bestseller
                                    </span>
                                  )}
                                  <img
                                    src={Array.isArray(product.images) && product.images.length > 0 ? `/images/${product.images[0].split('/').pop()}` : '/placeholder.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2 text-center line-clamp-2">{product.name}</h4>
                                <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">{product.description || 'No description'}</p>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl font-bold text-blue-700">₹99 per square feet</span>
                                  {product.originalPrice && (
                                    <span className="text-base text-blue-300 line-through">₹120 per square feet</span>
                                  )}
                                </div>
                                <span className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm shadow-sm">
                                  Buy Now
                                </span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button onClick={goToTransformPrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10" aria-label="Previous slide">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={goToTransformNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10" aria-label="Next slide">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </motion.section>


    </div>
  );
}




