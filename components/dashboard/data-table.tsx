import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
      <table className="w-full min-w-[680px] text-left text-sm">
        {children}
      </table>
    </div>
  )
}

export function Thead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-white/10">{children}</thead>
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-white/5">{children}</tbody>
}

export function Tr({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <tr className={cn('transition hover:bg-white/[0.02]', className)}>
      {children}
    </tr>
  )
}

export function Th({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500',
        className
      )}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className,
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <td
      className={cn(
        'px-4 py-3 align-middle text-sm text-neutral-300',
        className
      )}
    >
      {children}
    </td>
  )
}
