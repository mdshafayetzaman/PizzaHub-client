import { redirect } from 'next/navigation'

import OrderFormClient from '@/components/order/OrderFormClient'
import { getCurrentUser } from '@/lib/session'

type OrderPageProps = {
  params: Promise<{ id: string }>
}

export default async function MenuOrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const user = await getCurrentUser()
  const orderPath = `/menu/${id}/order`

  if (!user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(orderPath)}`)
  }

  if (user.role !== 'customer') {
    redirect('/browse-menu')
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#11100F] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-24 size-[34rem] rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -left-40 top-1/3 size-[30rem] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.22em] text-orange-400 uppercase">
            Order Now
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Complete your <span className="text-orange-500">order.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Confirm your details, choose size and toppings, then place your order.
          </p>
        </div>

        <OrderFormClient pizzaId={id} user={{ name: user.name, email: user.email }} />
      </div>
    </main>
  )
}
