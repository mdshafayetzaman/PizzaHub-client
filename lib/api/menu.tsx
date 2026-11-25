import { apiFetch } from '@/lib/api-client'

export type MenuApprovalStatus = 'pending' | 'approved' | 'rejected'
export type MenuPublishStatus = 'active' | 'inactive'

export interface MenuItemRecord {
  _id?: string
  id?: string
  pizzaName: string
  name?: string
  category: string
  description: string
  price: number
  location?: string
  preparationTime?: string
  availableDate?: string
  imageUrl: string
  image?: string
  status?: MenuApprovalStatus | MenuPublishStatus | string
  approvalStatus?: MenuApprovalStatus | string
  isActive?: boolean
  isAvailable?: boolean
  vendorId?: string
  vendorEmail?: string
  vendorName?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export type MenuItemInput = {
  pizzaName: string
  category: string
  description: string
  price: number
  location: string
  imageUrl: string
  preparationTime?: string
  availableDate?: string
}

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    if (Array.isArray(obj.data)) return obj.data as T[]
    if (Array.isArray(obj.items)) return obj.items as T[]
    if (Array.isArray(obj.menuItems)) return obj.menuItems as T[]
    if (Array.isArray(obj.result)) return obj.result as T[]
  }
  return []
}

function normalizeItem<T>(payload: unknown): T {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
      return obj.data as T
    }
    if (obj.item && typeof obj.item === 'object') return obj.item as T
  }
  return payload as T
}

export function getMenuId(item: MenuItemRecord): string {
  return String(item._id || item.id || '')
}

export function getMenuName(item: MenuItemRecord): string {
  return item.pizzaName || item.name || 'Untitled Pizza'
}

export function getMenuImage(item: MenuItemRecord): string {
  return item.imageUrl || item.image || ''
}

export function getMenuStatus(item: MenuItemRecord): string {
  const raw = String(item.approvalStatus || item.status || '').toLowerCase()
  if (raw === 'approved' || raw === 'pending' || raw === 'rejected' || raw === 'inactive' || raw === 'active') {
    return raw
  }
  if (item.isActive === false) return 'inactive'
  if (item.isActive === true) return 'approved'
  return 'pending'
}

// Existing endpoints used by the project - kept compatible.
export const getMenuItems = async (query = ''): Promise<MenuItemRecord[]> => {
  const path = `/menuItem${query ? `?${query}` : ''}`
  const payload = await apiFetch<unknown>(path, { auth: false })
  return normalizeList<MenuItemRecord>(payload)
}

export const getMyMenuItems = async (): Promise<MenuItemRecord[]> => {
  // Preferred vendor-scoped endpoint; backend should infer vendor from JWT/session.
  try {
    const payload = await apiFetch<unknown>('/menuItem/my-menu', { auth: true })
    return normalizeList<MenuItemRecord>(payload)
  } catch {
    // Fallback to existing endpoint if backend filters by token on base route.
    const payload = await apiFetch<unknown>('/menuItem/my-items', { auth: true }).catch(async () => {
      return apiFetch<unknown>('/menuItem', { auth: true })
    })
    return normalizeList<MenuItemRecord>(payload)
  }
}

export const getMenuItemById = async (id: string): Promise<MenuItemRecord> => {
  const payload = await apiFetch<unknown>(`/menuItem/${id}`, { auth: false })
  return normalizeItem<MenuItemRecord>(payload)
}

export const createMenuItem = async (data: MenuItemInput) => {
  const payload = await apiFetch<unknown>('/menuItem', {
    method: 'POST',
    auth: true,
    json: data,
  })
  return normalizeItem<MenuItemRecord>(payload)
}

export const updateMenuItem = async (id: string, data: Partial<MenuItemInput> & Record<string, unknown>) => {
  const payload = await apiFetch<unknown>(`/menuItem/${id}`, {
    method: 'PUT',
    auth: true,
    json: data,
  })
  return normalizeItem<MenuItemRecord>(payload)
}

export const patchMenuItem = async (id: string, data: Record<string, unknown>) => {
  const payload = await apiFetch<unknown>(`/menuItem/${id}`, {
    method: 'PATCH',
    auth: true,
    json: data,
  })
  return normalizeItem<MenuItemRecord>(payload)
}

export const deleteMenuItem = async (id: string) => {
  const payload = await apiFetch<unknown>(`/menuItem/${id}`, {
    method: 'DELETE',
    auth: true,
  })
  return payload
}

export const updateMenuItemStatus = async (id: string, status: string) => {
  return patchMenuItem(id, { status, approvalStatus: status })
}

// Admin endpoints - documented contract.
export const getAllMenuItemsAdmin = async (): Promise<MenuItemRecord[]> => {
  const payload = await apiFetch<unknown>('/menuItem/admin/all', { auth: true }).catch(async () =>
    apiFetch<unknown>('/menuItem', { auth: true })
  )
  return normalizeList<MenuItemRecord>(payload)
}

export const approveMenuItem = async (id: string) =>
  apiFetch(`/menuItem/${id}/approve`, { method: 'PATCH', auth: true }).catch(async () =>
    patchMenuItem(id, { approvalStatus: 'approved', status: 'approved' })
  )

export const rejectMenuItem = async (id: string) =>
  apiFetch(`/menuItem/${id}/reject`, { method: 'PATCH', auth: true }).catch(async () =>
    patchMenuItem(id, { approvalStatus: 'rejected', status: 'rejected' })
  )
