'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Zap, Users, Award, Sparkles, Target } from 'lucide-react';

export default function AboutClient() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-[#df874e]/10 via-white to-[#cc6855]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3AF7B]/10 text-[#e09153] mb-4">
                  <Sparkles className="w-3 h-3" />
                  The Future of Smart Shopping
                </span>
                <h1 className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl mb-6">
                  We are <span className="bg-gradient-to-r from-[#F3AF7B] to-[#cc6855] bg-clip-text text-transparent">Deelbreaker</span>
                </h1>
                <p className="text-base text-gray-600 sm:text-xl lg:text-lg xl:text-xl leading-relaxed mb-8">
                  We are on a mission to disrupt ordinary discount models. By combining AI-powered discovery, group buying power, and direct cashback rewards, we empower shoppers to unlock wholesale prices on the products they love.
                </p>
              </motion.div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-md lg:max-w-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F3AF7B] to-[#cc6855] rounded-3xl transform rotate-3 scale-102 opacity-20 blur-xl"></div>
                <div className="relative bg-white p-2 rounded-3xl shadow-xl border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
                    alt="Smart Shoppers"
                    className="rounded-2xl shadow-inner object-cover w-full h-[300px] lg:h-[380px]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Core Pillars Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How We Break the Rules
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Traditional retailers keep prices high. We group buyers together and negotiate directly with verified brands to secure unmatched savings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'AI Deal Discovery',
                desc: 'Our algorithms scan the web and curate only the best, highly-rated offers. No clutter, no spam, just real value.',
                color: 'bg-orange-100 text-[#F3AF7B]'
              },
              {
                icon: Users,
                title: 'Group Buying Power',
                desc: 'Pool demand with thousands of other shoppers. The more people join a deal, the deeper the discount drops.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: Award,
                title: 'Instant Cashback',
                desc: 'Earn rewards back directly to your wallet on every completed purchase. Withdraw your cash smoothly at any time.',
                color: 'bg-green-100 text-green-600'
              }
            ].map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${pillar.color} flex items-center justify-center mb-5`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Stats Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#F3AF7B] mb-4">
                <Target className="w-3.5 h-3.5" />
                Our Mission
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
                Empowering the modern consumer with transparency
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Deelbreaker was founded on the belief that retail markets are inefficient. Individual consumers lack negotiating leverage, while retailers struggle with high customer acquisition costs.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                By bridging this gap, we create a win-win: merchants get guaranteed bulk volume, and buyers receive massive, wholesale-rate discounts.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                  <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-orange-600 flex items-center justify-center text-[10px] font-bold">MK</div>
                  <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-blue-600 flex items-center justify-center text-[10px] font-bold">SL</div>
                </div>
                <span className="text-sm text-gray-400 font-medium">Joined by over 50,000+ smart shoppers</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '$2.5M+', label: 'Customer Savings' },
                { value: '150k+', label: 'Deals Completed' },
                { value: '500+', label: 'Verified Partners' },
                { value: '99.8%', label: 'Happy Customers' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs text-center">
                  <p className="text-3xl lg:text-4xl font-extrabold text-[#F3AF7B] mb-1">{stat.value}</p>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">{stat.label}</p>
                </div>
              ))}
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
