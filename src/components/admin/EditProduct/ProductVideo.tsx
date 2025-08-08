import React from 'react';
import { Play } from 'lucide-react';

interface ProductVideoProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  errors: any;
}

const ProductVideo: React.FC<ProductVideoProps> = ({ formData, onInputChange, errors }) => {
  const videoInfo = formData.videoInfo || {};

  const handleVideoChange = (field: string, value: string) => {
    onInputChange('videoInfo', {
      ...videoInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">فيديو المنتج</h2>
        <p className="text-gray-600 text-sm mt-1">أضف فيديو توضيحي للمنتج</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الفيديو
          </label>
          <input
            type="url"
            value={videoInfo.videoUrl || ''}
            onChange={(e) => handleVideoChange('videoUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="text-gray-500 text-xs mt-1">
            يمكنك استخدام روابط YouTube أو روابط مباشرة للفيديو
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة مصغرة للفيديو
          </label>
          <input
            type="url"
            value={videoInfo.thumbnail || ''}
            onChange={(e) => handleVideoChange('thumbnail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="رابط الصورة المصغرة"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          عنوان الفيديو
        </label>
        <input
          type="text"
          value={videoInfo.title || ''}
          onChange={(e) => handleVideoChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="عنوان الفيديو"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          عنوان الوصف
        </label>
        <input
          type="text"
          value={videoInfo.descriptionTitle || ''}
          onChange={(e) => handleVideoChange('descriptionTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="عنوان قسم الوصف"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف الفيديو
        </label>
        <textarea
          value={videoInfo.description || ''}
          onChange={(e) => handleVideoChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="وصف تفصيلي للفيديو"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نص فوق زر التشغيل
        </label>
        <input
          type="text"
          value={videoInfo.overlayText || ''}
          onChange={(e) => handleVideoChange('overlayText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="نص يظهر فوق زر التشغيل"
        />
      </div>

      {/* معاينة الفيديو */}
      {videoInfo.videoUrl && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">معاينة الفيديو</h3>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            {videoInfo.thumbnail ? (
              <div className="relative w-full h-full">
                <img
                  src={videoInfo.thumbnail}
                  alt="صورة مصغرة"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="h-8 w-8 text-gray-800 ml-1" fill="currentColor" />
                  </div>
                </div>
                {videoInfo.overlayText && (
                  <div className="absolute bottom-4 left-4 text-white font-medium">
                    {videoInfo.overlayText}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVideo;