import { apiFetch } from '@/lib/api-client'

export type UserRole = 'admin' | 'vendor' | 'customer' | string
export type UserStatus = 'active' | 'blocked' | string

export interface UserRecord {
  _id?: string
  id?: string
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
  isBlocked?: boolean
  image?: string
  profileImage?: string
  photoURL?: string
  createdAt?: string
  [key: string]: unknown
}

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    for (const key of ['data', 'users', 'result']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

export const getUserId = (u: UserRecord) => String(u._id || u.id || '')
export const getUserStatus = (u: UserRecord): 'active' | 'blocked' => {
  const raw = String(u.status || '').toLowerCase()
  if (raw === 'blocked') return 'blocked'
  if (u.isBlocked === true) return 'blocked'
  return 'active'
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const payload = await apiFetch<unknown>('/users', { auth: true }).catch(async () =>
    apiFetch<unknown>('/users/all', { auth: true })
  )
  return normalizeList<UserRecord>(payload)
}

export async function blockUser(id: string) {
  return apiFetch(`/users/${id}/block`, { method: 'PATCH', auth: true }).catch(async () =>
    apiFetch(`/users/block/${id}`, { method: 'PATCH', auth: true })
  )
}

export async function unblockUser(id: string) {
  return apiFetch(`/users/${id}/unblock`, { method: 'PATCH', auth: true }).catch(async () =>
    apiFetch(`/users/unblock/${id}`, { method: 'PATCH', auth: true })
  )
}
