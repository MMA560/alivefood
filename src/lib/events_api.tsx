// src/lib/events_api.ts

// ==================== Base Configuration ====================
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ==================== Helper Functions ====================

/**
 * فحص إذا كان المستخدم admin
 * يعيد: true إذا كان admin، false إذا لم يكن
 */
const isAdmin = (): boolean => {
  try {
    return localStorage.getItem('is_admin') === 'true';
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return false;
  }
};

/**
 * فحص إذا كان يجب منع التتبع
 * يعيد: true إذا يجب منع التتبع، false إذا يجب السماح
 */
const shouldSkipTracking = (): boolean => {
  return isAdmin();
};

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

// ==================== Event Types ====================
export enum EventType {
  PAGE_VIEW = "page_view",
  BUTTON_CLICK = "button_click", 
  FORM_SUBMIT = "form_submit",
  DOWNLOAD = "download",
  SEARCH = "search",
  PURCHASE = "purchase",
  REGISTRATION = "registration",
  LOGIN = "login",
  LOGOUT = "logout",
  CUSTOM = "custom",
  ADD_TO_CART = "add_to_cart"
}

export enum EventCategory {
  ENGAGEMENT = "engagement",
  CONVERSION = "conversion",
  NAVIGATION = "navigation",
  USER_ACTION = "user_action",
  SYSTEM = "system",
  GENERAL = "general"
}

export interface EventLocation {
  ip: string;
  country?: string;
  country_code?: string;
  city?: string;
  region?: string;
}

// ==================== Request Models ====================
export interface SimpleEventRequest {
  event_name: string;
  event_type: EventType;
  event_category?: EventCategory;
  event_data?: Record<string, any>;
}

// ==================== Response Models ====================
export interface EventResponse {
  event_id: string;
  visitor_id: string;
  event_name: string;
  event_type: EventType;
  location?: EventLocation;
  success: boolean;
  message: string;
}

export interface TopEvent {
  name: string;  // كان event_name
  count: number;
  event_type: string;
  event_category: string;
  location: string;
  cities: string[];
  countries: string[];
  first_seen: string;
  last_seen: string;
  total_locations: number;
}

export interface TopCity {
  city: string;
  country: string;
  count: number;
  unique_events: number;
  unique_event_types: number;
  events: string[];
}

export interface TopCountry {
  country: string;
  count: number;
  unique_cities: number;
  unique_events: number;
  cities: string[];
  events: string[];
}

export interface EventStats {
  total_events: number;
  period_days: number;
  top_events: TopEvent[];
  top_types: Array<{ 
    type: string;  // كان event_type
    count: number; 
    unique_events: number;
    events: string[];
  }>;
  top_cities: TopCity[];
  top_countries: TopCountry[];
  generated_at: string;
}

export interface TopCitiesResponse {
  cities: TopCity[];
  event_name?: string;
  event_type?: EventType;
  period_days: number;
  total_events: number;
}

export interface VisitorEvent {
  event_id: string;
  event_name: string;
  event_type: EventType;
  event_category?: EventCategory;
  timestamp: string;
  location?: EventLocation;
  event_data?: Record<string, any>;
}

export interface VisitorEventsResponse {
  visitor_id: string;
  events: VisitorEvent[];
  period_days: number;
  total_events: number;
}

export interface EventSummaryResponse {
  total_events: number;
  period_days: number;
  avg_daily_events: number;
  top_event?: TopEvent;
  top_city?: TopCity;
  top_country?: TopCountry;
}

export interface EventHealthResponse {
  status: 'healthy' | 'unhealthy';
  events_today: number;
  events_last_hour: number;
  timestamp: string;
  message: string;
}

export interface QuickTrackResponse {
  success: boolean;
  event_id: string;
  visitor_id: string;
  message: string;
}

export interface EventTypesResponse {
  event_types: Array<{
    value: string;
    label: string;
    example: string;
  }>;
}

export interface EventCategoriesResponse {
  event_categories: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

// ==================== Events API Service ====================
class EventsAPI {
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit = {},
    useAuth: boolean = false
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
   * تتبع حدث بسيط - الطريقة الأساسية (بدون مصادقة)
   * الطلب: يرسل بيانات الحدث الأساسية فقط
   * الاستجابة: يعيد معرف الحدث وتفاصيل التسجيل
   */
  async trackEvent(eventData: SimpleEventRequest): Promise<EventResponse> {
    // فحص الـ admin قبل التتبع
    if (shouldSkipTracking()) {
      console.log('Skipping event tracking - Admin user detected');
      return {
        event_id: 'admin-skip',
        visitor_id: 'admin',
        event_name: eventData.event_name,
        event_type: eventData.event_type,
        success: true,
        message: 'Event tracking skipped for admin user'
      };
    }

    return this.fetchWithErrorHandling<EventResponse>(
      '/events/track',
      {
        method: 'POST',
        body: JSON.stringify(eventData),
      },
      false // بدون مصادقة - عملية إنشاء حدث
    );
  }

  /**
   * تتبع سريع للأحداث - أسرع طريقة (بدون مصادقة)
   * الطلب: يرسل البيانات كـ query parameters
   * الاستجابة: يعيد تأكيد التسجيل مع معرف الحدث
   */
  async quickTrackEvent(
    eventName: string,
    eventType: EventType,
    eventCategory: EventCategory = EventCategory.GENERAL
  ): Promise<QuickTrackResponse> {
    // فحص الـ admin قبل التتبع
    if (shouldSkipTracking()) {
      console.log('Skipping quick event tracking - Admin user detected');
      return {
        success: true,
        event_id: 'admin-skip',
        visitor_id: 'admin',
        message: 'Quick event tracking skipped for admin user'
      };
    }

    const params = new URLSearchParams({
      event_name: eventName,
      event_type: eventType,
      event_category: eventCategory
    });

    return this.fetchWithErrorHandling<QuickTrackResponse>(
      `/events/quick-track?${params}`,
      {},
      false // بدون مصادقة - عملية إنشاء حدث
    );
  }

  /**
   * جلب إحصائيات الأحداث الشاملة (مع مصادقة)
   * الطلب: يرسل عدد الأيام المطلوبة
   * الاستجابة: يعيد إحصائيات مفصلة للأحداث والمدن والدول
   */
  async getEventStats(days: number = 30): Promise<EventStats> {
    return this.fetchWithErrorHandling<EventStats>(
      `/events/stats?days=${days}`,
      {},
      true // مع مصادقة - عملية جلب بيانات
    );
  }

  /**
   * جلب أكثر المدن أحداثاً (مع مصادقة)
   * الطلب: يرسل اسم الحدث (اختياري) وعدد الأيام والحد الأقصى
   * الاستجابة: يعيد قائمة بأكثر المدن نشاطاً
   */
  async getTopEventCities(
    eventName?: string,
    eventType?: EventType,
    days: number = 30,
    limit: number = 10
  ): Promise<TopCitiesResponse> {
    const params = new URLSearchParams({
      days: days.toString(),
      limit: limit.toString()
    });

    if (eventName) params.append('event_name', eventName);
    if (eventType) params.append('event_type', eventType);
    
    return this.fetchWithErrorHandling<TopCitiesResponse>(
      `/events/cities/top?${params}`,
      {},
      true // مع مصادقة - عملية جلب بيانات
    );
  }

  /**
   * جلب أحداث زائر معين (مع مصادقة)
   * الطلب: يرسل معرف الزائر وعدد الأيام والحد الأقصى
   * الاستجابة: يعيد قائمة بجميع أحداث الزائر
   */
  async getEventsByVisitor(
    visitorId: string,
    days: number = 30,
    limit: number = 20
  ): Promise<VisitorEventsResponse> {
    const params = new URLSearchParams({
      days: days.toString(),
      limit: limit.toString()
    });

    return this.fetchWithErrorHandling<VisitorEventsResponse>(
      `/events/visitor/${encodeURIComponent(visitorId)}?${params}`,
      {},
      true // مع مصادقة - عملية جلب بيانات
    );
  }

  /**
   * جلب ملخص سريع للأحداث (مع مصادقة)
   * الطلب: يرسل عدد الأيام (افتراضي 7)
   * الاستجابة: يعيد ملخص مبسط بأهم الإحصائيات
   */
  async getEventsSummary(days: number = 7): Promise<EventSummaryResponse> {
    return this.fetchWithErrorHandling<EventSummaryResponse>(
      `/events/summary?days=${days}`,
      {},
      true // مع مصادقة - عملية جلب بيانات
    );
  }

  /**
   * فحص صحة خدمة الأحداث (مع مصادقة)
   * الطلب: لا يحتاج بيانات إضافية
   * الاستجابة: يعيد حالة الخدمة وأحداث اليوم والساعة الماضية
   */
  async checkEventsHealth(): Promise<EventHealthResponse> {
    return this.fetchWithErrorHandling<EventHealthResponse>(
      '/events/health',
      {},
      true // مع مصادقة - عملية جلب بيانات
    );
  }

  /**
   * جلب أنواع الأحداث المتاحة (مع مصادقة)
   * الطلب: لا يحتاج بيانات إضافية
   * الاستجابة: يعيد قائمة بجميع أنواع الأحداث مع أمثلة
   */
  async getEventTypes(): Promise<EventTypesResponse> {
    return this.fetchWithErrorHandling<EventTypesResponse>(
      '/events/types',
      {},
      true // مع مصادقة - عملية جلب بيانات
    );
  }

  /**
   * جلب فئات الأحداث المتاحة (مع مصادقة)
   * الطلب: لا يحتاج بيانات إضافية
   * الاستجابة: يعيد قائمة بجميع فئات الأحداث مع الوصف
   */
  async getEventCategories(): Promise<EventCategoriesResponse> {
    return this.fetchWithErrorHandling<EventCategoriesResponse>(
      '/events/categories',
      {},
      true // مع مصادقة - عملية جلب بيانات
    );
  }
}

// ==================== Updated Helper Functions ====================

/**
 * تتبع حدث بسيط مع معالجة الأخطاء (بدون مصادقة)
 * يستخدم: trackEvent API مع try/catch
 * يعيد: true للنجاح، false للفشل
 */
export const trackEventSimple = async (
  eventName: string,
  eventType: EventType,
  eventCategory?: EventCategory,
  eventData?: Record<string, any>
): Promise<boolean> => {
  // فحص الـ admin قبل التتبع
  if (shouldSkipTracking()) {
    console.log('Skipping event tracking - Admin user detected');
    return true; // نرجع true لأن "التخطي" يعتبر نجاح
  }

  try {
    const response = await eventsAPI.trackEvent({
      event_name: eventName,
      event_type: eventType,
      event_category: eventCategory,
      event_data: eventData,
    });
    return response.success;
  } catch (error) {
    console.error('Failed to track event:', error);
    return false;
  }
};

/**
 * تتبع سريع للأحداث مع معالجة الأخطاء (بدون مصادقة)
 * يستخدم: quickTrackEvent API مع try/catch
 * يعيد: true للنجاح، false للفشل
 */
export const quickTrackEventSimple = async (
  eventName: string,
  eventType: EventType,
  eventCategory?: EventCategory
): Promise<boolean> => {
  // فحص الـ admin قبل التتبع
  if (shouldSkipTracking()) {
    console.log('Skipping quick event tracking - Admin user detected');
    return true; // نرجع true لأن "التخطي" يعتبر نجاح
  }

  try {
    const response = await eventsAPI.quickTrackEvent(
      eventName,
      eventType,
      eventCategory
    );
    return response.success;
  } catch (error) {
    console.error('Failed to quick track event:', error);
    return false;
  }
};

/**
 * جلب إحصائيات سريعة للأحداث (مع مصادقة)
 * يستخدم: getEventsSummary API مع try/catch
 * يعيد: الإحصائيات أو null في حالة الفشل
 */
export const getQuickEventStats = async (
  days: number = 7
): Promise<EventSummaryResponse | null> => {
  try {
    return await eventsAPI.getEventsSummary(days);
  } catch (error) {
    console.error('Failed to get quick event stats:', error);
    return null;
  }
};

/**
 * تتبع أحداث متعددة دفعة واحدة (بدون مصادقة)
 * يستخدم: trackEvent API في حلقة مع Promise.all
 * يعيد: عدد الأحداث المسجلة بنجاح
 */
export const trackMultipleEvents = async (
  events: SimpleEventRequest[]
): Promise<number> => {
  // فحص الـ admin قبل التتبع
  if (shouldSkipTracking()) {
    console.log('Skipping multiple events tracking - Admin user detected');
    return events.length; // نرجع عدد الأحداث لأن "التخطي" يعتبر نجاح
  }

  try {
    const promises = events.map(event => 
      eventsAPI.trackEvent(event).catch(() => null)
    );
    const results = await Promise.all(promises);
    return results.filter(result => result && result.success).length;
  } catch (error) {
    console.error('Failed to track multiple events:', error);
    return 0;
  }
};

/**
 * فحص صحة الخدمة مع إعادة المحاولة (مع مصادقة)
 * يستخدم: checkEventsHealth API مع retry logic
 * يعيد: حالة الخدمة أو null في حالة الفشل
 */
export const checkHealthWithRetry = async (
  maxRetries: number = 3
): Promise<EventHealthResponse | null> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await eventsAPI.checkEventsHealth();
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('Health check failed after retries:', error);
        return null;
      }
      // انتظار قبل المحاولة التالية
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return null;
};

// ==================== Export Additional Utilities ====================

/**
 * فحص حالة الـ admin الحالية
 * يعيد: true إذا كان المستخدم admin
 */
export const checkAdminStatus = (): boolean => {
  return isAdmin();
};

/**
 * فحص إذا كان التتبع مفعل أم لا
 * يعيد: true إذا كان التتبع مفعل، false إذا كان معطل
 */
export const isTrackingEnabled = (): boolean => {
  return !shouldSkipTracking();
};

/**
 * فحص إذا كان المستخدم مسجل الدخول كـ admin
 * يعيد: true إذا كان يملك توكن صالح
 */
export const hasValidAdminToken = (): boolean => {
  try {
    const token = localStorage.getItem('adminToken');
    return token !== null && token.trim() !== '';
  } catch (error) {
    console.warn('Unable to check admin token:', error);
    return false;
  }
};

// ==================== Export API Instance ====================
export const eventsAPI = new EventsAPI();

export default eventsAPI;