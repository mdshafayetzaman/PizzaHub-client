import { apiFetch } from '@/lib/api-client'

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'delivered' | string

export interface OrderRecord {
  _id?: string
  id?: string
  customerId?: string
  customerName?: string
  customerEmail?: string
  vendorId?: string
  vendorName?: string
  vendorEmail?: string
  pizzaName?: string
  itemName?: string
  menuItemName?: string
  pizzaImage?: string
  imageUrl?: string
  price?: number
  totalAmount?: number
  quantity?: number
  deliveryDate?: string
  deliveryAddress?: string
  message?: string
  additionalMessage?: string
  status?: OrderStatus
  isDemo?: boolean
  createdAt?: string
  requestDate?: string
  [key: string]: unknown
}

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    for (const key of ['data', 'orders', 'items', 'result']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

function normalizeItem<T>(payload: unknown): T {
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) return obj.data as T
    if (obj.order && typeof obj.order === 'object') return obj.order as T
  }
  return payload as T
}

export const getOrderId = (order: OrderRecord) => String(order._id || order.id || '')
export const getOrderStatus = (order: OrderRecord) => String(order.status || 'pending').toLowerCase()

// Vendor orders - backend should infer vendor from authenticated JWT/session.
export async function getVendorOrders(): Promise<OrderRecord[]> {
  const payload = await apiFetch<unknown>('/orders/vendor', { auth: true }).catch(async () =>
    apiFetch<unknown>('/orders/my-vendor-orders', { auth: true })
  )
  return normalizeList<OrderRecord>(payload)
}

export async function acceptOrder(id: string) {
  return apiFetch(`/orders/${id}/accept`, { method: 'PATCH', auth: true }).catch(async () =>
    apiFetch(`/orders/${id}`, { method: 'PATCH', auth: true, json: { status: 'accepted' } })
  )
}

export async function rejectOrder(id: string) {
  return apiFetch(`/orders/${id}/reject`, { method: 'PATCH', auth: true }).catch(async () =>
    apiFetch(`/orders/${id}`, { method: 'PATCH', auth: true, json: { status: 'rejected' } })
  )
}

// Customer orders - backend should infer customer from authenticated JWT/session.
export async function getMyOrders(): Promise<OrderRecord[]> {
  const payload = await apiFetch<unknown>('/orders/my-orders', { auth: true }).catch(async () =>
    apiFetch<unknown>('/orders/customer', { auth: true })
  )
  return normalizeList<OrderRecord>(payload)
}

export async function cancelOrder(id: string) {
  return apiFetch(`/orders/${id}/cancel`, { method: 'PATCH', auth: true }).catch(async () =>
    apiFetch(`/orders/${id}`, { method: 'PATCH', auth: true, json: { status: 'cancelled' } })
  )
}

export async function getOrderById(id: string): Promise<OrderRecord> {
  const payload = await apiFetch<unknown>(`/orders/${id}`, { auth: true })
  return normalizeItem<OrderRecord>(payload)
}

export type CreateOrderInput = {
  menuItemId: string
  pizzaName: string
  pizzaImage: string
  category: string
  basePrice: number
  customerName: string
  customerEmail: string
  phone: string
  deliveryAddress: string
  city: string
  area: string
  quantity: number
  size: 'Small' | 'Medium' | 'Large'
  extraToppings: string[]
  specialInstructions: string
  deliveryDate: string
}

export async function createOrder(input: CreateOrderInput) {
  const payload = await apiFetch<unknown>('/orders', {
    method: 'POST',
    auth: true,
    json: input,
  })
  return normalizeItem<OrderRecord>(payload)
}
