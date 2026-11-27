'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, ShieldBan, ShieldCheck, Users } from 'lucide-react'
import { toast } from '@/lib/toast'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { ConfirmDialog } from '@/components/dashboard/ConfirmDialog'
import { getAllUsers, blockUser, unblockUser, getUserId, getUserStatus, type UserRecord } from '@/lib/api/users'
import { getErrorMessage } from '@/lib/api-client'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [target, setTarget] = useState<{ user: UserRecord; action: 'block' | 'unblock' } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setUsers(await getAllUsers())
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to load users.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      const role = String(u.role || '').toLowerCase()
      const matchesRole = roleFilter === 'all' || role === roleFilter
      const hay = [u.name, u.email, role].filter(Boolean).join(' ').toLowerCase()
      return matchesRole && (!q || hay.includes(q))
    })
  }, [users, query, roleFilter])

  const confirmAction = async () => {
    if (!target) return
    const id = getUserId(target.user)
    try {
      setSubmitting(true)
      if (target.action === 'block') await blockUser(id)
      else await unblockUser(id)
      toast.success(`User ${target.action === 'block' ? 'blocked' : 'unblocked'} successfully.`)
      setTarget(null)
      await load()
    } catch (e) {
      toast.error(getErrorMessage(e, `Failed to ${target.action} user.`))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Manage <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Users</span></h1>
        <p className="mt-2 text-sm text-zinc-400">View, search, and manage registered users.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email..." className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-red-500" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {loading ? <LoadingBlock label="Loading users..." /> : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description="No registered users match your search." />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="px-3 py-3">User</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((u) => {
                  const status = getUserStatus(u)
                  const isBlocked = status === 'blocked'
                  return (
                    <tr key={getUserId(u)} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-4">
                        <p className="font-semibold text-white">{u.name || 'Unnamed User'}</p>
                        <p className="text-xs text-zinc-500">{u.email || 'No email'}</p>
                      </td>
                      <td className="px-3 py-4"><span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-300">{String(u.role || 'customer')}</span></td>
                      <td className="px-3 py-4"><StatusPill status={status} /></td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end">
                          {isBlocked ? (
                            <button onClick={() => setTarget({ user: u, action: 'unblock' })} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"><ShieldCheck size={14} /> Unblock</button>
                          ) : (
                            <button onClick={() => setTarget({ user: u, action: 'block' })} className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"><ShieldBan size={14} /> Block</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        title={target?.action === 'block' ? 'Block User' : 'Unblock User'}
        description={target?.action === 'block' ? 'Are you sure you want to block this user? They may lose access to the platform.' : 'Are you sure you want to unblock this user?'}
        confirmLabel={target?.action === 'block' ? 'Block User' : 'Unblock User'}
        tone={target?.action === 'block' ? 'danger' : 'primary'}
        loading={submitting}
        onConfirm={confirmAction}
        onClose={() => !submitting && setTarget(null)}
      />
    </div>
  )
}
