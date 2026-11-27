'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { ROLE_HOME, normalizeRole } from '@/lib/roles'
import { toast } from '@/lib/toast'

export default function AuthRedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    const signedIn = searchParams.get('signed_in')
    if (signedIn === 'google') {
      handledRef.current = true
      toast.success('Signed in with Google successfully.')
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('signed_in')
      router.replace(url.pathname + (url.search ? url.search : ''))
    }
  }, [searchParams, router])

  useEffect(() => {
    if (isPending) return
    if (!session?.user) return
    const signedIn = searchParams.get('signed_in')
    // Only auto-redirect admin/vendor to dashboard right after Google OAuth landing.
    if (signedIn === 'google') {
      const role = normalizeRole((session.user as { role?: unknown }).role)
      if (role === 'admin' || role === 'vendor') {
        router.replace(ROLE_HOME[role])
        router.refresh()
      }
      // customers stay on home
    }
    // For normal navigation to "/", do not force-redirect authenticated admins/vendors/customers.
  }, [session, isPending, router, searchParams])

  return null
}
