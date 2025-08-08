import React, { useState, useCallback } from 'react';
import { Upload, X, Link, Loader2 } from 'lucide-react';
import { uploadApi } from '@/lib/api';

const ProductImages = ({ formData, onInputChange, errors }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = useCallback(async (files: FileList) => {
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file: File) => {
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
    } catch (error) {
      console.error('خطأ في رفع الصور:', error);
    } finally {
      setUploading(false);
    }
  }, [formData.images, onInputChange]);

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

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      const newImages = [...formData.images, imageUrl.trim()];
      onInputChange('images', newImages);
      setImageUrl('');
      setShowUrlInput(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: any, i: number) => i !== index);
    onInputChange('images', newImages);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">صور المنتج</h2>
        <p className="text-gray-600 text-sm mt-1">أضف صور عالية الجودة للمنتج (أول صورة ستكون الصورة الرئيسية)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          صور المنتج *
        </label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : errors.images
              ? 'border-red-500 bg-red-50'
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
              <p className="text-blue-600">جاري رفع الصور...</p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">اسحب الصور هنا أو</p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <label className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                    اختر الصور
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
          
          <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF حتى 10MB</p>
        </div>
        
        {showUrlInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="أدخل رابط الصورة (مثال: https://example.com/image.jpg)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
              />
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
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
        
        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
      </div>

      {formData.images.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            الصور المرفوعة ({formData.images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image: string, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjRMMTEwIDc0SDE0MFY5NEg2MFY3NEw3MCA2NEg5MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI5MCIgeT0iNTQiPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIzIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="حذف الصورة"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    صورة رئيسية
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            يمكنك إعادة ترتيب الصور بسحبها وإفلاتها
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductImages;