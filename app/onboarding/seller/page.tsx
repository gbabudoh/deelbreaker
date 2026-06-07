'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Zap, CheckCircle, ArrowRight, ArrowLeft, Check, Upload,
  Store, Globe, Instagram, Link as LinkIcon
} from 'lucide-react';
import { useRole } from '@/lib/role-context';

const businessTypes = [
  'Retail & E-commerce',
  'Local Services',
  'Experiences & Travel',
  'Electronics',
  'Food & Dining',
  'Beauty & Wellness',
];

const businessCountries = [
  'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Spain', 'Japan', 'Singapore', 'Nigeria',
  'South Africa', 'India', 'Brazil', 'Mexico', 'Other',
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

export default function SellerOnboardingPage() {
  const { data: session } = useSession();
  const { completeOnboarding } = useRole();
  const router = useRouter();

  const [step, setStep] = useState(0);

  const [shopName, setShopName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');

  const [logoFilename, setLogoFilename] = useState('');
  const [tagline, setTagline] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');

  const step1Valid = shopName.trim().length > 0 && businessType && country;

  const handleFinish = () => {
    const profileData = {
      shopName, businessType, country, description,
      tagline, website, instagram, tiktok, logoFilename,
    };

    try {
      localStorage.setItem('db_seller_profile', JSON.stringify(profileData));
    } catch {}

    fetch('/api/merchant/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    }).catch(() => {});

    completeOnboarding();
    router.push('/seller');
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const firstName = session?.user?.name?.split(' ')[0] || 'there';

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
            {/* Step 1 — Business Details */}
            {step === 0 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-2xl flex items-center justify-center shadow-lg">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Tell us about your business</h2>
                <p className="text-gray-500 text-center mb-7">We&apos;ll set up your seller profile to match your business type.</p>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business / Shop Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Luna Beauty Co."
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Type <span className="text-red-400">*</span></label>
                    <select
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 bg-white"
                    >
                      <option value="">Select a category</option>
                      {businessTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Country <span className="text-red-400">*</span></label>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 bg-white"
                    >
                      <option value="">Select your country</option>
                      {businessCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brief Description</label>
                    <textarea
                      placeholder="Tell buyers what makes your store special..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!step1Valid}
                  className="w-full py-4 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2 — Storefront Setup */}
            {step === 1 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Set up your storefront</h2>
                <p className="text-gray-500 text-center mb-7">Make your shop stand out to buyers.</p>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shop Logo</label>
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-[#F3AF7B] hover:bg-orange-50/30 transition-all duration-200"
                    >
                      {logoFilename ? (
                        <>
                          <div className="w-12 h-12 bg-[#F3AF7B]/20 rounded-xl flex items-center justify-center">
                            <Check className="w-6 h-6 text-[#F3AF7B]" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{logoFilename}</span>
                          <span className="text-xs text-gray-400">Click to change</span>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Upload your logo</span>
                          <span className="text-xs text-gray-400">PNG, JPG up to 2MB</span>
                        </>
                      )}
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setLogoFilename(file.name);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shop Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Glow up for less"
                      value={tagline}
                      onChange={e => setTagline(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        placeholder="https://yourshop.com"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Social Media <span className="text-gray-400 font-normal">(optional)</span></label>
                    <div className="space-y-3">
                      <div className="relative">
                        <Instagram className="absolute left-3.5 top-3.5 w-4 h-4 text-pink-400" />
                        <input
                          type="text"
                          placeholder="@yourinstagram"
                          value={instagram}
                          onChange={e => setInstagram(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400"
                        />
                      </div>
                      <div className="relative">
                        <LinkIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="@yourtiktok"
                          value={tiktok}
                          onChange={e => setTiktok(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400"
                        />
                      </div>
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

            {/* Step 3 — Ready! */}
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
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-14 h-14 text-[#F3AF7B]" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="inline-flex items-center gap-2 bg-[#F3AF7B]/10 text-[#F3AF7B] text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                    <Store className="w-4 h-4" />
                    {shopName}
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                    Your seller account is ready!
                  </h2>
                  <p className="text-gray-500 mb-2">
                    Welcome, {firstName}! Your {businessType.toLowerCase()} store is set up in{' '}
                    <span className="font-semibold text-gray-800">{country}</span>.
                  </p>
                  <p className="text-gray-500 mb-8">
                    Let&apos;s create your first deal and start reaching thousands of buyers.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-[#F3AF7B]/10 to-orange-50 rounded-2xl border border-[#F3AF7B]/20 p-5 mb-8 text-left"
                >
                  <h3 className="font-semibold text-gray-800 mb-3">What happens next</h3>
                  <div className="space-y-2.5">
                    {[
                      'Access your seller dashboard',
                      'Create your first flash deal',
                      'Monitor sales & analytics in real-time',
                      'Get paid directly to your bank account',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-[#F3AF7B]/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#F3AF7B]">{i + 1}</span>
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
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
                  Go to Seller Dashboard
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
