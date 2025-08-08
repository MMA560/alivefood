import React from "react";
import {
  Plus,
  Minus,
  Tag,
  Star,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Currency } from "@/lib/currencyApi"; // استخدام النوع الصحيح من الـ API

interface Variant {
  id: string;
  color: string;
  image: string;
  stock: number;
  price: string;
}

interface ProductInfoProps {
  title: string;
  category: string;
  categories?: string[];
  getCategoryName: (category: string) => string;
  price: number;
  oldPrice?: number;
  description: string;
  quantity: number;
  setQuantity: (quantity: number) => void;
  onAddToCart: () => void;
  rating?: number;
  reviewCount?: number;
  variants?: Variant[];
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
  brand?: string;
  sku?: string;
  t: (key: string) => string;
  maxQuantity?: number;
  canAddToCart?: boolean;
  // تحديث props العملة لاستخدام النوع الصحيح
  formatPrice: (price: number) => string;
  primaryCurrency: Currency;
  language: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  category,
  categories,
  getCategoryName,
  price,
  oldPrice,
  description,
  quantity,
  setQuantity,
  onAddToCart,
  rating = 0,
  reviewCount = 0,
  variants,
  selectedVariant,
  onVariantChange,
  brand,
  sku,
  t,
  maxQuantity = 99,
  canAddToCart = true,
  formatPrice,
  primaryCurrency,
  language,
}) => {
  const { isRTL } = useLanguage();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-sm"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const discountPercentage = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  // الحصول على معلومات المخزون للمتغير المحدد
  const getStockInfo = () => {
    if (variants && selectedVariant) {
      const currentVariant = variants.find((v) => v.id === selectedVariant);
      return currentVariant ? currentVariant.stock : 0;
    }
    return null;
  };

  const currentStock = getStockInfo();

  // تحديد الفئات المراد عرضها
  const displayCategories = categories && categories.length > 0 ? categories : [category];

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
        {title}
      </h1>

      {/* Category Badges and Rating */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* عرض الفئات */}
        <div className="flex items-center gap-2 flex-wrap">
          {displayCategories.map((cat, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gradient-to-r from-green-50 to-green-100 text-green-800 hover:from-green-100 hover:to-green-200 transition-all duration-300 flex items-center gap-2 w-fit px-3 py-1.5 rounded-full shadow-sm hover:shadow-md"
            >
              <Tag className="w-4 h-4" />
              {getCategoryName(cat)}
            </Badge>
          ))}
        </div>

        {rating > 0 && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-1">{renderStars(rating)}</div>
            <span className="text-sm font-medium text-gray-700">{rating}</span>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
          {formatPrice(price)}
        </span>
        {oldPrice && (
          <span className="text-xl text-gray-400 line-through">
            {formatPrice(oldPrice)}
          </span>
        )}

        {oldPrice && discountPercentage > 0 && (
          <span
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
            dir="rtl"
          >
            خصم {discountPercentage}%
          </span>
        )}
      </div>

      <div className="prose prose-gray max-w-none mb-6">
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Brand and SKU Section */}
      {(brand || sku) && (
        <div className="mb-6">
          <hr className="border-gray-200 mb-4" />
          <div className="flex flex-col gap-2">
            {brand && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {t("brand")}:
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  {brand}
                </span>
              </div>
            )}
            {sku && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">SKU:</span>
                <span className="text-sm text-gray-600 font-medium">{sku}</span>
              </div>
            )}
          </div>
          <hr className="border-gray-200 mt-4" />
        </div>
      )}

      {/* Enhanced Variants Selection */}
      {variants && variants.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium">
              {language === 'ar' ? 'اللون:' : 'Color:'}
            </span>
            <span className="font-medium text-green-600">
              {variants.find((v) => v.id === selectedVariant)?.color ||
                variants[0]?.color}
            </span>
            {/* عرض حالة المخزون */}
            {currentStock !== null && (
              <div className="flex items-center gap-2 mr-4">
                {currentStock > 0 ? (
                  <span className="text-sm text-green-600 bg-gradient-to-r from-green-50 to-green-100 px-3 py-1 rounded-full shadow-sm">
                    {language === 'ar' ? `متوفر (${currentStock} قطعة)` : `In Stock (${currentStock} items)`}
                  </span>
                ) : (
                  <span className="text-sm text-red-600 bg-gradient-to-r from-red-50 to-red-100 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <AlertCircle className="w-3 h-3" />
                    {t("outOfStock")}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => onVariantChange?.(variant.id)}
                disabled={variant.stock === 0}
                className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                  variant.stock === 0
                    ? "border-gray-200 opacity-50 cursor-not-allowed"
                    : selectedVariant === variant.id
                    ? "border-green-500 shadow-lg shadow-green-500/25 scale-105"
                    : "border-gray-200 hover:border-gray-300 hover:scale-105"
                }`}
              >
                <img
                  src={variant.image}
                  alt={variant.color}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {variant.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">×</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Warning */}
      {currentStock !== null && currentStock > 0 && currentStock <= 5 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              {language === 'ar' 
                ? `متبقي فقط ${currentStock} قطع في المخزون`
                : `Only ${currentStock} items left in stock`
              }
            </span>
          </div>
        </div>
      )}

      {/* Enhanced Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-medium">{t("quantity")}:</span>
        <div className="flex items-center border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="px-3 rounded-l-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="px-4 py-2 font-medium bg-gray-50 min-w-[3rem] text-center">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= maxQuantity}
            className="px-3 rounded-r-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {maxQuantity < 99 && (
          <span className="text-sm text-gray-500">
            {language === 'ar' 
              ? `(الحد الأقصى: ${maxQuantity})`
              : `(Max: ${maxQuantity})`
            }
          </span>
        )}
      </div>

      {/* Enhanced Add to Cart Button */}
      <Button
        onClick={onAddToCart}
        disabled={
          !canAddToCart || (currentStock !== null && currentStock === 0)
        }
        data-testid="add-to-cart-button"
        className={`w-full py-4 text-lg flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
          !canAddToCart || (currentStock !== null && currentStock === 0)
            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-[1.02] hover:shadow-green-500/25 active:scale-95"
        } text-white`}
      >
        {currentStock === 0 ? (
          t("outOfStock")
        ) : (
          <>
            {t("addToCart")}
            <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ProductInfo;