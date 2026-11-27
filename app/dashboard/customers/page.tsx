'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShoppingBag, Clock3, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/lib/toast'

import { StatCard } from '@/components/dashboard/StatCard'
import { StatSkeleton, LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { getMyOrders, getOrderId, getOrderStatus, type OrderRecord } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/api-client'

export default function CustomerOverviewPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getMyOrders()
        setOrders(data)
      } catch (e) {
        setError(getErrorMessage(e, 'Failed to load your orders.'))
        toast.error(getErrorMessage(e, 'Failed to load customer dashboard.'))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const stats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter((o) => getOrderStatus(o) === 'pending').length
    const accepted = orders.filter((o) => getOrderStatus(o) === 'accepted').length
    const rejected = orders.filter((o) => getOrderStatus(o) === 'rejected').length
    return { total, pending, accepted, rejected }
  }, [orders])

  const recent = orders.slice(0, 5)

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Customer <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Overview</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">Track your pizza orders and their status.</p>
      </div>

      {error ? <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2"><AlertCircle size={18} />{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />) : (
          <>
            <StatCard title="Total Orders" value={stats.total} icon={ShoppingBag} tone="red" />
            <StatCard title="Pending Orders" value={stats.pending} icon={Clock3} tone="orange" />
            <StatCard title="Accepted Orders" value={stats.accepted} icon={CheckCircle2} tone="emerald" />
            <StatCard title="Rejected Orders" value={stats.rejected} icon={XCircle} tone="red" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
          <h2 className="text-lg font-bold">Order Status Chart</h2>
          <p className="mt-1 text-sm text-zinc-500">Distribution of your order statuses.</p>
          {loading ? <LoadingBlock label="Loading chart..." /> : orders.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No orders yet" description="Your order statistics will appear after you place orders." />
          ) : (
            <div className="mt-6 space-y-3">
              {[
                ['pending', stats.pending],
                ['accepted', stats.accepted],
                ['rejected', stats.rejected],
                ['cancelled', orders.filter((o) => getOrderStatus(o) === 'cancelled').length],
              ].map(([label, count]) => {
                const n = Number(count)
                const pct = orders.length ? Math.round((n / orders.length) * 100) : 0
                return (
                  <div key={String(label)}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-zinc-300">{String(label)}</span>
                      <span className="text-zinc-400">{n} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <p className="mt-1 text-sm text-zinc-500">Your most recent pizza orders.</p>
          {loading ? <LoadingBlock label="Loading orders..." /> : recent.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No recent orders" description="Place an order to see it here." />
          ) : (
            <div className="mt-5 space-y-3">
              {recent.map((order) => (
                <div key={getOrderId(order)} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{order.pizzaName || order.itemName || order.menuItemName || 'Order'}</p>
                    <p className="truncate text-xs text-zinc-500">{order.vendorName || order.vendorEmail || 'Vendor'}</p>
                  </div>
                  <StatusPill status={getOrderStatus(order)} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
