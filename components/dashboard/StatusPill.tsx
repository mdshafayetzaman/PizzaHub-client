type Props = { status: string; className?: string }

const STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  active: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  accepted: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  paid: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-300 ring-red-500/30',
  cancelled: 'bg-red-500/15 text-red-300 ring-red-500/30',
  canceled: 'bg-red-500/15 text-red-300 ring-red-500/30',
  blocked: 'bg-red-500/15 text-red-300 ring-red-500/30',
  failed: 'bg-red-500/15 text-red-300 ring-red-500/30',
  inactive: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30',
  free: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30',
  premium: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
}

export function StatusPill({ status, className = '' }: Props) {
  const key = String(status || 'unknown').toLowerCase()
  const style = STYLES[key] || 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30'
  const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${style} ${className}`}>
      {label}
    </span>
  )
}
