import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const ACCENTS = {
  orange: 'bg-orange-500/10 text-orange-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  sky: 'bg-sky-500/10 text-sky-400',
  violet: 'bg-violet-500/10 text-violet-400',
} as const

type StatCardProps = {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  accent?: keyof typeof ACCENTS
}

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = 'orange',
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-orange-500/30 hover:bg-white/[0.045]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
          {label}
        </p>
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105',
            ACCENTS[accent]
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
      </div>

      <p className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-neutral-500">{hint}</p>
    </div>
  )
}
