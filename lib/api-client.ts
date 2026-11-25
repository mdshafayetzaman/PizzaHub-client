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
  try {
    const anyClient = authClient as unknown as {
      token?: () => Promise<{ data?: { token?: string }; error?: unknown }>
      $fetch?: (
        path: string,
        options?: Record<string, unknown>
      ) => Promise<{ data?: { token?: string }; error?: unknown }>
    }

    if (typeof anyClient.token === 'function') {
      const res = await anyClient.token()
      return res?.data?.token ?? null
    }

    if (typeof anyClient.$fetch === 'function') {
      const res = await anyClient.$fetch('/token', { method: 'GET' })
      return res?.data?.token ?? null
    }
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
  if (err && typeof err === 'object' && typeof (err as any).message === 'string') {
    return (err as any).message
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
  if (auth) {
    const authHeaders = await getAuthHeaders()
    Object.entries(authHeaders).forEach(([k, v]) => finalHeaders.set(k, v))
  }

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include',
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    const fallback =
      response.status === 401
        ? 'Authentication required. Please sign in again.'
        : response.status === 403
          ? 'You do not have permission to perform this action.'
          : response.status === 404
            ? 'The requested resource was not found.'
            : response.status >= 500
              ? 'Server error. Please try again later.'
              : 'Request failed.'
    throw new ApiError(messageFromPayload(payload, fallback), response.status, payload)
  }

  return payload as T
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}
