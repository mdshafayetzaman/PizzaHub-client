'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

import BrowseMenuHero from '@/components/browse-menu/BrowseMenuHero'
import MenuCategoryFilter from '@/components/browse-menu/MenuCategoryFilter'
import MenuSort, { type MenuSortValue } from '@/components/browse-menu/MenuSort'
import MenuCard from '@/components/browse-menu/menu-card'
import MenuGridSkeleton from '@/components/browse-menu/menu-grid-skeleton'
import MenuEmptyState from '@/components/browse-menu/MenuEmptyState'
import {
  getMenuItems,
  getMenuImage,
  getMenuName,
  type MenuItemRecord,
} from '@/lib/api/menu'
import type { MenuItem } from '@/lib/data'

function toMenuItem(record: MenuItemRecord, index: number): MenuItem | null {
  const name = getMenuName(record)
  const image = getMenuImage(record)
  const price = Number(record.price)
  if (!name || !Number.isFinite(price)) return null

  const category = String(record.category || 'Classic')
  const ratingValue = Number(record.rating)
  const reviewsValue = Number(record.reviews)
  const status = String(record.status || record.approvalStatus || 'active').toLowerCase()

  return {
    id: String(record._id || record.id || `api-${index}`),
    name,
    description: String(record.description || 'Delicious pizza made fresh to order.'),
    price,
    category: category as MenuItem['category'],
    image: image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&h=700&fit=crop',
    rating: Number.isFinite(ratingValue) && ratingValue > 0 ? ratingValue : 4.5,
    reviews: Number.isFinite(reviewsValue) && reviewsValue >= 0 ? reviewsValue : 0,
    popular: Boolean(record.popular),
    toppings: Array.isArray(record.toppings) ? record.toppings.map(String) : [],
    calories: Number(record.calories) || 0,
    prepTime: String(record.preparationTime || '15-20 min'),
    isAvailable: status !== 'inactive' && status !== 'unavailable' && status !== 'rejected',
  }
}

export default function BrowseMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState<MenuSortValue>('featured')

  const loadItems = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMenuItems()
      const mapped = Array.isArray(data)
        ? data.map((item, i) => toMenuItem(item, i)).filter((item): item is MenuItem => item !== null)
        : []
      setItems(mapped)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load menu items.'
      setError(message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadItems()
  }, [])

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category).filter(Boolean)))
    return ['All', ...unique.sort((a, b) => a.localeCompare(b))]
  }, [items])

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All')
    }
  }, [categories, selectedCategory])

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let result = items.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchesQuery && matchesCategory
    })

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
        default:
          return Number(Boolean(b.popular)) - Number(Boolean(a.popular)) || b.rating - a.rating
      }
    })

    return result
  }, [items, searchQuery, selectedCategory, sortBy])

  const handleClear = () => {
    setQuery('')
    setSearchQuery('')
    setSelectedCategory('All')
    setSortBy('featured')
  }

  return (
    <main className="bg-[#110F0D] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8 lg:py-16">
        <BrowseMenuHero
          query={query}
          onQueryChange={setQuery}
          onSearch={(value) => setSearchQuery(value)}
        />

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#171412]/80 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Categories</p>
              <MenuCategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>

            <div className="shrink-0">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Sort By</p>
              <MenuSort value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        </section>

        <section aria-label="Menu items" className="mt-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Our <span className="text-orange-500">Menu</span>
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                {loading ? 'Loading pizzas...' : `${filteredItems.length} pizza${filteredItems.length === 1 ? '' : 's'} available`}
              </p>
            </div>
            {!loading && (searchQuery || selectedCategory !== 'All' || sortBy !== 'featured') ? (
              <button type="button" onClick={handleClear} className="text-sm font-semibold text-orange-400 transition hover:text-orange-300">
                Clear all filters
              </button>
            ) : null}
          </div>

          {loading ? (
            <MenuGridSkeleton />
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <AlertCircle className="mx-auto size-10 text-red-400" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">Unable to load menu</h3>
              <p className="mt-2 text-sm text-red-200/80">{error}</p>
              <button
                type="button"
                onClick={() => void loadItems()}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
              >
                <RefreshCw className="size-4" aria-hidden />
                Try Again
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <MenuEmptyState query={searchQuery} onClear={handleClear} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
