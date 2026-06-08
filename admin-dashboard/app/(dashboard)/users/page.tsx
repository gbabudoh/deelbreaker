'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw, Flame, Unlock, Slash } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  role: string | null
  level: string
  isFrozen: boolean
  frozenReason: string | null
  isBanned: boolean
  banReason: string | null
  createdAt: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchUsers = async () => {
    setError(null)
    try {
      const res = await fetch('/api/users')
      if (!res.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading users.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleFreezeToggle = async (user: User) => {
    let reason: string | null = null
    
    if (!user.isFrozen) {
      reason = prompt('Enter a reason for freezing this user account:')
      if (reason === null) return // Cancelled
      if (reason.trim() === '') reason = 'No reason provided'
    }

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          isFrozen: !user.isFrozen,
          frozenReason: !user.isFrozen ? reason : null
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user status')
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isFrozen: !user.isFrozen, frozenReason: !user.isFrozen ? reason : null } : u
        )
      )
    } catch (err: any) {
      alert(err.message || 'Error updating user.')
    }
  }

  const handleBanToggle = async (user: User) => {
    let reason: string | null = null
    
    if (!user.isBanned) {
      reason = prompt('Enter a reason for banning this user account:')
      if (reason === null) return // Cancelled
      if (reason.trim() === '') reason = 'No reason provided'
    }

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          isBanned: !user.isBanned,
          banReason: !user.isBanned ? reason : null
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update user status')
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBanned: !user.isBanned, banReason: !user.isBanned ? reason : null } : u
        )
      )
    } catch (err: any) {
      alert(err.message || 'Error updating user.')
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
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">User Management</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Monitor registered buyer and seller accounts, freeze access, or issue permanent platform bans.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true)
            fetchUsers()
          }}
          disabled={refreshing}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              No users registered on the platform.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role / Level</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{user.name || 'Anonymous'}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300 border border-zinc-700">
                        {user.role || 'BUYER'}
                      </span>
                      <div className="mt-1 text-xs text-zinc-500">Level: {user.level}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.isBanned ? (
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 text-xs font-semibold">
                            Banned
                          </span>
                          <p className="mt-1 text-[10px] text-zinc-550 max-w-[150px] truncate text-zinc-400" title={user.banReason || ''}>
                            Reason: {user.banReason || 'None'}
                          </p>
                        </div>
                      ) : user.isFrozen ? (
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 text-xs font-semibold">
                            Frozen
                          </span>
                          <p className="mt-1 text-[10px] text-zinc-550 max-w-[150px] truncate text-zinc-400" title={user.frozenReason || ''}>
                            Reason: {user.frozenReason || 'None'}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => handleFreezeToggle(user)}
                          disabled={user.isBanned}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            user.isFrozen
                              ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                              : 'border-zinc-800 text-zinc-400 hover:text-orange-400 hover:border-orange-500/20 hover:bg-orange-500/10'
                          }`}
                        >
                          {user.isFrozen ? (
                            <>
                              <Unlock className="h-3.5 w-3.5" /> Unfreeze
                            </>
                          ) : (
                            <>
                              <Flame className="h-3.5 w-3.5" /> Freeze
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleBanToggle(user)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                            user.isBanned
                              ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500'
                              : 'border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10'
                          }`}
                        >
                          {user.isBanned ? (
                            <>
                              <Unlock className="h-3.5 w-3.5" /> Unban
                            </>
                          ) : (
                            <>
                              <Slash className="h-3.5 w-3.5" /> Ban User
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
