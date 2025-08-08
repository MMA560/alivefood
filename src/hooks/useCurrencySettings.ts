// src/hooks/useCurrencySettings.ts
import { useLanguage } from "@/contexts/LanguageContext";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  toggleCurrencyStatus,
  getSiteSettings,
  updateSiteSettings,
  convertCurrency,
  formatCurrencyAmount,
  getDefaultCurrency,
  getCachedUserLocation,
  type Currency,
  type SiteSettings,
  type ConversionResult,
  type CurrencyUpdateRequest,
  type LocationInfo,
  CurrencyAPIError,
} from "@/lib/currencyApi";

interface UseCurrencySettingsReturn {
  // Data
  currencies: Currency[];
  activeCurrencies: Currency[];
  siteSettings: SiteSettings | null;
  defaultCurrency: Currency | null;
  userLocation: LocationInfo | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadData: () => Promise<void>;
  addCurrency: (currency: Omit<Currency, 'created_at' | 'updated_at'>) => Promise<void>;
  editCurrency: (code: string, updates: CurrencyUpdateRequest) => Promise<void>;
  toggleCurrency: (code: string) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  convertAmount: (amount: number, from: string, to: string) => Promise<ConversionResult>;
  refreshLocation: () => Promise<void>;
  
  // Utils
  formatAmount: (amount: number, currencyCode: string) => string;
  getCurrencyByCode: (code: string) => Currency | undefined;
  clearError: () => void;
}

// Enhanced cache configuration
const CACHE_KEY = 'currency_data_cache';
const LOCATION_CACHE_KEY = 'user_location_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const LOCATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CacheData {
  currencies: Currency[];
  siteSettings: SiteSettings;
  defaultCurrency: Currency | null;
  timestamp: number;
}

interface LocationCacheData {
  location: LocationInfo;
  timestamp: number;
}

// Cache functions - moved outside component to prevent recreation
export const getCachedData = (): CacheData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CacheData = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  }
};

const setCachedData = (currencies: Currency[], siteSettings: SiteSettings, defaultCurrency: Currency | null = null) => {
  if (typeof window === 'undefined') return;
  
  try {
    const data: CacheData = {
      currencies,
      siteSettings,
      defaultCurrency,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

const getCachedLocation = (): LocationInfo | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;
    
    const data: LocationCacheData = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > LOCATION_CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
    
    return data.location;
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCATION_CACHE_KEY);
    }
    return null;
  }
};

const setCachedLocation = (location: LocationInfo) => {
  if (typeof window === 'undefined') return;
  
  try {
    const data: LocationCacheData = {
      location,
      timestamp: Date.now()
    };
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

const updateCachedCurrency = (updatedCurrency: Currency) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cached = getCachedData();
    if (!cached) return;
    
    const updatedCurrencies = cached.currencies.map(c => 
      c.code === updatedCurrency.code ? updatedCurrency : c
    );
    
    setCachedData(updatedCurrencies, cached.siteSettings, cached.defaultCurrency);
  } catch {
    // Ignore storage errors
  }
};

const addCachedCurrency = (newCurrency: Currency) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cached = getCachedData();
    if (!cached) return;
    
    const updatedCurrencies = [...cached.currencies, newCurrency];
    setCachedData(updatedCurrencies, cached.siteSettings, cached.defaultCurrency);
  } catch {
    // Ignore storage errors
  }
};

const updateCachedSettings = (settings: SiteSettings) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cached = getCachedData();
    if (!cached) return;
    
    setCachedData(cached.currencies, settings, cached.defaultCurrency);
  } catch {
    // Ignore storage errors
  }
};

export const useCurrencySettings = (): UseCurrencySettingsReturn => {
  // Initialize all state at the top level consistently
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [activeCurrencies, setActiveCurrencies] = useState<Currency[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState<Currency | null>(null);
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use ref to track mount status
  const isMountedRef = useRef(true);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { language } = useLanguage();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, []);

  const handleError = useCallback((error: unknown) => {
    if (!isMountedRef.current) return;
    
    const message = error instanceof CurrencyAPIError 
      ? error.message 
      : 'حدث خطأ غير متوقع';
    setError(message);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    if (!isMountedRef.current) return;
    setError(null);
  }, []);

  const updateLocalState = useCallback((
    allCurrencies: Currency[], 
    settings: SiteSettings, 
    defaultCurr: Currency | null = null,
    location: LocationInfo | null = null
  ) => {
    if (!isMountedRef.current) return;
    
    setCurrencies(allCurrencies);
    setActiveCurrencies(allCurrencies.filter(c => c.is_active));
    setSiteSettings(settings);
    setDefaultCurrency(defaultCurr);
    if (location !== null) setUserLocation(location);
  }, []);

  // Load user location
  const loadUserLocation = useCallback(async () => {
    try {
      // Check cache first
      const cachedLocation = getCachedLocation();
      if (cachedLocation && isMountedRef.current) {
        setUserLocation(cachedLocation);
        return cachedLocation;
      }
      
      // Fetch from API
      const location = await getCachedUserLocation();
      if (location && isMountedRef.current) {
        setUserLocation(location);
        setCachedLocation(location);
        return location;
      }
      
      return null;
    } catch (error) {
      console.warn('Failed to load user location:', error);
      return null;
    }
  }, []);

  // Refresh location (force refresh)
  const refreshLocation = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      
      // Clear location cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCATION_CACHE_KEY);
      }
      
      // Fetch fresh location
      const location = await getCachedUserLocation();
      if (location && isMountedRef.current) {
        setUserLocation(location);
        setCachedLocation(location);
      }
    } catch (error) {
      console.warn('Failed to refresh location:', error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Load all data with location awareness
  const loadData = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      clearError();
      
      // Load location first (in parallel)
      const locationPromise = loadUserLocation();
      
      // Check cache first
      const cached = getCachedData();
      if (cached && isMountedRef.current) {
        const location = await locationPromise;
        updateLocalState(cached.currencies, cached.siteSettings, cached.defaultCurrency, location);
        setLoading(false);
        setIsInitialized(true);
        return;
      }
      
      // Fetch from API if no cache
      const location = await locationPromise;
      
      if (!isMountedRef.current) return;
      
      // Get currencies with location-based sorting
      const [allCurrencies, settings] = await Promise.all([
        getCurrencies(false, true), // Sort by location
        getSiteSettings(),
      ]);

      if (!isMountedRef.current) return;

      // Get default currency (location-aware)
      let defaultCurr: Currency | null = null;
      try {
        defaultCurr = await getDefaultCurrency();
      } catch (error) {
        console.warn('Failed to get default currency:', error);
        // Fallback to first active currency
        const activeCurrs = allCurrencies.filter(c => c.is_active);
        if (activeCurrs.length > 0) {
          defaultCurr = activeCurrs[0];
        }
      }

      if (!isMountedRef.current) return;

      // Update cache
      setCachedData(allCurrencies, settings, defaultCurr);
      
      // Update state
      updateLocalState(allCurrencies, settings, defaultCurr, location);
      setIsInitialized(true);
    } catch (error) {
      handleError(error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [loadUserLocation, updateLocalState, clearError, handleError]);

  // Add currency
  const addCurrency = useCallback(async (currency: Omit<Currency, 'created_at' | 'updated_at'>) => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      clearError();
      
      const newCurrency = await createCurrency(currency);
      
      if (!isMountedRef.current) return;
      
      // Update cache
      addCachedCurrency(newCurrency);
      
      // Update local state
      setCurrencies(prev => [...prev, newCurrency]);
      if (newCurrency.is_active) {
        setActiveCurrencies(prev => [...prev, newCurrency]);
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [clearError, handleError]);

  // Edit currency
  const editCurrency = useCallback(async (code: string, updates: CurrencyUpdateRequest) => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      clearError();
      
      const updated = await updateCurrency(code, updates);
      
      if (!isMountedRef.current) return;
      
      // Update cache
      updateCachedCurrency(updated);
      
      // Update local state
      setCurrencies(prev => prev.map(c => c.code === code ? updated : c));
      setActiveCurrencies(prev => 
        updated.is_active 
          ? prev.map(c => c.code === code ? updated : c)
          : prev.filter(c => c.code !== code)
      );

      // Update default currency if it's the same
      setDefaultCurrency(prev => prev?.code === code ? updated : prev);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [clearError, handleError]);

  // Toggle currency status
  const toggleCurrency = useCallback(async (code: string) => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      clearError();
      
      const updated = await toggleCurrencyStatus(code);
      
      if (!isMountedRef.current) return;
      
      // Update cache
      updateCachedCurrency(updated);
      
      // Update local state
      setCurrencies(prev => prev.map(c => c.code === code ? updated : c));
      
      if (updated.is_active) {
        setActiveCurrencies(prev => [...prev.filter(c => c.code !== code), updated]);
      } else {
        setActiveCurrencies(prev => prev.filter(c => c.code !== code));
      }

      // Update default currency if it's the same
      setDefaultCurrency(prev => prev?.code === code ? updated : prev);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [clearError, handleError]);

  // Update site settings
  const updateSettings = useCallback(async (settings: SiteSettings) => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      clearError();
      
      const updated = await updateSiteSettings(settings);
      
      if (!isMountedRef.current) return;
      
      // Update cache
      updateCachedSettings(updated);
      
      setSiteSettings(updated);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [clearError, handleError]);

  // Convert currency (no caching for dynamic data)
  const convertAmount = useCallback(async (amount: number, from: string, to: string) => {
    try {
      return await convertCurrency(amount, from, to);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  // Utils
  const getCurrencyByCode = useCallback((code: string) => {
    return currencies.find(c => c.code.toLowerCase() === code.toLowerCase());
  }, [currencies]);

  const formatAmount = useCallback((amount: number, currencyCode: string) => {
    const currency = getCurrencyByCode(currencyCode);
    if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;
    return formatCurrencyAmount(amount, currency, language);
  }, [getCurrencyByCode, language]);

  // Load data on mount - only once
  useEffect(() => {
    if (!isInitialized) {
      loadData();
    }
  }, [loadData, isInitialized]);

  // Auto-refresh location periodically (every 30 minutes)
  useEffect(() => {
    if (!isInitialized) return;
    
    locationIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        loadUserLocation();
      }
    }, LOCATION_CACHE_DURATION);

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, [loadUserLocation, isInitialized]);

  return {
    // Data
    currencies,
    activeCurrencies,
    siteSettings,
    defaultCurrency,
    userLocation,
    loading,
    error,
    
    // Actions
    loadData,
    addCurrency,
    editCurrency,
    toggleCurrency,
    updateSettings,
    convertAmount,
    refreshLocation,
    
    // Utils
    formatAmount,
    getCurrencyByCode,
    clearError,
  };
};