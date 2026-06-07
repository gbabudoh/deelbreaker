'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home, LayoutDashboard, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function CheckoutSuccessPage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} gravity={0.1} />}
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-lg"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-lg mb-10">
          Thank you for your purchase. We've sent a confirmation email to <span className="font-bold text-gray-900">john@example.com</span>.
        </p>

        <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-[#F3AF7B]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Package className="w-10 h-10 text-[#F3AF7B]" />
          </div>
          <div className="text-left flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
            <h3 className="text-xl font-bold text-gray-900 mb-1">DB-942-0128</h3>
            <p className="text-sm text-gray-500">You can track your order status in your dashboard.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard?tab=orders"
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <Link 
            href="/"
            className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-all"
          >
            <Home className="w-5 h-5" />
            Back Home
          </Link>
        </div>

        <button className="mt-12 flex items-center gap-2 mx-auto text-gray-400 font-bold hover:text-gray-600 transition-colors">
          <Share2 className="w-4 h-4" />
          Share this deal with friends
        </button>
      </motion.div>

      {/* Background shapes for aesthetics */}
      <div className="absolute top-20 -left-20 w-64 h-64 bg-[#F3AF7B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-64 h-64 bg-green-50 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
