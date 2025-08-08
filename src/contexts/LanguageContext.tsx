//src/contexts/languageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Related Products
    relatedProducts: "Related Products",
    aboutUs:"About Us",
    returnPolicy:"Shipping and return Policy",
    termsConditions:"Terms and Condictions",
    privacyPolicy:"Privacy policy",
    // Header
    storeName: 'Alive Food',
    cart: 'Cart',
    storeDescription:"Tech store for every thing You need related to Tech",
    // Homepage
    heroTitle: 'Premium Health Products',
    heroSubtitle: 'Discover our carefully curated selection of fermented foods, sprouted products, collagen, and detox juices',
    followUs:"Follow us",
    // Categories
    categories: 'Categories',
    
    // Product
    addToCart: 'Add to Cart',
    price: 'Price',
    oldPrice: 'Was',
    sar: 'SAR',
    similarProducts: 'Similar Products',
    faq: 'Frequently Asked Questions',
    productDetails: 'Product Details',
    
    // Cart
    cartTitle: 'Shopping Cart',
    quantity: 'Quantity',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    checkout: 'Checkout',
    orderSummary: 'Order Summary',
    
    // Checkout
    orderForm: 'Order Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    fullAddress: 'Full Address',
    submitOrder: 'Submit Order',
    
    // Thank you
    thankYou: 'Thank you',
    contactNote: 'You will be contacted within 1 to 3 business days.',
    
    // Common
    backToHome: 'Back to Home',
    backToProducts: 'Back to Products',
    loading: 'Loading...',
    
    // WhatsApp
    contactUs: 'Contact Us',
  },
  ar: {
    // Related Products - هذا السطر كان مفقود!
    relatedProducts: 'منتجات مشابهة',
    
    // Header
    storeName: 'Alive Food',
    cart: 'السلة',
    
    // Homepage
    heroTitle: 'منتجات صحية مميزة',
    heroSubtitle: 'اكتشف مجموعتنا المختارة بعناية من الأطعمة المتخمرة والمنتجات المنبتة والكولاجين وعصائر التخلص من السموم',
    storeDescription:"كل ما هو يتعلق بالتكنولوجيا تحتاجه",
    // Categories
    categories: 'الفئات',
    quickLinks: " روابط سريعه",
    aboutUs:"من نحن",
    returnPolicy:"سياسات الشحن والاسترجاع",
    termsConditions:"الشروط والاحكام",
    privacyPolicy:"سياسة الخصوصية",
    followUs:"تابعنا",
    // Product
    addToCart: 'أضف للسلة',
    price: 'السعر',
    oldPrice: 'كان',
    sar: 'ريال',
    similarProducts: 'منتجات مشابهة',
    faq: 'الأسئلة الشائعة',
    productDetails: 'تفاصيل المنتج',
    brand: 'الماركة',
    
    // Cart
    cartTitle: 'سلة التسوق',
    quantity: 'الكمية',
    total: 'الإجمالي',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    emptyCart: 'سلتك فارغة',
    continueShopping: 'متابعة التسوق',
    checkout: 'إتمام الطلب',
    orderSummary: 'ملخص الطلب',
    submittingOrder: 'جاري إرسال الطلب ...',
    
    // Checkout
    orderForm: 'معلومات الطلب',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    fullAddress: 'العنوان الكامل',
    submitOrder: 'إرسال الطلب',
    
    // Thank you
    thankYou: 'شكرًا لك',
    contactNote: 'سيتم التواصل معك خلال ١ إلى ٣ أيام عمل.',
    
    // Common
    backToHome: 'العودة للرئيسية',
    backToProducts: 'العودة للمنتجات',
    loading: 'جاري التحميل...',
    
    // WhatsApp
    contactUs: 'تواصل معنا',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar'); // Changed default to Arabic

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};