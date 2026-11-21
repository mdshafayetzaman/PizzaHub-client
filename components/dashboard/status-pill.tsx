import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  preparing: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  out_for_delivery: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-300 ring-red-500/30',
  paid: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  refunded: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  failed: 'bg-red-500/15 text-red-300 ring-red-500/30',
  active: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  suspended: 'bg-red-500/15 text-red-300 ring-red-500/30',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  paid: 'Paid',
  refunded: 'Refunded',
  failed: 'Failed',
  active: 'Active',
  suspended: 'Suspended',
}

export default function StatusPill({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-inset',
        STATUS_STYLES[value] ?? 'bg-white/[0.06] text-neutral-300 ring-white/10',
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABELS[value] ?? value}
    </span>
  )
}
