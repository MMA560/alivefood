import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  language: string;
  isRTL: boolean;
  translations: {
    addReview: string;
    name: string;
    enterName: string;
    rating: string;
    comment: string;
    commentPlaceholder: string;
    submitReview: string;
    reviewSuccess: string;
    fillRequired: string;
  };
  onSubmitReview: (reviewData: {
    name: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
}

export const ReviewForm = ({ 
  productId, 
  language, 
  isRTL, 
  translations, 
  onSubmitReview 
}: ReviewFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!formData.name.trim()) {
      setError('الرجاء إدخال الاسم');
      return;
    }
    
    if (formData.rating === 0) {
      setError('الرجاء اختيار التقييم');
      return;
    }
    
    if (!formData.comment.trim()) {
      setError('الرجاء إدخال التعليق');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting review data:', formData); // للتتبع
      
      await onSubmitReview(formData);
      
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        rating: 0,
        comment: ''
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في إرسال التقييم';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    setError(''); // مسح الخطأ عند اختيار التقييم
  };

  return (
    <div className="border-t pt-6">
      <h4 className="text-lg font-semibold mb-4">{translations.addReview}</h4>
      
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {translations.reviewSuccess}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            {translations.name} *
          </label>
          <Input
            type="text"
            placeholder={translations.enterName}
            value={formData.name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, name: e.target.value }));
              setError(''); // مسح الخطأ عند الكتابة
            }}
            className="w-full"
            dir={isRTL ? 'rtl' : 'ltr'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            {translations.rating} *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className="p-1 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= formData.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {formData.rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              تقييمك: {formData.rating} من 5 نجوم
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            {translations.comment} *
          </label>
          <Textarea
            placeholder={translations.commentPlaceholder}
            value={formData.comment}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, comment: e.target.value }));
              setError(''); // مسح الخطأ عند الكتابة
            }}
            rows={4}
            className="w-full resize-none"
            dir={isRTL ? 'rtl' : 'ltr'}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              جاري الإرسال...
            </div>
          ) : (
            translations.submitReview
          )}
        </Button>
      </form>
    </div>
  );
};