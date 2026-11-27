'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, Search, Pencil, Trash2, Eye, X, Loader2, Pizza, CheckCircle2 } from 'lucide-react'
import { toast } from '@/lib/toast'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { ConfirmDialog } from '@/components/dashboard/ConfirmDialog'
import {
  getMyMenuItems,
  updateMenuItem,
  deleteMenuItem,
  patchMenuItem,
  getMenuId,
  getMenuName,
  getMenuImage,
  getMenuStatus,
  type MenuItemRecord,
} from '@/lib/api/menu'
import { getErrorMessage } from '@/lib/api-client'

const inputClass = 'w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500'
const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400'

export default function VendorMenuPage() {
  const [items, setItems] = useState<MenuItemRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewItem, setViewItem] = useState<MenuItemRecord | null>(null)
  const [editItem, setEditItem] = useState<MenuItemRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MenuItemRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setItems(await getMyMenuItems())
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
      const matchQ = !q || [getMenuName(i), i.description, i.category, i.location].filter(Boolean).join(' ').toLowerCase().includes(q)
      const matchCat = category === 'all' || String(i.category) === category
      const matchStatus = statusFilter === 'all' || s === statusFilter
      return matchQ && matchCat && matchStatus
    })
  }, [items, query, category, statusFilter])

  const onDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await deleteMenuItem(getMenuId(deleteTarget))
      toast.success('Menu item deleted successfully.')
      setDeleteTarget(null)
      await load()
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to delete menu item.'))
    } finally {
      setDeleting(false)
    }
  }

  const onEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editItem) return
    const fd = new FormData(e.currentTarget)
    const payload = {
      pizzaName: String(fd.get('pizzaName') || '').trim(),
      category: String(fd.get('category') || '').trim(),
      price: Number(fd.get('price')),
      location: String(fd.get('location') || '').trim(),
      imageUrl: String(fd.get('imageUrl') || '').trim(),
      description: String(fd.get('description') || '').trim(),
      preparationTime: String(fd.get('preparationTime') || '').trim(),
      availableDate: String(fd.get('availableDate') || '').trim(),
    }
    if (!payload.pizzaName || !payload.category || !payload.location || !payload.imageUrl || !payload.description || !Number.isFinite(payload.price) || payload.price <= 0) {
      toast.error('Please fill all required fields.')
      return
    }
    try {
      setSaving(true)
      await updateMenuItem(getMenuId(editItem), payload)
      toast.success('Menu item updated successfully.')
      setEditItem(null)
      await load()
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to update menu item.'))
    } finally {
      setSaving(false)
    }
  }

  const toggleAvailability = async (item: MenuItemRecord) => {
    const id = getMenuId(item)
    const current = getMenuStatus(item)
    const next = current === 'inactive' ? 'approved' : 'inactive'
    try {
      await patchMenuItem(id, { status: next, approvalStatus: next, isActive: next !== 'inactive' })
      toast.success(`Item marked as ${next}.`)
      await load()
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to update availability.'))
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Menu Items</span></h1>
          <p className="mt-2 text-sm text-zinc-400">Manage your menu items, availability, and approval status.</p>
        </div>
        <Link href="/dashboard/vendor/menu/add" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 text-sm font-bold text-white"><PlusCircle size={17} /> Add Menu Item</Link>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative w-full lg:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search items..." className={`${inputClass} pl-9`} />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass + ' lg:max-w-[220px]'}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass + ' lg:max-w-[220px]'}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {loading ? <LoadingBlock label="Loading menu items..." /> : filtered.length === 0 ? (
          <EmptyState icon={Pizza} title="No menu items found" description="No menu items match your filters." action={<Link href="/dashboard/vendor/menu/add" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 text-sm font-bold text-white"><PlusCircle size={16} /> Add Menu Item</Link>} />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="px-3 py-3">Item</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Price</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Availability</th><th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((item) => {
                  const status = getMenuStatus(item)
                  const available = status !== 'inactive'
                  return (
                    <tr key={getMenuId(item)} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {getMenuImage(item) ? <img src={getMenuImage(item)} alt="" className="h-11 w-11 rounded-xl object-cover border border-white/10" /> : <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10" />}
                          <div>
                            <p className="flex items-center gap-2 font-semibold text-white">
                              {getMenuName(item)}
                              {Boolean(item.isDemo) ? <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-300">Demo</span> : null}
                            </p>
                            <p className="text-xs text-zinc-500 line-clamp-1 max-w-[260px]">{item.location || item.description || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-300 capitalize">{String(item.category || 'N/A')}</td>
                      <td className="px-3 py-4 text-sm font-semibold text-emerald-400">${Number(item.price || 0).toFixed(2)}</td>
                      <td className="px-3 py-4"><StatusPill status={status} /></td>
                      <td className="px-3 py-4">
                        <button onClick={() => void toggleAvailability(item)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${available ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' : 'bg-zinc-500/10 text-zinc-300 hover:bg-zinc-500/20'}`}>
                          {available ? 'Available' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setViewItem(item)} className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10"><Eye size={15} /></button>
                          <button onClick={() => setEditItem(item)} className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-orange-500/10 hover:text-orange-300"><Pencil size={15} /></button>
                          <button onClick={() => setDeleteTarget(item)} className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
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

      <ConfirmDialog open={!!deleteTarget} title="Delete Menu Item" description={`Are you sure you want to delete "${deleteTarget ? getMenuName(deleteTarget) : ''}"? This action cannot be undone.`} confirmLabel="Delete" loading={deleting} onConfirm={onDelete} onClose={() => !deleting && setDeleteTarget(null)} />

      {viewItem ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setViewItem(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><h3 className="text-lg font-bold text-white">{getMenuName(viewItem)}</h3><StatusPill status={getMenuStatus(viewItem)} /></div>
              <button onClick={() => setViewItem(null)} className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"><X size={18} /></button>
            </div>
            {getMenuImage(viewItem) ? <img src={getMenuImage(viewItem)} alt="" className="mt-4 h-48 w-full rounded-2xl object-cover border border-white/10" /> : null}
            <dl className="mt-4 space-y-3 text-sm">
              {[['Category', String(viewItem.category || 'N/A')], ['Price', `$${Number(viewItem.price || 0).toFixed(2)}`], ['Location', String(viewItem.location || 'N/A')], ['Description', String(viewItem.description || 'N/A')]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between gap-4 border-b border-white/5 pb-3"><dt className="text-zinc-500">{k}</dt><dd className="text-right text-zinc-200">{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      ) : null}

      {editItem ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && !saving && setEditItem(null)}>
          <div className="my-8 w-full max-w-lg rounded-3xl border border-white/10 bg-[#111114] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h3 className="text-lg font-bold text-white">Edit Menu Item</h3>
              <button onClick={() => !saving && setEditItem(null)} className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={onEditSave} className="space-y-4 p-5 max-h-[70vh] overflow-y-auto">
              <div><label className={labelClass}>Pizza Name</label><input name="pizzaName" defaultValue={getMenuName(editItem)} required className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Category</label><input name="category" defaultValue={String(editItem.category || '')} required className={inputClass} /></div>
                <div><label className={labelClass}>Price</label><input name="price" type="number" min="0.01" step="0.01" defaultValue={Number(editItem.price || 0)} required className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Location</label><input name="location" defaultValue={String(editItem.location || '')} required className={inputClass} /></div>
              <div><label className={labelClass}>Image URL</label><input name="imageUrl" type="url" defaultValue={getMenuImage(editItem)} required className={inputClass} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Preparation Time</label><input name="preparationTime" defaultValue={String(editItem.preparationTime || '')} className={inputClass} /></div>
                <div><label className={labelClass}>Available Date</label><input name="availableDate" type="date" defaultValue={String(editItem.availableDate || '').slice(0, 10)} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Description</label><textarea name="description" rows={4} defaultValue={String(editItem.description || '')} required className={`${inputClass} min-h-[110px] resize-y`} /></div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => !saving && setEditItem(null)} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-zinc-300 hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 text-sm font-bold text-white disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} {saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
