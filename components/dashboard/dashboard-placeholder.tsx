import type { LucideIcon } from 'lucide-react'

type Stat = {
  label: string
  value: string
  hint: string
  icon: LucideIcon
}

type DashboardPlaceholderProps = {
  role: 'customer' | 'vendor' | 'admin'
  eyebrow: string
  title: string
  description: string
  stats: Stat[]
}

export default function DashboardPlaceholder({
  role,
  eyebrow,
  title,
  description,
  stats,
}: DashboardPlaceholderProps) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-[#100f0e] p-6 text-white shadow-xl shadow-black/5 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-orange-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">
            <span className="size-1.5 rounded-full bg-orange-400" />
            {eyebrow}
          </span>

          <h2 className="mt-4 max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">
            {description}
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-black/[0.06] bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-500/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  {stat.label}
                </p>
                <span className="flex size-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-black tracking-tight text-neutral-900">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] font-medium text-neutral-400">
                {stat.hint}
              </p>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-dashed border-black/10 bg-white/40 p-6">
        <p className="text-sm font-bold text-neutral-800">
          Your {role} workspace is ready
        </p>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
          The pizza-themed sidebar, role guard and top bar are already wired up.
          Drop your {role} widgets, tables and charts into this page — the layout
          will handle the rest.
        </p>
      </div>
    </div>
  )
}
