import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { statisticsAPI } from "@/lib/stats_api";

const StatsPage = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsAPI.getStats(selectedPeriod);
      setStatsData(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("حدث خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  const deviceColors = {
    desktop: "#3B82F6",
    mobile: "#10B981",
    tablet: "#F59E0B",
  };

  const DeviceIcon = ({ device }) => {
    const icons = {
      desktop: Monitor,
      mobile: Smartphone,
      tablet: Tablet,
    };
    const IconComponent = icons[device] || Monitor;
    return <IconComponent className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="ml-2 h-6 w-6 text-blue-600" />
              الإحصائيات العامة
            </h1>
            <p className="text-gray-500 mt-1">نظرة شاملة على أداء الموقع</p>
          </div>

          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-400" />
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

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الزوار</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData?.total_visitors || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">زوار اليوم</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData?.today_visitors || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">زوار الأسبوع</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData?.this_week_visitors || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">مشاهدات الصفحات</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData?.total_page_views || 0}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* الرسم البياني */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            الزيارات اليومية
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statsData?.daily_visits || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("ar-EG", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("ar-EG")
                }
                formatter={(value, name) => [
                  value,
                  name === "visits" ? "الزيارات" : "مشاهدات الصفحات",
                ]}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6" }}
              />
              <Line
                type="monotone"
                dataKey="page_views"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            الأجهزة المستخدمة
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsData?.device_stats || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ device, count }) => `${device}: ${count}`}
              >
                {statsData?.device_stats?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={deviceColors[entry.device] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* أهم الدول والمدن */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="ml-2 h-5 w-5 text-blue-600" />
            أهم الدول
          </h3>
          <div className="space-y-3">
            {statsData?.top_countries?.map((country, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {country.name}
                  </span>
                </div>
                <span className="text-blue-600 font-semibold">
                  {country.visitors} زائر
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="ml-2 h-5 w-5 text-green-600" />
            أهم المدن
          </h3>
          <div className="space-y-3">
            {statsData?.top_cities?.map((city, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">{city.name}</span>
                </div>
                <span className="text-green-600 font-semibold">
                  {city.visitors} زائر
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
