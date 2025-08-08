//src/lib/banners_api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hero Slider Interfaces
export interface HeroSlide {
  id?: number;
  image_url: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  link_url?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HeroSlideCreate {
  image_url: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  link_url?: string;
  order: number;
}

export interface HeroSlideUpdate {
  image_url?: string;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  link_url?: string;
  order?: number;
  is_active?: boolean;
}

export interface HeroSliderResponse {
  slides: HeroSlide[];
}

// Promo Banner Interfaces
export interface PromoBanner {
  id?: number;
  image_url: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  button_text_ar: string;
  button_text_en: string;
  link_url?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PromoBannerCreate {
  image_url: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  button_text_ar: string;
  button_text_en: string;
  link_url?: string;
  start_date?: string;
  end_date?: string;
}

export interface PromoBannerUpdate {
  image_url?: string;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  button_text_ar?: string;
  button_text_en?: string;
  link_url?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// Utility function for making fetch requests - FIXED VERSION
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  // 🔥 الإصلاح: التعامل مع 204 No Content
  if (response.status === 204) {
    return null as T; // 204 معناه مفيش محتوى يرجع
  }

  return response.json();
};

// Hero Slider API
// Hero Slider API - Updated to match backend changes
export const heroSliderAPI = {
  // Create hero slide
  createSlide: async (slideData: HeroSlideCreate): Promise<HeroSlide> => {
    return apiRequest<HeroSlide>('/api/v1/banners/hero-slides', {
      method: 'POST',
      body: JSON.stringify(slideData),
    });
  },

  // Get hero slide by ID
  getSlide: async (slideId: string): Promise<HeroSlide> => {
    return apiRequest<HeroSlide>(`/api/v1/banners/hero-slides/${slideId}`);
  },

  // 🔥 NEW: Get only active hero slides
  getActiveSlides: async (): Promise<HeroSliderResponse> => {
    return apiRequest<HeroSliderResponse>('/api/v1/banners/hero-slides?active_only=true');
  },

  // 🔥 UPDATED: Get all hero slides (active and inactive) - for admin
  getAllSlides: async (): Promise<HeroSliderResponse> => {
    return apiRequest<HeroSliderResponse>('/api/v1/banners/hero-slides?active_only=false');
  },

  // 🔥 NEW: Get all slides without filter (default behavior - same as getAllSlides but more explicit)
  getSlides: async (): Promise<HeroSliderResponse> => {
    return apiRequest<HeroSliderResponse>('/api/v1/banners/hero-slides');
  },

  // Update hero slide
  updateSlide: async (slideId: string, slideData: HeroSlideUpdate): Promise<HeroSlide> => {
    return apiRequest<HeroSlide>(`/api/v1/banners/hero-slides/${slideId}`, {
      method: 'PUT',
      body: JSON.stringify(slideData),
    });
  },

  // Delete hero slide - 🔥 FIXED: يتعامل مع 204 صح
  deleteSlide: async (slideId: string): Promise<boolean> => {
    await apiRequest<void>(`/api/v1/banners/hero-slides/${slideId}`, {
      method: 'DELETE',
    });
    // لو وصل هنا يبقى نجح الحذف
    return true;
  },

  // Toggle slide status
  toggleSlideStatus: async (slideId: string): Promise<HeroSlide> => {
    return apiRequest<HeroSlide>(`/api/v1/banners/hero-slides/${slideId}/toggle`, {
      method: 'PATCH',
    });
  },

  // Reorder slides
  reorderSlides: async (slideIds: string[]): Promise<void> => {
    return apiRequest<void>('/api/v1/banners/hero-slides/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ slide_ids: slideIds }),
    });
  }
};
// Promo Banner API
export const promoBannerAPI = {
  // Create promo banner
  createBanner: async (bannerData: PromoBannerCreate): Promise<PromoBanner> => {
    return apiRequest<PromoBanner>('/api/promo-banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  },

  // Get promo banner by ID
  getBanner: async (bannerId: string): Promise<PromoBanner> => {
    return apiRequest<PromoBanner>(`/api/promo-banners/${bannerId}`);
  },

  // Get all active promo banners
  getActiveBanners: async (): Promise<PromoBanner[]> => {
    return apiRequest<PromoBanner[]>('/api/promo-banners');
  },

  // Get all promo banners (admin)
  getAllBanners: async (): Promise<PromoBanner[]> => {
    return apiRequest<PromoBanner[]>('/api/admin/promo-banners');
  },

  // Update promo banner
  updateBanner: async (bannerId: string, bannerData: PromoBannerUpdate): Promise<PromoBanner> => {
    return apiRequest<PromoBanner>(`/api/promo-banners/${bannerId}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    });
  },

  // Delete promo banner - 🔥 FIXED: يتعامل مع 204 صح
  deleteBanner: async (bannerId: string): Promise<boolean> => {
    await apiRequest<void>(`/api/promo-banners/${bannerId}`, {
      method: 'DELETE',
    });
    // لو وصل هنا يبقى نجح الحذف
    return true;
  },

  // Toggle banner status
  toggleBannerStatus: async (bannerId: string): Promise<PromoBanner> => {
    return apiRequest<PromoBanner>(`/api/promo-banners/${bannerId}/toggle`, {
      method: 'PATCH',
    });
  }
};

// Image Upload API
export const uploadAPI = {
  // Upload image
  uploadImage: async (file: File, folder: string = 'banners'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  }
};