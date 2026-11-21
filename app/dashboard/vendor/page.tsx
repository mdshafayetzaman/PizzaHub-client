import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  ChefHat,
  Clock,
  Flame,
  Package,
  Star,
  Store,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import {
  AccessDenied,
  DashboardHeading,
  Panel,
  StatCard,
} from '@/components/dashboard/widgets'
import { getCurrentUser } from '@/lib/session'

export const instant = false

const menuItems = [
  {
    id: '1',
    title: 'Margherita Classica',
    meta: 'Base $9.90 · 142 sold this week',
    status: 'Live',
    tone: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  },
  {
    id: '2',
    title: 'Double Pepperoni',
    meta: 'Base $12.50 · 98 sold this week',
    status: 'Live',
    tone: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  },
  {
    id: '3',
    title: 'Truffle Mushroom (Seasonal)',
    meta: 'Base $14.00 · Draft',
    status: 'Draft',
    tone: 'bg-neutral-500/15 text-neutral-300 ring-neutral-500/30',
  },
]

export default function VendorDashboardPage() {
  return (
    <Suspense fallback={<VendorDashboardFallback />}>
      <VendorDashboardContent />
    </Suspense>
  )
}

async function VendorDashboardContent() {
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  if (user.role !== 'vendor' && user.role !== 'admin') {
    return <AccessDenied role={user.role} allowed="Vendor or Admin" />
  }

  return (
    <div className="space-y-6">
      <DashboardHeading
        eyebrow="Vendor"
        title="My Store"
        description={`Welcome back, ${user.name}. Keep an eye on today's orders and keep your menu fresh.`}
        role={user.role}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Orders today"
          value="86"
          hint="+9 vs same time yesterday"
          icon={TrendingUp}
        />

        <StatCard
          label="Preparing"
          value="7"
          hint="In the kitchen right now"
          icon={ChefHat}
        />

        <StatCard
          label="Avg. prep time"
          value="12m"
          hint="Target is under 15m"
          icon={Clock}
        />

        <StatCard
          label="Earnings"
          value="$1,940"
          hint="This week, after fees"
          icon={Wallet}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel
            title="Menu items"
            description="Everything customers can order from your store."
            action={
              <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400 ring-1 ring-orange-500/30 ring-inset">
                Demo data
              </span>
            }
          >
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-neutral-500">
                      {item.meta}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${item.tone}`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Store" description="Your store at a glance.">
          <div className="space-y-2">
            {[
              { label: 'Store profile', href: '/', icon: Store },
              { label: 'Menu manager', href: '/', icon: Package },
              { label: 'Payouts', href: '/', icon: Wallet },
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
            <Flame className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Friday rush starts at 6 PM — add prep capacity to stay under 15m.
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
            <Star className="size-3.5" aria-hidden />
            Store rating: 4.8 from 512 customer reviews.
          </div>
        </Panel>
      </div>
    </div>
  )
}

function VendorDashboardFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-72 max-w-full animate-pulse rounded bg-white/5" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/[0.03] lg:col-span-2" />
        <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
      </div>
    </div>
  )
}
