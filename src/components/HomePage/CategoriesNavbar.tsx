import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoriesNavbar = ({ categories, translate }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // استخدام slug إذا كان متوفر، وإلا استخدم id
    const categoryPath = category.slug || category.id;
    
    // الانتقال لصفحة الكاتيجوري مع تمرير بيانات الكاتيجوري
    navigate(`/category/${categoryPath}`, {
      state: { category }
    });
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-green-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 md:space-x-6">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="whitespace-nowrap px-3 py-2 text-sm md:text-base font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CategoriesNavbar;