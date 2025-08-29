import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Package,
  CreditCard,
  Phone,
  Truck,
  XCircle,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsConditionsPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: "Terms & Conditions - Alive Food Store",
      backToHome: "Back to Home",
      acceptance: "Acceptance & Agreement",
      services: "Provided Services",
      ordersAndPrices: "Orders & Prices",
      delivery: "Delivery",
      inventory: "Inventory Management",
      payment: "Payment",
      cancellation: "Order Cancellation & Returns",
      warranty: "Quality Guarantee",
      liability: "Liability & Commitment",
      contact: "Contact",
      applicableLaw: "Applicable Law",
      intellectualProperty: "Intellectual Property",
      termsModification: "Terms Modification",
      serviceTermination: "Service Termination",
      lastUpdate: "Last updated: 29 August 2025",
      acceptanceText:
        "By using Alive Food Store website and services, you agree to all terms and conditions mentioned below.",
      service1:
        "Alive Food specializes in selling natural and healthy products",
      service2: "We provide delivery service to Najran, Saudi Arabia only.",
      service3: "Customer service is available 24 hours a day, 7 days a week",
      price1: "Prices are subject to change based on market conditions",
      price2: "All displayed prices are in Saudi Riyals including taxes",
      price3: "Prices are valid only at the time of order confirmation",
      delivery1:
        "Delivery time depends on preparation as products are made to order. Delivery is available only within Najran.",
      delivery2: "We deliver to Najran, Saudi Arabia only.",
      delivery3: "We will contact you to set a suitable delivery appointment",
      inventory1: "We apply a smart inventory management system",
      inventory2: "Products not available in stock cannot be ordered",
      inventory3:
        "In case of stock depletion after ordering, we will contact you immediately",
      payment1: "Prepaid via bank transfer only, as products are made to order",
      payment2:
        "Bank transfer details will be provided upon order confirmation",
      cancel1:
        "No cancellation or returns once the order is confirmed, as products are made to order",
      cancel2:
        "In case of a defect, please contact customer service immediately",
      cancel3:
        "Customer satisfaction is our priority, and we will work to find a suitable solution for any issue",
      warranty1: "Every product undergoes strict quality control",
      warranty2: "Our commitment to quality is our main guarantee",
      warranty3:
        "Our commitment is limited to providing the product with the required quality",
      liability1:
        "Alive Food is not responsible for any damages resulting from misuse",
      liability2:
        "The store is not responsible for damages resulting from not following usage instructions",
      liability3: "Data protection and privacy security is our responsibility",
      contactText: "We are here to serve you always. Contact us via:",
      contactPlaceholder:
        "📱 WhatsApp: +996542714708\n📧 Email: info@alivefood.store\n📞 Phone: +996542714708\n🕐 Working Hours: 24 hours, 7 days a week",
      law1: "Alive Food Store is officially registered in the Kingdom of Saudi Arabia",
      law2: "These terms are subject to Saudi Arabian law",
      law3: "Any disputes are resolved according to Saudi Arabian law",
      law4: "The Saudi Arabian courts are competent to consider any disputes",
      ip1: "All content and trademarks are protected by copyright",
      ip2: "Content may not be copied or distributed without written permission",
      modify1: "We reserve the right to modify these terms at any time",
      modify2:
        "Modifications become effective immediately upon posting on the website",
      modify3:
        "Continued use of the website means your agreement to the modifications",
      terminate1:
        "We reserve the right to terminate or suspend service to any user",
      terminate2:
        "We have the right to refuse any order without giving reasons",
      terminate3:
        "In case of service termination, these terms remain in effect",
    },
    ar: {
      title: "الشروط والأحكام - متجر Alive Food",
      backToHome: "العودة للرئيسية",
      acceptance: "القبول والموافقة",
      services: "الخدمات المقدمة",
      ordersAndPrices: "الطلبات والأسعار",
      delivery: "التوصيل",
      inventory: "إدارة المخزون",
      payment: "الدفع",
      cancellation: "إلغاء الطلبات والإرجاع",
      warranty: "ضمان الجودة",
      liability: "المسؤولية والالتزام",
      contact: "التواصل",
      applicableLaw: "القانون المطبق",
      intellectualProperty: "حقوق الملكية الفكرية",
      termsModification: "تعديل الشروط",
      serviceTermination: "إنهاء الخدمة",
      lastUpdate: "تاريخ آخر تحديث: 29 أغسطس 2025",
      acceptanceText:
        "باستخدام موقع وخدمات متجر Alive Food، فإنك توافق على جميع الشروط والأحكام المذكورة أدناه.",
      service1: "متجر Alive Food متخصص في بيع المنتجات الطبيعية والصحية",
      service2: "نقدم خدمة التوصيل في نجران، المملكة العربية السعودية فقط.",
      service3: "خدمة العملاء متاحة 24 ساعة طوال أيام الأسبوع",
      price1: "الأسعار معرضة للتغيير حسب ظروف السوق",
      price2: "جميع الأسعار المعروضة بالريال السعودي شاملة الضرائب",
      price3: "الأسعار سارية وقت تأكيد الطلب فقط",
      delivery1:
        "مدة التوصيل تعتمد على وقت التحضير لأن المنتجات تُصنع حسب الطلب. التوصيل متاح داخل نجران فقط.",
      delivery2: "نوصل في نجران بالمملكة العربية السعودية فقط.",
      delivery3: "يتم التواصل معك لتحديد موعد التسليم المناسب",
      inventory1: "نطبق نظام إدارة المخزون الذكي",
      inventory2: "لا يمكن طلب منتجات غير متوفرة في المخزون",
      inventory3: "في حالة نفاد المخزون بعد الطلب، سيتم التواصل معك فوراً",
      payment1:
        "الدفع المسبق عن طريق التحويل البنكي فقط، حيث أن المنتجات تُصنع خصيصاً للعميل",
      payment2: "سيتم تزويدك بتفاصيل التحويل البنكي عند تأكيد الطلب",
      cancel1:
        "لا يوجد إلغاء أو إرجاع بمجرد تأكيد الطلب، فالمنتجات تُصنع حسب الطلب",
      cancel2: "في حال وجود عيب في المنتج، يرجى التواصل مع خدمة العملاء فوراً",
      cancel3: "رضا العميل هو أولويتنا، وسنعمل على إيجاد حل مناسب لأي مشكلة",
      warranty1: "كل منتج يخضع لرقابة جودة صارمة",
      warranty2: "التزامنا بالجودة هو ضماننا الرئيسي",
      warranty3: "مسؤوليتنا تقتصر على توفير المنتج بالجودة المطلوبة",
      liability1:
        "متجر Alive Food غير مسؤول عن أي أضرار ناتجة عن سوء الاستخدام",
      liability2:
        "المتجر غير مسؤول عن الأضرار الناتجة عن عدم اتباع تعليمات الاستخدام",
      liability3: "حماية البيانات وأمان الخصوصية هي مسؤوليتنا",
      contactText: "نحن هنا لخدمتك دائماً. تواصل معنا عبر:",
      contactPlaceholder:
        "📱 واتساب: +996542714708\n📧 إيميل: info@alivefood.store\n📞 هاتف: +996542714708\n🕐 ساعات العمل: 24 ساعة، 7 أيام في الأسبوع",
      law1: "متجر Alive Food مسجل رسمياً في المملكة العربية السعودية",
      law2: "تخضع هذه الشروط للقانون السعودي",
      law3: "أي نزاعات تُحل وفقاً للقانون السعودي",
      law4: "المحاكم السعودية هي المختصة بالنظر في أي نزاعات",
      ip1: "جميع المحتويات والعلامات التجارية محمية بحقوق الطبع والنشر",
      ip2: "لا يجوز نسخ أو توزيع المحتوى دون إذن مكتوب",
      modify1: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت",
      modify2: "التعديلات تصبح سارية فور نشرها على الموقع",
      modify3: "استمرار استخدام الموقع يعني موافقتك على التعديلات",
      terminate1: "نحتفظ بالحق في إنهاء أو تعليق الخدمة لأي مستخدم",
      terminate2: "يحق لنا رفض أي طلب دون إبداء أسباب",
      terminate3: "في حالة إنهاء الخدمة، تبقى هذه الشروط سارية",
    },
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div
      className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isRTL ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {t("backToHome")}
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            {t("title")}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Acceptance Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("acceptance")}
              </h2>
            </div>
            <p className="text-gray-700">{t("acceptanceText")}</p>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("services")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("service1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("service2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("service3")}</span>
              </li>
            </ul>
          </div>

          {/* Orders & Prices Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("ordersAndPrices")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("price1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("price2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("price3")}</span>
              </li>
            </ul>
          </div>

          {/* Delivery Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("delivery")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("delivery1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("delivery2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("delivery3")}</span>
              </li>
            </ul>
          </div>

          {/* Inventory Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("inventory")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("inventory1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("inventory2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("inventory3")}</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("payment")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("payment1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("payment2")}</span>
              </li>
              
            </ul>
          </div>

          {/* Cancellation Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("cancellation")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("cancel1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("cancel2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("cancel3")}</span>
              </li>
            </ul>
          </div>

          {/* Warranty Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("warranty")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("warranty1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("warranty2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("warranty3")}</span>
              </li>
            </ul>
          </div>

          {/* Liability Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("liability")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t("liability1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t("liability2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t("liability3")}</span>
              </li>
            </ul>
          </div>

          {/* Applicable Law Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("applicableLaw")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t("law1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t("law2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t("law3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t("law4")}</span>
              </li>
            </ul>
          </div>

          {/* Intellectual Property Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("intellectualProperty")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t("ip1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t("ip2")}</span>
              </li>
            </ul>
          </div>

          {/* Terms Modification Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("termsModification")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t("modify1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t("modify2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t("modify3")}</span>
              </li>
            </ul>
          </div>

          {/* Service Termination Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("serviceTermination")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("terminate1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("terminate2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("terminate3")}</span>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("contact")}
              </h2>
            </div>
            <p className="text-gray-700 mb-4">{t("contactText")}</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 italic">{t("contactPlaceholder")}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <p className="text-sm text-blue-800 italic">{t("lastUpdate")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
