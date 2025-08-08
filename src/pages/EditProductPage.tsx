import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Save, CheckCircle, AlertCircle, X } from "lucide-react";

import {
  ValidationErrors,
  FormData,
  productsApi,
  ProductCreate,
} from "@/lib/api";

import ErrorNotification from "@/components/admin/EditProduct/ErrorNotifications";
import NavigationTabs from "@/components/admin/EditProduct/NavigationTabs";
import BasicInfo from "@/components/admin/EditProduct/BasicInfo";
import PricingVariants from "@/components/admin/EditProduct/PricingVariants";
import ProductImages from "@/components/admin/EditProduct/ProductImages";
import ProductDetails from "@/components/admin/EditProduct/ProductDetails";
import AdditionalContent from "@/components/admin/EditProduct/AdditionalContent";
import FAQ from "@/components/admin/EditProduct/FAQ";
import ProgressIndicator from "@/components/admin/EditProduct/ProgressIndicator";
import AIProductGenerator from "@/components/admin/EditProduct/CreateProduct";
import ProductVideo from "@/components/admin/EditProduct/ProductVideo";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

const Toast: React.FC<{
  toast: ToastMessage;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg min-w-80 max-w-md animate-in slide-in-from-right-full ${getToastStyles()}`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          <p className="text-sm mt-1">{toast.message}</p>
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
};

const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>();
  const location = useLocation();
  const passedProductData = location.state?.productData;
  const isEditing = location.state?.isEditing || false;

  const [productData, setProductData] = useState<any>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(
    !productId && !passedProductData
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "",
    category: "",
    categories: [],
    description: "",
    short_description: "",
    price: "",
    old_price: "",
    base_price: "",
    discount: "",
    usage_instructions: "",
    storage_instructions: "",
    brand: "",
    sku: "",
    images: [],
    details: {
      description: "",
      sections: [],
    },
    faq: [],
    variants: [],
    videoInfo: {
      videoUrl: "",
      thumbnail: "",
      title: "",
      description: "",
      descriptionTitle: "",
      overlayText: "",
    },
  });

  const [activeTab, setActiveTab] = useState<string>(
    !productId && !passedProductData ? "generate" : "basic"
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const addToast = useCallback(
    (type: ToastMessage["type"], title: string, message: string) => {
      const newToast: ToastMessage = {
        id: Date.now().toString(),
        type,
        title,
        message,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const loadProductData = async () => {
      if (passedProductData) {
        console.log("Using passed product data:", passedProductData);
        setProductData(passedProductData);
        setIsNewProduct(false);
        setActiveTab("basic");
        return;
      }

      if (productId && !passedProductData) {
        console.log("Fetching product from API with ID:", productId);
        setIsLoadingProduct(true);
        setIsNewProduct(false);
        setActiveTab("basic");
        try {
          const data = await productsApi.getProductById(productId);
          setProductData(data);
          addToast(
            "success",
            "تم التحميل بنجاح",
            "تم تحميل بيانات المنتج بنجاح"
          );
        } catch (error) {
          console.error("Error fetching product:", error);
          addToast(
            "error",
            "خطأ في التحميل",
            "حدث خطأ في تحميل بيانات المنتج. يرجى المحاولة مرة أخرى."
          );
        } finally {
          setIsLoadingProduct(false);
        }
      }
    };

    loadProductData();
  }, [productId, passedProductData, addToast]);

  useEffect(() => {
    if (productData) {
      console.log("Updating form data with product:", productData);
      setFormData({
        id: productData.id || "",
        title: productData.title || "",
        category: productData.category || "",
        categories: Array.isArray(productData.categories) ? productData.categories : [],
        description: productData.description || "",
        short_description: productData.short_description || "",
        price: productData.price || "",
        old_price: productData.old_price || "",
        base_price: productData.base_price || "",
        discount: productData.discount || "",
        usage_instructions: productData.usage_instructions || "",
        storage_instructions: productData.storage_instructions || "",
        brand: productData.brand || "",
        sku: productData.sku || "",
        images: Array.isArray(productData.images)
          ? productData.images
          : productData.image
          ? [productData.image]
          : [],
        details: productData.details || {
          description: "",
          sections: [],
        },
        faq: Array.isArray(productData.faq) ? productData.faq : [],
        variants: Array.isArray(productData.variants)
          ? productData.variants
          : [],
        videoInfo: productData.videoInfo || {
          videoUrl: "",
          thumbnail: "",
          title: "",
          description: "",
          descriptionTitle: "",
          overlayText: "",
        },
      });
    }
  }, [productData]);

  const handleProductGenerated = useCallback(
    (generatedProduct: any) => {
      console.log("Generated product:", generatedProduct);

      setFormData((prev) => ({
        ...prev,
        ...generatedProduct,
      }));

      setIsNewProduct(false);
      setProductData(generatedProduct);
      setActiveTab("basic");

      addToast(
        "success",
        "تم التوليد بنجاح",
        "تم توليد المنتج بالذكاء الاصطناعي بنجاح. يمكنك الآن مراجعة وتعديل البيانات."
      );

      console.log("Product generation completed - switching to basic tab");
    },
    [addToast]
  );

  const handleInputChange = useCallback(
    (field: string, value: string | number | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    },
    [errors]
  );

  const handleNestedChange = useCallback(
    (section: keyof FormData, field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value,
        },
      }));
    },
    []
  );

  const handleArrayChange = useCallback(
    (arrayName: keyof FormData, newArray: any[]) => {
      setFormData((prev) => ({
        ...prev,
        [arrayName]: newArray,
      }));
    },
    []
  );

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = "العنوان مطلوب";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "الفئة مطلوبة";
    }

    if (!formData.price?.trim()) {
      newErrors.price = "السعر مطلوب";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "السعر يجب أن يكون رقم صحيح أكبر من صفر";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "الوصف مطلوب";
    }

    if (!Array.isArray(formData.images) || formData.images.length === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      addToast(
        "error",
        "خطأ في البيانات",
        "يرجى تصحيح الأخطاء المطلوبة قبل الحفظ"
      );
      return false;
    }

    return true;
  };

  // In your EditProductPage component, update the handleSubmit function:

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  setIsSaving(true);

  try {
    if (isEditing && productId) {
      // تعديل المنتج الموجود
      console.log("Updating product with data:", formData);

      // تنظيف البيانات قبل الإرسال - تحويل القيم الفارغة إلى null
      const cleanedFormData = {
        ...formData,
        usage_instructions: formData.usage_instructions?.trim() || null,
        storage_instructions: formData.storage_instructions?.trim() || null,
        old_price: formData.old_price?.trim() || null,
        discount: formData.discount?.trim() || null,
        short_description: formData.short_description?.trim() || null,
        brand: formData.brand?.trim() || null,
        sku: formData.sku?.trim() || null,
        // Fix: Convert category objects to IDs for additional categories
        categories: formData.categories?.map((cat: any) => 
          typeof cat === 'string' ? cat : cat.id
        ) || [],
      };

      const updatedProduct = await productsApi.updateProduct(
        productId,
        cleanedFormData
      );

      setProductData(updatedProduct);

      addToast(
        "success",
        "تم تحديث المنتج بنجاح",
        "تم حفظ التعديلات على المنتج بنجاح."
      );
    } else {
      // إنشاء منتج جديد
      console.log("Creating new product with data:", formData);

      const productCreateData: ProductCreate = {
        id: formData.id,
        title: formData.title,
        image: formData.images[0] || "",
        images: formData.images,
        category: formData.category,
        description: formData.description,
        short_description: formData.short_description?.trim() || undefined,
        price: Number(formData.price),
        base_price: Number(formData.base_price),
        old_price: formData.old_price?.trim()
          ? Number(formData.old_price)
          : undefined,
        discount: formData.discount?.trim()
          ? Number(formData.discount)
          : undefined,
        usage_instructions: formData.usage_instructions?.trim() || undefined,
        storage_instructions:
          formData.storage_instructions?.trim() || undefined,
        details:
          formData.details.description || formData.details.sections.length > 0
            ? formData.details
            : undefined,
        faq: formData.faq.length > 0 ? formData.faq : undefined,
        variants:
          formData.variants.length > 0 ? formData.variants : undefined,
        // Fix: Send categories as array of strings (IDs only)
        categories: [
          formData.category, // Main category
          ...(formData.categories?.map((cat: any) => 
            typeof cat === 'string' ? cat : cat.id
          ) || []) // Additional categories as IDs
        ].filter(Boolean), // Remove any null/undefined values
      };

      const createdProduct = await productsApi.createProduct(
        productCreateData
      );

      console.log("✅ Product created successfully:", createdProduct);

      setProductData(createdProduct);

      addToast(
        "success",
        "تم إنشاء المنتج بنجاح",
        "تم حفظ المنتج في النظام بنجاح ويمكن للعملاء الآن رؤيته في المتجر."
      );
    }
  } catch (error: any) {
    console.error("❌ Error saving product:", error);

    let errorTitle = isEditing ? "خطأ في تحديث المنتج" : "خطأ في حفظ المنتج";
    let errorMessage = "حدث خطأ غير متوقع أثناء العملية";

    if (error.message) {
      if (error.message.includes("already exists")) {
        errorTitle = "معرف مكرر";
        errorMessage =
          "يوجد منتج بهذا المعرف مسبقاً. يرجى استخدام معرف مختلف (SKU).";
      } else if (error.message.includes("category")) {
        errorTitle = "فئة غير صحيحة";
        errorMessage =
          "الفئة المحددة غير موجودة. يرجى اختيار فئة صحيحة من القائمة.";
      } else if (error.message.includes("validation")) {
        errorTitle = "خطأ في التحقق";
        errorMessage =
          "يرجى التحقق من صحة جميع البيانات المدخلة والمحاولة مرة أخرى.";
      } else if (error.message.includes("network")) {
        errorTitle = "خطأ في الشبكة";
        errorMessage =
          "فشل في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.";
      } else {
        errorMessage = error.message;
      }
    }

    addToast("error", errorTitle, errorMessage);
  } finally {
    setIsSaving(false);
  }
};

  const renderTabContent = () => {
    const commonProps = {
      formData,
      onInputChange: handleInputChange,
      onNestedChange: handleNestedChange,
      onArrayChange: handleArrayChange,
      errors,
      isEditing,
    };

    switch (activeTab) {
      case "generate":
        return (
          <AIProductGenerator onProductGenerated={handleProductGenerated} />
        );
      case "basic":
        return <BasicInfo {...commonProps} />;
      case "pricing":
        return <PricingVariants {...commonProps} />;
      case "images":
        return <ProductImages {...commonProps} />;
      case "video":
        return <ProductVideo {...commonProps} />;
      case "details":
        return <ProductDetails {...commonProps} />;
      case "content":
        return <AdditionalContent {...commonProps} />;
      case "faq":
        return <FAQ {...commonProps} />;
      default:
        return <BasicInfo {...commonProps} />;
    }
  };

  const calculateProgress = (): number => {
    const requiredFields = ["title", "category", "price", "description"];
    const filledFields = requiredFields.filter(
      (field) =>
        formData[field as keyof FormData] &&
        String(formData[field as keyof FormData]).trim() !== ""
    );
    const hasImages =
      Array.isArray(formData.images) && formData.images.length > 0;

    return Math.round(
      ((filledFields.length + (hasImages ? 1 : 0)) /
        (requiredFields.length + 1)) *
        100
    );
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المنتج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "تعديل المنتج" : "إنشاء منتج جديد"}
              </h1>
              <ProgressIndicator progress={calculateProgress()} />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving || activeTab === "generate"}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving
                  ? isEditing
                    ? "جاري التحديث..."
                    : "جاري الإنشاء..."
                  : isEditing
                  ? "حفظ التعديلات"
                  : "حفظ المنتج"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <NavigationTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                progress={calculateProgress()}
                errors={errors}
                isNewProduct={isNewProduct}
                isEditing={isEditing}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>

      <ErrorNotification errors={errors} />
    </div>
  );
};

export default EditProductPage;