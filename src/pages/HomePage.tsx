import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrencySettings } from "@/hooks/useCurrencySettings";
import { categoriesApi, productsApi } from "@/lib/api";

// Import components
import CategoriesNavbar from "@/components/HomePage/CategoriesNavbar";
import HeroSlider from "@/components/HomePage/HeroSlider";
import FeaturedCategories from "@/components/HomePage/FeaturedCategories";
import BestSellers from "@/components/HomePage/BestSeller";
import PromoBanner from "@/components/HomePage/PromoBanner";
import NewProducts from "@/components/HomePage/NewProducts";
import { getCachedData } from "@/hooks/useCurrencySettings";

// Skeleton Components
const CategoriesNavbarSkeleton = () => (
  <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-green-100">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-center py-3 overflow-x-auto">
        <div className="flex space-x-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  </nav>
);

const FeaturedCategoriesSkeleton = () => (
  <div className="container mx-auto px-4 my-8">
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100"
        >
          <div className="aspect-square bg-gray-200 animate-pulse"></div>
          <div className="p-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductsSkeleton = ({ title }) => (
  <div className="container mx-auto px-4 my-12">
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        {title}
      </h2>
      <div className="w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100"
        >
          <div className="aspect-square bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  // إضافة نظام العملات
  const {
    siteSettings,
    activeCurrencies,
    formatAmount,
    loading: currencyLoading,
  } = useCurrencySettings();

  const translate = (arText, enText) => {
    return language === "ar" ? arText : enText;
  };

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


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // استخدام Promise.all لتحميل البيانات بشكل متوازي
        const [categoriesData, productsData] = await Promise.all([
          // جرب مع معامل 'active' أولاً، ثم بدون معامل
          categoriesApi
            .getCategories()
            .catch(() => categoriesApi.getCategories()),
          productsApi.getAllProducts(12),
        ]);

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // عرض الـ skeleton أثناء تحميل البيانات الأساسية أو العملات
  if (loading || currencyLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CategoriesNavbarSkeleton />
        <div className="relative h-48 md:h-96 bg-gray-200 rounded-2xl mx-4 my-6 shadow-2xl animate-pulse">
          <div className="absolute bottom-8 left-8 md:left-1/2 md:transform md:-translate-x-1/2">
            <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
        <FeaturedCategoriesSkeleton />
        <ProductsSkeleton title={translate("الأكثر مبيعاً", "Best Sellers")} />
        <div className="container mx-auto px-4 my-12">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-8 text-white text-center">
            <div className="h-8 w-48 bg-green-500 rounded mx-auto mb-4"></div>
            <div className="h-6 w-32 bg-green-500 rounded mx-auto"></div>
          </div>
        </div>
        <ProductsSkeleton title={translate("منتجات جديدة", "New Products")} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {translate("خطأ في تحميل البيانات", "Error Loading Data")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {translate("إعادة المحاولة", "Try Again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoriesNavbar categories={categories} translate={translate} />
      <HeroSlider translate={translate} />
      <FeaturedCategories categories={categories} translate={translate} />
      <BestSellers translate={translate} formatPrice={formatPrice} />
      <PromoBanner translate={translate} />
      <NewProducts translate={translate} formatPrice={formatPrice} />
    </div>
  );
};

export default HomePage;
