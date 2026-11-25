'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Clock,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react'
import { toast } from 'react-toastify'

import { useCart } from '@/lib/cart-context'
import { formatPrice, type MenuItem } from '@/lib/data'

type MenuItemDetailsProps = {
  item: MenuItem
  onAddToCart?: (item: MenuItem, quantity: number) => void
}

export default function MenuItemDetails({
  item,
  onAddToCart,
}: MenuItemDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1))
  }

  const handleIncrease = () => {
    setQuantity((current) => current + 1)
  }

  const handleAddToCart = () => {
    if (!item.isAvailable) {
      toast.error('This item is currently unavailable.')
      return
    }

    addItem(item, quantity)
    onAddToCart?.(item, quantity)
    toast.success(`${quantity} × ${item.name} added to cart.`)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Image */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1A1917]">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-orange-500/30 bg-[#11100F]/80 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-orange-400 uppercase backdrop-blur">
            {item.category}
          </span>
          <span
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase backdrop-blur ${
              item.isAvailable
                ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                : 'border border-white/10 bg-zinc-700/70 text-zinc-300'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          {item.popular ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase">
              <Flame aria-hidden className="size-3.5" />
              Popular
            </span>
          ) : null}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <Star aria-hidden className="size-4 fill-orange-500 text-orange-500" />
            <span className="font-semibold text-white">{item.rating.toFixed(1)}</span>
            <span>({item.reviews} reviews)</span>
          </div>
        </div>

        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
          {item.name}
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-neutral-400">
          {item.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-neutral-500">
              <Flame aria-hidden className="size-4 text-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase">
                Calories
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-white">{item.calories} kcal</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-neutral-500">
              <Clock aria-hidden className="size-4 text-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase">
                Prep time
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-white">{item.prepTime}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-[11px] font-bold tracking-[0.16em] text-neutral-500 uppercase">
            Toppings
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.toppings.map((topping) => (
              <span
                key={topping}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-neutral-300"
              >
                {topping}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#1A1917]/80 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] text-neutral-500 uppercase">
                Price
              </p>
              <p className="mt-1 text-3xl font-black tracking-tight text-white">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] p-1">
                <button
                  type="button"
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                  className="inline-flex size-10 items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Minus aria-hidden className="size-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                  className="inline-flex size-10 items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Plus aria-hidden className="size-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <ShoppingBag aria-hidden className="size-4.5" />
                {item.isAvailable ? 'Add to cart' : 'Unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
