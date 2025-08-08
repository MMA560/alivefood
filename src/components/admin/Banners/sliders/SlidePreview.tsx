import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id?: number | string;
  image_url?: string;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  link_url?: string;
  order?: number;
  is_active?: boolean;
  created_at?: string;
}

interface SlidePreviewProps {
  slides: Slide[];
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const nextSlide = (): void => {
    setCurrentSlideIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = (): void => {
    setCurrentSlideIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">معاينة الشرائح</h3>
      </div>
      <div className="relative">
        <div className="aspect-[16/6] bg-gray-100 relative overflow-hidden">
          <img
            src={slides[currentSlideIndex]?.image_url || ''}
            alt={slides[currentSlideIndex]?.title_ar || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white max-w-2xl px-4">
              <h2 className="text-3xl font-bold mb-4">
                {slides[currentSlideIndex]?.title_ar || ''}
              </h2>
              <p className="text-lg mb-6">
                {slides[currentSlideIndex]?.subtitle_ar || ''}
              </p>
              {slides[currentSlideIndex]?.link_url && (
                <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
                  اكتشف المزيد
                </div>
              )}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlideIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlidePreview;