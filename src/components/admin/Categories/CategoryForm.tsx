// src/components/admin/Categories/CategoryForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { categoriesApi, uploadApi } from "@/lib/api";
import {
  ArrowRight,
  Save,
  Upload,
  Tag,
  Star,
  AlertCircle,
  X,
  Trash2,
  Loader2,
} from "lucide-react";

// Types - استيراد من API أو تعريف محلي
interface Category {
  id?: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  status: "active" | "inactive" | "draft";
  sort_order: number;
  is_featured: boolean;
}

type FormErrors = Partial<Record<keyof Category, string>>;

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const isEditing = location.state?.isEditing || !!categoryId;

  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    image: "",
    description: "",
    status: "active", // القيمة الافتراضية: نشط
    sort_order: 0,
    is_featured: true, // القيمة الافتراضية: مميز
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isEditing && categoryId) {
      fetchCategory();
    }
  }, [isEditing, categoryId]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await categoriesApi.getCategoryById(categoryId!);
      setFormData(category);
      setImagePreview(category.image);
    } catch (error: any) {
      toast({
        title: "خطأ في جلب التصنيف",
        description: "حدث خطأ أثناء جلب بيانات التصنيف",
        variant: "destructive",
      });
      navigate("/admin/categories/list");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // تصفية حقل slug ليقبل فقط حروف إنجليزية وأرقام
    if (name === 'slug') {
      const cleanedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // فقط حروف إنجليزية صغيرة وأرقام وشرطة
        .replace(/^-+|-+$/g, '') // إزالة الشرطات من البداية والنهاية
        .replace(/-+/g, '-'); // تحويل الشرطات المتعددة إلى شرطة واحدة
      
      setFormData(prev => ({
        ...prev,
        slug: cleanedSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Auto-generate slug from name
    if (name === 'name' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // فقط حروف إنجليزية وأرقام ومسافات
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Clear error
    if (errors[name as keyof Category]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "نوع الملف غير صحيح",
        description: "يرجى اختيار صورة صحيحة",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "حجم الملف كبير",
        description: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت",
        variant: "destructive",
      });
      return;
    }

    try {
      setImageUploading(true);
      const uploadResponse = await uploadApi.uploadImage(file);
      
      setFormData(prev => ({ ...prev, image: uploadResponse.image_url }));
      setImagePreview(uploadResponse.image_url);
      
      toast({
        title: "تم رفع الصورة",
        description: "تم رفع الصورة بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في رفع الصورة",
        description: error.message || "حدث خطأ أثناء رفع الصورة",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: "" }));
    setImagePreview("");
    
    // Clear file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    toast({
      title: "تم حذف الصورة",
      description: "تم حذف الصورة بنجاح",
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم التصنيف مطلوب";
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = "اسم التصنيف يجب أن يكون بين 2-100 حرف";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "الرابط المختصر مطلوب";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "الرابط المختصر يجب أن يحتوي فقط على حروف إنجليزية صغيرة وأرقام وشرطة";
    }

    if (!formData.image.trim()) {
      newErrors.image = "صورة التصنيف مطلوبة";
    }

    if (!formData.description.trim()) {
      newErrors.description = "وصف التصنيف مطلوب";
    } else if (formData.description.length < 10 || formData.description.length > 500) {
      newErrors.description = "وصف التصنيف يجب أن يكون بين 10-500 حرف";
    }

    if (formData.sort_order < 0) {
      newErrors.sort_order = "ترتيب العرض يجب أن يكون أكبر من أو يساوي صفر";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى تصحيح الأخطاء المحددة",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      if (isEditing && categoryId) {
        await categoriesApi.updateCategory(categoryId, formData);
        toast({ title: "تم تحديث التصنيف", description: "تم تحديث التصنيف بنجاح" });
      } else {
        // إضافة id للبيانات عند الإنشاء
        const categoryData = {
          ...formData,
          id: formData.slug // استخدام slug كـ id
        };
        await categoriesApi.createCategory(categoryData);
        toast({ title: "تم إنشاء التصنيف", description: "تم إنشاء التصنيف بنجاح" });
      }
      
      navigate("/admin/categories/list");
    } catch (error: any) {
      toast({
        title: isEditing ? "خطأ في التحديث" : "خطأ في الإنشاء",
        description: error.message || "حدث خطأ أثناء حفظ التصنيف",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (
    name: keyof Category,
    label: string,
    type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' = 'text',
    placeholder?: string,
    options?: { value: string; label: string }[]
  ) => {
    const hasError = !!errors[name];
    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {name !== 'sort_order' && name !== 'is_featured' && '*'}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            rows={4}
            className={baseClasses}
            placeholder={placeholder}
          />
        ) : type === 'select' ? (
          <select
            name={name}
            value={formData[name] as string}
            onChange={handleInputChange}
            className={baseClasses}
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={formData[name] as boolean}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="mr-2 text-sm font-medium text-gray-700 flex items-center">
              <Star className="h-4 w-4 text-yellow-500 ml-1" />
              {label}
            </label>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] as string | number}
            onChange={handleInputChange}
            className={baseClasses}
            placeholder={placeholder}
            min={type === 'number' ? 0 : undefined}
          />
        )}
        
        {hasError && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 ml-1" />
            {errors[name]}
          </p>
        )}
        
        {name === 'slug' && !hasError && (
          <p className="mt-1 text-xs text-gray-500">
            حروف إنجليزية صغيرة، أرقام، وشرطة فقط (مثال: smart-phones)
          </p>
        )}
        
        {name === 'description' && (
          <div className="flex justify-end mt-1">
            <span className="text-sm text-gray-500">
              {formData.description.length}/500
            </span>
          </div>
        )}
        
        {name === 'sort_order' && (
          <p className="mt-1 text-sm text-gray-500">الأرقام الأصغر تظهر أولاً</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate("/admin/categories/list")}
            className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Tag className="ml-2 h-6 w-6 text-blue-600" />
            {isEditing ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>
              
              <div className="space-y-4">
                {renderField('name', 'اسم التصنيف', 'text', 'هواتف ذكية')}
                {renderField('slug', 'الرابط المختصر', 'text', 'smart-phones')}
                {renderField('description', 'وصف التصنيف', 'textarea', 'وصف مختصر عن التصنيف...')}
                {renderField('sort_order', 'ترتيب العرض', 'number')}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">صورة التصنيف</h3>
              
              {imagePreview ? (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="حذف الصورة"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <Upload className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">لا توجد صورة</p>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={imageUploading}
              />
              <label
                htmlFor="image-upload"
                className={`w-full flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  errors.image 
                    ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                } ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {imageUploading ? (
                  <Loader2 className="h-5 w-5 text-blue-500 ml-2 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5 text-gray-400 ml-2" />
                )}
                <span className="text-sm text-gray-600">
                  {imageUploading ? "جاري الرفع..." : imagePreview ? "تغيير الصورة" : "رفع صورة"}
                </span>
              </label>
              
              {errors.image && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  {errors.image}
                </p>
              )}
              
              <p className="mt-2 text-xs text-gray-500">
                الحد الأقصى: 5 ميجابايت. الأنواع المدعومة: JPG, PNG, GIF, WebP
              </p>
            </div>

            {/* Settings - معلق مؤقتاً */}
            {/*
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h3>
              
              <div className="space-y-4">
                {renderField('status', 'حالة التصنيف', 'select', undefined, [
                  { value: 'active', label: 'نشط' },
                  { value: 'inactive', label: 'غير نشط' },
                  { value: 'draft', label: 'مسودة' }
                ])}
                {renderField('is_featured', 'تصنيف مميز', 'checkbox')}
              </div>
            </div>
            */}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-5 w-5 ml-2" />
                  {saving 
                    ? "جاري الحفظ..." 
                    : isEditing 
                      ? "تحديث التصنيف" 
                      : "إنشاء التصنيف"
                  }
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/admin/categories/list")}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;