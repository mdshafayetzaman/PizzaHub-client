'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Clock, Star, ArrowRight, ShoppingBag } from 'lucide-react'
import { toast } from 'react-toastify'

import { useSession } from '@/lib/auth-client'
import { useCart } from '@/lib/cart-context'
import { formatPrice, type MenuItem } from '@/lib/data'

type MenuCardProps = {
  item: MenuItem
}

export default function MenuCard({ item }: MenuCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { addItem } = useCart()

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
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1A1917]/90 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-orange-500/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-orange-500/30 bg-[#11100F]/80 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-orange-400 uppercase backdrop-blur">
            {item.category}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase backdrop-blur ${
              item.isAvailable
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-zinc-700/70 text-zinc-300 border border-white/10'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!item.isAvailable}
          aria-label={`Add ${item.name} to cart`}
          className="absolute bottom-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag aria-hidden className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug text-white">{item.name}</h3>
          <p className="shrink-0 text-lg font-black text-orange-400">
            {formatPrice(item.price)}
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-400">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <span className="inline-flex items-center gap-1.5">
            <Star aria-hidden className="size-4 fill-orange-500 text-orange-500" />
            <span className="font-semibold text-white">{item.rating.toFixed(1)}</span>
            <span>({item.reviews})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4 text-orange-500" />
            {item.prepTime}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleViewDetails}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm font-bold text-white transition-all duration-300 hover:border-orange-500/40 hover:text-orange-300"
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
            <ShoppingBag aria-hidden className="size-4" />
            Order Now
          </button>
        </div>
      </div>
    </article>
  )
}
