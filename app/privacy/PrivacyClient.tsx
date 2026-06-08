'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ArrowRight, EyeOff } from 'lucide-react';

const SECTIONS = [
  {
    id: 'collect',
    title: '1. Information We Collect',
    content: 'We collect information you provide directly to us when you create an account, participate in group buys, or interact with support. This includes your name, email address, phone number, payment transaction logs, and details of deals you join.'
  },
  {
    id: 'use',
    title: '2. How We Use Information',
    content: 'We use the information we collect to personalize your deal feed, track and process cashback payouts, send you transaction receipts and notifications (such as deal status changes and price drop alerts), and protect the security of our platform.'
  },
  {
    id: 'sharing',
    title: '3. Sharing of Information',
    content: 'We do not sell your personal data. We share your information with verified merchant partners solely to fulfill your orders or vouchers. We also share transaction data with Stripe for secure payment processing, and with analytical services to evaluate user activity.'
  },
  {
    id: 'security',
    title: '4. Data Security & Retention',
    content: 'We implement robust technical and organizational security measures to protect your personal data against unauthorized access, loss, or alteration. We retain your information as long as your account is active or as required to comply with legal regulations.'
  },
  {
    id: 'rights',
    title: '5. Your Rights & Choice',
    content: 'You have the right to access, correct, or delete your personal data. You can manage your notification preferences (new deals, payouts, and marketing) and privacy controls directly within the Profile Settings dashboard. You can also request complete account deletion.'
  }
];

export default function PrivacyClient() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-br from-[#df874e]/15 via-white to-[#cc6855]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153]">
              <Shield className="w-3.5 h-3.5" />
              Privacy Center
            </span>
            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
              Privacy <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Last Updated: June 8, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Outline Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs sticky top-28 hidden lg:block">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Document Outline</h3>
            <ul className="space-y-3">
              {SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="text-sm font-semibold text-gray-500 hover:text-[#F3AF7B] transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                    {sec.title.substring(3)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Legal Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs space-y-8">
              <div className="prose prose-orange max-w-none text-gray-600 text-sm sm:text-base leading-relaxed space-y-6">
                <p>
                  At Deelbreaker, we respect your privacy and are committed to safeguarding the personal information you share with us. This Privacy Policy explains what details we collect, how we manage them, and your privacy choices.
                </p>
                <hr className="border-gray-100" />
              </div>

              {SECTIONS.map((sec) => (
                <div key={sec.id} id={sec.id} className="scroll-mt-28 space-y-3">
                  <h3 className="text-xl font-extrabold text-gray-900">{sec.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed pl-1">
                    {sec.content}
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-8 mt-8 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <EyeOff className="w-6 h-6 text-[#F3AF7B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Have a privacy question?</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      If you want to request data exportation, complete deletion, or clarify our collection policies, email our data privacy team at <a href="mailto:contact@deelbreaker.com" className="text-[#F3AF7B] hover:underline font-semibold">contact@deelbreaker.com</a>.
                    </p>
                  </div>
                </div>
              </div>
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
