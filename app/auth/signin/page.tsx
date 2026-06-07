'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, Zap,
  ArrowRight, ShoppingBag, Store, Star, CheckCircle,
  TrendingDown, Clock, Gift
} from 'lucide-react'
import { Suspense } from 'react'

const HIGHLIGHTS = [
  { icon: TrendingDown, color: 'text-green-400', label: 'Best prices', desc: 'Up to 70% off retail every day' },
  { icon: Clock,        color: 'text-blue-400',  label: 'Flash deals', desc: 'New deals drop every few hours' },
  { icon: Gift,         color: 'text-pink-400',  label: 'Cashback',    desc: 'Earn rewards on every purchase' },
]

const TESTIMONIALS = [
  { name: 'Sarah M.', saved: '$340', avatar: 'S', role: 'Buyer' },
  { name: 'James K.', saved: '$210', avatar: 'J', role: 'Buyer' },
  { name: 'Priya N.', saved: '$185', avatar: 'P', role: 'Buyer' },
]

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]   = useState(false)
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push(callbackUrl === '/' ? '/dashboard' : callbackUrl)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: callbackUrl === '/' ? '/dashboard' : callbackUrl })
    } catch {
      setError('Authentication failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — desktop only ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F3AF7B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#F4C2B8]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-linear-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Deelbreaker</span>
        </Link>

        {/* Hero copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F3AF7B]/15 text-[#F3AF7B] text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              <Star className="w-3 h-3 fill-current" />
              Rated 4.9 by 50,000+ members
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Good to have<br />
              <span className="bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] bg-clip-text text-transparent">
                you back
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Your deals, savings and cashback are waiting. Sign in and pick up where you left off.
            </p>
          </motion.div>

          {/* Highlights */}
          <div className="space-y-4 mb-10">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <h.icon className={`w-4 h-4 ${h.color}`} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{h.label}</p>
                  <p className="text-gray-500 text-xs">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent savers strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Recent savers</p>
            <div className="space-y-2.5">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-linear-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {t.avatar}
                    </div>
                    <span className="text-gray-400 text-xs">{t.name}</span>
                  </div>
                  <span className="text-green-400 text-xs font-bold">saved {t.saved}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Role badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-300 font-medium">Buyers</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Store className="w-4 h-4 text-[#F3AF7B]" />
            <span className="text-xs text-gray-300 font-medium">Sellers</span>
          </div>
          <span className="text-xs text-gray-600">One account for both</span>
        </motion.div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-white lg:bg-gray-50/50 overflow-y-auto">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-30">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Deelbreaker</span>
          </Link>
          <Link href="/auth/signup" className="text-sm font-semibold text-[#F3AF7B]">
            Sign up
          </Link>
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center px-5 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {/* Heading */}
            <div className="mb-7">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1.5">Welcome back</h2>
              <p className="text-gray-500 text-sm">
                Sign in to access your deals, orders, and cashback.
              </p>
            </div>

            {/* OAuth */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuth('apple')}
                disabled={isLoading}
                className="cursor-pointer w-full flex items-center justify-center gap-3 bg-gray-900 text-white rounded-2xl py-3.5 px-4 font-medium hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white lg:bg-gray-50/50 text-xs text-gray-400 font-medium uppercase tracking-wider">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] outline-none transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#F3AF7B] font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] outline-none transition-all text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    rememberMe ? 'bg-[#F3AF7B] border-[#F3AF7B]' : 'border-gray-300 group-hover:border-[#F3AF7B]'
                  }`}
                >
                  {rememberMe && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-gray-600">Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] text-white font-bold py-4 px-4 rounded-2xl hover:shadow-lg hover:shadow-orange-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-[#F3AF7B] font-bold hover:underline">
                Create one free
              </Link>
            </p>

            {/* Mobile-only social proof */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-100 space-y-3">
              {HIGHLIGHTS.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <h.icon className={`w-4 h-4 ${h.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{h.label}</p>
                    <p className="text-xs text-gray-400">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F3AF7B]" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
