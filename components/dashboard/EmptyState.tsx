import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

type Props = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-500">
        <Icon size={30} />
      </div>
      <h3 className="mt-6 text-lg font-bold text-white">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
