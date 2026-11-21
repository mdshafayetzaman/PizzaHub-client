'use client'

import { useState } from 'react'
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/data'
import { cn } from '@/lib/utils'

const SIZES = [
  { label: 'Medium 10"', multiplier: 1 },
  { label: 'Large 14"', multiplier: 1.4 },
] as const

export default function AddToCartForm({
  itemId,
  name,
  price,
}: {
  itemId: string
  name: string
  price: number
}) {
  const [size, setSize] = useState<(typeof SIZES)[number]>(SIZES[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const total = price * size.multiplier * quantity

  if (added) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Check className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold text-emerald-200">
              Added to your cart
            </p>
            <p className="text-xs text-emerald-300/70">
              {quantity} × {name} · {size.label}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAdded(false)}
          className="mt-4 text-xs font-bold text-emerald-300 underline-offset-4 transition hover:underline"
        >
          Add another
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
            Choose a size
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {SIZES.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setSize(option)}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-xs font-bold transition',
                  size.label === option.label
                    ? 'border-orange-500/60 bg-orange-500/10 text-orange-300'
                    : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:text-white'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
            Quantity
          </p>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              disabled={quantity === 1}
            >
              <Minus className="size-3.5" aria-hidden />
            </button>
            <span className="w-8 text-center text-sm font-black text-white">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((value) => Math.min(10, value + 1))}
              className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              disabled={quantity === 10}
            >
              <Plus className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setAdded(true)}
        className="mt-5 h-11 w-full gap-2 rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
      >
        <ShoppingBag className="size-4" aria-hidden />
        Add to cart · {formatPrice(total)}
      </Button>

      <p className="mt-3 text-center text-[11px] text-neutral-600">
        Item {itemId} · demo checkout
      </p>
    </div>
  )
}
