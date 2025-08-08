import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Filter, Grid, List } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrencySettings } from '@/hooks/useCurrencySettings';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { productsApi, categoriesApi, Product, Category } from '@/lib/api';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { language, isRTL } = useLanguage();
  const isMobile = useIsMobile();
  
  const { 
    siteSettings,
    activeCurrencies,
    formatAmount,
    loading: currencyLoading 
  } = useCurrencySettings();

  const categoryFromState = location.state?.category as Category | undefined;

  const translations = {
    en: {
      loading: 'Loading...',
      backToHome: 'Back to Home',
      products: 'products',
      product: 'product',
      available: 'available',
      noProductsFound: 'No Products Found',
      noProductsMessage: 'No products available in this category at the moment.',
      browseAll: 'Browse All Products',
      errorLoading: 'Error Loading Category',
      filters: 'Filters',
      gridView: 'Grid View',
      listView: 'List View',
      sortBy: 'Sort By',
      priceRange: 'Price Range'
    },
    ar: {
      loading: 'جارٍ التحميل...',
      backToHome: 'العودة للرئيسية',
      products: 'منتجات',
      product: 'منتج',
      available: 'متوفر',
      noProductsFound: 'لا توجد منتجات',
      noProductsMessage: 'لا توجد منتجات متوفرة في هذه الفئة حالياً.',
      browseAll: 'تصفح جميع المنتجات',
      errorLoading: 'خطأ في تحميل الفئة',
      filters: 'الفلاتر',
      gridView: 'عرض الشبكة',
      listView: 'عرض القائمة',
      sortBy: 'ترتيب حسب',
      priceRange: 'نطاق السعر'
    }
  };

  const t = (key: string) => translations[language][key] || key;

  // دالة لتنسيق السعر بالعملة الأساسية
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
      if (!categoryId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        if (categoryFromState) {
          setCategory(categoryFromState);
        } else {
          const categoriesData = await categoriesApi.getCategories();
          setCategories(categoriesData);
          
          const currentCategory = categoriesData.find(cat => 
            cat.slug === categoryId || cat.name === categoryId
          );
          setCategory(currentCategory || null);
        }
        
        const productsData = await productsApi.getProductsByCategory(categoryId);
        setProducts(productsData);
        
      } catch (err) {
        console.error('Error loading category data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId, categoryFromState]);

  const SkeletonCard = () => (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse ${
      isMobile ? 'mx-4' : ''
    }`}>
      <div className={`bg-gray-200 ${isMobile ? 'h-48' : 'aspect-square'}`}></div>
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

  if (loading || currencyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className={`container mx-auto px-4 py-8 ${isMobile ? 'px-2' : ''}`}>
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Title Skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-1 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>

          {/* Products Grid Skeleton */}
          <div className={`grid gap-4 md:gap-6 ${
            isMobile 
              ? 'grid-cols-1' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className={`text-center max-w-md mx-auto p-8 ${isMobile ? 'px-4' : ''}`}>
          <div className="text-red-500 mb-6">
            <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('errorLoading')}</h2>
          <p className="text-gray-600 mb-6 text-lg">{error}</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              {t('backToHome')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className={`container mx-auto px-4 py-8 ${isMobile ? 'px-2' : ''}`}>
        {/* Enhanced Header */}
        <div className={`flex items-center justify-between mb-8 ${isMobile ? 'px-2' : ''}`}>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 hover:border-green-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl px-6 py-3">
              {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              {t('backToHome')}
            </Button>
          </Link>

          {/* View Mode Toggle - Desktop Only */}
          {!isMobile && (
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                {t('gridView')}
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                {t('listView')}
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Title Section */}
        <div className={`text-center mb-12 relative ${isMobile ? 'px-2' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-green-50 to-green-100 rounded-3xl transform -skew-y-1"></div>
          <div className="relative py-12 px-8">
            <h1 className={`font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent ${
              isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'
            }`}>
              {category ? category.name : categoryId}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-green-700 mx-auto mb-6 rounded-full"></div>
            <p className={`text-gray-600 font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
              {products.length} {products.length === 1 ? t('product') : t('products')} {t('available')}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className={`text-center py-20 ${isMobile ? 'px-4' : ''}`}>
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-gray-400 mb-8">
                <svg className={`mx-auto ${isMobile ? 'w-24 h-24' : 'w-32 h-32'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className={`font-bold text-gray-700 mb-4 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {t('noProductsFound')}
              </h3>
              <p className={`text-gray-500 mb-8 leading-relaxed ${isMobile ? 'text-base' : 'text-lg'}`}>
                {t('noProductsMessage')}
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  {t('browseAll')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 md:gap-6 ${
            isMobile 
              ? 'grid-cols-1 px-2 gap-6' 
              : viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
          }`}>
            {products.map((product) => (
              <div key={product.id} className={isMobile ? 'mx-2' : ''}>
                <ProductCard 
                  product={product} 
                  isMobile={isMobile}
                  isCompact={!isMobile && viewMode === 'list'}
                  formatPrice={formatPrice}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;