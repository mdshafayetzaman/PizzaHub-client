'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Flame, Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { MENU_ITEMS, formatPrice } from '@/lib/data'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'All',
  'Classic',
  'Speciality',
  'Vegan',
  'Sides',
  'Desserts',
] as const

export default function MenuCatalog() {
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>('All')

  const items =
    category === 'All'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === category)

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">
          <Flame className="size-3.5" aria-hidden />
          Stone-fired to order
        </span>

        <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
          The PizzaHub menu
        </h1>
        <p className="mt-4 text-sm leading-6 text-neutral-400 sm:text-base">
          Hand-tossed dough, slow-simmered sauce and generous toppings. Pick a
          favourite, choose your size and we will fire it fresh.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCategory(option)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-bold transition',
              category === option
                ? 'border-orange-500/60 bg-orange-500/15 text-orange-300'
                : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:text-white'
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/menu/${item.id}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-orange-500/30 hover:bg-white/[0.05]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100F]/80 via-transparent to-transparent" />

              {item.popular && (
                <Badge
                  variant="orange"
                  className="absolute left-3 top-3 border-0"
                >
                  Popular
                </Badge>
              )}

              <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-[#11100F]/80 px-3 py-1 text-xs font-black text-white backdrop-blur">
                {formatPrice(item.price)}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-black text-white transition group-hover:text-orange-300">
                  {item.name}
                </h2>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-amber-300">
                  <Star className="size-3 fill-amber-300" aria-hidden />
                  {item.rating.toFixed(1)}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">
                {item.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Badge variant="default">{item.category}</Badge>
                <span className="text-[11px] font-semibold text-neutral-600">
                  {item.prepTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
