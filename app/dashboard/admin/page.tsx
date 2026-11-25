'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users, Store, UserRound, Pizza, Clock3, Receipt, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

import { StatCard } from '@/components/dashboard/StatCard'
import { StatSkeleton, LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { getAllUsers, type UserRecord } from '@/lib/api/users'
import { getAllMenuItemsAdmin, getMenuStatus, getMenuName, type MenuItemRecord } from '@/lib/api/menu'
import { getTransactions, type TransactionRecord } from '@/lib/api/transactions'
import { getErrorMessage } from '@/lib/api-client'

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([])
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const [u, m, t] = await Promise.allSettled([getAllUsers(), getAllMenuItemsAdmin(), getTransactions()])
        if (u.status === 'fulfilled') setUsers(u.value)
        if (m.status === 'fulfilled') setMenuItems(m.value)
        if (t.status === 'fulfilled') setTransactions(t.value)
        const failures = [u, m, t].filter((r) => r.status === 'rejected').length
        if (failures === 3) setError('Unable to load admin dashboard data. Please verify backend admin endpoints are available.')
        else if (failures > 0) toast.error('Some admin dashboard data could not be loaded.')
      } catch (e) {
        setError(getErrorMessage(e))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const stats = useMemo(() => {
    const totalUsers = users.length
    const vendors = users.filter((u) => String(u.role).toLowerCase() === 'vendor').length
    const customers = users.filter((u) => String(u.role).toLowerCase() === 'customer').length
    const totalMenu = menuItems.length
    const pendingMenu = menuItems.filter((i) => getMenuStatus(i) === 'pending').length
    const totalTx = transactions.length
    return { totalUsers, vendors, customers, totalMenu, pendingMenu, totalTx }
  }, [users, menuItems, transactions])

  const recentMenu = menuItems.slice(0, 5)
  const recentUsers = users.slice(0, 5)

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Admin <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Overview</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">Monitor users, menu submissions, and transactions across PizzaHub.</p>
      </div>

      {error ? <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2"><AlertCircle size={18} />{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {loading ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />) : (
          <>
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} tone="red" />
            <StatCard title="Vendors" value={stats.vendors} icon={Store} tone="orange" />
            <StatCard title="Customers" value={stats.customers} icon={UserRound} tone="blue" />
            <StatCard title="Menu Items" value={stats.totalMenu} icon={Pizza} tone="violet" />
            <StatCard title="Pending Menu" value={stats.pendingMenu} icon={Clock3} tone="orange" />
            <StatCard title="Transactions" value={stats.totalTx} icon={Receipt} tone="emerald" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
          <h2 className="text-lg font-bold">Recent Menu Submissions</h2>
          <p className="mt-1 text-sm text-zinc-500">Latest items submitted by vendors.</p>
          {loading ? <LoadingBlock label="Loading menu items..." /> : recentMenu.length === 0 ? (
            <EmptyState icon={Pizza} title="No menu items found" description="Menu submissions will appear here." />
          ) : (
            <div className="mt-5 space-y-3">
              {recentMenu.map((item, idx) => (
                <div key={String(item._id || item.id || idx)} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{getMenuName(item)}</p>
                    <p className="truncate text-xs text-zinc-500">{item.vendorName || item.vendorEmail || 'Vendor'}</p>
                  </div>
                  <StatusPill status={getMenuStatus(item)} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
          <h2 className="text-lg font-bold">Recent Users</h2>
          <p className="mt-1 text-sm text-zinc-500">Latest registered users.</p>
          {loading ? <LoadingBlock label="Loading users..." /> : recentUsers.length === 0 ? (
            <EmptyState icon={Users} title="No users found" description="Registered users will appear here." />
          ) : (
            <div className="mt-5 space-y-3">
              {recentUsers.map((u, idx) => (
                <div key={String(u._id || u.id || idx)} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{u.name || 'Unnamed User'}</p>
                    <p className="truncate text-xs text-zinc-500">{u.email || 'No email'}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-300">{String(u.role || 'customer')}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
