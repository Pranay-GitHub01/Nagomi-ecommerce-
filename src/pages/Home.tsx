import React, { useState, useEffect, useMemo, useRef } from "react"; // Added useRef
import { Link, useNavigate } from "react-router-dom";
import { Product, Review } from "../types"; // Make sure Review type is imported
import { API_BASE_URL } from "../api/config";
import { motion } from "framer-motion";
import ReviewSection from "../components/Reviews/ReviewSection"; // Assuming ReviewSection is imported

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

// --- Hardcoded Reviews Data with Correct Paths ---
const reviewsData: Review[] = [
  {
    _id: "revAnkita", // Example ID
    author: "Ankita Bali",
    rating: 5, // Example Rating
    createdAt: "2025-10-23T10:00:00Z", // Example Date
    comment:
      "Absolutely loved the wallpaper we got from Nagomi! The design was elegant, the installation was seamless, and the team was incredibly friendly and helpful throughout. Highly recommend them for anyone looking to transform their walls beautifully.",
    images: ["/reviews/Ankita Bali/your_image_filename1.webp"], // Replace with actual filename(s)
    verifiedPurchase: true, // Example
    title: "Elegant Design!", // Example
  },
  {
    _id: "revAditya",
    author: "Aditya Agrawal",
    rating: 5,
    createdAt: "2025-10-22T10:00:00Z",
    comment:
      "Got a complete makeover done with Nagomi wallpaper and mouldings. The results are top-notch. Their design inputs were really thoughtful and I highly recommend their service.",
    images: ["/reviews/Aditya Agrawal/actual_image_name.png"], // Replace with actual filename(s)
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
      // Paths from your folder structure
      "/reviews/Ashmit Bhandari/unnamed.webp",
      "/reviews/Ashmit Bhandari/unnamed (1).webp",
    ],
    verifiedPurchase: true,
    title: "Serene Vibe",
  },
  // ... Add ALL your other reviews here following the same pattern,
  // making sure to add _id, rating, createdAt, verifiedPurchase, title,
  // and correct image paths for each one.
];
// --- End Hardcoded Data ---

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topPicksScroll, setTopPicksScroll] = useState(1); // Start index at 1
  const [transformScroll, setTransformScroll] = useState(1); // Start index at 1
  const [testimonialsScroll, setTestimonialsScroll] = useState(1); // Start index at 1
  const [products, setProducts] = useState<Product[]>([]);
  const topPicksContainerRef = useRef<HTMLDivElement>(null);
  const transformContainerRef = useRef<HTMLDivElement>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Hero slider effect (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products effect (unchanged)
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((r) => (r.ok ? r.json() : [])) // Handle fetch error gracefully
      .then((data) => setProducts(Array.isArray(data) ? data : [])) // Ensure data is an array
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]); // Set empty on error
      });
  }, []);

  // Derived product lists (bestsellers, top picks, featured) (unchanged)
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
      .slice(0, 15); // Use find with ID
  }, [products, featured]);

  // Shop categories data (unchanged)
  const shopCategories = [
    /* ... category data ... */
    {
      name: "Customised Wallpapers",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400",
    },
    {
      name: "Signature Art",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400",
    },
    {
      name: "Wallpaper Rolls",
      image:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400",
    },
    {
      name: "Peel & Stick ",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400",
    },
    {
      name: "Luxe Collections",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400",
    },
  ];

  // Testimonials data (unchanged)
  const testimonials = [
    /* ... testimonials data ... */
    {
      name: "Aarav Mehta",
      review:
        "The transformation was magical! My living room feels like a luxury hotel now. Highly recommend Nagomi for anyone looking to elevate their space.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      stars: 5,
    },
    {
      name: "Saanvi Sharma",
      review:
        "Absolutely in love with the Signature Art collection. The quality and detail are unmatched. The team was so helpful throughout the process!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      stars: 5,
    },
    {
      name: "Kabir Singh",
      review:
        "From consultation to installation, everything was seamless. The Designer Walls are a conversation starter for every guest!",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
      stars: 5,
    },
    {
      name: "Mira Kapoor",
      review:
        "Nagomi turned my bedroom into a tranquil retreat. The muralists are true artists. I wake up inspired every day!",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      stars: 5,
    },
    {
      name: "Riya Patel",
      review:
        "The Premium Wallpapers collection exceeded all expectations. The texture and colors are absolutely stunning. My dining room is now the highlight of my home!",
      image: "https://randomuser.me/api/portraits/women/23.jpg",
      stars: 5,
    },
    {
      name: "Vikram Malhotra",
      review:
        "Professional service from start to finish. The installation team was punctual, skilled, and left my space spotless. The wall mural is breathtaking!",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      stars: 5,
    },
    {
      name: "Priya Gupta",
      review:
        "I was skeptical about wall murals, but Nagomi proved me wrong. The quality is exceptional and the design perfectly matches my aesthetic. Love it!",
      image: "https://randomuser.me/api/portraits/women/67.jpg",
      stars: 5,
    },
    {
      name: "Arjun Reddy",
      review:
        "The custom design service is incredible. They took my vision and made it reality. The attention to detail is remarkable. Worth every penny!",
      image: "https://randomuser.me/api/portraits/men/89.jpg",
      stars: 5,
    },
  ];

  // Infinite arrays for carousels (unchanged)
  const topPicksInfinite = useMemo(() => {
    /* ... */
    if (topPicks.length === 0) return [];
    return [topPicks[topPicks.length - 1], ...topPicks, topPicks[0]];
  }, [topPicks]);
  const featuredInfinite = useMemo(() => {
    /* ... */
    if (featured.length === 0) return [];
    return [featured[featured.length - 1], ...featured, featured[0]];
  }, [featured]);
  const testimonialsInfinite = useMemo(() => {
    /* ... */
    if (testimonials.length === 0) return [];
    return [
      testimonials[testimonials.length - 1],
      ...testimonials,
      testimonials[0],
    ];
  }, [testimonials]);

  // Scroll utility function (centralized)
  const scrollToItem = (
    ref: React.RefObject<HTMLDivElement>,
    index: number,
    cardWidth: number,
    gap: number
  ) => {
    const container = ref.current;
    if (container) {
      // Calculate translateX based on index, card width, and gap
      const translateX = -index * (cardWidth + gap);
      // Apply smooth transition if not resetting
      const isResetting = container.style.transition === "none 0s ease 0s"; // Check if transition is 'none'
      if (!isResetting) {
        container.style.transition = "transform 0.7s ease-in-out"; // Ensure transition is applied
      }
      container.style.transform = `translateX(${translateX}px)`;
    }
  };

  // Effects for carousel logic (seamless looping, auto-slide) (Simplified with utility)
  // Top Picks Carousel
  useEffect(() => {
    if (topPicksInfinite.length <= 2) return; // Need at least 3 items for loop logic
    scrollToItem(topPicksContainerRef, topPicksScroll, 320, 16); // Scroll on index change

    const interval = setInterval(
      () => setTopPicksScroll((prev) => prev + 1),
      4000
    ); // Auto-slide

    // Reset logic
    if (
      topPicksScroll === topPicksInfinite.length - 1 ||
      topPicksScroll === 0
    ) {
      const timer = setTimeout(() => {
        const container = topPicksContainerRef.current;
        if (container) {
          container.style.transition = "none"; // Disable transition for instant jump
          const resetIndex =
            topPicksScroll === 0 ? topPicksInfinite.length - 2 : 1;
          scrollToItem(topPicksContainerRef, resetIndex, 320, 16);
          setTopPicksScroll(resetIndex);
          // Re-enable transition after the jump
          requestAnimationFrame(() => {
            // Use requestAnimationFrame for smoother re-enable
            if (container) container.style.transition = "";
          });
        }
      }, 700); // Match transition duration
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      }; // Cleanup interval and timer
    }
    return () => clearInterval(interval); // Cleanup interval
  }, [topPicksScroll, topPicksInfinite.length]);

  // Transform Carousel (Similar logic)
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

  // Testimonials Carousel (Different width)
  useEffect(() => {
    if (testimonialsInfinite.length <= 2) return;
    const container = testimonialsContainerRef.current;
    const cardWidth = container?.offsetWidth || 0; // Get width dynamically
    scrollToItem(testimonialsContainerRef, testimonialsScroll, cardWidth, 0); // No gap
    const interval = setInterval(
      () => setTestimonialsScroll((prev) => prev + 1),
      4000
    ); // Auto-slide

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

  // Manual navigation functions (unchanged)
  const goToNext = () => setTopPicksScroll((prev) => prev + 1);
  const goToPrev = () => setTopPicksScroll((prev) => prev - 1); // No need for Math.max if looping works
  const goToTransformNext = () => setTransformScroll((prev) => prev + 1);
  const goToTransformPrev = () => setTransformScroll((prev) => prev - 1);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#d9d9d9]">
      {/* Hero Section (unchanged) */}
      <motion.section /* ... hero section JSX ... */
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
            {" "}
            <motion.img
              src={slide.image}
              alt="Hero background"
              className="w-full h-full object-cover object-center scale-105 blur-sm brightness-90"
              draggable="false"
            />{" "}
            <div className="absolute inset-0 bg-blue-900/30" />{" "}
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
              {" "}
              Transform Your Space with Nagomi{" "}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-sans text-lg md:text-2xl text-blue-700 mb-8 text-center animate-fade-slide-in delay-200"
            >
              {" "}
              Minimalist, modern, and soothing wallpapers for every mood.
              Discover the art of tranquility.{" "}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-300 focus:outline-none"
              style={{ boxShadow: "0 4px 32px 0 rgba(37, 99, 235, 0.10)" }}
              onClick={() => navigate("/wallpapers")}
            >
              {" "}
              Explore Designs{" "}
            </motion.button>
          </div>
        </motion.div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
          {" "}
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "bg-blue-600" : "bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}{" "}
        </div>
      </motion.section>

      {/* Shop by Category Section (unchanged) */}
      <motion.section /* ... shop by category JSX ... */
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
              {" "}
              Shop by Category{" "}
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>{" "}
            </motion.h2>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
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
                      {i === 0 && (
                        <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
                          {" "}
                          New{" "}
                        </span>
                      )}
                    </div>
                    <Link
                      to={
                        cat.name === "Signature Art"
                          ? "/wallart"
                          : cat.name === "Customised Wallpapers"
                          ? "/wallpapers"
                          : cat.name === "Wallpaper Rolls"
                          ? "/wallroll"
                          : cat.name === "Designer Walls"
                          ? "/peelnstick"
                          : cat.name === "Luxe Collections"
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
                  <span className="mt-6 text-lg font-semibold text-blue-800 text-center">
                    {" "}
                    {cat.name}{" "}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Top Picks Section (unchanged structure, check image paths) */}
      <motion.section /* ... top picks JSX ... */
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
              {" "}
              Top Picks: Watch & Shop{" "}
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>{" "}
            </motion.h3>
            <section className="py-12">
              <div className="max-w-7xl mx-auto px-4">
                <div className="relative max-w-4xl mx-auto">
                  <div className="relative overflow-hidden">
                    <div className="flex justify-center">
                      <div className="w-80">
                        <div ref={topPicksContainerRef} className="flex">
                          {" "}
                          {/* Removed transition class */}
                          {topPicksInfinite.map((product: Product, i) => (
                            <div
                              key={`${product._id || product.id}-${i}`}
                              className="flex-shrink-0 w-80 px-2"
                            >
                              <div className="block group w-full">
                                <Link
                                  to={`/wallpapers/${
                                    product._id || product.id
                                  }`}
                                  tabIndex={0}
                                  aria-label={`View details for ${product.name}`}
                                >
                                  <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 overflow-hidden group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
                                    <div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
                                      {product.bestseller && (
                                        <span className="absolute top-2 left-2 bg-blue-700 text-white px-2 py-1 rounded-tl-xl rounded-br-xl text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                                          {" "}
                                          Bestseller{" "}
                                        </span>
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        {" "}
                                        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                                          {" "}
                                          <svg
                                            className="w-8 h-8 text-blue-600 ml-1"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            {" "}
                                            <path d="M8 5v14l11-7z" />{" "}
                                          </svg>{" "}
                                        </div>{" "}
                                      </div>
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
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                    <div className="p-4">
                                      <h4 className="font-bold text-lg text-blue-900 mb-2 text-center line-clamp-2 font-seasons">
                                        {" "}
                                        {product.name}{" "}
                                      </h4>
                                      <div className="flex items-center justify-center gap-2">
                                        {" "}
                                        <span className="text-xl font-bold text-blue-700">
                                          {" "}
                                          ₹99 / sq ft{" "}
                                        </span>{" "}
                                        {product.originalPrice && (
                                          <span className="text-base text-blue-300 line-through">
                                            {" "}
                                            ₹120 / sq ft{" "}
                                          </span>
                                        )}{" "}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          ))}
                          {/* No need for duplicated cards with JS logic */}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                      aria-label="Previous slide"
                    >
                      {" "}
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />{" "}
                      </svg>{" "}
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                      aria-label="Next slide"
                    >
                      {" "}
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />{" "}
                      </svg>{" "}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section (unchanged structure) */}
      <motion.section /* ... testimonials JSX ... */
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative py-12 px-4 w-full bg-white"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="relative flex justify-center w-full mb-12 animate-fade-slide-in">
            {" "}
            {/* Banner */} {/* ... banner content ... */}
            <div className="w-full bg-[#f5f5dc] shadow-lg overflow-hidden">
              <div className="hidden md:flex items-center justify-between px-8 py-12">
                {" "}
                <div className="flex-1 text-center">
                  {" "}
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1428a0] font-seasons leading-tight">
                    {" "}
                    <span className="block">Why choose</span>{" "}
                    <span className="block">Nagomi?</span>{" "}
                  </h2>{" "}
                </div>
                <div className="flex-1 flex justify-center items-center gap-8">
                  <div className="flex flex-col items-center">
                    {" "}
                    <div className="w-16 h-16 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      {" "}
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />{" "}
                      </svg>{" "}
                    </div>{" "}
                    <span className="text-sm font-bold text-[#1428a0] font-lora text-center">
                      {" "}
                      Assured quality{" "}
                    </span>{" "}
                  </div>
                  <div className="flex flex-col items-center">
                    {" "}
                    <div className="w-16 h-16 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      {" "}
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />{" "}
                      </svg>{" "}
                    </div>{" "}
                    <span className="text-sm font-bold text-[#1428a0] font-lora text-center">
                      {" "}
                      Custom Fit{" "}
                    </span>{" "}
                  </div>
                  <div className="flex flex-col items-center">
                    {" "}
                    <div className="w-16 h-16 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      {" "}
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />{" "}
                      </svg>{" "}
                    </div>{" "}
                    <span className="text-sm font-bold text-[#1428a0] font-lora text-center">
                      {" "}
                      Non-toxic & VOC Free{" "}
                    </span>{" "}
                  </div>
                </div>{" "}
                <div className="flex-1 text-center">
                  {" "}
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1428a0] font-seasons leading-tight">
                    {" "}
                    <span className="block">Quality meets</span>{" "}
                    <span className="block">Personality</span>{" "}
                  </h2>{" "}
                </div>
              </div>
              <div className="md:hidden flex flex-col items-center px-6 py-8">
                {" "}
                {/* Mobile Banner */} {/* ... mobile banner content ... */}
                <div className="w-full text-center mb-6">
                  {" "}
                  <h2 className="text-3xl font-bold text-[#1428a0] font-seasons leading-tight">
                    {" "}
                    <span className="block">Quality meets</span>{" "}
                    <span className="block">Personality</span>{" "}
                  </h2>{" "}
                </div>
                <div className="w-full flex justify-center items-center gap-6">
                  <div className="flex flex-col items-center">
                    {" "}
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      {" "}
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />{" "}
                      </svg>{" "}
                    </div>{" "}
                    <span className="text-xs font-bold text-[#1428a0] font-lora text-center">
                      {" "}
                      Assured quality{" "}
                    </span>{" "}
                  </div>
                  <div className="flex flex-col items-center">
                    {" "}
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      {" "}
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />{" "}
                      </svg>{" "}
                    </div>{" "}
                    <span className="text-xs font-bold text-[#1428a0] font-lora text-center">
                      {" "}
                      Custom Fit{" "}
                    </span>{" "}
                  </div>
                  <div className="flex flex-col items-center">
                    {" "}
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center mb-2">
                      {" "}
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />{" "}
                      </svg>{" "}
                    </div>{" "}
                    <span className="text-xs font-bold text-[#1428a0] font-lora text-center">
                      {" "}
                      Non-toxic & VOC Free{" "}
                    </span>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-4xl font-bold text-center text-primary-600 mb-10 flex items-center justify-center gap-2"
          >
            {" "}
            <span className="text-3xl animate-heartbeat">♥</span> From Our
            Customers{" "}
          </motion.h3>
          <div className="relative overflow-hidden mb-12 w-full">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <div ref={testimonialsContainerRef} className="flex">
                  {" "}
                  {/* Removed transition class */}
                  {testimonialsInfinite.map((t, i) => (
                    <div
                      key={`${t.name}-${i}`}
                      className="flex flex-col items-center bg-white shadow px-8 md:px-16 py-8 md:py-12 flex-shrink-0 w-full min-h-[260px] md:min-h-[320px] rounded-2xl"
                    >
                      <div className="flex flex-col items-center w-full">
                        {" "}
                        {/* Testimonial Card Content */}{" "}
                        {/* ... photo placeholder, quote icon, text, name, stars, line ... */}
                        <div className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
                          {" "}
                          <div className="text-center">
                            {" "}
                            <svg
                              className="w-16 h-16 text-blue-300 mx-auto mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />{" "}
                            </svg>{" "}
                            <p className="text-blue-400 text-sm font-lora">
                              {" "}
                              Installation Photo Placeholder{" "}
                            </p>{" "}
                          </div>{" "}
                        </div>
                        <div className="flex justify-center mb-4">
                          {" "}
                          <svg
                            className="w-8 h-8 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            {" "}
                            <path
                              d="M9 7h.01M15 7h.01M7 11h10M7 15h10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />{" "}
                            <text
                              x="2"
                              y="20"
                              fontSize="24"
                              fill="#3b82f6"
                              fontFamily="serif"
                            >
                              {" "}
                              "{" "}
                            </text>{" "}
                          </svg>{" "}
                        </div>
                        <div className="text-gray-700 text-lg text-center font-lora mb-4">
                          {" "}
                          {t.review}{" "}
                        </div>
                        <div className="font-bold text-blue-900 text-base text-center mb-2 font-seasons">
                          {" "}
                          {t.name}{" "}
                        </div>
                        <div className="flex justify-center">
                          {" "}
                          {[...Array(t.stars)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              {" "}
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />{" "}
                            </svg>
                          ))}{" "}
                        </div>
                      </div>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-6 mx-auto" />
                    </div>
                  ))}
                  {/* No need for duplicated cards with JS logic */}
                </div>
              </div>
            </div>
            {/* Dots or arrows for manual control could go here */}
          </div>
        </div>
      </motion.section>

      {/* Transform Your Space Today Section (unchanged structure, check image paths) */}
      <motion.section /* ... transform your space JSX ... */
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
              {" "}
              Transform Your Space Today{" "}
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>{" "}
            </motion.h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="relative overflow-hidden">
                <div className="flex justify-center">
                  <div className="w-80">
                    <div ref={transformContainerRef} className="flex">
                      {" "}
                      {/* Removed transition class */}
                      {featuredInfinite.map((product: Product, i) => (
                        <div
                          key={`${product._id || product.id}-${i}`}
                          className="flex-shrink-0 w-80 px-2"
                        >
                          <div className="block group w-full">
                            <Link
                              to={`/wallpapers/${product._id || product.id}`}
                              tabIndex={0}
                              aria-label={`View details for ${product.name}`}
                            >
                              <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
                                <div className="w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center mb-4 relative">
                                  {product.bestseller && (
                                    <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                                      {" "}
                                      Bestseller{" "}
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
                                  {" "}
                                  {product.name}{" "}
                                </h4>
                                <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">
                                  {" "}
                                  {product.description || " "}{" "}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  {" "}
                                  <span className="text-xl font-bold text-blue-700">
                                    {" "}
                                    ₹{product.price}{" "}
                                  </span>{" "}
                                  {product.originalPrice && (
                                    <span className="text-base text-blue-300 line-through">
                                      {" "}
                                      ₹{product.originalPrice}{" "}
                                    </span>
                                  )}{" "}
                                </div>
                                <span className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm shadow-sm">
                                  {" "}
                                  Buy Now{" "}
                                </span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                      {/* No need for duplicated cards with JS logic */}
                    </div>
                  </div>
                </div>
                <button
                  onClick={goToTransformPrev}
                  className="absolute left-0 top-1/2 transform text-bold -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                  aria-label="Previous slide"
                >
                  {" "}
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />{" "}
                  </svg>{" "}
                </button>
                <button
                  onClick={goToTransformNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
                  aria-label="Next slide"
                >
                  {" "}
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />{" "}
                  </svg>{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- Review Section --- */}
      {/* Pass the hardcoded reviews array */}
      {/* <ReviewSection reviews={reviewsData} /> */}
      {/* --- End Review Section --- */}
    </div>
  );
}

// Helper styles can be moved to CSS file
// Add CSS for gradient animation, fade-slide-in, heartbeat if not already present
// Add styling for image paths if needed (e.g., error handling)
