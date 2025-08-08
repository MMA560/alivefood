import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { productGeneratorApi, ProductGeneratorRequest } from "@/lib/api";

interface AIProductGeneratorProps {
  onProductGenerated: (productData: any) => void;
}

const AIProductGenerator: React.FC<AIProductGeneratorProps> = ({
  onProductGenerated,
}) => {
  const [productInfo, setProductInfo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // دالة تنظيف النص من الرموز الخطيرة
  const sanitizeInput = (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    return input
      // إزالة الرموز الخطيرة للـ JSON
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
      .replace(/["\\\n\r\t\b\f]/g, (match) => {
        // استبدال الرموز الخاصة بـ spaces أو إزالتها
        switch (match) {
          case '"': return "'"; // استبدال بعلامة اقتباس عادية
          case '\\': return '/'; // استبدال بـ forward slash
          case '\n': return ' '; // استبدال بـ space
          case '\r': return ' '; // استبدال بـ space
          case '\t': return ' '; // استبدال بـ space
          case '\b': return ' '; // استبدال بـ space
          case '\f': return ' '; // استبدال بـ space
          default: return '';
        }
      })
      // إزالة الرموز الخطيرة الأخرى
      .replace(/[{}[\]]/g, '') // إزالة الأقواس المتعددة
      .replace(/[`~!@#$%^&*()_+=|;:<>?]/g, '') // إزالة الرموز الخاصة
      // إزالة المسافات الزائدة
      .replace(/\s+/g, ' ')
      .trim()
      // قطع النص إذا كان طويل جداً (حماية إضافية)
      .substring(0, 30000);
  };

  // دالة التحقق من صحة النص
  const validateInput = (input: string): { isValid: boolean; message?: string } => {
    if (!input || !input.trim()) {
      return { isValid: false, message: "يرجى إدخال معلومات المنتج" };
    }

    if (input.length < 10) {
      return { isValid: false, message: "يرجى إدخال معلومات أكثر تفصيلاً (على الأقل 10 أحرف)" };
    }

    if (input.length > 30000) {
      return { isValid: false, message: "النص طويل جداً، يرجى تقليل الحروف إلى أقل من 30000 حرف" };
    }

    // التحقق من وجود محتوى مفيد (ليس مجرد رموز)
    const meaningfulContent = input.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '');
    if (meaningfulContent.length < 5) {
      return { isValid: false, message: "يرجى إدخال معلومات نصية مفيدة عن المنتج" };
    }

    return { isValid: true };
  };

  const handleGenerate = async () => {
    // تنظيف النص أولاً
    const sanitizedInput = sanitizeInput(productInfo);
    
    // التحقق من صحة النص
    const validation = validateInput(sanitizedInput);
    if (!validation.isValid) {
      setError(validation.message || "يرجى إدخال معلومات صحيحة");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const requestData: ProductGeneratorRequest = {
        product_info: sanitizedInput, // استخدام النص المنظف
        output_language: "arabic",
        timeout: 120,
      };

      console.log("🤖 بدء توليد المنتج...");
      console.log("📝 النص المنظف:", sanitizedInput);

      const response = await productGeneratorApi.generateProduct(requestData);

      if (response.success && response.product_json) {
        const productData = response.product_json;

        const generatedProduct = {
          id: productData.id,
          title: productData.title || "",
          category: productData.category || "",
          description: productData.description || "",
          short_description: productData.short_description || "",
          price: productData.price?.toString() || "",
          old_price: productData.old_price?.toString() || "",
          discount: productData.discount?.toString() || "",
          base_price: productData.base_price || productData.price || 0,
          usage_instructions: productData.usage_instructions || "",
          storage_instructions: productData.storage_instructions || "",
          brand: productData.brand || "",
          sku: productData.sku || "",
          images: Array.isArray(productData.images) ? productData.images : [],
          details: productData.details || {
            description: "",
            sections: [],
          },
          faq: Array.isArray(productData.faq) ? productData.faq : [],
          variants: Array.isArray(productData.variants)
            ? productData.variants
            : [],
        };

        console.log("✅ تم توليد المنتج بنجاح");
        onProductGenerated(generatedProduct);
        setProductInfo("");
      } else {
        throw new Error(response.message || "فشل في توليد المنتج");
      }
    } catch (err: any) {
      console.error("❌ خطأ في توليد المنتج:", err);

      let errorMessage = "حدث خطأ في توليد المنتج";

      // Better error handling for the API response
      if (err.message) {
        if (typeof err.message === "string") {
          if (
            err.message.includes("timeout") ||
            err.message.includes("network")
          ) {
            errorMessage = "انتهت مهلة الاتصال - يرجى المحاولة مرة أخرى";
          } else if (err.message.includes("Failed to generate product")) {
            errorMessage =
              "فشل في توليد المنتج - تأكد من صحة المعلومات المدخلة";
          } else if (err.message.includes("JSON") || err.message.includes("parse")) {
            errorMessage = "خطأ في معالجة البيانات - يرجى تبسيط النص والمحاولة مرة أخرى";
          } else {
            errorMessage = err.message;
          }
        } else {
          errorMessage = "خطأ في معاملات الطلب - يرجى المحاولة مرة أخرى";
        }
      }

      // If the error contains detail about validation, show a more specific message
      if (
        err.response?.data?.detail ||
        (typeof err === "object" && err.detail)
      ) {
        errorMessage = "خطأ في معاملات الطلب - يرجى التحقق من البيانات المدخلة";
      }

      // Handle server-side JSON generation errors
      if (err.message && err.message.includes("فشل في توليد JSON المنتج")) {
        errorMessage =
          "فشل في توليد المنتج - يرجى تبسيط المعلومات والمحاولة مرة أخرى";
      }

      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          🤖 مولد المنتجات الذكي
        </h2>
        <p className="text-gray-600">
          ادخل معلومات المنتج وسنقوم بإنشاء منتج كامل بالذكاء الاصطناعي
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          معلومات المنتج
        </label>
        <textarea
          value={productInfo}
          onChange={(e) => setProductInfo(e.target.value)}
          placeholder="مثال: Xiaomi Redmi Note 13 Pro 4G Dual Sim Smartphone with 8GB RAM, 256GB Storage, 6.67-inch AMOLED Display, 108MP Camera, 5000mAh Battery - Blue Color"
          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isGenerating}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            * يمكنك الكتابة بالعربية أو الإنجليزية - سيتم توليد المنتج باللغة العربية
          </p>
          <p className="text-xs text-gray-400">
            {productInfo.length}/30000 حرف
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !productInfo.trim()}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            جاري التوليد بالذكاء الاصطناعي...
          </>
        ) : (
          <>
            <Sparkles className="h-6 w-6" />
            توليد المنتج بالذكاء الاصطناعي
          </>
        )}
      </button>

      {/* نصائح محدثة */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-3">
          💡 نصائح للحصول على أفضل النتائج:
        </h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• اكتب اسم المنتج والماركة والمواصفات التقنية بالتفصيل</li>
          <li>• أضف السعر والألوان المتاحة والأحجام إن وجدت</li>
          <li>• اذكر المميزات الخاصة أو التقنيات المستخدمة</li>
          <li>• أضف معلومات عن الضمان أو الخدمات المرفقة</li>
          <li>• تجنب الرموز الخاصة الزائدة (سيتم تنظيفها تلقائياً)</li>
          <li>• كلما زادت التفاصيل، كانت النتيجة أكثر دقة وشمولية</li>
        </ul>
      </div>

      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-semibold text-green-900 mb-3">
          ✨ ما سيتم توليده تلقائياً:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-green-700 text-sm">
          <div>• العنوان المحسن للمنتج</div>
          <div>• الوصف التفصيلي</div>
          <div>• الوصف المختصر</div>
          <div>• الفئة المناسبة</div>
          <div>• التفاصيل التقنية</div>
          <div>• تعليمات الاستخدام</div>
          <div>• تعليمات التخزين</div>
          <div>• الأسئلة الشائعة</div>
        </div>
      </div>

      {/* تحذير أمني */}
      <div className="bg-amber-50 rounded-xl p-4">
        <h3 className="font-semibold text-amber-900 mb-2">
          🛡️ حماية تلقائية:
        </h3>
        <p className="text-amber-700 text-sm">
          يتم تنظيف النص تلقائياً من الرموز الخطيرة لضمان سلامة المعالجة
        </p>
      </div>
    </div>
  );
};

export default AIProductGenerator;