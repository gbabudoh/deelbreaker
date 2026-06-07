'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Clock,
  Lock,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  Laptop,
  Tag,
  Ticket,
  ChevronRight,
  Minus,
  Plus,
  AlertCircle,
  Zap,
  Trash2,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const MOCK_CHECKOUT_DEALS: Record<number, any> = {
  1: { id: 1, title: 'iPhone 15 Pro Max', merchant: 'TechWorld', originalPrice: 1199, currentPrice: 999, discount: 17, image: '/api/placeholder/400/300', type: 'PHYSICAL_PRODUCT', targetCountries: ['US', 'CA'] },
  2: { id: 2, title: 'Nike Air Max 270', merchant: 'SportZone', originalPrice: 150, currentPrice: 89, discount: 41, image: '/api/placeholder/400/300', type: 'PHYSICAL_PRODUCT', targetCountries: [] },
  3: { id: 3, title: 'Deep Tissue Massage Package', merchant: 'SpaRetreat', originalPrice: 150, currentPrice: 90, discount: 40, image: '/api/placeholder/400/300', type: 'LOCAL_SERVICE', targetCountries: [] },
  4: { id: 4, title: 'Gourmet 3-Course Dinner for Two', merchant: 'The Kitchen', originalPrice: 120, currentPrice: 55, discount: 54, image: '/api/placeholder/400/300', type: 'LOCAL_SERVICE', targetCountries: [] },
  101: { id: 101, title: 'Premium Yoga Mat + Carrier Bag', merchant: 'ZenLife', originalPrice: 65, currentPrice: 29, discount: 55, image: '/api/placeholder/400/300', type: 'PHYSICAL_PRODUCT', targetCountries: [] },
  102: { id: 102, title: '4K Ultra HD Dash Cam with GPS', merchant: 'DriveSafe', originalPrice: 199, currentPrice: 89, discount: 55, image: '/api/placeholder/400/300', type: 'PHYSICAL_PRODUCT', targetCountries: [] },
  103: { id: 103, title: 'Bamboo Bed Sheets - 1000 Thread Count', merchant: 'SoftSleep', originalPrice: 120, currentPrice: 39, discount: 67, image: '/api/placeholder/400/300', type: 'PHYSICAL_PRODUCT', targetCountries: [] },
  104: { id: 104, title: 'Professional Teeth Whitening Kit', merchant: 'SmileBright', originalPrice: 89, currentPrice: 34, discount: 62, image: '/api/placeholder/400/300', type: 'PHYSICAL_PRODUCT', targetCountries: [] },
};

const COUNTRY_NAMES: Record<string, string> = {
  US: '🇺🇸 United States', GB: '🇬🇧 United Kingdom', CA: '🇨🇦 Canada',
  AU: '🇦🇺 Australia', DE: '🇩🇪 Germany', FR: '🇫🇷 France',
  ES: '🇪🇸 Spain', JP: '🇯🇵 Japan', CN: '🇨🇳 China',
  IN: '🇮🇳 India', BR: '🇧🇷 Brazil',
};

type Step = 1 | 2 | 3;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  cardName: string;
}

interface FormErrors {
  [key: string]: string;
}

const STEPS = [
  { n: 1 as Step, label: 'Details' },
  { n: 2 as Step, label: 'Payment' },
  { n: 3 as Step, label: 'Confirm' },
];

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const dealId = params?.id as string;
  const initialQuantity = parseInt(searchParams?.get('quantity') || '1');

  const { removeFromCart } = useCart();
  const [deal, setDeal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<Step>(1);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isProcessing, setIsProcessing] = useState(false);

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postcode: '', country: 'GB',
    cardNumber: '', cardExpiry: '', cardCVV: '', cardName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const isService = deal?.type === 'LOCAL_SERVICE' || deal?.type === 'DIGITAL_SOFTWARE';

  useEffect(() => {
    if (!dealId) return;
    const numericId = Number(dealId);
    if (!isNaN(numericId) && MOCK_CHECKOUT_DEALS[numericId]) {
      setDeal(MOCK_CHECKOUT_DEALS[numericId]);
      setIsLoading(false);
      return;
    }
    fetch(`/api/deals/${dealId}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setDeal({
            id: data.id, title: data.title,
            merchant: data.merchant?.name || 'Deelbreaker Partner',
            originalPrice: data.originalPrice, currentPrice: data.currentPrice,
            discount: data.discount,
            image: data.images?.[0] || '/api/placeholder/400/300',
            type: data.type, targetCountries: data.targetCountries || [],
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [dealId]);

  const setField = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const validateStep1 = (): boolean => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!isService) {
      if (!form.address.trim()) e.address = 'Required';
      if (!form.city.trim()) e.city = 'Required';
      if (!form.postcode.trim()) e.postcode = 'Required';
    }
    if (deal?.targetCountries?.length > 0 && !deal.targetCountries.includes(form.country)) {
      const allowed = deal.targetCountries.map((c: string) => COUNTRY_NAMES[c] || c).join(', ');
      e.country = `This deal is only available in: ${allowed}`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: FormErrors = {};
    const raw = form.cardNumber.replace(/\s/g, '');
    if (raw.length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!form.cardName.trim()) e.cardName = 'Required';
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = 'Format: MM/YY';
    if (form.cardCVV.replace(/\D/g, '').length < 3) e.cardCVV = '3-4 digits required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1Submit = () => {
    if (validateStep1()) setStep(2);
  };

  const handleStep2Submit = () => {
    if (validateStep2()) setStep(3);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => router.push('/checkout/success'), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#F3AF7B]/30 border-t-[#F3AF7B] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-bold text-lg mb-1">Deal not found</p>
          <p className="text-gray-500 text-sm mb-4">This deal may have expired or been removed.</p>
          <button onClick={() => router.push('/deals')} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
            Browse Deals
          </button>
        </div>
      </div>
    );
  }

  const savings = (deal.originalPrice - deal.currentPrice) * quantity;
  const total = deal.currentPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Secure Checkout</h1>
            <p className="text-gray-400 text-sm">Complete your purchase safely</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-3 py-2">
            <Lock className="w-3.5 h-3.5 text-green-500" />
            <span className="font-medium text-gray-500">SSL Secured</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  step > s.n
                    ? 'bg-green-500 border-green-500 text-white'
                    : step === s.n
                    ? 'bg-[#F3AF7B] border-[#F3AF7B] text-white'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
                </div>
                <span className={`text-xs font-semibold mt-1.5 ${step === s.n ? 'text-[#F3AF7B]' : step > s.n ? 'text-green-500' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all ${step > s.n ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-4">

            {/* STEP 1: Contact & Delivery */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="px-6 pt-6 pb-4 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">{isService ? 'Contact Details' : 'Contact & Delivery'}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {isService ? 'Your voucher will be emailed to you' : 'Where should we deliver your order?'}
                    </p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="First Name" error={errors.firstName}>
                        <input
                          value={form.firstName}
                          onChange={e => setField('firstName', e.target.value)}
                          placeholder="John"
                          className={inputClass(errors.firstName)}
                        />
                      </FormField>
                      <FormField label="Last Name" error={errors.lastName}>
                        <input
                          value={form.lastName}
                          onChange={e => setField('lastName', e.target.value)}
                          placeholder="Doe"
                          className={inputClass(errors.lastName)}
                        />
                      </FormField>
                    </div>

                    <FormField label="Email Address" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setField('email', e.target.value)}
                        placeholder="john@example.com"
                        className={inputClass(errors.email)}
                      />
                    </FormField>

                    <FormField label="Phone Number" error={errors.phone}>
                      <input
                        value={form.phone}
                        onChange={e => setField('phone', e.target.value)}
                        placeholder="+44 7700 900000"
                        className={inputClass(errors.phone)}
                      />
                    </FormField>

                    {!isService && (
                      <>
                        <FormField label="Street Address" error={errors.address}>
                          <input
                            value={form.address}
                            onChange={e => setField('address', e.target.value)}
                            placeholder="123 High Street"
                            className={inputClass(errors.address)}
                          />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="City" error={errors.city}>
                            <input
                              value={form.city}
                              onChange={e => setField('city', e.target.value)}
                              placeholder="London"
                              className={inputClass(errors.city)}
                            />
                          </FormField>
                          <FormField label="Postcode / ZIP" error={errors.postcode}>
                            <input
                              value={form.postcode}
                              onChange={e => setField('postcode', e.target.value)}
                              placeholder="SW1A 1AA"
                              className={inputClass(errors.postcode)}
                            />
                          </FormField>
                        </div>
                      </>
                    )}

                    <FormField label="Country" error={errors.country}>
                      <select
                        value={form.country}
                        onChange={e => setField('country', e.target.value)}
                        className={inputClass(errors.country) + ' cursor-pointer'}
                      >
                        {Object.entries(COUNTRY_NAMES).map(([code, label]) => (
                          <option key={code} value={code}>{label}</option>
                        ))}
                      </select>
                    </FormField>

                    {isService && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                        <Ticket className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                        <div>
                          <p className="font-semibold">Voucher delivery</p>
                          <p className="text-amber-700 text-xs mt-0.5">Your voucher code will be sent to your email address instantly after payment.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={handleStep1Submit}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold transition-all"
                    >
                      Continue to Payment
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
                      <p className="text-sm text-gray-400 mt-0.5">Your payment info is encrypted end-to-end</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs text-[#F3AF7B] font-bold hover:underline">
                      ← Back
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Accepted cards */}
                    <div className="flex items-center gap-2 mb-2">
                      {['VISA', 'MC', 'AMEX', 'PayPal'].map(b => (
                        <span key={b} className="px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-black text-gray-500 tracking-wider">{b}</span>
                      ))}
                    </div>

                    <FormField label="Cardholder Name" error={errors.cardName}>
                      <input
                        value={form.cardName}
                        onChange={e => setField('cardName', e.target.value)}
                        placeholder="John Doe"
                        className={inputClass(errors.cardName)}
                      />
                    </FormField>

                    <FormField label="Card Number" error={errors.cardNumber}>
                      <div className="relative">
                        <input
                          value={form.cardNumber}
                          onChange={e => setField('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={inputClass(errors.cardNumber) + ' pr-12'}
                        />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      </div>
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Expiry Date" error={errors.cardExpiry}>
                        <input
                          value={form.cardExpiry}
                          onChange={e => setField('cardExpiry', formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={inputClass(errors.cardExpiry)}
                        />
                      </FormField>
                      <FormField label="CVV / CVC" error={errors.cardCVV}>
                        <input
                          value={form.cardCVV}
                          onChange={e => setField('cardCVV', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className={inputClass(errors.cardCVV)}
                        />
                      </FormField>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span>256-bit SSL encryption · Powered by Deelbreaker SecurePay™</span>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={handleStep2Submit}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold transition-all"
                    >
                      Review Order
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review & Confirm */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Review Your Order</h2>
                      <p className="text-sm text-gray-400 mt-0.5">Everything look right?</p>
                    </div>
                    <button onClick={() => setStep(2)} className="text-xs text-[#F3AF7B] font-bold hover:underline">
                      ← Back
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Contact summary */}
                    <SummarySection title="Contact" onEdit={() => setStep(1)}>
                      <p className="text-sm text-gray-700 font-medium">{form.firstName} {form.lastName}</p>
                      <p className="text-sm text-gray-500">{form.email}</p>
                      <p className="text-sm text-gray-500">{form.phone}</p>
                    </SummarySection>

                    {!isService && (
                      <SummarySection title="Delivery Address" onEdit={() => setStep(1)}>
                        <p className="text-sm text-gray-700">{form.address}</p>
                        <p className="text-sm text-gray-500">{form.city}, {form.postcode}</p>
                        <p className="text-sm text-gray-500">{COUNTRY_NAMES[form.country] || form.country}</p>
                      </SummarySection>
                    )}

                    <SummarySection title="Payment Method" onEdit={() => setStep(2)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-gray-900 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">•••• •••• •••• {form.cardNumber.replace(/\s/g, '').slice(-4) || '—'}</p>
                          <p className="text-xs text-gray-400">{form.cardName} · Exp {form.cardExpiry}</p>
                        </div>
                      </div>
                    </SummarySection>

                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-green-800">You save ${savings.toFixed(2)} on this order!</p>
                        <p className="text-xs text-green-600 mt-0.5">{deal.discount}% discount applied · Free cancellation within 24h</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] hover:from-[#e09153] hover:to-[#e8a89e] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-100 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Place Order · ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      By placing this order you agree to our <span className="underline cursor-pointer">Terms</span> &amp; <span className="underline cursor-pointer">Privacy Policy</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Lock, label: 'Secure Payment', sub: '256-bit SSL' },
                { icon: Truck, label: 'Free Delivery', sub: 'On all orders' },
                { icon: ShieldCheck, label: 'Buyer Protected', sub: 'Full guarantee' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center text-center">
                  <Icon className="w-5 h-5 text-[#F3AF7B] mb-1" />
                  <p className="text-xs font-bold text-gray-700">{label}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="px-6 pt-6 pb-4 border-b border-gray-50">
                <h3 className="text-base font-bold text-gray-900">Order Summary</h3>
              </div>

              <div className="p-6">
                {/* Deal card */}
                <div className="flex gap-4 mb-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      -{deal.discount}%
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{deal.title}</h4>
                      <button
                        onClick={() => { removeFromCart(deal.id); router.back(); }}
                        className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-1"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{deal.merchant}</p>
                    <span className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      deal.type === 'PHYSICAL_PRODUCT'
                        ? 'bg-indigo-50 text-indigo-700'
                        : deal.type === 'LOCAL_SERVICE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {deal.type === 'PHYSICAL_PRODUCT' ? <><Package className="w-3 h-3" /> Physical</> :
                       deal.type === 'LOCAL_SERVICE' ? <><MapPin className="w-3 h-3" /> Service</> :
                       <><Laptop className="w-3 h-3" /> Digital</>}
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                {!isService && (
                  <div className="flex items-center justify-between mb-5 p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-gray-900 w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Price breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Original price{quantity > 1 ? ` × ${quantity}` : ''}</span>
                    <span className="line-through">${(deal.originalPrice * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Discount ({deal.discount}%)</span>
                    <span>−${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span className="text-green-600 font-bold text-xs uppercase">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Service fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <p className="font-black text-gray-900 text-base">Total</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Incl. VAT</p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">${total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Savings pill */}
                <div className="mt-4 flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl py-2.5 px-4">
                  <Tag className="w-3.5 h-3.5 text-green-600" />
                  <p className="text-xs font-bold text-green-700">You save <span className="text-green-800">${savings.toFixed(2)}</span> with this deal</p>
                </div>

                {/* Delivery info */}
                <div className="mt-4 pt-4 border-t border-gray-50 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-[#F3AF7B] flex-shrink-0" />
                    <span>{isService ? 'Voucher delivered instantly to your email' : 'Estimated delivery: 3–5 working days'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F3AF7B] flex-shrink-0" />
                    <span>Deelbreaker Buyer Guarantee — full refund if something goes wrong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-800 placeholder-gray-300 outline-none transition-all focus:ring-2 focus:ring-[#F3AF7B] focus:border-[#F3AF7B] ${
    error ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
  }`;
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function SummarySection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <button onClick={onEdit} className="text-xs text-[#F3AF7B] font-bold hover:underline">Edit</button>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
