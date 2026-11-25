import { apiFetch } from '@/lib/api-client'

export interface SubscriptionRecord {
  plan?: 'free' | 'premium' | string
  status?: string
  isPremium?: boolean
  subscriptionStatus?: string
  expiresAt?: string
  [key: string]: unknown
}

function normalizeItem<T>(payload: unknown): T {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) return obj.data as T
    if (obj.subscription && typeof obj.subscription === 'object') return obj.subscription as T
  }
  return payload as T
}

export async function getMySubscription(): Promise<SubscriptionRecord> {
  const payload = await apiFetch<unknown>('/subscriptions/me', { auth: true }).catch(async () =>
    apiFetch<unknown>('/users/subscription', { auth: true })
  )
  return normalizeItem<SubscriptionRecord>(payload)
}

export async function createCheckoutSession() {
  const payload = await apiFetch<unknown>('/subscriptions/create-checkout-session', {
    method: 'POST',
    auth: true,
  }).catch(async () =>
    apiFetch<unknown>('/create-checkout-session', { method: 'POST', auth: true })
  )
  return normalizeItem<Record<string, unknown>>(payload)
}
