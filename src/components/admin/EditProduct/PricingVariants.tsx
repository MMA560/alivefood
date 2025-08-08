import { Plus, X, DollarSign, Upload, Loader2, AlertCircle } from 'lucide-react';
import { uploadApi } from '@/lib/api';
import { useState, useEffect } from 'react';

const PricingVariants = ({ formData, onInputChange, onArrayChange, errors }) => {
  const [uploadingVariant, setUploadingVariant] = useState<number | null>(null);

  const addVariant = () => {
    const newVariants = [
      ...(formData.variants || []),
      { 
        id: `variant-${Date.now()}`, 
        color: '', 
        image: '', 
        stock: 0, 
        price: '' 
      }
    ];
    onArrayChange('variants', newVariants);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index][field] = value;
    onArrayChange('variants', newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = (formData.variants || []).filter((_, i) => i !== index);
    onArrayChange('variants', newVariants);
  };

  const handleVariantImageUpload = async (index: number, file: File) => {
    setUploadingVariant(index);
    try {
      const response = await uploadApi.uploadImage(file);
      updateVariant(index, 'image', response.image_url);
    } catch (error) {
      console.error('فشل في رفع صورة المتغير:', error);
      // في حالة فشل الرفع، استخدم URL محلي مؤقت
      const localUrl = URL.createObjectURL(file);
      updateVariant(index, 'image', localUrl);
    } finally {
      setUploadingVariant(null);
    }
  };

  // حساب نسبة الخصم تلقائياً
  const calculateDiscount = () => {
    const currentPrice = parseFloat(formData.price) || 0;
    const oldPrice = parseFloat(formData.old_price) || 0;
    
    if (oldPrice > 0 && currentPrice > 0 && oldPrice > currentPrice) {
      const discountPercent = ((oldPrice - currentPrice) / oldPrice) * 100;
      return Math.ceil(discountPercent);
    }
    return 0;
  };

  // تحديث نسبة الخصم عند تغيير الأسعار
  const handlePriceChange = (field: string, value: string) => {
    onInputChange(field, value);
    
    setTimeout(() => {
      const updatedFormData = { ...formData, [field]: value };
      const currentPrice = parseFloat(updatedFormData.price) || 0;
      const oldPrice = parseFloat(updatedFormData.old_price) || 0;
      
      if (oldPrice > 0 && currentPrice > 0 && oldPrice > currentPrice) {
        const discountPercent = ((oldPrice - currentPrice) / oldPrice) * 100;
        const roundedDiscount = Math.ceil(discountPercent);
        onInputChange('discount', roundedDiscount.toString());
      } else if (oldPrice === 0 || currentPrice === 0 || oldPrice <= currentPrice) {
        onInputChange('discount', '0');
      }
    }, 0);
  };

  // إنشاء متغير افتراضي إذا لم يكن موجود
  const ensureDefaultVariant = () => {
    if (!formData.variants || formData.variants.length === 0) {
      const defaultVariant = {
        id: formData.id || `product-${Date.now()}`,
        color: 'افتراضي',
        image: formData.image || '',
        stock: 0,
        price: ''
      };
      onArrayChange('variants', [defaultVariant]);
    }
  };

  // التأكد من وجود متغير افتراضي عند التحميل
  useEffect(() => {
    ensureDefaultVariant();
  }, []);

  // تحديد ما إذا كان المتغير الحالي هو المتغير الافتراضي الوحيد
  const isSingleDefaultVariant = (formData.variants || []).length === 1;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">الأسعار والمتغيرات</h2>
        <p className="text-gray-600 text-sm mt-1">حدد أسعار المنتج والمتغيرات المتاحة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر الأساسي *
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.base_price || ''}
              onChange={(e) => onInputChange('base_price', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 ${
                errors?.base_price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <DollarSign className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {errors?.base_price && <p className="text-red-500 text-sm mt-1">{errors.base_price}</p>}
          <p className="text-xs text-gray-500 mt-1">السعر الأساسي للمنتج</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر الحالي *
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handlePriceChange('price', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 ${
                errors?.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <DollarSign className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {errors?.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر القديم
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.old_price || ''}
              onChange={(e) => handlePriceChange('old_price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <DollarSign className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نسبة الخصم %
          </label>
          <input
            type="number"
            value={formData.discount || ''}
            onChange={(e) => onInputChange('discount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            placeholder="0"
            min="0"
            max="100"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">محسوبة تلقائياً</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">متغيرات المنتج</h3>
            <p className="text-sm text-gray-600 mt-1">
              يمكنك إضافة متغيرات متعددة (ألوان، أحجام، أنواع مختلفة)
            </p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            إضافة متغير
          </button>
        </div>

        {(!formData.variants || formData.variants.length === 0) ? (
          <div className="text-center py-8 bg-orange-50 rounded-lg border-2 border-dashed border-orange-300">
            <p className="text-orange-600 font-medium">مطلوب إضافة متغير واحد على الأقل</p>
            <p className="text-sm text-orange-500 mt-1">اضغط "إضافة متغير" لإضافة متغير افتراضي للمنتج</p>
            <button
              type="button"
              onClick={ensureDefaultVariant}
              className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              إضافة متغير افتراضي
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.variants.map((variant: any, index: number) => (
              <div key={variant.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {/* رسالة تنبيه للمتغير الواحد */}
                {isSingleDefaultVariant && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        متغير افتراضي إجباري
                      </span>
                    </div>
                    <p className="text-xs text-orange-700 mt-1">
                      هذا هو المتغير الافتراضي للمنتج. لا يمكن حذفه ولكن يمكن إضافة متغيرات أخرى.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* العمود الأيمن: جميع الخانات */}
                  <div className="md:col-span-2 space-y-4">
                    {/* الصف الأول: معرف المتغير + اللون/النوع */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          معرف المتغير *
                        </label>
                        <input
                          type="text"
                          value={variant.id || ''}
                          onChange={(e) => updateVariant(index, 'id', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={isSingleDefaultVariant ? "معرف المنتج" : "variant-id"}
                          required
                          readOnly={isSingleDefaultVariant}
                        />
                        {isSingleDefaultVariant && (
                          <p className="text-xs text-gray-500 mt-1">يتم استخدام معرف المنتج تلقائياً</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اللون/النوع *
                        </label>
                        <input
                          type="text"
                          value={variant.color || ''}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={isSingleDefaultVariant ? "افتراضي" : "مثال: أحمر، كبير، افتراضي"}
                          required
                          readOnly={isSingleDefaultVariant}
                        />
                        {isSingleDefaultVariant && (
                          <p className="text-xs text-gray-500 mt-1">النوع الافتراضي للمنتج</p>
                        )}
                      </div>
                    </div>

                    {/* الصف الثاني: السعر + المخزون */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          السعر
                        </label>
                        <input
                          type="number"
                          value={variant.price || ''}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {isSingleDefaultVariant ? "اتركه فارغاً لاستخدام السعر الأساسي" : "سعر هذا المتغير"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          المخزون *
                        </label>
                        <input
                          type="number"
                          value={variant.stock || 0}
                          onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            (variant.stock || 0) <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="0"
                          min="1"
                          required
                        />
                        {(variant.stock || 0) <= 0 && (
                          <p className="text-red-500 text-xs mt-1">المخزون مطلوب ويجب أن يكون أكبر من 0</p>
                        )}
                      </div>
                    </div>

                    {/* الصف الثالث: رفع صورة المتغير */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        صورة المتغير {isSingleDefaultVariant ? "(اختيارية)" : ""}
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="url"
                          value={variant.image || ''}
                          onChange={(e) => updateVariant(index, 'image', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://... أو ارفع صورة"
                          dir="ltr"
                        />
                        <div className="relative">
                          <label className="cursor-pointer">
                            <span className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              {uploadingVariant === index ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                              رفع
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleVariantImageUpload(index, e.target.files[0]);
                                }
                              }}
                              className="hidden"
                              disabled={uploadingVariant === index}
                            />
                          </label>
                        </div>
                      </div>
                      {isSingleDefaultVariant && (
                        <p className="text-xs text-gray-500 mt-1">
                          يمكنك ترك هذا فارغاً أو استخدام الصورة الرئيسية للمنتج
                        </p>
                      )}
                    </div>
                  </div>

                  {/* العمود الأيسر: عرض الصورة */}
                  <div className="md:col-span-1 flex items-center justify-center">
                    {variant.image ? (
                      <div className="w-full max-w-[160px]">
                        <img
                          src={variant.image}
                          alt={`Variant ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAzMkw0NCA0MEg1NlY1NkgyNFY0MEwyOCAzMkg0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjM2IiB5PSIyOCI+CjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxLjIiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-[160px] h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {isSingleDefaultVariant ? "صورة اختيارية" : "لا توجد صورة"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* شريط الإجراءات */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {isSingleDefaultVariant ? (
                      <span className="text-orange-600 font-medium">متغير افتراضي - لا يمكن حذفه</span>
                    ) : (
                      <span>متغير اختياري - يمكن حذفه</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    disabled={isSingleDefaultVariant}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isSingleDefaultVariant
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={isSingleDefaultVariant ? "لا يمكن حذف المتغير الافتراضي" : "حذف المتغير"}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingVariants;