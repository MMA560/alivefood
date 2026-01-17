import React, { useState, useCallback } from 'react';
import { Upload, X, Link, Loader2, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { uploadApi } from '@/lib/api';
import { validateImages } from '@/lib/productValidation';

const ProductImages = ({ formData, onInputChange, errors }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localErrors, setLocalErrors] = useState<{[key: string]: string | null}>({});
  const [urlError, setUrlError] = useState<string | null>(null);

  /**
   * التحقق من صحة رابط الصورة
   */
  const validateImageUrl = (url: string): string | null => {
    if (!url || !url.trim()) {
      return 'رابط الصورة مطلوب';
    }

    // التحقق من صيغة الرابط
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return 'يجب أن يبدأ الرابط بـ http:// أو https://';
      }
    } catch (e) {
      return 'رابط الصورة غير صحيح';
    }

    // التحقق من امتداد الملف (اختياري)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (!hasValidExtension) {
      return 'يجب أن يكون الرابط لصورة (jpg, jpeg, png, gif, webp, svg)';
    }

    return null;
  };

  /**
   * رفع الصور
   */
  const handleImageUpload = useCallback(async (files: FileList) => {
    setUploading(true);
    setLocalErrors({});
    
    try {
      const uploadPromises = Array.from(files).map(async (file: File) => {
        // التحقق من حجم الملف (10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`الملف ${file.name} كبير جداً (الحد الأقصى 10MB)`);
        }

        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
          throw new Error(`الملف ${file.name} ليس صورة`);
        }

        try {
          const response = await uploadApi.uploadImage(file);
          return response.image_url;
        } catch (error) {
          console.error('فشل في رفع الصورة:', error);
          // في حالة فشل الرفع، استخدم URL محلي مؤقت
          return URL.createObjectURL(file);
        }
      });

      const imageUrls = await Promise.all(uploadPromises);
      const newImages = [...formData.images, ...imageUrls];
      onInputChange('images', newImages);
      
      // التحقق من الصور بعد الإضافة
      const error = validateImages(newImages);
      setLocalErrors(prev => ({ ...prev, images: error }));
      
    } catch (error: any) {
      console.error('خطأ في رفع الصور:', error);
      setLocalErrors({ images: error.message || 'فشل في رفع الصور' });
    } finally {
      setUploading(false);
    }
  }, [formData.images, onInputChange]);

  /**
   * السحب والإفلات
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, [handleImageUpload]);

  /**
   * إضافة صورة من رابط
   */
  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrl.trim();
    
    // التحقق من الرابط
    const urlValidation = validateImageUrl(trimmedUrl);
    if (urlValidation) {
      setUrlError(urlValidation);
      return;
    }

    // التحقق من عدم تكرار الرابط
    if (formData.images.includes(trimmedUrl)) {
      setUrlError('هذه الصورة موجودة بالفعل');
      return;
    }

    const newImages = [...formData.images, trimmedUrl];
    onInputChange('images', newImages);
    
    // التحقق من الصور بعد الإضافة
    const error = validateImages(newImages);
    setLocalErrors(prev => ({ ...prev, images: error }));
    
    setImageUrl('');
    setShowUrlInput(false);
    setUrlError(null);
  };

  /**
   * حذف صورة
   */
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: any, i: number) => i !== index);
    onInputChange('images', newImages);
    
    // التحقق من الصور بعد الحذف
    const error = validateImages(newImages);
    setLocalErrors(prev => ({ ...prev, images: error }));
  };

  /**
   * نقل صورة للأمام (جعلها الصورة الرئيسية)
   */
  const moveImageToFront = (index: number) => {
    if (index === 0) return; // already at front
    
    const newImages = [...formData.images];
    const [movedImage] = newImages.splice(index, 1);
    newImages.unshift(movedImage);
    onInputChange('images', newImages);
  };

  /**
   * إعادة ترتيب الصور
   */
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDropImage = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;
    
    const newImages = [...formData.images];
    const [draggedImage] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    onInputChange('images', newImages);
  };

  const handleDragOverImage = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // دمج الأخطاء المحلية مع الأخطاء الخارجية
  const getError = (field: string) => {
    return localErrors[field] || errors?.[field] || null;
  };

  const imageCount = formData.images?.length || 0;
  const hasImages = imageCount > 0;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">صور المنتج</h2>
        <p className="text-gray-600 text-sm mt-1">أضف صور عالية الجودة للمنتج (أول صورة ستكون الصورة الرئيسية)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          صور المنتج * (يجب إضافة صورة واحدة على الأقل)
        </label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 scale-105'
              : getError('images')
              ? 'border-red-500 bg-red-50'
              : hasImages
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-blue-600 font-medium">جاري رفع الصور...</p>
              <p className="text-sm text-gray-500 mt-1">يرجى الانتظار</p>
            </div>
          ) : (
            <>
              {hasImages ? (
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              )}
              
              <p className={`font-medium mb-2 ${hasImages ? 'text-green-600' : 'text-gray-600'}`}>
                {hasImages 
                  ? `✓ تم إضافة ${imageCount} ${imageCount === 1 ? 'صورة' : 'صور'}`
                  : 'اسحب الصور هنا أو'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <label className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                    {hasImages ? 'إضافة المزيد' : 'اختر الصور'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(e.target.files);
                      }
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                
                <span className="text-gray-400 text-sm">أو</span>
                
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  disabled={uploading}
                >
                  <Link className="h-4 w-4" />
                  إضافة رابط
                </button>
              </div>
            </>
          )}
          
          <p className="text-xs text-gray-500 mt-3">
            صيغ مدعومة: PNG, JPG, GIF, WebP, SVG • الحد الأقصى: 10MB لكل صورة
          </p>
        </div>
        
        {showUrlInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setUrlError(null);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    urlError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  dir="ltr"
                />
                {urlError && (
                  <div className="flex items-start gap-2 mt-2 text-red-600">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs">{urlError}</p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!imageUrl.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إضافة
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setImageUrl('');
                  setUrlError(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
        
        {getError('images') && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2 text-red-600">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{getError('images')}</p>
            </div>
          </div>
        )}
      </div>

      {hasImages && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              الصور المرفوعة ({imageCount})
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ImageIcon className="h-4 w-4" />
              <span>اسحب الصور لإعادة الترتيب</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image: string, index: number) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDropImage(e, index)}
                onDragOver={handleDragOverImage}
                className="relative group cursor-move"
              >
                <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-200">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjRMMTEwIDc0SDE0MFY5NEg2MFY3NEw3MCA2NEg5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI5MCIgeT0iNTQiPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIzIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                    }}
                  />
                  
                  {/* زر الحذف */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    title="حذف الصورة"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* شارة الصورة الرئيسية */}
                  {index === 0 ? (
                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium shadow-md">
                      صورة رئيسية
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => moveImageToFront(index)}
                      className="absolute bottom-2 left-2 bg-gray-800/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900 shadow-md"
                      title="جعلها الصورة الرئيسية"
                    >
                      جعلها رئيسية
                    </button>
                  )}
                  
                  {/* رقم الصورة */}
                  <div className="absolute top-2 left-2 bg-gray-800/70 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">💡 نصائح للصور:</p>
                <ul className="space-y-1 text-xs">
                  <li>• الصورة الأولى هي الصورة الرئيسية التي ستظهر في القوائم</li>
                  <li>• يمكنك سحب الصور لإعادة ترتيبها</li>
                  <li>• استخدم صور عالية الجودة بخلفية بيضاء للحصول على أفضل نتيجة</li>
                  <li>• يُفضل أن تكون الصور بنفس الأبعاد (مربعة أو 4:3)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* رسالة تأكيد عند إضافة الصور */}
      {hasImages && !getError('images') && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium">
              ✓ تم إضافة {imageCount} {imageCount === 1 ? 'صورة' : 'صور'} بنجاح
            </span>
          </div>
        </div>
      )}

      {/* رسالة تحذير عند عدم وجود صور */}
      {!hasImages && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-2 text-orange-800">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">يجب إضافة صورة واحدة على الأقل</p>
              <p className="text-sm text-orange-700 mt-1">
                الصور ضرورية لعرض المنتج بشكل جذاب للعملاء
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;