'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, X, Search, ShoppingBag } from 'lucide-react'
import { toast } from '@/lib/toast'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { ConfirmDialog } from '@/components/dashboard/ConfirmDialog'
import { getVendorOrders, acceptOrder, rejectOrder, getOrderId, getOrderStatus, type OrderRecord } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/api-client'

function fmtDate(v?: string) {
  if (!v) return 'N/A'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString()
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [action, setAction] = useState<{ type: 'accept' | 'reject'; order: OrderRecord } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setOrders(await getVendorOrders())
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to load vendor orders.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      const status = getOrderStatus(o)
      const matchStatus = statusFilter === 'all' || status === statusFilter
      const hay = [o.customerName, o.customerEmail, o.pizzaName, o.itemName, o.menuItemName, o.deliveryAddress, o.message, o.additionalMessage, status].filter(Boolean).join(' ').toLowerCase()
      return matchStatus && (!q || hay.includes(q))
    })
  }, [orders, query, statusFilter])

  const runAction = async () => {
    if (!action) return
    const id = getOrderId(action.order)
    try {
      setSubmitting(true)
      if (action.type === 'accept') await acceptOrder(id)
      else await rejectOrder(id)
      toast.success(`Order ${action.type === 'accept' ? 'accepted' : 'rejected'} successfully.`)
      setAction(null)
      await load()
    } catch (e) {
      toast.error(getErrorMessage(e, `Failed to ${action.type} order.`))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Customer <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Orders</span></h1>
        <p className="mt-2 text-sm text-zinc-400">Review and manage incoming customer orders.</p>
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

        {loading ? <LoadingBlock label="Loading customer orders..." /> : filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders found" description="Customer orders for your items will appear here." />
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((order) => {
              const status = getOrderStatus(order)
              const isPending = status === 'pending'
              return (
                <div key={getOrderId(order)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">{order.pizzaName || order.itemName || order.menuItemName || 'Order'}</h3>
                        <StatusPill status={status} />
                      </div>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Customer:</span> {order.customerName || 'N/A'} {order.customerEmail ? <span className="text-zinc-500">({order.customerEmail})</span> : null}</p>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Delivery Date:</span> {fmtDate(order.deliveryDate)}</p>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Address:</span> {order.deliveryAddress || 'N/A'}</p>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Message:</span> {order.message || order.additionalMessage || 'N/A'}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button disabled={!isPending} onClick={() => setAction({ type: 'accept', order })} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"><Check size={16} /> Accept</button>
                      <button disabled={!isPending} onClick={() => setAction({ type: 'reject', order })} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"><X size={16} /> Reject</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!action}
        title={action?.type === 'accept' ? 'Accept Order' : 'Reject Order'}
        description={`Are you sure you want to ${action?.type} this order?`}
        confirmLabel={action?.type === 'accept' ? 'Accept' : 'Reject'}
        tone={action?.type === 'reject' ? 'danger' : 'primary'}
        loading={submitting}
        onConfirm={runAction}
        onClose={() => !submitting && setAction(null)}
      />
    </div>
  )
}
