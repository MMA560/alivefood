
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating = ({ rating, className = "" }: StarRatingProps) => {
  return (
    <div className={`flex ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
