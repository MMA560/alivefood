// src/lib/stats_api.ts

// ==================== Base Configuration ====================
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ==================== Helper Functions ====================

/**
 * جلب headers المصادقة للـ admin
 * يعيد: headers مع التوكن للعمليات المحمية
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

/**
 * جلب headers عادية بدون مصادقة
 * يعيد: headers أساسية للعمليات العامة
 */
const getBasicHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

/**
 * فحص إذا كان المستخدم مسجل الدخول كـ admin
 * يعيد: true إذا كان يملك توكن صالح
 */
const hasValidAdminToken = (): boolean => {
  try {
    const token = localStorage.getItem('adminToken');
    return token !== null && token.trim() !== '';
  } catch (error) {
    console.warn('Unable to check admin token:', error);
    return false;
  }
};

// ==================== Statistics Types ====================
export interface DeviceType {
  device: string;
  count: number;
}

export interface CountryStats {
  name: string;
  visitors: number;
  code?: string;
}

export interface CityStats {
  name: string;
  visitors: number;
  country?: string;
}

export interface DailyVisit {
  date: string;
  visits: number;
  page_views: number;
}

export interface PopularPage {
  url: string;
  title?: string;
  views: number;
  unique_visitors: number;
}

export interface SimpleStats {
  total_visitors: number;
  today_visitors: number;
  this_week_visitors: number;
  total_page_views: number;
  bounce_rate?: number;
  daily_visits: DailyVisit[];
  top_countries: CountryStats[];
  top_cities: CityStats[];
  top_pages: Array<{
    url: string;
    title?: string;
    views: number;
    unique_visitors?: number;
  }>;
  device_stats: DeviceType[];
  generated_at: string;
}

export interface DetailedLocationStats {
  country: string;
  cities: CityStats[];
  total_visitors: number;
  percentage_of_total: number;
}

export interface GeographicBreakdown {
  total_visitors: number;
  countries_count: number;
  cities_count: number;
  top_countries: CountryStats[];
  top_cities: CityStats[];
  countries_with_cities: DetailedLocationStats[];
}

export interface PopularPagesResponse {
  pages: PopularPage[];
  period: string;
  generated_at: string;
}

// ==================== Statistics API Service ====================
class StatisticsAPI {
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit = {},
    useAuth: boolean = true
  ): Promise<T> {
    try {
      const headers = useAuth ? getAuthHeaders() : getBasicHeaders();
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          ...headers,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error - ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * جلب الإحصائيات البسيطة (مع مصادقة)
   * @param days عدد الأيام (افتراضي: 30)
   * @returns إحصائيات بسيطة شاملة
   */
  async getStats(days: number = 30): Promise<SimpleStats> {
    return this.fetchWithErrorHandling<SimpleStats>(
      `/visits/stats?days=${days}`,
      {},
      true // مع مصادقة - عملية جلب بيانات إحصائية
    );
  }

  /**
   * جلب التفصيل الجغرافي للزوار (مع مصادقة)
   * @param days عدد الأيام (افتراضي: 30)
   * @returns تفصيل جغرافي شامل
   */
  async getGeography(days: number = 30): Promise<GeographicBreakdown> {
    return this.fetchWithErrorHandling<GeographicBreakdown>(
      `/visits/geography?days=${days}`,
      {},
      true // مع مصادقة - عملية جلب بيانات إحصائية
    );
  }

  /**
   * جلب الصفحات الشعبية (مع مصادقة)
   * @param days عدد الأيام (افتراضي: 30)
   * @param limit عدد الصفحات (افتراضي: 10)
   * @returns قائمة الصفحات الشعبية
   */
  async getPopularPages(
    days: number = 30,
    limit: number = 10
  ): Promise<PopularPagesResponse> {
    return this.fetchWithErrorHandling<PopularPagesResponse>(
      `/visits/pages/popular?days=${days}&limit=${limit}`,
      {},
      true // مع مصادقة - عملية جلب بيانات إحصائية
    );
  }
}

// ==================== Helper Functions ====================

/**
 * جلب الإحصائيات البسيطة مع معالجة الأخطاء
 * @param days عدد الأيام
 * @returns الإحصائيات أو null في حالة الفشل
 */
export const getQuickStats = async (
  days: number = 30
): Promise<SimpleStats | null> => {
  try {
    return await statisticsAPI.getStats(days);
  } catch (error) {
    console.error('Failed to get quick stats:', error);
    return null;
  }
};

/**
 * جلب التفصيل الجغرافي مع معالجة الأخطاء
 * @param days عدد الأيام
 * @returns التفصيل الجغرافي أو null في حالة الفشل
 */
export const getQuickGeography = async (
  days: number = 30
): Promise<GeographicBreakdown | null> => {
  try {
    return await statisticsAPI.getGeography(days);
  } catch (error) {
    console.error('Failed to get geography stats:', error);
    return null;
  }
};

/**
 * جلب الصفحات الشعبية مع معالجة الأخطاء
 * @param days عدد الأيام
 * @param limit عدد الصفحات
 * @returns الصفحات الشعبية أو null في حالة الفشل
 */
export const getQuickPopularPages = async (
  days: number = 30,
  limit: number = 10
): Promise<PopularPagesResponse | null> => {
  try {
    return await statisticsAPI.getPopularPages(days, limit);
  } catch (error) {
    console.error('Failed to get popular pages:', error);
    return null;
  }
};

/**
 * جلب إحصائيات متعددة بشكل متوازي
 * @param days عدد الأيام
 * @returns كائن يحتوي على جميع الإحصائيات
 */
export const getAllStats = async (days: number = 30) => {
  try {
    const [stats, geography, popularPages] = await Promise.allSettled([
      statisticsAPI.getStats(days),
      statisticsAPI.getGeography(days),
      statisticsAPI.getPopularPages(days, 10)
    ]);

    return {
      stats: stats.status === 'fulfilled' ? stats.value : null,
      geography: geography.status === 'fulfilled' ? geography.value : null,
      popularPages: popularPages.status === 'fulfilled' ? popularPages.value : null,
      hasErrors: [stats, geography, popularPages].some(
        result => result.status === 'rejected'
      )
    };
  } catch (error) {
    console.error('Failed to get all stats:', error);
    return {
      stats: null,
      geography: null,
      popularPages: null,
      hasErrors: true
    };
  }
};

/**
 * فحص صحة الإحصائيات
 * @returns true إذا كانت الخدمة تعمل بشكل صحيح
 */
export const checkStatsHealth = async (): Promise<boolean> => {
  try {
    const stats = await statisticsAPI.getStats(1);
    return stats && typeof stats.total_visitors === 'number';
  } catch (error) {
    console.error('Stats health check failed:', error);
    return false;
  }
};

// ==================== Export Additional Utilities ====================


/**
 * فحص إذا كان بإمكان المستخدم الوصول للإحصائيات
 * يعيد: true إذا كان يملك صلاحية الوصول
 */
export const canAccessStats = (): boolean => {
  return hasValidAdminToken();
};

// ==================== Export API Instance ====================
export const statisticsAPI = new StatisticsAPI();

export default statisticsAPI;