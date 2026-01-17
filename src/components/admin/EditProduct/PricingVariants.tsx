import React, { useState, useEffect } from 'react';
import { Plus, X, DollarSign, AlertCircle, CheckCircle, Check } from 'lucide-react';
import {
  validatePrice,
  validateBasePrice,
  validateOldPrice,
  validateDiscount,
  validateVariants,
  allowOnlyNumbers,
  allowOnlyIntegers,
  allowOnlyAlphanumericDashUnderscore,
  preventDangerousCharacters,
  handleNumberPaste,
  handleIntegerPaste,
  handleIdPaste,
  handleTextPaste,
  cleanNumberValue,
  cleanIntegerValue,
  cleanIdValue,
  cleanTextValue,
} from '@/lib/productValidation';

const PricingVariants = ({ formData, onInputChange, onArrayChange, errors }) => {
  const [localErrors, setLocalErrors] = useState<{[key: string]: string | null}>({});
  const [variantErrors, setVariantErrors] = useState<{[key: number]: {[key: string]: string | null}}>({});

  /**
   * التحقق الفوري من السعر الحالي
   */
  const handlePriceChange = (value: string) => {
    const cleaned = cleanNumberValue(value);
    onInputChange('price', cleaned);
    
    const priceError = validatePrice(cleaned);
    setLocalErrors(prev => ({ ...prev, price: priceError }));
    
    if (formData.base_price) {
      const basePriceError = validateBasePrice(formData.base_price, cleaned);
      setLocalErrors(prev => ({ ...prev, base_price: basePriceError }));
    }
    
    if (formData.old_price) {
      const oldPriceError = validateOldPrice(formData.old_price, cleaned);
      setLocalErrors(prev => ({ ...prev, old_price: oldPriceError }));
    }
    
    setTimeout(() => {
      const updatedFormData = { ...formData, price: cleaned };
      const currentPrice = parseFloat(updatedFormData.price) || 0;
      const oldPrice = parseFloat(updatedFormData.old_price) || 0;
      
      if (oldPrice > 0 && currentPrice > 0 && oldPrice > currentPrice) {
        const discountPercent = ((oldPrice - currentPrice) / oldPrice) * 100;
        const roundedDiscount = Math.ceil(discountPercent);
        onInputChange('discount', roundedDiscount.toString());
        
        const discountError = validateDiscount(
          roundedDiscount.toString(),
          formData.old_price,
          cleaned
        );
        setLocalErrors(prev => ({ ...prev, discount: discountError }));
      } else if (oldPrice === 0 || currentPrice === 0 || oldPrice <= currentPrice) {
        onInputChange('discount', '0');
        setLocalErrors(prev => ({ ...prev, discount: null }));
      }
    }, 0);
  };

  /**
   * التحقق الفوري من السعر الأساسي
   */
  const handleBasePriceChange = (value: string) => {
    const cleaned = cleanNumberValue(value);
    onInputChange('base_price', cleaned);
    
    const error = validateBasePrice(cleaned, formData.price);
    setLocalErrors(prev => ({ ...prev, base_price: error }));
  };

  /**
   * التحقق الفوري من السعر القديم
   */
  const handleOldPriceChange = (value: string) => {
    const cleaned = cleanNumberValue(value);
    onInputChange('old_price', cleaned);
    
    const oldPriceError = validateOldPrice(cleaned, formData.price);
    setLocalErrors(prev => ({ ...prev, old_price: oldPriceError }));
    
    setTimeout(() => {
      const currentPrice = parseFloat(formData.price) || 0;
      const oldPrice = parseFloat(cleaned) || 0;
      
      if (oldPrice > 0 && currentPrice > 0 && oldPrice > currentPrice) {
        const discountPercent = ((oldPrice - currentPrice) / oldPrice) * 100;
        const roundedDiscount = Math.ceil(discountPercent);
        onInputChange('discount', roundedDiscount.toString());
        
        const discountError = validateDiscount(
          roundedDiscount.toString(),
          cleaned,
          formData.price
        );
        setLocalErrors(prev => ({ ...prev, discount: discountError }));
      } else {
        onInputChange('discount', '0');
        setLocalErrors(prev => ({ ...prev, discount: null }));
      }
    }, 0);
  };

  /**
   * التحقق من المتغيرات عند أي تغيير
   */
  useEffect(() => {
    if (formData.variants && formData.variants.length > 0) {
      const variantsError = validateVariants(formData.variants);
      setLocalErrors(prev => ({ ...prev, variants: variantsError }));
    }
  }, [formData.variants]);

  /**
   * إضافة متغير جديد
   */
  const addVariant = () => {
    const newVariants = [
      ...(formData.variants || []),
      { 
        id: `variant-${Date.now()}`, 
        color: '', 
        image: '', 
        stock: 1, 
        price: '' 
      }
    ];
    onArrayChange('variants', newVariants);
  };

  /**
   * تحديث متغير
   */
  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index][field] = value;
    onArrayChange('variants', newVariants);
    
    const variant = newVariants[index];
    const errors: {[key: string]: string | null} = {};
    
    if (field === 'id') {
      if (!value || !value.trim()) {
        errors.id = 'معرف المتغير مطلوب';
      }
    }
    
    if (field === 'color') {
      if (!value || !value.trim()) {
        errors.color = 'اللون/النوع مطلوب';
      }
    }
    
    if (field === 'stock') {
      const stock = parseInt(value);
      if (isNaN(stock) || stock < 0) {
        errors.stock = 'المخزون يجب أن يكون رقماً غير سالب';
      } else if (stock === 0) {
        errors.stock = 'المخزون يجب أن يكون أكبر من صفر';
      }
    }
    
    if (field === 'price' && value && value.trim()) {
      const variantPrice = parseFloat(cleanNumberValue(value));
      if (isNaN(variantPrice) || variantPrice <= 0) {
        errors.price = 'السعر يجب أن يكون رقماً أكبر من صفر';
      }
    }
    
    setVariantErrors(prev => ({
      ...prev,
      [index]: { ...prev[index], ...errors }
    }));
  };

  /**
   * حذف متغير
   */
  const removeVariant = (index: number) => {
    const newVariants = (formData.variants || []).filter((_, i) => i !== index);
    onArrayChange('variants', newVariants);
    
    setVariantErrors(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  /**
   * اختيار صورة من الصور المرفوعة
   */
  const selectImageForVariant = (index: number, imageUrl: string) => {
    updateVariant(index, 'image', imageUrl);
  };

  /**
   * إنشاء متغير افتراضي إذا لم يكن موجود
   */
  const ensureDefaultVariant = () => {
    if (!formData.variants || formData.variants.length === 0) {
      const defaultVariant = {
        id: formData.id || `product-${Date.now()}`,
        color: 'افتراضي',
        image: formData.images?.[0] || '',
        stock: 1,
        price: ''
      };
      onArrayChange('variants', [defaultVariant]);
    }
  };

  useEffect(() => {
    if (!formData.variants || formData.variants.length === 0) {
      ensureDefaultVariant();
    }
  }, []);

  const isSingleDefaultVariant = (formData.variants || []).length === 1;

  const getError = (field: string) => {
    return localErrors[field] || errors?.[field] || null;
  };

  const getVariantError = (index: number, field: string) => {
    return variantErrors[index]?.[field] || null;
  };

  // التحقق من وجود صور مرفوعة
  const hasUploadedImages = formData.images && formData.images.length > 0;

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
              type="text"
              inputMode="decimal"
              value={formData.base_price || ''}
              onChange={(e) => handleBasePriceChange(e.target.value)}
              onBlur={(e) => handleBasePriceChange(e.target.value)}
              onKeyPress={allowOnlyNumbers}
              onPaste={handleNumberPaste}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 transition-colors ${
                getError('base_price') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            <DollarSign className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {getError('base_price') && (
            <div className="flex items-start gap-2 mt-2 text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">{getError('base_price')}</p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">التكلفة الأساسية للمنتج</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر الحالي *
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={formData.price || ''}
              onChange={(e) => handlePriceChange(e.target.value)}
              onBlur={(e) => handlePriceChange(e.target.value)}
              onKeyPress={allowOnlyNumbers}
              onPaste={handleNumberPaste}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 transition-colors ${
                getError('price') ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            <DollarSign className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {getError('price') && (
            <div className="flex items-start gap-2 mt-2 text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">{getError('price')}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر القديم (اختياري)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={formData.old_price || ''}
              onChange={(e) => handleOldPriceChange(e.target.value)}
              onBlur={(e) => handleOldPriceChange(e.target.value)}
              onKeyPress={allowOnlyNumbers}
              onPaste={handleNumberPaste}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 transition-colors ${
                getError('old_price') ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            <DollarSign className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {getError('old_price') && (
            <div className="flex items-start gap-2 mt-2 text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs">{getError('old_price')}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نسبة الخصم %
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.discount || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="0"
              readOnly
            />
            {formData.discount && parseFloat(formData.discount) > 0 && (
              <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">محسوبة تلقائياً</p>
        </div>
      </div>

      {/* عرض ملخص الأسعار */}
      {formData.price && formData.base_price && parseFloat(formData.price) > 0 && parseFloat(formData.base_price) > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">الربح:</span>
              <span className="text-blue-900 font-bold mr-2">
                {(parseFloat(formData.price) - parseFloat(formData.base_price)).toFixed(2)} ريال
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">هامش الربح:</span>
              <span className="text-blue-900 font-bold mr-2">
                {(((parseFloat(formData.price) - parseFloat(formData.base_price)) / parseFloat(formData.base_price)) * 100).toFixed(1)}%
              </span>
            </div>
            {formData.old_price && parseFloat(formData.old_price) > parseFloat(formData.price) && (
              <div>
                <span className="text-blue-700 font-medium">الخصم:</span>
                <span className="text-blue-900 font-bold mr-2">
                  {(parseFloat(formData.old_price) - parseFloat(formData.price)).toFixed(2)} ريال
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">متغيرات المنتج *</h3>
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

        {/* تحذير عدم وجود صور */}
        {!hasUploadedImages && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">لم يتم رفع صور بعد</p>
                <p className="text-sm text-yellow-700 mt-1">
                  يرجى الانتقال إلى تاب "الصور" لرفع صور المنتج أولاً، ثم العودة هنا لاختيار الصور للمتغيرات.
                </p>
              </div>
            </div>
          </div>
        )}

        {getError('variants') && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2 text-red-600">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{getError('variants')}</p>
            </div>
          </div>
        )}

        {(!formData.variants || formData.variants.length === 0) ? (
          <div className="text-center py-8 bg-orange-50 rounded-lg border-2 border-dashed border-orange-300">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-3" />
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
            {formData.variants.map((variant: any, index: number) => {
              const hasErrors = getVariantError(index, 'id') || 
                               getVariantError(index, 'color') || 
                               getVariantError(index, 'stock') || 
                               getVariantError(index, 'price');

              return (
                <div 
                  key={variant.id || index} 
                  className={`bg-gray-50 rounded-lg p-4 border-2 transition-colors ${
                    hasErrors ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
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
                            onChange={(e) => updateVariant(index, 'id', cleanIdValue(e.target.value))}
                            onBlur={(e) => updateVariant(index, 'id', cleanIdValue(e.target.value))}
                            onKeyPress={allowOnlyAlphanumericDashUnderscore}
                            onPaste={handleIdPaste}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              getVariantError(index, 'id') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder={isSingleDefaultVariant ? "معرف المنتج" : "variant-id"}
                            required
                            readOnly={isSingleDefaultVariant}
                          />
                          {getVariantError(index, 'id') && (
                            <p className="text-red-500 text-xs mt-1">{getVariantError(index, 'id')}</p>
                          )}
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
                            onChange={(e) => updateVariant(index, 'color', cleanTextValue(e.target.value))}
                            onBlur={(e) => updateVariant(index, 'color', cleanTextValue(e.target.value))}
                            onKeyPress={preventDangerousCharacters}
                            onPaste={handleTextPaste}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              getVariantError(index, 'color') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder={isSingleDefaultVariant ? "افتراضي" : "مثال: أحمر، كبير، افتراضي"}
                            required
                            readOnly={isSingleDefaultVariant}
                          />
                          {getVariantError(index, 'color') && (
                            <p className="text-red-500 text-xs mt-1">{getVariantError(index, 'color')}</p>
                          )}
                          {isSingleDefaultVariant && (
                            <p className="text-xs text-gray-500 mt-1">النوع الافتراضي للمنتج</p>
                          )}
                        </div>
                      </div>

                      {/* الصف الثاني: السعر + المخزون */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            السعر (اختياري)
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={variant.price || ''}
                            onChange={(e) => updateVariant(index, 'price', cleanNumberValue(e.target.value))}
                            onBlur={(e) => updateVariant(index, 'price', cleanNumberValue(e.target.value))}
                            onKeyPress={allowOnlyNumbers}
                            onPaste={handleNumberPaste}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              getVariantError(index, 'price') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                          {getVariantError(index, 'price') && (
                            <p className="text-red-500 text-xs mt-1">{getVariantError(index, 'price')}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {isSingleDefaultVariant ? "اتركه فارغاً لاستخدام السعر الأساسي" : "سعر هذا المتغير"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            المخزون *
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={variant.stock || 0}
                            onChange={(e) => updateVariant(index, 'stock', parseInt(cleanIntegerValue(e.target.value)) || 0)}
                            onBlur={(e) => updateVariant(index, 'stock', parseInt(cleanIntegerValue(e.target.value)) || 0)}
                            onKeyPress={allowOnlyIntegers}
                            onPaste={handleIntegerPaste}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              getVariantError(index, 'stock') || (variant.stock || 0) <= 0 
                                ? 'border-red-500 bg-red-50' 
                                : 'border-gray-300'
                            }`}
                            placeholder="1"
                            required
                          />
                          {getVariantError(index, 'stock') && (
                            <p className="text-red-500 text-xs mt-1">{getVariantError(index, 'stock')}</p>
                          )}
                          {!getVariantError(index, 'stock') && (variant.stock || 0) <= 0 && (
                            <p className="text-red-500 text-xs mt-1">المخزون يجب أن يكون أكبر من صفر</p>
                          )}
                        </div>
                      </div>

                      {/* الصف الثالث: اختيار صورة المتغير */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          صورة المتغير {isSingleDefaultVariant ? "(اختيارية)" : ""}
                        </label>
                        
                        {hasUploadedImages ? (
                          <div>
                            <p className="text-xs text-gray-600 mb-2">اختر صورة من الصور المرفوعة:</p>
                            <div className="grid grid-cols-4 gap-2">
                              {formData.images.map((imageUrl: string, imgIndex: number) => (
                                <div
                                  key={imgIndex}
                                  onClick={() => selectImageForVariant(index, imageUrl)}
                                  className={`relative cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                                    variant.image === imageUrl
                                      ? 'border-green-500 ring-2 ring-green-300'
                                      : 'border-gray-300 hover:border-blue-400'
                                  }`}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Option ${imgIndex + 1}`}
                                    className="w-full h-16 object-cover"
                                  />
                                  {variant.image === imageUrl && (
                                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                      <div className="bg-green-500 rounded-full p-1">
                                        <Check className="h-4 w-4 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
                            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              لا توجد صور مرفوعة
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              انتقل إلى تاب "الصور" لرفع الصور أولاً
                            </p>
                          </div>
                        )}
                        
                        {isSingleDefaultVariant && (
                          <p className="text-xs text-gray-500 mt-2">
                            سيتم استخدام الصورة الرئيسية للمنتج إذا لم تختر صورة
                          </p>
                        )}
                      </div>
                    </div>

                    {/* العمود الأيسر: عرض الصورة المختارة */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      {variant.image ? (
                        <div className="w-full max-w-[160px]">
                          <p className="text-xs text-gray-600 mb-2 text-center">الصورة المختارة:</p>
                          <img
                            src={variant.image}
                            alt={`Variant ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-green-500 shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAzMkw0NCA0MEg1NlY1NkgyNFY0MEwyOCAzMkg0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgOCA4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjM2IiB5PSIyOCI+CjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxLjIiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full max-w-[160px]">
                          <p className="text-xs text-gray-600 mb-2 text-center">معاينة:</p>
                          <div className="h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">
                                {isSingleDefaultVariant ? "صورة اختيارية" : "اختر صورة"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* شريط الإجراءات */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm">
                      {isSingleDefaultVariant ? (
                        <span className="text-orange-600 font-medium flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          متغير افتراضي - لا يمكن حذفه
                        </span>
                      ) : (
                        <span className="text-gray-600">متغير اختياري - يمكن حذفه</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      disabled={isSingleDefaultVariant}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        isSingleDefaultVariant
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={isSingleDefaultVariant ? "لا يمكن حذف المتغير الافتراضي" : "حذف المتغير"}
                    >
                      <X className="h-4 w-4" />
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* رسالة تأكيد عند اكتمال الحقول */}
      {formData.price && 
       formData.base_price && 
       formData.variants && 
       formData.variants.length > 0 &&
       !getError('price') && 
       !getError('base_price') && 
       !getError('variants') &&
       formData.variants.every((v: any) => v.stock > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium">✓ تم استكمال الأسعار والمتغيرات بنجاح</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingVariants;