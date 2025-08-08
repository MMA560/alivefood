import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  AlertCircle,
  Move,
  Check,
  Loader2,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadApi } from "@/lib/api";

interface SlideFormData {
  image_url: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  link_url: string;
  order: number;
  is_active: boolean;
}

interface Slide {
  id?: number | string;
  image_url?: string;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  link_url?: string;
  order?: number;
  is_active?: boolean;
  created_at?: string;
}

interface SlideModalProps {
  slide: Slide | null;
  slides: Slide[] | undefined;
  onClose: () => void;
  onSubmit: (formData: SlideFormData) => Promise<boolean>;
  loading: boolean;
}

const SlideModal: React.FC<SlideModalProps> = ({
  slide,
  slides,
  onClose,
  onSubmit,
  loading
}) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const [formData, setFormData] = useState<SlideFormData>({
    image_url: '',
    title_ar: '',
    title_en: '',
    subtitle_ar: '',
    subtitle_en: '',
    link_url: '',
    order: 0,
    is_active: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SlideFormData, string>>>({});

  useEffect(() => {
    if (slide) {
      setFormData({
        image_url: slide?.image_url || '',
        title_ar: slide?.title_ar || '',
        title_en: slide?.title_en || '',
        subtitle_ar: slide?.subtitle_ar || '',
        subtitle_en: slide?.subtitle_en || '',
        link_url: slide?.link_url || '',
        order: slide?.order || 0,
        is_active: slide?.is_active !== undefined ? slide.is_active : false
      });
      setImagePreview(slide?.image_url || '');
    } else {
      setFormData({
        image_url: '',
        title_ar: '',
        title_en: '',
        subtitle_ar: '',
        subtitle_en: '',
        link_url: '',
        order: (slides?.length || 0) + 1,
        is_active: true
      });
      setImagePreview('');
    }
    setErrors({});
  }, [slide, slides]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof SlideFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SlideFormData, string>> = {};

    if (!formData.image_url) newErrors.image_url = 'صورة الشريحة مطلوبة';
    if (!formData.title_ar) newErrors.title_ar = 'العنوان باللغة العربية مطلوب';
    if (!formData.title_en) newErrors.title_en = 'العنوان باللغة الإنجليزية مطلوب';
    if (!formData.subtitle_ar) newErrors.subtitle_ar = 'العنوان الفرعي باللغة العربية مطلوب';
    if (!formData.subtitle_en) newErrors.subtitle_en = 'العنوان الفرعي باللغة الإنجليزية مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ في نوع الملف",
        description: "يرجى اختيار صورة صحيحة (JPG, PNG, GIF, WebP)",
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
      setFormData(prev => ({ ...prev, image_url: uploadResponse.image_url }));
      setImagePreview(uploadResponse.image_url);
      
      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم رفع صورة الشريحة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع الصورة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImagePreview('');
    
    // Clear file input
    const fileInput = document.getElementById('slide-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    toast({
      title: "تم حذف الصورة",
      description: "تم حذف الصورة بنجاح",
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(formData);
  };

  const renderField = (
    name: keyof SlideFormData,
    label: string,
    type: 'text' | 'textarea' | 'number' | 'checkbox' = 'text',
    placeholder?: string
  ) => {
    const hasError = !!errors[name];
    const baseClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {name !== 'order' && name !== 'is_active' && '*'}
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
        ) : type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={formData[name] as boolean}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="mr-2 text-sm font-medium text-gray-700">
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
        
        {name === 'subtitle_ar' && (
          <div className="flex justify-end mt-1">
            <span className="text-sm text-gray-500">
              {formData.subtitle_ar.length}/500
            </span>
          </div>
        )}
        
        {name === 'subtitle_en' && (
          <div className="flex justify-end mt-1">
            <span className="text-sm text-gray-500">
              {formData.subtitle_en.length}/500
            </span>
          </div>
        )}
        
        {name === 'order' && (
          <p className="mt-1 text-sm text-gray-500">الأرقام الأصغر تظهر أولاً</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg ml-3">
              <Move className="h-5 w-5 text-blue-600" />
            </div>
            {slide ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>
                
                <div className="space-y-4">
                  {renderField('title_ar', 'اسم الشريحة (عربي)', 'text', 'هواتف ذكية')}
                  {renderField('title_en', 'اسم الشريحة (إنجليزي)', 'text', 'Smart Phones')}
                  {renderField('subtitle_ar', 'الوصف (عربي)', 'textarea', 'وصف مختصر عن الشريحة...')}
                  {renderField('subtitle_en', 'الوصف (إنجليزي)', 'textarea', 'Short description about the slide...')}
                  {renderField('link_url', 'الرابط', 'text', '/smartphones')}
                  {renderField('order', 'ترتيب العرض', 'number')}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">صورة الشريحة</h3>

                {imagePreview ? (
                  <div className="relative mb-4">
                    <img
                      src={imagePreview}
                      alt="معاينة الصورة"
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
                  id="slide-image-upload"
                  disabled={imageUploading}
                />
                <label
                  htmlFor="slide-image-upload"
                  className={`w-full flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    errors.image_url 
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

                {errors.image_url && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 ml-1" />
                    {errors.image_url}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  الحد الأقصى: 5 ميجابايت. الأنواع المدعومة: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h3>
                
                <div className="space-y-4">
                  {renderField('is_active', 'شريحة نشطة', 'checkbox')}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || imageUploading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        {slide ? 'جاري التحديث...' : 'جاري الإنشاء...'}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 ml-2" />
                        {slide ? 'تحديث الشريحة' : 'إنشاء الشريحة'}
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={onClose}
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
    </div>
  );
};

export default SlideModal;