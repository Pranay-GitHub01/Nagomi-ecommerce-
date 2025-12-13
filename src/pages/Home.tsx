import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product, Review } from "../types";
import { API_BASE_URL } from "../api/config";
import { motion } from "framer-motion";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    title: "Elegant Living Spaces",
    description:
      "Transform your home with our handcrafted furniture collections",
    cta: "Explore Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    title: "Artisan Craftsmanship",
    description: "Each piece tells a story of tradition and innovation",
    cta: "Discover Our Process",
  },
  {
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    title: "Sustainable Luxury",
    description: "Eco-friendly materials meet timeless design",
    cta: "Shop Sustainable",
  },
];

// --- Hardcoded Reviews Data ---
const reviewsData: Review[] = [
  {
    _id: "revAnkita",
    author: "Ankita Bali",
    rating: 5,
    createdAt: "2025-10-23T10:00:00Z",
    comment:
      "Absolutely loved the wallpaper we got from Nagomi! The design was elegant, the installation was seamless, and the team was incredibly friendly and helpful throughout. Highly recommend them for anyone looking to transform their walls beautifully.",
    images: ["/reviews/Ankita Bali/your_image_filename1.webp"],
    verifiedPurchase: true,
    title: "Elegant Design!",
  },
  {
    _id: "revAditya",
    author: "Aditya Agrawal",
    rating: 5,
    createdAt: "2025-10-22T10:00:00Z",
    comment:
      "Got a complete makeover done with Nagomi wallpaper and mouldings. The results are top-notch. Their design inputs were really thoughtful and I highly recommend their service.",
    images: ["/reviews/Aditya Agrawal/actual_image_name.png"],
    verifiedPurchase: true,
    title: "Top-Notch Makeover",
  },
  {
    _id: "revAshmit",
    author: "Ashmit Bhandari",
    rating: 5,
    createdAt: "2025-10-14T10:00:00Z",
    comment:
      "Nagomi helped us select and install wallpaper for our bedroom and pooja room and it has such a serene, divine vibe now. So grateful for their design suggestions.",
    images: [
      "/reviews/Ashmit Bhandari/unnamed.webp",
      "/reviews/Ashmit Bhandari/unnamed (1).webp",
    ],
    verifiedPurchase: true,
    title: "Serene Vibe",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topPicksScroll, setTopPicksScroll] = useState(1);
  const [transformScroll, setTransformScroll] = useState(1);
  const [testimonialsScroll, setTestimonialsScroll] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const topPicksContainerRef = useRef<HTMLDivElement>(null);
  const transformContainerRef = useRef<HTMLDivElement>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Hero slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products effect
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });
  }, []);

  // Derived product lists
  const bestsellers: Product[] = useMemo(
    () => products.filter((p) => p.bestseller).slice(0, 15),
    [products]
  );
  const fallback: Product[] = useMemo(() => products.slice(0, 15), [products]);
  const featured: Product[] = useMemo(() => {
    return bestsellers.length > 0 ? bestsellers : fallback;
  }, [bestsellers, fallback]);
  const topPicks: Product[] = useMemo(() => {
    return products
      .filter((p) => !featured.find((f) => f._id === p._id))
      .slice(0, 15);
  }, [products, featured]);

  // Shop categories data - UPDATED TO USE GIFs
  // MAKE SURE YOU PLACE THESE GIFS IN YOUR 'public/gifs' FOLDER
  const shopCategories = [
    {
      name: "Wallpaper Rolls",
      image: "/home vdos/wall-roll.gif",
    },
    {
      name: "Customised Wallpapers",
      image: "/home vdos/customised.gif",
    },

    {
      name: "Peel-n-Stick Collection",
      image: "/home vdos/peel-n-stick.gif",
    },
    {
      name: "Luxe Collection",
      image: "/soon", // Placeholder for future GIF
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Aarav Mehta",
      review:
        "The transformation was magical! My living room feels like a luxury hotel now. Highly recommend Nagomi for anyone looking to elevate their space.",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
    {
      name: "Saanvi Sharma",
      review:
        "Absolutely in love with the Signature Art collection. The quality and detail are unmatched. The team was so helpful throughout the process!",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
    {
      name: "Kabir Singh",
      review:
        "From consultation to installation, everything was seamless. The Designer Walls are a conversation starter for every guest!",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
    {
      name: "Mira Kapoor",
      review:
        "Nagomi turned my bedroom into a tranquil retreat. The muralists are true artists. I wake up inspired every day!",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
    {
      name: "Riya Patel",
      review:
        "The Premium Wallpapers collection exceeded all expectations. The texture and colors are absolutely stunning. My dining room is now the highlight of my home!",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
    {
      name: "Vikram Malhotra",
      review:
        "Professional service from start to finish. The installation team was punctual, skilled, and left my space spotless. The wall mural is breathtaking!",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
    {
      name: "Priya Gupta",
      review:
        "I was skeptical about wall murals, but Nagomi proved me wrong. The quality is exceptional and the design perfectly matches my aesthetic. Love it!",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
    {
      name: "Arjun Reddy",
      review:
        "The custom design service is incredible. They took my vision and made it reality. The attention to detail is remarkable. Worth every penny!",
      image: "/reviews/abhishek yadav/unnamed.webp",
      stars: 5,
    },
  ];

  // Infinite arrays for carousels
  const topPicksInfinite = useMemo(() => {
    if (topPicks.length === 0) return [];
    return [topPicks[topPicks.length - 1], ...topPicks, topPicks[0]];
  }, [topPicks]);
  const featuredInfinite = useMemo(() => {
    if (featured.length === 0) return [];
    return [featured[featured.length - 1], ...featured, featured[0]];
  }, [featured]);
  const testimonialsInfinite = useMemo(() => {
    if (testimonials.length === 0) return [];
    return [
      testimonials[testimonials.length - 1],
      ...testimonials,
      testimonials[0],
    ];
  }, [testimonials]);

  // Scroll utility function
  const scrollToItem = (
    ref: React.RefObject<HTMLDivElement>,
    index: number,
    cardWidth: number,
    gap: number
  ) => {
    const container = ref.current;
    if (container) {
      const translateX = -index * (cardWidth + gap);
      const isResetting = container.style.transition === "none 0s ease 0s";
      if (!isResetting) {
        container.style.transition = "transform 0.7s ease-in-out";
      }
      container.style.transform = `translateX(${translateX}px)`;
    }
  };

  // Effects for carousel logic
  useEffect(() => {
    if (topPicksInfinite.length <= 2) return;
    scrollToItem(topPicksContainerRef, topPicksScroll, 320, 16);

    const interval = setInterval(
      () => setTopPicksScroll((prev) => prev + 1),
      4000
    );

    if (
      topPicksScroll === topPicksInfinite.length - 1 ||
      topPicksScroll === 0
    ) {
      const timer = setTimeout(() => {
        const container = topPicksContainerRef.current;
        if (container) {
          container.style.transition = "none";
          const resetIndex =
            topPicksScroll === 0 ? topPicksInfinite.length - 2 : 1;
          scrollToItem(topPicksContainerRef, resetIndex, 320, 16);
          setTopPicksScroll(resetIndex);
          requestAnimationFrame(() => {
            if (container) container.style.transition = "";
          });
        }
      }, 700);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
    return () => clearInterval(interval);
  }, [topPicksScroll, topPicksInfinite.length]);

  useEffect(() => {
    if (featuredInfinite.length <= 2) return;
    scrollToItem(transformContainerRef, transformScroll, 320, 16);
    const interval = setInterval(
      () => setTransformScroll((prev) => prev + 1),
      4000
    );

    if (
      transformScroll === featuredInfinite.length - 1 ||
      transformScroll === 0
    ) {
      const timer = setTimeout(() => {
        const container = transformContainerRef.current;
        if (container) {
          container.style.transition = "none";
          const resetIndex =
            transformScroll === 0 ? featuredInfinite.length - 2 : 1;
          scrollToItem(transformContainerRef, resetIndex, 320, 16);
          setTransformScroll(resetIndex);
          requestAnimationFrame(() => {
            if (container) container.style.transition = "";
          });
        }
      }, 700);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
    return () => clearInterval(interval);
  }, [transformScroll, featuredInfinite.length]);

  useEffect(() => {
    if (testimonialsInfinite.length <= 2) return;
    const container = testimonialsContainerRef.current;
    const cardWidth = container?.offsetWidth || 0;
    scrollToItem(testimonialsContainerRef, testimonialsScroll, cardWidth, 0);
    const interval = setInterval(
      () => setTestimonialsScroll((prev) => prev + 1),
      4000
    );

    if (
      testimonialsScroll === testimonialsInfinite.length - 1 ||
      testimonialsScroll === 0
    ) {
      const timer = setTimeout(() => {
        if (container) {
          container.style.transition = "none";
          const resetIndex =
            testimonialsScroll === 0 ? testimonialsInfinite.length - 2 : 1;
          scrollToItem(testimonialsContainerRef, resetIndex, cardWidth, 0);
          setTestimonialsScroll(resetIndex);
          requestAnimationFrame(() => {
            if (container) container.style.transition = "";
          });
        }
      }, 700);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
    return () => clearInterval(interval);
  }, [testimonialsScroll, testimonialsInfinite.length]);

  const goToNext = () => setTopPicksScroll((prev) => prev + 1);
  const goToPrev = () => setTopPicksScroll((prev) => prev - 1);
  const goToTransformNext = () => setTransformScroll((prev) => prev + 1);
  const goToTransformPrev = () => setTransformScroll((prev) => prev - 1);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#d9d9d9]">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center h-[70vh] min-h-[400px] w-full bg-gradient-to-br from-blue-100 via-blue-200 to-white animate-gradient-move"
      >
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 z-0 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={idx !== currentSlide}
          >
            <motion.img
              src={slide.image}
              alt="Hero background"
              className="w-full h-full object-cover object-center scale-105 blur-sm brightness-90"
              draggable="false"
            />
            <div className="absolute inset-0 bg-blue-900/30" />
          </div>
        ))}
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
              Minimalist, modern, and soothing wallpapers for every mood.
              Discover the art of tranquility.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-300 focus:outline-none"
              style={{ boxShadow: "0 4px 32px 0 rgba(37, 99, 235, 0.10)" }}
              onClick={() => navigate("/wallpapers")}
            >
              Explore Designs
            </motion.button>
          </div>
        </motion.div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-blue-600" : "bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.section>

      {/* --- MERGED SECTION: Shop by Category & Top Picks --- */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="py-12 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative overflow-hidden">
          {/* --- PART 1: SHOP BY CATEGORY (White Background) --- */}
          <div className="pt-10 pb-10 px-4 md:px-8 bg-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-3xl md:text-4xl font-serif font-medium text-center text-blue-900 mb-10 tracking-tight"
            >
              Shop by Category
            </motion.h2>

            <div
              className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 md:gap-8 pb-6 md:pb-0 px-2 md:px-0 snap-x snap-mandatory justify-items-center [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {shopCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                  className="flex-shrink-0 snap-center flex flex-col items-center min-w-[130px]"
                >
                  <div className="relative group">
                    {/* Circle Icon - Updated to support GIFs via object-cover */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
                      />
                    </div>
                    <Link
                      to={
                        cat.name === "Signature Art"
                          ? "/wallart"
                          : cat.name === "Customised Wallpapers"
                          ? "/wallpapers"
                          : cat.name === "Wallpaper Rolls"
                          ? "/wallroll"
                          : cat.name === "Peel-n-Stick Collection"
                          ? "/peel-n-stick"
                          : cat.name === "Luxe Collection"
                          ? "/luxe"
                          : `/wallpapers?category=${encodeURIComponent(
                              cat.name
                            )}`
                      }
                      className="absolute inset-0 rounded-full"
                      tabIndex={-1}
                      aria-label={`Go to ${cat.name}`}
                    ></Link>
                  </div>
                  <span className="mt-4 text-base md:text-lg font-bold text-blue-900 text-center leading-tight max-w-[140px]">
                    {cat.name}
                  </span>
                </motion.div>
              ))}
            </div>
            {/* Mobile swipe hint */}
            <div className="md:hidden text-center mt-4">
              <span className="text-xs text-blue-400 font-medium animate-pulse">
                Swipe to explore &rarr;
              </span>
            </div>
          </div>

          {/* --- PART 2: TOP PICKS (Dark Blue Background) --- */}
          <div className="pt-10 pb-16 px-4 bg-[#172b9b]">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-3xl md:text-4xl font-serif font-medium text-center text-white mb-10 tracking-tight"
            >
              Top Picks: Watch & Shop
            </motion.h3>

            <section className="relative">
              <div className="max-w-7xl mx-auto px-0 md:px-4">
                <div className="relative max-w-5xl mx-auto">
                  <div className="relative overflow-hidden">
                    <div className="flex justify-center">
                      <div className="w-80">
                        <div ref={topPicksContainerRef} className="flex">
                          {topPicksInfinite.map((product: Product, i) => (
                            <div
                              key={`${product._id || product.id}-${i}`}
                              className="flex-shrink-0 w-80 px-2"
                            >
                              <div className="block group w-full">
                                <Link
                                  to={`/${product.category}/${
                                    product._id || product.id
                                  }`}
                                  tabIndex={0}
                                  aria-label={`View details for ${product.name}`}
                                >
                                  {/* Product Card - Grey placeholder style */}
                                  <div className="bg-[#d9d9d9] rounded-sm transition-all duration-300 overflow-hidden group-hover:shadow-xl transform group-hover:scale-[1.02]">
                                    <div className="w-full h-80 relative bg-gray-300">
                                      {product.bestseller && (
                                        <span className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 text-xs font-bold z-10">
                                          BESTSELLER
                                        </span>
                                      )}
                                      <img
                                        src={
                                          Array.isArray(product.images) &&
                                          product.images.length > 0
                                            ? `${API_BASE_URL}${
                                                product.images[0].startsWith(
                                                  "/"
                                                )
                                                  ? product.images[0]
                                                  : `/${product.images[0]}`
                                              }`
                                            : "/placeholder.jpg"
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-3 bg-white">
                                      <h4 className="font-bold text-base text-blue-900 truncate">
                                        {product.name}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-blue-800">
                                          ₹{product.price}
                                        </span>
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
                    {/* Navigation Buttons */}
                    <button
                      onClick={goToPrev}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 z-10"
                      aria-label="Previous slide"
                    >
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 z-10"
                      aria-label="Next slide"
                    >
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="py-12 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#172b9b] rounded-3xl shadow-xl px-6 py-12 md:px-12 md:py-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
            {/* Left Text */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                Why Choose <br /> Nagomi?
              </h2>
            </div>

            {/* Center Icons */}
            <div className="flex-[2] flex justify-center gap-8 md:gap-16 w-full md:w-auto">
              {/* Icon 1: Assured Quality */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
                  {/* Shield Icon */}
                  <img src="/assured-quality.png" alt="assured-quality" />
                </div>
                <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
                  Assured <br /> Quality
                </span>
              </div>

              {/* Icon 2: Custom Fit */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
                  {/* Expand/Fit Icon */}
                  <img src="/custom-fit-blue.png" alt="" />
                </div>
                <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
                  Custom <br /> Fit
                </span>
              </div>

              {/* Icon 3: Non-toxic */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
                  {/* Flask/Leaf Icon */}
                  <img src="/non-toxic.png" alt="" />
                </div>
                <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
                  Non-toxic & <br /> VOC Free
                </span>
              </div>
            </div>

            {/* Right Text */}
            <div className="flex-1 text-center md:text-right">
              <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                Quality <br /> Meets <br /> Personality
              </h2>
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
                    <div ref={transformContainerRef} className="flex">
                      {featuredInfinite.map((product: Product, i) => (
                        <div
                          key={`${product._id || product.id}-${i}`}
                          className="flex-shrink-0 w-80 px-2"
                        >
                          <div className="block group w-full">
                            <Link
                              to={`${product.category}/${
                                product._id || product.id
                              }`}
                              tabIndex={0}
                              aria-label={`View details for ${product.name}`}
                            >
                              <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
                                <div className="w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center mb-4 relative">
                                  {product.bestseller && (
                                    <span className="absolute top-2 left-2 bg-[#172b9b] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                                      Bestseller
                                    </span>
                                  )}
                                  <img
                                    src={
                                      Array.isArray(product.images) &&
                                      product.images.length > 0
                                        ? `${API_BASE_URL}${
                                            product.images[0].startsWith("/")
                                              ? product.images[0]
                                              : `/${product.images[0]}`
                                          }`
                                        : "/placeholder.jpg"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2 text-center line-clamp-2">
                                  {product.name}
                                </h4>
                                <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">
                                  {product.description || " "}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl font-bold text-blue-700">
                                    ₹{product.price}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-base text-blue-300 line-through">
                                      ₹{product.originalPrice.toFixed(2)}
                                    </span>
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
                <button
                  onClick={goToTransformPrev}
                  className="absolute left-0 top-1/2 transform text-bold -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                  aria-label="Previous slide"
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToTransformNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                  aria-label="Next slide"
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
