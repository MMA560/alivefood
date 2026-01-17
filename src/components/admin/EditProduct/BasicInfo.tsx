import React, { useState, useEffect } from "react";
import { X, Plus, AlertCircle } from "lucide-react";
import {
  validateProductId,
  validateTitle,
  validateCategory,
  validateCategories,
  validateDescription,
  validateShortDescription,
  allowOnlyAlphanumericDashUnderscore,
  preventDangerousCharacters,
  handleIdPaste,
  handleTextPaste,
  cleanIdValue,
  cleanTextValue,
} from "@/lib/productValidation";

const BasicInfo = ({
  formData,
  onInputChange,
  errors,
  categories = [],
  isEditing = false,
}) => {
  const [loadedCategories, setLoadedCategories] = useState(categories);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // حالات الـ validation المحلية (للتحقق الفوري)
  const [localErrors, setLocalErrors] = useState<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      if (loadedCategories.length === 0) {
        setIsLoadingCategories(true);
        try {
          const { categoriesApi } = await import("@/lib/api");
          const fetchedCategories = await categoriesApi.getCategories();
          setLoadedCategories(fetchedCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
          setLoadedCategories([
            { id: "smartphones", name: "هواتف" },
            { id: "clothing", name: "ملابس" },
            { id: "home", name: "منزل ومطبخ" },
            { id: "books", name: "كتب" },
            { id: "sports", name: "رياضة" },
          ]);
        } finally {
          setIsLoadingCategories(false);
        }
      }
    };

    fetchCategories();
  }, [loadedCategories.length]);

  // تحويل الفئات من IDs إلى objects كاملة
  useEffect(() => {
    if (formData.categories && loadedCategories.length > 0) {
      const currentCategories = formData.categories || [];
      let needsUpdate = false;

      const updatedCategories = currentCategories
        .map((cat) => {
          // إذا كان الـ category مجرد string أو ID
          if (typeof cat === "string" || (cat && !cat.name)) {
            const fullCategory = loadedCategories.find(
              (loaded) => loaded.id === cat || loaded.id === cat.id,
            );
            if (fullCategory) {
              needsUpdate = true;
              return fullCategory;
            }
          }
          return cat;
        })
        .filter((cat) => cat && cat.name); // فلترة الفئات غير المكتملة

      if (needsUpdate) {
        onInputChange("categories", updatedCategories);
      }
    }
  }, [formData.categories, loadedCategories]);

  /**
   * التحقق الفوري من معرف المنتج
   */
  const handleIdChange = (value: string) => {
    onInputChange("id", value);

    // التحقق الفوري
    if (!isEditing) {
      const error = validateProductId(value);
      setLocalErrors((prev) => ({ ...prev, id: error }));
    }
  };

  /**
   * التحقق الفوري من العنوان
   */
  const handleTitleChange = (value: string) => {
    onInputChange("title", value);

    // التحقق الفوري
    const error = validateTitle(value);
    setLocalErrors((prev) => ({ ...prev, title: error }));
  };

  /**
   * التحقق الفوري من الفئة الأساسية
   */
  const handleCategoryChange = (value: string) => {
    onInputChange("category", value);

    // التحقق الفوري
    const error = validateCategory(value);
    setLocalErrors((prev) => ({ ...prev, category: error }));

    // التحقق من الفئات الإضافية أيضاً
    const categoriesError = validateCategories(formData.categories, value);
    setLocalErrors((prev) => ({ ...prev, categories: categoriesError }));
  };

  /**
   * التحقق الفوري من الوصف
   */
  const handleDescriptionChange = (value: string) => {
    onInputChange("description", value);

    // التحقق الفوري
    const error = validateDescription(value);
    setLocalErrors((prev) => ({ ...prev, description: error }));
  };

  /**
   * التحقق الفوري من الوصف المختصر
   */
  const handleShortDescriptionChange = (value: string) => {
    onInputChange("short_description", value);

    // التحقق الفوري
    const error = validateShortDescription(value);
    setLocalErrors((prev) => ({ ...prev, short_description: error }));
  };

  /**
   * إضافة فئة جديدة
   */
  const addCategory = () => {
    if (!selectedCategory) return;

    const currentCategories = formData.categories || [];
    const categoryExists = currentCategories.some((cat) => {
      const catId = typeof cat === "string" ? cat : cat.id;
      return catId === selectedCategory;
    });

    if (categoryExists) {
      setLocalErrors((prev) => ({
        ...prev,
        categories: "هذه الفئة موجودة بالفعل",
      }));
      return;
    }

    // التحقق من عدم إضافة الفئة الأساسية
    if (selectedCategory === formData.category) {
      setLocalErrors((prev) => ({
        ...prev,
        categories: "الفئة الأساسية موجودة بالفعل - لا داعي لإضافتها مرة أخرى",
      }));
      return;
    }

    const categoryToAdd = loadedCategories.find(
      (cat) => cat.id === selectedCategory,
    );
    if (categoryToAdd) {
      const updatedCategories = [...currentCategories, categoryToAdd];
      onInputChange("categories", updatedCategories);

      // التحقق من الفئات بعد الإضافة
      const error = validateCategories(updatedCategories, formData.category);
      setLocalErrors((prev) => ({ ...prev, categories: error }));
    }

    setSelectedCategory("");
  };

  /**
   * إزالة فئة
   */
  const removeCategory = (categoryId: string) => {
    const currentCategories = formData.categories || [];
    const updatedCategories = currentCategories.filter((cat) => {
      const catId = typeof cat === "string" ? cat : cat.id;
      return catId !== categoryId;
    });
    onInputChange("categories", updatedCategories);

    // التحقق من الفئات بعد الحذف
    const error = validateCategories(updatedCategories, formData.category);
    setLocalErrors((prev) => ({ ...prev, categories: error }));
  };

  /**
   * الحصول على الفئات المتاحة للإضافة
   */
  const getAvailableCategories = () => {
    const currentCategories = formData.categories || [];
    const currentCategoryIds = currentCategories.map((cat) => {
      return typeof cat === "string" ? cat : cat.id;
    });

    // إضافة الفئة الأساسية إلى قائمة الفئات المستبعدة
    const excludedIds = [...currentCategoryIds];
    if (formData.category) {
      excludedIds.push(formData.category);
    }

    return loadedCategories.filter((cat) => !excludedIds.includes(cat.id));
  };

  /**
   * الحصول على اسم الفئة
   */
  const getCategoryName = (category: any) => {
    if (typeof category === "string") {
      const fullCategory = loadedCategories.find((cat) => cat.id === category);
      return fullCategory ? fullCategory.name : category;
    }
    return category.name || "فئة غير محددة";
  };

  const displayCategories = loadedCategories;
  const availableCategories = getAvailableCategories();

  // دمج الأخطاء المحلية مع الأخطاء الخارجية
  const getError = (field: string) => {
    return localErrors[field] || errors?.[field] || null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          المعلومات الأساسية
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          أدخل المعلومات الأساسية للمنتج
        </p>
      </div>

      {/* معرف المنتج - مخفي في وضع التعديل */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            معرف المنتج (ID) *
          </label>
          <input
            type="text"
            value={formData.id || ""}
            onChange={(e) => handleIdChange(cleanIdValue(e.target.value))}
            onBlur={(e) => handleIdChange(cleanIdValue(e.target.value))}
            onKeyPress={allowOnlyAlphanumericDashUnderscore}
            onPaste={handleIdPaste}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              getError("id") ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="مثال: product-123 أو smartphone-xyz"
          />
          {getError("id") && (
            <div className="flex items-start gap-2 mt-2 text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{getError("id")}</p>
            </div>
          )}
          <p className="text-gray-500 text-xs mt-1">
            معرف فريد للمنتج - يُسمح بالحروف والأرقام والشرطات (-) والشرطات
            السفلية (_) فقط
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
            value={formData.title || ""}
            onChange={(e) => handleTitleChange(cleanTextValue(e.target.value))}
            onBlur={(e) => handleTitleChange(cleanTextValue(e.target.value))}
            onKeyPress={preventDangerousCharacters}
            onPaste={handleTextPaste}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              getError("title") ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="أدخل عنوان المنتج (1-200 حرف)"
            maxLength={200}
          />
          {getError("title") && (
            <div className="flex items-start gap-2 mt-2 text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{getError("title")}</p>
            </div>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.title?.length || 0}/200 حرف
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفئة الأساسية *
          </label>
          <select
            value={formData.category || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            onBlur={(e) => handleCategoryChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              getError("category")
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
            disabled={isLoadingCategories}
          >
            <option value="">
              {isLoadingCategories ? "جاري التحميل..." : "اختر الفئة الأساسية"}
            </option>
            {displayCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {getError("category") && (
            <div className="flex items-start gap-2 mt-2 text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{getError("category")}</p>
            </div>
          )}
        </div>
      </div>

      {/* الفئات الإضافية */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الفئات الإضافية (اختياري)
        </label>

        {/* قائمة الفئات المحددة */}
        {formData.categories && formData.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => {
                const categoryId =
                  typeof category === "string" ? category : category.id;
                const categoryName = getCategoryName(category);

                return (
                  <span
                    key={categoryId || index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {categoryName}
                    <button
                      type="button"
                      onClick={() => removeCategory(categoryId)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 focus:outline-none focus:bg-blue-200 transition-colors"
                      title="إزالة الفئة"
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
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  // إزالة خطأ الفئات عند التغيير
                  setLocalErrors((prev) => ({ ...prev, categories: null }));
                }}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  getError("categories") ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isLoadingCategories}
              >
                <option value="">اختر فئة لإضافتها</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addCategory}
                disabled={!selectedCategory || isLoadingCategories}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                إضافة
              </button>
            </div>

            {getError("categories") && (
              <div className="flex items-start gap-2 text-red-600">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{getError("categories")}</p>
              </div>
            )}
          </div>
        )}

        {availableCategories.length === 0 &&
          !isLoadingCategories &&
          formData.category && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">
                ✓ تم اختيار جميع الفئات المتاحة
              </p>
            </div>
          )}

        <p className="text-gray-500 text-xs mt-2">
          يمكنك إضافة فئات إضافية لتصنيف المنتج في أكثر من مكان
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الماركة (اختياري)
          </label>
          <input
            type="text"
            value={formData.brand || ""}
            onChange={(e) => onInputChange("brand", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="مثال: Samsung, Apple, Nike"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم المنتج - SKU (اختياري)
          </label>
          <input
            type="text"
            value={formData.sku || ""}
            onChange={(e) => onInputChange("sku", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="مثال: SKU-12345"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف الكامل *
        </label>
        <textarea
          value={formData.description || ""}
          onChange={(e) =>
            handleDescriptionChange(cleanTextValue(e.target.value))
          }
          onBlur={(e) =>
            handleDescriptionChange(cleanTextValue(e.target.value))
          }
          onKeyPress={preventDangerousCharacters}
          onPaste={handleTextPaste}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            getError("description")
              ? "border-red-500 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="أدخل وصف تفصيلي للمنتج (10 أحرف على الأقل)"
        />
        {getError("description") && (
          <div className="flex items-start gap-2 mt-2 text-red-600">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{getError("description")}</p>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.description?.length || 0} حرف (الحد الأدنى: 10)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف المختصر (اختياري)
        </label>
        <textarea
          value={formData.short_description || ""}
          onChange={(e) =>
            handleShortDescriptionChange(cleanTextValue(e.target.value))
          }
          onBlur={(e) =>
            handleShortDescriptionChange(cleanTextValue(e.target.value))
          }
          onKeyPress={preventDangerousCharacters}
          onPaste={handleTextPaste}
          rows={2}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            getError("short_description")
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="وصف مختصر للمنتج (5-300 حرف)"
          maxLength={300}
        />
        {getError("short_description") && (
          <div className="flex items-start gap-2 mt-2 text-red-600">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{getError("short_description")}</p>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.short_description?.length || 0}/300 حرف
        </p>
      </div>

      {/* رسالة تأكيد عند اكتمال الحقول */}
      {formData.title &&
        formData.category &&
        formData.description &&
        !getError("title") &&
        !getError("category") &&
        !getError("description") && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">
                ✓ تم استكمال المعلومات الأساسية بنجاح
              </span>
            </div>
          </div>
        )}
    </div>
  );
};

export default BasicInfo;
