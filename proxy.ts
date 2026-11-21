import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/lib/auth'
import { ROLE_HOME, normalizeRole } from '@/lib/roles'

const WORKSPACE_PATTERN = /^\/dashboard\/(admin|vendor|customers)(?:\/|$)/

/**
 * Keeps every role inside its own dashboard workspace. Admins can reach all
 * three; vendors and customers are sent back to their own home.
 */
export async function proxy(request: NextRequest) {
  const match = WORKSPACE_PATTERN.exec(request.nextUrl.pathname)

  if (!match) {
    return NextResponse.next()
  }

  const requestedRole = match[1] === 'customers' ? 'customer' : match[1]

  const session = await auth.api.getSession({ headers: request.headers })
  const role = normalizeRole(
    (session?.user as { role?: unknown } | undefined)?.role
  )

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (role !== 'admin' && role !== requestedRole) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}
