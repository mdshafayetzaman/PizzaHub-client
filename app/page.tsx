'use client'

import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

import HeroSection from '@/components/shared/hero-section'
import MenuCard from '@/components/browse-menu/menu-card'
import MenuGridSkeleton from '@/components/browse-menu/menu-grid-skeleton'
import { getMenuImage, getMenuItems, getMenuName, type MenuItemRecord } from '@/lib/api/menu'
import { MENU_ITEMS, type MenuItem } from '@/lib/data'
import AuthRedirectHandler from '@/components/shared/auth-redirect-handler'

const FALLBACK_FEATURED_ITEMS: MenuItem[] = MENU_ITEMS.slice(0, 8).map((item) => ({
  ...item,
  isDemo: true,
}))

function toMenuItem(record: MenuItemRecord, index: number): MenuItem | null {
  const name = getMenuName(record)
  const image = getMenuImage(record)
  const price = Number(record.price)
  if (!name || !Number.isFinite(price)) return null

  const category = String(record.category || 'Classic')
  const ratingValue = Number(record.rating)
  const reviewsValue = Number(record.reviews)
  const status = String(record.status || record.approvalStatus || 'active').toLowerCase()

  const id = String(record._id || record.id || `api-${index}`)
  const hasRealId = /^[a-fA-F0-9]{24}$/.test(String(record._id || record.id || ''))

  return {
    id,
    name,
    description: String(record.description || 'Delicious pizza made fresh to order.'),
    price,
    category: category as MenuItem['category'],
    image:
      image ||
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=700&fit=crop',
    rating: Number.isFinite(ratingValue) && ratingValue > 0 ? ratingValue : 4.5,
    reviews: Number.isFinite(reviewsValue) && reviewsValue >= 0 ? reviewsValue : 0,
    popular: Boolean(record.popular),
    toppings: Array.isArray(record.toppings) ? record.toppings.map(String) : [],
    calories: Number(record.calories) || 0,
    prepTime: String(record.preparationTime || '15-20 min'),
    isAvailable: status !== 'inactive' && status !== 'unavailable' && status !== 'rejected',
    isDemo: Boolean(record.isDemo) && !hasRealId,
  }
}

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>(FALLBACK_FEATURED_ITEMS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const data = await getMenuItems()
        const mapped = Array.isArray(data)
          ? data
              .map((item, i) => toMenuItem(item, i))
              .filter((item): item is MenuItem => item !== null && item.isAvailable)
          : []

        if (active) {
          setFeaturedItems(
            (mapped.length > 0 ? mapped : FALLBACK_FEATURED_ITEMS).slice(0, 8),
          )
        }
      } catch {
        if (active) setFeaturedItems(FALLBACK_FEATURED_ITEMS)
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="bg-[#11100F] text-white">
      <Suspense fallback={null}>
        <AuthRedirectHandler />
      </Suspense>
      <HeroSection />

      <section className="relative isolate overflow-hidden px-5 py-16 sm:py-20 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 size-[28rem] rounded-full bg-orange-500/10 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 size-[24rem] rounded-full bg-orange-600/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[11px] font-bold tracking-[0.22em] text-orange-400 uppercase">
                <Flame aria-hidden className="size-3.5" />
                Customer favorites
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Popular <span className="text-orange-500">picks.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-neutral-400">
                Fresh, hand-tossed pizzas loved by our customers. Browse the full menu for more.
              </p>
            </div>

            <Link
              href="/browse-menu"
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-orange-500/40 hover:text-orange-300"
            >
              View All Menu
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10">
            {loading ? (
              <MenuGridSkeleton />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {featuredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
