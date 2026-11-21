'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Pencil, Trash2, Truck, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { OrderStatus } from '@/lib/data'
import { cn } from '@/lib/utils'
import StatusPill from './status-pill'

export function MenuRowActions({ editHref }: { editHref: string }) {
  const [removed, setRemoved] = useState(false)

  if (removed) {
    return (
      <span className="text-xs font-semibold text-neutral-500">Removed</span>
    )
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={editHref}
        aria-label="Edit item"
        className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/5 hover:text-orange-400"
      >
        <Pencil className="size-3.5" aria-hidden />
      </Link>

      <button
        type="button"
        aria-label="Delete item"
        onClick={() => setRemoved(true)}
        className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 className="size-3.5" aria-hidden />
      </button>
    </div>
  )
}

export function UserRowActions({
  initialStatus,
}: {
  initialStatus: 'active' | 'suspended'
}) {
  const [status, setStatus] = useState(initialStatus)
  const isActive = status === 'active'

  return (
    <div className="flex items-center gap-2">
      <StatusPill value={status} />
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setStatus(isActive ? 'suspended' : 'active')}
        className="h-7 px-2 text-[11px] text-neutral-400 hover:text-white"
      >
        {isActive ? 'Suspend' : 'Activate'}
      </Button>
    </div>
  )
}

const ORDER_NEXT: Partial<
  Record<OrderStatus, { label: string; next: OrderStatus; icon: LucideIcon }>
> = {
  pending: { label: 'Accept', next: 'preparing', icon: Check },
  preparing: { label: 'Send out', next: 'out_for_delivery', icon: Truck },
  out_for_delivery: { label: 'Deliver', next: 'delivered', icon: Check },
}

export function OrderRowActions({
  initialStatus,
}: {
  initialStatus: OrderStatus
}) {
  const [status, setStatus] = useState(initialStatus)
  const action = ORDER_NEXT[status]
  const Icon = action?.icon

  return (
    <div className="flex items-center gap-2">
      <StatusPill value={status} />

      {action && Icon && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setStatus(action.next)}
          className={cn(
            'h-7 gap-1 px-2 text-[11px]',
            status === 'pending' && 'text-amber-300 hover:text-amber-200',
            status === 'preparing' && 'text-sky-300 hover:text-sky-200',
            status === 'out_for_delivery' &&
              'text-violet-300 hover:text-violet-200'
          )}
        >
          <Icon className="size-3" aria-hidden />
          {action.label}
        </Button>
      )}
    </div>
  )
}
