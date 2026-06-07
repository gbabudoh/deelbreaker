'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Zap, MapPin, ShoppingBag, Utensils, Plane, Laptop, Sparkles,
  CheckCircle, Bell, Mail, ArrowRight, ArrowLeft, Check
} from 'lucide-react';
import { useRole } from '@/lib/role-context';

const categories = [
  { id: 'local', label: 'Local Deals', icon: MapPin, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'dining', label: 'Dining', icon: Utensils, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'tech', label: 'Technology', icon: Laptop, color: 'from-gray-700 to-gray-900', bg: 'bg-gray-100', border: 'border-gray-300' },
  { id: 'beauty', label: 'Beauty', icon: Sparkles, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`transition-all duration-300 rounded-full flex items-center justify-center ${
              i < current
                ? 'w-7 h-7 bg-[#F3AF7B]'
                : i === current
                ? 'w-7 h-7 bg-[#F3AF7B] ring-4 ring-[#F3AF7B]/20'
                : 'w-3 h-3 bg-gray-200'
            }`}
          >
            {i < current && <Check className="w-4 h-4 text-white" />}
            {i === current && <span className="text-white text-xs font-bold">{i + 1}</span>}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-8 rounded-full transition-all duration-300 ${i < current ? 'bg-[#F3AF7B]' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
          enabled ? 'bg-[#F3AF7B]' : 'bg-gray-200'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function BuyerOnboardingPage() {
  const { data: session } = useSession();
  const { completeOnboarding } = useRole();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('db_buyer_prefs', JSON.stringify({
        categories: selectedCategories,
        city,
        pushNotif,
        emailNotif,
      }));
    } catch {}
    completeOnboarding();
    router.push('/consumer/dashboard');
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between py-5 px-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] bg-clip-text text-transparent">
            Deelbreaker
          </span>
        </div>
        <StepIndicator current={step} total={3} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* Step 1 — Interests */}
            {step === 0 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">What are you interested in?</h2>
                <p className="text-gray-500 text-center mb-7">Select all that apply — we&apos;ll personalise your deals feed.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCategory(cat.id)}
                        className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg`
                            : `${cat.bg} ${cat.border} text-gray-700 hover:shadow-md`
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                          {cat.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={selectedCategories.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2 — Location & Notifications */}
            {step === 1 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Location & Notifications</h2>
                <p className="text-gray-500 text-center mb-7">Help us find deals near you and keep you informed.</p>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. London, New York, Tokyo"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 space-y-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Notification Preferences</h3>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-[#F3AF7B]/10 rounded-xl flex items-center justify-center">
                      <Bell className="w-4 h-4 text-[#F3AF7B]" />
                    </div>
                    <div className="flex-1">
                      <Toggle enabled={pushNotif} onChange={setPushNotif} label="Push Notifications" />
                      <p className="text-xs text-gray-400 mt-0.5">Flash deal alerts and group buy updates</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <Toggle enabled={emailNotif} onChange={setEmailNotif} label="Email Digest" />
                      <p className="text-xs text-gray-400 mt-0.5">Weekly roundup of best deals in your area</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="px-5 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — All set */}
            {step === 2 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="flex justify-center mb-6"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-14 h-14 text-green-500" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl font-extrabold text-gray-900 mb-3"
                >
                  Welcome, {firstName}! Your buyer account is ready.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-gray-500 mb-4"
                >
                  You&apos;ve selected{' '}
                  <span className="font-semibold text-gray-800">{selectedCategories.length} interest{selectedCategories.length !== 1 ? 's' : ''}</span>
                  {city && (
                    <> and set your location to <span className="font-semibold text-gray-800">{city}</span></>
                  )}
                  . Deals are waiting for you!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap justify-center gap-2 mb-8"
                >
                  {selectedCategories.map(id => {
                    const cat = categories.find(c => c.id === id);
                    return cat ? (
                      <span key={id} className={`px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r ${cat.color} text-white shadow-sm`}>
                        {cat.label}
                      </span>
                    ) : null;
                  })}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinish}
                  className="w-full py-4 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Discovering Deals
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
