import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlider } from '@/hooks/useBanners';

const HeroSlider = ({ translate, language = 'ar' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { slides, activeSlides, loading, error } = useHeroSlider();

  useEffect(() => {
    if (activeSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="relative h-48 md:h-96 overflow-hidden rounded-2xl mx-4 my-6 shadow-2xl bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  // عرض حالة الخطأ أو عدم وجود شرائح نشطة
  if (error || activeSlides.length === 0) {
    return (
      <div className="relative h-48 md:h-96 overflow-hidden rounded-2xl mx-4 my-6 shadow-2xl bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          {error ? 'حدث خطأ في تحميل الشرائح' : 'لا توجد شرائح نشطة'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-48 md:h-96 overflow-hidden rounded-2xl mx-4 my-6 shadow-2xl">
      {activeSlides.map((slide, index) => {
        // تحويل الشريحة إلى رابط إذا كان لديها link_url
        const slideContent = (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
          >
            <img
              src={slide.image_url}
              alt={language === 'ar' ? slide.title_ar : slide.title_en}
              className="w-full h-full object-cover"
            />
            {/* طبقة الغمقان المحسنة - أقوى وأكثر وضوحاً */}
            <div className="absolute inset-0 bg-black/50">
              {/* طبقة إضافية للنص فقط */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-32 md:h-40"></div>
              
              <div className="absolute bottom-8 left-8 md:left-1/2 md:transform md:-translate-x-1/2 md:text-center text-white z-10">
                <h2 className="text-2xl md:text-4xl font-bold mb-2"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)' }}>
                  {language === 'ar' ? slide.title_ar : slide.title_en}
                </h2>
                {(slide.subtitle_ar || slide.subtitle_en) && (
                  <p className="text-lg md:text-xl"
                     style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)' }}>
                    {language === 'ar' ? slide.subtitle_ar : slide.subtitle_en}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

        // إذا كان هناك رابط، لف المحتوى في anchor tag
        return slide.link_url ? (
          <a 
            key={slide.id}
            href={slide.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            {slideContent}
          </a>
        ) : slideContent;
      })}
      
      {/* Navigation Arrows - إخفاءها إذا كانت هناك شريحة واحدة فقط */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-green-600 p-2 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-green-600 p-2 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-20"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Dots - إصلاح مشكلة التباعد */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 shadow-lg ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;