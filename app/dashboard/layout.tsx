import type { ReactNode } from 'react'

import { DashboardSidebar } from '../components/Dashboardsidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset className="min-h-svh bg-[#09090b] text-white">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-[#09090b]/90 px-4 backdrop-blur-xl sm:px-6">
          <SidebarTrigger className="-ml-1 text-zinc-300 hover:bg-white/10 hover:text-white" />
          <div className="h-5 w-px bg-white/10" aria-hidden />
          <p className="text-sm font-semibold text-zinc-300">
            Menu Management
          </p>
        </header>

        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
