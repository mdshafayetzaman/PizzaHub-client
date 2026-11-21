import Link from 'next/link'
import {
  Clock3,
  Heart,
  MapPin,
  Pizza,
  ShoppingBag,
  Wallet,
} from 'lucide-react'

import PageHeader from '@/components/dashboard/page-header'
import Panel from '@/components/dashboard/panel'
import OrdersTable from '@/components/dashboard/orders-table'
import StatCard from '@/components/dashboard/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, MENU_ITEMS, ORDERS } from '@/lib/data'

export default function CustomerOverviewPage() {
  const active = ORDERS.filter(
    (order) => order.status !== 'delivered' && order.status !== 'cancelled'
  )
  const delivered = ORDERS.filter((order) => order.status === 'delivered')
  const spent = delivered.reduce((total, order) => total + order.total, 0)
  const favourites = MENU_ITEMS.filter((item) => item.popular).slice(0, 4)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back"
        description="Track live orders, reorder your favourites and keep every slice a tap away."
        action={
          <Button
            render={<Link href="/menu" />}
            className="h-10 gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
          >
            <Pizza className="size-4" aria-hidden />
            Order now
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active orders"
          value={String(active.length)}
          hint="On their way to you"
          icon={ShoppingBag}
          accent="orange"
        />
        <StatCard
          label="Total spent"
          value={formatPrice(spent)}
          hint={`${delivered.length} delivered orders`}
          icon={Wallet}
          accent="emerald"
        />
        <StatCard
          label="Favourites"
          value={String(favourites.length)}
          hint="Saved for next time"
          icon={Heart}
          accent="violet"
        />
        <StatCard
          label="Saved addresses"
          value="2"
          hint="Home and office"
          icon={MapPin}
          accent="sky"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Active orders"
          description="Orders that are still on the move"
          action={
            <Link
              href="/dashboard/customers/orders"
              className="text-xs font-bold text-orange-400 transition hover:text-orange-300"
            >
              View all
            </Link>
          }
          contentClassName="p-0"
        >
          {active.length > 0 ? (
            <OrdersTable
              orders={active.slice(0, 4)}
              showCustomer={false}
              linkOrders={false}
            />
          ) : (
            <div className="px-6 py-14 text-center text-sm text-neutral-500">
              No active orders right now — time for a slice.
            </div>
          )}
        </Panel>

        <Panel
          title="Your favourites"
          description="Tap a slice to reorder"
          contentClassName="grid gap-3 sm:grid-cols-2"
        >
          {favourites.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition hover:border-orange-500/30 hover:bg-orange-500/5"
            >
              <p className="truncate text-xs font-bold text-white group-hover:text-orange-300">
                {item.name}
              </p>
              <p className="mt-1 text-xs font-bold text-orange-400">
                {formatPrice(item.price)}
              </p>
            </Link>
          ))}
        </Panel>
      </div>

      <Panel
        title="Need inspiration?"
        description="Fresh from the stone oven this week"
      >
        <div className="flex flex-wrap gap-3">
          <Badge variant="orange">
            <Clock3 className="size-3" aria-hidden />
            Average delivery 28 min
          </Badge>
          <Badge variant="emerald">Kitchen open till 11 PM</Badge>
          <Badge variant="violet">20% off your first pie</Badge>
        </div>
      </Panel>
    </div>
  )
}
