import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  User,
  Eye,
  CreditCard,
  Share2,
  Database,
  UserCheck,
  Trash2,
  RefreshCw,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicyPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: "Privacy Policy - Alive Food Store",
      backToHome: "Back to Home",
      dataCollection: "Data Collection",
      dataUsage: "Data Usage",
      trackingCookies: "Tracking Tools & Cookies",
      financialDataProtection: "Financial Data Protection",
      dataSharing: "Data Sharing",
      dataStorage: "Data Storage",
      userRights: "Your Data Rights",
      dataDeleteRequest: "Data Deletion Request",
      policyUpdates: "Policy Updates",
      consent: "Consent",
      contact: "Contact",
      dataCollectionText:
        "At Alive Food Store, we collect the following data only:",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      deliveryAddress: "Delivery Address",
      dataUsageText: "Collected data is used only for:",
      orderExecution: "Order processing and delivery execution",
      noMarketing:
        "We do not use data for marketing purposes or promotional messages",
      noSelling: "We do not sell or rent your data to any third parties",
      trackingText:
        "We use tracking tools to monitor visited pages on the website",
      trackingPurpose:
        "Tracking is used only to improve targeting and user experience",
      googleAnalytics: "We use Google Analytics to collect website statistics",
      facebookPixel: "We use Facebook Pixel to improve ads and get analytics",
      financialProtectionText:
        "We do not store credit card or e-wallet information",
      securePayments:
        "All financial transactions are processed through secure platforms of approved banks and companies",
      highSecurity:
        "We use the highest security standards in payment processing",
      dataSharingText: "We share your data with the following parties only:",
      deliveryCompanies: "Delivery Companies: For delivery execution",
      noOtherSharing: "We do not share data with any other parties",
      dataStorageText:
        "We retain your data for 2 months from the last order date",
      secureServers: "Data is stored on secure external servers",
      securityPractices:
        "We follow best security practices to protect your data",
      userRightsText: "You have the right to:",
      deleteRight: "Request deletion of your personal data at any time",
      inquiryRight: "Inquire about data stored about you",
      updateRight: "Modify or update your data",
      deleteRequestText:
        "To contact us regarding data deletion or modification:",
      whatsapp: "WhatsApp: +996542714708",
      email: "Email: info@alivefood.store",
      phone: "Phone: +996542714708",
      policyUpdatesText: "We reserve the right to modify the privacy policy",
      updateNotification: "You will be notified of any substantial changes",
      continuedUse:
        "Continued use of the website means you agree to the updated policy",
      consentText:
        "By using Alive Food Store website, you agree to the collection and use of your data according to this policy.",
      lastUpdated: "Last Updated: August 29, 2025",
      footer:
        "*Alive Food Store management reserves the right to modify this policy at any time without prior notice*",
    },
    ar: {
      title: "سياسة الخصوصية - متجر Alive Food",
      backToHome: "العودة للرئيسية",
      dataCollection: "جمع البيانات",
      dataUsage: "استخدام البيانات",
      trackingCookies: "أدوات التتبع والكوكيز",
      financialDataProtection: "حماية البيانات المالية",
      dataSharing: "مشاركة البيانات",
      dataStorage: "تخزين البيانات",
      userRights: "حقوقك في البيانات",
      dataDeleteRequest: "طلب حذف البيانات",
      policyUpdates: "تحديثات السياسة",
      consent: "الموافقة",
      contact: "التواصل",
      dataCollectionText: "نحن في متجر Alive Food نجمع البيانات التالية فقط:",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الهاتف",
      deliveryAddress: "العنوان للتوصيل",
      dataUsageText: "البيانات المجمعة تُستخدم فقط لـ:",
      orderExecution: "تنفيذ الطلبات والتوصيل",
      noMarketing: "لا نستخدم البيانات لأغراض تسويقية أو إرسال رسائل ترويجية",
      noSelling: "لا نبيع أو نؤجر بياناتك لأي جهة خارجية",
      trackingText: "نستخدم أدوات تتبع لمراقبة الصفحات المزارة في الموقع",
      trackingPurpose: "الهدف من التتبع تحسين الاستهدافات وتجربة المستخدم فقط",
      googleAnalytics: "نستخدم Google Analytics لجمع إحصائيات الموقع",
      facebookPixel:
        "نستخدم Facebook Pixel لتحسين الإعلانات والحصول على احصائيات",
      financialProtectionText:
        "لا نحفظ معلومات البطاقات الائتمانية أو المحافظ الإلكترونية",
      securePayments:
        "جميع المعاملات المالية تتم عبر المنصات الآمنة للبنوك والشركات المعتمدة",
      highSecurity: "نستخدم أعلى معايير الأمان في التعامل مع المدفوعات",
      dataSharingText: "نشارك بياناتك مع الجهات التالية فقط:",
      deliveryCompanies: "شركات التوصيل: لتنفيذ عملية التوصيل",
      noOtherSharing: "لا نشارك البيانات مع أي جهات أخرى",
      dataStorageText: "نحتفظ ببياناتك لمدة شهرين من تاريخ آخر طلب",
      secureServers: "البيانات تُحفظ على سيرفرات خارجية آمنة",
      securityPractices: "نتبع أفضل الممارسات الأمنية لحماية بياناتك",
      userRightsText: "يحق لك:",
      deleteRight: "طلب حذف بياناتك الشخصية في أي وقت",
      inquiryRight: "الاستعلام عن البيانات المحفوظة عنك",
      updateRight: "تعديل أو تحديث بياناتك",
      deleteRequestText: "للتواصل بخصوص حذف أو تعديل بياناتك:",
      whatsapp: "واتساب: +996542714708",
      email: "إيميل: info@alivefood.store",
      phone: "هاتف: +996542714708",
      policyUpdatesText: "نحتفظ بالحق في تعديل سياسة الخصوصية",
      updateNotification: "سيتم إشعارك بأي تغييرات جوهرية",
      continuedUse: "استمرار استخدام الموقع يعني موافقتك على السياسة المحدثة",
      consentText:
        "باستخدام موقع متجر Alive Food، فإنك توافق على جمع واستخدام بياناتك وفقاً لهذه السياسة.",
      lastUpdated: "تاريخ آخر تحديث: 29 أغسطس 2025",
      footer:
        "*تحتفظ إدارة متجر Alive Food بالحق في تعديل هذه السياسة في أي وقت دون إشعار مسبق*",
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
          {/* Data Collection Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("dataCollection")}
              </h2>
            </div>
            <p className="text-gray-700 mb-4">{t("dataCollectionText")}</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1 font-bold">•</span>
                <span>
                  <strong>{t("fullName")}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1 font-bold">•</span>
                <span>
                  <strong>{t("phoneNumber")}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1 font-bold">•</span>
                <span>
                  <strong>{t("deliveryAddress")}</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* Data Usage Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("dataUsage")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("orderExecution")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("noMarketing")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("noSelling")}</span>
              </li>
            </ul>
          </div>

          {/* Tracking & Cookies Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("trackingCookies")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t("trackingText")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t("trackingPurpose")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t("googleAnalytics")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t("facebookPixel")}</span>
              </li>
            </ul>
          </div>

          {/* Financial Data Protection Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("financialDataProtection")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>
                  <strong>{t("financialProtectionText")}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("securePayments")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t("highSecurity")}</span>
              </li>
            </ul>
          </div>

          {/* Data Sharing Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("dataSharing")}
              </h2>
            </div>
            <p className="text-gray-700 mb-4">{t("dataSharingText")}</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>
                  <strong>{t("deliveryCompanies")}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t("noOtherSharing")}</span>
              </li>
            </ul>
          </div>

          {/* Data Storage Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("dataStorage")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>{t("dataStorageText")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>{t("secureServers")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>{t("securityPractices")}</span>
              </li>
            </ul>
          </div>

          {/* User Rights Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("userRights")}
              </h2>
            </div>
            <p className="text-gray-700 mb-4">{t("userRightsText")}</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("deleteRight")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("inquiryRight")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t("updateRight")}</span>
              </li>
            </ul>
          </div>

          {/* Data Delete Request Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("dataDeleteRequest")}
              </h2>
            </div>
            <p className="text-gray-700 mb-4">{t("deleteRequestText")}</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-gray-600">
                <p>📱 {t("whatsapp")}</p>
                <p>📧 {t("email")}</p>
                <p>📞 {t("phone")}</p>
              </div>
            </div>
          </div>

          {/* Policy Updates Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("policyUpdates")}
              </h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t("policyUpdatesText")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t("updateNotification")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t("continuedUse")}</span>
              </li>
            </ul>
          </div>

          {/* Consent Section */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-800">
                {t("consent")}
              </h2>
            </div>
            <p className="text-blue-700 font-medium">{t("consentText")}</p>
          </div>

          {/* Last Updated */}
          <div className="bg-gray-100 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 text-center font-medium">
              {t("lastUpdated")}
            </p>
          </div>

          {/* Footer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 italic">{t("footer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
