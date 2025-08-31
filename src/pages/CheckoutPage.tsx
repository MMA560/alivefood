import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Truck, ShoppingBag, CreditCard, MapPin, User, Phone, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrencySettings } from "@/hooks/useCurrencySettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ordersApi, OrderCreate } from "@/lib/api";
import { EventCategory, EventType, trackEventSimple } from "@/lib/events_api";

const getBrowserId = () => {
  let browserId = localStorage.getItem("browser_id");
  if (!browserId) {
    browserId = crypto.randomUUID();
    localStorage.setItem("browser_id", browserId);
  }
  return browserId;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { language, t, isRTL } = useLanguage();
  const { items, subtotal, shippingFee, totalPrice, clearCart } = useCart();

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

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    fullAddress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Load saved customer data on component mount
  useEffect(() => {
    const savedCustomerData = localStorage.getItem("customerData");
    if (savedCustomerData) {
      try {
        const customerData = JSON.parse(savedCustomerData);
        setFormData({
          fullName: customerData.fullName || "",
          phoneNumber: customerData.phoneNumber || "",
          fullAddress: customerData.fullAddress || "",
        });
      } catch (error) {
        console.error("Error loading saved customer data:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear any previous error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const saveCustomerData = () => {
    // Save customer data to localStorage for future orders
    const customerData = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      fullAddress: formData.fullAddress,
    };
    localStorage.setItem("customerData", JSON.stringify(customerData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const browserId = getBrowserId();

    try {
      // Prepare order data for API
      const orderData = {
        customer_info: {
          customerName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          fullAddress: formData.fullAddress,
        },
        items: items.map((item) => ({
          product_id: item.id,
          title:
            typeof item.title === "object" ? item.title[language] : item.title,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          base_price: item.base_price,
          variant_id: item.variant_id || null,
          variant_name: item.variant_name || null,
        })),
        shippingFee: shippingFee,
        notes: "",
        paymentMethod: "cash_on_delivery",
      };

      // Send order to server
      const createdOrder = await ordersApi.createOrder(orderData);

      // Track purchase event
      await trackEventSimple(
        "purchase",
        EventType.PURCHASE,
        EventCategory.CONVERSION
      );

      // Save customer data for future orders
      saveCustomerData();

      // Store order data for thank you page
      const orderDataForThankYou = {
        customerName: formData.fullName,
        items: items,
        subtotal: subtotal,
        shippingFee: shippingFee,
        total: totalPrice,
        orderDate: new Date().toISOString(),
        orderNumber:
          createdOrder?.order_number ||
          (createdOrder?.id ? createdOrder.id.toString() : "N/A"),
        paymentMethod: "cash_on_delivery",
      };

      localStorage.setItem("lastOrder", JSON.stringify(orderDataForThankYou));

      // Clear cart and navigate to thank you page
      clearCart();
      navigate("/thank-you");
    } catch (error) {
      console.error("Error creating order:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("orderSubmissionError") || "حدث خطأ أثناء إرسال الطلب"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
    navigate("/cart");
    return null;
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
            <Link to="/cart">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                {t("cart")}
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {isRTL ? "إتمام الطلب" : "Checkout"}
              </h1>
            </div>
            <p className="text-white/90 text-lg">
              {isRTL 
                ? "أكمل المعلومات المطلوبة لإتمام طلبك بنجاح"
                : "Complete your order with just a few simple steps"
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Order Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-8">
                <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {isRTL ? "معلومات العميل" : "Customer Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {submitError && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-red-600 font-medium">{submitError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name Field */}
                  <div className="relative">
                    <Label htmlFor="fullName" className="text-gray-700 font-medium mb-3 block">
                      {t("fullName")}
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-12 h-14 border-gray-300 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white shadow-sm"
                        placeholder={isRTL ? "أدخل اسمك الكامل" : "Enter your full name"}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="relative">
                    <Label htmlFor="phoneNumber" className="text-gray-700 font-medium mb-3 block">
                      {t("phoneNumber")}
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="pl-12 h-14 border-gray-300 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white shadow-sm"
                        placeholder={isRTL ? "أدخل رقم هاتفك" : "Enter your phone number"}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Address Field */}
                  <div className="relative">
                    <Label htmlFor="fullAddress" className="text-gray-700 font-medium mb-3 block">
                      {t("fullAddress")}
                    </Label>
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <Textarea
                        id="fullAddress"
                        name="fullAddress"
                        required
                        rows={4}
                        value={formData.fullAddress}
                        onChange={handleInputChange}
                        className="pl-12 pt-4 border-gray-300 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white shadow-sm resize-none"
                        placeholder={isRTL ? "أدخل عنوانك الكامل بالتفصيل" : "Enter your complete address"}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Enhanced Payment Method Section */}
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">
                      {isRTL ? "طريقة الدفع" : "Payment Method"}
                    </Label>
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl transform rotate-1"></div>
                      <div className="relative border-2 border-green-200 rounded-2xl p-6 bg-white shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                            <Truck className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-green-800 text-lg">
                                {isRTL ? "الدفع عن طريق التواصل" : "Payment by contact"}
                              </h3>
                              <Badge className="bg-green-600 text-white px-3 py-1 rounded-full">
                                <Check className="w-3 h-3 mr-1" />
                                {isRTL ? "مفعل" : "Active"}
                              </Badge>
                            </div>
                            <p className="text-green-700 font-medium">
                              {isRTL
                                ? "سيتم التواصل معك للدفع"
                                : "You will be connectet for payment"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium mb-1">
                            {isRTL ? "ملاحظة مهمة:" : "Important Note:"}
                          </p>
                          <p className="text-blue-700">
                            {isRTL
                              ? "الدفع يتم مسبقا حيث ان المنتجات تصمم خصيصا لك."
                              : "Payment is made in advance as the products are custom-designed for you."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          <span className="animate-pulse">
                            {t("submittingOrder") || "جاري إرسال الطلب..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-6 h-6 mr-3" />
                          {t("submitOrder") || "إرسال الطلب"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden sticky top-6">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-8">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  {t("orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div
                      key={`${item.id}-${item.variant_id || "default"}-${index}`}
                      className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={
                            typeof item.title === "object"
                              ? item.title[language]
                              : item.title
                          }
                          className="w-16 h-16 object-cover rounded-xl shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-2">
                          {typeof item.title === "object"
                            ? item.title[language]
                            : item.title}
                        </h3>

                        {/* Variant Information */}
                        {item.variant_name && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200 mb-2"
                          >
                            {isRTL
                              ? `اللون: ${item.variant_name}`
                              : `Color: ${item.variant_name}`}
                          </Badge>
                        )}

                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>
                          <p className="font-bold text-green-600">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pricing Summary */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">{t("subtotal")}</span>
                      <span className="font-bold text-gray-800">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">{t("shipping")}</span>
                      <span className="font-bold text-gray-800">
                        {formatPrice(shippingFee)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-800">{t("total")}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">
                        {isRTL ? "طريقة الدفع:" : "Payment Method:"}
                      </span>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-bold">
                          {isRTL ? "سيتم التوصل معك لتاكيد الدفع" : "You will be contacted to confirm payment."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;