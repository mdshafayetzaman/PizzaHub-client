'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

const TITLE_MAP: Array<[RegExp, string]> = [
  [/^\/dashboard\/admin\/users/, 'Manage Users'],
  [/^\/dashboard\/admin\/menu/, 'Manage Menu Items'],
  [/^\/dashboard\/admin\/transactions/, 'Transactions'],
  [/^\/dashboard\/admin/, 'Admin Overview'],
  [/^\/dashboard\/vendor\/menu\/add/, 'Add Menu Item'],
  [/^\/dashboard\/vendor\/menu/, 'My Menu Items'],
  [/^\/dashboard\/vendor\/orders/, 'Customer Orders'],
  [/^\/dashboard\/vendor\/subscription/, 'Subscription'],
  [/^\/dashboard\/vendor/, 'Vendor Overview'],
  [/^\/dashboard\/customer\/orders/, 'My Orders'],
  [/^\/dashboard\/customers\/orders/, 'My Orders'],
  [/^\/dashboard\/customer\/profile/, 'Profile Settings'],
  [/^\/dashboard\/customers\/profile/, 'Profile Settings'],
  [/^\/dashboard\/customer/, 'Customer Overview'],
  [/^\/dashboard\/customers/, 'Customer Overview'],
]

export function DashboardHeader() {
  const pathname = usePathname() || ''
  const title = TITLE_MAP.find(([re]) => re.test(pathname))?.[1] || 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#09090b]/90 px-4 backdrop-blur-xl sm:px-6">
      <SidebarTrigger className="-ml-1 text-zinc-300 hover:bg-white/10 hover:text-white" />
      <div className="h-5 w-px bg-white/10" aria-hidden />
      <p className="text-sm font-semibold text-zinc-300">{title}</p>
    </header>
  )
}
