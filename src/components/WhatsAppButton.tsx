import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhatsAppButton = () => {
  const { t, isRTL } = useLanguage();
  
  const handleWhatsAppClick = () => {
    const phoneNumber = '+966542714708'; // Replace with actual WhatsApp number
    const message = encodeURIComponent('Hello! I would like to know more about your products.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`fixed z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex flex-col items-center gap-1 top-20 sm:top-20 md:top-20 ${
        isRTL ? 'left-4' : 'right-4'
      }`}
      style={{ 
        writingMode: 'vertical-rl',
        top: window.innerWidth <= 640 ? '70px' : '80px'
      }}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="text-xs font-medium whitespace-nowrap" style={{ writingMode: 'horizontal-tb' }}>
        {t('contactUs')}
      </span>
    </button>
  );
};

export default WhatsAppButton;