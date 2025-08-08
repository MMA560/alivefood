import React from 'react';
import { ArrowLeft, ArrowRight, Store, Eye, Target, Heart, Shield, Zap, Users, Phone, Clock, Award, Smartphone, TrendingUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutUsPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'About Us - Sawa Mob Store',
      backToHome: 'Back to Home',
      aboutStore: 'About the Store',
      ourVision: 'Our Vision',
      ourMission: 'Our Mission',
      whatDistinguishesUs: 'What Distinguishes Us',
      ourProducts: 'Our Products',
      commitmentToCustomers: 'Our Commitment to Customers',
      ourValues: 'Our Values',
      premiumServices: 'Premium Services',
      contactUs: 'Contact Us',
      thankYou: 'Thank You for Your Trust',
      
      aboutStoreText: 'Sawa Store is your first destination for the latest and best mobile phone accessories in Egypt. We believe that a mobile phone is not just a device, but part of your personality and lifestyle.',
      
      visionText: 'To be the first choice for everyone looking for high-quality mobile phone accessories in Egypt, providing an exceptional shopping experience that combines quality and fair pricing.',
      
      missionText: 'We are committed to providing a diverse range of mobile phone accessories with the highest quality standards and competitive prices, with excellent customer service and fast, secure delivery throughout Egypt.',
      
      feature1: 'Wide Selection',
      feature1Text: 'We provide the latest accessories for leading brands',
      feature2: 'Guaranteed Quality',
      feature2Text: 'We carefully select our products from the best suppliers',
      feature3: 'Competitive Prices',
      feature3Text: 'We offer the best value for money',
      feature4: 'Fast Delivery',
      feature4Text: 'Professional delivery service in 4-6 days',
      feature5: '24/7 Customer Service',
      feature5Text: 'Continuous technical support throughout the week',
      feature6: 'Smart Inventory Management',
      feature6Text: 'Automatic system ensures products are always available',
      
      productsText: 'We offer a comprehensive range of mobile phone accessories including:',
      product1: 'Protection devices and cases',
      product2: 'Chargers and cables',
      product3: 'Phone holders',
      product4: 'Power banks',
      product5: 'Screen protectors',
      product6: 'And many other accessories',
      
      commitmentText: 'We understand that customer satisfaction is the foundation of our success, so we commit to:',
      commitment1: 'Providing high-quality products',
      commitment2: 'Excellent and responsive customer service',
      commitment3: 'Flexible return and exchange policy',
      commitment4: 'Transparent pricing with no hidden costs',
      commitment5: 'Protecting customer data and privacy',
      
      value1: 'Quality',
      value1Text: 'We select each product with extreme care',
      value2: 'Trust',
      value2Text: 'We build long-term relationships with our customers',
      value3: 'Transparency',
      value3Text: 'We deal clearly in all our transactions',
      value4: 'Innovation',
      value4Text: 'We always strive to improve the shopping experience',
      value5: 'Professionalism',
      value5Text: 'We maintain the highest service standards',
      
      service1: 'Free Delivery',
      service1Text: 'On orders above a certain limit',
      service2: 'Secure Payment',
      service2Text: 'Multiple and secure payment methods',
      service3: 'Free Consultation',
      service3Text: 'Expert team to help you choose',
      service4: 'Warranty',
      service4Text: 'Warranty on all products according to supplier',
      service5: 'Follow-up',
      service5Text: 'We follow up with you until your order arrives safely',
      
      contactText: 'We are here to serve you always. Contact us via:',
      contactInfo: '📱 WhatsApp: 01001225846\n📧 Email: Aymanfaam@gmail.com\n📞 Phone: 01001225846\n🕐 Working Hours: 24 hours, 7 days a week',
      
      thankYouText: 'Thank you for choosing Sawa Store. We appreciate your trust in us and promise to provide the best shopping experience possible. Together, we make your phone reflect your unique personality.',
      
      slogan: 'Sawa Store - Because your phone deserves the best'
    },
    ar: {
      title: 'من نحن - متجر سوا موب',
      backToHome: 'العودة للرئيسية',
      aboutStore: 'نبذة عن المتجر',
      ourVision: 'رؤيتنا',
      ourMission: 'رسالتنا',
      whatDistinguishesUs: 'ما يميزنا',
      ourProducts: 'منتجاتنا',
      commitmentToCustomers: 'التزامنا تجاه العملاء',
      ourValues: 'قيمنا',
      premiumServices: 'الخدمات المميزة',
      contactUs: 'تواصل معنا',
      thankYou: 'شكراً لثقتك',
      
      aboutStoreText: 'متجر سوا هو وجهتك الأولى للحصول على أحدث وأفضل اكسسوارات الهواتف المحمولة في مصر. نحن نؤمن بأن الهاتف المحمول ليس مجرد جهاز، بل هو جزء من شخصيتك وأسلوب حياتك.',
      
      visionText: 'أن نكون الخيار الأول لكل من يبحث عن اكسسوارات الهواتف المحمولة عالية الجودة في مصر، مع توفير تجربة تسوق استثنائية تجمع بين الجودة والسعر المناسب.',
      
      missionText: 'نلتزم بتوفير مجموعة متنوعة من اكسسوارات الهواتف المحمولة بأعلى معايير الجودة وبأسعار تنافسية، مع خدمة عملاء متميزة وتوصيل سريع وآمن لجميع أنحاء مصر.',
      
      feature1: 'تشكيلة واسعة',
      feature1Text: 'نوفر أحدث الاكسسوارات للعلامات التجارية الرائدة',
      feature2: 'جودة مضمونة',
      feature2Text: 'نختار منتجاتنا بعناية من أفضل الموردين',
      feature3: 'أسعار تنافسية',
      feature3Text: 'نقدم أفضل قيمة مقابل المال',
      feature4: 'توصيل سريع',
      feature4Text: 'خدمة توصيل احترافية في 4-6 أيام',
      feature5: 'خدمة عملاء 24/7',
      feature5Text: 'دعم فني متواصل طوال أيام الأسبوع',
      feature6: 'إدارة مخزون ذكية',
      feature6Text: 'نظام تلقائي يضمن توفر المنتجات دائماً',
      
      productsText: 'نقدم مجموعة شاملة من اكسسوارات الهواتف المحمولة تشمل:',
      product1: 'أجهزة الحماية والكفرات',
      product2: 'الشواحن والكابلات',
      product3: 'حوامل الهواتف',
      product4: 'بطاريات الطوارئ',
      product5: 'شاشات الحماية',
      product6: 'والعديد من الاكسسوارات الأخرى',
      
      commitmentText: 'نحن نفهم أن رضا العملاء هو أساس نجاحنا، لذلك نلتزم بـ:',
      commitment1: 'توفير منتجات عالية الجودة',
      commitment2: 'خدمة عملاء متميزة ومتجاوبة',
      commitment3: 'سياسة إرجاع واستبدال مرنة',
      commitment4: 'أسعار شفافة بدون تكاليف خفية',
      commitment5: 'حماية بيانات العملاء والخصوصية',
      
      value1: 'الجودة',
      value1Text: 'نختار كل منتج بعناية فائقة',
      value2: 'الثقة',
      value2Text: 'نبني علاقات طويلة الأمد مع عملائنا',
      value3: 'الشفافية',
      value3Text: 'نتعامل بوضوح في جميع معاملاتنا',
      value4: 'الابتكار',
      value4Text: 'نسعى دائماً لتحسين تجربة التسوق',
      value5: 'الاحترافية',
      value5Text: 'نحافظ على أعلى معايير الخدمة',
      
      service1: 'التوصيل المجاني',
      service1Text: 'على الطلبات التي تزيد عن حد معين',
      service2: 'الدفع الآمن',
      service2Text: 'طرق دفع متعددة وآمنة',
      service3: 'الاستشارة المجانية',
      service3Text: 'فريق خبراء لمساعدتك في الاختيار',
      service4: 'الضمان',
      service4Text: 'ضمان على جميع المنتجات حسب المورد',
      service5: 'المتابعة',
      service5Text: 'نتابع معك حتى وصول طلبك بأمان',
      
      contactText: 'نحن هنا لخدمتك دائماً. تواصل معنا عبر:',
      contactInfo: '📱 واتساب: 01001225846\n📧 إيميل: Aymanfaam@gmail.com\n📞 هاتف: 01001225846\n🕐 ساعات العمل: 24 ساعة، 7 أيام في الأسبوع',
      
      thankYouText: 'نشكرك على اختيارك متجر سوا. نحن نقدر ثقتك بنا ونعدك بتقديم أفضل تجربة تسوق ممكنة. معاً، نجعل هاتفك يعكس شخصيتك الفريدة.',
      
      slogan: 'متجر سوا - لأن هاتفك يستحق الأفضل'
    }
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
          
          {/* About Store Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Store className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('aboutStore')}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{t('aboutStoreText')}</p>
          </div>

          {/* Vision Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('ourVision')}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{t('visionText')}</p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('ourMission')}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{t('missionText')}</p>
          </div>

          {/* What Distinguishes Us Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('whatDistinguishesUs')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">{t('feature1')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('feature1Text')}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">{t('feature2')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('feature2Text')}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">{t('feature3')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('feature3Text')}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">{t('feature4')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('feature4Text')}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-pink-600" />
                  <h3 className="font-semibold text-pink-800">{t('feature5')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('feature5Text')}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-indigo-800">{t('feature6')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('feature6Text')}</p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('ourProducts')}</h2>
            </div>
            <p className="text-gray-700 mb-4">{t('productsText')}</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                <span className="text-gray-700">{t('product1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                <span className="text-gray-700">{t('product2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                <span className="text-gray-700">{t('product3')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                <span className="text-gray-700">{t('product4')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                <span className="text-gray-700">{t('product5')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                <span className="text-gray-700">{t('product6')}</span>
              </div>
            </div>
          </div>

          {/* Customer Commitment Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('commitmentToCustomers')}</h2>
            </div>
            <p className="text-gray-700 mb-4">{t('commitmentText')}</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{t('commitment1')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{t('commitment2')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{t('commitment3')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{t('commitment4')}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{t('commitment5')}</span>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-gold-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('ourValues')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">{t('value1')}</h3>
                <p className="text-gray-700 text-sm">{t('value1Text')}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">{t('value2')}</h3>
                <p className="text-gray-700 text-sm">{t('value2Text')}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">{t('value3')}</h3>
                <p className="text-gray-700 text-sm">{t('value3Text')}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">{t('value4')}</h3>
                <p className="text-gray-700 text-sm">{t('value4Text')}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
                <h3 className="font-semibold text-pink-800 mb-2">{t('value5')}</h3>
                <p className="text-gray-700 text-sm">{t('value5Text')}</p>
              </div>
            </div>
          </div>

          {/* Premium Services Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('premiumServices')}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">{t('service1')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('service1Text')}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">{t('service2')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('service2Text')}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">{t('service3')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('service3Text')}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">{t('service4')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('service4Text')}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-pink-600" />
                  <h3 className="font-semibold text-pink-800">{t('service5')}</h3>
                </div>
                <p className="text-gray-700 text-sm">{t('service5Text')}</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">{t('contactUs')}</h2>
            </div>
            <p className="text-gray-700 mb-4">{t('contactText')}</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-gray-700 whitespace-pre-wrap">{t('contactInfo')}</pre>
            </div>
          </div>

          {/* Thank You Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-md p-6 mb-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6" />
              <h2 className="text-2xl font-bold">{t('thankYou')}</h2>
            </div>
            <p className="leading-relaxed mb-4">{t('thankYouText')}</p>
            <div className="text-center">
              <p className="text-xl font-semibold italic">{t('slogan')}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;