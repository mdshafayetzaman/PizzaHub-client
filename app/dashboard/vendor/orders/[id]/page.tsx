import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'

import Panel from '@/components/dashboard/panel'
import StatusPill from '@/components/dashboard/status-pill'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatPrice, ORDERS } from '@/lib/data'

export default function VendorOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
          <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
        </div>
      }
    >
      <OrderDetail params={params} />
    </Suspense>
  )
}

async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = ORDERS.find((candidate) => candidate.id === id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/vendor/orders"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 transition hover:text-orange-400"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {order.id}
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500">
            Placed {formatDate(order.placedAt)}
          </p>
        </div>

        <StatusPill value={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Order items" contentClassName="p-0">
          <ul className="divide-y divide-white/5">
            {order.items.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatPrice(item.price)} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {item.qty} × {formatPrice(item.price)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatPrice(item.qty * item.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
            <p className="text-sm font-bold text-neutral-400">Total</p>
            <p className="text-lg font-black text-white">
              {formatPrice(order.total)}
            </p>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Customer">
            <p className="text-sm font-bold text-white">{order.customer}</p>
            <p className="mt-1 text-xs text-neutral-500">{order.email}</p>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs leading-5 text-neutral-400">
              <MapPin className="mt-0.5 size-4 shrink-0 text-orange-400" aria-hidden />
              {order.address}
            </div>
          </Panel>

          <Panel title="Delivery">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Rider</span>
                <span className="font-semibold text-white">A. Khan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ETA</span>
                <span className="font-semibold text-white">28 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Method</span>
                <Badge variant="default">Card on delivery</Badge>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
