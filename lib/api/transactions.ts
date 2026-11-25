import { apiFetch } from '@/lib/api-client'

export interface TransactionRecord {
  _id?: string
  id?: string
  vendorId?: string
  vendorName?: string
  vendorEmail?: string
  plan?: string
  subscriptionPlan?: string
  amount?: number
  price?: number
  paymentStatus?: string
  status?: string
  transactionId?: string
  paymentIntentId?: string
  date?: string
  createdAt?: string
  [key: string]: unknown
}

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    for (const key of ['data', 'transactions', 'result']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

export const getTransactionId = (t: TransactionRecord) => String(t._id || t.id || '')

export async function getTransactions(): Promise<TransactionRecord[]> {
  const payload = await apiFetch<unknown>('/transactions', { auth: true }).catch(async () =>
    apiFetch<unknown>('/payments', { auth: true })
  )
  return normalizeList<TransactionRecord>(payload)
}
