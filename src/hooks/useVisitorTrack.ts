// hooks/useVisitorTracking.ts - نسخة محسنة مع إصلاح الأخطاء
import { useEffect, useState, useRef, useCallback } from 'react';
import * as React from 'react';

// إصلاح متغيرات البيئة مع قيم افتراضية
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const TRACKING_DISABLED = import.meta.env.VITE_DISABLE_TRACKING === 'true';

// مدة انتظار قبل تسجيل زيارة جديدة لنفس الصفحة (بالميلي ثانية)
const SAME_PAGE_COOLDOWN = 30000; // 30 ثانية
const CROSS_PAGE_COOLDOWN = 5000;  // 5 ثوانِ بين الصفحات المختلفة

interface LocalStorageData {
  visitor_id: string;
  last_visit_date: string;
  is_new_visitor: boolean;
  session_pages: Record<string, number>; // URL -> timestamp
  last_page_visit: number;
}

interface SessionData {
  session_id: string;
  start_time: number;
  last_activity: number;
  pages_visited: string[];
}

// التحقق من توفر البيئة
const isBrowser = typeof window !== 'undefined';
const isDocument = typeof document !== 'undefined';

export const useVisitorTracking = () => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isNewVisitor, setIsNewVisitor] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // إصلاح useRef مع قيم افتراضية آمنة
  const pageViewsRef = useRef<string[]>([]);
  const lastTrackTimeRef = useRef<number>(0);
  const pendingTrackRef = useRef<NodeJS.Timeout | null>(null);

  // توليد معرف جلسة فريد
  const generateSessionId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // فحص إذا كان المستخدم أدمن مع حماية من الأخطاء
  const isAdmin = useCallback(() => {
    try {
      if (!isBrowser) return false;
      return localStorage.getItem('is_admin') === 'true';
    } catch (error) {
      return false;
    }
  }, []);

  // تحديد نوع المتصفح مع حماية
  const getBrowser = useCallback(() => {
    if (!isBrowser || !navigator?.userAgent) return 'unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'chrome';
    if (ua.includes('Firefox')) return 'firefox';
    if (ua.includes('Safari')) return 'safari';
    if (ua.includes('Edge')) return 'edge';
    return 'other';
  }, []);

  // تحديد نوع الجهاز مع حماية
  const getDeviceType = useCallback(() => {
    if (!isBrowser || !navigator?.userAgent) return 'unknown';
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
  }, []);

  // حفظ البيانات في localStorage مع حماية
  const saveToLocalStorage = useCallback((data: Partial<LocalStorageData>) => {
    try {
      if (!isBrowser) return;
      
      const existingData = localStorage.getItem('visitor_tracking_data');
      let currentData: LocalStorageData;

      if (existingData) {
        currentData = JSON.parse(existingData);
      } else {
        currentData = {
          visitor_id: '',
          last_visit_date: '',
          is_new_visitor: false,
          session_pages: {},
          last_page_visit: 0
        };
      }

      const updatedData = { ...currentData, ...data };
      localStorage.setItem('visitor_tracking_data', JSON.stringify(updatedData));
    } catch (error) {
      console.warn('فشل في حفظ بيانات التتبع:', error);
    }
  }, []);

  // استرجاع البيانات من localStorage مع حماية
  const getFromLocalStorage = useCallback((): LocalStorageData | null => {
    try {
      if (!isBrowser) return null;
      const data = localStorage.getItem('visitor_tracking_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('فشل في استرجاع بيانات التتبع:', error);
      return null;
    }
  }, []);

  // إدارة بيانات الجلسة مع حماية
  const getSessionData = useCallback((): SessionData | null => {
    try {
      if (!isBrowser) return null;
      const data = localStorage.getItem('visitor_session_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }, []);

  const saveSessionData = useCallback((data: Partial<SessionData>) => {
    try {
      if (!isBrowser) return;
      
      const existingData = getSessionData();
      let currentData: SessionData;

      if (existingData) {
        currentData = existingData;
      } else {
        currentData = {
          session_id: generateSessionId(),
          start_time: Date.now(),
          last_activity: Date.now(),
          pages_visited: []
        };
      }

      const updatedData = { ...currentData, ...data };
      localStorage.setItem('visitor_session_data', JSON.stringify(updatedData));
    } catch (error) {
      console.warn('فشل في حفظ بيانات الجلسة:', error);
    }
  }, [generateSessionId, getSessionData]);

  // التحقق من صحة الجلسة (30 دقيقة)
  const isValidSession = useCallback((sessionData: SessionData): boolean => {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 دقيقة
    return Date.now() - sessionData.last_activity < SESSION_TIMEOUT;
  }, []);

  // فحص إذا كان يجب تسجيل الزيارة مع حماية
  const shouldTrackVisit = useCallback((pageUrl: string): boolean => {
    if (isAdmin()) return false;

    const savedData = getFromLocalStorage();
    const now = Date.now();
    
    // فحص إذا كان نفس الصفحة تم زيارتها مؤخراً
    if (savedData?.session_pages) {
      const lastVisitTime = savedData.session_pages[pageUrl];
      if (lastVisitTime && (now - lastVisitTime) < SAME_PAGE_COOLDOWN) {
        return false;
      }
    }

    // فحص إذا كان هناك زيارة حديثة لأي صفحة
    if (savedData?.last_page_visit && (now - savedData.last_page_visit) < CROSS_PAGE_COOLDOWN) {
      return false;
    }

    return true;
  }, [getFromLocalStorage, isAdmin]);

  // تحديث بيانات الزيارة
  const updateVisitData = useCallback((pageUrl: string) => {
    const now = Date.now();
    const savedData = getFromLocalStorage();
    
    const updatedSessionPages = {
      ...(savedData?.session_pages || {}),
      [pageUrl]: now
    };

    saveToLocalStorage({
      ...savedData,
      session_pages: updatedSessionPages,
      last_page_visit: now
    });
  }, [getFromLocalStorage, saveToLocalStorage]);

  // فحص إذا كان زائر جديد اليوم
  const checkIfNewVisitorToday = useCallback(() => {
    if (isAdmin()) return false;

    const savedData = getFromLocalStorage();
    const today = new Date().toISOString().split('T')[0];
    
    if (!savedData || !savedData.visitor_id) {
      setIsNewVisitor(true);
      return true;
    }

    if (savedData.last_visit_date !== today) {
      setIsNewVisitor(true);
      saveToLocalStorage({ 
        ...savedData, 
        last_visit_date: today, 
        is_new_visitor: true,
        session_pages: {} // إعادة تعيين صفحات الجلسة لليوم الجديد
      });
      return true;
    }

    setIsNewVisitor(false);
    return false;
  }, [getFromLocalStorage, saveToLocalStorage, isAdmin]);

  // إرسال البيانات مع إدارة الجلسة وحماية كاملة
  const sendVisitData = useCallback(async (pageUrl: string, pageTitle: string) => {
    if (!API_BASE || TRACKING_DISABLED || isAdmin() || !isBrowser) return;

    try {
      // إدارة الجلسة
      let sessionData = getSessionData();
      if (!sessionData || !isValidSession(sessionData)) {
        sessionData = {
          session_id: generateSessionId(),
          start_time: Date.now(),
          last_activity: Date.now(),
          pages_visited: []
        };
        setSessionId(sessionData.session_id);
      }

      // تحديث الجلسة
      sessionData.last_activity = Date.now();
      if (!sessionData.pages_visited.includes(pageUrl)) {
        sessionData.pages_visited.push(pageUrl);
      }
      saveSessionData(sessionData);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE}/visits/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          session_id: sessionData.session_id,
          page_url: pageUrl,
          page_title: pageTitle,
          referrer: (isDocument && document.referrer) || undefined,
          user_agent: (isBrowser && navigator.userAgent) || undefined,
          device_type: getDeviceType(),
          browser: getBrowser(),
          language: (isBrowser && navigator.language) || 'en',
          timestamp: new Date().toISOString(),
          is_new_visitor: isNewVisitor,
          session_page_count: sessionData.pages_visited.length
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data?.visitor_id && !visitorId) {
          setVisitorId(data.visitor_id);
          saveToLocalStorage({ visitor_id: data.visitor_id });
        }
        
        // تحديث حالة الزائر الجديد
        if (isNewVisitor) {
          setIsNewVisitor(false);
          saveToLocalStorage({ is_new_visitor: false });
        }

        // تحديث بيانات الزيارة
        updateVisitData(pageUrl);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('انتهت مهلة إرسال بيانات التتبع');
      } else {
        console.warn('فشل في إرسال بيانات الزيارة:', error);
      }
    }
  }, [
    visitorId, 
    isNewVisitor, 
    getDeviceType, 
    getBrowser, 
    saveToLocalStorage, 
    updateVisitData, 
    isAdmin,
    getSessionData,
    isValidSession,
    generateSessionId,
    saveSessionData
  ]);

  // تتبع الصفحة مع debouncing وحماية كاملة
  const trackVisit = useCallback((pageUrl?: string, pageTitle?: string) => {
    if (TRACKING_DISABLED || !API_BASE || isAdmin() || !isBrowser) return;

    const currentUrl = pageUrl || window.location.href;
    const currentTitle = pageTitle || (isDocument ? document.title : '');

    // إلغاء أي تتبع معلق
    if (pendingTrackRef.current) {
      clearTimeout(pendingTrackRef.current);
      pendingTrackRef.current = null;
    }

    // فحص إذا كان يجب تسجيل الزيارة
    if (!shouldTrackVisit(currentUrl)) {
      return;
    }

    // تأخير التتبع لتجنب الإرسال المتكرر
    pendingTrackRef.current = setTimeout(() => {
      // فحص مرة أخرى قبل الإرسال
      if (shouldTrackVisit(currentUrl)) {
        sendVisitData(currentUrl, currentTitle);
        
        // إضافة إلى قائمة الصفحات المعروضة مع حماية
        if (pageViewsRef.current && !pageViewsRef.current.includes(currentUrl)) {
          pageViewsRef.current.push(currentUrl);
        }
      }
    }, 1000); // تأخير ثانية واحدة

  }, [sendVisitData, shouldTrackVisit, isAdmin]);

  // تنظيف البيانات القديمة
  const cleanupOldData = useCallback(() => {
    try {
      if (!isBrowser) return;
      
      const savedData = getFromLocalStorage();
      if (savedData?.session_pages) {
        const now = Date.now();
        const cleanedPages: Record<string, number> = {};
        
        // الاحتفاظ بالصفحات التي تم زيارتها في آخر ساعة فقط
        Object.entries(savedData.session_pages).forEach(([url, timestamp]) => {
          if (now - timestamp < 3600000) { // ساعة واحدة
            cleanedPages[url] = timestamp;
          }
        });

        if (Object.keys(cleanedPages).length !== Object.keys(savedData.session_pages).length) {
          saveToLocalStorage({ ...savedData, session_pages: cleanedPages });
        }
      }
    } catch (error) {
      console.warn('فشل في تنظيف البيانات القديمة:', error);
    }
  }, [getFromLocalStorage, saveToLocalStorage]);

  // تشغيل التتبع عند تحميل المكون مع حماية كاملة
  useEffect(() => {
    if (TRACKING_DISABLED || !API_BASE || isAdmin() || !isBrowser) return;

    // تنظيف البيانات القديمة
    cleanupOldData();

    // استرجاع البيانات المحفوظة
    const savedData = getFromLocalStorage();
    if (savedData?.visitor_id) {
      setVisitorId(savedData.visitor_id);
    }

    // استرجاع بيانات الجلسة
    const sessionData = getSessionData();
    if (sessionData && isValidSession(sessionData)) {
      setSessionId(sessionData.session_id);
    }

    // فحص الزائر الجديد
    checkIfNewVisitorToday();

    // تتبع الصفحة الحالية
    trackVisit();

    // تنظيف عند إغلاق المكون
    return () => {
      if (pendingTrackRef.current) {
        clearTimeout(pendingTrackRef.current);
        pendingTrackRef.current = null;
      }
    };
  }, [
    trackVisit, 
    checkIfNewVisitorToday, 
    getFromLocalStorage, 
    isAdmin, 
    cleanupOldData,
    getSessionData,
    isValidSession
  ]);

  return { 
    trackVisit, 
    visitorId, 
    sessionId,
    isNewVisitor,
    pageViews: pageViewsRef.current || [],
    isTracking: !TRACKING_DISABLED && !!API_BASE && !isAdmin() && isBrowser
  };
};

// مكون تتبع الزيارات المحسن مع حماية كاملة
interface VisitorTrackerProps {
  children: React.ReactNode;
}

export const VisitorTracker: React.FC<VisitorTrackerProps> = ({ children }) => {
  const { trackVisit, isTracking } = useVisitorTracking();
  
  // إصلاح useRef مع قيم افتراضية آمنة
  const currentUrlRef = useRef<string>(isBrowser ? window.location.href : '');
  const routeChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // تتبع تغيير الصفحات في SPA مع حماية كاملة
  useEffect(() => {
    if (!isTracking || !isBrowser) return;

    const handleLocationChange = () => {
      const newUrl = window.location.href;
      
      // التحقق من وجود currentUrlRef.current
      if (!currentUrlRef.current) {
        currentUrlRef.current = newUrl;
        return;
      }
      
      // تجنب التتبع إذا كان نفس الـ URL
      if (currentUrlRef.current === newUrl) return;
      
      currentUrlRef.current = newUrl;

      // إلغاء أي timeout سابق
      if (routeChangeTimeoutRef.current) {
        clearTimeout(routeChangeTimeoutRef.current);
        routeChangeTimeoutRef.current = null;
      }

      // تأخير التتبع للتأكد من تحديث الصفحة
      routeChangeTimeoutRef.current = setTimeout(() => {
        trackVisit(newUrl, isDocument ? document.title : '');
      }, 500);
    };

    // مراقبة تغييرات التاريخ
    window.addEventListener('popstate', handleLocationChange);
    
    // مراقبة تغييرات الـ URL للـ SPA
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleLocationChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleLocationChange();
    };

    // تنظيف الـ listeners
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      
      if (routeChangeTimeoutRef.current) {
        clearTimeout(routeChangeTimeoutRef.current);
        routeChangeTimeoutRef.current = null;
      }
    };
  }, [trackVisit, isTracking]);

  return React.createElement(React.Fragment, null, children);
};