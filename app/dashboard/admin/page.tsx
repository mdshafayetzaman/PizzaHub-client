import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  Bell,
  PieChart,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  AccessDenied,
  DashboardHeading,
  Panel,
  StatCard,
} from '@/components/dashboard/widgets'
import { getCurrentUser } from '@/lib/session'

const recentActivity = [
  {
    id: '1',
    title: 'New vendor application — Firestone Pizzeria',
    meta: 'Pending review · 12 min ago',
    status: 'Review',
  },
  {
    id: '2',
    title: 'Customer role upgraded — a.johnson@example.com',
    meta: 'Manual change · 1 hour ago',
    status: 'Done',
  },
  {
    id: '3',
    title: 'Menu flagged — “Double Pepperoni” (Vendor #18)',
    meta: 'Auto-moderation · 3 hours ago',
    status: 'Flagged',
  },
]

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardFallback />}>
      <AdminDashboardContent />
    </Suspense>
  )
}

async function AdminDashboardContent() {
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  if (user.role !== 'admin') {
    return <AccessDenied role={user.role} allowed="Admin" />
  }

  return (
    <div className="space-y-6">
      <DashboardHeading
        eyebrow="Admin"
        title="Admin Panel"
        description={`Welcome back, ${user.name}. Here's the state of PizzaHub across every customer and vendor.`}
        role={user.role}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Customers"
          value="3,204"
          hint="+128 in the last 7 days"
          icon={Users}
        />
        <StatCard
          label="Vendors"
          value="48"
          hint="3 awaiting approval"
          icon={Store}
        />
        <StatCard
          label="Orders today"
          value="1,284"
          hint="+12.4% vs yesterday"
          icon={TrendingUp}
        />
        <StatCard
          label="Revenue"
          value="$24.8k"
          hint="Gross, this week"
          icon={PieChart}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel
            title="Recent activity"
            description="Latest account and moderation events."
            action={
              <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400 ring-1 ring-orange-500/30 ring-inset">
                Demo data
              </span>
            }
          >
            <ul className="space-y-3">
              {recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {item.meta}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 ring-1 ring-white/10 ring-inset">
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Quick actions"
          description="Jump straight to an admin task."
        >
          <div className="space-y-2">
            {[
              { label: 'Manage customers', href: '/dashboard/customers' },
              { label: 'Manage vendors', href: '/dashboard/vendor' },
              { label: 'Back to site', href: '/' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-neutral-300 transition hover:border-orange-500/40 hover:text-orange-400"
              >
                {action.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2.5 text-[11px] leading-4 text-orange-200">
            <Bell className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            You have 3 vendor applications waiting for review.
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="size-3.5" aria-hidden />
            Role checks run on the server for every dashboard route.
          </div>
        </Panel>
      </div>
    </div>
  )
}

function AdminDashboardFallback() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-20 rounded bg-white/10" />
        <div className="h-8 w-48 rounded bg-white/10" />
        <div className="h-4 w-80 max-w-full rounded bg-white/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 rounded-xl border border-white/10 bg-white/[0.03] lg:col-span-2" />
        <div className="h-72 rounded-xl border border-white/10 bg-white/[0.03]" />
      </div>
    </div>
  )
}
