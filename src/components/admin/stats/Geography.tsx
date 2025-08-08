import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Users, BarChart3, TrendingUp, Calendar, Navigation } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { statisticsAPI } from '@/lib/stats_api';

const GeographyPage = () => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchGeographyData();
  }, [selectedPeriod]);

  const fetchGeographyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await statisticsAPI.getGeography(parseInt(selectedPeriod));
      setGeoData(data);
    } catch (error) {
      console.error('Error fetching geography data:', error);
      setError('فشل في جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const countryColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const getFlagEmoji = (countryName) => {
    const flags = {
      'Egypt': '🇪🇬',
      'Saudi Arabia': '🇸🇦',
      'UAE': '🇦🇪',
      'Jordan': '🇯🇴',
      'Lebanon': '🇱🇧',
      'Syria': '🇸🇾',
      'Iraq': '🇮🇶',
      'Palestine': '🇵🇸',
      'Morocco': '🇲🇦',
      'Algeria': '🇩🇿',
      'Tunisia': '🇹🇳',
      'Libya': '🇱🇾',
      'Sudan': '🇸🇩',
      'Qatar': '🇶🇦',
      'Kuwait': '🇰🇼',
      'Bahrain': '🇧🇭',
      'Oman': '🇴🇲',
      'Yemen': '🇾🇪'
    };
    return flags[countryName] || '🌍';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchGeographyData}
              className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              إعادة المحاولة
            </button>
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
              <Globe className="ml-2 h-6 w-6 text-blue-600" />
              التوزيع الجغرافي
            </h1>
            <p className="text-gray-500 mt-1">توزيع الزوار حسب البلدان والمدن</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 90 يوم</option>
            </select>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الزوار</p>
              <p className="text-2xl font-bold text-gray-900">{geoData?.total_visitors || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">عدد البلدان</p>
              <p className="text-2xl font-bold text-gray-900">{geoData?.countries_count || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">عدد المدن</p>
              <p className="text-2xl font-bold text-gray-900">{geoData?.cities_count || 0}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* توزيع البلدان */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="ml-2 h-5 w-5 text-blue-600" />
            توزيع البلدان
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={geoData?.top_countries || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, visitors }) => `${name}: ${visitors}`}
                outerRadius={80}
                dataKey="visitors"
              >
                {geoData?.top_countries?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={countryColors[index % countryColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* توزيع المدن */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="ml-2 h-5 w-5 text-green-600" />
            توزيع المدن
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geoData?.top_cities || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* قوائم التفاصيل */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* قائمة البلدان */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="ml-2 h-5 w-5 text-blue-600" />
            أهم البلدان
          </h3>
          <div className="space-y-3">
            {geoData?.top_countries?.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFlagEmoji(country.name)}</span>
                  <div>
                    <span className="font-medium text-gray-900">{country.name}</span>
                    <div className="text-xs text-gray-500">
                      {((country.visitors / geoData.total_visitors) * 100).toFixed(1)}% من إجمالي الزوار
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{country.visitors}</div>
                  <div className="text-xs text-gray-500">زائر</div>
                </div>
              </div>
            ))}
            
            {(!geoData?.top_countries || geoData.top_countries.length === 0) && (
              <div className="text-center py-8">
                <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد بيانات بلدان متاحة</p>
              </div>
            )}
          </div>
        </div>

        {/* قائمة المدن */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="ml-2 h-5 w-5 text-green-600" />
            أهم المدن
          </h3>
          <div className="space-y-3">
            {geoData?.top_cities?.map((city, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Navigation className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{city.name}</span>
                    <div className="text-xs text-gray-500">
                      {((city.visitors / geoData.total_visitors) * 100).toFixed(1)}% من إجمالي الزوار
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{city.visitors}</div>
                  <div className="text-xs text-gray-500">زائر</div>
                </div>
              </div>
            ))}
            
            {(!geoData?.top_cities || geoData.top_cities.length === 0) && (
              <div className="text-center py-8">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد بيانات مدن متاحة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="ml-2 h-5 w-5 text-purple-600" />
          ملخص التوزيع الجغرافي
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {geoData?.total_visitors || 0}
            </div>
            <div className="text-sm text-gray-600">إجمالي الزوار</div>
            <div className="text-xs text-gray-500 mt-1">
              في آخر {selectedPeriod} يوم
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {geoData?.countries_count || 0}
            </div>
            <div className="text-sm text-gray-600">بلد مختلف</div>
            <div className="text-xs text-gray-500 mt-1">
              تم الوصول للموقع منها
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {geoData?.cities_count || 0}
            </div>
            <div className="text-sm text-gray-600">مدينة مختلفة</div>
            <div className="text-xs text-gray-500 mt-1">
              تم الوصول للموقع منها
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographyPage;