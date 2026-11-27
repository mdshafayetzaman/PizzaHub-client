'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { toast } from '@/lib/toast'

import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/data'

export default function CartPage() {
  const { items, totalItems, totalPrice, increaseQuantity, decreaseQuantity, removeItem, clearCart } =
    useCart()

  const handleRemove = (id: string, name: string) => {
    removeItem(id)
    toast.success(`${name} removed from cart.`)
  }

  const handleClear = () => {
    clearCart()
    toast.success('Cart cleared.')
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#11100F] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-24 size-[34rem] rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -left-40 top-1/3 size-[30rem] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.22em] text-orange-400 uppercase">
              Shopping Cart
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Your <span className="text-orange-500">cart.</span>
            </h1>
            <p className="mt-3 text-neutral-400">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-300 transition hover:border-red-500/40 hover:text-red-400"
            >
              <Trash2 className="size-4" />
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#1A1917]/90 p-10 text-center sm:p-14">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <ShoppingBag className="size-10" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-md text-neutral-400">
              Looks like you haven&apos;t added any pizzas yet. Explore our menu and find your next favorite slice.
            </p>
            <Link
              href="/browse-menu"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-orange-400"
            >
              Browse Menu
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const subtotal = item.price * item.quantity
                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#1A1917]/90 p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 112px"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
                          {item.category}
                        </p>
                        <h2 className="mt-1 truncate text-lg font-bold text-white">{item.name}</h2>
                        <p className="mt-1 text-sm text-neutral-400">
                          {formatPrice(item.price)} each
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex size-9 items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/10 hover:text-white"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex size-9 items-center justify-center rounded-full text-neutral-300 transition hover:bg-white/10 hover:text-white"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        <div className="min-w-[90px] text-right">
                          <p className="text-xs text-neutral-500">Subtotal</p>
                          <p className="text-lg font-bold text-orange-400">
                            {formatPrice(subtotal)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id, item.name)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="flex size-10 items-center justify-center rounded-full border border-red-500/20 text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="h-fit rounded-3xl border border-white/10 bg-[#1A1917]/90 p-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold text-white">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Items ({totalItems})</span>
                  <span className="font-medium text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Delivery</span>
                  <span className="font-medium text-neutral-300">Calculated at order</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-xl font-black text-orange-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/browse-menu"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-400"
              >
                Continue Shopping
                <ArrowRight className="size-4" />
              </Link>

              <p className="mt-4 text-center text-xs text-neutral-500">
                Delivery fees and final totals are confirmed during checkout.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
