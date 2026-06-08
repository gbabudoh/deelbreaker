'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Shield, Key, AlertCircle } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: 'SUPER_ADMIN' | 'SUB_ADMIN'
  createdAt: string
  permissions: {
    manageDeals: boolean
    manageUsers: boolean
    manageBanners: boolean
    resolveDisputes: boolean
    manageAdmins: boolean
  } | null
}

export default function SubAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // New Admin Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [permDeals, setPermDeals] = useState(false)
  const [permUsers, setPermUsers] = useState(false)
  const [permBanners, setPermBanners] = useState(false)
  const [permDisputes, setPermDisputes] = useState(false)

  const fetchAdmins = async () => {
    setError(null)
    try {
      const res = await fetch('/api/sub-admins')
      if (!res.ok) {
        throw new Error('Failed to fetch admin users. Make sure you are logged in as SUPER_ADMIN.')
      }
      const data = await res.json()
      setAdmins(data)
    } catch (err: any) {
      setError(err.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    try {
      const res = await fetch('/api/sub-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          password,
          role: 'SUB_ADMIN',
          permissions: {
            manageDeals: permDeals,
            manageUsers: permUsers,
            manageBanners: permBanners,
            resolveDisputes: permDisputes,
            manageAdmins: false
          }
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create sub-admin')
      }

      const data = await res.json()
      setAdmins((prev) => [data, ...prev])
      
      setName('')
      setEmail('')
      setPassword('')
      setPermDeals(false)
      setPermUsers(false)
      setPermBanners(false)
      setPermDisputes(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleTogglePermission = async (admin: AdminUser, permKey: string, currentVal: boolean) => {
    if (admin.role === 'SUPER_ADMIN') return

    const updatedPermissions = {
      manageDeals: admin.permissions?.manageDeals ?? false,
      manageUsers: admin.permissions?.manageUsers ?? false,
      manageBanners: admin.permissions?.manageBanners ?? false,
      resolveDisputes: admin.permissions?.resolveDisputes ?? false,
      manageAdmins: admin.permissions?.manageAdmins ?? false,
      [permKey]: !currentVal
    }

    try {
      const res = await fetch('/api/sub-admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: admin.id,
          permissions: updatedPermissions
        })
      })

      if (!res.ok) throw new Error('Failed to update sub-admin permissions')

      setAdmins((prev) =>
        prev.map((a) =>
          a.id === admin.id ? { ...a, permissions: updatedPermissions } : a
        )
      )
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to remove this administrator account?')) return

    try {
      const res = await fetch(`/api/sub-admins?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to delete sub-admin')
      }
      setAdmins((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">Sub-Admin Management</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Create administrative users, delegate sub-role assignments, and edit system permission constraints.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* NEW ADMIN CREATE FORM */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
            Initialize Sub-Admin
          </h3>

          <form onSubmit={handleCreateAdmin} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="john@deelbreaker.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Initial Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2 border-t border-zinc-800 pt-4">
              <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Assigned Permissions
              </span>

              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permDeals}
                  onChange={(e) => setPermDeals(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500"
                />
                Manage Platform Deals
              </label>

              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permUsers}
                  onChange={(e) => setPermUsers(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500"
                />
                Manage Registered Users
              </label>

              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permBanners}
                  onChange={(e) => setPermBanners(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500"
                />
                Manage Categories & Banners
              </label>

              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permDisputes}
                  onChange={(e) => setPermDisputes(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500"
                />
                Resolve Disputes Ticket
              </label>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Register Sub-Admin
            </button>
          </form>
        </div>

        {/* ADMIN LIST */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
            System Administrators
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col border border-zinc-800 bg-zinc-900/60 p-5 rounded-2xl hover:border-zinc-700 transition-colors justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`p-2 rounded-xl border ${
                        admin.role === 'SUPER_ADMIN'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {admin.role === 'SUPER_ADMIN' ? <Shield className="h-4.5 w-4.5" /> : <Key className="h-4.5 w-4.5" />}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{admin.name || 'Admin User'}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{admin.email}</p>
                      </div>
                    </div>
                    {admin.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>

                  {/* Permissions Checklist */}
                  <div className="border-t border-zinc-800/80 mt-4 pt-3.5 space-y-2.5 text-xs text-zinc-300">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Permissions Delegation</div>
                    
                    <label className="flex items-center gap-2 hover:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={admin.role === 'SUPER_ADMIN'}
                        checked={admin.role === 'SUPER_ADMIN' || (admin.permissions?.manageDeals ?? false)}
                        onChange={() => handleTogglePermission(admin, 'manageDeals', admin.permissions?.manageDeals ?? false)}
                        className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                      />
                      Manage Deals Moderation
                    </label>

                    <label className="flex items-center gap-2 hover:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={admin.role === 'SUPER_ADMIN'}
                        checked={admin.role === 'SUPER_ADMIN' || (admin.permissions?.manageUsers ?? false)}
                        onChange={() => handleTogglePermission(admin, 'manageUsers', admin.permissions?.manageUsers ?? false)}
                        className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                      />
                      Manage Users Status
                    </label>

                    <label className="flex items-center gap-2 hover:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={admin.role === 'SUPER_ADMIN'}
                        checked={admin.role === 'SUPER_ADMIN' || (admin.permissions?.manageBanners ?? false)}
                        onChange={() => handleTogglePermission(admin, 'manageBanners', admin.permissions?.manageBanners ?? false)}
                        className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                      />
                      Manage Banners & Categories
                    </label>

                    <label className="flex items-center gap-2 hover:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={admin.role === 'SUPER_ADMIN'}
                        checked={admin.role === 'SUPER_ADMIN' || (admin.permissions?.resolveDisputes ?? false)}
                        onChange={() => handleTogglePermission(admin, 'resolveDisputes', admin.permissions?.resolveDisputes ?? false)}
                        className="rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50"
                      />
                      Resolve Transactions Disputes
                    </label>
                  </div>
                </div>

                <div className="border-t border-zinc-800/60 pt-3 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                  <span>Role: {admin.role}</span>
                  <span>Registered: {new Date(admin.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
