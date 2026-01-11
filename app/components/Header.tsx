'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, User, LogOut, Home, Search, ShoppingBag, Heart, Bell, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const navItems = [
    { name: 'Deals', href: '/deals' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'For Merchants', href: '/merchant' },
    { name: 'How It Works', href: '#features' }
  ];

  // Mobile bottom navigation items
  const mobileNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deals', href: '/deals', icon: Search },
    { name: 'Orders', href: '/dashboard?tab=active', icon: ShoppingBag },
    { name: 'Saved', href: '/dashboard?tab=saved', icon: Heart },
    { name: 'Profile', href: session ? '/dashboard?tab=profile' : '/auth/signin', icon: User },
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
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 safe-top lg:bg-white/95 lg:backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] bg-clip-text text-transparent">
                Deelbreaker
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'text-[#F3AF7B]' 
                      : 'text-gray-600 hover:text-[#F3AF7B]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-[#F3AF7B] transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{session.user?.name?.split(' ')[0]}</span>
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800">{session.user?.name}</p>
                          <p className="text-sm text-gray-500">{session.user?.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>Dashboard</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                        <Link
                          href="/dashboard?tab=profile"
                          className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>Profile Settings</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleSignOut}
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
                <>
                  <Link
                    href="/auth/signin"
                    className="text-gray-600 hover:text-[#F3AF7B] transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-300 touch-active"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Right Section */}
            <div className="flex lg:hidden items-center gap-2">
              {session && (
                <button className="cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors touch-target"
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
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-[64px] touch-active ${
                  active ? 'text-[#F3AF7B]' : 'text-gray-500'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-[#F3AF7B]/10' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-xs mt-1 font-medium ${active ? 'text-[#F3AF7B]' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
