import React from 'react';
import { ArrowLeft, ArrowRight, Store, Eye, Target, Heart, Shield, Zap, Users, Phone, Clock, Award, Smartphone, TrendingUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutUsPage = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: 'About Us - Alive Food Store',
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
      
      aboutStoreText: 'Alive Food is not just a store, but a journey towards health and vitality. We believe that food is the source of energy and healing, so we offer you natural food products rich in nutrients, carefully prepared to enhance your health from within. We specialize in fermented foods rich in probiotics, natural collagen supplements, healthy cold-pressed juices, and live sprouts.',
      
      visionText: 'To be the trusted partner and first destination for everyone seeking to adopt a healthy and balanced lifestyle, by providing vital and innovative food products.',
      
      missionText: 'To provide the best high-quality natural products, made with love and passion, to nourish your bodies and minds, while spreading awareness about the importance of living food in achieving sustainable health.',
      
      feature1: 'Ingredient Quality',
      feature1Text: 'We use the finest natural and organic ingredients to ensure the highest levels of quality and effectiveness',
      feature2: 'Expertise & Professionalism',
      feature2Text: 'Our products are carefully prepared by experts in nutrition and living foods',
      feature3: 'Authenticity & Innovation',
      feature3Text: 'We offer traditional fermented recipes plus new innovations for modern needs',
      feature4: 'Fast & Safe Delivery',
      feature4Text: 'We ensure our fresh and vital products reach you quickly and in perfect condition',
      feature5: 'Support & Follow-up',
      feature5Text: 'We provide nutritional advice to help you get maximum benefit from our products',
      feature6: 'Smart Inventory Management',
      feature6Text: 'Automatic system ensures vital products are always available',
      
      productsText: 'We offer a comprehensive range of products that enhance your health and vitality, including:',
      product1: 'Fermented foods and probiotics',
      product2: 'Natural collagen supplements',
      product3: 'Cold-pressed healthy juices',
      product4: 'Live sprouts',
      product5: 'Natural food products',
      product6: 'And many other health-enhancing items',
      
      commitmentText: 'We are committed to providing the best possible experience, so we promise you:',
      commitment1: 'Unmatched quality with strict quality control',
      commitment2: 'Exceptional customer service always ready to help',
      commitment3: 'Flexible return policy because your satisfaction is our priority',
      commitment4: 'Complete transparency in ingredients and pricing with no hidden costs',
      commitment5: 'Data protection and privacy security is our responsibility',
      
      value1: 'Quality',
      value1Text: 'The foundation of everything we offer',
      value2: 'Transparency',
      value2Text: 'We believe in clarity at every step',
      value3: 'Health Awareness',
      value3Text: 'We strive to spread knowledge about the importance of nutrition',
      value4: 'Innovation',
      value4Text: 'Always seeking new ways to provide greater value to our customers',
      value5: 'Passion',
      value5Text: 'Every product is made with passion and love for health',
      
      service1: 'Free Nutritional Consultation',
      service1Text: 'Our team of experts is ready to help you choose the right products',
      service2: 'Fast Delivery',
      service2Text: 'We ensure your order arrives fresh and on time',
      service3: 'Continuous Technical Support',
      service3Text: 'We are here to answer all your questions',
      service4: 'Quality Guarantee',
      service4Text: 'Every product undergoes strict quality control',
      service5: 'Follow-up Service',
      service5Text: 'We follow up with you to ensure maximum benefit from our products',
      
      contactText: 'We are here to serve you always. Contact us via:',
      contactInfo: '📱 WhatsApp: +996542714708\n📧 Email: info@alivefood.store\n📞 Phone: +996542714708\n🕐 Working Hours: 24 hours, 7 days a week',
      
      thankYouText: 'Thank you for choosing Alive Food. We appreciate your trust in us and look forward to being part of your journey towards a healthier and happier life.',
      
      slogan: 'Alive Food - Because your health is your most precious possession'
    },
    ar: {
      title: 'من نحن - متجر Alive Food',
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
      
      aboutStoreText: '"Alive Food" ليس مجرد متجر، بل هو رحلة نحو الصحة والحيوية. نحن نؤمن بأن الغذاء هو مصدر الطاقة والشفاء، ولذلك نقدم لكم منتجات غذائية طبيعية وغنية بالمغذيات، تم إعدادها بعناية فائقة لتعزز صحتكم من الداخل. متخصصون في الأطعمة المخمرة الغنية بالبروبيوتيك، مكملات الكولاجين الطبيعية، العصائر الصحية المعصورة على البارد، والمبرعمات الحيوية.',
      
      visionText: 'أن نكون الشريك الموثوق والوجهة الأولى لكل من يسعى لتبني نمط حياة صحي ومتوازن، من خلال توفير منتجات غذائية حيوية ومبتكرة.',
      
      missionText: 'تقديم أفضل المنتجات الطبيعية عالية الجودة، المصنوعة بحب وشغف، لتغذية أجسامكم وعقولكم، مع نشر الوعي حول أهمية الغذاء الحي في تحقيق الصحة المستدامة.',
      
      feature1: 'جودة المكونات',
      feature1Text: 'نستخدم أجود المكونات الطبيعية والعضوية لضمان أعلى مستويات الجودة والفعالية',
      feature2: 'خبرة واحترافية',
      feature2Text: 'منتجاتنا يتم تحضيرها بعناية من قبل خبراء في التغذية والأغذية الحيوية',
      feature3: 'أصالة وتجديد',
      feature3Text: 'نقدم وصفات تقليدية ومخمرة غنية، بالإضافة إلى ابتكارات جديدة تناسب احتياجاتكم العصرية',
      feature4: 'توصيل سريع وآمن',
      feature4Text: 'نضمن وصول منتجاتنا الطازجة والحيوية إليك في أسرع وقت وبأفضل حالة',
      feature5: 'دعم ومتابعة',
      feature5Text: 'نقدم نصائح غذائية لمساعدتك في تحقيق أقصى استفادة من منتجاتنا',
      feature6: 'إدارة مخزون ذكية',
      feature6Text: 'نظام تلقائي يضمن توفر المنتجات الحيوية دائماً',
      
      productsText: 'نقدم مجموعة شاملة من المنتجات التي تعزز صحتك وحيويتك، وتشمل:',
      product1: 'المخمرات والبروبيوتيك',
      product2: 'مكملات الكولاجين الطبيعية',
      product3: 'العصائر الصحية المعصورة على البارد',
      product4: 'المبرعمات الحيوية',
      product5: 'منتجات غذائية طبيعية',
      product6: 'والعديد من المنتجات الأخرى المعززة للصحة',
      
      commitmentText: 'نحن ملتزمون بتقديم أفضل تجربة ممكنة، ولذلك نعدكم بـ:',
      commitment1: 'جودة لا تضاهى مع رقابة جودة صارمة',
      commitment2: 'خدمة عملاء استثنائية على استعداد دائم للمساعدة',
      commitment3: 'سياسة إرجاع مرنة لأن رضاكم هو أولويتنا',
      commitment4: 'شفافية كاملة في المكونات والأسعار، لا توجد أي تكاليف خفية',
      commitment5: 'حماية البيانات وأمان الخصوصية هي مسؤوليتنا',
      
      value1: 'الجودة',
      value1Text: 'هي أساس كل ما نقدمه',
      value2: 'الشفافية',
      value2Text: 'نؤمن بالوضوح في كل خطوة',
      value3: 'الوعي الصحي',
      value3Text: 'نسعى لنشر المعرفة حول أهمية الغذاء',
      value4: 'الابتكار',
      value4Text: 'دائماً نبحث عن طرق جديدة لتقديم قيمة أكبر لعملائنا',
      value5: 'الشغف',
      value5Text: 'كل منتج مصنوع بشغف وحب للصحة',
      
      service1: 'استشارات غذائية مجانية',
      service1Text: 'فريقنا من الخبراء جاهز لمساعدتك في اختيار المنتجات الأنسب لك',
      service2: 'التوصيل السريع',
      service2Text: 'نضمن وصول طلبك طازجًا وفي الوقت المحدد',
      service3: 'دعم فني مستمر',
      service3Text: 'نحن هنا للإجابة على جميع أسئلتك',
      service4: 'ضمان الجودة',
      service4Text: 'كل منتج يخضع لرقابة جودة صارمة',
      service5: 'خدمة المتابعة',
      service5Text: 'نتابع معك لضمان تحقيق أقصى استفادة من منتجاتنا',
      
      contactText: 'نحن هنا لخدمتك دائماً. تواصل معنا عبر:',
      contactInfo: '📱 واتساب: +996542714708\n📧 إيميل: info@alivefood.store\n📞 هاتف: +996542714708\n🕐 ساعات العمل: 24 ساعة، 7 أيام في الأسبوع',
      
      thankYouText: 'نشكرك على اختيار "Alive Food". نحن نقدر ثقتك فينا ونتطلع لأن نكون جزءًا من رحلتك نحو حياة أكثر صحة وسعادة.',
      
      slogan: 'Alive Food - لأن صحتك هي أغلى ما تملك'
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