import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import {
  DataTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@/components/dashboard/data-table'
import { OrderRowActions } from '@/components/dashboard/row-actions'
import StatusPill from '@/components/dashboard/status-pill'
import { formatDate, formatPrice, type Order } from '@/lib/data'

type OrdersTableProps = {
  orders?: Order[]
  showCustomer?: boolean
  editable?: boolean
  linkOrders?: boolean
}

export default function OrdersTable({
  orders,
  showCustomer = true,
  editable = false,
  linkOrders = true,
}: OrdersTableProps) {
  const rows = orders ?? []
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center text-sm text-neutral-500">
        No orders yet. New orders will appear here the moment they land.
      </div>
    )
  }

  return (
    <DataTable>
      <Thead>
        <Tr>
          <Th>Order</Th>
          {showCustomer && <Th>Customer</Th>}
          <Th>Items</Th>
          <Th>Total</Th>
          <Th>Placed</Th>
          <Th>Status</Th>
          {editable && <Th className="text-right">Actions</Th>}
        </Tr>
      </Thead>

      <Tbody>
        {rows.map((order) => (
          <Tr key={order.id}>
            <Td>
              {linkOrders ? (
                <Link
                  href={`/dashboard/vendor/orders/${order.id}`}
                  className="font-bold text-white transition hover:text-orange-400"
                >
                  {order.id}
                </Link>
              ) : (
                <p className="font-bold text-white">{order.id}</p>
              )}
              <p className="mt-0.5 text-xs text-neutral-500">
                {order.address}
              </p>
            </Td>

            {showCustomer && (
              <Td>
                <p className="font-semibold text-white">{order.customer}</p>
                <p className="text-xs text-neutral-500">{order.email}</p>
              </Td>
            )}

            <Td>
              <ul className="space-y-0.5 text-xs text-neutral-400">
                {order.items.map((item) => (
                  <li key={item.name}>
                    {item.qty} × {item.name}
                  </li>
                ))}
              </ul>
            </Td>

            <Td className="font-bold text-white">
              {formatPrice(order.total)}
            </Td>
            <Td className="text-xs text-neutral-400">
              {formatDate(order.placedAt)}
            </Td>

            <Td>
              <StatusPill value={order.status} />
            </Td>

            {editable && (
              <Td className="text-right">
                <div className="flex justify-end">
                  <OrderRowActions initialStatus={order.status} />
                </div>
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </DataTable>
  )
}

export function OrderDetailLink({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/vendor/orders/${id}`}
      className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 transition hover:text-orange-300"
    >
      View order
      <ChevronRight className="size-3" aria-hidden />
    </Link>
  )
}
