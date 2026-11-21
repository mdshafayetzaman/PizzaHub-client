import Link from 'next/link'
import {
  ClipboardList,
  Receipt,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react'

import PageHeader from '@/components/dashboard/page-header'
import Panel from '@/components/dashboard/panel'
import StatCard from '@/components/dashboard/stat-card'
import TransactionsTable from '@/components/dashboard/transactions-table'
import { Button } from '@/components/ui/button'
import { ORDERS, TRANSACTIONS, USERS, formatPrice } from '@/lib/data'

export default function AdminOverviewPage() {
  const revenue = TRANSACTIONS.filter((txn) => txn.status === 'paid').reduce(
    (total, txn) => total + txn.amount,
    0
  )
  const liveOrders = ORDERS.filter(
    (order) => order.status !== 'delivered' && order.status !== 'cancelled'
  ).length

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="The whole PizzaHub platform in one place — users, vendors, orders and money."
        action={
          <Button
            render={<Link href="/dashboard/admin/users" />}
            className="h-10 gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
          >
            <Users className="size-4" aria-hidden />
            Manage users
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={String(USERS.length * 42)}
          hint={`${USERS.length} shown in the demo`}
          icon={Users}
          accent="sky"
        />
        <StatCard
          label="Active vendors"
          value={String(USERS.filter((user) => user.role === 'vendor').length * 8)}
          hint="3 awaiting approval"
          icon={Store}
          accent="violet"
        />
        <StatCard
          label="Live orders"
          value={String(liveOrders)}
          hint="Across every kitchen"
          icon={ClipboardList}
          accent="orange"
        />
        <StatCard
          label="Revenue today"
          value={formatPrice(revenue)}
          hint="From settled transactions"
          icon={TrendingUp}
          accent="emerald"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Recent transactions"
          description="Latest money movement on the platform"
          action={
            <Link
              href="/dashboard/admin/transactions"
              className="text-xs font-bold text-orange-400 transition hover:text-orange-300"
            >
              View all
            </Link>
          }
          contentClassName="p-0"
        >
          <TransactionsTable transactions={TRANSACTIONS.slice(0, 5)} />
        </Panel>

        <Panel title="Platform shortcuts" contentClassName="space-y-3">
          {[
            {
              label: 'Manage users',
              href: '/dashboard/admin/users',
              icon: Users,
            },
            {
              label: 'Manage menu items',
              href: '/dashboard/admin/menu',
              icon: Receipt,
            },
            {
              label: 'Transactions',
              href: '/dashboard/admin/transactions',
              icon: TrendingUp,
            },
          ].map((action) => {
            const Icon = action.icon

            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm font-semibold text-neutral-200 transition hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-white"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                  <Icon className="size-4" aria-hidden />
                </span>
                {action.label}
              </Link>
            )
          })}
        </Panel>
      </div>
    </div>
  )
}
