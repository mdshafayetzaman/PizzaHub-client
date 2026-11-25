'use client'

import { authClient } from './auth-client'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5001'

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean
  json?: unknown
}

async function getJwtToken(): Promise<string | null> {
  const anyClient = authClient as unknown as {
    token?: () => Promise<{ data?: { token?: string }; error?: unknown }>
    $fetch?: (
      path: string,
      options?: Record<string, unknown>
    ) => Promise<{ data?: { token?: string }; error?: unknown }>
  }

  try {
    if (typeof anyClient.token === 'function') {
      const res = await anyClient.token()
      if (res?.data?.token) return res.data.token
    }
  } catch {
    // Continue to fallbacks.
  }

  try {
    if (typeof anyClient.$fetch === 'function') {
      const res = await anyClient.$fetch('/token', { method: 'GET' })
      if (res?.data?.token) return res.data.token
    }
  } catch {
    // Continue to fallbacks.
  }

  try {
    const res = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
    })
    if (res.ok) {
      const data = (await res.json().catch(() => null)) as { token?: string } | null
      if (data?.token) return data.token
    }
  } catch {
    // Continue to fallbacks.
  }

  // Fallback: better-auth jwt plugin sets `set-auth-jwt` header on get-session.
  try {
    const res = await fetch('/api/auth/get-session', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Cache-Control': 'no-cache' },
    })
    const headerToken = res.headers.get('set-auth-jwt')
    if (headerToken) return headerToken
  } catch {
    // Fall back to cookie-based auth when JWT token endpoint is unavailable.
  }

  return null
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {}
  const token = await getJwtToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }
  const text = await response.text().catch(() => '')
  return text || null
}

function messageFromPayload(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') return fallback
  const record = payload as Record<string, unknown>
  if (typeof record.message === 'string' && record.message) return record.message
  if (typeof record.error === 'string' && record.error) return record.error
  const err = record.error
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message
  }
  return fallback
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { auth = true, json, headers, ...rest } = options
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

  const finalHeaders = new Headers(headers)
  if (json !== undefined && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }
  let hasAuthToken = false
  if (auth) {
    const authHeaders = await getAuthHeaders()
    Object.entries(authHeaders).forEach(([k, v]) => finalHeaders.set(k, v))
    hasAuthToken = Boolean(authHeaders.Authorization)
    if (!hasAuthToken) {
      console.warn('[api-client] No JWT token available for authenticated request:', url)
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    // Do not forward browser cookies to the Express API; auth uses Bearer JWT.
    credentials: 'omit',
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    const fallback =
      response.status === 401
        ? hasAuthToken
          ? 'Authentication required. Please sign in again.'
          : 'Unable to get auth token. Please sign in again.'
        : response.status === 403
          ? 'You do not have permission to perform this action.'
          : response.status === 404
            ? 'The requested resource was not found.'
            : response.status >= 500
              ? 'Server error. Please try again later.'
              : 'Request failed.'

    const message =
      response.status === 401 && !hasAuthToken
        ? fallback
        : messageFromPayload(payload, fallback)

    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}
