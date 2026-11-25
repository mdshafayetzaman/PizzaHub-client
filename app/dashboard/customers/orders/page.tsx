'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, XCircle, Search, ShoppingBag } from 'lucide-react'
import { toast } from 'react-toastify'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { ConfirmDialog } from '@/components/dashboard/ConfirmDialog'
import { getMyOrders, cancelOrder, getOrderId, getOrderStatus, type OrderRecord } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/api-client'

function formatDate(value?: string) {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString()
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<OrderRecord | null>(null)
  const [cancelTarget, setCancelTarget] = useState<OrderRecord | null>(null)
  const [canceling, setCanceling] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getMyOrders()
      setOrders(data)
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to load orders.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      const status = getOrderStatus(o)
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const hay = [o.pizzaName, o.itemName, o.menuItemName, o.vendorName, o.vendorEmail, o.deliveryAddress, status].filter(Boolean).join(' ').toLowerCase()
      return matchesStatus && (!q || hay.includes(q))
    })
  }, [orders, query, statusFilter])

  const onCancel = async () => {
    if (!cancelTarget) return
    const id = getOrderId(cancelTarget)
    try {
      setCanceling(true)
      await cancelOrder(id)
      toast.success('Order cancelled successfully.')
      setCancelTarget(null)
      await load()
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to cancel order.'))
    } finally {
      setCanceling(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Orders</span></h1>
        <p className="mt-2 text-sm text-zinc-400">View and manage your pizza orders.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders..." className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-red-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? <LoadingBlock label="Loading your orders..." /> : filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders found" description="You have no orders matching the current filters." />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="px-3 py-3">Pizza</th>
                  <th className="px-3 py-3">Vendor</th>
                  <th className="px-3 py-3">Delivery Date</th>
                  <th className="px-3 py-3">Address</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Requested</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((order) => {
                  const status = getOrderStatus(order)
                  const canCancel = status === 'pending'
                  return (
                    <tr key={getOrderId(order)} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {order.pizzaImage || order.imageUrl ? (
                            <img src={String(order.pizzaImage || order.imageUrl)} alt="" className="h-11 w-11 rounded-xl object-cover border border-white/10" />
                          ) : <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10" />}
                          <span className="font-semibold text-white">{order.pizzaName || order.itemName || order.menuItemName || 'Order'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-300">{order.vendorName || order.vendorEmail || 'N/A'}</td>
                      <td className="px-3 py-4 text-sm text-zinc-300">{formatDate(order.deliveryDate)}</td>
                      <td className="px-3 py-4 text-sm text-zinc-400 max-w-[220px] truncate">{order.deliveryAddress || 'N/A'}</td>
                      <td className="px-3 py-4"><StatusPill status={status} /></td>
                      <td className="px-3 py-4 text-sm text-zinc-400">{formatDate(order.requestDate || order.createdAt)}</td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelected(order)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/10" aria-label="View details"><Eye size={15} /></button>
                          <button onClick={() => setCancelTarget(order)} disabled={!canCancel} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Cancel order"><XCircle size={15} /></button>
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
        open={!!cancelTarget}
        title="Cancel Order"
        description="Are you sure you want to cancel this pending order? This action cannot be undone."
        confirmLabel="Cancel Order"
        loading={canceling}
        onConfirm={onCancel}
        onClose={() => !canceling && setCancelTarget(null)}
      />

      {selected ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Order Details</h3>
                <p className="text-sm text-zinc-500">{selected.pizzaName || selected.itemName || selected.menuItemName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"><XCircle size={18} /></button>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ['Status', <StatusPill key="s" status={getOrderStatus(selected)} />],
                ['Vendor', selected.vendorName || selected.vendorEmail || 'N/A'],
                ['Delivery Date', formatDate(selected.deliveryDate)],
                ['Delivery Address', selected.deliveryAddress || 'N/A'],
                ['Request Date', formatDate(selected.requestDate || selected.createdAt)],
                ['Additional Message', selected.message || selected.additionalMessage || 'N/A'],
                ['Price', selected.totalAmount != null ? `$${Number(selected.totalAmount).toFixed(2)}` : selected.price != null ? `$${Number(selected.price).toFixed(2)}` : 'N/A'],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-4 border-b border-white/5 pb-3">
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className="text-right text-zinc-200">{value as any}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : null}
    </div>
  )
}
