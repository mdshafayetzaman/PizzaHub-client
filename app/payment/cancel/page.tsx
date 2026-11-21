import Link from 'next/link'
import { XCircle, ArrowRight, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Payment cancelled — PizzaHub',
}

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] items-center justify-center bg-[#11100F] px-5 py-12 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15 text-red-300">
          <XCircle className="size-8" aria-hidden />
        </span>

        <h1 className="mt-6 text-3xl font-black tracking-tight">
          Payment cancelled
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          No worries — nothing was charged. Your cart is still waiting if you
          would like to try again, or browse the menu for inspiration.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/menu" />}
            className="h-11 gap-2 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white hover:bg-orange-600"
          >
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </Button>

          <Button
            variant="outline"
            render={<Link href="/" />}
            className="h-11 gap-2 rounded-xl border-white/15 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/5"
          >
            Back home
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </main>
  )
}
