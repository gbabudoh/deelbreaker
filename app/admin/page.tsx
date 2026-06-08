'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/auth/verify')
      .then(res => {
        if (res.ok) router.replace('/admin/dashboard')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please try again.')
      } else {
        router.push('/admin/dashboard')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,rgba(0,0,0,0)_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
            <Shield className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Deelbreaker</h1>
          <p className="mt-1.5 text-sm text-zinc-500">Admin Control Center</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          <h2 className="mb-6 text-lg font-semibold text-zinc-200">Sign in to your account</h2>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@deelbreaker.com"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-600 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Admin access only &mdash; unauthorised access is prohibited
        </p>
      </div>
    </div>
  )
}
