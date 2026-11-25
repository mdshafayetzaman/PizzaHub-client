import { NextRequest, NextResponse } from 'next/server'

import { apiError, requireVendor } from '@/lib/api-auth'
import { findOrdersByVendor } from '@/lib/vendor-orders'

export async function GET(request: NextRequest) {
  const authResult = await requireVendor(request.headers)
  if (!authResult.ok) {
    return authResult.response
  }

  try {
    // Never trust a vendorId from the client. Orders are always loaded using the
    // authenticated vendor identity from the server-side session.
    const orders = await findOrdersByVendor(authResult.user.id)

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error('[GET /api/vendor/orders]', error)
    return apiError('Failed to fetch vendor orders.', 500)
  }
}
