'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, ChevronDown, ChevronUp, User, ShoppingBag, CreditCard, Sparkles, Send, ShieldAlert } from 'lucide-react';

interface FAQ {
  id: string;
  category: 'General' | 'Buying' | 'Selling' | 'Troubleshooting';
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    category: 'Buying',
    question: 'How do Group Buys work?',
    answer: 'Group buys allow shoppers to pool their purchasing power to unlock lower price tiers. Each deal has defined target numbers of participants. As more shoppers join, the price drops. Once the deal reaches the end date or maximum capacity, the final discount is locked, and your purchase is processed at that lowest rate.'
  },
  {
    id: '2',
    category: 'Buying',
    question: 'When do I receive my cashback?',
    answer: 'Cashback rewards are calculated and credited to your Deelbreaker wallet balance immediately after a purchase is verified by the merchant. You can check your stats on the Overview tab and request withdrawals to your connected account once processing is complete.'
  },
  {
    id: '3',
    category: 'General',
    question: 'How do I sign out of my account?',
    answer: 'To sign out on desktop, click the profile user menu dropdown in the top-right header and select "Sign Out". Alternatively, on the dashboard page, click the Settings/Logout button next to the notification bell in the profile card or navigate to the "Profile" tab, scroll to the bottom, and click the "Sign Out" button.'
  },
  {
    id: '4',
    category: 'Selling',
    question: 'How do I create a seller store?',
    answer: 'To become a seller, go to the onboarding page (/onboarding) and select "Seller Account". Complete the required details about your shop name, category, and Stripe connection. Once verified, you will gain access to the Seller Dashboard where you can create deals, review payout analytics, and manage customer orders.'
  },
  {
    id: '5',
    category: 'Troubleshooting',
    question: 'What happens if a Group Buy does not meet its target?',
    answer: 'If a group buy does not meet its minimum required participants before the expiration date, the deal is cancelled. No funds are drawn from your account, and any temporary authorization holds are fully released by your bank immediately.'
  },
  {
    id: '6',
    category: 'General',
    question: 'Are there any fees for buyers?',
    answer: 'Deelbreaker is 100% free for buyers. There are no hidden subscription charges, platform access fees, or buyer fees. The price you see in the active deal tier is exactly what you pay.'
  }
];

export default function HelpClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'General', 'Buying', 'Selling', 'Troubleshooting'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-[#df874e]/15 via-white to-[#cc6855]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153]">
              <Sparkles className="w-3 h-3" />
              Help Center
            </span>
            <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl">
              How can we <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">help you?</span>
            </h1>
            <p className="text-base text-gray-600 sm:text-lg max-w-xl mx-auto">
              Search FAQs, browse help categories, or reach out to our team.
            </p>
            
            {/* Search Box */}
            <div className="relative max-w-xl mx-auto mt-4">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 text-gray-800 text-base shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* FAQ Accordion */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setExpandedId(null);
                  }}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Accordion list */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center bg-white border border-gray-100 rounded-3xl p-16 text-gray-500 font-medium">
                  No matching questions found. Try another search queries!
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleExpand(faq.id)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-50/50 transition-colors"
                      >
                        <span className="text-base sm:text-lg pr-4">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 pt-2 text-sm sm:text-base text-gray-500 border-t border-gray-50 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar Help Card & Form Redirect */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Contact Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-[#F3AF7B] flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Still have questions?</h3>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                If you cannot find the answer in our FAQs, please submit a message to our general support.
              </p>
              <a
                href="/contact"
                className="w-full py-3 bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                Contact Support
              </a>
            </div>

            {/* Email Info box */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white border border-gray-800 space-y-3">
              <h3 className="font-bold text-base">Support Email</h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                For custom inquiries, enterprise features, or security reports, you can email us directly at:
              </p>
              <div className="pt-2">
                <a href="mailto:contact@deelbreaker.com" className="text-sm font-bold text-[#F3AF7B] hover:underline">
                  contact@deelbreaker.com
                </a>
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
