import Link from 'next/link'
import { Suspense } from 'react'
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react'

type OrderSuccessPageProps = {
  searchParams: Promise<{ orderId?: string | string[] }>
}

function OrderSuccessContent({ orderId }: { orderId: string }) {
  return (
    <main className="relative isolate overflow-hidden bg-[#11100F] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-24 size-[34rem] rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -left-40 top-1/3 size-[30rem] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl border border-white/10 bg-[#1A1917]/90 p-8 text-center shadow-2xl shadow-black/30 sm:p-10">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="size-10" />
          </div>

          <p className="mt-6 text-[11px] font-bold tracking-[0.22em] text-orange-400 uppercase">Order Placed</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Your order is <span className="text-orange-500">confirmed!</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            Thanks for ordering from PizzaHub. Your order has been placed with status <span className="font-semibold text-white">Pending</span> and payment status <span className="font-semibold text-white">Unpaid</span>.
          </p>

          {orderId ? (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-neutral-300">
              Order ID: <span className="font-mono font-semibold text-white">{orderId}</span>
            </p>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/browse-menu"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-orange-500 px-7 text-sm font-bold text-white transition hover:bg-orange-400"
            >
              Browse More
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard/customers/orders"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 text-sm font-bold text-white transition hover:border-orange-500/40 hover:text-orange-300"
            >
              <ShoppingBag className="size-4" />
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

async function OrderSuccessWithParams({
  searchParams,
}: {
  searchParams: OrderSuccessPageProps['searchParams']
}) {
  const params = await searchParams
  const orderId = typeof params.orderId === 'string' ? params.orderId : ''
  return <OrderSuccessContent orderId={orderId} />
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  return (
    <Suspense fallback={<OrderSuccessContent orderId="" />}>
      <OrderSuccessWithParams searchParams={searchParams} />
    </Suspense>
  )
}
