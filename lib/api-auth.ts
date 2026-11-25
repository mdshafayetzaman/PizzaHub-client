import { NextRequest, NextResponse } from 'next/server'

import { auth } from './auth'
import { normalizeRole, type DashboardRole } from './roles'

export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: DashboardRole
}

type AuthFailure = {
  ok: false
  response: NextResponse
}

type AuthSuccess = {
  ok: true
  user: AuthenticatedUser
}

export type AuthResult = AuthFailure | AuthSuccess

export function apiError(
  message: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status }
  )
}

/**
 * Reads the current Better Auth session from request headers. The user identity
 * comes from the authenticated server session, never from client-supplied IDs.
 */
export async function getAuthenticatedUser(
  requestHeaders: Headers
): Promise<AuthResult> {
  try {
    const session = await auth.api.getSession({ headers: requestHeaders })
    const user = session?.user

    if (!user?.id) {
      return {
        ok: false,
        response: apiError(
          'Authentication required. Please sign in to continue.',
          401
        ),
      }
    }

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: normalizeRole((user as { role?: unknown }).role),
      },
    }
  } catch (error) {
    console.error('[api-auth] Failed to read session', error)
    return {
      ok: false,
      response: apiError('Unable to verify authentication.', 500),
    }
  }
}

/**
 * Vendor Order Management APIs are vendor-only. Authenticated customers/admins
 * are rejected with 403 instead of being treated as owners.
 */
export async function requireVendor(
  requestHeaders: Headers
): Promise<AuthResult> {
  const authResult = await getAuthenticatedUser(requestHeaders)

  if (!authResult.ok) {
    return authResult
  }

  if (authResult.user.role !== 'vendor') {
    return {
      ok: false,
      response: apiError(
        'Forbidden. Only authenticated vendors can access vendor order management APIs.',
        403
      ),
    }
  }

  return authResult
}

type ApiRouteContext = {
  params?: Promise<Record<string, string | string[] | undefined>>
}

type AuthenticatedRouteHandler<T extends ApiRouteContext> = (
  request: NextRequest,
  context: T,
  user: AuthenticatedUser
) => Promise<NextResponse> | NextResponse

/**
 * Reusable authentication middleware for Route Handlers. It resolves the Better
 * Auth session from request headers and rejects unauthenticated requests.
 */
export function withAuth<T extends ApiRouteContext = ApiRouteContext>(
  handler: AuthenticatedRouteHandler<T>
) {
  return async (request: NextRequest, context: T) => {
    const authResult = await getAuthenticatedUser(request.headers)
    if (!authResult.ok) {
      return authResult.response
    }

    return handler(request, context, authResult.user)
  }
}

/**
 * Reusable vendor authorization middleware for Vendor Order Management APIs.
 * Only authenticated users with the vendor role can reach the handler.
 */
export function withVendorAuth<T extends ApiRouteContext = ApiRouteContext>(
  handler: AuthenticatedRouteHandler<T>
) {
  return async (request: NextRequest, context: T) => {
    const authResult = await requireVendor(request.headers)
    if (!authResult.ok) {
      return authResult.response
    }

    return handler(request, context, authResult.user)
  }
}
