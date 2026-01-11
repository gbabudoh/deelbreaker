'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Zap } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '50K+',
      label: 'Active Deal Breakers',
      color: '#F3AF7B'
    },
    {
      icon: DollarSign,
      value: '$2.5M',
      label: 'Total Savings Generated',
      color: '#E2FBEE'
    },
    {
      icon: TrendingUp,
      value: '85%',
      label: 'Average Discount Rate',
      color: '#F4C2B8'
    },
    {
      icon: Zap,
      value: '24/7',
      label: 'AI Deal Monitoring',
      color: '#AEB1AF'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#E2FBEE]/30 to-[#F4C2B8]/30">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Breaking Records, Breaking Deals
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join a community that's revolutionizing how we shop and save
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${stat.color}40` }}
              >
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}