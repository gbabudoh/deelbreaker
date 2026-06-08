'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Cookie, CheckCircle2, Save, Info, Sparkles } from 'lucide-react';

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  advertising: boolean;
}

export default function CookiesClient() {
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Always active
    analytics: true,
    functional: true,
    advertising: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load cookies preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('cookie-preferences');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({
            essential: true,
            analytics: parsed.analytics ?? true,
            functional: parsed.functional ?? true,
            advertising: parsed.advertising ?? false
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleToggle = (key: keyof CookieSettings) => {
    if (key === 'essential') return; // Cannot toggle essential
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cookie-preferences', JSON.stringify(settings));
      }
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const Toggle = ({ enabled, onToggle, disabled = false }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        disabled ? 'bg-orange-200 cursor-not-allowed' : enabled ? 'bg-[#F3AF7B]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-br from-[#df874e]/15 via-white to-[#cc6855]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153]">
              <Cookie className="w-3.5 h-3.5" />
              Consent Settings
            </span>
            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
              Cookie <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Preferences</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Last Updated: June 8, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Cookies Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Explanations */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-black text-gray-900">About Cookies</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Cookies are small text files that websites store on your computer or mobile device. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              We use cookies to maintain your login session, store your settings (like language or country), track platform analytics, and customize your deals recommendations.
            </p>
            
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white border border-gray-800 flex items-start gap-4">
              <Info className="w-5 h-5 text-[#F3AF7B] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Managing Browser Cookies</h4>
                <p className="text-gray-300 text-xs leading-relaxed mt-1">
                  You can also block or delete cookies directly in your web browser settings. Disabling essential cookies will prevent you from signing in to the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Preferences Panel */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs space-y-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900">Customise Preferences</h3>
                <AnimatePresence>
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-green-600 font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Saved!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Cookie Types */}
              <div className="space-y-6">
                {[
                  {
                    key: 'essential' as keyof CookieSettings,
                    title: 'Essential Cookies',
                    desc: 'Required for platform functionality, security features, session persistence, and logins. These cannot be disabled.',
                    disabled: true
                  },
                  {
                    key: 'functional' as keyof CookieSettings,
                    title: 'Functional Cookies',
                    desc: 'Used to remember configuration values like your country selector preferences and default dashboard language.',
                    disabled: false
                  },
                  {
                    key: 'analytics' as keyof CookieSettings,
                    title: 'Performance & Analytics',
                    desc: 'Helps us analyze traffic statistics, check platform speed, and understand how users navigate the marketplace.',
                    disabled: false
                  },
                  {
                    key: 'advertising' as keyof CookieSettings,
                    title: 'Targeting & Personalisation',
                    desc: 'Allows us to record your interests and display targeted deals or recommendations relative to your activity.',
                    disabled: false
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between gap-4 p-4 hover:bg-gray-50/50 rounded-2xl border border-gray-50 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <Toggle
                        enabled={settings[item.key]}
                        onToggle={() => handleToggle(item.key)}
                        disabled={item.disabled}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3.5 bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Cookie Preferences
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer pushes to bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
