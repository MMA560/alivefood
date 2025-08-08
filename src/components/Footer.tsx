import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, Instagram } from 'lucide-react';

// TikTok Icon Component
const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>
  </svg>
);

// Snapchat Icon Component
const SnapchatIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.752-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
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
                <span className="text-green-600">0548081628</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail size={16} className="text-green-600" />
                <span className="text-green-600">info@alivefood.store</span>
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
              <a href="https://t.snapchat.com/i0zqitUO" className="text-green-600 hover:text-green-700 transition-colors">
                <SnapchatIcon size={20} />
              </a>
              <a href="https://www.tiktok.com/@rasheda.collagenn?_t=ZS-8yiGlrg7sZk&_r=1" className="text-green-600 hover:text-green-700 transition-colors">
                <TikTokIcon size={20} />
              </a>
              <a href="https://www.instagram.com/rashida.collagen?igsh=bzQzMXhucXhpbDN6&utm_source=qr" className="text-green-600 hover:text-green-700 transition-colors">
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