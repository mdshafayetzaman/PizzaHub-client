'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
    return (
      <>
        {children}
        <ToastContainer position="top-right" theme="dark" />
      </>
    )
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ToastContainer position="top-right" theme="dark" />
    </>
  )
}
