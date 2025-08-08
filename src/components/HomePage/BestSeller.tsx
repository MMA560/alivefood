import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from '@/contexts/LanguageContext';
import { EventCategory, EventType, trackEventSimple } from "@/lib/events_api";
import { productsApi } from '@/lib/api';

const ProductCard = ({ product, translate, formatPrice }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    addToCart({
      id: product.id,
      title: { en: product.title, ar: product.title },
      image: product.image,
      price: parseFloat(product.price),
      base_price: product.base_price,
    });
    
    trackEventSimple(
      "add_to_cart",
      EventType.ADD_TO_CART,
      EventCategory.CONVERSION
    );
    
    setTimeout(() => setIsLoading(false), 300);
  };

  const discount = product.old_price 
    ? Math.round(((parseFloat(product.old_price) - parseFloat(product.price)) / parseFloat(product.old_price)) * 100)
    : null;

  return (
    <Link 
      to={`/product/${product.id}`}
      state={{ product }}
      className="block group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-200 transform hover:-translate-y-2"
    >
      <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discount}%
          </div>
        )}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          🔥 الأكثر مبيعاً
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-transparent'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviewCount || 0})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">
              {formatPrice ? formatPrice(parseFloat(product.price)) : `$${product.price}`}
            </span>
            {product.old_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice ? formatPrice(parseFloat(product.old_price)) : `$${product.old_price}`}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>{translate('أضف للسلة', 'Add to Cart')}</span>
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

const BestSellers = ({ translate, formatPrice }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        setLoading(true);
        // جلب المنتجات من كاتيجوري "best-sellers" مع تحديد العدد الأقصى 4
        const bestSellersProducts = await productsApi.getProductsByCategory('best-sellers', 4);
        setProducts(bestSellersProducts);
      } catch (err) {
        console.error('Error loading best sellers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 my-12">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="w-20 h-1 bg-gray-200 mx-auto rounded-full animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null; // إخفاء القسم في حالة الخطأ أو عدم وجود منتجات
  }

  return (
    <div className="container mx-auto px-4 my-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {translate('الأكثر مبيعاً', 'Best Sellers')}
        </h2>
        <div className="w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            translate={translate} 
            formatPrice={formatPrice}
          />
        ))}
      </div>

      {/* زر عرض الكل */}
      <div className="text-center mt-8">
        <Link 
          to="/category/best-sellers"
          state={{ 
            category: { 
              id: 'best-sellers', 
              name: translate('الأكثر مبيعاً', 'Best Sellers'),
              slug: 'best-sellers'
            } 
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span>{translate('عرض الكل', 'View All')}</span>
          {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </Link>
      </div>
    </div>
  );
};

export default BestSellers;