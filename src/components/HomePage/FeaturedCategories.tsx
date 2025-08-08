import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedCategories = ({ categories, translate }) => {
  const navigate = useNavigate();
  const featuredCategories = categories.slice(0, 6);
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCategoryClick = (category) => {
    // استخدام slug إذا كان متوفر، وإلا استخدم id
    const categoryPath = category.slug || category.id;
    
    // الانتقال لصفحة الكاتيجوري مع تمرير بيانات الكاتيجوري
    navigate(`/category/${categoryPath}`, {
      state: { category }
    });
  };

  // Center the selected item when manually changed
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = 140; // width + gap
      const containerWidth = container.clientWidth;
      
      // Check if mobile
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // On mobile, start from right (scroll to end initially, then position normally)
        const scrollPosition = currentIndex * itemWidth;
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      } else {
        // On desktop, center the item
        const centerOffset = (containerWidth / 2) - (itemWidth / 2);
        const scrollPosition = (currentIndex * itemWidth) - centerOffset;
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  // Initialize scroll position for mobile (start from right)
  useEffect(() => {
    if (scrollContainerRef.current && window.innerWidth < 768) {
      const container = scrollContainerRef.current;
      // Start from the rightmost position on mobile
      setTimeout(() => {
        container.scrollLeft = container.scrollWidth - container.clientWidth;
      }, 100);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 my-8">
      {/* Both Mobile and Desktop - Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
        <div className="flex gap-4 pb-2 md:px-20" style={{ width: 'max-content' }}>
          {featuredCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-200 transform hover:-translate-y-1 flex-shrink-0 ${
                index === currentIndex ? 'ring-2 ring-green-300' : ''
              }`}
              style={{ width: '120px' }}
            >
              <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-green-600">
                    <div className="w-8 h-8 bg-green-200 rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 text-center group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {featuredCategories.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-green-500 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FeaturedCategories;