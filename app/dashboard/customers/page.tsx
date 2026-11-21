import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  ChefHat,
  Clock,
  Heart,
  Package,
  ShoppingBag,
  Star,
  Truck,
  Wallet,
} from 'lucide-react'

import {
  AccessDenied,
  DashboardHeading,
  Panel,
  StatCard,
} from '@/components/dashboard/widgets'
import { getCurrentUser } from '@/lib/session'

const orders = [
  {
    id: 'PH-4821',
    title: 'Margherita Classica + Garlic Bread',
    meta: 'Placed 18 min ago · Out for delivery',
    status: 'On the way',
    tone: 'bg-orange-500/15 text-orange-400 ring-orange-500/30',
  },
  {
    id: 'PH-4798',
    title: 'Double Pepperoni (Large)',
    meta: 'Yesterday · Delivered',
    status: 'Delivered',
    tone: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  },
  {
    id: 'PH-4755',
    title: 'Vegan Supreme + Cola',
    meta: '3 days ago · Delivered',
    status: 'Delivered',
    tone: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  },
]

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')
  if (user.role !== 'customer' && user.role !== 'admin')
    return <AccessDenied role={user.role} allowed="Customer or Admin" />

  return (
    <div className="space-y-6">
      <DashboardHeading
        eyebrow="Customer"
        title={`Hey ${user.name.split(' ')[0]}, hungry?`}
        description="Track your orders, save your favourites and reorder the pies you love in one tap."
        role={user.role}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Orders"
          value="36"
          hint="Lifetime orders"
          icon={ShoppingBag}
        />
        <StatCard
          label="In progress"
          value="1"
          hint="Out for delivery now"
          icon={Truck}
        />
        <StatCard
          label="Favourites"
          value="8"
          hint="Saved pizzas"
          icon={Heart}
        />
        <StatCard
          label="Rewards"
          value="1,240"
          hint="Points · 260 to next reward"
          icon={Star}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel
            title="Recent orders"
            description="Your latest PizzaHub orders."
            action={
              <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400 ring-1 ring-orange-500/30 ring-inset">
                Demo data
              </span>
            }
          >
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {order.title}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {order.id} · {order.meta}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${order.tone}`}
                  >
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Quick actions" description="Reorder in a couple of taps.">
          <div className="space-y-2">
            {[
              { label: 'Order a pizza', href: '/', icon: ChefHat },
              { label: 'Reorder last order', href: '/', icon: Clock },
              { label: 'Payment methods', href: '/', icon: Wallet },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-neutral-300 transition hover:border-orange-500/40 hover:text-orange-400"
              >
                <span className="flex items-center gap-2">
                  <action.icon className="size-4" aria-hidden />
                  {action.label}
                </span>
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2.5 text-[11px] leading-4 text-orange-200">
            <Package className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Free delivery on your next order over $25.
          </div>
        </Panel>
      </div>
    </div>
  )
}
