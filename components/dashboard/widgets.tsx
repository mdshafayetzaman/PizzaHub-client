import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, TriangleAlert } from 'lucide-react'

import { ROLE_META, type DashboardRole } from '@/lib/session'
import { cn } from '@/lib/utils'

export function RoleBadge({ role }: { role: DashboardRole }) {
  const meta = ROLE_META[role]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset',
        meta.badgeClass
      )}
    >
      {meta.label}
    </span>
  )
}

export function DashboardHeading({
  eyebrow,
  title,
  description,
  role,
}: {
  eyebrow: string
  title: string
  description: string
  role: DashboardRole
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">
          {description}
        </p>
      </div>

      <RoleBadge role={role} />
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-orange-500/30">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {label}
        </p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>

      <p className="mt-3 text-2xl font-black tracking-tight text-white">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-neutral-500">{hint}</p>
    </div>
  )
}

export function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string
  description: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        </div>
        {action}
      </header>

      <div className="p-5">{children}</div>
    </section>
  )
}

export function AccessDenied({
  role,
  allowed,
}: {
  role: DashboardRole
  allowed: string
}) {
  const meta = ROLE_META[role]

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-8 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-500/15 text-red-400">
        <TriangleAlert className="size-6" aria-hidden />
      </span>

      <h2 className="mt-4 text-xl font-black tracking-tight text-white">
        Access denied
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-400">
        This dashboard is reserved for the <strong>{allowed}</strong> role.
        You&apos;re signed in as <strong>{meta.label}</strong>.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          Go home
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/sign-in"
          className="inline-flex h-10 items-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-neutral-300 transition hover:border-orange-500/40 hover:text-orange-400"
        >
          Switch account
        </Link>
      </div>
    </div>
  )
}
