// // import React, { useState, useEffect, useMemo, useRef } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { Product, Review } from "../types";
// // import { API_BASE_URL } from "../api/config";
// // import { motion } from "framer-motion";

// // const heroSlides = [
// //   {
// //     image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
// //     title: "Elegant Living Spaces",
// //     description:
// //       "Transform your home with our handcrafted furniture collections",
// //     cta: "Explore Collection",
// //   },
// //   {
// //     image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
// //     title: "Artisan Craftsmanship",
// //     description: "Each piece tells a story of tradition and innovation",
// //     cta: "Discover Our Process",
// //   },
// //   {
// //     image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
// //     title: "Sustainable Luxury",
// //     description: "Eco-friendly materials meet timeless design",
// //     cta: "Shop Sustainable",
// //   },
// // ];

// // // --- Hardcoded Reviews Data ---
// // const reviewsData: Review[] = [
// //   {
// //     _id: "revAnkita",
// //     author: "Ankita Bali",
// //     rating: 5,
// //     createdAt: "2025-10-23T10:00:00Z",
// //     comment:
// //       "Absolutely loved the wallpaper we got from Nagomi! The design was elegant, the installation was seamless, and the team was incredibly friendly and helpful throughout. Highly recommend them for anyone looking to transform their walls beautifully.",
// //     images: ["/reviews/Ankita Bali/your_image_filename1.webp"],
// //     verifiedPurchase: true,
// //     title: "Elegant Design!",
// //   },
// //   {
// //     _id: "revAditya",
// //     author: "Aditya Agrawal",
// //     rating: 5,
// //     createdAt: "2025-10-22T10:00:00Z",
// //     comment:
// //       "Got a complete makeover done with Nagomi wallpaper and mouldings. The results are top-notch. Their design inputs were really thoughtful and I highly recommend their service.",
// //     images: ["/reviews/Aditya Agrawal/actual_image_name.png"],
// //     verifiedPurchase: true,
// //     title: "Top-Notch Makeover",
// //   },
// //   {
// //     _id: "revAshmit",
// //     author: "Ashmit Bhandari",
// //     rating: 5,
// //     createdAt: "2025-10-14T10:00:00Z",
// //     comment:
// //       "Nagomi helped us select and install wallpaper for our bedroom and pooja room and it has such a serene, divine vibe now. So grateful for their design suggestions.",
// //     images: [
// //       "/reviews/Ashmit Bhandari/unnamed.webp",
// //       "/reviews/Ashmit Bhandari/unnamed (1).webp",
// //     ],
// //     verifiedPurchase: true,
// //     title: "Serene Vibe",
// //   },
// // ];

// // export default function Home() {
// //   const [currentSlide, setCurrentSlide] = useState(0);
// //   const [topPicksScroll, setTopPicksScroll] = useState(1);
// //   const [transformScroll, setTransformScroll] = useState(1);
// //   const [testimonialsScroll, setTestimonialsScroll] = useState(1);
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const topPicksContainerRef = useRef<HTMLDivElement>(null);
// //   const transformContainerRef = useRef<HTMLDivElement>(null);
// //   const testimonialsContainerRef = useRef<HTMLDivElement>(null);
// //   const navigate = useNavigate();

// //   // Hero slider effect
// //   // useEffect(() => {
// //   //   const interval = setInterval(() => {
// //   //     setCurrentSlide((prev) =>
// //   //       prev === heroSlides.length - 1 ? 0 : prev + 1
// //   //     );
// //   //   }, 5000);
// //   //   return () => clearInterval(interval);
// //   // }, []);

// //   // Fetch products effect
// //   useEffect(() => {
// //     fetch(`${API_BASE_URL}/api/products`)
// //       .then((r) => (r.ok ? r.json() : []))
// //       .then((data) => setProducts(Array.isArray(data) ? data : []))
// //       .catch((err) => {
// //         console.error("Failed to fetch products:", err);
// //         setProducts([]);
// //       });
// //   }, []);

// //   // Derived product lists
// //   const bestsellers: Product[] = useMemo(
// //     () => products.filter((p) => p.bestseller).slice(0, 15),
// //     [products]
// //   );
// //   const fallback: Product[] = useMemo(() => products.slice(0, 15), [products]);
// //   const featured: Product[] = useMemo(() => {
// //     return bestsellers.length > 0 ? bestsellers : fallback;
// //   }, [bestsellers, fallback]);
// //   const topPicks: Product[] = useMemo(() => {
// //     return products
// //       .filter((p) => !featured.find((f) => f._id === p._id))
// //       .slice(0, 15);
// //   }, [products, featured]);

// //   // Shop categories data - UPDATED TO USE GIFs
// //   // MAKE SURE YOU PLACE THESE GIFS IN YOUR 'public/gifs' FOLDER
// //   const shopCategories = [
// //     {
// //       name: "Wallpaper Rolls",
// //       image: "/home vdos/wall-roll.gif",
// //     },
// //     {
// //       name: "Customised Wallpapers",
// //       image: "/home vdos/customised.gif",
// //     },

// //     {
// //       name: "Peel-n-Stick Collection",
// //       image: "/home vdos/peel-n-stick.gif",
// //     },
// //     {
// //       name: "Luxe Collection",
// //       image: "/soon", // Placeholder for future GIF
// //     },
// //   ];

// //   // Testimonials data
// //   const testimonials = [
// //     {
// //       name: "Aarav Mehta",
// //       review:
// //         "The transformation was magical! My living room feels like a luxury hotel now. Highly recommend Nagomi for anyone looking to elevate their space.",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //     {
// //       name: "Saanvi Sharma",
// //       review:
// //         "Absolutely in love with the Signature Art collection. The quality and detail are unmatched. The team was so helpful throughout the process!",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //     {
// //       name: "Kabir Singh",
// //       review:
// //         "From consultation to installation, everything was seamless. The Designer Walls are a conversation starter for every guest!",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //     {
// //       name: "Mira Kapoor",
// //       review:
// //         "Nagomi turned my bedroom into a tranquil retreat. The muralists are true artists. I wake up inspired every day!",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //     {
// //       name: "Riya Patel",
// //       review:
// //         "The Premium Wallpapers collection exceeded all expectations. The texture and colors are absolutely stunning. My dining room is now the highlight of my home!",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //     {
// //       name: "Vikram Malhotra",
// //       review:
// //         "Professional service from start to finish. The installation team was punctual, skilled, and left my space spotless. The wall mural is breathtaking!",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //     {
// //       name: "Priya Gupta",
// //       review:
// //         "I was skeptical about wall murals, but Nagomi proved me wrong. The quality is exceptional and the design perfectly matches my aesthetic. Love it!",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //     {
// //       name: "Arjun Reddy",
// //       review:
// //         "The custom design service is incredible. They took my vision and made it reality. The attention to detail is remarkable. Worth every penny!",
// //       image: "/reviews/abhishek yadav/unnamed.webp",
// //       stars: 5,
// //     },
// //   ];

// //   // Infinite arrays for carousels
// //   const topPicksInfinite = useMemo(() => {
// //     if (topPicks.length === 0) return [];
// //     return [topPicks[topPicks.length - 1], ...topPicks, topPicks[0]];
// //   }, [topPicks]);
// //   const featuredInfinite = useMemo(() => {
// //     if (featured.length === 0) return [];
// //     return [featured[featured.length - 1], ...featured, featured[0]];
// //   }, [featured]);
// //   const testimonialsInfinite = useMemo(() => {
// //     if (testimonials.length === 0) return [];
// //     return [
// //       testimonials[testimonials.length - 1],
// //       ...testimonials,
// //       testimonials[0],
// //     ];
// //   }, [testimonials]);

// //   // Scroll utility function
// //   const scrollToItem = (
// //     ref: React.RefObject<HTMLDivElement>,
// //     index: number,
// //     cardWidth: number,
// //     gap: number
// //   ) => {
// //     const container = ref.current;
// //     if (container) {
// //       const translateX = -index * (cardWidth + gap);
// //       const isResetting = container.style.transition === "none 0s ease 0s";
// //       if (!isResetting) {
// //         container.style.transition = "transform 0.7s ease-in-out";
// //       }
// //       container.style.transform = `translateX(${translateX}px)`;
// //     }
// //   };

// //   // Effects for carousel logic
// //   useEffect(() => {
// //     if (topPicksInfinite.length <= 2) return;
// //     scrollToItem(topPicksContainerRef, topPicksScroll, 320, 16);

// //     const interval = setInterval(
// //       () => setTopPicksScroll((prev) => prev + 1),
// //       4000
// //     );

// //     if (
// //       topPicksScroll === topPicksInfinite.length - 1 ||
// //       topPicksScroll === 0
// //     ) {
// //       const timer = setTimeout(() => {
// //         const container = topPicksContainerRef.current;
// //         if (container) {
// //           container.style.transition = "none";
// //           const resetIndex =
// //             topPicksScroll === 0 ? topPicksInfinite.length - 2 : 1;
// //           scrollToItem(topPicksContainerRef, resetIndex, 320, 16);
// //           setTopPicksScroll(resetIndex);
// //           requestAnimationFrame(() => {
// //             if (container) container.style.transition = "";
// //           });
// //         }
// //       }, 700);
// //       return () => {
// //         clearInterval(interval);
// //         clearTimeout(timer);
// //       };
// //     }
// //     return () => clearInterval(interval);
// //   }, [topPicksScroll, topPicksInfinite.length]);

// //   useEffect(() => {
// //     if (featuredInfinite.length <= 2) return;
// //     scrollToItem(transformContainerRef, transformScroll, 320, 16);
// //     const interval = setInterval(
// //       () => setTransformScroll((prev) => prev + 1),
// //       4000
// //     );

// //     if (
// //       transformScroll === featuredInfinite.length - 1 ||
// //       transformScroll === 0
// //     ) {
// //       const timer = setTimeout(() => {
// //         const container = transformContainerRef.current;
// //         if (container) {
// //           container.style.transition = "none";
// //           const resetIndex =
// //             transformScroll === 0 ? featuredInfinite.length - 2 : 1;
// //           scrollToItem(transformContainerRef, resetIndex, 320, 16);
// //           setTransformScroll(resetIndex);
// //           requestAnimationFrame(() => {
// //             if (container) container.style.transition = "";
// //           });
// //         }
// //       }, 700);
// //       return () => {
// //         clearInterval(interval);
// //         clearTimeout(timer);
// //       };
// //     }
// //     return () => clearInterval(interval);
// //   }, [transformScroll, featuredInfinite.length]);

// //   useEffect(() => {
// //     if (testimonialsInfinite.length <= 2) return;
// //     const container = testimonialsContainerRef.current;
// //     const cardWidth = container?.offsetWidth || 0;
// //     scrollToItem(testimonialsContainerRef, testimonialsScroll, cardWidth, 0);
// //     const interval = setInterval(
// //       () => setTestimonialsScroll((prev) => prev + 1),
// //       4000
// //     );

// //     if (
// //       testimonialsScroll === testimonialsInfinite.length - 1 ||
// //       testimonialsScroll === 0
// //     ) {
// //       const timer = setTimeout(() => {
// //         if (container) {
// //           container.style.transition = "none";
// //           const resetIndex =
// //             testimonialsScroll === 0 ? testimonialsInfinite.length - 2 : 1;
// //           scrollToItem(testimonialsContainerRef, resetIndex, cardWidth, 0);
// //           setTestimonialsScroll(resetIndex);
// //           requestAnimationFrame(() => {
// //             if (container) container.style.transition = "";
// //           });
// //         }
// //       }, 700);
// //       return () => {
// //         clearInterval(interval);
// //         clearTimeout(timer);
// //       };
// //     }
// //     return () => clearInterval(interval);
// //   }, [testimonialsScroll, testimonialsInfinite.length]);

// //   const goToNext = () => setTopPicksScroll((prev) => prev + 1);
// //   const goToPrev = () => setTopPicksScroll((prev) => prev - 1);
// //   const goToTransformNext = () => setTransformScroll((prev) => prev + 1);
// //   const goToTransformPrev = () => setTransformScroll((prev) => prev - 1);

// //   return (
// //     <div className="flex flex-col min-h-screen w-full  bg-[#d9d9d9]">
// //       {/* Hero Section */}
// //     {/* --- BESTSELLER BANNER VIDEO SECTION --- */}
// //       <motion.section
// //         initial={{ opacity: 0, y: 40 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.8 }}
// //         className=" w-full"
// //       >
// //         <div className="relative w-full h-auto bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">

// //           {/* Video Background */}
// //           <video
// //             src="/home vdos/BestSellerBanner.MP4"
// //             autoPlay
// //             muted
// //             loop
// //             playsInline
// //             className="w-full h-auto block"
// //           />

// //           {/* Overlay: Just Text */}
// //           <div className="absolute inset-0 flex items-center justify-center z-10">
// //             <Link to="/wallpapers" className="group">
// //               <span className="text-[#172b9b] text-xl md:text-3xl font-serif font-medium border-b-2 border-transparent group-hover:border-[#172b9b] transition-all duration-300 pb-1 cursor-pointer">
// //                 Explore Designs
// //               </span>
// //             </Link>
// //           </div>

// //         </div>
// //       </motion.section>
// //       {/* --- BESTSELLER BANNER ENDS --- */}

// //       {/* --- MERGED SECTION: Shop by Category & Top Picks --- */}
// //       <motion.section
// //         initial={{ opacity: 0, y: 40 }}
// //         whileInView={{ opacity: 1, y: 0 }}
// //         viewport={{ once: true }}
// //         transition={{ delay: 0.1, duration: 0.8 }}
// //         className="py-12 px-4 w-full"
// //       >
// //         <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative overflow-hidden">
// //           {/* --- PART 1: SHOP BY CATEGORY (White Background) --- */}
// //           <div className="pt-10 pb-10 px-4 md:px-8 bg-white">
// //             <motion.h2
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ delay: 0.2, duration: 0.7 }}
// //               className="text-3xl md:text-4xl font-serif font-medium text-center text-blue-900 mb-10 tracking-tight"
// //             >
// //               Shop by Category
// //             </motion.h2>

// //             <div
// //               className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 md:gap-8 pb-6 md:pb-0 px-2 md:px-0 snap-x snap-mandatory justify-items-center [&::-webkit-scrollbar]:hidden"
// //               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
// //             >
// //               {shopCategories.map((cat, i) => (
// //                 <motion.div
// //                   key={cat.name}
// //                   initial={{ opacity: 0, y: 30 }}
// //                   whileInView={{ opacity: 1, y: 0 }}
// //                   viewport={{ once: true }}
// //                   transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
// //                   className="flex-shrink-0 snap-center flex flex-col items-center min-w-[130px]"
// //                 >
// //                   <div className="relative group">
// //                     {/* Circle Icon - Updated to support GIFs via object-cover */}
// //                     <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
// //                       <img
// //                         src={cat.image}
// //                         alt={cat.name}
// //                         className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
// //                       />
// //                     </div>
// //                     <Link
// //                       to={
// //                         cat.name === "Signature Art"
// //                           ? "/wallart"
// //                           : cat.name === "Customised Wallpapers"
// //                           ? "/wallpapers"
// //                           : cat.name === "Wallpaper Rolls"
// //                           ? "/wallroll"
// //                           : cat.name === "Peel-n-Stick Collection"
// //                           ? "/peel-n-stick"
// //                           : cat.name === "Luxe Collection"
// //                           ? "/luxe"
// //                           : `/wallpapers?category=${encodeURIComponent(
// //                               cat.name
// //                             )}`
// //                       }
// //                       className="absolute inset-0 rounded-full"
// //                       tabIndex={-1}
// //                       aria-label={`Go to ${cat.name}`}
// //                     ></Link>
// //                   </div>
// //                   <span className="mt-4 text-base md:text-lg font-bold text-blue-900 text-center leading-tight max-w-[140px]">
// //                     {cat.name}
// //                   </span>
// //                 </motion.div>
// //               ))}
// //             </div>
// //             {/* Mobile swipe hint */}
// //             <div className="md:hidden text-center mt-4">
// //               <span className="text-xs text-blue-400 font-medium animate-pulse">
// //                 Swipe to explore &rarr;
// //               </span>
// //             </div>
// //           </div>

// //           {/* --- PART 2: TOP PICKS (Dark Blue Background) --- */}
// //           <div className="pt-10 pb-16 px-4 bg-[#172b9b]">
// //             <motion.h3
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ delay: 0.3, duration: 0.7 }}
// //               className="text-3xl md:text-4xl font-serif font-medium text-center text-white mb-10 tracking-tight"
// //             >
// //               Top Picks: Watch & Shop
// //             </motion.h3>

// //             <section className="relative">
// //               <div className="max-w-7xl mx-auto px-0 md:px-4">
// //                 <div className="relative max-w-5xl mx-auto">
// //                   <div className="relative overflow-hidden">
// //                     <div className="flex justify-center">
// //                       <div className="w-80">
// //                         <div ref={topPicksContainerRef} className="flex">
// //                           {topPicksInfinite.map((product: Product, i) => (
// //                             <div
// //                               key={`${product._id || product.id}-${i}`}
// //                               className="flex-shrink-0 w-80 px-2"
// //                             >
// //                               <div className="block group w-full">
// //                                 <Link
// //                                   to={`/${product.category}/${
// //                                     product._id || product.id
// //                                   }`}
// //                                   tabIndex={0}
// //                                   aria-label={`View details for ${product.name}`}
// //                                 >
// //                                   {/* Product Card - Grey placeholder style */}
// //                                   <div className="bg-[#d9d9d9] rounded-sm transition-all duration-300 overflow-hidden group-hover:shadow-xl transform group-hover:scale-[1.02]">
// //                                     <div className="w-full h-80 relative bg-gray-300">
// //                                       {product.bestseller && (
// //                                         <span className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 text-xs font-bold z-10">
// //                                           BESTSELLER
// //                                         </span>
// //                                       )}
// //                                       <img
// //                                         src={
// //                                           Array.isArray(product.images) &&
// //                                           product.images.length > 0
// //                                             ? `${API_BASE_URL}${
// //                                                 product.images[0].startsWith(
// //                                                   "/"
// //                                                 )
// //                                                   ? product.images[0]
// //                                                   : `/${product.images[0]}`
// //                                               }`
// //                                             : "/placeholder.jpg"
// //                                         }
// //                                         alt={product.name}
// //                                         className="w-full h-full object-cover"
// //                                       />
// //                                     </div>
// //                                     <div className="p-3 bg-white">
// //                                       <h4 className="font-bold text-base text-blue-900 truncate">
// //                                         {product.name}
// //                                       </h4>
// //                                       <div className="flex items-center gap-2">
// //                                         <span className="text-sm font-bold text-blue-800">
// //                                           ₹{product.price}
// //                                         </span>
// //                                       </div>
// //                                     </div>
// //                                   </div>
// //                                 </Link>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     </div>
// //                     {/* Navigation Buttons */}
// //                     <button
// //                       onClick={goToPrev}
// //                       className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 z-10"
// //                       aria-label="Previous slide"
// //                     >
// //                       <svg
// //                         className="w-8 h-8"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         viewBox="0 0 24 24"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           strokeWidth={2}
// //                           d="M15 19l-7-7 7-7"
// //                         />
// //                       </svg>
// //                     </button>
// //                     <button
// //                       onClick={goToNext}
// //                       className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 z-10"
// //                       aria-label="Next slide"
// //                     >
// //                       <svg
// //                         className="w-8 h-8"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         viewBox="0 0 24 24"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           strokeWidth={2}
// //                           d="M9 5l7 7-7 7"
// //                         />
// //                       </svg>
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </section>
// //           </div>
// //         </div>
// //       </motion.section>

// //       {/* Why Choose Us Section */}
// //       <motion.section
// //         initial={{ opacity: 0, y: 40 }}
// //         whileInView={{ opacity: 1, y: 0 }}
// //         viewport={{ once: true }}
// //         transition={{ delay: 0.6, duration: 0.8 }}
// //         className="py-12 px-4 w-full"
// //       >
// //         <div className="max-w-6xl mx-auto">
// //           <div className="bg-[#172b9b] rounded-3xl shadow-xl px-6 py-12 md:px-12 md:py-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
// //             {/* Left Text */}
// //             <div className="flex-1 text-center md:text-left">
// //               <h2 className="font-serif text-3xl md:text-5xl leading-tight">
// //                 Why Choose <br /> Nagomi?
// //               </h2>
// //             </div>

// //             {/* Center Icons */}
// //             <div className="flex-[2] flex justify-center gap-8 md:gap-16 w-full md:w-auto">
// //               {/* Icon 1: Assured Quality */}
// //               <div className="flex flex-col items-center gap-4">
// //                 <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
// //                   {/* Shield Icon */}
// //                   <img src="/assured-quality.png" alt="assured-quality" />
// //                 </div>
// //                 <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
// //                   Assured <br /> Quality
// //                 </span>
// //               </div>

// //               {/* Icon 2: Custom Fit */}
// //               <div className="flex flex-col items-center gap-4">
// //                 <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
// //                   {/* Expand/Fit Icon */}
// //                   <img src="/custom-fit-blue.png" alt="" />
// //                 </div>
// //                 <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
// //                   Custom <br /> Fit
// //                 </span>
// //               </div>

// //               {/* Icon 3: Non-toxic */}
// //               <div className="flex flex-col items-center gap-4">
// //                 <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
// //                   {/* Flask/Leaf Icon */}
// //                   <img src="/non-toxic.png" alt="" />
// //                 </div>
// //                 <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
// //                   Non-toxic & <br /> VOC Free
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Right Text */}
// //             <div className="flex-1 text-center md:text-right">
// //               <h2 className="font-serif text-3xl md:text-5xl leading-tight">
// //                 Quality <br /> Meets <br /> Personality
// //               </h2>
// //             </div>
// //           </div>
// //         </div>
// //       </motion.section>

// //       {/* Transform Your Space Today Section */}
// //       <motion.section
// //         initial={{ opacity: 0, y: 40 }}
// //         whileInView={{ opacity: 1, y: 0 }}
// //         viewport={{ once: true }}
// //         transition={{ delay: 0.9, duration: 0.8 }}
// //         className="py-12 px-4 w-full"
// //       >
// //         <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative">
// //           <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
// //           <div className="pt-8 pb-12 px-8">
// //             <motion.h2
// //               initial={{ opacity: 0, y: 20 }}
// //               whileInView={{ opacity: 1, y: 0 }}
// //               viewport={{ once: true }}
// //               transition={{ delay: 1.0, duration: 0.7 }}
// //               className="text-2xl md:text-3xl font-bold text-left mb-10 text-blue-900 tracking-tight relative font-seasons"
// //             >
// //               Transform Your Space Today
// //               <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>
// //             </motion.h2>
// //             <div className="relative max-w-4xl mx-auto">
// //               <div className="relative overflow-hidden">
// //                 <div className="flex justify-center">
// //                   <div className="w-80">
// //                     <div ref={transformContainerRef} className="flex">
// //                       {featuredInfinite.map((product: Product, i) => (
// //                         <div
// //                           key={`${product._id || product.id}-${i}`}
// //                           className="flex-shrink-0 w-80 px-2"
// //                         >
// //                           <div className="block group w-full">
// //                             <Link
// //                               to={`${product.category}/${
// //                                 product._id || product.id
// //                               }`}
// //                               tabIndex={0}
// //                               aria-label={`View details for ${product.name}`}
// //                             >
// //                               <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
// //                                 <div className="w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center mb-4 relative">
// //                                   {product.bestseller && (
// //                                     <span className="absolute top-2 left-2 bg-[#172b9b] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
// //                                       Bestseller
// //                                     </span>
// //                                   )}
// //                                   <img
// //                                     src={
// //                                       Array.isArray(product.images) &&
// //                                       product.images.length > 0
// //                                         ? `${API_BASE_URL}${
// //                                             product.images[0].startsWith("/")
// //                                               ? product.images[0]
// //                                               : `/${product.images[0]}`
// //                                           }`
// //                                         : "/placeholder.jpg"
// //                                     }
// //                                     alt={product.name}
// //                                     className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
// //                                   />
// //                                 </div>
// //                                 <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2 text-center line-clamp-2">
// //                                   {product.name}
// //                                 </h4>
// //                                 <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">
// //                                   {product.description || " "}
// //                                 </p>
// //                                 <div className="flex items-center gap-2 mb-2">
// //                                   <span className="text-xl font-bold text-blue-700">
// //                                     ₹{product.price}
// //                                   </span>
// //                                   {product.originalPrice && (
// //                                     <span className="text-base text-blue-300 line-through">
// //                                       ₹{product.originalPrice.toFixed(2)}
// //                                     </span>
// //                                   )}
// //                                 </div>
// //                                 <span className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm shadow-sm">
// //                                   Buy Now
// //                                 </span>
// //                               </div>
// //                             </Link>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={goToTransformPrev}
// //                   className="absolute left-0 top-1/2 transform text-bold -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
// //                   aria-label="Previous slide"
// //                 >
// //                   <svg
// //                     className="w-6 h-6 text-blue-600"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M15 19l-7-7 7-7"
// //                     />
// //                   </svg>
// //                 </button>
// //                 <button
// //                   onClick={goToTransformNext}
// //                   className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
// //                   aria-label="Next slide"
// //                 >
// //                   <svg
// //                     className="w-6 h-6 text-blue-600"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M9 5l7 7-7 7"
// //                     />
// //                   </svg>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </motion.section>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Product, Review } from "../types";
// import { API_BASE_URL } from "../api/config";
// import { motion } from "framer-motion";

// const heroSlides = [
//   {
//     image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
//     title: "Elegant Living Spaces",
//     description:
//       "Transform your home with our handcrafted furniture collections",
//     cta: "Explore Collection",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
//     title: "Artisan Craftsmanship",
//     description: "Each piece tells a story of tradition and innovation",
//     cta: "Discover Our Process",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
//     title: "Sustainable Luxury",
//     description: "Eco-friendly materials meet timeless design",
//     cta: "Shop Sustainable",
//   },
// ];

// // --- Hardcoded Reviews Data ---
// const reviewsData: Review[] = [
//   {
//     _id: "revAnkita",
//     author: "Ankita Bali",
//     rating: 5,
//     createdAt: "2025-10-23T10:00:00Z",
//     comment:
//       "Absolutely loved the wallpaper we got from Nagomi! The design was elegant, the installation was seamless, and the team was incredibly friendly and helpful throughout. Highly recommend them for anyone looking to transform their walls beautifully.",
//     images: ["/reviews/Ankita Bali/your_image_filename1.webp"],
//     verifiedPurchase: true,
//     title: "Elegant Design!",
//   },
//   {
//     _id: "revAditya",
//     author: "Aditya Agrawal",
//     rating: 5,
//     createdAt: "2025-10-22T10:00:00Z",
//     comment:
//       "Got a complete makeover done with Nagomi wallpaper and mouldings. The results are top-notch. Their design inputs were really thoughtful and I highly recommend their service.",
//     images: ["/reviews/Aditya Agrawal/actual_image_name.png"],
//     verifiedPurchase: true,
//     title: "Top-Notch Makeover",
//   },
//   {
//     _id: "revAshmit",
//     author: "Ashmit Bhandari",
//     rating: 5,
//     createdAt: "2025-10-14T10:00:00Z",
//     comment:
//       "Nagomi helped us select and install wallpaper for our bedroom and pooja room and it has such a serene, divine vibe now. So grateful for their design suggestions.",
//     images: [
//       "/reviews/Ashmit Bhandari/unnamed.webp",
//       "/reviews/Ashmit Bhandari/unnamed (1).webp",
//     ],
//     verifiedPurchase: true,
//     title: "Serene Vibe",
//   },
// ];

// // Number of clones to add to start and end for infinite scroll
// const CLONE_COUNT = 6;

// export default function Home() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   // Start scroll at CLONE_COUNT to show the first real item
//   const [topPicksScroll, setTopPicksScroll] = useState(CLONE_COUNT);
//   const [transformScroll, setTransformScroll] = useState(CLONE_COUNT);
//   const [testimonialsScroll, setTestimonialsScroll] = useState(CLONE_COUNT);

//   const [products, setProducts] = useState<Product[]>([]);
//   const topPicksContainerRef = useRef<HTMLDivElement>(null);
//   const transformContainerRef = useRef<HTMLDivElement>(null);
//   const testimonialsContainerRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   // Fetch products effect
//   useEffect(() => {
//     fetch(`${API_BASE_URL}/api/products`)
//       .then((r) => (r.ok ? r.json() : []))
//       .then((data) => setProducts(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         console.error("Failed to fetch products:", err);
//         setProducts([]);
//       });
//   }, []);

//   // Derived product lists
//   const bestsellers: Product[] = useMemo(
//     () => products.filter((p) => p.bestseller).slice(0, 15),
//     [products]
//   );
//   const fallback: Product[] = useMemo(() => products.slice(0, 15), [products]);
//   const featured: Product[] = useMemo(() => {
//     return bestsellers.length > 0 ? bestsellers : fallback;
//   }, [bestsellers, fallback]);
//   const topPicks: Product[] = useMemo(() => {
//     return products
//       .filter((p) => !featured.find((f) => f._id === p._id))
//       .slice(0, 15);
//   }, [products, featured]);

//   // Shop categories data
//   const shopCategories = [
//     {
//       name: "Wallpaper Rolls",
//       image: "/home vdos/wall-roll.gif",
//     },
//     {
//       name: "Customised Wallpapers",
//       image: "/home vdos/customised.gif",
//     },

//     {
//       name: "Peel-n-Stick Collection",
//       image: "/home vdos/peel-n-stick.gif",
//     },
//     {
//       name: "Luxe Collection",
//       image: "/soon", // Placeholder for future GIF
//     },
//   ];

//   // Testimonials data
//   const testimonials = [
//     {
//       name: "Aarav Mehta",
//       review:
//         "The transformation was magical! My living room feels like a luxury hotel now. Highly recommend Nagomi for anyone looking to elevate their space.",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//     {
//       name: "Saanvi Sharma",
//       review:
//         "Absolutely in love with the Signature Art collection. The quality and detail are unmatched. The team was so helpful throughout the process!",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//     {
//       name: "Kabir Singh",
//       review:
//         "From consultation to installation, everything was seamless. The Designer Walls are a conversation starter for every guest!",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//     {
//       name: "Mira Kapoor",
//       review:
//         "Nagomi turned my bedroom into a tranquil retreat. The muralists are true artists. I wake up inspired every day!",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//     {
//       name: "Riya Patel",
//       review:
//         "The Premium Wallpapers collection exceeded all expectations. The texture and colors are absolutely stunning. My dining room is now the highlight of my home!",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//     {
//       name: "Vikram Malhotra",
//       review:
//         "Professional service from start to finish. The installation team was punctual, skilled, and left my space spotless. The wall mural is breathtaking!",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//     {
//       name: "Priya Gupta",
//       review:
//         "I was skeptical about wall murals, but Nagomi proved me wrong. The quality is exceptional and the design perfectly matches my aesthetic. Love it!",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//     {
//       name: "Arjun Reddy",
//       review:
//         "The custom design service is incredible. They took my vision and made it reality. The attention to detail is remarkable. Worth every penny!",
//       image: "/reviews/abhishek yadav/unnamed.webp",
//       stars: 5,
//     },
//   ];

//   // Helper to create robust infinite arrays
//   const createInfiniteArray = (items: any[]) => {
//     if (items.length === 0) return [];
//     // Ensure we have enough items to clone; if list is short, double it
//     let source = items;
//     if (items.length < CLONE_COUNT) {
//       source = [...items, ...items, ...items]; // Pad short lists
//     }
//     return [
//       ...source.slice(-CLONE_COUNT),
//       ...source,
//       ...source.slice(0, CLONE_COUNT),
//     ];
//   };

//   const topPicksInfinite = useMemo(
//     () => createInfiniteArray(topPicks),
//     [topPicks]
//   );
//   const featuredInfinite = useMemo(
//     () => createInfiniteArray(featured),
//     [featured]
//   );
//   const testimonialsInfinite = useMemo(
//     () => createInfiniteArray(testimonials),
//     [testimonials]
//   );

//   // Scroll utility function
//   const scrollToItem = (
//     ref: React.RefObject<HTMLDivElement>,
//     index: number,
//     cardWidth: number,
//     gap: number
//   ) => {
//     const container = ref.current;
//     if (container) {
//       const translateX = -index * (cardWidth + gap);
//       const isResetting = container.style.transition === "none 0s ease 0s";
//       if (!isResetting) {
//         container.style.transition = "transform 0.7s ease-in-out";
//       }
//       container.style.transform = `translateX(${translateX}px)`;
//     }
//   };

//   // --- UPDATED CAROUSEL LOGIC ---

//   // Generic function to handle infinite scroll resets
//   const handleInfiniteScroll = (
//     currentIndex: number,
//     setIndex: React.Dispatch<React.SetStateAction<number>>,
//     containerRef: React.RefObject<HTMLDivElement>,
//     items: any[],
//     cardWidth: number,
//     gap: number
//   ) => {
//     const realLength = items.length - 2 * CLONE_COUNT;
//     const maxIndex = realLength + CLONE_COUNT; // The first item of the end clones

//     // Reset Trigger: Reached the end clones or the start clones
//     if (currentIndex >= maxIndex || currentIndex <= CLONE_COUNT - 1) {
//       const timer = setTimeout(() => {
//         const container = containerRef.current;
//         if (container) {
//           container.style.transition = "none";
//           // Calculate where to jump back to
//           let resetIndex;
//           if (currentIndex >= maxIndex) {
//             // Jump to the start of real items
//             resetIndex = CLONE_COUNT;
//           } else {
//             // Jump to the end of real items
//             resetIndex = realLength + CLONE_COUNT - 1;
//           }

//           scrollToItem(containerRef, resetIndex, cardWidth, gap);
//           setIndex(resetIndex);

//           requestAnimationFrame(() => {
//             if (container) container.style.transition = "";
//           });
//         }
//       }, 700); // Matches transition duration
//       return timer;
//     }
//     return null;
//   };

//   // 1. Top Picks Carousel Effect
//   useEffect(() => {
//     if (topPicksInfinite.length === 0) return;
//     scrollToItem(topPicksContainerRef, topPicksScroll, 320, 16);

//     const interval = setInterval(
//       () => setTopPicksScroll((prev) => prev + 1),
//       4000
//     );
//     const resetTimer = handleInfiniteScroll(
//       topPicksScroll,
//       setTopPicksScroll,
//       topPicksContainerRef,
//       topPicksInfinite,
//       320,
//       16
//     );

//     return () => {
//       clearInterval(interval);
//       if (resetTimer) clearTimeout(resetTimer);
//     };
//   }, [topPicksScroll, topPicksInfinite]);

//   // 2. Transform (Featured) Carousel Effect
//   useEffect(() => {
//     if (featuredInfinite.length === 0) return;
//     scrollToItem(transformContainerRef, transformScroll, 320, 16);

//     const interval = setInterval(
//       () => setTransformScroll((prev) => prev + 1),
//       4000
//     );
//     const resetTimer = handleInfiniteScroll(
//       transformScroll,
//       setTransformScroll,
//       transformContainerRef,
//       featuredInfinite,
//       320,
//       16
//     );

//     return () => {
//       clearInterval(interval);
//       if (resetTimer) clearTimeout(resetTimer);
//     };
//   }, [transformScroll, featuredInfinite]);

//   // 3. Testimonials Carousel Effect
//   useEffect(() => {
//     if (testimonialsInfinite.length === 0) return;
//     const container = testimonialsContainerRef.current;
//     // For testimonials, calculate dynamic width if needed, or assume full width card
//     const cardWidth = container?.offsetWidth || 0;

//     // Testimonials usually show 1 card, so width is dynamic
//     scrollToItem(testimonialsContainerRef, testimonialsScroll, cardWidth, 0);

//     const interval = setInterval(
//       () => setTestimonialsScroll((prev) => prev + 1),
//       4000
//     );
//     const resetTimer = handleInfiniteScroll(
//       testimonialsScroll,
//       setTestimonialsScroll,
//       testimonialsContainerRef,
//       testimonialsInfinite,
//       cardWidth,
//       0
//     );

//     return () => {
//       clearInterval(interval);
//       if (resetTimer) clearTimeout(resetTimer);
//     };
//   }, [testimonialsScroll, testimonialsInfinite]);

//   const goToNext = () => setTopPicksScroll((prev) => prev + 1);
//   const goToPrev = () => setTopPicksScroll((prev) => prev - 1);
//   const goToTransformNext = () => setTransformScroll((prev) => prev + 1);
//   const goToTransformPrev = () => setTransformScroll((prev) => prev - 1);

//   return (
//     <div className="flex flex-col min-h-screen w-full bg-[#d9d9d9]">
//       {/* --- BESTSELLER BANNER VIDEO SECTION --- */}
//       {/* <motion.section
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="py-2 px-4 w-full" 
//       >
//         <div className="relative w-full h-auto bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
//           <video
//             src="/home vdos/BestSellerBanner.mp4"
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="w-full h-auto block"
//           />
//           <div className="absolute justify-center items-center flex inset-0 flex-col z-10">
//           <div className="absolute top-10">
//             <span className="text-[#172b9b] flex-col text-3xl md:text-5xl font-serif font-semibold text-center drop-shadow-lg">
//               Every wall has a story, 
//             <br /> <span className="text-[#172b9b] flex-col text-3xl md:text-5xl font-serif font-semibold text-center drop-shadow-lg">
//               Let Us Craft Yours.
//               </span>
             
//             </span>
             
//           </div>
//             <Link to="/wallpapers" className="group">
//               <span className="text-[#172b9b]  text-xl md:text-3xl font-serif font-medium border-b-2 border-transparent group-hover:border-[#172b9b] transition-all duration-300 pb-1 cursor-pointer">
//                 Explore Designs
//               </span>
//             </Link>
//           </div>
//         </div>
//       </motion.section> */}
//       {/* --- BESTSELLER BANNER VIDEO SECTION --- */}
//       {/* --- BESTSELLER BANNER VIDEO SECTION --- */}
//       <motion.section
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="py-2 px-4 w-full"
//       >
//         <div className="relative w-full h-auto bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
//           {/* Video Background */}
//           <video
//             src="public\home vdos\BestSellerBanner.mp4"
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="w-full h-auto block"
//           />

//           {/* Overlay Container */}
//           <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
//             {/* Top Headline Text - HIDDEN ON MOBILE (hidden md:block) */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 3 }}
//               // Added 'hidden md:block' -> Hides on mobile, shows on medium screens and up
//               className="hidden md:block absolute md:top-10 w-full text-center px-4"
//             >
//               <h2 className="text-[#172b9b] flex-col font-serif font-semibold text-2xl md:text-5xl leading-tight drop-shadow-md">
//                 Every wall has a story, <br />
//                 <span className="text-[#172b9b] font-serif font-semibold text-2xl md:text-5xl leading-tight drop-shadow-md">
//                   Let Us Craft Yours.
//                 </span>
//               </h2>
//             </motion.div>

//             {/* Explore Designs Link - BUTTON STYLE */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 2 }}
//               // Added 'hidden md:block' -> Hides on mobile, shows on medium screens and up
//               className="flex justify-center items-center"
//             >
//               <Link
//                 to="/wallpapers"
//                 className="z-20" // z-20 ensures it's clickable
//               >
//                 <button className="bg-[#172b9b] mb-[55vh] text-white font-serif text-lg md:text-xl px-4 py-3 rounded-full shadow-xl hover:bg-blue-800 hover:scale-105 transition-all duration-300 cursor-pointer">
//                   Explore Designs
//                 </button>
//               </Link>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>
//       {/* --- BESTSELLER BANNER ENDS --- */}
//       {/* --- BESTSELLER BANNER ENDS --- */}

//       {/* --- MERGED SECTION: Shop by Category & Top Picks --- */}
//       <motion.section
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.1, duration: 0.8 }}
//         className="py-2 px-4 w-full"
//       >
//         <div className="w-full rounded-3xl shadow-xl bg-white border border-blue-100 relative overflow-hidden">
//           {/* --- PART 1: SHOP BY CATEGORY --- */}
//           <div className="pt-4 pb-2 px-4 md:px-8 bg-white">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.2, duration: 0.7 }}
//               className="text-3xl md:text-4xl font-serif font-medium text-center text-blue-900 mb-6 tracking-tight"
//             >
//               Shop by Category
//             </motion.h2>

//             <div
//               className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 md:gap-8 pb-4 md:pb-0 px-2 md:px-0 snap-x snap-mandatory justify-items-center [&::-webkit-scrollbar]:hidden"
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//             >
//               {shopCategories.map((cat, i) => (
//                 <motion.div
//                   key={cat.name}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
//                   className="flex-shrink-0 snap-center flex flex-col items-center min-w-[130px]"
//                 >
//                   <div className="relative group">
//                     <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
//                       <img
//                         src={cat.image}
//                         alt={cat.name}
//                         className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
//                       />
//                     </div>
//                     <Link
//                       to={
//                         cat.name === "Signature Art"
//                           ? "/wallart"
//                           : cat.name === "Customised Wallpapers"
//                           ? "/wallpapers"
//                           : cat.name === "Wallpaper Rolls"
//                           ? "/wallroll"
//                           : cat.name === "Peel-n-Stick Collection"
//                           ? "/peel-n-stick"
//                           : cat.name === "Luxe Collection"
//                           ? "/luxe"
//                           : `/wallpapers?category=${encodeURIComponent(
//                               cat.name
//                             )}`
//                       }
//                       className="absolute inset-0 rounded-full"
//                       tabIndex={-1}
//                       aria-label={`Go to ${cat.name}`}
//                     ></Link>
//                   </div>
//                   <span className="mt-4 text-base md:text-lg font-bold text-blue-900 text-center leading-tight max-w-[140px]">
//                     {cat.name}
//                   </span>
//                 </motion.div>
//               ))}
//             </div>
//             <div className="md:hidden text-center mt-4">
//               <span className="text-xs text-blue-400 font-medium animate-pulse">
//                 Swipe to explore &rarr;
//               </span>
//             </div>
//           </div>

//           {/* --- PART 2: TOP PICKS --- */}
//           <div className="pt-2 pb-6 px-4 bg-[#172b9b]">
//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.3, duration: 0.7 }}
//               className="text-3xl md:text-4xl mt-1 font-serif font-medium text-center text-white mb-4 tracking-tight"
//             >
//               Top Picks: Watch & Shop
//             </motion.h3>

//             <section className="relative">
//               <div className="w-full px-0 md:px-4">
//                 {/* Removed fixed width constraint 'w-80' to allow full width scanning */}
//                 <div className="relative w-full mx-auto">
//                   <div className="relative overflow-hidden">
//                     {/* Centering wrapper */}
//                     <div className="flex justify-center">
//                       {/* Changed w-80 to w-full or max-w-full to utilize space */}
//                       <div className="w-full overflow-hidden">
//                         <div ref={topPicksContainerRef} className="flex">
//                           {topPicksInfinite.map((product: Product, i) => (
//                             <div
//                               key={`${product._id || product.id}-${i}`}
//                               className="flex-shrink-0 w-80 px-2"
//                             >
//                               <div className="block group w-full">
//                                 <Link
//                                   to={`/${product.category}/${
//                                     product._id || product.id
//                                   }`}
//                                   tabIndex={0}
//                                   aria-label={`View details for ${product.name}`}
//                                 >
//                                   {/* Product Card */}
//                                   <div className="bg-[#d9d9d9] rounded-sm transition-all duration-300 overflow-hidden group-hover:shadow-xl transform group-hover:scale-[1.02]">
//                                     <div className="w-full h-80 relative bg-gray-300">
//                                       {product.bestseller && (
//                                         <span className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 text-xs font-bold z-10">
//                                           BESTSELLER
//                                         </span>
//                                       )}
//                                       <img
//                                         src={
//                                           Array.isArray(product.images) &&
//                                           product.images.length > 0
//                                             ? `${API_BASE_URL}${
//                                                 product.images[0].startsWith(
//                                                   "/"
//                                                 )
//                                                   ? product.images[0]
//                                                   : `/${product.images[0]}`
//                                               }`
//                                             : "/placeholder.jpg"
//                                         }
//                                         alt={product.name}
//                                         className="w-full h-full object-cover"
//                                       />
//                                     </div>
//                                     <div className="p-3 bg-white">
//                                       <h4 className="font-bold text-base text-blue-900 truncate">
//                                         {product.name}
//                                       </h4>
//                                       <div className="flex items-center gap-2">
//                                         <span className="text-sm font-bold text-blue-800">
//                                           ₹{product.price}
//                                         </span>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </Link>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     {/* Navigation Buttons */}
//                     <button
//                       onClick={goToPrev}
//                       className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 z-10"
//                       aria-label="Previous slide"
//                     >
//                       <svg
//                         className="w-8 h-8"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 19l-7-7 7-7"
//                         />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={goToNext}
//                       className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 z-10"
//                       aria-label="Next slide"
//                     >
//                       <svg
//                         className="w-8 h-8"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 5l7 7-7 7"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       </motion.section>

//       {/* Why Choose Us Section */}
//       <motion.section
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.6, duration: 0.8 }}
//         className="py-2 px-4 w-full"
//       >
//         <div className="w-full">
//           <div className="bg-[#172b9b] rounded-3xl shadow-xl px-6 py-6 md:px-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
//             <div className="flex-1 text-center md:text-left">
//               <h2 className="font-serif text-3xl md:text-5xl leading-tight">
//                 Why Choose <br /> Nagomi?
//               </h2>
//             </div>
//             <div className="flex-[2] flex justify-center gap-8 md:gap-16 w-full md:w-auto">
//               <div className="flex flex-col items-center gap-4">
//                 <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
//                   <img src="/assured-quality.png" alt="assured-quality" />
//                 </div>
//                 <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
//                   Assured <br /> Quality
//                 </span>
//               </div>
//               <div className="flex flex-col items-center gap-4">
//                 <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
//                   <img src="/custom-fit-blue.png" alt="" />
//                 </div>
//                 <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
//                   Custom <br /> Fit
//                 </span>
//               </div>
//               <div className="flex flex-col items-center gap-4">
//                 <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
//                   <img src="/non-toxic.png" alt="" />
//                 </div>
//                 <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
//                   Non-toxic & <br /> VOC Free
//                 </span>
//               </div>
//             </div>
//             <div className="flex-1 text-center md:text-right">
//               <h2 className="font-serif text-3xl md:text-5xl leading-tight">
//                 Quality <br /> Meets <br /> Personality
//               </h2>
//             </div>
//           </div>
//         </div>
//       </motion.section>
//       <div className="text-center fit-content bg-white rounded-2xl text-gray-700 text-lg md:text-xl font-medium mx-4 py-6">
//         Nagomi draws its essence from the Japanese concept of harmony and
//         tranquility. Inspired by nature’s beauty and the stories etched into
//         every wall, we bring you thoughtfully curated wall designs that
//         transform spaces into sanctuaries of peace and style
//       </div>
//       {/* Transform Your Space Today Section */}
//       <motion.section
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.9, duration: 0.8 }}
//         className="py-2 px-4 w-full"
//       >
//         <div className="w-full rounded-3xl shadow-xl bg-white border border-blue-100 relative">
//           <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
//           <div className="pt-6 pb-8 px-8">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 1.0, duration: 0.7 }}
//               className="text-2xl md:text-3xl font-bold text-left mb-6 text-blue-900 tracking-tight relative font-seasons flex items-center justify-center"
//             >
//               Transform Your Space Today
//             </motion.h2>
//             <div className="relative w-full mx-auto">
//               <div className="relative overflow-hidden">
//                 <div className="flex justify-center">
//                   <div className="w-full overflow-hidden">
//                     <div ref={transformContainerRef} className="flex">
//                       {featuredInfinite.map((product: Product, i) => (
//                         <div
//                           key={`${product._id || product.id}-${i}`}
//                           className="flex-shrink-0 w-80 px-2"
//                         >
//                           <div className="block group w-full">
//                             <Link
//                               to={`${product.category}/${
//                                 product._id || product.id
//                               }`}
//                               tabIndex={0}
//                               aria-label={`View details for ${product.name}`}
//                             >
//                               <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-300 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300 transform scale-90 group-hover:scale-95">
//                                 <div className="w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center mb-4 relative">
//                                   {product.bestseller && (
//                                     <span
//                                       style={{ display: "none" }}
//                                       className=" absolute top-2 left-2 bg-[#172b9b] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10"
//                                     >
//                                       Bestseller
//                                     </span>
//                                   )}
//                                   <img
//                                     src={
//                                       Array.isArray(product.images) &&
//                                       product.images.length > 0
//                                         ? `${API_BASE_URL}${
//                                             product.images[0].startsWith("/")
//                                               ? product.images[0]
//                                               : `/${product.images[0]}`
//                                           }`
//                                         : "/placeholder.jpg"
//                                     }
//                                     alt={product.name}
//                                     className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
//                                   />
//                                 </div>
//                                 <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2 text-center line-clamp-2">
//                                   {product.name}
//                                 </h4>
//                                 <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">
//                                   {product.description || " "}
//                                 </p>
//                                 <div className="flex items-center gap-2 mb-2">
//                                   <span className="text-xl font-bold text-blue-700">
//                                     ₹{product.price}
//                                   </span>
//                                   {parseInt(product.originalPrice) && (
//                                     <span className="text-base text-blue-300 line-through">
//                                       ₹{parseInt(product.originalPrice)}
//                                     </span>
//                                   )}
//                                 </div>
//                                 <span className="mt-2 px-5 py-2 rounded-full bg-[#172b9b] text-white font-semibold text-sm shadow-sm">
//                                   Buy Now
//                                 </span>
//                               </div>
//                             </Link>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={goToTransformPrev}
//                   className="absolute left-0 top-1/2 transform text-bold -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
//                   aria-label="Previous slide"
//                 >
//                   <svg
//                     className="w-6 h-6 text-blue-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={goToTransformNext}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 z-10"
//                   aria-label="Next slide"
//                 >
//                   <svg
//                     className="w-6 h-6 text-blue-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.section>
//     </div>
//   );
// }


import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product, Review } from "../types";
import { API_BASE_URL } from "../api/config";
import { motion } from "framer-motion";

// --- Helper: Convert YouTube URL to Embed URL ---
const getYouTubeEmbedUrl = (url: string) => {
  try {
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }

    if (videoId) {
      // Autoplay, Mute, Loop, No Controls
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0`;
    }
    return null;
  } catch (e) {
    return null;
  }
};

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

const CLONE_COUNT = 6;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topPicksScroll, setTopPicksScroll] = useState(CLONE_COUNT);
  const [transformScroll, setTransformScroll] = useState(CLONE_COUNT);
  const [testimonialsScroll, setTestimonialsScroll] = useState(CLONE_COUNT);

  const [products, setProducts] = useState<Product[]>([]);
  const topPicksContainerRef = useRef<HTMLDivElement>(null);
  const transformContainerRef = useRef<HTMLDivElement>(null);
  const testimonialsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  // --- Derived product lists ---
  const bestsellers: Product[] = useMemo(
    () => products.filter((p) => p.bestseller).slice(0, 15),
    [products]
  );
  const fallback: Product[] = useMemo(() => products.slice(0, 15), [products]);
  const featured: Product[] = useMemo(() => {
    return bestsellers.length > 0 ? bestsellers : fallback;
  }, [bestsellers, fallback]);

  // Filter strictly by 'topPick' property
  const topPicks: Product[] = useMemo(() => {
    return products.filter((p) => p.topPick === true);
  }, [products]);

  // Shop categories data
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
      image: "/soon", 
    },
  ];

  // Helper to create robust infinite arrays
  const createInfiniteArray = (items: any[]) => {
    if (items.length === 0) return [];
    let source = items;
    if (items.length < CLONE_COUNT) {
      source = [...items, ...items, ...items];
    }
    return [
      ...source.slice(-CLONE_COUNT),
      ...source,
      ...source.slice(0, CLONE_COUNT),
    ];
  };

  const topPicksInfinite = useMemo(
    () => createInfiniteArray(topPicks),
    [topPicks]
  );
  const featuredInfinite = useMemo(
    () => createInfiniteArray(featured),
    [featured]
  );
  
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

  // --- Infinite Scroll Logic ---
  const handleInfiniteScroll = (
    currentIndex: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>,
    containerRef: React.RefObject<HTMLDivElement>,
    items: any[],
    cardWidth: number,
    gap: number
  ) => {
    const realLength = items.length - 2 * CLONE_COUNT;
    const maxIndex = realLength + CLONE_COUNT;

    if (currentIndex >= maxIndex || currentIndex <= CLONE_COUNT - 1) {
      const timer = setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          container.style.transition = "none";
          let resetIndex;
          if (currentIndex >= maxIndex) {
            resetIndex = CLONE_COUNT;
          } else {
            resetIndex = realLength + CLONE_COUNT - 1;
          }
          scrollToItem(containerRef, resetIndex, cardWidth, gap);
          setIndex(resetIndex);
          requestAnimationFrame(() => {
            if (container) container.style.transition = "";
          });
        }
      }, 700); 
      return timer;
    }
    return null;
  };

  // 1. Top Picks Carousel Effect
  useEffect(() => {
    if (topPicksInfinite.length === 0) return;
    scrollToItem(topPicksContainerRef, topPicksScroll, 320, 16);

    const interval = setInterval(
      () => setTopPicksScroll((prev) => prev + 1),
      4000
    );
    const resetTimer = handleInfiniteScroll(
      topPicksScroll,
      setTopPicksScroll,
      topPicksContainerRef,
      topPicksInfinite,
      320,
      16
    );

    return () => {
      clearInterval(interval);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [topPicksScroll, topPicksInfinite]);

  // 2. Transform (Featured) Carousel Effect
  useEffect(() => {
    if (featuredInfinite.length === 0) return;
    scrollToItem(transformContainerRef, transformScroll, 320, 16);

    const interval = setInterval(
      () => setTransformScroll((prev) => prev + 1),
      4000
    );
    const resetTimer = handleInfiniteScroll(
      transformScroll,
      setTransformScroll,
      transformContainerRef,
      featuredInfinite,
      320,
      16
    );

    return () => {
      clearInterval(interval);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [transformScroll, featuredInfinite]);


  const goToNext = () => setTopPicksScroll((prev) => prev + 1);
  const goToPrev = () => setTopPicksScroll((prev) => prev - 1);
  const goToTransformNext = () => setTransformScroll((prev) => prev + 1);
  const goToTransformPrev = () => setTransformScroll((prev) => prev - 1);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#d9d9d9]">
      {/* --- BESTSELLER BANNER VIDEO SECTION --- */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-2 px-4 w-full"
      >
        <div className="relative w-full h-auto bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
          <video
            src="public\home vdos\BestSellerBanner.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto block"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
              className="hidden md:block absolute md:top-10 w-full text-center px-4"
            >
              <h2 className="text-[#172b9b] flex-col font-serif font-semibold text-2xl md:text-5xl leading-tight drop-shadow-md">
                Every wall has a story, <br />
                <span className="text-[#172b9b] font-serif font-semibold text-2xl md:text-5xl leading-tight drop-shadow-md">
                  Let Us Craft Yours.
                </span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="flex justify-center items-center"
            >
              <Link to="/wallpapers" className="z-20">
                <button className="bg-[#172b9b] mb-[55vh] text-white font-serif text-lg md:text-xl px-4 py-3 rounded-full shadow-xl hover:bg-blue-800 hover:scale-105 transition-all duration-300 cursor-pointer">
                  Explore Designs
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* --- BESTSELLER BANNER ENDS --- */}

      {/* --- MERGED SECTION: Shop by Category & Top Picks --- */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="py-2 px-4 w-full"
      >
        <div className="w-full rounded-3xl shadow-xl bg-white border border-blue-100 relative overflow-hidden">
          {/* --- PART 1: SHOP BY CATEGORY --- */}
          <div className="pt-4 pb-2 px-4 md:px-8 bg-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-3xl md:text-4xl font-serif font-medium text-center text-blue-900 mb-6 tracking-tight"
            >
              Shop by Category
            </motion.h2>

            <div
              className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 md:gap-8 pb-4 md:pb-0 px-2 md:px-0 snap-x snap-mandatory justify-items-center [&::-webkit-scrollbar]:hidden"
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
                          : `/wallpapers?category=${encodeURIComponent(cat.name)}`
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
            <div className="md:hidden text-center mt-4">
              <span className="text-xs text-blue-400 font-medium animate-pulse">
                Swipe to explore &rarr;
              </span>
            </div>
          </div>

          {/* --- PART 2: TOP PICKS --- */}
          <div className="pt-2 pb-6 px-4 bg-[#172b9b]">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-3xl md:text-4xl mt-1 font-serif font-medium text-center text-white mb-4 tracking-tight"
            >
              Top Picks: Watch & Shop
            </motion.h3>

            {/* --- CHECK IF TOP PICKS EXIST --- */}
            {topPicks.length === 0 ? (
               // --- FALLBACK MESSAGE IF NO PRODUCTS FOUND ---
               <div className="flex justify-center items-center h-48">
                 <p className="text-white text-lg md:text-xl font-medium opacity-90">
                   Sorry, no Top Picks found at the moment.
                 </p>
               </div>
            ) : (
              // --- RENDER CAROUSEL IF PRODUCTS EXIST ---
              <section className="relative">
                <div className="w-full px-0 md:px-4">
                  <div className="relative w-full mx-auto">
                    <div className="relative overflow-hidden">
                      <div className="flex justify-center">
                        <div className="w-full overflow-hidden">
                          <div ref={topPicksContainerRef} className="flex">
                            {topPicksInfinite.map((product: Product, i) => {
                              // CHECK FOR YOUTUBE LINK
                              const youtubeUrl = Array.isArray(product.images)
                                ? product.images.find(
                                    (img) =>
                                      img.includes("youtube.com") ||
                                      img.includes("youtu.be")
                                  )
                                : null;
                              const embedUrl = youtubeUrl
                                ? getYouTubeEmbedUrl(youtubeUrl)
                                : null;

                              return (
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
                                      {/* Product Card */}
                                      <div className="bg-[#d9d9d9] rounded-sm transition-all duration-300 overflow-hidden group-hover:shadow-xl transform group-hover:scale-[1.02]">
                                        <div className="w-full h-80 relative bg-gray-300">
                                          {product.bestseller && (
                                            <span className="absolute top-2 left-2 bg-blue-900 text-white px-2 py-1 text-xs font-bold z-10">
                                              BESTSELLER
                                            </span>
                                          )}

                                          {/* --- MEDIA DISPLAY LOGIC --- */}
                                          {embedUrl ? (
                                            <div className="w-full h-full pointer-events-none">
                                              <iframe
                                                src={embedUrl}
                                                className="w-full h-full object-cover"
                                                title={product.name}
                                                frameBorder="0"
                                                allow="autoplay; encrypted-media"
                                              ></iframe>
                                            </div>
                                          ) : (
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
                                              // Fallback for image error
                                              onError={(e) => {
                                                  const target = e.target as HTMLImageElement;
                                                  target.onerror = null; 
                                                  target.src = "/placeholder.jpg";
                                              }}
                                            />
                                          )}
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
                              );
                            })}
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
            )}
            {/* --- END TOP PICKS CONDITION --- */}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="py-2 px-4 w-full"
      >
        <div className="w-full">
          <div className="bg-[#172b9b] rounded-3xl shadow-xl px-6 py-6 md:px-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                Why Choose <br /> Nagomi?
              </h2>
            </div>
            <div className="flex-[2] flex justify-center gap-8 md:gap-16 w-full md:w-auto">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
                  <img src="/assured-quality.png" alt="assured-quality" />
                </div>
                <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
                  Assured <br /> Quality
                </span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
                  <img src="/custom-fit-blue.png" alt="" />
                </div>
                <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
                  Custom <br /> Fit
                </span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center p-2">
                  <img src="/non-toxic.png" alt="" />
                </div>
                <span className="text-center font-sans font-medium text-sm md:text-base leading-snug">
                  Non-toxic & <br /> VOC Free
                </span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                Quality <br /> Meets <br /> Personality
              </h2>
            </div>
          </div>
        </div>
      </motion.section>
      <div className="text-center fit-content bg-white rounded-2xl text-gray-700 text-lg md:text-xl font-medium mx-4 py-6">
        Nagomi draws its essence from the Japanese concept of harmony and
        tranquility. Inspired by nature’s beauty and the stories etched into
        every wall, we bring you thoughtfully curated wall designs that
        transform spaces into sanctuaries of peace and style
      </div>
      {/* Transform Your Space Today Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="py-2 px-4 w-full"
      >
        <div className="w-full rounded-3xl shadow-xl bg-white border border-blue-100 relative">
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
          <div className="pt-6 pb-8 px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-left mb-6 text-blue-900 tracking-tight relative font-seasons flex items-center justify-center"
            >
              Transform Your Space Today
            </motion.h2>
            <div className="relative w-full mx-auto">
              <div className="relative overflow-hidden">
                <div className="flex justify-center">
                  <div className="w-full overflow-hidden">
                    <div ref={transformContainerRef} className="flex">
                      {featuredInfinite.map((product: Product, i) => {
                         const youtubeUrl = Array.isArray(product.images)
                         ? product.images.find(
                             (img) =>
                               img.includes("youtube.com") ||
                               img.includes("youtu.be")
                           )
                         : null;
                       const embedUrl = youtubeUrl
                         ? getYouTubeEmbedUrl(youtubeUrl)
                         : null;
                        
                        return (
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
                                    <span
                                      style={{ display: "none" }}
                                      className=" absolute top-2 left-2 bg-[#172b9b] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10"
                                    >
                                      Bestseller
                                    </span>
                                  )}
                                  
                                  {embedUrl ? (
                                    <div className="w-full h-full pointer-events-none">
                                      <iframe
                                        src={embedUrl}
                                        className="w-full h-full object-cover"
                                        title={product.name}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                      ></iframe>
                                    </div>
                                  ) : (
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
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; 
                                        target.src = "/placeholder.jpg";
                                    }}
                                  />
                                  )}

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
                                  {parseInt(product.originalPrice) && (
                                    <span className="text-base text-blue-300 line-through">
                                      ₹{parseInt(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                <span className="mt-2 px-5 py-2 rounded-full bg-[#172b9b] text-white font-semibold text-sm shadow-sm">
                                  Buy Now
                                </span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      )})}
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
