// currencyApi.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Types for Currency API
export interface Currency {
  country: any;
  code: string;
  name_en: string;
  name_ar: string;
  symbol: string | null;
  decimal_places: number;
  is_active: boolean;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  primary_currency: string;
  supported_currencies: string[];
  auto_convert_prices: boolean;
  display_original_currency: boolean;
  updated_at: string;
}

export interface ExchangeRates {
  base_currency: string;
  rates: Record<string, number>;
  last_updated: string;
}

export interface CurrencyUpdateRequest {
  name_en?: string;
  name_ar?: string;
  symbol?: string;
  decimal_places?: number;
  is_active?: boolean;
  conversion_rate?: number;
}

export interface ConversionResult {
  original_amount: number;
  from_currency: string;
  to_currency: string;
  converted_amount: number;
  timestamp: string;
}

// Location detection types
export interface LocationInfo {
  country: string;
  country_code: string;
  currency?: string;
}

// API Error Class
export class CurrencyAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CurrencyAPIError';
  }
}

// Helper function for API calls
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CurrencyAPIError(
        errorData.detail || `API Error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CurrencyAPIError) {
      throw error;
    }
    throw new CurrencyAPIError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ==================== LOCATION DETECTION ====================

/**
 * Get user's location and currency info
 * Uses a free IP geolocation API
 */
export const getUserLocation = async (): Promise<LocationInfo | null> => {
  try {
    // Using ipapi.co - free tier allows 1000 requests/day
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'User-Agent': 'currency-app/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get location');
    }
    
    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      country_code: data.country_code || '',
      currency: data.currency || ''
    };
  } catch (error) {
    console.warn('Location detection failed:', error);
    // Fallback to a simpler service
    try {
      const fallbackResponse = await fetch('https://api.country.is/', {
        method: 'GET'
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return {
          country: fallbackData.country || 'Unknown',
          country_code: fallbackData.country || '',
          currency: ''
        };
      }
    } catch (fallbackError) {
      console.warn('Fallback location detection failed:', fallbackError);
    }
    
    return null;
  }
};

/**
 * Map country code to supported currencies based on new business rules
 */
const getCountryCurrencyMapping = (): Record<string, string[]> => {
  return {
    // مصر -> جنيه مصري
    'EG': ['EGP'],
    
    // السعودية -> ريال سعودي
    'SA': ['SAR'],
    
    // الدول الأوروبية -> يورو
    'DE': ['EUR'], // Germany
    'FR': ['EUR'], // France
    'IT': ['EUR'], // Italy
    'ES': ['EUR'], // Spain
    'NL': ['EUR'], // Netherlands
    'BE': ['EUR'], // Belgium
    'AT': ['EUR'], // Austria
    'PT': ['EUR'], // Portugal
    'IE': ['EUR'], // Ireland
    'GR': ['EUR'], // Greece
    'FI': ['EUR'], // Finland
    'LU': ['EUR'], // Luxembourg
    'MT': ['EUR'], // Malta
    'CY': ['EUR'], // Cyprus
    'SK': ['EUR'], // Slovakia
    'SI': ['EUR'], // Slovenia
    'EE': ['EUR'], // Estonia
    'LV': ['EUR'], // Latvia
    'LT': ['EUR'], // Lithuania
    'GB': ['EUR'], // UK - treated as Europe
    
    // أي دولة أخرى -> دولار أمريكي (Others)
    // This will be the default fallback for any country not listed above
  };
};

/**
 * Get preferred currency based on user location with new business rules
 */
export const getLocationBasedCurrency = async (): Promise<string | null> => {
  try {
    const location = await getUserLocation();
    if (!location || !location.country_code) {
      return null;
    }
    
    const currencyMapping = getCountryCurrencyMapping();
    const countryCode = location.country_code.toUpperCase();
    const preferredCurrencies = currencyMapping[countryCode];
    
    // إذا كان البلد موجود في الخريطة، استخدم العملة المحددة له
    if (preferredCurrencies && preferredCurrencies.length > 0) {
      try {
        const availableCurrencies = await getCurrencies(true); // Only active currencies
        const availableCodes = availableCurrencies.map(c => c.code.toUpperCase());
        
        // Find first preferred currency that's available
        for (const currency of preferredCurrencies) {
          if (availableCodes.includes(currency.toUpperCase())) {
            return currency;
          }
        }
      } catch (error) {
        console.warn('Failed to check available currencies:', error);
      }
    } else {
      // أي دولة غير محددة تحصل على دولار أمريكي (Others)
      try {
        const availableCurrencies = await getCurrencies(true);
        const availableCodes = availableCurrencies.map(c => c.code.toUpperCase());
        
        if (availableCodes.includes('USD')) {
          return 'USD';
        }
      } catch (error) {
        console.warn('Failed to check available currencies for Others:', error);
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Location-based currency detection failed:', error);
    return null;
  }
};

// ==================== CURRENCY ENDPOINTS ====================

/**
 * Get all currencies with optional location-based sorting
 * @param activeOnly - Filter to only active currencies
 * @param sortByLocation - Sort by user location preference
 */
export const getCurrencies = async (
  activeOnly: boolean = false, 
  sortByLocation: boolean = false
): Promise<Currency[]> => {
  console.log('🔄 getCurrencies called with:', { activeOnly, sortByLocation });
  
  const currencies = await apiCall<Currency[]>(`/api/currency/currencies?active_only=${activeOnly}`);
  console.log('📦 Raw currencies from API:', currencies.map(c => ({ code: c.code, country: c.country })));
  
  if (!sortByLocation) {
    console.log('⏭️ No sorting requested, returning raw currencies');
    return currencies;
  }
  
  console.log('🌍 Starting location-based sorting...');
  
  try {
    const preferredCurrency = await getLocationBasedCurrency();
    console.log('🎯 Preferred currency from location:', preferredCurrency);
    
    if (preferredCurrency) {
      console.log('🔄 Sorting currencies with preferred currency first...');
      
      // Sort with preferred currency first
      const sortedCurrencies = currencies.sort((a, b) => {
        const aCode = a.code.toUpperCase();
        const bCode = b.code.toUpperCase();
        const preferredCode = preferredCurrency.toUpperCase();
        
        console.log(`  Comparing: ${aCode} vs ${bCode} (preferred: ${preferredCode})`);
        
        if (aCode === preferredCode) {
          console.log(`    ✅ ${aCode} is preferred, moving to top`);
          return -1;
        }
        if (bCode === preferredCode) {
          console.log(`    ✅ ${bCode} is preferred, moving to top`);
          return 1;
        }
        console.log(`    ⚪ No preference, keeping order`);
        return 0;
      });
      
      console.log('✅ Final sorted currencies order:', sortedCurrencies.map(c => c.code));
      return sortedCurrencies;
    } else {
      console.log('❌ No preferred currency found, returning unsorted');
    }
  } catch (error) {
    console.warn('⚠️ Failed to sort by location:', error);
  }
  
  console.log('↩️ Returning original currencies (no sorting applied)');
  return currencies;
};

/**
 * Get specific currency by code
 * @param currencyCode - Currency code (e.g., 'EGP', 'USD')
 */
export const getCurrency = async (currencyCode: string): Promise<Currency> => {
  return apiCall<Currency>(`/api/currency/currencies/${currencyCode.toUpperCase()}`);
};

/**
 * Get default currency based on location or fallback
 */
export const getDefaultCurrency = async (): Promise<Currency | null> => {
  try {
    // First try to get location-based currency
    const locationBasedCurrency = await getLocationBasedCurrency();
    if (locationBasedCurrency) {
      try {
        const currency = await getCurrency(locationBasedCurrency);
        // تأكد إن العملة نشطة
        if (currency.is_active) {
          return currency;
        }
      } catch (error) {
        console.warn(`Location-based currency ${locationBasedCurrency} not available:`, error);
        // هنا فشل في جلب العملة من الـ API، كمل للـ fallback
      }
    }
    
    // Fallback to first active currency with location sorting
    const currencies = await getCurrencies(true, true);
    if (currencies.length > 0) {
      return currencies[0];
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to get default currency:', error);
    return null;
  }
};

/**
 * Create new currency
 * @param currency - Currency data
 */
export const createCurrency = async (currency: Omit<Currency, 'created_at' | 'updated_at'>): Promise<Currency> => {
  return apiCall<Currency>('/api/currency/currencies', {
    method: 'POST',
    body: JSON.stringify(currency),
  });
};

/**
 * Update existing currency
 * @param currencyCode - Currency code to update
 * @param updates - Partial update data
 */
export const updateCurrency = async (
  currencyCode: string,
  updates: CurrencyUpdateRequest
): Promise<Currency> => {
  return apiCall<Currency>(`/api/currency/currencies/${currencyCode.toUpperCase()}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

/**
 * Toggle currency active status
 * @param currencyCode - Currency code to toggle
 */
export const toggleCurrencyStatus = async (currencyCode: string): Promise<Currency> => {
  return apiCall<Currency>(`/api/currency/currencies/${currencyCode.toUpperCase()}/toggle-status`, {
    method: 'PATCH',
  });
};

// ==================== SITE SETTINGS ENDPOINTS ====================

/**
 * Get site currency settings with location awareness
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const settings = await apiCall<SiteSettings>('/api/currency/settings');
  
  // If no primary currency is set, try to set based on location
  if (!settings.primary_currency) {
    try {
      const locationBasedCurrency = await getLocationBasedCurrency();
      if (locationBasedCurrency && settings.supported_currencies.includes(locationBasedCurrency)) {
        settings.primary_currency = locationBasedCurrency;
      }
    } catch (error) {
      console.warn('Failed to set location-based primary currency:', error);
    }
  }
  
  return settings;
};

/**
 * Update site currency settings
 * @param settings - New site settings
 */
export const updateSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  return apiCall<SiteSettings>('/api/currency/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
};

// ==================== EXCHANGE RATES ENDPOINTS ====================

/**
 * Get exchange rates for base currency
 * @param baseCurrency - Base currency code (default: location-based or 'SAR')
 */
export const getExchangeRates = async (baseCurrency?: string): Promise<ExchangeRates> => {
  if (!baseCurrency) {
    try {
      const locationBasedCurrency = await getLocationBasedCurrency();
      baseCurrency = locationBasedCurrency || 'SAR';
    } catch (error) {
      baseCurrency = 'SAR';
    }
  }
  
  return apiCall<ExchangeRates>(`/api/currency/exchange-rates/${baseCurrency.toUpperCase()}`);
};

/**
 * Update exchange rates
 * @param baseCurrency - Base currency code
 * @param rates - New exchange rates
 */
export const updateExchangeRates = async (
  baseCurrency: string,
  rates: Record<string, number>
): Promise<{ message: string; updated_at: string }> => {
  return apiCall<{ message: string; updated_at: string }>(`/api/currency/exchange-rates/${baseCurrency.toUpperCase()}`, {
    method: 'PUT',
    body: JSON.stringify({ rates }),
  });
};

// ==================== UTILITY ENDPOINTS ====================

/**
 * Convert currency amount
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 */
export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<ConversionResult> => {
  if (amount <= 0) {
    throw new CurrencyAPIError('Amount must be positive');
  }

  return apiCall<ConversionResult>(
    `/api/currency/convert?amount=${amount}&from_currency=${fromCurrency.toUpperCase()}&to_currency=${toCurrency.toUpperCase()}`
  );
};

/**
 * Check currency service health
 */
export const checkServiceHealth = async (): Promise<{ status: string; service: string }> => {
  return apiCall<{ status: string; service: string }>('/api/currency/health');
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Format currency amount with proper symbol and decimal places
 * @param amount - Amount to format
 * @param currency - Currency object
 * @param language - Language for formatting
 */
export const formatCurrencyAmount = (
  amount: number,
  currency: Currency,
  language: string = 'ar'
): string => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency.decimal_places,
    maximumFractionDigits: currency.decimal_places,
  }).format(amount);

  if (currency.symbol) {
    return language === 'ar'
      ? `${formattedAmount} ${currency.symbol}`
      : `${currency.symbol}${formattedAmount}`;
  }

  const currencyName = language === 'ar' ? currency.name_ar : currency.name_en;
  return `${formattedAmount} ${currencyName}`;
};

/**
 * Validate currency code format
 * @param code - Currency code to validate
 */
export const isValidCurrencyCode = (code: string): boolean => {
  return /^[A-Z]{3}$/.test(code.toUpperCase());
};

/**
 * Get currency display name based on locale
 * @param currency - Currency object
 * @param locale - Current locale
 */
export const getCurrencyDisplayName = (currency: Currency, locale: string): string => {
  return locale.startsWith('ar') ? currency.name_ar : currency.name_en;
};

/**
 * Get user location info (cached)
 */
let locationCache: LocationInfo | null = null;
let locationCacheTime = 0;
const LOCATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const getCachedUserLocation = async (): Promise<LocationInfo | null> => {
  const now = Date.now();
  
  if (locationCache && (now - locationCacheTime) < LOCATION_CACHE_DURATION) {
    return locationCache;
  }
  
  try {
    locationCache = await getUserLocation();
    locationCacheTime = now;
    return locationCache;
  } catch (error) {
    console.warn('Failed to get cached location:', error);
    return null;
  }
};