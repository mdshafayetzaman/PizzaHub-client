import type { ReactNode } from 'react'

import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar'
import { DashboardSidebar } from '../components/Dashboardsidebar'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
    <DashboardSidebar></DashboardSidebar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
