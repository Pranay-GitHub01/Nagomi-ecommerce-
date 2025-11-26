// // src/components/Reviews/ReviewSection.tsx

// import React, { useState, useMemo } from 'react';
// import { Star, CheckCircle, X } from 'lucide-react';
// // Assuming 'Review' type is available from the path below
// import { Review } from '../../types'; 
// import { API_BASE_URL } from '../../api/config'; // Keeping API_BASE_URL reference

// // --- Hardcoded Reviews Data ---
// const reviewsData: Review[] = [
//   { _id: "revAnkita", author: "Ankita Bali", rating: 5, createdAt: "2025-10-23T10:00:00Z", comment: "Absolutely loved the wallpaper we got from Nagomi! The design was elegant, the installation was seamless, and the team was incredibly friendly and helpful throughout. Highly recommend them for anyone looking to transform their walls beautifully.", images: ["/reviews/ankita bali/ankita_image3.webp","/reviews/ankita bali/ankita_image1.webp","/reviews/ankita bali/ankita_image2.webp"], verifiedPurchase: true, title: "Elegant Design!" },
//   { _id: "revAditya", author: "Aditya Agrawal", rating: 5, createdAt: "2025-10-22T10:00:00Z", comment: "Got a complete makeover done with Nagomi wallpaper and mouldings. The results are top-notch. Their design inputs were really thoughtful and I highly recommend their service.", images: ["/reviews/aditya agrawal/aditya_image.png","/reviews/aditya agrawal/aditya_image1.png","/reviews/aditya agrawal/aditya_image3.png","/reviews/aditya agrawal/aditya_image4.png"], verifiedPurchase: true, title: "Top-Notch Makeover" },
//   { _id: "revSakshi", author: "Sakshi J", rating: 5, createdAt: "2025-10-21T10:00:00Z", comment: "Beautiful wallpapers and a completely seamless experience, from measurement to final installation. Highly recommend Nagomi for anyone looking for beautiful, custom wallpapers. The designs are refreshing, and their team ensures every little detail is executed well. Plus, the installation team was super professional.", images: ["/reviews/sakshi j/sakshi_photo1.webp", "/reviews/sakshi j/sakshi_photo2.webp","/reviews/sakshi j/sakshi_photo3.webp"], verifiedPurchase: true, title: "Seamless Experience" },
//   { _id: "revRohsni", author: "Rohsni Kaur", rating: 5, createdAt: "2025-10-20T10:00:00Z", comment: "What a difference good wallpaper makes! Thanks to Nagomi, our home feels serene and stylish. The entire process from selecting the design to the final installation was smooth and professional.", images: ["/reviews/roshni kaur/roshni_image.jpg","/reviews/roshni kaur/roshni_image1.jpg"], verifiedPurchase: true, title: "Serene and Stylish" },
//   { _id: "revApar", author: "Apar Goel", rating: 5, createdAt: "2025-10-19T10:00:00Z", comment: "I didn’t want just paint on my walls and Nagomi gave me the perfect solution. Their customized wallpaper brought character and charm into my home.", images: ["/reviews/Apaar Goel/apaar_review_pic.webp"], verifiedPurchase: false, title: "Perfect Solution" },
//   { _id: "revBhumika", author: "Bhumika Bairagi", rating: 4, createdAt: "2025-10-18T10:00:00Z", comment: "Super impressed with the variety of wallpaper designs Nagomi offers. We found the perfect one for our new home.", images: ["/reviews/Bhumika Bairagi/bhumika_wallpaper.png"], verifiedPurchase: true, title: "Great Variety" },
//   { _id: "revApurva", author: "Apurva Verma", rating: 5, createdAt: "2025-10-17T10:00:00Z", comment: "Just got wallpaper and mouldings installed from Nagomi and the finish is so classy. Loved the variety they offer and how helpful their team is. Great quality!", images: ["/reviews/Apurva Verma/apurva_photo.webp"], verifiedPurchase: true, title: "Classy Finish" },
//   { _id: "revAgrima", author: "Agrima Agarwal", rating: 5, createdAt: "2025-10-16T10:00:00Z", comment: "Nagomi is the best when it comes to wall decor. We got our wallpaper and mouldings done and the results exceeded our expectations. Polished work and a very responsive team! Loved it:)", images: ["/reviews/Agrima Agarwal/agrima_img1.jpg", "/reviews/Agrima Agarwal/agrima_img2.jpg"], verifiedPurchase: true, title: "Exceeded Expectations" },
//   { _id: "revAvani", author: "Avani Malani", rating: 5, createdAt: "2025-10-15T10:00:00Z", comment: "Had a great experience with Nagomi. They created a soft, nature-inspired wallpaper for our bedroom and lobby. The team was professional and sensitive to our requests.", images: ["/reviews/Avani Malani/avani_bedroom.webp"], verifiedPurchase: true, title: "Great Experience" },
//   { _id: "revAshmit", author: "Ashmit Bhandari", rating: 5, createdAt: "2025-10-14T10:00:00Z", comment: "Nagomi helped us select and install wallpaper for our bedroom and pooja room and it has such a serene, divine vibe now. So grateful for their design suggestions.", images: ["/reviews/Ashmit Bhandari/unnamed.webp", "/reviews/Ashmit Bhandari/unnamed (1).webp"], verifiedPurchase: true, title: "Serene Vibe" },
//   { _id: "revAshima", author: "Ashima Jain", rating: 5, createdAt: "2025-10-13T10:00:00Z", comment: "Got our master bedroom wallpaper done by Nagomi and we’re in love with how peaceful the room feels now. The installation was on time and totally mess-free.", images: ["/reviews/Ashima Jain/ashima_master_bedroom.png"], verifiedPurchase: true, title: "Peaceful Room" },
//   { _id: "revIshita", author: "Ishita Taneja", rating: 5, createdAt: "2025-10-12T10:00:00Z", comment: "Everything from consultation to final touches was handled so professionally by Nagomi. The wallpaper has given our living room a hotel-like look.", images: ["/reviews/Ishita Taneja/ishita_living_room.webp"], verifiedPurchase: true, title: "Professional Service" },
//   { _id: "revAnirudh", author: "Anirudh V R", rating: 5, createdAt: "2025-10-11T10:00:00Z", comment: "Our room looks magical now thanks to Nagomi’s 3D wallpaper. The team really went above and beyond to make sure everything was just right.", images: ["/reviews/Anirudh V R/anirudh_3d.jpg"], verifiedPurchase: true, title: "Magical 3D Wallpaper" },
//   { _id: "revSanjita", author: "Sanjita Israni", rating: 4, createdAt: "2025-10-10T10:00:00Z", comment: "Nagomi helped do my foyer and bedroom beautifuly. Team was prompt and service on time thi. Thank u ji.", images: ["/reviews/sanjita israni/unnamed.webp"], verifiedPurchase: true, title: "Beautiful Foyer" },
//   { _id: "revAbhishek", author: "Abhishek Yadav", rating: 5, createdAt: "2025-10-09T10:00:00Z", comment: "Most Trusted company.. Very satisfying results after installation.", images: ["/reviews/abhishek yadav/unnamed.webp","/reviews/abhishek yadav/unnamed (2).webp"], verifiedPurchase: true, title: "Satisfying Results" },
//   { _id: "revSaketh", author: "Saketh Boddu", rating: 5, createdAt: "2025-10-08T10:00:00Z", comment: "Great designs that make the house feel more homely. They coordinate very well and have executed it really fast. Highly recommended!", images: [], verifiedPurchase: true, title: "Homely Designs" },
//   { _id: "revAvi", author: "Avi Gupta", rating: 5, createdAt: "2025-10-07T10:00:00Z", comment: "Nagomi’s wallpaper totally elevated the look of our living room. Their team was proactive, creative, and always respectful of our time.", images: [], verifiedPurchase: true, title: "Elevated Look" },
//   { _id: "revRajat", author: "Rajat Chopra", rating: 5, createdAt: "2025-10-06T10:00:00Z", comment: "Loved the services provided by the team. From wallpaper selection to execution, the process was very seamless. I didn't have to go through the hassle of following up as Prakriti was very proactive and made sure to keep me posted all throughout.", images: [], verifiedPurchase: true, title: "Seamless Process" },
//   { _id: "revSai", author: "Sai Veeksana", rating: 5, createdAt: "2025-10-05T10:00:00Z", comment: "Very beautiful . Got wallpapers done for our house and they were exactly as shown. Loved the colors and the quality.", images: [], verifiedPurchase: true, title: "Beautiful Quality" },
//   { _id: "revPranay", author: "Pranay Goel", rating: 5, createdAt: "2025-10-04T10:00:00Z", comment: "Prakriti is an expert in what she does. I discovered her on Instagram and after that it was a smooth journey. She understood my requirements, checked the walls, gave me a few options and got my desired wallpaper installed on the wall. It felt really effortless. Highly recommend :)", images: [], verifiedPurchase: true, title: "Expert Service" }
// ];
// // --- End Hardcoded Data ---

// // --- Helper: Format Date ---
// const formatDate = (dateString: string): string => { 
//   try {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short', 
//       year: 'numeric',
//     });
//   } catch (e) {
//     return 'Invalid Date';
//   }
// };

// // --- Helper: Star Rating ---
// const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 4 }) => { 
//   const fullStars = Math.floor(rating);
//   const emptyStars = 5 - fullStars;
//   return (
//     <div className="flex items-center text-yellow-400">
//       {[...Array(fullStars)].map((_, i) => (
//         <Star key={`full-${i}`} className={`w-${size} h-${size} fill-current`} />
//       ))}
//       {[...Array(emptyStars)].map((_, i) => (
//         <Star key={`empty-${i}`} className={`w-${size} h-${size} text-gray-300 fill-current`} />
//       ))}
//     </div>
//   );
// };

// // --- Helper: Normalize Image URL ---
// const normalizeImageUrl = (url: string) => { 
//     if (!url) return '/placeholder.jpg';
//     if (url.startsWith('http') || url.startsWith('/')) return url; 
//     return `/${url}`; 
// };

// // --- ReviewForm Component (Modal) ---
// interface ReviewFormProps {
//     onClose: () => void;
//     productId?: string;
//     productName?: string;
// }

// const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, productName = 'the product' }) => {
//     const [selectedRating, setSelectedRating] = useState(5);
//     const [isSubmitting, setIsSubmitting] = useState(false);
    
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         console.log('Submitting Review with rating:', selectedRating);
//         setTimeout(() => {
//             alert('Review submitted successfully! (Simulated)');
//             setIsSubmitting(false);
//             onClose(); 
//         }, 1500);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl relative">
                
//                 {/* Header */}
//                 <div className="flex justify-between items-center border-b pb-3 mb-4">
//                     <h3 className="text-xl font-bold text-[#172b9b]">Write a Review for {productName}</h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
                    
//                     {/* Rating Input */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating*</label>
//                         <div className="flex items-center">
//                             {[1, 2, 3, 4, 5].map((starValue) => (
//                                 <Star 
//                                     key={starValue}
//                                     onClick={() => setSelectedRating(starValue)}
//                                     className={`w-6 h-6 cursor-pointer transition-colors ${
//                                         starValue <= selectedRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
//                                     }`}
//                                 />
//                             ))}
//                         </div>
//                     </div>
                    
//                     {/* Title Input */}
//                     <div>
//                         <label htmlFor="title" className="block text-sm font-medium text-gray-700">Review Title</label>
//                         <input
//                             id="title"
//                             type="text"
                      
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#172b9b] focus:border-[#172b9b]"
//                             placeholder="A short summary of your experience"
//                         />
//                     </div>

//                     {/* Comment Input */}
//                     <div>
//                         <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review*</label>
//                         <textarea
//                             id="comment"
//                             rows={4}
//                             required
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#172b9b] focus:border-[#172b9b]"
//                             placeholder="Tell us about your experience..."
//                         />
//                     </div>
                    
//                     {/* Author/Name Input */}
//                     <div>
//                         <label htmlFor="author" className="block text-sm font-medium text-gray-700">Your Name*</label>
//                         <input
//                             id="author"
//                             type="text"
//                             required
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#172b9b] focus:border-[#172b9b]"
//                             placeholder="Ankita B. or full name"
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
//                             isSubmitting 
//                             ? 'bg-gray-400 cursor-not-allowed' 
//                             : 'bg-[#172b9b] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#172b9b]'
//                         }`}
//                     >
//                         {isSubmitting ? 'Submitting...' : 'Submit Review'}
//                     </button>
//                 </form>

//             </div>
//         </div>
//     );
// };
// // --- END: ReviewForm Component ---


// // Props Interface
// interface ReviewSectionProps {
//   averageRating?: number; 
//   totalReviews?: number;
//   productId?: string;
//   productName?: string;
//   onViewAllClick?: () => void;
// }


// // --- Main ReviewSection Component ---
// const ReviewSection: React.FC<ReviewSectionProps> = ({
//   averageRating, 
//   totalReviews, 
//   productId,
//   productName,
//   onViewAllClick,
// }) => {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const handleWriteReviewClick = () => setIsFormOpen(true);
//   const handleCloseForm = () => setIsFormOpen(false);

//   // Use the hardcoded data
//   const reviews = reviewsData;
  
//   // Define the limit for initial display
//   const DISPLAY_LIMIT = 4;

//   // Use useMemo to get only the first 4 reviews
//   const reviewsToShow = useMemo(() => {
//     return reviews.slice(0, DISPLAY_LIMIT);
//   }, [reviews]);

//   // Calculations for total and average
//   const localTotalReviews = reviews.length;
//   const localAverageRating = useMemo(() => {
//     if (reviews.length === 0) return 0;
//     const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
//     return sum / reviews.length;
//   }, [reviews]);

//   // Use props if available, otherwise use locally calculated values
//   const displayTotalReviews = totalReviews !== undefined ? totalReviews : localTotalReviews;
//   const displayAverageRating = averageRating !== undefined ? averageRating : localAverageRating;


//   return (
//     <>
//       <div className="mt-16 md:mt-20 py-12 bg-white border-t border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

//             {/* --- Left Column: Summary --- */}
//             <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
//               <h2 className="text-2xl font-bold text-[#172b9b] mb-4 font-seasons">
//                 Reviews
//               </h2>
//               {/* Display summary */}
//               {displayTotalReviews > 0 ? (
//                 <>
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-5xl font-bold text-gray-800">{displayAverageRating.toFixed(1)}</span>
//                     <StarRating rating={displayAverageRating} size={6} />
//                   </div>
//                   <p className="text-sm text-gray-500 mb-8">
//                     Based on {displayTotalReviews} reviews
//                   </p>
//                 </>
//               ) : (
//                   <p className="text-sm text-gray-500 mb-8">No reviews yet.</p>
//               )}
              
//               {/* "Write a Review" button (Opens Form) */}
//               <button
//                 onClick={handleWriteReviewClick} 
//                 className="w-full md:w-auto border border-gray-400 bg-blue-50 text-gray-800 px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Write a Review
//               </button>
//               <p className="text-sm text-gray-500 mt-4">
//                 Share your thoughts with other customers
//               </p>
//               </div>

//             {/* --- Right Column: Review List (Limited) --- */}
//             <div className="md:col-span-2 space-y-6">
//                 {reviewsToShow.length > 0 ? (
//                     // 🚩 CORRECTED: Now mapping over the limited list (reviewsToShow)
//                     reviewsToShow.map((review) => ( 
//                       // Individual review card/section
//                       <div key={review._id} className="pb-6 border-b border-gray-200 last:border-b-0">
                          
//                       <div className="flex items-center gap-2 mb-1">
//                           <StarRating rating={review.rating} size={4} />
//                           <span className="font-semibold text-gray-800 text-sm">{review.author || 'Anonymous'}</span>
//                       </div>
                      
//                       {(review.verifiedPurchase || review.createdAt) && (
//                           <div className="flex items-center gap-1 text-xs mb-2">
//                               {review.verifiedPurchase && (
//                                   <>
//                                       <CheckCircle className="w-3 h-3 text-green-600"/>
//                                       <span className="text-green-700">Verified Purchase</span>
//                                       <span className="text-gray-400 mx-1">|</span>
//                                   </>
//                               )}
//                               {review.createdAt && (
//                                 <span className="text-gray-500">Reviewed on {formatDate(review.createdAt)}</span>
//                               )}
//                           </div>
//                       )}
                      
//                       {review.title && (
//                           <h4 className="font-semibold text-gray-700 text-base mb-1">{review.title}</h4>
//                       )}
//                       <p className="text-gray-600 text-sm leading-relaxed font-lora mb-3">
//                           {review.comment}
//                       </p>
                      
//                       {review.images && review.images.length > 0 && (
//                           <div className="flex flex-wrap gap-2">
//                             {review.images.map((imgUrl, index) => (
//                               <a
//                                 key={index}
//                                 href={normalizeImageUrl(imgUrl)}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="block w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
//                               >
//                                 <img
//                                   src={normalizeImageUrl(imgUrl)}
//                                   alt={`Review image ${index + 1} by ${review.author}`}
//                                   className="w-full h-full object-cover"
//                                   loading="lazy"
//                                   onError={(e) => {
//                                       const target = e.target as HTMLImageElement;
//                                       target.style.display = 'none'; 
//                                   }}
//                                 />
//                               </a>
//                             ))}
//                           </div>
//                       )}
//                       </div>
//                     ))
//                 ) : (
//                     <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
//                       <p className='font-semibold'>No reviews available.</p>
//                     </div>
//                 )}
                
//                 {/* "View All" Button (Shown only if total > DISPLAY_LIMIT) */}
//                 {onViewAllClick && displayTotalReviews > DISPLAY_LIMIT && (
//                   <div className="mt-8 text-center">
//                       <button
//                         onClick={onViewAllClick}
//                         className="w-full md:w-auto bg-[#172b9b] text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         View all reviews ({displayTotalReviews})
//                       </button>
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* 🌟 REVIEW FORM MODAL 🌟 */}
//       {isFormOpen && (
//           <ReviewForm 
//             onClose={handleCloseForm} 
//             productId={productId}
//             productName={productName}
//           />
//       )}
//     </>
//   );
// };

// export default ReviewSection;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, CheckCircle, X, Trash2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';
import { useAuthStore } from '../../stores/useAuthStore'; // Auth for delete action

// Define Review Interface
export interface Review {
  _id: string;
  author: string; // Or userId, depending on your backend populate
  authorName?: string; // Optional if backend sends populated name
  rating: number;
  comment: string;
  title?: string;
  images?: string[];
  createdAt?: string;
  verifiedPurchase?: boolean;
  user?: string; // User ID of the reviewer to check ownership
}

// --- Helper: Format Date ---
const formatDate = (dateString: string): string => { 
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short', 
      year: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// --- Helper: Star Rating ---
const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 4 }) => { 
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

// --- Helper: Normalize Image URL ---
const normalizeImageUrl = (url: string) => { 
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http') || url.startsWith('/')) return url; 
    return `${API_BASE_URL}/${url}`; 
};

// --- ReviewForm Component (Modal) ---
interface ReviewFormProps {
    onClose: () => void;
    productId: string;
    productName?: string;
    onReviewAdded: () => void; // Callback to refresh reviews
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, productId, productName = 'the product', onReviewAdded }) => {
    const [selectedRating, setSelectedRating] = useState(5);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user} = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to write a review.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    rating: selectedRating,
                    title,
                    comment,
                    // Backend likely extracts user from token, but sending author name if needed
                    author: user.name || "Anonymous" 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit review");
            }

            alert('Review submitted successfully!');
            onReviewAdded(); // Refresh list
            onClose(); 
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl relative">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-[#172b9b]">Write a Review for {productName}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating*</label>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((starValue) => (
                                <Star 
                                    key={starValue}
                                    onClick={() => setSelectedRating(starValue)}
                                    className={`w-6 h-6 cursor-pointer transition-colors ${
                                        starValue <= selectedRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Review Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#172b9b] focus:border-[#172b9b]"
                            placeholder="A short summary of your experience"
                        />
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review*</label>
                        <textarea
                            id="comment"
                            rows={4}
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#172b9b] focus:border-[#172b9b]"
                            placeholder="Tell us about your experience..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                            isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#172b9b] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#172b9b]'
                        }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Props Interface
interface ReviewSectionProps {
  productId?: string;
  productName?: string;
}

// --- Main ReviewSection Component ---
const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, productName }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const { user, token } = useAuthStore();
  const DISPLAY_LIMIT = 4;

  // --- Fetch Reviews ---
  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        // Assuming API returns array of reviews directly or { reviews: [] }
        setReviews(Array.isArray(data) ? data : data.reviews || []);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Could not load reviews.");
    } finally {
        setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // --- Delete Review ---
  const handleDeleteReview = async (reviewId: string) => {
      if (!window.confirm("Are you sure you want to delete this review?")) return;
      
      try {
          const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews/${reviewId}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}` // Auth token required
              }
          });

          if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.message || "Failed to delete review");
          }

          // Remove from state optimistically
          setReviews(prev => prev.filter(r => r._id !== reviewId));
          alert("Review deleted.");

      } catch (err: any) {
          console.error("Delete error:", err);
          alert(err.message || "Could not delete review.");
      }
  };

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, total: 0 };
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return { avg: sum / total, total };
  }, [reviews]);

  const reviewsToShow = showAll ? reviews : reviews.slice(0, DISPLAY_LIMIT);

  if (!productId) return null;

  return (
    <>
      <div className="mt-16 md:mt-20 py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

            {/* --- Left Column: Summary --- */}
            <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
              <h2 className="text-2xl font-bold text-[#172b9b] mb-4 font-seasons">Reviews</h2>
              
              {isLoading ? (
                  <Loader2 className="animate-spin text-[#172b9b] mb-4"/>
              ) : stats.total > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-5xl font-bold text-gray-800">{stats.avg.toFixed(1)}</span>
                    <StarRating rating={stats.avg} size={6} />
                  </div>
                  <p className="text-sm text-gray-500 mb-8">Based on {stats.total} reviews</p>
                </>
              ) : (
                  <p className="text-sm text-gray-500 mb-8">No reviews yet.</p>
              )}
              
              <button
                onClick={() => setIsFormOpen(true)} 
                className="w-full md:w-auto border border-gray-400 bg-blue-50 text-gray-800 px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-100 transition-colors"
              >
                Write a Review
              </button>
            </div>

            {/* --- Right Column: Review List --- */}
            <div className="md:col-span-2 space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-gray-300"/></div>
                ) : error ? (
                    <div className="text-red-500 text-center py-4">{error}</div>
                ) : reviewsToShow.length > 0 ? (
                    reviewsToShow.map((review) => ( 
                      <div key={review._id} className="pb-6 border-b border-gray-200 last:border-b-0 relative group">
                          
                          {/* Delete Button (Only visible to admin or author - simplistic check here) */}
                          {user && (user.role === 'admin' || user._id === review.user) && (
                              <button 
                                onClick={() => handleDeleteReview(review._id)}
                                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Review"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          )}

                          <div className="flex items-center gap-2 mb-1">
                              <StarRating rating={review.rating} size={4} />
                              <span className="font-semibold text-gray-800 text-sm">
                                  {review.authorName || review.author || 'Anonymous'}
                              </span>
                          </div>
                          
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
                          
                          {review.title && (
                              <h4 className="font-semibold text-gray-700 text-base mb-1">{review.title}</h4>
                          )}
                          <p className="text-gray-600 text-sm leading-relaxed font-lora mb-3">
                              {review.comment}
                          </p>
                          
                          {review.images && review.images.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {review.images.map((imgUrl, index) => (
                                  <a key={index} href={normalizeImageUrl(imgUrl)} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-md overflow-hidden border hover:opacity-80">
                                    <img src={normalizeImageUrl(imgUrl)} alt="Review attachment" className="w-full h-full object-cover" />
                                  </a>
                                ))}
                              </div>
                          )}
                      </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                      <p className='font-semibold'>No reviews yet. Be the first to review!</p>
                    </div>
                )}
                
                {stats.total > DISPLAY_LIMIT && (
                  <div className="mt-8 text-center">
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-full md:w-auto bg-[#172b9b] text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-800 transition-colors"
                      >
                        {showAll ? 'Show Less' : `View all reviews (${stats.total})`}
                      </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      
      {isFormOpen && productId && (
          <ReviewForm 
            onClose={() => setIsFormOpen(false)} 
            productId={productId}
            productName={productName}
            onReviewAdded={fetchReviews}
          />
      )}
    </>
  );
};

export default ReviewSection;