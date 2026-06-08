'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  BadgePercent,
  Users,
  Image as ImageIcon,
  AlertTriangle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  UserCheck
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = session?.user?.role === 'SUPER_ADMIN'

  const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard, permission: true },
    { name: 'Deals Moderation', href: '/deals', icon: BadgePercent, permission: session?.user?.permissions?.manageDeals || isAdmin },
    { name: 'User Management', href: '/users', icon: Users, permission: session?.user?.permissions?.manageUsers || isAdmin },
    { name: 'Banners & Categories', href: '/banners-categories', icon: ImageIcon, permission: session?.user?.permissions?.manageBanners || isAdmin },
    { name: 'Disputes Resolution', href: '/disputes', icon: AlertTriangle, permission: session?.user?.permissions?.resolveDisputes || isAdmin },
    { name: 'Sub-Admins', href: '/sub-admins', icon: ShieldAlert, permission: isAdmin },
  ]

  const activeNav = navigation.find((nav) => nav.href === pathname) || { name: 'Overview' }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-800 bg-zinc-900 transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Deelbreaker
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-6 w-6 items-center justify-center rounded-lg border border-zinc-800 hover:bg-zinc-800 hover:text-white lg:flex text-zinc-400 cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {navigation.map((item) => {
            if (!item.permission) return null
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
                {collapsed && !mobileOpen && (
                  <div className="absolute left-full ml-4 rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/45">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-3`}>
            {(!collapsed || mobileOpen) && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-zinc-400 truncate">{session?.user?.email}</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                  {session?.user?.role?.replace('_', ' ')}
                </p>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-zinc-400 transition-all duration-200 cursor-pointer`}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {activeNav.name}
            </h2>
          </div>
        </header>

        {/* Viewport content */}
        <main className="flex-1 overflow-y-auto p-8 bg-zinc-950">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
