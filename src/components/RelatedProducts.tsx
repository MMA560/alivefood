import React, { useState, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const { t, isRTL } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (products.length === 0) {
    return null;
  }

  // Add default values for missing properties to match ProductCard expectations
  const enhancedProducts = products.map(product => ({
    ...product,
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    faq: product.faq || [],
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
    short_description: product.short_description || product.description
  }));

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      // For RTL, reverse the scroll direction
      const actualDirection = isRTL ? (direction === 'left' ? 'right' : 'left') : direction;
      const newScrollLeft = actualDirection === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Update button states after scroll
      setTimeout(checkScrollButtons, 300);
    }
  };

  const getTitle = () => {
    const title = t('relatedProducts');
    // Debug log - سيمكنك رؤية الترجمة في console
    console.log('Related Products title:', title);
    return title;
  };

  return (
    <div className="mb-16">
      <h2 className={`text-2xl font-bold mb-8 ${isRTL ? 'pr-4' : 'pl-4'}`}>{getTitle()}</h2>
      
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll('left')}
          className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 ${
            !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
          }`}
          disabled={!canScrollLeft}
        >
          {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        
        <button
          onClick={() => scroll('right')}
          className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-10 bg-white/2 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 ${
            !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
          }`}
          disabled={!canScrollRight}
        >
          {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Products Container */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide pb-4 px-8"
          onScroll={checkScrollButtons}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className={`flex w-max ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            {enhancedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct.id} 
                className="flex-shrink-0 w-64 sm:w-72 md:w-80"
              >
                <ProductCard product={relatedProduct} isCompact={true} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Touch Indicator */}
      <div className="flex justify-center mt-4 sm:hidden">
        <p className="text-sm text-gray-500">
          {isRTL ? 'اسحب يمين أو شمال لرؤية المزيد' : 'Swipe left/right to see more'}
        </p>
      </div>
    </div>
  );
};

export default RelatedProducts;