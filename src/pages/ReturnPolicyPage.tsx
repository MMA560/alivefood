import React from 'react';
import { ArrowLeft, ArrowRight, Clock, Package, CreditCard, Phone, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ReturnPolicyPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Return & Exchange Policy - Sawa Mob Store',
      backToHome: 'Back to Home',
      returnPeriod: 'Return Period',
      returnConditions: 'Return & Exchange Conditions',
      shippingCosts: 'Shipping Costs',
      personalExchange: 'Personal Exchange',
      manufacturingDefects: 'Manufacturing Defects',
      returnProcess: 'Return Process',
      refundPolicy: 'Refund Policy',
      excludedProducts: 'Excluded Products',
      rejectionCases: 'Rejection Cases',
      contact: 'Contact',
      returnPeriodText: 'You have the right to return or exchange the product within **14 days** from the date of receipt',
      returnPeriodCalc: 'The period is calculated from the actual delivery date of the product',
      condition1: 'Product must be in its original condition without any defects or damage',
      condition2: 'Product must be in original packaging with all accessories',
      condition3: 'Used or damaged products by customer are not accepted for return',
      personalExchangeText: 'If you want to exchange the product for personal reasons (dislike, change of mind)',
      personalExchangeCost: 'Customer bears shipping costs both ways',
      personalExchangeNote: '**Exchange only available, no refunds**',
      manufacturingDefectsText: 'In case of product defect or non-compliance with specifications',
      manufacturingDefectsCost: 'Sawa Mob Store bears all shipping costs',
      step1: 'Contact us within 14 days through available communication channels',
      step2: 'Mention order number and reason for return',
      step3: 'Pickup appointment will be scheduled or shipment arranged',
      step4: 'After product inspection, return will be approved or rejected',
      personalRefund: 'For personal exchange reasons, only product exchange is available',
      personalRefundNote: '**No refunds in this case**',
      manufacturingRefund: 'Refund processed within 7-14 working days from approval date',
      manufacturingRefundNote: 'Refund based on shipping policy attached with product',
      shippingDeduction: '**Shipping cost will be deducted from refunded amount**',
      cashRefund: 'For cash on delivery, refund will be cash or bank transfer',
      excludedText: 'No products currently excluded from return policy',
      allProductsText: 'All available phone accessories are returnable and exchangeable',
      rejection1: 'Expiry of 14-day period',
      rejection2: 'Product damage or defect due to misuse',
      rejection3: 'Missing original packaging or accessories',
      rejection4: 'Product not in resalable condition',
      contactText: 'For return policy inquiries or to submit a return request, please contact us via:',
      contactPlaceholder: '📱 Whatapp: 01001225846\n📧 Email: Aymanfaam@gmail.com\n📞 Phone: 01001225846\n🕐 Working Hours: 24 Hors، 7 Days per week',
      footer: '*Sawa Mob Store management reserves the right to modify this policy at any time without prior notice*'
    },
    ar: {
      title: 'سياسة الاسترجاع والاستبدال - متجر سوا موب',
      backToHome: 'العودة للرئيسية',
      returnPeriod: 'مدة الإرجاع',
      returnConditions: 'شروط الإرجاع والاستبدال',
      shippingCosts: 'تكاليف الشحن',
      personalExchange: 'الاستبدال الشخصي',
      manufacturingDefects: 'العيوب التصنيعية',
      returnProcess: 'آلية الإرجاع',
      refundPolicy: 'استرداد الأموال',
      excludedProducts: 'المنتجات المستثناة',
      rejectionCases: 'حالات رفض الإرجاع',
      contact: 'التواصل',
      returnPeriodText: 'يحق لك إرجاع أو استبدال المنتج خلال **14 يوماً** من تاريخ الاستلام',
      returnPeriodCalc: 'يتم احتساب المدة من تاريخ التسليم الفعلي للمنتج',
      condition1: 'يجب أن يكون المنتج في حالته الأصلية دون أي عيوب أو تلف',
      condition2: 'يجب أن يكون المنتج في العبوة الأصلية مع جميع الملحقات',
      condition3: 'لا يُقبل إرجاع المنتجات المستخدمة أو التالفة بفعل العميل',
      personalExchangeText: 'في حالة رغبتك في استبدال المنتج لأسباب شخصية (عدم الإعجاب، تغيير الرأي)',
      personalExchangeCost: 'العميل يتحمل تكاليف الشحن ذهاباً وإياباً',
      personalExchangeNote: '**متاح الاستبدال فقط، لا يتم استرداد الأموال**',
      manufacturingDefectsText: 'في حالة وجود عيب في المنتج أو عدم مطابقته للمواصفات',
      manufacturingDefectsCost: 'متجر سوا موب يتحمل كامل تكاليف الشحن',
      step1: 'تواصل معنا خلال فترة الـ 14 يوم عبر وسائل الاتصال المتاحة',
      step2: 'اذكر رقم الطلب وسبب الإرجاع',
      step3: 'سيتم تحديد موعد لاستلام المنتج أو إرساله',
      step4: 'بعد فحص المنتج، سيتم الموافقة على الإرجاع أو رفضه',
      personalRefund: 'في حالة الاستبدال لأسباب شخصية، يتم استبدال المنتج فقط',
      personalRefundNote: '**لا يتم استرداد الأموال في هذه الحالة**',
      manufacturingRefund: 'يتم استرداد الأموال خلال 7-14 يوم عمل من تاريخ الموافقة على الإرجاع',
      manufacturingRefundNote: 'يتم الاسترداد بناءً على بوليسة الشحن المرفقة مع المنتج',
      shippingDeduction: '**سيتم خصم تكلفة الشحن من المبلغ المسترد**',
      cashRefund: 'في حالة الدفع عند الاستلام، سيتم الاسترداد نقداً أو تحويل بنكي',
      excludedText: 'لا توجد منتجات مستثناة من سياسة الإرجاع حالياً',
      allProductsText: 'جميع اكسسوارات الهواتف المتوفرة قابلة للإرجاع والاستبدال',
      rejection1: 'انتهاء فترة الـ 14 يوم',
      rejection2: 'وجود تلف أو عيب بالمنتج بسبب سوء الاستخدام',
      rejection3: 'عدم وجود العبوة الأصلية أو الملحقات',
      rejection4: 'المنتج في حالة غير قابلة للبيع مرة أخرى',
      contactText: 'للاستفسارات حول سياسة الإرجاع أو تقديم طلب إرجاع، يرجى التواصل معنا عبر:',
      contactPlaceholder: '📱 واتساب: 01001225846\n📧 إيميل: Aymanfaam@gmail.com\n📞 هاتف: 01001225846\n🕐 ساعات العمل: 24 ساعة، 7 أيام في الأسبوع',
      footer: '*تحتفظ إدارة متجر سوا موب بالحق في تعديل هذه السياسة في أي وقت دون إشعار مسبق*'
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

          {/* Shipping Costs Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('shippingCosts')}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">{t('personalExchange')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{t('personalExchangeText')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{t('personalExchangeCost')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{t('personalExchangeNote')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">{t('manufacturingDefects')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{t('manufacturingDefectsText')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{t('manufacturingDefectsCost')}</span>
                  </li>
                </ul>
              </div>
            </div>
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
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{t('personalRefundNote')}</span>
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
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{t('shippingDeduction')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{t('cashRefund')}</span>
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
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('allProductsText')}</span>
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
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('rejection4')}</span>
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