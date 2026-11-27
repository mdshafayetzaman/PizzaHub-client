'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pizza, Clock3, CheckCircle2, CreditCard, ShoppingBag, AlertCircle } from 'lucide-react'
import { toast } from '@/lib/toast'

import { StatCard } from '@/components/dashboard/StatCard'
import { LoadingBlock, StatSkeleton } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { getMyMenuItems, getMenuStatus, getMenuName, type MenuItemRecord } from '@/lib/api/menu'
import { getVendorOrders, getOrderId, getOrderStatus, type OrderRecord } from '@/lib/api/orders'
import { getMySubscription, type SubscriptionRecord } from '@/lib/api/subscriptions'
import { getErrorMessage } from '@/lib/api-client'

export default function VendorOverviewPage() {
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([])
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const [menuRes, orderRes, subRes] = await Promise.allSettled([
        getMyMenuItems(),
        getVendorOrders(),
        getMySubscription(),
      ])

      if (menuRes.status === 'fulfilled') setMenuItems(menuRes.value)
      else console.error(menuRes.reason)
      if (orderRes.status === 'fulfilled') setOrders(orderRes.value)
      else console.error(orderRes.reason)
      if (subRes.status === 'fulfilled') setSubscription(subRes.value)
      else console.error(subRes.reason)

      const failures = [menuRes, orderRes, subRes].filter((r) => r.status === 'rejected')
      if (failures.length === 3) {
        setError('Unable to load vendor dashboard data. Please verify backend API endpoints are available.')
      } else if (failures.length > 0) {
        toast.error('Some dashboard data could not be loaded.')
      }
    } catch (e) {
      setError(getErrorMessage(e, 'Failed to load vendor dashboard.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const stats = useMemo(() => {
    const totalMenu = menuItems.length
    const activeMenu = menuItems.filter((i) => {
      const s = getMenuStatus(i)
      return s === 'approved' || s === 'active'
    }).length
    const pendingOrders = orders.filter((o) => getOrderStatus(o) === 'pending').length
    const acceptedOrders = orders.filter((o) => getOrderStatus(o) === 'accepted').length
    const plan = String(subscription?.plan || (subscription?.isPremium ? 'premium' : 'free')).toLowerCase()
    return { totalMenu, activeMenu, pendingOrders, acceptedOrders, plan }
  }, [menuItems, orders, subscription])

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Vendor <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Overview</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">Track your menu, orders, and subscription at a glance.</p>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loading ? Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />) : (
          <>
            <StatCard title="Total Menu Items" value={stats.totalMenu} icon={Pizza} tone="red" />
            <StatCard title="Active Menu Items" value={stats.activeMenu} icon={CheckCircle2} tone="emerald" />
            <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock3} tone="orange" />
            <StatCard title="Accepted Orders" value={stats.acceptedOrders} icon={ShoppingBag} tone="blue" />
            <StatCard title="Current Plan" value={stats.plan === 'premium' ? 'Premium' : 'Free'} icon={CreditCard} tone="violet" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
          <h2 className="text-lg font-bold">Menu Status</h2>
          <p className="mt-1 text-sm text-zinc-500">Breakdown of your menu item statuses.</p>
          {loading ? <LoadingBlock label="Loading menu stats..." /> : menuItems.length === 0 ? (
            <EmptyState icon={Pizza} title="No menu items yet" description="Add your first menu item to see statistics here." />
          ) : (
            <div className="mt-6 space-y-3">
              {['pending', 'approved', 'rejected', 'inactive'].map((status) => {
                const count = menuItems.filter((i) => getMenuStatus(i) === status).length
                const pct = menuItems.length ? Math.round((count / menuItems.length) * 100) : 0
                return (
                  <div key={status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-zinc-300">{status}</span>
                      <span className="text-zinc-400">{count} ({pct}%)</span>
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
          <p className="mt-1 text-sm text-zinc-500">Latest customer orders for your menu.</p>
          {loading ? <LoadingBlock label="Loading orders..." /> : recentOrders.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No orders yet" description="Customer orders will appear here when they are placed." />
          ) : (
            <div className="mt-5 space-y-3">
              {recentOrders.map((order) => (
                <div key={getOrderId(order)} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{order.pizzaName || order.itemName || order.menuItemName || 'Order'}</p>
                    <p className="truncate text-xs text-zinc-500">{order.customerName || order.customerEmail || 'Customer'}</p>
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
