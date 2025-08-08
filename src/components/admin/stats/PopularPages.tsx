import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Eye, 
  Users, 
  TrendingUp, 
  ExternalLink, 
  Calendar,
  Smartphone,
  ShoppingBag,
  Info,
  Phone,
  Home,
  Package,
  Search,
  Settings,
  Star,
  Tag
} from 'lucide-react';
import { statisticsAPI } from '@/lib/stats_api';

const PopularPages = () => {
  const [pagesData, setPagesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    fetchPopularPages();
  }, [selectedPeriod]);

  const fetchPopularPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsAPI.getPopularPages(selectedPeriod);
      setPagesData(data);
    } catch (error) {
      console.error('Error fetching popular pages:', error);
      setError('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const fullPath = urlObj.pathname + urlObj.search;
      // تقييد طول الرابط إلى 100 حرف
      return fullPath.length > 100 ? fullPath.substring(0, 100) + '...' : fullPath;
    } catch {
      return url.length > 100 ? url.substring(0, 100) + '...' : url;
    }
  };

  const getPageIcon = (url) => {
    if (url.includes('/category/')) return Smartphone;
    if (url.includes('/product/')) return ShoppingBag;
    if (url.includes('/about')) return Info;
    if (url.includes('/contact')) return Phone;
    if (url.includes('/home') || url === '/') return Home;
    if (url.includes('/search')) return Search;
    if (url.includes('/settings')) return Settings;
    if (url.includes('/favorite')) return Star;
    if (url.includes('/tag')) return Tag;
    return FileText;
  };

  const getPageTypeLabel = (url) => {
    if (url.includes('/category/')) return 'فئة';
    if (url.includes('/product/')) return 'منتج';
    if (url.includes('/about')) return 'حول';
    if (url.includes('/contact')) return 'اتصال';
    if (url.includes('/home') || url === '/') return 'الرئيسية';
    if (url.includes('/search')) return 'بحث';
    if (url.includes('/settings')) return 'إعدادات';
    if (url.includes('/favorite')) return 'المفضلة';
    if (url.includes('/tag')) return 'وسم';
    return 'صفحة';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="bg-gray-200 h-80 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="ml-2 h-6 w-6 text-blue-600" />
              الصفحات الشائعة
            </h1>
            <p className="text-gray-500 mt-1">أكثر الصفحات زيارة على الموقع</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>آخر 7 أيام</option>
              <option value={30}>آخر 30 يوم</option>
              <option value={90}>آخر 90 يوم</option>
            </select>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الصفحات</p>
              <p className="text-2xl font-bold text-gray-900">{pagesData?.pages?.length || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المشاهدات</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagesData?.pages?.reduce((sum, page) => sum + page.views, 0) || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الزوار</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagesData?.pages?.reduce((sum, page) => sum + page.unique_visitors, 0) || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الصفحات الشائعة */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="ml-2 h-5 w-5 text-blue-600" />
            أكثر الصفحات زيارة
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pagesData?.pages?.map((page, index) => {
            const IconComponent = getPageIcon(page.url);
            const pageType = getPageTypeLabel(page.url);
            const maxViews = Math.max(...(pagesData?.pages?.map(p => p.views) || [1]));
            
            return (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                {/* الصف الأول: معلومات الصفحة */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {pageType}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{page.title || 'بدون عنوان'}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="truncate">{formatUrl(page.url)}</span>
                        <ExternalLink className="h-3 w-3 ml-2 flex-shrink-0" />
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* الصف الثاني: الإحصائيات */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6 flex-1">
                    {/* حاوية المشاهدات */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center w-[70px]">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-3 w-3 text-blue-600 mr-1" />
                        <span className="text-xs text-blue-600 font-medium">مشاهدات</span>
                      </div>
                      <div className="text-sm font-bold text-blue-700">{page.views}</div>
                    </div>
                    
                    {/* حاوية الزوار */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center w-[70px]">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600 font-medium">زوار</span>
                      </div>
                      <div className="text-sm font-bold text-green-700">{page.unique_visitors}</div>
                    </div>
                    
                    {/* حاوية معدل المشاهدة */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center w-[70px]">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-3 w-3 text-purple-600 mr-1" />
                        <span className="text-xs text-purple-600 font-medium">معدل</span>
                      </div>
                      <div className="text-sm font-bold text-purple-700">
                        {page.unique_visitors > 0 ? (page.views / page.unique_visitors).toFixed(1) : 0}
                      </div>
                    </div>
                  </div>
                  
                  {/* نسبة الشعبية */}
                  <div className="text-left">
                    <div className="text-sm text-gray-500 mb-1">شعبية الصفحة</div>
                    <div className="text-xl font-bold text-blue-600">
                      {Math.round((page.views / maxViews) * 100)}%
                    </div>
                  </div>
                </div>
                
                {/* شريط التقدم */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(page.views / maxViews) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
          
          {(!pagesData?.pages || pagesData.pages.length === 0) && (
            <div className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد صفحات</h3>
              <p className="text-gray-500">لم يتم العثور على بيانات للفترة المحددة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularPages;