import { NextRequest, NextResponse } from 'next/server'

import { apiError, requireVendor } from '@/lib/api-auth'
import {
  findVendorOrderById,
  isOrderStatus,
  ORDER_STATUSES,
  updateVendorOrderStatus,
} from '@/lib/vendor-orders'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireVendor(request.headers)
  if (!authResult.ok) {
    return authResult.response
  }

  try {
    const { id } = await params
    const result = await findVendorOrderById(authResult.user.id, id)

    if (result.error === 'invalid_id') {
      return apiError('Invalid order id.', 400)
    }

    if (result.error === 'not_found') {
      return apiError(
        'Order not found or you do not have access to this order.',
        404
      )
    }

    return NextResponse.json({
      success: true,
      data: result.order,
    })
  } catch (error) {
    console.error('[GET /api/vendor/orders/[id]]', error)
    return apiError('Failed to fetch vendor order.', 500)
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireVendor(request.headers)
  if (!authResult.ok) {
    return authResult.response
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Invalid JSON request body.', 400)
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return apiError('Request body must be a JSON object.', 400)
  }

  const payload = body as Record<string, unknown>

  // Security: never allow the client to reassign ownership or identity fields.
  if ('vendorId' in payload || 'customerId' in payload || 'id' in payload || '_id' in payload) {
    return apiError(
      'Ownership and identity fields cannot be modified by the client.',
      400
    )
  }

  if (!('status' in payload)) {
    return apiError('Status is required.', 400)
  }

  if (!isOrderStatus(payload.status)) {
    return apiError('Invalid order status.', 400, {
      allowedStatuses: ORDER_STATUSES,
    })
  }

  try {
    const { id } = await params
    const result = await updateVendorOrderStatus(
      authResult.user.id,
      id,
      payload.status
    )

    if (result.error === 'invalid_id') {
      return apiError('Invalid order id.', 400)
    }

    if (result.error === 'not_found') {
      return apiError(
        'Order not found or you do not have access to this order.',
        404
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully.',
      data: result.order,
    })
  } catch (error) {
    console.error('[PATCH /api/vendor/orders/[id]]', error)
    return apiError('Failed to update order status.', 500)
  }
}
