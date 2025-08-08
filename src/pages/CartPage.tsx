import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useCurrencySettings } from "@/hooks/useCurrencySettings";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

const CartPage = () => {
  const { language, t, isRTL } = useLanguage();
  const { items, updateQuantity, removeFromCart, subtotal, shippingFee, totalPrice, totalItems } = useCart();
  const isMobile = useIsMobile();

  // إضافة نظام العملات
  const {
    siteSettings,
    activeCurrencies,
    formatAmount,
    loading: currencyLoading,
  } = useCurrencySettings();

  // دالة تنسيق السعر باستخدام نظام العملات
  const formatPrice = (price) => {
    if (currencyLoading || !siteSettings || !activeCurrencies.length) {
      return `${price.toFixed(2)} ${language === 'ar' ? 'ريال' : 'SAR'}`;
    }
    
    // جيب العملة المخزنة مع معدل التحويل
    let storedCurrency = null;
    let conversionRate = 1;
    
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

  // تمرير الصفحة للأعلى عند فتحها
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // عرض Loading أثناء تحميل بيانات العملات
  if (currencyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        {/* Enhanced Empty Cart Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                  {t('backToHome')}
                </Button>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {t('cartTitle')}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('emptyCart')}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {isRTL 
                ? "عربة التسوق فارغة، أضف بعض المنتجات للمتابعة"
                : "Your cart is empty. Add some products to continue shopping"
              }
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {t('continueShopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                {t('backToHome')}
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {t('cartTitle')}
              </h1>
            </div>
            <p className="text-white/90 text-lg">
              {isRTL 
                ? `لديك ${totalItems} منتج${totalItems > 1 ? 'ات' : ''} في السلة`
                : `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={`${item.id}-${item.variant_id || 'default'}`} className="shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title[language]}
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">{item.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-3 leading-tight">
                        {item.title[language]}
                      </h3>
                      
                      {/* Enhanced Variant Badge */}
                      {item.variant_name && (
                        <div className="mb-4">
                          <Badge className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 px-3 py-1 rounded-full shadow-sm">
                            <span className="text-xs font-medium">
                              {language === 'ar' ? 'اللون:' : 'Color:'}
                            </span>
                            <span className="ml-1 font-bold">
                              {item.variant_name}
                            </span>
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-green-600 font-bold text-xl mb-4">
                        {formatPrice(item.price)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {/* Enhanced Quantity Controls */}
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant_id)}
                            className="px-3 py-2 hover:bg-gray-100 rounded-l-xl"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-4 py-2 font-bold text-gray-800 bg-white border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant_id)}
                            className="px-3 py-2 hover:bg-gray-100 rounded-r-xl"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id, item.variant_id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl p-3 transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden sticky top-6">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-6">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  {t('orderSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant_id || 'default'}`} className="flex justify-between text-sm bg-gray-50 p-3 rounded-xl">
                      <span className="flex-1">
                        <span className="font-medium text-gray-800">
                          {item.title[language]}
                        </span>
                        {item.variant_name && (
                          <span className="text-blue-600 ml-2 font-medium bg-blue-50 px-2 py-0.5 rounded-full text-xs border border-blue-200">
                            {item.variant_name}
                          </span>
                        )}
                        <span className="text-gray-600 ml-2">× {item.quantity}</span>
                      </span>
                      <span className="font-bold text-green-600">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{t('subtotal')}</span>
                    <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{t('shipping')}</span>
                    <span className="font-bold text-gray-800">{formatPrice(shippingFee)}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 mb-6 border-2 border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-800">{t('total')}</span>
                    <span className="text-2xl font-bold text-green-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                
                <Link to="/checkout">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold text-lg">
                    {t('checkout')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;