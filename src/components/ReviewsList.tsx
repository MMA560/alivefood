
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewItem } from "@/components/ReviewItem";

interface UserReview {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  product_id: number;
}

interface ReviewsListProps {
  reviews: UserReview[];
  showAllReviews: boolean;
  isRTL: boolean;
  translations: {
    noReviews: string;
    showMore: string;
    showLess: string;
  };
  onToggleShowAll: () => void;
}

export const ReviewsList = ({ 
  reviews, 
  showAllReviews, 
  isRTL, 
  translations: t, 
  onToggleShowAll 
}: ReviewsListProps) => {
  const reviewsToDisplay = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <>
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 p-8 border border-gray-200 rounded-lg bg-gray-50">
            {t.noReviews}
          </div>
        ) : (
          reviewsToDisplay.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>

      {reviews.length > 3 && (
        <Button
          variant="outline"
          className="w-full mt-4 border-gray-300 text-gray-700 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 py-3"
          onClick={onToggleShowAll}
        >
          {showAllReviews ? (
            <>
              {t.showLess} {isRTL ? <ChevronUp className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </>
          ) : (
            <>
              {t.showMore} {isRTL ? <ChevronDown className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </>
          )}
        </Button>
      )}
    </>
  );
};
