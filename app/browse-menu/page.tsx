'use client'

import { useEffect, useMemo, useState } from 'react'
import { Flame, SearchX, AlertCircle } from 'lucide-react'

import BrowseMenuFilterBar, {
  type BrowseMenuFilters,
  type FilterKey,
} from '@/components/browse-menu/filter-bar'
import MenuCard from '@/components/browse-menu/menu-card'
import MenuGridSkeleton from '@/components/browse-menu/menu-grid-skeleton'
import {
  getMenuItems,
  getMenuImage,
  getMenuName,
  type MenuItemRecord,
} from '@/lib/api/menu'
import { MENU_ITEMS, type MenuItem } from '@/lib/data'

const DEFAULT_FILTERS: BrowseMenuFilters = {
  query: '',
  category: 'all',
  price: 'any',
  rating: 'any',
  sort: 'popular',
}

function toMenuItem(record: MenuItemRecord, index: number): MenuItem | null {
  const name = getMenuName(record)
  const image = getMenuImage(record)
  const price = Number(record.price)
  if (!name || !image || Number.isNaN(price)) return null

  const category = String(record.category || 'Classic') as MenuItem['category']
  const rating = Number(record.rating) || 4.5
  const reviews = Number(record.reviews) || 0
  const prepTime = String(record.preparationTime || '15-20 min')
  const status = String(record.status || record.approvalStatus || 'active').toLowerCase()

  return {
    id: String(record._id || record.id || `api-${index}`),
    name,
    description: String(record.description || 'Delicious pizza made fresh to order.'),
    price,
    category,
    image,
    rating,
    reviews,
    popular: Boolean(record.popular),
    toppings: Array.isArray(record.toppings) ? record.toppings.map(String) : [],
    calories: Number(record.calories) || 0,
    prepTime,
    isAvailable: status !== 'inactive' && status !== 'unavailable',
  }
}

function applyFilters(items: MenuItem[], filters: BrowseMenuFilters) {
  const query = filters.query.trim().toLowerCase()

  let result = items.filter((item) => {
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)

    const matchesCategory = filters.category === 'all' || item.category === filters.category

    const matchesPrice =
      filters.price === 'any' ||
      (filters.price === 'under-15' && item.price < 15) ||
      (filters.price === '15-25' && item.price >= 15 && item.price <= 25) ||
      (filters.price === 'over-25' && item.price > 25)

    const matchesRating =
      filters.rating === 'any' || item.rating >= Number(filters.rating)

    return matchesQuery && matchesCategory && matchesPrice && matchesRating
  })

  result = [...result].sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating || b.reviews - a.reviews
      case 'newest':
        return Number(b.id) - Number(a.id)
      case 'popular':
      default:
        return Number(Boolean(b.popular)) - Number(Boolean(a.popular)) || b.rating - a.rating
    }
  })

  return result
}

export default function BrowseMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<BrowseMenuFilters>(DEFAULT_FILTERS)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getMenuItems()
        const mapped = Array.isArray(data)
          ? data
              .map((item, i) => toMenuItem(item, i))
              .filter((item): item is MenuItem => Boolean(item))
          : []
        setItems(mapped.length > 0 ? mapped : MENU_ITEMS)
      } catch {
        setItems(MENU_ITEMS)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const filteredItems = useMemo(() => applyFilters(items, filters), [items, filters])

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, query }))
  }

  const handleFilterChange = (key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#11100F] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-24 size-[34rem] rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -left-40 top-1/3 size-[30rem] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
        <header>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[11px] font-bold tracking-[0.22em] text-orange-400 uppercase">
            <Flame aria-hidden className="size-3.5" />
            The full line-up
          </span>

          <h1 className="mt-6 text-5xl font-black tracking-[-0.04em] sm:text-6xl">
            Browse the <span className="text-orange-500">menu.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">
            Search by name, narrow it down by category, price or rating, then
            sort the slices however you like.
          </p>
        </header>

        <div className="mt-9">
          <BrowseMenuFilterBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
          />
        </div>

        <section aria-label="Menu items" className="mt-10">
          {loading ? (
            <MenuGridSkeleton />
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <AlertCircle className="mx-auto size-10 text-red-400" />
              <h2 className="mt-4 text-lg font-bold text-white">Unable to load menu</h2>
              <p className="mt-2 text-sm text-red-200/80">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#1A1917]/60 p-10 text-center">
              <SearchX className="mx-auto size-10 text-neutral-500" />
              <h2 className="mt-4 text-lg font-bold text-white">No pizzas found</h2>
              <p className="mt-2 text-sm text-neutral-400">
                Try adjusting your search or filters to find what you’re craving.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-neutral-400">
                Showing <span className="font-semibold text-white">{filteredItems.length}</span> item{filteredItems.length === 1 ? '' : 's'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
