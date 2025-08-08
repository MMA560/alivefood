import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';

// TikTok Icon Component
const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-green-50 border-t border-green-100 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Store Info Column */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold text-green-700 mb-4">
              {t('storeName')}
            </h3>
            <p className="text-green-600 mb-6">
              {t('storeDescription')}
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone size={16} className="text-green-600" />
                <span className="text-green-600">01033156756</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail size={16} className="text-green-600" />
                <span className="text-green-600">info@websonic.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-green-700 mb-4">
              {t('quickLinks')}
            </h4>
            <div className="flex flex-col gap-2">
              <a 
                href="/about-us" 
                className="text-green-600 hover:text-green-700 transition-colors text-sm"
              >
                {t('aboutUs')}
              </a>
              <a 
                href="/return-policies" 
                className="text-green-600 hover:text-green-700 transition-colors text-sm"
              >
                {t('returnPolicy')}
              </a>
              <a 
                href="/terms-and-conditions" 
                className="text-green-600 hover:text-green-700 transition-colors text-sm"
              >
                {t('termsConditions')}
              </a>
              <a 
                href="/privacy-policy" 
                className="text-green-600 hover:text-green-700 transition-colors text-sm"
              >
                {t('privacyPolicy')}
              </a>
            </div>
          </div>

          {/* Social Media Column */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-green-700 mb-4">
              {t('followUs')}
            </h4>
            <div className="flex justify-center md:justify-start space-x-6 space-x-reverse">
              <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                <TikTokIcon size={20} />
              </a>
              <a href="#" className="text-green-600 hover:text-green-700 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-green-200 mt-6 pt-4 text-center">
          <div className="text-sm text-green-500">
            © 2025 {t('storeName')}. جميع الحقوق محفوظة.
          </div>
          <div className="text-xs text-green-400 mt-1">
            تم التطوير بواسطة ويب سونيك Web Sonic
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;