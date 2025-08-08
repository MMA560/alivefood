import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrencySettings } from "@/hooks/useCurrencySettings";

const CheckoutFloatingBar: React.FC = () => {
  const { totalItems, totalPrice, subtotal, shippingFee } = useCart();
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // إضافة نظام العملات
  const {
    siteSettings,
    activeCurrencies,
    formatAmount,
    loading: currencyLoading,
  } = useCurrencySettings();

  // دالة تنسيق السعر باستخدام نظام العملات
  const formatPrice = (price: number): string => {
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

  // تمرير الصفحة للأعلى عند تغيير المسار وإعادة إظهار الشريط
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, [location.pathname]);

  // الترجمات المحلية الثابتة
  const translations = {
    en: {
      items: 'items',
      item: 'item',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      checkout: 'Checkout',
      sar: 'SAR',
      free: 'Free'
    },
    ar: {
      items: 'عناصر',
      item: 'عنصر',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      total: 'الإجمالي',
      checkout: 'إتمام الشراء',
      sar: 'ريال',
      free: 'مجاني'
    }
  };

  const getText = (key: string) => {
    return translations[language]?.[key] || key;
  };

  // قائمة الصفحات التي يجب إخفاء الزر فيها
  const hiddenPages = ['/cart', '/checkout', '/thank-you'];
  
  // تحقق من إذا كانت الصفحة الحالية في قائمة الصفحات المخفية
  const shouldHide = hiddenPages.includes(location.pathname);

  // لا يظهر إذا كانت السلة فارغة أو في الصفحات المحددة أو أثناء تحميل العملات
  if (totalItems === 0 || shouldHide || currencyLoading) {
    return null;
  }

  const itemText = totalItems === 1 ? getText('item') : getText('items');

  return (
    <>
      {/* للجوال */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 transform transition-transform duration-1000 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        {/* زر الإغلاق للجوال */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 left-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
          title="إغلاق"
        >
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </button>
        
        {/* معلومات السلة المختصرة */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 pr-12">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <ShoppingCart className="w-4 h-4" />
              <span>{totalItems} {itemText}</span>
            </div>
            <div className="text-gray-600">
              {getText('subtotal')}: {formatPrice(subtotal)}
            </div>
          </div>
        </div>

        {/* الجزء الرئيسي */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">{getText('total')}: </span>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            
            <Link to="/checkout">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <span className="font-semibold">{getText('checkout')}</span>
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* للشاشات الكبيرة */}
      <div className={`hidden lg:block fixed bottom-6 z-50 ${isRTL ? 'left-6' : 'right-6'} transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'}`}>
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/95 relative animate-slide-up">
          {/* زر الإغلاق */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
            title="إغلاق"
          >
            <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </button>
          
          <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-full">
                <ShoppingCart className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {totalItems} {itemText}
                </div>
                <div className="text-xs text-gray-600">
                  {getText('subtotal')}: {formatPrice(subtotal)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-3">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1.5">
                <span>{getText('shipping')}:</span>
                <span>{shippingFee > 0 ? formatPrice(shippingFee) : getText('free')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-800">{getText('total')}:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            
            <Link to="/checkout" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-sm"
              >
                <span>{getText('checkout')}</span>
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutFloatingBar;