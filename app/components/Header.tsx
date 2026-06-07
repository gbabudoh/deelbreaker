'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, User, LogOut, Home, Search, ShoppingBag, Heart, Bell, ChevronRight, MapPin, Search as SearchIcon, Globe, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useCart } from '@/lib/cart-context';
import { useRole } from '@/lib/role-context';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh-hans', name: '简体中文 (Simplified Chinese)', flag: '🇨🇳' },
  { code: 'zh-hant', name: '繁體中文 (Traditional Chinese)', flag: '🇭🇰' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' }
]

const AVAILABLE_COUNTRIES = [
  { code: '', name: 'All Countries', flag: '🌍' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('London');
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');
  const { items, totalCount } = useCart();
  const { role, isLoading } = useRole();
  const isSeller = role === 'SELLER';

  const handleCartClick = () => {
    if (items.length === 0) {
      router.push('/deals');
    } else if (items.length === 1) {
      router.push(`/checkout/${items[0].id}?quantity=${items[0].quantity}`);
    } else {
      router.push('/cart');
    }
  };

  useEffect(() => {
    if (i18n.language) {
      const fullCode = i18n.language.toLowerCase();
      if (fullCode.startsWith('zh-hans') || fullCode.startsWith('zh-cn')) {
        setCurrentLang('zh-hans');
      } else if (fullCode.startsWith('zh-hant') || fullCode.startsWith('zh-tw') || fullCode.startsWith('zh-hk')) {
        setCurrentLang('zh-hant');
      } else {
        setCurrentLang(i18n.language.split('-')[0]);
      }
    }

    if (typeof window !== 'undefined') {
      const savedCountry = localStorage.getItem('user-country');
      if (savedCountry) {
        setSelectedCountry(savedCountry);
        setLocation(AVAILABLE_COUNTRIES.find(c => c.code === savedCountry)?.name || 'United States');
      } else {
        const locale = window.navigator.language.split('-')[1];
        const code = (locale && ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'JP'].includes(locale.toUpperCase())) 
          ? locale.toUpperCase() 
          : 'US';
        setSelectedCountry(code);
        localStorage.setItem('user-country', code);
        setLocation(AVAILABLE_COUNTRIES.find(c => c.code === code)?.name || 'United States');
      }
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
    setIsLangOpen(false);
  };

  const changeCountry = (code: string) => {
    localStorage.setItem('user-country', code);
    setSelectedCountry(code);
    setLocation(AVAILABLE_COUNTRIES.find(c => c.code === code)?.name || 'United States');
    setIsCountryOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('countryChange'));
    }
  };

  const navItems = [
    { name: t('discover_deals'), href: '/deals' },
    { name: isSeller ? 'Seller Hub' : 'Dashboard', href: isSeller ? '/seller' : '/consumer/dashboard' },
    ...(isSeller ? [] : [{ name: 'For Merchants', href: '/merchant' }]),
    { name: 'How It Works', href: '#features' }
  ];

  // Mobile bottom navigation items
  const mobileNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deals', href: '/deals', icon: Search },
    { name: 'Cart', href: '/cart', icon: ShoppingBag },
    { name: 'Saved', href: '/consumer/dashboard?tab=saved', icon: Heart },
    { name: 'Profile', href: session ? '/consumer/dashboard?tab=profile' : '/auth/signin', icon: User },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <>
      {/* Desktop Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-top"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center h-16 lg:h-20 gap-4 lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center space-x-2">
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-lg flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-black tracking-tighter text-gray-900">
                DEELBREAKER
              </span>
            </Link>

            {/* Desktop Search Center */}
            <div className="hidden md:flex flex-1 items-center bg-gray-100 rounded-full px-4 py-1.5 lg:py-2 border border-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F3AF7B]/20 transition-all">
              <div className="flex items-center flex-1 border-r border-gray-300 mr-4">
                <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search for deals, shops, services..."
                  className="bg-transparent border-none outline-none w-full text-sm text-gray-800 placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center w-40 lg:w-48">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  className="bg-transparent border-none outline-none w-full text-sm text-gray-800"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button className="bg-[#F3AF7B] hover:bg-[#e29e6a] text-white p-2 lg:p-2.5 rounded-full ml-2 transition-colors">
                <SearchIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
              {/* Country Selector */}
              <div className="relative">
                <button
                  onClick={() => { setIsCountryOpen(!isCountryOpen); setIsLangOpen(false); }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-semibold py-2 px-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow transition-all cursor-pointer relative z-50"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="flex items-center gap-1">
                    <span>{AVAILABLE_COUNTRIES.find(c => c.code === selectedCountry)?.flag ?? '🌍'}</span>
                    <span>{selectedCountry || 'Global'}</span>
                  </span>
                </button>

                {isCountryOpen && (
                  <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsCountryOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Select Country
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {AVAILABLE_COUNTRIES.map((country) => {
                          const isSelected = selectedCountry === country.code;
                          return (
                            <button
                              key={country.code || 'all'}
                              onClick={() => changeCountry(country.code)}
                              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-[#F3AF7B]/10 text-[#e09153]'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="text-base">{country.flag}</span>
                                <span>{country.name}</span>
                              </span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#F3AF7B]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => { setIsLangOpen(!isLangOpen); setIsCountryOpen(false); }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-semibold py-2 px-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow transition-all cursor-pointer relative z-50"
                >
                  <Globe className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="flex items-center gap-1">
                    <span>{languages.find(l => l.code === currentLang)?.flag || '🌍'}</span>
                    <span>{(languages.find(l => l.code === currentLang)?.code || currentLang).toUpperCase()}</span>
                  </span>
                </button>

                {isLangOpen && (
                  <>
                    {/* Backdrop overlay to close when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsLangOpen(false)} 
                    />
                    
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Select Language
                      </div>
                      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {languages.map((lang) => {
                          const isSelected = currentLang === lang.code;
                          return (
                            <button
                              key={lang.code}
                              onClick={() => changeLanguage(lang.code)}
                              className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#F3AF7B]/10 text-[#e09153]' 
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="text-base">{lang.flag}</span>
                                <span>{lang.name}</span>
                              </span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F3AF7B]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link href="/consumer/dashboard?tab=saved" className={`flex items-center gap-1.5 transition-colors ${isActive('/consumer/dashboard') && pathname.includes('saved') ? 'text-[#F3AF7B]' : 'text-gray-600 hover:text-gray-900'}`}>
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">{t('saved_deals')}</span>
              </Link>
              <button
                onClick={handleCartClick}
                className={`relative flex items-center gap-1.5 transition-colors cursor-pointer ${totalCount > 0 || pathname.startsWith('/cart') || pathname.startsWith('/checkout') ? 'text-[#F3AF7B]' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {totalCount > 0 && (
                    <motion.span
                      key={totalCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#F3AF7B] rounded-full flex items-center justify-center px-1"
                    >
                      <span className="text-[10px] font-black text-white leading-none">{totalCount > 99 ? '99+' : totalCount}</span>
                    </motion.span>
                  )}
                </div>
                <span className="text-sm font-medium">Cart</span>
              </button>
              
              {status === 'loading' ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center gap-3 relative">
                  {!role && !isLoading && (
                    <Link
                      href="/onboarding"
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#F3AF7B] hover:bg-[#e09153] px-3 py-1.5 rounded-full transition-colors animate-pulse"
                    >
                      <Zap className="w-3 h-3" />
                      Complete Setup
                    </Link>
                  )}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{session.user?.name?.split(' ')[0]}</span>
                    {isSeller && (
                      <span className="text-[10px] font-bold bg-[#F3AF7B]/15 text-[#F3AF7B] px-1.5 py-0.5 rounded-full leading-none">
                        Seller
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800">{session.user?.name}</p>
                          <p className="text-sm text-gray-500">{session.user?.email}</p>
                          {role && (
                            <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                              isSeller ? 'bg-[#F3AF7B]/15 text-[#F3AF7B]' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {isSeller ? 'Seller Account' : 'Buyer Account'}
                            </span>
                          )}
                        </div>

                        {isSeller ? (
                          <Link
                            href="/seller"
                            className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <span className="flex items-center gap-2">
                              <Store className="w-4 h-4 text-[#F3AF7B]" />
                              Seller Dashboard
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        ) : (
                          <Link
                            href="/consumer/dashboard"
                            className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        )}

                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => { handleSignOut(); setIsUserMenuOpen(false); }}
                          className="cursor-pointer w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-orange-100 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center ml-auto gap-3">
              <button className="md:hidden p-2 text-gray-600">
                <SearchIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="text-lg font-bold text-gray-800">Menu</span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors touch-target"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* User Section */}
                  {session ? (
                    <div className="p-4 bg-gradient-to-r from-[#F3AF7B]/10 to-[#F4C2B8]/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{session.user?.name}</p>
                          <p className="text-sm text-gray-500">{session.user?.email}</p>
                          {role && (
                            <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                              isSeller ? 'bg-[#F3AF7B]/15 text-[#F3AF7B]' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {isSeller ? 'Seller' : 'Buyer'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-[#F3AF7B]/10 to-[#F4C2B8]/10">
                      <p className="text-gray-600 mb-3">Sign in to access all features</p>
                      <div className="flex gap-2">
                        <Link
                          href="/auth/signin"
                          className="flex-1 text-center py-2.5 border border-[#F3AF7B] text-[#F3AF7B] rounded-xl font-medium touch-active"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="flex-1 text-center py-2.5 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl font-medium touch-active"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex-1 overflow-y-auto py-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-4 font-medium transition-colors touch-active ${
                          isActive(item.href)
                            ? 'text-[#F3AF7B] bg-[#F3AF7B]/5'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Country Selector */}
                  <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Country</label>
                    <div className="relative">
                      <select
                        value={selectedCountry}
                        onChange={(e) => changeCountry(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25em 1.25em',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        {AVAILABLE_COUNTRIES.map((country) => (
                          <option key={country.code || 'all'} value={country.code}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mobile Language Switcher */}
                  <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Language</label>
                    <div className="relative">
                      <select 
                        value={currentLang}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25em 1.25em',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  {session && (
                    <div className="p-4 border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 text-red-600 bg-red-50 rounded-xl font-medium touch-active"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-bottom">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isCart = item.href === '/cart';
            const active = isCart
              ? totalCount > 0 || pathname.startsWith('/cart') || pathname.startsWith('/checkout')
              : isActive(item.href);

            const content = (
              <>
                <div className={`relative p-1.5 rounded-xl transition-colors ${active ? 'bg-[#F3AF7B]/10' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                  {isCart && totalCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 bg-[#F3AF7B] rounded-full flex items-center justify-center px-0.5">
                      <span className="text-[8px] font-black text-white leading-none">{totalCount > 9 ? '9+' : totalCount}</span>
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${active ? 'text-[#F3AF7B]' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </>
            );

            if (isCart) {
              return (
                <button
                  key={item.name}
                  onClick={handleCartClick}
                  className={`flex flex-col items-center justify-center py-2 px-3 min-w-[64px] touch-active cursor-pointer ${active ? 'text-[#F3AF7B]' : 'text-gray-500'}`}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-[64px] touch-active ${active ? 'text-[#F3AF7B]' : 'text-gray-500'}`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
