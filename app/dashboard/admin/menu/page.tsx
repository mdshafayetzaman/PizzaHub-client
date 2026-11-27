'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Check, X, Trash2, Pizza } from 'lucide-react'
import { toast } from '@/lib/toast'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { ConfirmDialog } from '@/components/dashboard/ConfirmDialog'
import {
  getAllMenuItemsAdmin,
  approveMenuItem,
  rejectMenuItem,
  deleteMenuItem,
  updateMenuItemStatus,
  getMenuId,
  getMenuName,
  getMenuImage,
  getMenuStatus,
  type MenuItemRecord,
} from '@/lib/api/menu'
import { getErrorMessage } from '@/lib/api-client'

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [action, setAction] = useState<{ type: 'approve' | 'reject' | 'delete' | 'activate' | 'deactivate'; item: MenuItemRecord } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setItems(await getAllMenuItemsAdmin())
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to load menu items.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const categories = useMemo(() => Array.from(new Set(items.map((i) => String(i.category || '')).filter(Boolean))), [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((i) => {
      const s = getMenuStatus(i)
      const matchQ = !q || [getMenuName(i), i.vendorName, i.vendorEmail, i.category].filter(Boolean).join(' ').toLowerCase().includes(q)
      const matchCat = category === 'all' || String(i.category) === category
      const matchStatus = status === 'all' || s === status
      return matchQ && matchCat && matchStatus
    })
  }, [items, query, category, status])

  const runAction = async () => {
    if (!action) return
    const id = getMenuId(action.item)
    try {
      setSubmitting(true)
      if (action.type === 'approve') await approveMenuItem(id)
      else if (action.type === 'reject') await rejectMenuItem(id)
      else if (action.type === 'delete') await deleteMenuItem(id)
      else if (action.type === 'activate') await updateMenuItemStatus(id, 'approved')
      else if (action.type === 'deactivate') await updateMenuItemStatus(id, 'inactive')
      toast.success(`Menu item ${action.type}d successfully.`.replace('approvedd', 'approved').replace('activatedd', 'activated').replace('deactivatedd', 'deactivated'))
      setAction(null)
      await load()
    } catch (e) {
      toast.error(getErrorMessage(e, `Failed to ${action.type} menu item.`))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Manage <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Menu Items</span></h1>
        <p className="mt-2 text-sm text-zinc-400">Review, approve, reject, and manage all vendor menu submissions.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search menu or vendor..." className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-red-500" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500">
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {loading ? <LoadingBlock label="Loading menu items..." /> : filtered.length === 0 ? (
          <EmptyState icon={Pizza} title="No menu items found" description="No menu items match the current filters." />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="px-3 py-3">Item</th>
                  <th className="px-3 py-3">Vendor</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((item) => {
                  const s = getMenuStatus(item)
                  return (
                    <tr key={getMenuId(item)} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {getMenuImage(item) ? <img src={getMenuImage(item)} alt="" className="h-11 w-11 rounded-xl object-cover border border-white/10" /> : <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10" />}
                          <span className="font-semibold text-white">{getMenuName(item)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-300">{item.vendorName || item.vendorEmail || 'N/A'}</td>
                      <td className="px-3 py-4 text-sm text-zinc-300 capitalize">{String(item.category || 'N/A')}</td>
                      <td className="px-3 py-4 text-sm text-zinc-300">${Number(item.price || 0).toFixed(2)}</td>
                      <td className="px-3 py-4"><StatusPill status={s} /></td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          {s === 'pending' ? (
                            <>
                              <button onClick={() => setAction({ type: 'approve', item })} className="h-9 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-500"><Check size={14} className="inline mr-1" />Approve</button>
                              <button onClick={() => setAction({ type: 'reject', item })} className="h-9 rounded-lg bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-500"><X size={14} className="inline mr-1" />Reject</button>
                            </>
                          ) : null}
                          {s === 'approved' || s === 'active' ? (
                            <button onClick={() => setAction({ type: 'deactivate', item })} className="h-9 rounded-lg border border-zinc-600 px-3 text-xs font-semibold text-zinc-300 hover:bg-white/10">Deactivate</button>
                          ) : null}
                          {s === 'inactive' ? (
                            <button onClick={() => setAction({ type: 'activate', item })} className="h-9 rounded-lg border border-emerald-500/30 px-3 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10">Activate</button>
                          ) : null}
                          <button onClick={() => setAction({ type: 'delete', item })} className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10" aria-label="Delete"><Trash2 size={14} /></button>
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
        open={!!action}
        title={`${action?.type ? action.type.charAt(0).toUpperCase() + action.type.slice(1) : ''} Menu Item`}
        description={`Are you sure you want to ${action?.type} "${action ? getMenuName(action.item) : ''}"?`}
        confirmLabel={action?.type ? action.type.charAt(0).toUpperCase() + action.type.slice(1) : 'Confirm'}
        tone={action?.type === 'delete' || action?.type === 'reject' || action?.type === 'deactivate' ? 'danger' : 'primary'}
        loading={submitting}
        onConfirm={runAction}
        onClose={() => !submitting && setAction(null)}
      />
    </div>
  )
}
