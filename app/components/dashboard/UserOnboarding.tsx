'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Bell, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Utensils, 
  ShoppingBag, 
  Plane, 
  Laptop
} from 'lucide-react';

interface UserOnboardingProps {
  onComplete: () => void;
}

const categories = [
  { id: 'local', name: 'Local Deals', icon: MapPin, color: 'bg-blue-500' },
  { id: 'goods', name: 'Shopping', icon: ShoppingBag, color: 'bg-green-500' },
  { id: 'dining', name: 'Dining', icon: Utensils, color: 'bg-orange-500' },
  { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-purple-500' },
  { id: 'tech', name: 'Technology', icon: Laptop, color: 'bg-gray-800' },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, color: 'bg-pink-500' },
];

export default function UserOnboarding({ onComplete }: UserOnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [location, setLocation] = useState('London');
  const [notifications, setNotifications] = useState({ push: true, email: true });

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100"
        >
          {step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F3AF7B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#F3AF7B]" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome to Deelbreaker!</h2>
              <p className="text-gray-500 mb-8">Let's personalize your experience. What are you interested in?</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleInterest(cat.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      selectedInterests.includes(cat.id)
                        ? 'border-[#F3AF7B] bg-[#F3AF7B]/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${cat.color} text-white`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                    {selectedInterests.includes(cat.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#F3AF7B] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={selectedInterests.length === 0}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#F3AF7B]" />
                Where are you located?
              </h2>
              <p className="text-gray-500 mb-6">We'll show you the best local deals in your area.</p>
              
              <div className="relative mb-8">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#F3AF7B] outline-none font-medium text-gray-900"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city"
                />
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Bell className="w-6 h-6 text-[#F3AF7B]" />
                Never miss a deal
              </h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-gray-800">Push Notifications</h4>
                    <p className="text-xs text-gray-500">Instant alerts for flash deals</p>
                  </div>
                  <button 
                    onClick={() => setNotifications({...notifications, push: !notifications.push})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-[#F3AF7B]' : 'bg-gray-300'}`}
                  >
                    <motion.div 
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{ x: notifications.push ? 24 : 0 }}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-gray-800">Email Updates</h4>
                    <p className="text-xs text-gray-500">Weekly curated top deals</p>
                  </div>
                  <button 
                    onClick={() => setNotifications({...notifications, email: !notifications.push})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-[#F3AF7B]' : 'bg-gray-300'}`}
                  >
                    <motion.div 
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{ x: notifications.email ? 24 : 0 }}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={onComplete}
                  className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                  Start Saving
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
