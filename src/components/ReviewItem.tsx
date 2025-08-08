
import { StarRating } from "@/components/StarRating";

interface UserReview {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  product_id: number;
}

interface ReviewItemProps {
  review: UserReview;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <div className="p-5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-800">{review.name}</h4>
        <span className="text-sm text-gray-500">{review.date}</span>
      </div>
      <div className="flex mb-3">
        <StarRating rating={review.rating} />
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};
