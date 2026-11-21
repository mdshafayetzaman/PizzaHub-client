import Link from 'next/link'
import {
  ClipboardList,
  Package,
  Pizza,
  Plus,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import PageHeader from '@/components/dashboard/page-header'
import Panel from '@/components/dashboard/panel'
import OrdersTable from '@/components/dashboard/orders-table'
import StatCard from '@/components/dashboard/stat-card'
import { Button } from '@/components/ui/button'
import { MENU_ITEMS, ORDERS, formatPrice } from '@/lib/data'

export default function VendorOverviewPage() {
  const live = ORDERS.filter(
    (order) => order.status !== 'delivered' && order.status !== 'cancelled'
  )
  const revenue = ORDERS.filter((order) => order.status !== 'cancelled').reduce(
    (total, order) => total + order.total,
    0
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Your kitchen at a glance — live orders, today's takings and the health of your menu."
        action={
          <Button
            render={<Link href="/dashboard/vendor/menu/new" />}
            className="h-10 gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
          >
            <Plus className="size-4" aria-hidden />
            Add menu item
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Live orders"
          value={String(live.length)}
          hint="2 need your attention"
          icon={ClipboardList}
          accent="orange"
        />
        <StatCard
          label="Revenue today"
          value={formatPrice(revenue)}
          hint="Up 12% from yesterday"
          icon={Wallet}
          accent="emerald"
        />
        <StatCard
          label="Menu items"
          value={String(MENU_ITEMS.length)}
          hint="4 marked as popular"
          icon={Pizza}
          accent="violet"
        />
        <StatCard
          label="Avg. prep time"
          value="18 min"
          hint="Target is under 20 min"
          icon={TrendingUp}
          accent="sky"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Live orders"
          description="Newest orders across your store"
          action={
            <Link
              href="/dashboard/vendor/orders"
              className="text-xs font-bold text-orange-400 transition hover:text-orange-300"
            >
              View all
            </Link>
          }
          contentClassName="p-0"
        >
          <OrdersTable orders={live.slice(0, 4)} editable />
        </Panel>

        <Panel
          title="Quick actions"
          description="Jump straight into the day's work"
          contentClassName="space-y-3"
        >
          {[
            {
              label: 'Add a menu item',
              href: '/dashboard/vendor/menu/new',
              icon: Plus,
            },
            {
              label: 'Manage menu items',
              href: '/dashboard/vendor/menu',
              icon: Package,
            },
            {
              label: 'Customer orders',
              href: '/dashboard/vendor/orders',
              icon: ClipboardList,
            },
            {
              label: 'Subscription',
              href: '/dashboard/vendor/subscription',
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
