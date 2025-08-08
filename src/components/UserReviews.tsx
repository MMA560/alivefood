import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { StarRating } from "@/components/StarRating";
import { ReviewsList } from "@/components/ReviewsList";
import { ReviewForm } from "@/components/ReviewForm";
import { reviewsApi, Review } from "@/lib/api";

interface UserReview {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  product_id: number;
}

interface UserReviewsProps {
  productId: string;
}

export const UserReviews = ({ productId }: UserReviewsProps) => {
  const { language, isRTL } = useLanguage();
  const [displayReviews, setDisplayReviews] = useState<UserReview[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Translations
  const translations = {
    en: {
      customerReviews: "Customer Reviews",
      customerFeedback: "Customer Feedback",
      reviews: "reviews",
      sortBy: "Sort by",
      newest: "Newest",
      highest: "Highest Rated",
      lowest: "Lowest Rated",
      noReviews: "No reviews yet. Be the first to review!",
      showMore: "Show More",
      showLess: "Show Less",
      addReview: "Add Your Review",
      name: "Name",
      enterName: "Enter your name",
      rating: "Rating",
      comment: "Your Comment",
      commentPlaceholder: "Share your experience with this product...",
      submitReview: "Submit Review",
      reviewSuccess: "Review submitted successfully! Thank you for sharing your experience.",
      fillRequired: "Please enter your name and comment."
    },
    ar: {
      customerReviews: "تقييمات العملاء",
      customerFeedback: "آراء العملاء",
      reviews: "تقييم",
      sortBy: "ترتيب حسب",
      newest: "الأحدث",
      highest: "الأعلى تقييمًا",
      lowest: "الأقل تقييمًا",
      noReviews: "لا توجد تقييمات حتى الآن. كن أول من يقيّم!",
      showMore: "عرض المزيد",
      showLess: "عرض أقل",
      addReview: "أضف تقييمك",
      name: "الاسم",
      enterName: "اكتب اسمك",
      rating: "التقييم",
      comment: "تعليقك",
      commentPlaceholder: "شاركنا تجربتك مع هذا المنتج...",
      submitReview: "إرسال التقييم",
      reviewSuccess: "تم إرسال التقييم بنجاح! شكراً لمشاركتك تجربتك.",
      fillRequired: "الرجاء إدخال اسمك وتعليقك."
    }
  };

  const t = translations[language];

  // تحويل مراجعة API إلى تنسيق UserReview
  const convertApiReviewToUserReview = (apiReview: Review): UserReview => {
    return {
      id: apiReview.id,
      name: apiReview.reviewer_name,
      date: apiReview.created_at ? new Date(apiReview.created_at).toLocaleDateString(
        language === 'ar' ? 'ar-EG' : 'en-US'
      ) : new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US'),
      rating: apiReview.rating,
      comment: apiReview.comment,
      product_id: parseInt(apiReview.product_id) || 0
    };
  };

  // جلب التقييمات من API
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching reviews for product:', productId);
      
      const apiReviews = await reviewsApi.getReviewsByProduct(productId);
      console.log('Received reviews:', apiReviews);
      
      const convertedReviews = apiReviews.map(convertApiReviewToUserReview);
      setDisplayReviews(convertedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشل في تحميل التقييمات';
      setError(errorMessage);
      setDisplayReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // ترتيب التقييمات
  useEffect(() => {
    if (displayReviews.length === 0) return;
    
    const sorted = [...displayReviews];
    
    if (sortBy === "highest") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      sorted.sort((a, b) => a.rating - b.rating);
    } else {
      // الأحدث - ترتيب حسب ID (الأعلى أولاً)
      sorted.sort((a, b) => b.id - a.id);
    }
    
    setDisplayReviews(sorted);
  }, [sortBy]);

  const averageRating =
    displayReviews.length > 0
      ? displayReviews.reduce((acc, review) => acc + review.rating, 0) / displayReviews.length
      : 0;

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSubmitReview = async (reviewData: {
    name: string;
    rating: number;
    comment: string;
  }) => {
    try {
      console.log('Submitting review for product:', productId, reviewData);
      
      // إنشاء البيانات بالتنسيق المطلوب للـ API
      const apiReviewData = {
        product_id: productId,
        name: reviewData.name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toLocaleDateString('ar-EG') // إضافة التاريخ
      };
      
      const newReview = await reviewsApi.createReview(apiReviewData);
      console.log('Review created successfully:', newReview);
      
      // إضافة التقييم الجديد إلى القائمة
      const convertedReview = convertApiReviewToUserReview(newReview);
      setDisplayReviews(prevReviews => [convertedReview, ...prevReviews]);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error; // إعادة رمي الخطأ ليتم التعامل معه في ReviewForm
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التقييمات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchReviews}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">{t.customerReviews}</h3>
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-sm font-medium text-gray-600">
              {averageRating.toFixed(1)} ({displayReviews.length} {t.reviews})
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-700">{t.customerFeedback}</h4>
          {displayReviews.length > 0 && (
            <div className="w-40">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-9 bg-white border-gray-300">
                  <SelectValue placeholder={t.sortBy} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="recent">{t.newest}</SelectItem>
                  <SelectItem value="highest">{t.highest}</SelectItem>
                  <SelectItem value="lowest">{t.lowest}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <ReviewsList
          reviews={displayReviews}
          showAllReviews={showAllReviews}
          isRTL={isRTL}
          translations={{
            noReviews: t.noReviews,
            showMore: t.showMore,
            showLess: t.showLess,
          }}
          onToggleShowAll={() => setShowAllReviews(!showAllReviews)}
        />

        <ReviewForm
          productId={productId}
          language={language}
          isRTL={isRTL}
          translations={{
            addReview: t.addReview,
            name: t.name,
            enterName: t.enterName,
            rating: t.rating,
            comment: t.comment,
            commentPlaceholder: t.commentPlaceholder,
            submitReview: t.submitReview,
            reviewSuccess: t.reviewSuccess,
            fillRequired: t.fillRequired,
          }}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
};