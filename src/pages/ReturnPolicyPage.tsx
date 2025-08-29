import React from 'react';
import { ArrowLeft, ArrowRight, Clock, Package, CreditCard, Phone, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ReturnPolicyPage = () => {
  const { language, isRTL } = useLanguage();

  const translations ={
  "en": {
    "title": "Exchange & Return Policy - Alive Food",
    "backToHome": "Back to Home",
    "returnPeriod": "Exchange & Return Period",
    "returnPeriodText": "The exchange or return period is valid **only upon receipt of the product** if it is found to be damaged or spoiled.",
    "returnPeriodCalc": "No returns are accepted after the customer receives the product from the delivery representative, as we are not responsible for improper storage or use.",
    "returnConditions": "Exchange & Return Conditions",
    "condition1": "The exchange is limited to products that are damaged or spoiled upon arrival.",
    "condition2": "The customer must verify the product's condition in the presence of the delivery representative.",
    "condition3": "The product must be unused and in its original state upon receipt.",
    "shippingCosts": "Shipping Costs",
    "manufacturingDefects": "Damaged or Spoiled Products",
    "manufacturingDefectsText": "In case the product is damaged or spoiled upon arrival.",
    "manufacturingDefectsCost": "Alive Food store bears all shipping and exchange costs.",
    "returnProcess": "Exchange Process",
    "step1": "The customer must report the damage or spoilage immediately to the delivery representative upon receipt.",
    "step2": "The representative will take the product back and a new, intact product will be delivered.",
    "step3": "A new delivery date will be scheduled for the replacement.",
    "step4": "No further action is required from the customer beyond reporting the issue at the time of delivery.",
    "refundPolicy": "Refund Policy",
    "personalRefund": "No refunds are issued as we do not accept returns after receipt.",
    "manufacturingRefund": "A full refund will be processed only in case of failure to provide a replacement for a damaged or spoiled product.",
    "manufacturingRefundNote": "Refunds are processed within 7-14 business days from the refund approval date.",
    "excludedProducts": "Excluded Products",
    "excludedText": "All products are subject to the exchange policy in case of damage upon receipt.",
    "rejectionCases": "Rejection Cases",
    "rejection1": "The customer accepts the product from the delivery representative, even if it is damaged.",
    "rejection2": "Damage to the product due to improper storage or use after receipt.",
    "rejection3": "The customer fails to report the damage at the time of delivery.",
    "contact": "Contact",
    "contactText": "For any inquiries about our policy or to report a damaged product, please contact us via:",
    "contactPlaceholder": "📱 WhatsApp: +996542714708\n📧 Email: info@alivefood.store\n📞 Phone: +996542714708\n🕐 Working Hours: 24 hours, 7 days a week",
    "footer": "Alive Food management reserves the right to modify this policy at any time without prior notice."
  },
  "ar": {
    "title": "سياسة الاستبدال والاسترجاع - Alive Food",
    "backToHome": "العودة للرئيسية",
    "returnPeriod": "مدة الاستبدال والاسترجاع",
    "returnPeriodText": "مدة الاستبدال أو الاسترجاع تكون متاحة **فقط عند استلام المنتج** في حالة وجود تلف أو فساد ظاهر عليه.",
    "returnPeriodCalc": "لا يتم قبول الإرجاع بعد استلام العميل للمنتج من مندوب التوصيل، حيث لا نتحمل مسؤولية سوء التخزين أو الاستخدام.",
    "returnConditions": "شروط الاستبدال والاسترجاع",
    "condition1": "يقتصر الاستبدال على المنتجات التي تصل تالفة أو فاسدة.",
    "condition2": "يجب على العميل التحقق من حالة المنتج بحضور مندوب التوصيل.",
    "condition3": "يجب أن يكون المنتج غير مستخدم وفي حالته الأصلية عند الاستلام.",
    "shippingCosts": "تكاليف الشحن",
    "manufacturingDefects": "المنتجات التالفة أو الفاسدة",
    "manufacturingDefectsText": "في حالة وصول المنتج تالفًا أو فاسدًا.",
    "manufacturingDefectsCost": "يتحمل متجر Alive Food كامل تكاليف الشحن والاستبدال.",
    "returnProcess": "آلية الاستبدال",
    "step1": "يجب على العميل إبلاغ مندوب التوصيل فورًا عن أي تلف أو فساد عند الاستلام.",
    "step2": "سيقوم المندوب باسترجاع المنتج وسيتم توصيل منتج جديد سليم.",
    "step3": "سيتم تحديد موعد جديد لتسليم المنتج البديل.",
    "step4": "لا يُطلب من العميل أي إجراء إضافي بعد إبلاغ المندوب وقت التسليم.",
    "refundPolicy": "استرداد الأموال",
    "personalRefund": "لا يتم استرداد الأموال لأننا لا نقبل الإرجاع بعد الاستلام.",
    "manufacturingRefund": "يتم استرداد المبلغ بالكامل فقط في حالة عدم توفر بديل للمنتج التالف أو الفاسد.",
    "manufacturingRefundNote": "يتم استرداد الأموال خلال 7-14 يوم عمل من تاريخ الموافقة على الاسترداد.",
    "excludedProducts": "المنتجات المستثناة",
    "excludedText": "جميع منتجاتنا تخضع لسياسة الاستبدال في حال وجود تلف عند الاستلام.",
    "rejectionCases": "حالات رفض الإرجاع",
    "rejection1": "إذا استلم العميل المنتج من المندوب وهو تالف.",
    "rejection2": "حدوث تلف للمنتج بسبب سوء التخزين أو الاستخدام بعد الاستلام.",
    "rejection3": "عدم إبلاغ العميل عن التلف وقت الاستلام.",
    "contact": "التواصل",
    "contactText": "للاستفسار عن سياستنا أو لتقديم بلاغ عن منتج تالف، يرجى التواصل معنا عبر:",
    "contactPlaceholder": "📱 واتساب: +996542714708\n📧 إيميل: info@alivefood.store\n📞 هاتف: +996542714708\n🕐 ساعات العمل: 24 ساعة، 7 أيام في الأسبوع",
    "footer": "تحتفظ إدارة Alive Food بالحق في تعديل هذه السياسة في أي وقت دون إشعار مسبق."
  }
};

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t('backToHome')}
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            {t('title')}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Return Period Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('returnPeriod')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('returnPeriodText')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('returnPeriodCalc')}</span>
              </li>
            </ul>
          </div>

          {/* Return Conditions Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('returnConditions')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('condition1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('condition2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('condition3')}</span>
              </li>
            </ul>
          </div>

          

          {/* Return Process Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('returnProcess')}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <p className="text-gray-700 mt-1">{t('step1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <p className="text-gray-700 mt-1">{t('step2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <p className="text-gray-700 mt-1">{t('step3')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <p className="text-gray-700 mt-1">{t('step4')}</p>
              </div>
            </div>
          </div>

          {/* Refund Policy Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('refundPolicy')}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">{t('personalExchange')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{t('personalRefund')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">{t('manufacturingDefects')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{t('manufacturingRefund')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{t('manufacturingRefundNote')}</span>
                  </li>
                  
                </ul>
              </div>
            </div>
          </div>

          {/* Excluded Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('excludedProducts')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('excludedText')}</span>
              </li>
              
            </ul>
          </div>

          {/* Rejection Cases Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('rejectionCases')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('rejection1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('rejection2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('rejection3')}</span>
              </li>
              
            </ul>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('contact')}</h2>
            </div>
            <p className="text-gray-700 mb-4">{t('contactText')}</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 italic">{t('contactPlaceholder')}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 italic">{t('footer')}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;