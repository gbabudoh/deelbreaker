'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Store, 
  FileText, 
  ChevronRight, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Globe, 
  BarChart3
} from 'lucide-react';

interface MerchantOnboardingProps {
  onComplete: (data: any) => void;
}

export default function MerchantOnboarding({ onComplete }: MerchantOnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'retail',
    taxId: '',
    description: '',
    website: '',
    logo: null as File | null,
  });

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = () => {
    onComplete({
      name: formData.businessName,
      businessType: formData.businessType,
      taxId: formData.taxId,
      description: formData.description,
      website: formData.website,
    });
  };

  const steps = [
    { title: 'Business Info', icon: Building2 },
    { title: 'Shop Profile', icon: Store },
    { title: 'Verification', icon: FileText },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                step > i + 1 ? 'bg-green-500 text-white' : 
                step === i + 1 ? 'bg-[#F3AF7B] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs mt-2 font-bold uppercase tracking-wider ${
                step === i + 1 ? 'text-[#F3AF7B]' : 'text-gray-400'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#F3AF7B] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tell us about your business</h2>
              <p className="text-gray-500 mb-8">This information will be used for your official merchant profile.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Legal Business Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Global Tech Solutions Ltd"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent outline-none transition-all"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Business Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent outline-none transition-all"
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  >
                    <option value="retail">Retail & E-commerce</option>
                    <option value="local">Local Services</option>
                    <option value="experience">Experiences & Travel</option>
                    <option value="electronics">Electronics Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Tax ID / Registration Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. VAT12345678"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent outline-none transition-all"
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Setup your storefront</h2>
              <p className="text-gray-500 mb-8">Choose how customers will see your brand on Deelbreaker.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden group hover:border-[#F3AF7B] transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#F3AF7B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Brand Logo</h4>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB. <br/>Recommended 400x400px.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Shop Description</label>
                  <textarea 
                    rows={4}
                    placeholder="What makes your deals special?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="https://yourstore.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent outline-none transition-all"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Verification</h2>
              <p className="text-gray-500 mb-8">Final step to ensure trust and safety in our community.</p>
              
              <div className="bg-[#E2FBEE]/40 border border-[#b8e8cf] rounded-2xl p-6 mb-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#F3AF7B] flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Instant Verification Available</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      As a Premium Partner, you can start listing deals immediately while we review your docs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">Business License / Registration</span>
                  </div>
                  <button className="text-[#F3AF7B] font-bold text-sm">Upload</button>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">Bank Statements (Last 3 Months)</span>
                  </div>
                  <button className="text-[#F3AF7B] font-bold text-sm">Upload</button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 font-bold text-gray-500 hover:text-gray-800 transition-colors ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <button
              onClick={step === totalSteps ? handleComplete : nextStep}
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              {step === totalSteps ? 'Complete Setup' : 'Continue'}
              {step !== totalSteps && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
