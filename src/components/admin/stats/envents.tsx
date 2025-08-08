import React, { useState, useEffect } from 'react';
import { Activity, Calendar, MapPin, TrendingUp, Users, Eye, Globe, Clock, Filter } from 'lucide-react';
import { eventsAPI, EventType, EventStats, EventSummaryResponse, TopCitiesResponse, VisitorEventsResponse } from '@/lib/events_api';

const EventsPage = () => {
  const [eventsData, setEventsData] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsPerPage] = useState(20);

  useEffect(() => {
    fetchEventsData();
  }, [selectedPeriod, selectedEventType]);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promises = [
        eventsAPI.getEventStats(selectedPeriod),
        eventsAPI.getEventsSummary(selectedPeriod),
        eventsAPI.getTopEventCities(
          selectedEventType === 'all' ? undefined : selectedEventType,
          selectedEventType === 'all' ? undefined : selectedEventType as EventType,
          selectedPeriod
        )
      ];

      const [statsResponse, summaryResponse, citiesResponse] = await Promise.allSettled(promises);

      let combinedData = {
        total_events: 0,
        today_events: 0,
        this_week_events: 0,
        period_days: selectedPeriod,
        avg_daily_events: 0,
        top_events: [],
        top_cities: [],
        top_types: [],
        top_countries: []
      };

      // معالجة بيانات الإحصائيات
      if (statsResponse.status === 'fulfilled') {
        const stats = statsResponse.value as EventStats;
        
        combinedData = {
          ...combinedData,
          total_events: stats.total_events || 0,
          period_days: stats.period_days || selectedPeriod,
          top_events: (stats.top_events || []).map(event => ({
            name: event.name,
            count: event.count || 0,
            event_type: event.event_type,
            event_category: event.event_category,
            location: event.location,
            first_seen: event.first_seen,
            last_seen: event.last_seen,
            cities: event.cities || [],
            countries: event.countries || [],
            percentage: ((event.count || 0) / Math.max(stats.total_events || 1, 1) * 100)
          })),
          top_cities: (stats.top_cities || []).map(city => ({
            name: city.city,
            count: city.count || 0,
            percentage: ((city.count || 0) / Math.max(stats.total_events || 1, 1) * 100),
            country: city.country || 'Egypt'
          })),
          top_types: (stats.top_types || []).map(type => ({
            event_type: type.type,
            count: type.count || 0,
            percentage: ((type.count || 0) / Math.max(stats.total_events || 1, 1) * 100)
          })),
          top_countries: stats.top_countries || []
        };
      }

      // معالجة بيانات الملخص
      if (summaryResponse.status === 'fulfilled') {
        const summary = summaryResponse.value as EventSummaryResponse;
        combinedData.avg_daily_events = summary.avg_daily_events || 0;
        combinedData.today_events = summary.total_events || 0;
        combinedData.this_week_events = summary.total_events || 0;
        setSummaryData(summary);
      }

      // معالجة بيانات المدن
      if (citiesResponse.status === 'fulfilled') {
        const cities = citiesResponse.value as TopCitiesResponse;
        const cityData = (cities.cities || []).map(city => ({
          name: city.city,
          count: city.count || 0,
          percentage: ((city.count || 0) / Math.max(cities.total_events || 1, 1) * 100),
          country: city.country
        }));
        setCitiesData(cityData);
        combinedData.top_cities = cityData;
      }

      setEventsData(combinedData);
      fetchRecentEvents(combinedData);

    } catch (error) {
      console.error('Error fetching events data:', error);
      setError('حدث خطأ في جلب بيانات الأحداث. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentEvents = async (data = eventsData) => {
    try {
      setEventsLoading(true);
      // استخدام البيانات الحقيقية من top_events بدلاً من البيانات الوهمية
      if (data?.top_events) {
        const recentEventsData = data.top_events.map((event: any) => ({
          event_id: event.name,
          event_name: getEventLabel(event.name),
          event_type: event.event_type,
          event_category: event.event_category,
          timestamp: event.last_seen || event.first_seen,
          location: {
            city: event.cities?.[0] || 'غير محدد',
            country: event.countries?.[0] || 'غير محدد'
          },
          count: event.count
        }));
        setRecentEvents(recentEventsData);
      }
    } catch (error) {
      console.error('Error fetching recent events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const eventColors: { [key: string]: string } = {
    page_view: '#3B82F6',
    button_click: '#10B981',
    form_submit: '#F59E0B',
    purchase: '#EF4444',
    search: '#8B5CF6',
    login: '#6366F1',
    registration: '#EC4899',
    download: '#F97316',
    logout: '#84CC16',
    custom: '#6B7280'
  };

  const getEventLabel = (eventName: string): string => {
    const labels: { [key: string]: string } = {
      page_view: 'مشاهدة الصفحة',
      button_click: 'النقر على الأزرار',
      button_click_signup: 'النقر على زر التسجيل',
      form_submit: 'إرسال النماذج',
      purchase: 'شراء',
      search: 'البحث',
      login: 'تسجيل دخول',
      registration: 'تسجيل جديد',
      download: 'التحميل',
      logout: 'تسجيل خروج',
      custom: 'مخصص',
      add_to_cart: 'اضف للسلة'
    };
    return labels[eventName] || eventName;
  };

  const EventIcon = ({ eventType }: { eventType: string }) => {
    const icons: { [key: string]: any } = {
      page_view: Eye,
      button_click: Activity,
      form_submit: Calendar,
      purchase: TrendingUp,
      search: Globe,
      login: Users,
      registration: Users,
      download: TrendingUp,
      logout: Users,
      custom: MapPin
    };
    const IconComponent = icons[eventType] || Activity;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-US');
  };

  const formatPercentage = (percentage: number | undefined | null): string => {
    if (percentage === undefined || percentage === null || isNaN(percentage)) return '0.0';
    return percentage.toFixed(1);
  };

  const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now.getTime() - eventTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `منذ ${diffMins} دقيقة`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`;
    } else {
      return `منذ ${diffDays} يوم`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-lg" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
          <div className="h-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-lg" style={{ animationDelay: '0.8s' }}></div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400">
              <Activity className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchEventsData}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                المحاولة مرة أخرى
              </button>
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
              <Activity className="ml-2 h-6 w-6 text-blue-600" />
              إحصائيات الأحداث
            </h1>
            <p className="text-gray-500 mt-1">تتبع سلوك المستخدمين والأحداث</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
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
            
            <select 
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأحداث</option>
              <option value="page_view">مشاهدة الصفحة</option>
              <option value="purchase">الشراء</option>
              <option value="search">البحث</option>
              <option value="login">تسجيل الدخول</option>
              <option value="registration">التسجيل</option>
            </select>
          </div>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الأحداث</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(eventsData?.total_events)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">أحداث اليوم</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(eventsData?.today_events)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">أحداث الأسبوع</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(eventsData?.this_week_events)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">متوسط يومي</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(eventsData?.avg_daily_events)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* جدول الأحداث */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="ml-2 h-5 w-5 text-blue-600" />
          جدول الأحداث
        </h3>
        
        {eventsLoading ? (
          <div className="animate-pulse">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-medium text-gray-700">اسم الحدث</th>
                  <th className="p-3 font-medium text-gray-700">نوع الحدث</th>
                  <th className="p-3 font-medium text-gray-700">التاريخ والوقت</th>
                  <th className="p-3 font-medium text-gray-700">المدينة</th>
                  <th className="p-3 font-medium text-gray-700">الدولة</th>
                  <th className="p-3 font-medium text-gray-700">العدد</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event, index) => (
                  <tr key={event.event_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-full" style={{ backgroundColor: `${eventColors[event.event_type] || '#8884d8'}20` }}>
                          <EventIcon eventType={event.event_type} />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{event.event_name}</span>
                          <p className="text-xs text-gray-500">{event.event_category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {getEventLabel(event.event_type)}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {event.timestamp ? formatDateTime(event.timestamp) : 'غير متوفر'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{event.location?.city || 'غير محدد'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {event.location?.country || 'غير محدد'}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-green-600">{formatNumber(event.count)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* إحصائيات الأحداث والمدن */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="ml-2 h-5 w-5 text-green-600" />
            أكثر المدن نشاطاً
          </h3>
          <div className="space-y-3">
            {citiesData?.slice(0, 5).map((city: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{city.name}</span>
                    {city.country && (
                      <p className="text-sm text-gray-500">{city.country}</p>
                    )}
                    <p className="text-sm text-gray-500">{formatPercentage(city.percentage)}% من الأحداث</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">{formatNumber(city.count)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="ml-2 h-5 w-5 text-purple-600" />
            أنواع الأحداث
          </h3>
          <div className="space-y-3">
            {eventsData?.top_types?.map((type: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <EventIcon eventType={type.event_type} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{getEventLabel(type.event_type)}</span>
                    <p className="text-sm text-gray-500">{formatPercentage(type.percentage)}% من الأحداث</p>
                  </div>
                </div>
                <span className="text-purple-600 font-semibold">{formatNumber(type.count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-blue-900">نصائح لتحسين الأداء</h4>
            <p className="text-blue-700 mt-1">
              جرب تغيير الفترة الزمنية أو نوع الحدث للحصول على بيانات أكثر.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;