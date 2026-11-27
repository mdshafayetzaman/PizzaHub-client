'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Clock, Star, ArrowRight, ShoppingBag, Flame } from 'lucide-react'
import { toast } from 'react-toastify'

import { useSession } from '@/lib/auth-client'
import { useCart } from '@/lib/cart-context'
import { formatPrice, type MenuItem } from '@/lib/data'

type MenuCardProps = {
  item: MenuItem
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=700&fit=crop'

export default function MenuCard({ item }: MenuCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { addItem } = useCart()
  const [imgSrc, setImgSrc] = useState(item.image || FALLBACK_IMAGE)

  const handleViewDetails = () => {
    const detailsPath = `/browse-menu/${item.id}`
    if (!session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(detailsPath)}`)
      return
    }
    router.push(detailsPath)
  }

  const handleAddToCart = () => {
    if (!item.isAvailable) {
      toast.error('This item is currently unavailable.')
      return
    }
    addItem(item, 1)
    toast.success(`${item.name} added to cart.`)
  }

  const handleOrderNow = () => {
    const orderPath = `/menu/${item.id}/order`
    if (!session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(orderPath)}`)
      return
    }
    const role = String((session.user as { role?: unknown }).role || '').toLowerCase()
    if (role === 'vendor' || role === 'admin') {
      toast.error('Only customers can place pizza orders.')
      return
    }
    router.push(orderPath)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#1A1816] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/35 hover:shadow-2xl hover:shadow-orange-500/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/70 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-orange-500/30 bg-[#11100F]/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-orange-300 backdrop-blur">
            {item.category || 'Pizza'}
          </span>
          {item.popular ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-200 backdrop-blur">
              <Flame className="size-3" aria-hidden /> Popular
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] backdrop-blur ${
              item.isAvailable
                ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                : 'border border-white/10 bg-zinc-700/70 text-zinc-300'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            aria-label={`Add ${item.name} to cart`}
            className="inline-flex size-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition hover:scale-105 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <ShoppingBag aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-lg font-bold leading-snug text-white">{item.name}</h3>
          <p className="shrink-0 text-lg font-black text-orange-400">{formatPrice(item.price)}</p>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-400">
          {item.description || 'Delicious handcrafted pizza made with fresh ingredients.'}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <Star aria-hidden className="size-4 fill-orange-500 text-orange-500" />
            <span className="font-semibold text-white">{item.rating.toFixed(1)}</span>
            <span>({item.reviews})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4 text-orange-500" />
            {item.prepTime || '15-20 min'}
          </span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <button
            type="button"
            onClick={handleViewDetails}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm font-bold text-white transition-all duration-300 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300"
          >
            View Details
            <ArrowRight aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleOrderNow}
            disabled={!item.isAvailable}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-orange-500 px-4 text-sm font-bold text-white transition-all duration-300 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Order Now
          </button>
        </div>
      </div>
    </article>
  )
}
