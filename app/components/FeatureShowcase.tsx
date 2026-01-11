'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Clock, Target, Smartphone } from 'lucide-react';

export default function FeatureShowcase() {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Dual-Track Shopping',
      description: 'Choose between instant deals or group preorders for maximum savings',
      benefit: 'Save up to 70% more than traditional coupon sites',
      gradient: 'from-[#F3AF7B] to-[#F4C2B8]'
    },
    {
      icon: Clock,
      title: 'Price-Drop Alerts',
      description: 'AI monitors your wishlist and alerts you the moment prices drop',
      benefit: 'Never miss a deal on items you actually want',
      gradient: 'from-[#E2FBEE] to-[#F3AF7B]'
    },
    {
      icon: Target,
      title: 'Community Power',
      description: 'Join forces with other shoppers to unlock exclusive group discounts',
      benefit: 'The more people join, the bigger the savings',
      gradient: 'from-[#F4C2B8] to-[#AEB1AF]'
    },
    {
      icon: Smartphone,
      title: 'Instant Cashback',
      description: 'Get immediate Deelbreaker Credits that work across all merchants',
      benefit: 'No waiting, no broken codes, just instant rewards',
      gradient: 'from-[#AEB1AF] to-[#E2FBEE]'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How Deelbreaker Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the next generation of deal discovery with features designed for 2026's smart shoppers
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex items-start space-x-6"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 text-lg">{feature.description}</p>
                <div className="bg-gradient-to-r from-[#E2FBEE] to-[#F4C2B8]/30 rounded-lg p-4">
                  <p className="text-[#F3AF7B] font-semibold">✨ {feature.benefit}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}