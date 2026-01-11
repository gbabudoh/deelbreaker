'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Gift, Users, Zap, ArrowRight, Star } from 'lucide-react'

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const welcomeSteps = [
    {
      icon: CheckCircle,
      title: 'Welcome to Deelbreaker!',
      description: 'Your account has been created successfully. Get ready to discover amazing deals and save money like never before.',
      color: 'text-green-500'
    },
    {
      icon: Gift,
      title: 'Discover Exclusive Deals',
      description: 'Browse thousands of verified deals from top merchants. Find instant discounts and group buy opportunities.',
      color: 'text-[#F3AF7B]'
    },
    {
      icon: Users,
      title: 'Join Group Buys',
      description: 'Team up with other shoppers to unlock deeper discounts. The more people join, the lower the price gets!',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Earn Instant Cashback',
      description: 'Get immediate cashback rewards that you can use across any merchant on our platform.',
      color: 'text-purple-500'
    }
  ]

  const features = [
    { name: 'AI-Powered Recommendations', description: 'Personalized deal suggestions based on your preferences' },
    { name: 'Real-time Price Tracking', description: 'Get notified when prices drop on your saved items' },
    { name: 'Gamified Experience', description: 'Earn XP and unlock exclusive deals as you shop' },
    { name: 'Community Reviews', description: 'Read verified reviews from real customers' }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E2FBEE] via-[#DEDEDE] to-[#F4C2B8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F3AF7B]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const CurrentIcon = welcomeSteps[currentStep].icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E2FBEE] via-[#DEDEDE] to-[#F4C2B8] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Main Welcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center mb-8"
        >
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-[#F3AF7B]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100`}>
              <CurrentIcon className={`w-8 h-8 ${welcomeSteps[currentStep].color}`} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {welcomeSteps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {welcomeSteps[currentStep].description}
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            {currentStep < welcomeSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="cursor-pointer px-6 py-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl hover:shadow-lg transition-all"
              >
                Next
              </button>
            ) : (
              <Link
                href="/deals"
                className="px-6 py-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-[#F3AF7B] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 mb-4">Ready to get started?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/deals"
              className="px-6 py-3 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Browse Deals
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}