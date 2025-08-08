import React from 'react';

const PromoBanner = ({ translate }) => {
  return (
    <div className="container mx-auto px-4 my-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {translate('عرض خاص محدود', 'Limited Special Offer')}
          </h2>
          <p className="text-lg md:text-xl mb-6">
            {translate('خصم 10% على جميع المنتجات', '10% Off on All Products')}
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-all duration-200 transform hover:scale-105 shadow-lg">
            {translate('تسوق الآن', 'Shop Now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;