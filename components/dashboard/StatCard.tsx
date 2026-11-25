import type { LucideIcon } from 'lucide-react'

type Props = {
  title: string
  value: string | number
  icon: LucideIcon
  hint?: string
  tone?: 'red' | 'orange' | 'emerald' | 'blue' | 'violet' | 'zinc'
}

const tones = {
  red: 'bg-red-500/10 text-red-400',
  orange: 'bg-orange-500/10 text-orange-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-400',
  violet: 'bg-violet-500/10 text-violet-400',
  zinc: 'bg-zinc-500/10 text-zinc-300',
} as const

export function StatCard({ title, value, icon: Icon, hint, tone = 'red' }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114]/95 p-5 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-white">{value}</p>
          {hint ? <p className="mt-2 text-xs text-zinc-400">{hint}</p> : null}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}
