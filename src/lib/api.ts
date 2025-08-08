// src/lib/api.ts
//export const BASE_URL = 'http://localhost:8000';
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};
// ==================== Orders Types ====================
export interface ApiOrderItem {
  id: number | null;
  product_id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  base_price: number;  // إضافة هذا الحقل
  total_price: number | null;
  is_read: boolean | null;
  variant_id?: string;
  variant_name?: string;
}

export interface CustomerInfo {
  id: number | null;
  customerName: string;
  phoneNumber: string;
  fullAddress: string;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  customer_info: CustomerInfo;
  items: ApiOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'in_delivery' | 'delivered' | 'canceled';
  orderDate: string | null;
  updated_at: string;
  notes: string;
  is_read: boolean;
  paymentMethod?: string; // ← إضافة هذا السطر

}

export interface OrdersResponse {
  orders: ApiOrder[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface OrderCreate {
  customer_info: {
    customerName: string;
    phoneNumber: string;
    fullAddress: string;
  };
  items: Array<{
    product_id: string;
    title: string;
    image: string;
    quantity: number;
    price: number;
    base_price: number;  // إضافة هذا الحقل
    variant_id?: string;
  }>;
  shippingFee: number;
  notes: string;
  paymentMethod?: string; // ← إضافة هذا السطر

}

export interface OrderDetail extends ApiOrder {}

export interface UpdateOrderRequest {
  customer_info: {
    customerName: string;
    phoneNumber: string;
    fullAddress: string;
  };
  items: Array<{
    product_id: string;
    title: string;
    image: string;
    quantity: number;
    price: number;
    base_price: number;  // إضافة هذا الحقل
    variant_id?: string;
  }>;
  shippingFee: number;
  status: 'pending' | 'confirmed' | 'in_delivery' | 'delivered' | 'canceled';
  notes: string;
  paymentMethod?: string; // ← إضافة هذا السطر

}


// ==================== Products Types ====================

export interface Product {
  id: string;
  title: string;
  image: string;
  images?: string[];
  category: string;
  categories: string[];  // إضافة الحقل الجديد
  description: string;
  short_description?: string;
  price: string;
  old_price?: string;
  discount?: string;
  usage_instructions?: string;
  storage_instructions?: string;
  rating: number;
  base_price: number;
  reviewCount: number;
  details?: {
    description: string;
    sections: Array<{
      title: string;
      items: string[];
    }>;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  variants?: Array<{
    id: string;
    color: string;
    image: string;
    stock: number;
    price: string;
  }>;
  videoInfo?: {
    videoUrl: string;
    thumbnail: string;
    title?: string;
    description?: string;
    descriptionTitle?: string;
    overlayText?: string;
  };
  created_at: string;
  updated_at: string;
  brand?: string;
  sku?: string;
}

export interface FrontendProductVideoData {
  videoUrl: string;
  thumbnail: string;
  title?: string;
  description?: string;
  descriptionTitle?: string;
  overlayText?: string;
  features?: string[];
}

export interface ProductCreate {
  // الحقول الإجبارية (Required)
  id: string;                    // معرف المنتج الفريد
  title: string;                 // اسم المنتج
  image: string;                 // الصورة الرئيسية
  images: string[];              // قائمة الصور
  category: string;              // الفئة - دا علي النظام القديم حيث انه قبل كدة كان بيقبل تصنيف واحد
  categories: string[];          // قائمة الفئات الجديدة - تم التحديث بحيث المنتج يقبل قائمة فئات
  description: string;           // الوصف الطويل
  price: number;                 // السعر
  base_price: number;            // السعر الأساسي
  
  // الحقول الاختيارية (Optional)
  short_description?: string;    // الوصف القصير
  old_price?: number;            // السعر القديم
  discount?: number;             // نسبة الخصم (0-100)
  usage_instructions?: string;   // تعليمات الاستخدام
  storage_instructions?: string; // تعليمات التخزين
  rating?: number;               // التقييم (افتراضي: 0)
  reviewCount?: number;          // عدد المراجعات (افتراضي: 0)
  brand?: string;                // العلامة التجارية
  sku?: string;                  // رمز المنتج
  
  // الكائنات المعقدة الاختيارية
  details?: {
    description: string;
    sections: Array<{
      title: string;
      items: string[];
    }>;
  };
  
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  
  variants?: Array<{
    id: string;
    color: string;
    image: string;
    stock: number;
    price: string;
  }>;
  
  videoInfo?: {
    videoUrl: string;
    thumbnail: string;
    title?: string;
    description?: string;
    descriptionTitle?: string;
    overlayText?: string;
  };
}

//=====================================================
// التعريفات الإضافية المطلوبة (يجب إضافتها لملف api.ts)

export interface ValidationErrors {
  [key: string]: string | null;
}

export interface FormData {
  id: string;
  title: string;
  category: string;
  description: string;
  short_description: string;
  price: string;
  categories: string[];
  old_price: string;
  base_price: string;
  discount: string;
  usage_instructions: string;
  storage_instructions: string;
  brand: string;
  sku: string;
  images: string[];
  details: {
    description: string;
    sections: Array<{
      title: string;
      items: string[];
    }>;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  variants: Array<{
    id: string;
    color: string;
    image: string;
    stock: number;
    price: string;
  }>;
  videoInfo: {
    videoUrl: string;
    thumbnail: string;
    title: string;
    description: string;
    descriptionTitle: string;
    overlayText: string;
  };
}

export interface EditProductPageProps {
  productData?: Product;
}

// ==================== Reviews Types ====================
export interface Review {
  id: number;
  product_id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

// تحديث البنية لتتطابق مع API الخلفي
export interface ReviewCreate {
  product_id: string;
  name: string;          // تغيير من reviewer_name إلى name
  rating: number;
  comment: string;
  date?: string;         // إضافة التاريخ إذا كان مطلوباً
}

// ==================== Product Generator Types ====================
export interface ProductGeneratorRequest {
  product_info: string;
  output_language?: 'arabic' | 'english';
  api_key?: string;
  timeout?: number;
}

export interface ProductGeneratorResponse {
  success: boolean;
  message: string;
  product_json?: any;
  processing_time?: number;
  timestamp: string;
  language_used?: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  aliases: string[];
}

export interface SupportedLanguagesResponse {
  supported_languages: SupportedLanguage[];
}

export interface PromptPreviewResponse {
  language: string;
  system_prompt: string;
  language_instruction: string;
  language_code: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  timestamp: string;
  version: string;
}

// ==================== Orders API ====================
export const ordersApi = {
  
  getOrders: async (page: number = 1, perPage: number = 10): Promise<OrdersResponse> => {
    const response = await fetch(`${BASE_URL}/orders/?page=${page}&per_page=${perPage}`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  },

  getOrderById: async (id: number): Promise<OrderDetail> => {
    const response = await fetch(`${BASE_URL}/orders/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }
    return response.json();
  },

  updateOrderStatus: async (id: number, status: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status), // إرسال القيمة مباشرة وليس كـ object
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to update order status');
    }
  },

  markOrderAsRead: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/orders/${id}/mark-read`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to mark order as read');
    }
  },
  createOrder: async (orderData: OrderCreate): Promise<OrderDetail> => {
    const response = await fetch(`${BASE_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'فشل في إنشاء الطلب');
    }
    return response.json();
  },

  updateOrder: async (id: number, orderData: UpdateOrderRequest): Promise<void> => {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Failed to update order');
    }
  },
  deleteOrder: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Failed to update order');
    }
  }
};


// ==================== Categories Interfaces ====================
export interface Category {
  id?: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  status: "active" | "inactive" | "draft";
  sort_order: number;
  is_featured: boolean;
}

interface CreateCategoryData {
  name: string;
  slug: string;
  image: string;
  description: string;
  status: "active" | "inactive" | "draft"; // إضافة draft
  sort_order: number;
  is_featured: boolean;
}

interface UpdateCategoryData {
  name: string;
  slug: string;
  image: string;
  description: string;
  status: "active" | "inactive" | "draft"; // إضافة draft
  sort_order: number;
  is_featured: boolean;
}

// ==================== Categories API ====================
export const categoriesApi = {
  // إنشاء فئة جديدة
  createCategory: async (categoryData: CreateCategoryData): Promise<Category> => {
    const response = await fetch(`${BASE_URL}/categories/`, {
      method: 'POST',
      headers: getAuthHeaders(), 
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  // جلب الفئات المميزة
  getFeaturedCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${BASE_URL}/categories/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured categories');
    return response.json();
  },

  // جلب جميع الفئات
  getCategories: async (statusFilter?: 'active' | 'inactive'): Promise<Category[]> => {
    const url = statusFilter 
      ? `${BASE_URL}/categories/?status_filter=${statusFilter}`
      : `${BASE_URL}/categories/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // جلب فئة محددة
  getCategoryById: async (categoryId: string): Promise<Category> => {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`);
    if (!response.ok) throw new Error('Category not found');
    return response.json();
  },

  // تحديث فئة  
  updateCategory: async (categoryId: string, updateData: UpdateCategoryData): Promise<Category> => {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  // حذف فئة
  deleteCategory: async (categoryId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete category');
  }
};

// ==================== Products API ====================
export const productsApi = {
  getAllProducts: async (limit?: number): Promise<Product[]> => {
    const url = limit 
      ? `${BASE_URL}/products/?limit=${limit}`
      : `${BASE_URL}/products/`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  getProductById: async (productId: string): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  getProductsByCategory: async (category: string, limit?: number): Promise<Product[]> => {
    const url = limit 
      ? `${BASE_URL}/products/category/${category}?limit=${limit}`
      : `${BASE_URL}/products/category/${category}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    return response.json();
  },
    createProduct: async (productData: ProductCreate): Promise<Product> => {
    console.log('Creating product:', productData);
    
    const response = await fetch(`${BASE_URL}/products/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create Product API Error:', errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.message || 'Failed to create product';
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
  updateProduct: async (productId: string, productData: FormData): Promise<Product> => {
    console.log('Updating product:', productId, productData);
    
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update Product API Error:', errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.message || 'Failed to update product';
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  deleteProduct: async (productId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete Product API Error:', errorText);
    
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.detail || errorData.message || 'Failed to delete product';
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
}
};

// ==================== Reviews API ====================
export const reviewsApi = {
  createReview: async (reviewData: ReviewCreate): Promise<Review> => {
    console.log('Sending review data:', reviewData); // للتتبع
    
    const response = await fetch(`${BASE_URL}/reviews/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
      },
      body: JSON.stringify(reviewData),
    });
    
    // معالجة أفضل للأخطاء
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.message || 'Failed to create review';
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  getReviewsByProduct: async (
    productId: string, 
    limit?: number, 
    offset?: number
  ): Promise<Review[]> => {
    let url = `${BASE_URL}/reviews/product/${productId}`;
    const params = new URLSearchParams();
    
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log('Fetching reviews from:', url); // للتتبع
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch reviews:', response.status, response.statusText);
      throw new Error('Failed to fetch reviews');
    }
    
    return response.json();
  }
};

// ==================== Search API ====================
export const searchApi = {
  searchProducts: async (query: string, limit?: number): Promise<Product[]> => {
    const url = new URL(`${BASE_URL}/products/search/`);
    url.searchParams.append('q', query);
    if (limit) {
      url.searchParams.append('limit', limit.toString());
    }
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API Error:', errorText);
      throw new Error('Failed to search products');
    }
    
    return response.json();
  }
};

// ==================== Product Generator API ====================
export const productGeneratorApi = {
  /**
   * توليد JSON منتج من معلومات نصية باستخدام Gemini AI
   * @param requestData بيانات طلب توليد المنتج
   * @returns استجابة توليد المنتج
   */
  generateProduct: async (requestData: ProductGeneratorRequest): Promise<ProductGeneratorResponse> => {
    console.log('Sending product generation request:', requestData);
    
    const response = await fetch(`${BASE_URL}/api/v1/product-generator/generate`, {
      method: 'POST',
      headers: getAuthHeaders(), 
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Product Generator API Error:', errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.message || 'Failed to generate product';
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  /**
   * فحص صحة خدمة مولد المنتجات
   * @returns حالة الخدمة
   */
  healthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await fetch(`${BASE_URL}/api/v1/product-generator/health`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to check product generator health');
    }
    
    return response.json();
  },

  /**
   * الحصول على قائمة اللغات المدعومة
   * @returns قائمة اللغات المدعومة
   */
  getSupportedLanguages: async (): Promise<SupportedLanguagesResponse> => {
    const response = await fetch(`${BASE_URL}/api/v1/product-generator/supported-languages`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch supported languages');
    }
    
    return response.json();
  },

  /**
   * معاينة البرومت المستخدم لتوليد JSON المنتج
   * @param language اللغة المطلوبة (arabic أو english)
   * @returns معاينة البرومت
   */
  getPromptPreview: async (language: string = 'arabic'): Promise<PromptPreviewResponse> => {
    const response = await fetch(`${BASE_URL}/api/v1/product-generator/prompt-preview?language=${encodeURIComponent(language)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Prompt Preview API Error:', errorText);
      throw new Error('Failed to fetch prompt preview');
    }
    
    return response.json();
  }
};
//======================= Upload Images API & Interface =====================
// إضافة هذه الأنواع بعد Product Generator Types
export interface UploadResponse {
  success: boolean;
  image_url: string;
  public_id: string;
}

// إضافة هذا API بعد productGeneratorApi
export const uploadApi = {
  /**
   * رفع صورة إلى Cloudinary
   * @param file ملف الصورة
   * @returns رابط الصورة المرفوعة
   */
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/upload-image/`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload API Error:', errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || 'Failed to upload image';
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  }
};