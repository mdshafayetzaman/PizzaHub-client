'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, X, Search, ShoppingBag, AlertCircle } from 'lucide-react'
import { toast } from '@/lib/toast'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { ConfirmDialog } from '@/components/dashboard/ConfirmDialog'
import { getVendorOrders, acceptOrder, rejectOrder, getOrderId, getOrderStatus, type OrderRecord } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/api-client'

function fmtDate(v?: unknown) {
  if (v == null || v === '') return 'N/A'
  if (typeof v === 'string' || typeof v === 'number' || v instanceof Date) {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString()
  }
  return 'N/A'
}

function text(v: unknown, fallback = 'N/A') {
  if (v == null) return fallback
  if (typeof v === 'string') {
    const trimmed = v.trim()
    return trimmed || fallback
  }
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return fallback
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [action, setAction] = useState<{ type: 'accept' | 'reject'; order: OrderRecord } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [loadError, setLoadError] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      setLoadError('')
      const data = await getVendorOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      const message = getErrorMessage(e, 'Failed to load vendor orders.')
      setLoadError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await getVendorOrders()
        if (!active) return
        setOrders(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!active) return
        const message = getErrorMessage(e, 'Failed to load vendor orders.')
        setLoadError(message)
        toast.error(message)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const safeOrders = Array.isArray(orders) ? orders : []
    return safeOrders.filter((o) => {
      if (!o || typeof o !== 'object') return false
      const status = getOrderStatus(o)
      const matchStatus = statusFilter === 'all' || status === statusFilter
      const hay = [o.customerName, o.customerEmail, o.pizzaName, o.itemName, o.menuItemName, o.deliveryAddress, o.message, o.additionalMessage, status]
        .map((v) => text(v, ''))
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchStatus && (!q || hay.includes(q))
    })
  }, [orders, query, statusFilter])

  const runAction = async () => {
    if (!action) return
    const id = getOrderId(action.order)
    if (!id) {
      toast.error('Invalid order id. Please refresh and try again.')
      return
    }
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

        {loading ? <LoadingBlock label="Loading customer orders..." /> : loadError ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
              <div>
                <p className="font-semibold text-red-100">Unable to load vendor orders</p>
                <p className="mt-1 text-red-200/90">{loadError}</p>
                <button type="button" onClick={() => void load()} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 hover:bg-red-500/20">
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders found" description="Customer orders for your items will appear here." />
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((order, index) => {
              const status = getOrderStatus(order)
              const isPending = status === 'pending'
              const orderId = getOrderId(order)
              const customerName = text(order.customerName)
              const customerEmail = text(order.customerEmail, '')
              const deliveryAddress = text(order.deliveryAddress)
              const message = text(order.message || order.additionalMessage)
              const itemName = text(order.pizzaName || order.itemName || order.menuItemName, 'Order')

              return (
                <div key={orderId || `order-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">{itemName}</h3>
                        {order.isDemo ? (
                          <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-300">
                            Demo
                          </span>
                        ) : null}
                        <StatusPill status={status} />
                      </div>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Customer:</span> {customerName}{customerEmail ? <span className="text-zinc-500"> ({customerEmail})</span> : null}</p>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Delivery Date:</span> {fmtDate(order.deliveryDate)}</p>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Address:</span> {deliveryAddress}</p>
                      <p className="text-sm text-zinc-300"><span className="text-zinc-500">Message:</span> {message}</p>
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
