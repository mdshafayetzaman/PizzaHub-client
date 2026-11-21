import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PanelProps = {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

export default function Panel({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: PanelProps) {
  const hasHeader = Boolean(title || description || action)

  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]',
        className
      )}
    >
      {hasHeader && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-bold text-white">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}

      <div className={cn('p-5', contentClassName)}>{children}</div>
    </section>
  )
}
