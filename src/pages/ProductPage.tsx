import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrencySettings } from "@/hooks/useCurrencySettings";
import { Button } from "@/components/ui/button";
import { UserReviews } from "@/components/UserReviews";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductInstructions from "@/components/ProductInstructions";
import ProductFAQ from "@/components/ProductFAQ";
import RelatedProducts from "@/components/RelatedProducts";
import ProductDetails from "@/components/ProductDetails";
import MobileFloatingBar from "@/components/MobileFloatingBar";
import ProductVideoSection from "@/components/ProductVideo";
import { Product, productsApi } from "@/lib/api";
import { EventCategory, EventType, trackEventSimple } from "@/lib/events_api";
import { Currency } from "@/lib/currencyApi";

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(
    location.state?.product || null
  );
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(!product);
  const { language, isRTL } = useLanguage();
  const { addToCart } = useCart();

  // استخدام hook العملات المحدث
  const {
    siteSettings,
    activeCurrencies,
    formatAmount,
    loading: currencyLoading,
    error: currencyError,
  } = useCurrencySettings();

  const translations = {
    en: {
      loading: "Loading...",
      backToProducts: "Back to Products",
      errorLoading: "Error loading product",
      addToCart: "Add to Cart",
      sar: "SAR",
      quantity: "Quantity",
      brand: "Brand",
      outOfStock: "Out of Stock",
      maxQuantityReached: "Maximum quantity reached",
    },
    ar: {
      loading: "جارٍ التحميل...",
      backToProducts: "العودة للمنتجات",
      errorLoading: "خطأ في تحميل المنتج",
      addToCart: "أضف للسلة",
      sar: "ريال",
      quantity: "الكمية",
      brand: "الماركة",
      outOfStock: "غير متوفر في المخزون",
      maxQuantityReached: "تم الوصول للحد الأقصى",
    },
  };

  const t = (key: string) => translations[language][key] || key;

  // الحصول على العملة الأساسية مع التأكد من إرجاع النوع الصحيح
  const getPrimaryCurrency = (): Currency => {
    if (!siteSettings || !activeCurrencies.length) {
      // إنشاء كائن Currency افتراضي كامل
      return {
        code: "SAR",
        name_en: "Saudi Riyal",
        name_ar: "ريال سعودي",
        symbol: "ريال",
        decimal_places: 2,
        is_active: true,
        conversion_rate: 1,
        country: "SA", // إضافة الخاصية المفقودة
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const primaryCurrency = activeCurrencies.find(
      (currency) => currency.code === siteSettings.primary_currency
    );

    return primaryCurrency || activeCurrencies[0];
  };

  const primaryCurrency = getPrimaryCurrency();

  // دالة getCategoryName
  const getCategoryName = (category: string) => {
    const categoryTranslations: { [key: string]: { en: string; ar: string } } =
      {
        smartphones: { en: "Smartphones", ar: "الهواتف الذكية" },
        "fermented-foods": { en: "Fermented Foods", ar: "الأطعمة المتخمرة" },
        "sprouted-products": {
          en: "Sprouted Products",
          ar: "المنتجات المنبتة",
        },
        collagen: { en: "Collagen", ar: "الكولاجين" },
        "detox-juices": { en: "Detox Juices", ar: "عصائر التخلص من السموم" },
      };

    return categoryTranslations[category]?.[language] || category;
  };

  // دالة لتنسيق السعر بالعملة الأساسية
  const formatPrice = (price: number): string => {
    if (currencyLoading || !siteSettings || !activeCurrencies.length) {
      return `${price.toFixed(2)} ${language === "ar" ? "ريال" : "SAR"}`;
    }

    // جيب العملة المخزنة مع معدل التحويل
    let storedCurrency: string | null = null;
    let conversionRate: number = 1;

    try {
      const cached = localStorage.getItem("currency_data_cache");
      if (cached) {
        const data = JSON.parse(cached);
        storedCurrency = data.defaultCurrency?.code;
        conversionRate = data.defaultCurrency?.conversion_rate || 1;
      }
    } catch {}

    const primaryCurrency =
      activeCurrencies.find((currency) => currency.code === storedCurrency) ||
      activeCurrencies.find(
        (currency) => currency.code === siteSettings.primary_currency
      ) ||
      activeCurrencies[0];

    // حول السعر أولاً
    const convertedPrice = price * (primaryCurrency.conversion_rate || 1);

    return formatAmount(convertedPrice, primaryCurrency.code);
  };

  // الحصول على أول متغير متاح في المخزون
  const getFirstAvailableVariant = () => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants.find((variant) => variant.stock > 0);
    }
    return null;
  };

  // تحديد المتغير الافتراضي
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      const availableVariant = getFirstAvailableVariant();
      if (availableVariant) {
        setSelectedVariant(availableVariant.id);
      }
    }
  }, [product, selectedVariant]);

  // إعادة تعيين الكمية عند تغيير المتغير
  useEffect(() => {
    if (selectedVariant && product?.variants) {
      const currentVariant = product.variants.find(
        (v) => v.id === selectedVariant
      );
      if (currentVariant) {
        // إذا كانت الكمية الحالية أكبر من المخزون، قم بتعيينها إلى الحد الأقصى
        if (quantity > currentVariant.stock) {
          setQuantity(Math.max(1, Math.min(quantity, currentVariant.stock)));
        }
      }
    }
  }, [selectedVariant, product, quantity]);

  // الحصول على الحد الأقصى للكمية
  const getMaxQuantity = () => {
    if (product?.variants && selectedVariant) {
      const currentVariant = product.variants.find(
        (v) => v.id === selectedVariant
      );
      return currentVariant ? currentVariant.stock : 1;
    }
    return 99; // افتراضياً إذا لم يكن هناك متغيرات
  };

  // التحقق من إمكانية إضافة المنتج للسلة
  const canAddToCart = () => {
    if (product?.variants && selectedVariant) {
      const currentVariant = product.variants.find(
        (v) => v.id === selectedVariant
      );
      return currentVariant && currentVariant.stock > 0;
    }
    return true; // افتراضياً إذا لم يكن هناك متغيرات
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadRelatedProducts = async () => {
      if (product) {
        try {
          const allProducts = await productsApi.getProductsByCategory(
            product.category
          );
          const related = allProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } catch (error) {
          console.error("Error loading related products:", error);
        }
      }
    };

    if (product) {
      loadRelatedProducts();
      setLoading(false);
    } else if (productId) {
      // Fallback: Load from API if not passed via state
      productsApi
        .getAllProducts()
        .then((products) => {
          const foundProduct = products.find((p) => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            return productsApi.getProductsByCategory(foundProduct.category);
          }
          throw new Error("Product not found");
        })
        .then((categoryProducts) => {
          const related = categoryProducts
            .filter((p) => p.id !== productId)
            .slice(0, 4);
          setRelatedProducts(related);
        })
        .catch((error) => console.error("Error loading product:", error))
        .finally(() => setLoading(false));
    }
  }, [productId, product]);

  const handleAddToCart = () => {
    if (product && canAddToCart()) {
      // الحصول على السعر الحالي بناءً على المتغير المختار
      const currentVariant = product.variants?.find(
        (v) => v.id === selectedVariant
      );
      const finalPrice = currentVariant
        ? parseFloat(currentVariant.price)
        : parseFloat(product.price);

      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          title: { en: product.title, ar: product.title },
          image: currentVariant?.image || product.image,
          price: finalPrice,
          base_price: product.base_price,
          variant_id: selectedVariant,
          variant_name: currentVariant?.color, // إضافة اسم المتغير (اللون)
        });
      }
      trackEventSimple(
        "add_to_cart",
        EventType.ADD_TO_CART,
        EventCategory.CONVERSION
      );
    }
  };

  // دالة لتحديث الكمية مع مراعاة المخزون
  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = getMaxQuantity();
    const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
    setQuantity(validQuantity);
  };

  if (loading || currencyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t("errorLoading")}</p>
          <Link to="/">
            <Button variant="outline">{t("backToProducts")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  // الحصول على السعر الحالي بناءً على المتغير المختار
  const currentVariant = product.variants?.find(
    (v) => v.id === selectedVariant
  );
  const currentPrice = currentVariant
    ? parseFloat(currentVariant.price)
    : parseFloat(product.price);

  return (
    <div className="min-h-screen">
      {/* عرض رسالة خطأ العملة إذا وجدت */}
      {currencyError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{currencyError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              {isRTL ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {t("backToProducts")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <ProductImageGallery
            images={productImages}
            title={product.title}
            selectedVariant={selectedVariant}
            variants={product.variants}
          />

          <ProductInfo
            title={product.title}
            category={product.category}
            getCategoryName={getCategoryName}
            price={currentPrice}
            oldPrice={
              product.old_price ? parseFloat(product.old_price) : undefined
            }
            description={product.description}
            quantity={quantity}
            setQuantity={handleQuantityChange}
            onAddToCart={handleAddToCart}
            rating={product.rating}
            reviewCount={product.reviewCount}
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
            brand={product.brand}
            sku={product.sku}
            t={t}
            maxQuantity={getMaxQuantity()}
            canAddToCart={canAddToCart()}
            // props العملة المحدثة
            formatPrice={formatPrice}
            primaryCurrency={primaryCurrency}
            language={language}
          />
        </div>

        {product.details && (
          <div className="mb-16">
            <ProductDetails
              productId={productId || ""}
              isRTL={isRTL}
              language={language}
              productData={product}
            />
          </div>
        )}

        {/* Product Video Section - يظهر فقط إذا كان هناك فيديو */}
        {product.videoInfo &&
          Object.values(product.videoInfo).some(
            (val) => val && val.trim() !== ""
          ) && (
            <ProductVideoSection
              videoInfo={product.videoInfo}
              language={language}
              isRTL={isRTL}
            />
          )}

        <ProductInstructions
          usageInstructions={product.usage_instructions}
          storageInstructions={product.storage_instructions}
          language={language}
        />

        <ProductFAQ faq={product.faq} language={language} t={t} />

        <div className="mb-16">
          <UserReviews productId={productId || ""} />
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />

      {/* MobileFloatingBar سيظهر فقط عندما تكون السلة فارغة */}
      <MobileFloatingBar
        title={product.title}
        price={currentPrice}
        onAddToCart={handleAddToCart}
        t={t}
        canAddToCart={canAddToCart()}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default ProductPage;
