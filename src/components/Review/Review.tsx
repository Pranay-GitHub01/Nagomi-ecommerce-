// src/components/Reviews/ReviewSection.tsx

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Review } from '../../types'; // Adjust path as needed
import { API_BASE_URL } from '../../api/config'; // If needed for images

// --- Hardcoded Reviews Data ---
const reviewsData: Review[] = [
  {
    _id: "revAnkita",
    author: "Ankita Bali",
    rating: 5, // Example Rating
    createdAt: "2025-10-23T10:00:00Z", // Example Date
    comment: "Absolutely loved the wallpaper we got from Nagomi! The design was elegant, the installation was seamless, and the team was incredibly friendly and helpful throughout. Highly recommend them for anyone looking to transform their walls beautifully.",
    images: ["/reviews/Ankita Bali/ankita_image1.webp"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Elegant Design!"
  },
  {
    _id: "revAditya",
    author: "Aditya Agrawal",
    rating: 5,
    createdAt: "2025-10-22T10:00:00Z",
    comment: "Got a complete makeover done with Nagomi wallpaper and mouldings. The results are top-notch. Their design inputs were really thoughtful and I highly recommend their service.",
    images: ["/reviews/Aditya Agrawal/aditya_image.png"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Top-Notch Makeover"
  },
  {
    _id: "revSakshi",
    author: "Sakshi J",
    rating: 5,
    createdAt: "2025-10-21T10:00:00Z",
    comment: "Beautiful wallpapers and a completely seamless experience, from measurement to final installation. Highly recommend Nagomi for anyone looking for beautiful, custom wallpapers. The designs are refreshing, and their team ensures every little detail is executed well. Plus, the installation team was super professional.",
    images: ["/reviews/Sakshi J/sakshi_photo1.webp", "/reviews/Sakshi J/sakshi_photo2.webp"], // Replace with actual filenames
    verifiedPurchase: true,
    title: "Seamless Experience"
  },
  {
    _id: "revRohsni",
    author: "Rohsni Kaur", // Corrected spelling based on folder if needed
    rating: 5,
    createdAt: "2025-10-20T10:00:00Z",
    comment: "What a difference good wallpaper makes! Thanks to Nagomi, our home feels serene and stylish. The entire process from selecting the design to the final installation was smooth and professional.",
    images: ["/reviews/Roshni Kaur/roshni_image.jpg"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Serene and Stylish"
  },
  {
    _id: "revApar",
    author: "Apar Goel", // Corrected spelling based on folder if needed
    rating: 5,
    createdAt: "2025-10-19T10:00:00Z",
    comment: "I didn’t want just paint on my walls and Nagomi gave me the perfect solution. Their customized wallpaper brought character and charm into my home.",
    images: ["/reviews/Apaar Goel/apaar_review_pic.webp"], // Replace with actual filename
    verifiedPurchase: false, // Example
    title: "Perfect Solution"
  },
  {
   _id: "revBhumika",
    author: "Bhumika Bairagi",
    rating: 4, // Example
    createdAt: "2025-10-18T10:00:00Z",
    comment: "Super impressed with the variety of wallpaper designs Nagomi offers. We found the perfect one for our new home.",
    images: ["/reviews/Bhumika Bairagi/bhumika_wallpaper.png"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Great Variety"
  },
   {
   _id: "revApurva",
    author: "Apurva Verma",
    rating: 5,
    createdAt: "2025-10-17T10:00:00Z",
    comment: "Just got wallpaper and mouldings installed from Nagomi and the finish is so classy. Loved the variety they offer and how helpful their team is. Great quality!",
    images: ["/reviews/Apurva Verma/apurva_photo.webp"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Classy Finish"
  },
   {
   _id: "revAgrima",
    author: "Agrima Agarwal",
    rating: 5,
    createdAt: "2025-10-16T10:00:00Z",
    comment: "Nagomi is the best when it comes to wall decor. We got our wallpaper and mouldings done and the results exceeded our expectations. Polished work and a very responsive team! Loved it:)",
    images: ["/reviews/Agrima Agarwal/agrima_img1.jpg", "/reviews/Agrima Agarwal/agrima_img2.jpg"], // Replace with actual filenames
    verifiedPurchase: true,
    title: "Exceeded Expectations"
  },
  {
   _id: "revAvani",
    author: "Avani Malani",
    rating: 5,
    createdAt: "2025-10-15T10:00:00Z",
    comment: "Had a great experience with Nagomi. They created a soft, nature-inspired wallpaper for our bedroom and lobby. The team was professional and sensitive to our requests.",
    images: ["/reviews/Avani Malani/avani_bedroom.webp"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Great Experience"
  },
  {
   _id: "revAshmit",
    author: "Ashmit Bhandari",
    rating: 5,
    createdAt: "2025-10-14T10:00:00Z",
    comment: "Nagomi helped us select and install wallpaper for our bedroom and pooja room and it has such a serene, divine vibe now. So grateful for their design suggestions.",
    images: ["/reviews/Ashmit Bhandari/unnamed.webp", "/reviews/Ashmit Bhandari/unnamed (1).webp"],
    verifiedPurchase: true,
    title: "Serene Vibe"
  },
   {
   _id: "revAshima",
    author: "Ashima Jain",
    rating: 5,
    createdAt: "2025-10-13T10:00:00Z",
    comment: "Got our master bedroom wallpaper done by Nagomi and we’re in love with how peaceful the room feels now. The installation was on time and totally mess-free.",
    images: ["/reviews/Ashima Jain/ashima_master_bedroom.png"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Peaceful Room"
  },
  {
   _id: "revIshita",
    author: "Ishita Taneja",
    rating: 5,
    createdAt: "2025-10-12T10:00:00Z",
    comment: "Everything from consultation to final touches was handled so professionally by Nagomi. The wallpaper has given our living room a hotel-like look.",
    images: ["/reviews/Ishita Taneja/ishita_living_room.webp"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Professional Service"
  },
  {
   _id: "revAnirudh",
    author: "Anirudh V R",
    rating: 5,
    createdAt: "2025-10-11T10:00:00Z",
    comment: "Our room looks magical now thanks to Nagomi’s 3D wallpaper. The team really went above and beyond to make sure everything was just right.",
    images: ["/reviews/Anirudh V R/anirudh_3d.jpg"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Magical 3D Wallpaper"
  },
   {
   _id: "revSanjita",
    author: "Sanjita Israni",
    rating: 4, // Example
    createdAt: "2025-10-10T10:00:00Z",
    comment: "Nagomi helped do my foyer and bedroom beautifuly. Team was prompt and service on time thi. Thank u ji.",
    images: ["/reviews/sanjita israni/unnamed.webp"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Beautiful Foyer"
  },
   {
   _id: "revAbhishek",
    author: "Abhishek Yadav",
    rating: 5,
    createdAt: "2025-10-09T10:00:00Z",
    comment: "Most Trusted company.. Very satisfying results after installation.",
    images: ["/reviews/abhishek yadav/unnamed.webp","/reviews/abhishek yadav/unnamed (2).webp"], // Replace with actual filename
    verifiedPurchase: true,
    title: "Satisfying Results"
  },
  {
    _id: "revSaketh",
    author: "Saketh Boddu",
    rating: 5,
    createdAt: "2025-10-08T10:00:00Z",
    comment: "Great designs that make the house feel more homely. They coordinate very well and have executed it really fast. Highly recommended!",
    images: [], // No image provided
    verifiedPurchase: true,
    title: "Homely Designs"
  },
  {
    _id: "revAvi",
    author: "Avi Gupta",
    rating: 5,
    createdAt: "2025-10-07T10:00:00Z",
    comment: "Nagomi’s wallpaper totally elevated the look of our living room. Their team was proactive, creative, and always respectful of our time.",
     images: [], // No image provided
     verifiedPurchase: true,
     title: "Elevated Look"
  },
  {
    _id: "revRajat",
    author: "Rajat Chopra",
    rating: 5,
    createdAt: "2025-10-06T10:00:00Z",
    comment: "Loved the services provided by the team. From wallpaper selection to execution, the process was very seamless. I didn't have to go through the hassle of following up as Prakriti was very proactive and made sure to keep me posted all throughout.",
     images: [], // No image provided
     verifiedPurchase: true,
     title: "Seamless Process"
  },
  {
    _id: "revSai",
    author: "Sai Veeksana",
    rating: 5,
    createdAt: "2025-10-05T10:00:00Z",
    comment: "Very beautiful . Got wallpapers done for our house and they were exactly as shown. Loved the colors and the quality.",
     images: [], // No image provided
     verifiedPurchase: true,
     title: "Beautiful Quality"
  },
  {
    _id: "revPranay",
    author: "Pranay Goel",
    rating: 5,
    createdAt: "2025-10-04T10:00:00Z",
    comment: "Prakriti is an expert in what she does. I discovered her on Instagram and after that it was a smooth journey. She understood my requirements, checked the walls, gave me a few options and got my desired wallpaper installed on the wall. It felt really effortless. Highly recommend :)",
     images: [], // No image provided
     verifiedPurchase: true,
     title: "Expert Service"
  }
];
// --- End Hardcoded Data ---

// Helper: Format Date (Unchanged)
const formatDate = (dateString: string): string => { /* ... */
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short', // Use 'short' for abbreviated month like "Oct"
      year: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Helper: Star Rating (Unchanged)
const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 4 }) => { /* ... */
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={`w-${size} h-${size} fill-current`} />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`w-${size} h-${size} text-gray-300 fill-current`} />
      ))}
    </div>
  );
};

// Helper: Normalize Image URL (Unchanged)
const normalizeImageUrl = (url: string) => { /* ... */
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http') || url.startsWith('/')) return url; // Root relative or absolute
    // Needs adjustment if API_BASE_URL is required and paths are not root-relative
    return `/${url}`; // Assume root relative if just filename/folder
    // return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

// Props Interface - REMOVED 'reviews' prop
interface ReviewSectionProps {
  // reviews: Review[]; // <-- REMOVED
  averageRating?: number; // Keep optional props if you want to pass them
  totalReviews?: number;
  productId?: string;
  productName?: string;
  onWriteReviewClick?: () => void;
  onViewAllClick?: () => void;
}

import { useMemo } from 'react';

// Main Component - REMOVED 'reviews' from destructuring
const ReviewSection: React.FC<ReviewSectionProps> = ({
  // reviews = [], // <-- REMOVED
  averageRating, // Use passed average or calculate locally
  totalReviews, // Use passed total or calculate locally
  productId,
  productName,
  onWriteReviewClick,
  onViewAllClick,
}) => {
  // Use the hardcoded data
  const reviews = reviewsData;

  // Calculate local average and total if not provided via props
  const localTotalReviews = reviews.length;
  const localAverageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  // Use props if available, otherwise use locally calculated values
  const displayTotalReviews = totalReviews !== undefined ? totalReviews : localTotalReviews;
  const displayAverageRating = averageRating !== undefined ? averageRating : localAverageRating;


  return (
    <div className="mt-16 md:mt-20 py-12 bg-white border-t border-gray-200"> {/* Changed to white bg */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* --- Left Column: Summary --- */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
            <h2 className="text-2xl font-bold text-[#172b9b] mb-4 font-seasons">
              Reviews
            </h2>
            {/* Display summary */}
            {displayTotalReviews > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-5xl font-bold text-gray-800">{displayAverageRating.toFixed(1)}</span>
                  <StarRating rating={displayAverageRating} size={6} />
                </div>
                <p className="text-sm text-gray-500 mb-8">
                  Based on {displayTotalReviews} reviews
                </p>
              </>
            ) : (
                <p className="text-sm text-gray-500 mb-8">No reviews yet.</p>
            )}
            <h3 className="font-semibold text-gray-700 mb-1 text-base">Review this product</h3>
            <p className="text-sm text-gray-500 mb-4">
              Share your thoughts with other customers
            </p>
            {/* "Write a Review" button */}
            {onWriteReviewClick && (
              <button
                onClick={onWriteReviewClick}
                className="w-full md:w-auto border border-gray-400 text-gray-800 px-6 py-2.5 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* --- Right Column: Review List --- */}
          <div className="md:col-span-2 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                // Individual review card/section
                <div key={review._id} className="pb-6 border-b border-gray-200 last:border-b-0">
                  {/* Review Header */}
                  <div className="flex items-center gap-2 mb-1">
                     <StarRating rating={review.rating} size={4} />
                     <span className="font-semibold text-gray-800 text-sm">{review.author || 'Anonymous'}</span>
                  </div>
                  {/* Verified Purchase and Date line */}
                  {(review.verifiedPurchase || review.createdAt) && (
                    <div className="flex items-center gap-1 text-xs mb-2">
                        {review.verifiedPurchase && (
                            <>
                                <CheckCircle className="w-3 h-3 text-green-600"/>
                                <span className="text-green-700">Verified Purchase</span>
                                <span className="text-gray-400 mx-1">|</span>
                            </>
                        )}
                        {review.createdAt && (
                           <span className="text-gray-500">Reviewed on {formatDate(review.createdAt)}</span>
                        )}
                    </div>
                  )}

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-semibold text-gray-700 text-base mb-1">{review.title}</h4>
                  )}

                  {/* Review Comment */}
                  <p className="text-gray-600 text-sm leading-relaxed font-lora mb-3">
                    {review.comment}
                  </p>

                  {/* Image Thumbnails */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.images.map((imgUrl, index) => (
                        <a
                          key={index}
                          href={normalizeImageUrl(imgUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={normalizeImageUrl(imgUrl)}
                            alt={`Review image ${index + 1} by ${review.author}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none'; // Hide broken image
                                // You could replace parent with placeholder icon if needed
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Message when no reviews exist in the hardcoded data
              <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <p className='font-semibold'>No reviews available.</p>
              </div>
            )}

            {/* "View All" Button */}
            {onViewAllClick && displayTotalReviews > reviews.length && (
               <div className="mt-8 text-center">
                  <button
                     onClick={onViewAllClick}
                     className="w-full md:w-auto bg-[#172b9b] text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                     View all reviews ({displayTotalReviews}) {/* Optionally show total */}
                  </button>
               </div>
            )}
             {/* Simple link if all hardcoded reviews are shown */}
             {onViewAllClick && displayTotalReviews > 0 && displayTotalReviews <= reviews.length && (
                 <div className="mt-8 text-center">
                    <button
                        onClick={onViewAllClick}
                        className="text-blue-600 hover:text-blue-800 font-medium underline text-sm"
                    >
                        View all reviews
                    </button>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;