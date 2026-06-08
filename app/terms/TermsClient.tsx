'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Scale, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: 'By accessing or using the Deelbreaker platform (including the website, mobile application, and any associated services), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not access or use our services.'
  },
  {
    id: 'accounts',
    title: '2. User Accounts & Security',
    content: 'To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information. You are responsible for safeguarding your password and account credentials.'
  },
  {
    id: 'groupbuys',
    title: '3. Group Buy Mechanics & Orders',
    content: 'Deelbreaker facilitates group purchases where the final transaction price depends on the number of participants who commit to the deal. By joining a group buy, you authorize Deelbreaker to hold a temporary authorization on your payment method. If the group buy meets its target criteria, the order is processed, and the final discount is locked. If the deal fails to reach its threshold, your authorization is released.'
  },
  {
    id: 'cashback',
    title: '4. Cashback Rewards & Wallets',
    content: 'Cashback rewards are processed and credited to your wallet balance after a transaction is verified by the merchant partner. Deelbreaker reserves the right to audit, delay, or revoke cashback rewards in cases of suspected fraud, cancellations, or returns.'
  },
  {
    id: 'merchant-rules',
    title: '5. Merchant & Partner Rules',
    content: 'Merchants using the platform must comply with the Merchant Agreement, provide verified information, honor all purchased vouchers, and fulfill orders in a timely manner. Failure to comply may result in suspension or account termination.'
  },
  {
    id: 'liability',
    title: '6. Limitation of Liability',
    content: 'Deelbreaker acts as an independent marketplace platform. We are not responsible for product manufacturing defects, merchant fulfillment failures, or indirect damages. We provide resolution mediation via our Resolution Centre in good faith.'
  }
];

export default function TermsClient() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-br from-[#df874e]/15 via-white to-[#cc6855]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153]">
              <Scale className="w-3.5 h-3.5" />
              Legal Documentation
            </span>
            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
              Terms of <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Last Updated: June 8, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
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
                  Welcome to Deelbreaker. Please read these Terms of Service carefully before using our platform. These terms govern your access to and use of Deelbreaker\'s services, including our group buying features, cashback processing wallet, and merchant listings.
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
                  <ShieldCheck className="w-6 h-6 text-[#F3AF7B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Need a copy of these terms?</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      You can request a PDF copy of our terms or clarify clauses by contacting our support team at <a href="mailto:contact@deelbreaker.com" className="text-[#F3AF7B] hover:underline font-semibold">contact@deelbreaker.com</a>.
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
