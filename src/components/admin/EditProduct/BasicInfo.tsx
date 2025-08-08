import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const BasicInfo = ({ formData, onInputChange, errors, categories = [], isEditing = false }) => {
  const [loadedCategories, setLoadedCategories] = useState(categories);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      if (loadedCategories.length === 0) {
        setIsLoadingCategories(true);
        try {
          const { categoriesApi } = await import('@/lib/api');
          const fetchedCategories = await categoriesApi.getCategories();
          setLoadedCategories(fetchedCategories);
        } catch (error) {
          console.error('Error fetching categories:', error);
          setLoadedCategories([
            { id: 'smartphones', name: 'هواتف' },
            { id: 'clothing', name: 'ملابس' },
            { id: 'home', name: 'منزل ومطبخ' },
            { id: 'books', name: 'كتب' },
            { id: 'sports', name: 'رياضة' }
          ]);
        } finally {
          setIsLoadingCategories(false);
        }
      }
    };

    fetchCategories();
  }, [loadedCategories.length]);

  // إضافة useEffect لتحويل الفئات من IDs إلى objects كاملة
  useEffect(() => {
    if (formData.categories && loadedCategories.length > 0) {
      const currentCategories = formData.categories || [];
      let needsUpdate = false;
      
      const updatedCategories = currentCategories.map(cat => {
        // إذا كان الـ category مجرد string أو ID
        if (typeof cat === 'string' || (cat && !cat.name)) {
          const fullCategory = loadedCategories.find(loaded => loaded.id === cat || loaded.id === cat.id);
          if (fullCategory) {
            needsUpdate = true;
            return fullCategory;
          }
        }
        return cat;
      }).filter(cat => cat && cat.name); // فلترة الفئات غير المكتملة

      if (needsUpdate) {
        onInputChange('categories', updatedCategories);
      }
    }
  }, [formData.categories, loadedCategories, onInputChange]);

  // إضافة فئة جديدة
  const addCategory = () => {
    if (!selectedCategory) return;
    
    const currentCategories = formData.categories || [];
    const categoryExists = currentCategories.some(cat => {
      // التحقق من الـ ID سواء كان object أو string
      const catId = typeof cat === 'string' ? cat : cat.id;
      return catId === selectedCategory;
    });
    
    if (!categoryExists) {
      const categoryToAdd = loadedCategories.find(cat => cat.id === selectedCategory);
      if (categoryToAdd) {
        const updatedCategories = [...currentCategories, categoryToAdd];
        onInputChange('categories', updatedCategories);
      }
    }
    
    setSelectedCategory('');
  };

  // إزالة فئة
  const removeCategory = (categoryId) => {
    const currentCategories = formData.categories || [];
    const updatedCategories = currentCategories.filter(cat => {
      const catId = typeof cat === 'string' ? cat : cat.id;
      return catId !== categoryId;
    });
    onInputChange('categories', updatedCategories);
  };

  // الحصول على الفئات المتاحة للإضافة
  const getAvailableCategories = () => {
    const currentCategories = formData.categories || [];
    const currentCategoryIds = currentCategories.map(cat => {
      return typeof cat === 'string' ? cat : cat.id;
    });
    
    // إضافة الفئة الأساسية إلى قائمة الفئات المستبعدة
    const excludedIds = [...currentCategoryIds];
    if (formData.category) {
      excludedIds.push(formData.category);
    }
    
    return loadedCategories.filter(cat => !excludedIds.includes(cat.id));
  };

  // دالة للحصول على اسم الفئة
  const getCategoryName = (category) => {
    if (typeof category === 'string') {
      // إذا كان مجرد ID، البحث عن الاسم
      const fullCategory = loadedCategories.find(cat => cat.id === category);
      return fullCategory ? fullCategory.name : category;
    }
    return category.name || 'فئة غير محددة';
  };

  const displayCategories = loadedCategories;
  const availableCategories = getAvailableCategories();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">المعلومات الأساسية</h2>
        <p className="text-gray-600 text-sm mt-1">أدخل المعلومات الأساسية للمنتج</p>
      </div>

      {/* معرف المنتج - مخفي في وضع التعديل */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            معرف المنتج (ID) *
          </label>
          <input
            type="text"
            value={formData.id || ''}
            onChange={(e) => onInputChange('id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.id ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="أدخل معرف المنتج"
          />
          {errors?.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
          <p className="text-gray-500 text-xs mt-1">
            معرف فريد للمنتج - يجب أن يكون مختلف عن جميع المنتجات الأخرى
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان المنتج *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="أدخل عنوان المنتج"
          />
          {errors?.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفئة الأساسية *
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => onInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors?.category ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoadingCategories}
          >
            <option value="">{isLoadingCategories ? 'جاري التحميل...' : 'اختر الفئة الأساسية'}</option>
            {displayCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors?.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      {/* إضافة فئات إضافية */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الفئات الإضافية
        </label>
        
        {/* قائمة الفئات المحددة */}
        {formData.categories && formData.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => {
                const categoryId = typeof category === 'string' ? category : category.id;
                const categoryName = getCategoryName(category);
                
                return (
                  <span
                    key={categoryId || index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {categoryName}
                    <button
                      type="button"
                      onClick={() => removeCategory(categoryId)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 focus:outline-none focus:bg-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* إضافة فئة جديدة */}
        {availableCategories.length > 0 && (
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoadingCategories}
            >
              <option value="">اختر فئة لإضافتها</option>
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={addCategory}
              disabled={!selectedCategory || isLoadingCategories}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة
            </button>
          </div>
        )}
        
        {availableCategories.length === 0 && !isLoadingCategories && (
          <p className="text-gray-500 text-sm">تم اختيار جميع الفئات المتاحة</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الماركة
          </label>
          <input
            type="text"
            value={formData.brand || ''}
            onChange={(e) => {
              onInputChange('brand', e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل اسم الماركة"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم المنتج (SKU)
          </label>
          <input
            type="text"
            value={formData.sku || ''}
            onChange={(e) => {
              onInputChange('sku', e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل رقم المنتج"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف الكامل *
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors?.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="أدخل وصف تفصيلي للمنتج"
        />
        {errors?.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف المختصر
        </label>
        <textarea
          value={formData.short_description || ''}
          onChange={(e) => onInputChange('short_description', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="وصف مختصر للمنتج"
        />
      </div>
    </div>
  );
};

export default BasicInfo;