import Link from 'next/link'
import { CheckCircle2, ArrowRight, LayoutDashboard } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Payment successful — PizzaHub',
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] items-center justify-center bg-[#11100F] px-5 py-12 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>

        <h1 className="mt-6 text-3xl font-black tracking-tight">
          Payment successful
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Thank you! Your order is confirmed and the kitchen has already started
          stretching the dough. We will keep you posted as it fires.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left text-sm">
          <div className="flex justify-between text-neutral-400">
            <span>Order</span>
            <span className="font-bold text-white">PH-1001</span>
          </div>
          <div className="mt-2 flex justify-between text-neutral-400">
            <span>Status</span>
            <span className="font-bold text-emerald-300">Preparing</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/dashboard" />}
            className="h-11 gap-2 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white hover:bg-orange-600"
          >
            <LayoutDashboard className="size-4" aria-hidden />
            Track my order
          </Button>

          <Button
            variant="outline"
            render={<Link href="/menu" />}
            className="h-11 gap-2 rounded-xl border-white/15 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/5"
          >
            Order something else
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </main>
  )
}
