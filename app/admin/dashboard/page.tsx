'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  Shield,
  Settings,
  AlertCircle,
} from 'lucide-react'
import AdminStats from '@/app/components/admin/AdminStats'
import DealModeration from '@/app/components/admin/DealModeration'
import UserManagement from '@/app/components/admin/UserManagement'
import Analytics from '@/app/components/admin/Analytics'
import CampaignManager from '@/app/components/admin/CampaignManager'

type TabType = 'overview' | 'deals' | 'users' | 'analytics' | 'campaigns'

interface AdminInfo {
  id: string
  email: string
  name: string | null
  role: string
}

const navItems = [
  { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
  { id: 'deals' as TabType, label: 'Deal Moderation', icon: ShoppingBag },
  { id: 'users' as TabType, label: 'Users', icon: Users },
  { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  { id: 'campaigns' as TabType, label: 'Promotions', icon: Megaphone },
]

const pageTitles: Record<TabType, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Platform summary and key metrics' },
  deals: { title: 'Deal Moderation', subtitle: 'Review, approve and manage deals' },
  users: { title: 'User Management', subtitle: 'Manage platform users and merchants' },
  analytics: { title: 'Analytics', subtitle: 'In-depth platform performance data' },
  campaigns: { title: 'Promotions', subtitle: 'Manage campaigns and banners' },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminInfo | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/auth/verify')
      .then(res => {
        if (!res.ok) { router.replace('/admin'); return null }
        return res.json()
      })
      .then(data => {
        if (data?.admin) {
          setAdmin(data.admin)
          fetchStats()
        }
      })
      .catch(() => router.replace('/admin'))
  }, [router])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      setStats(await res.json())
    } catch {}
    finally { setIsLoading(false) }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.replace('/admin')
  }

  if (isLoading || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  const initials = admin.name
    ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : admin.email.slice(0, 2).toUpperCase()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20">
          <Shield className="h-5 w-5 text-emerald-400" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="text-sm font-bold text-white leading-none">Deelbreaker</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest">Admin</p>
          </div>
        )}
      </div>

      <div className="mx-4 h-px bg-zinc-800" />

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(item => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false) }}
              title={sidebarCollapsed ? item.label : undefined}
              className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-emerald-400' : ''}`} style={{ width: 18, height: 18 }} />
              {!sidebarCollapsed && <span>{item.label}</span>}
              {active && !sidebarCollapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="mx-4 h-px bg-zinc-800" />

      {/* Bottom section */}
      <div className="p-3 space-y-1">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 mb-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-200">{admin.name || admin.email}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                {admin.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Sign Out' : undefined}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut style={{ width: 18, height: 18 }} className="shrink-0" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="relative hidden shrink-0 border-r border-zinc-800 bg-zinc-900 lg:flex lg:flex-col overflow-hidden"
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(v => !v)}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 shadow-md hover:text-white transition-colors"
        >
          {sidebarCollapsed
            ? <ChevronRight style={{ width: 12, height: 12 }} />
            : <ChevronLeft style={{ width: 12, height: 12 }} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 z-40 h-full w-60 border-r border-zinc-800 bg-zinc-900 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
            >
              <Menu style={{ width: 20, height: 20 }} />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white">
                {pageTitles[activeTab].title}
              </h1>
              <p className="hidden text-xs text-zinc-500 sm:block">
                {pageTitles[activeTab].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 sm:flex">
              <Search style={{ width: 13, height: 13 }} />
              Search...
            </button>
            <button className="relative cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Bell style={{ width: 18, height: 18 }} />
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </button>
            <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'overview' && stats && <AdminStats stats={stats} />}
              {activeTab === 'overview' && !stats && (
                <div className="flex h-64 items-center justify-center text-zinc-500">
                  <AlertCircle className="mr-2 h-5 w-5" /> Could not load stats
                </div>
              )}
              {activeTab === 'deals' && <DealModeration />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'analytics' && <Analytics />}
              {activeTab === 'campaigns' && <CampaignManager />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
