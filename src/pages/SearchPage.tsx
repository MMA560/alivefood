import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { searchApi } from '@/lib/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      searchResults: 'Search Results',
      resultsFor: 'Results for',
      noResults: 'No results found',
      noResultsDesc: 'Try adjusting your search terms or browse our categories',
      backToHome: 'Back to Home',
      sortBy: 'Sort by',
      relevance: 'Relevance',
      priceAsc: 'Price: Low to High',
      priceDesc: 'Price: High to Low',
      newest: 'Newest First',
      rating: 'Highest Rated',
      loading: 'Searching...',
      results: 'results',
    },
    ar: {
      searchResults: 'نتائج البحث',
      resultsFor: 'نتائج البحث عن',
      noResults: 'لا توجد نتائج',
      noResultsDesc: 'حاول تعديل كلمات البحث أو تصفح الفئات',
      backToHome: 'العودة للرئيسية',
      sortBy: 'ترتيب حسب',
      relevance: 'الأكثر صلة',
      priceAsc: 'السعر: من الأقل للأعلى',
      priceDesc: 'السعر: من الأعلى للأقل',
      newest: 'الأحدث أولاً',
      rating: 'الأعلى تقييماً',
      loading: 'جاري البحث...',
      results: 'نتيجة',
    },
  };

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) return;
      
      setLoading(true);
      try {
        const searchResults = await searchApi.searchProducts(query, 50); // Get more results
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  const sortResults = (results, sortType) => {
    const sorted = [...results];
    switch (sortType) {
      case 'priceAsc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceA - priceB;
        });
      case 'priceDesc':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceB - priceA;
        });
      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = parseFloat(a.rating) || 0;
          const ratingB = parseFloat(b.rating) || 0;
          return ratingB - ratingA;
        });
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
      default:
        return sorted;
    }
  };

  const sortedResults = sortResults(results, sortBy);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                {isRTL ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                {t('backToHome')}
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              {isRTL ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {t('backToHome')}
            </Button>
          </Link>
        </div>

        {/* Search Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('searchResults')}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Search className="w-5 h-5" />
            <span>
              {t('resultsFor')} "<span className="font-semibold text-gray-900">{query}</span>"
            </span>
            <span className="text-green-600 font-medium">
              ({results.length} {t('results')})
            </span>
          </div>
        </div>

        {results.length > 0 && (
          <>
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">{t('sortBy')}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent"
                >
                  <option value="relevance">{t('relevance')}</option>
                  <option value="priceAsc">{t('priceAsc')}</option>
                  <option value="priceDesc">{t('priceDesc')}</option>
                  <option value="rating">{t('rating')}</option>
                  <option value="newest">{t('newest')}</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {sortedResults.map((product) => (
                <ProductCard key={product.id} product={product} isMobile={true} />
              ))}
            </div>
          </>
        )}

        {/* No Results */}
        {results.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('noResults')}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('noResultsDesc')}
            </p>
            <Link to="/">
              <Button className="bg-green-600 hover:bg-green-700">
                {t('backToHome')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;