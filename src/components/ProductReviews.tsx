
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, User } from 'lucide-react';

interface Review {
  name: string;
  comment: { en: string; ar: string };
}

interface ProductReviewsProps {
  reviews: Review[];
  language: string;
  t: (key: string) => string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, language, t }) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Generate random rating for each review (4-5 stars for demo)
  const getRandomRating = () => Math.floor(Math.random() * 2) + 4;

  return (
    <Card className="mb-16">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          {t('customerReviews') || 'Customer Reviews'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review, index) => {
          const rating = getRandomRating();
          return (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`w-4 h-4 ${
                            starIndex < rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed ml-13">
                {review.comment[language as keyof typeof review.comment]}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
