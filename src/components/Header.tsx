import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

const Header = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchButton = document.querySelector('.mobile-search-button');
      const searchContainer = document.querySelector('.mobile-search');
      
      if (isMobileSearchOpen && 
          !(event.target as Element).closest('.mobile-search') &&
          !(event.target as Element).closest('.mobile-search-button')) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileSearchOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-200' 
        : 'bg-white/90 backdrop-blur-sm border-b border-green-100 shadow-sm'
    }`}>
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Enhanced Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-green-700 hover:text-green-800 transition-all duration-300 flex-shrink-0 relative group"
          >
            <span className="relative z-10">{t('storeName')}</span>
            <div className="absolute inset-0 bg-green-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
          </Link>
          
          {/* Enhanced Search Bar - Desktop */}
          <div className="flex-1 max-w-md mx-4 relative">
            <SearchBar />
          </div>
          
          {/* Enhanced Right Side Controls */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Enhanced Language Toggle */}
            <div className="flex items-center gap-1 bg-green-50 rounded-full p-1 shadow-sm border border-green-100">
              <Button
                variant={language === 'ar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('ar')}
                className={`px-3 py-2 text-xs rounded-full transition-all duration-300 ${
                  language === 'ar' 
                    ? 'bg-green-600 text-white shadow-md transform scale-105' 
                    : 'text-green-700 hover:bg-green-100 hover:scale-105'
                }`}
              >
                ع
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className={`px-3 py-2 text-xs rounded-full transition-all duration-300 ${
                  language === 'en' 
                    ? 'bg-green-600 text-white shadow-md transform scale-105' 
                    : 'text-green-700 hover:bg-green-100 hover:scale-105'
                }`}
              >
                EN
              </Button>
            </div>
            
            {/* Enhanced Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-green-200 hover:border-green-300 relative group"
            >
              <ShoppingCart className="w-5 h-5 text-green-700 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-green-700 font-medium">{t('cart')}</span>
              {totalItems > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-pulse shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Enhanced Mobile Layout */}
        <div className="md:hidden">
          {/* Enhanced Top Row: Logo, Search Icon, Menu Toggle, Cart */}
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="text-xl font-bold text-green-700 hover:text-green-800 transition-all duration-300 relative group"
            >
              <span className="relative z-10">{t('storeName')}</span>
              <div className="absolute inset-0 bg-green-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
            </Link>
            
            <div className="flex items-center gap-3">
              {/* Mobile Search Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`mobile-search-button p-2 rounded-full transition-all duration-300 ${
                  isMobileSearchOpen 
                    ? 'bg-green-100 text-green-700' 
                    : 'hover:bg-green-100 text-green-700'
                }`}
              >
                {isMobileSearchOpen ? (
                  <X className="w-5 h-5 text-green-700" />
                ) : (
                  <Search className="w-5 h-5 text-green-700" />
                )}
              </Button>
              
              {/* Enhanced Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-green-100 rounded-full transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-green-700" />
                ) : (
                  <Menu className="w-5 h-5 text-green-700" />
                )}
              </Button>
              
              {/* Enhanced Cart Button - Mobile */}
              <Link
                to="/cart"
                className="flex items-center gap-2 bg-green-100 hover:bg-green-200 px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 border border-green-200 hover:border-green-300 relative group"
              >
                <ShoppingCart className="w-4 h-4 text-green-700 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-green-700 font-medium text-sm">{t('cart')}</span>
                {totalItems > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center animate-pulse shadow-md">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
          
          {/* Enhanced Mobile Search Bar - Only shows when toggled */}
          {isMobileSearchOpen && (
            <div className="mobile-search w-full relative mt-3 animate-slide-down">
              <SearchBar />
            </div>
          )}

          {/* Enhanced Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl border-b border-green-200 mx-4 rounded-2xl mt-2 overflow-hidden animate-slide-down">
              <div className="p-6 space-y-4">
                {/* Enhanced Language Toggle - Mobile Menu */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-1 bg-green-50 rounded-full p-1 shadow-sm border border-green-100">
                    <Button
                      variant={language === 'ar' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setLanguage('ar');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                        language === 'ar' 
                          ? 'bg-green-600 text-white shadow-md' 
                          : 'text-green-700 hover:bg-green-100'
                      }`}
                    >
                      العربية
                    </Button>
                    <Button
                      variant={language === 'en' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setLanguage('en');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                        language === 'en' 
                          ? 'bg-green-600 text-white shadow-md' 
                          : 'text-green-700 hover:bg-green-100'
                      }`}
                    >
                      English
                    </Button>
                  </div>
                </div>

                {/* Additional Mobile Menu Items */}
                <div className="space-y-3 pt-4 border-t border-green-100">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-green-700 hover:bg-green-50 rounded-xl transition-all duration-300 font-medium"
                  >
                    {t('home') || 'Home'}
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-green-700 hover:bg-green-50 rounded-xl transition-all duration-300 font-medium"
                  >
                    {t('categories') || 'Categories'}
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-green-700 hover:bg-green-50 rounded-xl transition-all duration-300 font-medium"
                  >
                    {t('about') || 'About'}
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-green-700 hover:bg-green-50 rounded-xl transition-all duration-300 font-medium"
                  >
                    {t('contact') || 'Contact'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Sticky Effect Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-green-700 transform transition-all duration-300 ${
        isScrolled ? 'scale-x-100' : 'scale-x-0'
      }`}></div>
    </header>
  );
};

export default Header;