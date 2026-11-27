import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/lib/auth'
import { ROLE_HOME, normalizeRole } from '@/lib/roles'

const WORKSPACE_PATTERN = /^\/dashboard\/(admin|vendor|customer|customers)(?:\/|$)/

/**
 * Keeps every role inside its own dashboard workspace. Admins can reach all
 * three; vendors and customers are sent back to their own home.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const match = WORKSPACE_PATTERN.exec(pathname)

  if (!match) {
    return NextResponse.next()
  }

  const segment = match[1]
  const requestedRole = segment === 'customers' || segment === 'customer' ? 'customer' : (segment as 'admin' | 'vendor')

  try {
    const session = await auth.api.getSession({ headers: request.headers })
    const role = normalizeRole((session?.user as { role?: unknown } | undefined)?.role)

    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Redirect /dashboard/customer -> /dashboard/customers for canonical path compatibility.
    if (segment === 'customer') {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(/^\/dashboard\/customer/, '/dashboard/customers')
      return NextResponse.redirect(url)
    }

    if (role !== 'admin' && role !== requestedRole) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Dashboard proxy auth error:', error)
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: '/dashboard/:path*',
}
