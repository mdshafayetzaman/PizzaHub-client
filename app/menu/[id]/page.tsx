import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock3, Flame, Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import AddToCartForm from '@/components/menu/add-to-cart-form'
import { formatPrice, getMenuItem, MENU_ITEMS } from '@/lib/data'
import { getCurrentUser } from '@/lib/session'

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<ItemSkeleton />}>
      <ItemDetails params={params} />
    </Suspense>
  )
}

function ItemSkeleton() {
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-[#11100F] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-white/5" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-white/10" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-white/5" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-white/5" />
          <div className="h-40 w-full animate-pulse rounded-xl bg-white/5" />
        </div>
      </div>
    </main>
  )
}

async function ItemDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { id } = await params
  const item = getMenuItem(id)

  if (!item) {
    notFound()
  }

  const related = MENU_ITEMS.filter(
    (candidate) =>
      candidate.id !== item.id && candidate.category === item.category
  ).slice(0, 3)

  return (
    <main className="min-h-[calc(100svh-5rem)] bg-[#11100F] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 transition hover:text-orange-400"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to menu
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 lg:aspect-square">
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {item.popular && (
              <Badge
                variant="orange"
                className="absolute left-4 top-4 border-0"
              >
                Popular
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">{item.category}</Badge>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                  <Star className="size-3.5 fill-amber-300" aria-hidden />
                  {item.rating.toFixed(1)}
                  <span className="font-medium text-neutral-500">
                    ({item.reviews} reviews)
                  </span>
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                {item.name}
              </h1>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  <Clock3 className="size-3.5 text-orange-400" aria-hidden />
                  Prep time
                </p>
                <p className="mt-2 text-sm font-bold text-white">
                  {item.prepTime}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  <Flame className="size-3.5 text-orange-400" aria-hidden />
                  Calories
                </p>
                <p className="mt-2 text-sm font-bold text-white">
                  {item.calories} kcal
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                Toppings
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.toppings.map((topping) => (
                  <Badge key={topping} variant="default">
                    {topping}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-white/10 pt-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  From
                </p>
                <p className="mt-1 text-3xl font-black text-white">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>

            <AddToCartForm itemId={item.id} name={item.name} price={item.price} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  You may also like
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  More from the {item.category.toLowerCase()} oven.
                </p>
              </div>

              <Link
                href="/menu"
                className="text-xs font-bold text-orange-400 transition hover:text-orange-300"
              >
                View full menu
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {related.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/menu/${candidate.id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-orange-500/30"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={candidate.image}
                      alt={candidate.name}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-bold text-white group-hover:text-orange-300">
                      {candidate.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-orange-400">
                      {formatPrice(candidate.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
