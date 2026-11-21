'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import Footer from '@/components/shared/footer'
import Navbar from '@/components/shared/Navbar'

/**
 * Shows the marketing navbar/footer on public pages and lets the dashboard
 * render its own full-screen chrome.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard') ?? false

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
