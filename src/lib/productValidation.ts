// src/lib/productValidation.ts

/**
 * Product Validation Library - Enhanced Version
 * مكتبة التحقق الشاملة مع منع الأحرف غير المسموحة
 */

export interface ValidationErrors {
  [key: string]: string | null;
}

export interface FormData {
  id: string;
  title: string;
  category: string;
  categories: any[];
  description: string;
  short_description: string;
  price: string;
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
    price?: string;
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

// ============================================================================
// INPUT FILTERS - منع الكتابة المباشرة للأحرف الممنوعة
// ============================================================================

/**
 * منع كل شيء ما عدا: حروف، أرقام، شرطات، شرطات سفلية
 * للاستخدام في: Product ID, Variant ID, SKU
 */
export const allowOnlyAlphanumericDashUnderscore = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const char = e.key;
  const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
  
  if (controlKeys.includes(char)) {
    return;
  }
  
  if (!/^[a-zA-Z0-9_-]$/.test(char)) {
    e.preventDefault();
  }
};

/**
 * منع كل شيء ما عدا: أرقام ونقطة واحدة
 * للاستخدام في: Price, Base Price, Old Price
 */
export const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const char = e.key;
  const input = e.currentTarget;
  const currentValue = input.value;
  const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
  
  if (controlKeys.includes(char)) {
    return;
  }
  
  if (!/^[0-9.]$/.test(char)) {
    e.preventDefault();
    return;
  }
  
  if (char === '.' && (currentValue.includes('.') || currentValue.length === 0)) {
    e.preventDefault();
  }
};

/**
 * منع كل شيء ما عدا: أرقام صحيحة فقط
 * للاستخدام في: Stock
 */
export const allowOnlyIntegers = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const char = e.key;
  const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
  
  if (controlKeys.includes(char)) {
    return;
  }
  
  if (!/^[0-9]$/.test(char)) {
    e.preventDefault();
  }
};

/**
 * منع الرموز الخطيرة في النصوص
 * للاستخدام في: Title, Description, Brand
 */
export const preventDangerousCharacters = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const char = e.key;
  const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'Enter'];
  
  if (controlKeys.includes(char)) {
    return;
  }
  
  if (/[<>{}[\]\\|`"]/.test(char)) {
    e.preventDefault();
  }
};

/**
 * منع اللصق - دالة عامة
 */
export const sanitizePaste = (
  e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  allowedPattern: RegExp
) => {
  e.preventDefault();
  const pastedText = e.clipboardData.getData('text');
  const cleaned = pastedText.split('').filter(char => allowedPattern.test(char)).join('');
  
  const input = e.currentTarget;
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  const currentValue = input.value;
  const newValue = currentValue.substring(0, start) + cleaned + currentValue.substring(end);
  
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    input instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
    'value'
  )?.set;
  
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, newValue);
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    
    const newCursorPosition = start + cleaned.length;
    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }
};

/**
 * منع اللصق في حقول الـ ID
 */
export const handleIdPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  sanitizePaste(e, /[a-zA-Z0-9_-]/);
};

/**
 * منع اللصق في حقول الأرقام
 */
export const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const pastedText = e.clipboardData.getData('text');
  let cleaned = pastedText.replace(/[^0-9.]/g, '');
  
  const input = e.currentTarget;
  if (input.value.includes('.')) {
    cleaned = cleaned.replace(/\./g, '');
  } else {
    const firstDotIndex = cleaned.indexOf('.');
    if (firstDotIndex !== -1) {
      cleaned = cleaned.substring(0, firstDotIndex + 1) + cleaned.substring(firstDotIndex + 1).replace(/\./g, '');
    }
  }
  
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  const currentValue = input.value;
  const newValue = currentValue.substring(0, start) + cleaned + currentValue.substring(end);
  
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, newValue);
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    
    const newCursorPosition = start + cleaned.length;
    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }
};

/**
 * منع اللصق في حقول الأرقام الصحيحة
 */
export const handleIntegerPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  sanitizePaste(e, /[0-9]/);
};

/**
 * منع اللصق في النصوص
 */
export const handleTextPaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  sanitizePaste(e, /[\u0600-\u06FFa-zA-Z0-9\s\-.,!?()&+:؛،]/);
};

/**
 * تنظيف قيمة ID
 */
export const cleanIdValue = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9_-]/g, '');
};

/**
 * تنظيف قيمة الأرقام
 */
export const cleanNumberValue = (value: string): string => {
  let cleaned = value.replace(/[^0-9.]/g, '');
  const firstDotIndex = cleaned.indexOf('.');
  if (firstDotIndex !== -1) {
    cleaned = cleaned.substring(0, firstDotIndex + 1) + cleaned.substring(firstDotIndex + 1).replace(/\./g, '');
  }
  return cleaned;
};

/**
 * تنظيف قيمة الأرقام الصحيحة
 */
export const cleanIntegerValue = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * تنظيف النصوص من الرموز الخطيرة
 */
export const cleanTextValue = (value: string): string => {
  return value.replace(/[<>{}[\]\\|`"]/g, '');
};

// ============================================================================
// VALIDATION FUNCTIONS - التحقق من صحة البيانات
// ============================================================================

/**
 * التحقق من معرف المنتج
 */
export const validateProductId = (id: string): string | null => {
  const cleaned = cleanIdValue(id);
  
  if (!cleaned || !cleaned.trim()) {
    return "معرف المنتج مطلوب";
  }

  if (cleaned.length < 1 || cleaned.length > 100) {
    return "معرف المنتج يجب أن يكون بين 1-100 حرف";
  }

  return null;
};

/**
 * التحقق من العنوان
 */
export const validateTitle = (title: string): string | null => {
  const cleaned = cleanTextValue(title);
  
  if (!cleaned || !cleaned.trim()) {
    return "عنوان المنتج مطلوب";
  }

  if (cleaned.trim().length < 1 || cleaned.trim().length > 200) {
    return "عنوان المنتج يجب أن يكون بين 1-200 حرف";
  }

  return null;
};

/**
 * التحقق من الفئة
 */
export const validateCategory = (category: string): string | null => {
  if (!category || !category.trim()) {
    return "الفئة الأساسية مطلوبة";
  }

  if (category.trim().length < 1 || category.trim().length > 100) {
    return "الفئة يجب أن تكون بين 1-100 حرف";
  }

  return null;
};

/**
 * التحقق من الفئات الإضافية
 */
export const validateCategories = (
  categories: any[],
  mainCategory: string
): string | null => {
  if (!categories || !Array.isArray(categories)) {
    return null;
  }

  const invalidCategories = categories.filter(cat => {
    if (typeof cat === 'string') {
      return !cat.trim();
    } else if (typeof cat === 'object' && cat !== null) {
      return !cat.id || !cat.id.trim();
    }
    return true;
  });

  if (invalidCategories.length > 0) {
    return "توجد فئات غير صحيحة - يجب أن تكون معرفات نصية صالحة";
  }

  const categoryIds = categories.map(cat => 
    typeof cat === 'string' ? cat : cat.id
  );

  if (mainCategory && categoryIds.includes(mainCategory)) {
    return "الفئة الأساسية موجودة بالفعل - لا داعي لإضافتها في الفئات الإضافية";
  }

  return null;
};

/**
 * التحقق من الوصف
 */
export const validateDescription = (description: string): string | null => {
  const cleaned = cleanTextValue(description);
  
  if (!cleaned || !cleaned.trim()) {
    return "الوصف الكامل مطلوب";
  }

  if (cleaned.trim().length < 10) {
    return "الوصف يجب أن يكون 10 أحرف على الأقل";
  }

  return null;
};

/**
 * التحقق من الوصف المختصر
 */
export const validateShortDescription = (shortDescription: string): string | null => {
  if (!shortDescription || !shortDescription.trim()) {
    return null;
  }

  const cleaned = cleanTextValue(shortDescription);

  if (cleaned.trim().length < 5) {
    return "الوصف المختصر يجب أن يكون 5 أحرف على الأقل";
  }

  if (cleaned.trim().length > 300) {
    return "الوصف المختصر يجب ألا يتجاوز 300 حرف";
  }

  return null;
};

/**
 * التحقق من السعر
 */
export const validatePrice = (price: string): string | null => {
  const cleaned = cleanNumberValue(price);
  
  if (!cleaned || !cleaned.trim()) {
    return "السعر الحالي مطلوب";
  }

  const priceNum = parseFloat(cleaned);
  
  if (isNaN(priceNum)) {
    return "السعر يجب أن يكون رقماً صحيحاً";
  }

  if (priceNum <= 0) {
    return "السعر يجب أن يكون أكبر من صفر";
  }

  if (priceNum > 1000000) {
    return "السعر كبير جداً (الحد الأقصى: 1,000,000)";
  }

  return null;
};

/**
 * التحقق من السعر الأساسي
 */
export const validateBasePrice = (
  basePrice: string,
  price: string
): string | null => {
  const cleanedBase = cleanNumberValue(basePrice);
  
  if (!cleanedBase || !cleanedBase.trim()) {
    return "السعر الأساسي مطلوب";
  }

  const basePriceNum = parseFloat(cleanedBase);
  const priceNum = parseFloat(cleanNumberValue(price));

  if (isNaN(basePriceNum)) {
    return "السعر الأساسي يجب أن يكون رقماً صحيحاً";
  }

  if (basePriceNum <= 0) {
    return "السعر الأساسي يجب أن يكون أكبر من صفر";
  }

  if (!isNaN(priceNum) && basePriceNum > priceNum) {
    return "السعر الأساسي لا يمكن أن يكون أكبر من سعر البيع";
  }

  return null;
};

/**
 * التحقق من السعر القديم
 */
export const validateOldPrice = (
  oldPrice: string,
  price: string
): string | null => {
  if (!oldPrice || !oldPrice.trim()) {
    return null;
  }

  const oldPriceNum = parseFloat(cleanNumberValue(oldPrice));
  const priceNum = parseFloat(cleanNumberValue(price));

  if (isNaN(oldPriceNum)) {
    return "السعر القديم يجب أن يكون رقماً صحيحاً";
  }

  if (oldPriceNum <= 0) {
    return "السعر القديم يجب أن يكون أكبر من صفر";
  }

  if (!isNaN(priceNum) && oldPriceNum <= priceNum) {
    return "السعر القديم يجب أن يكون أكبر من السعر الحالي";
  }

  return null;
};

/**
 * التحقق من نسبة الخصم
 */
export const validateDiscount = (
  discount: string,
  oldPrice: string,
  price: string
): string | null => {
  if (!discount || !discount.trim()) {
    return null;
  }

  const discountNum = parseFloat(cleanNumberValue(discount));

  if (isNaN(discountNum)) {
    return "نسبة الخصم يجب أن تكون رقماً صحيحاً";
  }

  if (discountNum < 0 || discountNum > 100) {
    return "نسبة الخصم يجب أن تكون بين 0 و 100";
  }

  const oldPriceNum = parseFloat(cleanNumberValue(oldPrice));
  const priceNum = parseFloat(cleanNumberValue(price));

  if (!isNaN(oldPriceNum) && !isNaN(priceNum) && oldPriceNum > priceNum) {
    const expectedDiscount = ((oldPriceNum - priceNum) / oldPriceNum) * 100;
    const difference = Math.abs(expectedDiscount - discountNum);

    if (difference > 1) {
      return `نسبة الخصم لا تتطابق مع الفرق بين السعرين (المتوقع: ${Math.round(expectedDiscount)}%)`;
    }
  }

  return null;
};

/**
 * التحقق من الصور
 */
export const validateImages = (images: string[]): string | null => {
  if (!images || !Array.isArray(images)) {
    return "الصور يجب أن تكون قائمة";
  }

  if (images.length === 0) {
    return "يجب إضافة صورة واحدة على الأقل";
  }

  const emptyImages = images.filter(img => !img || !img.trim());
  
  if (emptyImages.length > 0) {
    return "توجد روابط صور فارغة - يرجى حذفها أو إضافة روابط صحيحة";
  }

  return null;
};

/**
 * التحقق من المتغيرات
 */
export const validateVariants = (variants: any[]): string | null => {
  if (!variants || !Array.isArray(variants)) {
    return "المتغيرات يجب أن تكون قائمة";
  }

  if (variants.length === 0) {
    return "يجب إضافة متغير واحد على الأقل";
  }

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];

    if (!variant.id || !variant.id.trim()) {
      return `المتغير ${i + 1}: معرف المتغير مطلوب`;
    }

    if (!variant.color || !variant.color.trim()) {
      return `المتغير ${i + 1}: اللون/النوع مطلوب`;
    }

    const stock = parseInt(variant.stock);
    if (isNaN(stock) || stock < 0) {
      return `المتغير ${i + 1}: المخزون يجب أن يكون رقماً غير سالب`;
    }

    if (stock === 0) {
      return `المتغير ${i + 1}: المخزون يجب أن يكون أكبر من صفر`;
    }

    if (variant.price && variant.price.trim()) {
      const variantPrice = parseFloat(cleanNumberValue(variant.price));
      if (isNaN(variantPrice) || variantPrice <= 0) {
        return `المتغير ${i + 1}: السعر يجب أن يكون رقماً أكبر من صفر`;
      }
    }
  }

  return null;
};

/**
 * التحقق من أقسام التفاصيل
 */
export const validateDetailsSections = (sections: any[]): string | null => {
  if (!sections || !Array.isArray(sections)) {
    return null;
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (!section.title || !section.title.trim()) {
      return `القسم ${i + 1}: عنوان القسم مطلوب`;
    }

    if (section.title.trim().length > 200) {
      return `القسم ${i + 1}: عنوان القسم يجب ألا يتجاوز 200 حرف`;
    }

    if (!section.items || !Array.isArray(section.items) || section.items.length === 0) {
      return `القسم ${i + 1}: يجب إضافة عنصر واحد على الأقل`;
    }

    const emptyItems = section.items.filter((item: string) => !item || !item.trim());
    if (emptyItems.length > 0) {
      return `القسم ${i + 1}: توجد عناصر فارغة - يرجى حذفها أو ملؤها`;
    }
  }

  return null;
};

/**
 * التحقق من الأسئلة الشائعة
 */
export const validateFAQ = (faq: any[]): string | null => {
  if (!faq || !Array.isArray(faq)) {
    return null;
  }

  for (let i = 0; i < faq.length; i++) {
    const item = faq[i];

    if (!item.question || !item.question.trim()) {
      return `السؤال ${i + 1}: نص السؤال مطلوب`;
    }

    if (item.question.trim().length < 5) {
      return `السؤال ${i + 1}: السؤال يجب أن يكون 5 أحرف على الأقل`;
    }

    if (item.question.trim().length > 500) {
      return `السؤال ${i + 1}: السؤال يجب ألا يتجاوز 500 حرف`;
    }

    if (!item.answer || !item.answer.trim()) {
      return `السؤال ${i + 1}: الإجابة مطلوبة`;
    }

    if (item.answer.trim().length < 10) {
      return `السؤال ${i + 1}: الإجابة يجب أن تكون 10 أحرف على الأقل`;
    }
  }

  return null;
};

/**
 * الدالة الرئيسية للتحقق الشامل
 */
export const validateProductForm = (
  formData: FormData,
  isEditing: boolean = false
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!isEditing) {
    const idError = validateProductId(formData.id);
    if (idError) errors.id = idError;
  }

  const titleError = validateTitle(formData.title);
  if (titleError) errors.title = titleError;

  const categoryError = validateCategory(formData.category);
  if (categoryError) errors.category = categoryError;

  const categoriesError = validateCategories(formData.categories, formData.category);
  if (categoriesError) errors.categories = categoriesError;

  const descriptionError = validateDescription(formData.description);
  if (descriptionError) errors.description = descriptionError;

  const shortDescError = validateShortDescription(formData.short_description);
  if (shortDescError) errors.short_description = shortDescError;

  const priceError = validatePrice(formData.price);
  if (priceError) errors.price = priceError;

  const basePriceError = validateBasePrice(formData.base_price, formData.price);
  if (basePriceError) errors.base_price = basePriceError;

  const oldPriceError = validateOldPrice(formData.old_price, formData.price);
  if (oldPriceError) errors.old_price = oldPriceError;

  const discountError = validateDiscount(
    formData.discount,
    formData.old_price,
    formData.price
  );
  if (discountError) errors.discount = discountError;

  const imagesError = validateImages(formData.images);
  if (imagesError) errors.images = imagesError;

  const variantsError = validateVariants(formData.variants);
  if (variantsError) errors.variants = variantsError;

  if (formData.details && formData.details.sections) {
    const detailsError = validateDetailsSections(formData.details.sections);
    if (detailsError) errors['details.sections'] = detailsError;
  }

  if (formData.faq && formData.faq.length > 0) {
    const faqError = validateFAQ(formData.faq);
    if (faqError) errors.faq = faqError;
  }

  return errors;
};

/**
 * تنظيف بيانات الفئات
 */
export const cleanCategoriesData = (categories: any[]): string[] => {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }

  return categories
    .map(cat => {
      if (typeof cat === 'string') {
        return cat.trim();
      } else if (typeof cat === 'object' && cat !== null && cat.id) {
        return cat.id.trim();
      }
      return null;
    })
    .filter(Boolean) as string[];
};