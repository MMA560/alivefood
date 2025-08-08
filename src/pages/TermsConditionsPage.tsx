import React from 'react';
import { ArrowLeft, ArrowRight, Shield, Package, CreditCard, Phone, Truck, XCircle, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsConditionsPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'Terms & Conditions - Sawa Mob Store',
      backToHome: 'Back to Home',
      acceptance: 'Acceptance & Agreement',
      services: 'Provided Services',
      ordersAndPrices: 'Orders & Prices',
      delivery: 'Delivery',
      inventory: 'Inventory Management',
      payment: 'Payment Methods',
      cancellation: 'Order Cancellation',
      warranty: 'Warranty',
      liability: 'Liability',
      contact: 'Contact',
      applicableLaw: 'Applicable Law',
      intellectualProperty: 'Intellectual Property',
      termsModification: 'Terms Modification',
      serviceTermination: 'Service Termination',
      acceptanceText: 'By using Sawa Mob Store website and services, you agree to all terms and conditions mentioned below.',
      service1: 'Sawa Mob Store specializes in selling mobile phone accessories',
      service2: 'We provide delivery service to all parts of the Arab Republic of Egypt',
      service3: 'Customer service is available 24 hours a day, 7 days a week',
      price1: 'Prices are subject to change according to global prices and Egyptian pound exchange rate',
      price2: 'All displayed prices are in Egyptian pounds including taxes',
      price3: 'Prices are valid only at the time of order confirmation',
      delivery1: 'Delivery time: 4-6 days maximum',
      delivery2: 'We deliver to all governorates of the Arab Republic of Egypt',
      delivery3: 'We will contact you to set a suitable delivery appointment',
      inventory1: 'We apply automatic inventory management system',
      inventory2: 'Products not available in stock cannot be ordered',
      inventory3: 'In case of stock depletion after ordering, we will contact you immediately',
      payment1: 'Cash on delivery',
      payment2: 'Credit and debit cards',
      payment3: 'Egyptian electronic wallets',
      payment4: 'Egyptian Meeza',
      cancel1: 'Order can be cancelled before shipping by contacting customer service',
      cancel2: 'After order shipment, return and exchange policy applies',
      cancel3: 'In case of cancellation, refund is processed within 7-14 working days',
      warranty1: 'Warranty is available according to each supplier and product',
      warranty2: 'Warranty details are mentioned in product description',
      warranty3: 'Warranty does not cover damages from misuse',
      liability1: 'Sawa Mob Store is not responsible for any damages resulting from misuse',
      liability2: 'Store is not responsible for damages resulting from not following usage instructions',
      liability3: 'Our responsibility is limited to providing the product with required quality',
      contactText: 'For any inquiries or problems:',
      contactPlaceholder: '📱 WhatsApp: [WhatsApp number]\n📧 Email: [Email address]\n📞 Phone: [Phone number]\n🕐 Working Hours: 24 hours, 7 days a week',
      law1: 'Sawa Mob Store is officially registered in the Arab Republic of Egypt',
      law2: 'These terms are subject to Egyptian law',
      law3: 'Any disputes are resolved according to Egyptian law',
      law4: 'Egyptian courts are competent to consider any disputes',
      ip1: 'All content and trademarks are protected by copyright',
      ip2: 'Content may not be copied or distributed without written permission',
      modify1: 'We reserve the right to modify these terms at any time',
      modify2: 'Modifications become effective immediately upon posting on the website',
      modify3: 'Continued use of the website means your agreement to the modifications',
      terminate1: 'We reserve the right to terminate or suspend service to any user',
      terminate2: 'We have the right to refuse any order without giving reasons',
      terminate3: 'In case of service termination, these terms remain in effect',
      lastUpdate: 'Last updated: July 14, 2025'
    },
    ar: {
      title: 'الشروط والأحكام - متجر سوا موب',
      backToHome: 'العودة للرئيسية',
      acceptance: 'القبول والموافقة',
      services: 'الخدمات المقدمة',
      ordersAndPrices: 'الطلبات والأسعار',
      delivery: 'التوصيل',
      inventory: 'إدارة المخزون',
      payment: 'طرق الدفع',
      cancellation: 'إلغاء الطلبات',
      warranty: 'الضمان',
      liability: 'المسؤولية',
      contact: 'التواصل',
      applicableLaw: 'القانون المطبق',
      intellectualProperty: 'حقوق الملكية الفكرية',
      termsModification: 'تعديل الشروط',
      serviceTermination: 'إنهاء الخدمة',
      acceptanceText: 'باستخدام موقع متجر سوا موب وخدماته، فإنك توافق على جميع الشروط والأحكام المذكورة أدناه.',
      service1: 'متجر سوا موب متخصص في بيع اكسسوارات الهواتف المحمولة',
      service2: 'نقدم خدمة التوصيل لجميع أنحاء جمهورية مصر العربية',
      service3: 'خدمة العملاء متاحة 24 ساعة طوال أيام الأسبوع',
      price1: 'الأسعار معرضة للتغيير حسب الأسعار العالمية وسعر صرف الجنيه المصري',
      price2: 'جميع الأسعار المعروضة بالجنيه المصري شاملة الضرائب',
      price3: 'الأسعار سارية وقت تأكيد الطلب فقط',
      delivery1: 'مدة التوصيل: 4-6 أيام كحد أقصى',
      delivery2: 'نوصل لجميع محافظات جمهورية مصر العربية',
      delivery3: 'يتم التواصل معك لتحديد موعد التسليم المناسب',
      inventory1: 'نطبق نظام إدارة المخزون التلقائي',
      inventory2: 'لا يمكن طلب منتجات غير متوفرة في المخزون',
      inventory3: 'في حالة نفاد المخزون بعد الطلب، سيتم التواصل معك فوراً',
      payment1: 'الدفع عند الاستلام (كاش)',
      payment2: 'البطاقات الائتمانية والخصم',
      payment3: 'المحافظ الإلكترونية المصرية',
      payment4: 'ميزة المصرية',
      cancel1: 'يمكن إلغاء الطلب قبل الشحن بالتواصل مع خدمة العملاء',
      cancel2: 'بعد شحن الطلب، يتم تطبيق سياسة الإرجاع والاستبدال',
      cancel3: 'في حالة الإلغاء، يتم استرداد المبلغ خلال 7-14 يوم عمل',
      warranty1: 'الضمان متاح حسب كل مورد ومنتج',
      warranty2: 'تفاصيل الضمان تكون مذكورة في وصف المنتج',
      warranty3: 'الضمان لا يشمل أضرار سوء الاستخدام',
      liability1: 'متجر سوا موب غير مسؤول عن أي أضرار ناتجة عن سوء الاستخدام',
      liability2: 'المتجر غير مسؤول عن الأضرار الناتجة عن عدم اتباع تعليمات الاستخدام',
      liability3: 'مسؤوليتنا تقتصر على توفير المنتج بالجودة المطلوبة',
      contactText: 'لأي استفسارات أو مشاكل:',
      contactPlaceholder: '📱 واتساب: 01001225846\n📧 إيميل: Aymanfaam@gmail.com\n📞 هاتف: 01001225846\n🕐 ساعات العمل: 24 ساعة، 7 أيام في الأسبوع',
      law1: 'متجر سوا موب مسجل رسمياً في جمهورية مصر العربية',
      law2: 'تخضع هذه الشروط للقانون المصري',
      law3: 'أي نزاعات تُحل وفقاً للقانون المصري',
      law4: 'المحاكم المصرية هي المختصة بالنظر في أي نزاعات',
      ip1: 'جميع المحتويات والعلامات التجارية محمية بحقوق الطبع والنشر',
      ip2: 'لا يجوز نسخ أو توزيع المحتوى دون إذن مكتوب',
      modify1: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت',
      modify2: 'التعديلات تصبح سارية فور نشرها على الموقع',
      modify3: 'استمرار استخدام الموقع يعني موافقتك على التعديلات',
      terminate1: 'نحتفظ بالحق في إنهاء أو تعليق الخدمة لأي مستخدم',
      terminate2: 'يحق لنا رفض أي طلب دون إبداء أسباب',
      terminate3: 'في حالة إنهاء الخدمة، تبقى هذه الشروط سارية',
      lastUpdate: 'تاريخ آخر تحديث: 14 يوليو 2025'
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
          
          {/* Acceptance Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('acceptance')}</h2>
            </div>
            <p className="text-gray-700">{t('acceptanceText')}</p>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('services')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('service1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('service2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('service3')}</span>
              </li>
            </ul>
          </div>

          {/* Orders & Prices Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('ordersAndPrices')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('price1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('price2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('price3')}</span>
              </li>
            </ul>
          </div>

          {/* Delivery Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('delivery')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('delivery1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('delivery2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('delivery3')}</span>
              </li>
            </ul>
          </div>

          {/* Inventory Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('inventory')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('inventory1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('inventory2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('inventory3')}</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('payment')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('payment1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('payment2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('payment3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('payment4')}</span>
              </li>
            </ul>
          </div>

          {/* Cancellation Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('cancellation')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('cancel1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('cancel2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('cancel3')}</span>
              </li>
            </ul>
          </div>

          {/* Warranty Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('warranty')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('warranty1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('warranty2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{t('warranty3')}</span>
              </li>
            </ul>
          </div>

          {/* Liability Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('liability')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t('liability1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t('liability2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t('liability3')}</span>
              </li>
            </ul>
          </div>

          {/* Applicable Law Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('applicableLaw')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t('law1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t('law2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t('law3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{t('law4')}</span>
              </li>
            </ul>
          </div>

          {/* Intellectual Property Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('intellectualProperty')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t('ip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>{t('ip2')}</span>
              </li>
            </ul>
          </div>

          {/* Terms Modification Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('termsModification')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t('modify1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t('modify2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>{t('modify3')}</span>
              </li>
            </ul>
          </div>

          {/* Service Termination Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('serviceTermination')}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('terminate1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('terminate2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>{t('terminate3')}</span>
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
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <p className="text-sm text-blue-800 italic">{t('lastUpdate')}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;