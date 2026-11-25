import { ObjectId, type Filter } from 'mongodb'

import { db } from './mongodb'

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type OrderItem = {
  menuItemId?: string
  name: string
  quantity: number
  price: number
}

export type VendorOrderDocument = {
  _id: ObjectId
  vendorId: string
  customerId?: string
  customerName: string
  customerEmail?: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  deliveryAddress?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  statusUpdatedAt?: Date
}

export type VendorOrderResponse = Omit<VendorOrderDocument, '_id'> & {
  id: string
}

const ORDERS_COLLECTION = 'orders'

export function ordersCollection() {
  return db.collection<VendorOrderDocument>(ORDERS_COLLECTION)
}

export function isValidObjectId(value: string) {
  return ObjectId.isValid(value) && new ObjectId(value).toString() === value
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === 'string' &&
    (ORDER_STATUSES as readonly string[]).includes(value)
  )
}

export function serializeOrder(order: VendorOrderDocument): VendorOrderResponse {
  const { _id, ...rest } = order
  return {
    id: _id.toString(),
    ...rest,
  }
}

/**
 * Vendor ownership is enforced in the database query using the authenticated
 * vendor's user id. Any vendorId supplied by the client is ignored.
 */
export async function findOrdersByVendor(vendorId: string) {
  const orders = await ordersCollection()
    .find({ vendorId } satisfies Filter<VendorOrderDocument>)
    .sort({ createdAt: -1 })
    .toArray()

  return orders.map(serializeOrder)
}

export async function findVendorOrderById(vendorId: string, orderId: string) {
  if (!isValidObjectId(orderId)) {
    return { error: 'invalid_id' as const }
  }

  const order = await ordersCollection().findOne({
    _id: new ObjectId(orderId),
    vendorId,
  } satisfies Filter<VendorOrderDocument>)

  if (!order) {
    return { error: 'not_found' as const }
  }

  return { order: serializeOrder(order) }
}

export async function updateVendorOrderStatus(
  vendorId: string,
  orderId: string,
  status: OrderStatus
) {
  if (!isValidObjectId(orderId)) {
    return { error: 'invalid_id' as const }
  }

  const now = new Date()
  const result = await ordersCollection().findOneAndUpdate(
    {
      _id: new ObjectId(orderId),
      vendorId,
    } satisfies Filter<VendorOrderDocument>,
    {
      $set: {
        status,
        updatedAt: now,
        statusUpdatedAt: now,
      },
    },
    { returnDocument: 'after' }
  )

  if (!result) {
    return { error: 'not_found' as const }
  }

  return { order: serializeOrder(result) }
}
