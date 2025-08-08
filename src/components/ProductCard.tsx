import React from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrencySettings } from "@/hooks/useCurrencySettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/lib/api";
import { EventCategory, EventType, trackEventSimple } from "@/lib/events_api";

interface ProductCardProps {
  product: Product;
  isCompact?: boolean;
  isMobile?: boolean;
  formatPrice?: (price: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isCompact = false,
  isMobile = false,
  formatPrice: externalFormatPrice,
}) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { 
    siteSettings,
    activeCurrencies,
    formatAmount,
    loading: currencyLoading 
  } = useCurrencySettings();

  const translations = {
    en: {
      sar: "SAR",
      addToCart: "Add to Cart",
      save: "Save",
    },
    ar: {
      sar: "ريال",
      addToCart: "إضافة للسلة",
      save: "وفر",
    },
  };

  const t = (key: string) => translations[language][key] || key;

  // دالة لتنسيق السعر بالعملة الأساسية
  const internalFormatPrice = (price: number): string => {
    if (!siteSettings || !activeCurrencies.length) {
      return `${price.toFixed(2)} ${language === 'ar' ? 'ريال' : 'SAR'}`;
    }
    
    const primaryCurrency = activeCurrencies.find(
      currency => currency.code === siteSettings.primary_currency
    ) || activeCurrencies[0];
    
    try {
      return formatAmount(price, primaryCurrency.code);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${price.toFixed(2)} ${primaryCurrency.symbol || primaryCurrency.code}`;
    }
  };

  // استخدام formatPrice الخارجي أو الداخلي
  const formatPrice = externalFormatPrice || internalFormatPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={isMobile ? 10 : isCompact ? 14 : 16}
            className="text-yellow-400 fill-yellow-400"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            size={isMobile ? 10 : isCompact ? 14 : 16}
            className="text-yellow-400 fill-yellow-400"
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={isMobile ? 10 : isCompact ? 14 : 16}
            className="text-gray-300"
          />
        );
      }
    }
    return stars;
  };

  const getOldPrice = () => {
    if (!product.old_price) return undefined;
    const price = parseFloat(product.old_price);
    return isNaN(price) ? undefined : price;
  };

  const getDiscountPercentage = () => {
    if (!getOldPrice()) return 0;
    return Math.round(
      ((getOldPrice() - parseFloat(product.price)) / getOldPrice()) * 100
    );
  };

  const getSavingAmount = () => {
    if (!getOldPrice()) return 0;
    return (getOldPrice() - parseFloat(product.price)).toFixed(2);
  };

  // Loading state
  if (currencyLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // تصميم خاص للهاتف المحمول - محدث
  if (isMobile) {
    return (
      <Card className="group transition-all duration-300 bg-white relative overflow-hidden shadow-md hover:shadow-lg border-0 rounded-2xl mx-0">
        {/* Main Content */}
        <div className="p-3">
          <div className="flex gap-3 h-full">
            {/* Right Column - Product Image and Button */}
            <div className="w-28 h-auto flex flex-col">
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                className="block mb-2"
              >
                <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-50 relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Discount Badge */}
                  {getOldPrice() && (
                    <div className="absolute top-1 right-1">
                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        {getDiscountPercentage()}%
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Add to Cart Button below image */}
              <Button
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1 transition-all duration-200 rounded-lg font-bold text-xs py-2 px-2 shadow-sm hover:shadow-md w-full"
              >
                <ShoppingCart size={12} />
                {t("addToCart")}
              </Button>
            </div>

            {/* Left Column - Product Info */}
            <div className="flex-1 min-w-0 flex flex-col">
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                className="block flex-grow"
              >
                {/* Title */}
                <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 leading-tight">
                  {product.title}
                </h3>

                {/* Rating with Stars */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-gray-800 font-bold">
                    {product.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Short Description - First 75 characters */}
                <div className="mb-3 flex-grow">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {(
                      product.short_description || "منتج عالي الجودة"
                    ).substring(0, 75)}
                    {(product.short_description || "").length > 75 && "..."}
                  </p>
                </div>
              </Link>

              {/* Price Section - Light Green Background - Always at bottom */}
              <div className="bg-green-50 rounded-lg p-1.5 border border-green-100 mt-auto">
                <div className="flex items-center justify-between">
                  {/* Right Section - Prices */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-green-700">
                      {formatPrice(parseFloat(product.price))}
                    </span>
                    {getOldPrice() && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(getOldPrice())}
                      </span>
                    )}
                  </div>

                  {/* Left Section - Savings Badge */}
                  {getOldPrice() && (
                    <div className="bg-orange-500 text-white px-1 py-0.5 rounded text-center flex items-center justify-center min-w-[50px]">
                      <span className="text-xs font-bold leading-tight">
                        وفر {getSavingAmount()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // التصميم المحدث للديسكتوب والتابلت - حجم أصغر وأكثر أناقة
  return (
    <Card
      className={`group transition-all duration-300 h-full flex flex-col bg-white relative overflow-hidden
        ${
          isCompact
            ? "shadow-md hover:shadow-lg border border-gray-200 hover:border-green-200"
            : "shadow-md hover:shadow-lg border border-gray-200 hover:border-green-200"
        }
        hover:-translate-y-1 hover:scale-[1.02] rounded-xl
      `}
    >
      {/* صورة المنتج */}
      <Link
        to={`/product/${product.id}`}
        state={{ product }}
        className="relative"
      >
        <div
          className={`${
            isCompact ? "aspect-[4/3]" : "aspect-square"
          } overflow-hidden relative rounded-t-xl`}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {getOldPrice() && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {getDiscountPercentage()}%
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
              متوفر
            </span>
          </div>
        </div>
      </Link>

      {/* محتوى الكارت */}
      <CardContent className={`${isCompact ? "p-3" : "p-4"} flex-grow flex flex-col`}>
        <Link
          to={`/product/${product.id}`}
          state={{ product }}
          className="flex-grow"
        >
          {/* عنوان المنتج */}
          <h3
            className={`font-semibold ${
              isCompact ? "text-sm mb-2" : "text-base mb-2"
            } text-gray-800 line-clamp-2 group-hover:text-green-700 transition-colors duration-300 leading-tight`}
          >
            {product.title}
          </h3>

          {/* التقييم */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span className={`${isCompact ? "text-xs" : "text-sm"} text-gray-800 font-medium`}>
              {product.rating}
            </span>
            <span className={`${isCompact ? "text-xs" : "text-sm"} text-gray-500`}>
              ({product.reviewCount})
            </span>
          </div>

          {/* الوصف */}
          <p
            className={`text-gray-600 ${
              isCompact ? "text-xs mb-3" : "text-sm mb-3"
            } line-clamp-2 leading-relaxed`}
          >
            {product.short_description || product.description}
          </p>
        </Link>

        {/* قسم السعر */}
        <div className="mt-auto">
          <div className="bg-green-50 rounded-lg p-2 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`${
                    isCompact ? "text-lg" : "text-xl"
                  } font-bold text-green-700`}
                >
                  {formatPrice(parseFloat(product.price))}
                </span>
                {getOldPrice() && (
                  <span
                    className={`${
                      isCompact ? "text-sm" : "text-base"
                    } text-gray-400 line-through`}
                  >
                    {formatPrice(getOldPrice())}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* زر الإضافة للسلة */}
      <CardFooter className={`${isCompact ? "p-3 pt-0" : "p-4 pt-0"}`}>
        <Button
          onClick={handleAddToCart}
          className={`w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-all duration-300 rounded-lg font-medium ${
            isCompact ? "text-sm py-2" : "text-base py-2.5"
          } shadow-sm hover:shadow-md`}
        >
          <ShoppingCart size={isCompact ? 14 : 16} />
          {t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;