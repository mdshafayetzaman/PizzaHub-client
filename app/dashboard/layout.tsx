import type { ReactNode } from 'react'

import { DashboardSidebar } from '../components/Dashboardsidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset className="min-h-svh bg-[#09090b] text-white">
        <DashboardHeader />
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
