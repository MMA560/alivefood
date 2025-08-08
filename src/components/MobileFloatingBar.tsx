import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrencySettings } from "@/hooks/useCurrencySettings";
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, AlertCircle } from 'lucide-react';

interface MobileFloatingBarProps {
  title: string;
  price: number;
  onAddToCart: () => void;
  t: (key: string) => string;
  canAddToCart?: boolean;
  formatPrice?: (price: number) => string; // جعلها اختيارية لأننا سنستخدم نظام العملات الجديد
}

const MobileFloatingBar: React.FC<MobileFloatingBarProps> = ({
  title,
  price,
  onAddToCart,
  t,
  canAddToCart = true,
  formatPrice: externalFormatPrice, // إعادة تسمية للتمييز
}) => {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // إضافة نظام العملات
  const {
    siteSettings,
    activeCurrencies,
    formatAmount,
    loading: currencyLoading,
  } = useCurrencySettings();

  // دالة تنسيق السعر باستخدام نظام العملات
  const formatPrice = (price: number): string => {
    // إذا تم تمرير دالة خارجية، استخدمها أولاً
    if (externalFormatPrice) {
      return externalFormatPrice(price);
    }

    // وإلا استخدم نظام العملات الداخلي
    if (currencyLoading || !siteSettings || !activeCurrencies.length) {
      return `${price.toFixed(2)} ${language === 'ar' ? 'ريال' : 'SAR'}`;
    }
    
    // جيب العملة المخزنة مع معدل التحويل
    let storedCurrency: string | null = null;
    let conversionRate: number = 1;
    
    try {
      const cached = localStorage.getItem('currency_data_cache');
      if (cached) {
        const data = JSON.parse(cached);
        storedCurrency = data.defaultCurrency?.code;
        conversionRate = data.defaultCurrency?.conversion_rate || 1;
      }
    } catch {}
    
    const primaryCurrency = activeCurrencies.find(
      currency => currency.code === storedCurrency
    ) || activeCurrencies.find(
      currency => currency.code === siteSettings.primary_currency
    ) || activeCurrencies[0];
    
    // حول السعر أولاً
    const convertedPrice = price * (primaryCurrency.conversion_rate || 1);
    
    return formatAmount(convertedPrice, primaryCurrency.code);
  };

  useEffect(() => {
    // إذا لم يكن الجهاز محمولاً أو كانت السلة غير فارغة، لا نحتاج لتتبع السكرول
    if (!isMobile || totalItems > 0) {
      setShowFloatingBar(false);
      return;
    }

    const handleScroll = () => {
      // البحث عن زر "Add to Cart" في الصفحة
      const addToCartButton = document.querySelector('[data-testid="add-to-cart-button"]') as HTMLElement;
      
      if (addToCartButton) {
        const buttonRect = addToCartButton.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // إذا كان الزر خارج نطاق الرؤية (تم التمرير عنه)
        if (buttonRect.bottom < 0) {
          setShowFloatingBar(true);
        } else {
          setShowFloatingBar(false);
        }
      }
    };

    // إضافة مستمع للسكرول
    window.addEventListener('scroll', handleScroll);
    
    // تحقق من الحالة الأولية
    handleScroll();

    // تنظيف المستمع عند إزالة المكون
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, totalItems]);

  // لا يظهر إذا لم يكن الجهاز محمولاً أو كانت السلة غير فارغة أو لم يتم التمرير
  if (!isMobile || totalItems > 0 || !showFloatingBar) {
    return null;
  }

  // لا نعرض المكون أثناء تحميل بيانات العملات إذا لم يكن هناك formatPrice خارجي
  if (!externalFormatPrice && currencyLoading) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-2xl z-40 animate-in slide-in-from-bottom duration-300">
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      
      <div className="relative flex items-center justify-between gap-4">
        {/* Enhanced Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 truncate text-lg leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        {/* Enhanced Add to Cart Button */}
        <Button 
          onClick={onAddToCart}
          disabled={!canAddToCart}
          className={`px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
            !canAddToCart
              ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-green-500/25 active:scale-95"
          } text-white flex-shrink-0`}
        >
          {canAddToCart ? (
            <>
              {t('addToCart')}
              <ShoppingCart className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              {t('outOfStock')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileFloatingBar;