import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-inset',
  {
    variants: {
      variant: {
        default: 'bg-white/[0.06] text-neutral-300 ring-white/10',
        orange: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
        emerald: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
        violet: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
        sky: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
        amber: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
        red: 'bg-red-500/15 text-red-300 ring-red-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { badgeVariants }
