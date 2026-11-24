'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  ImagePlus,
  Inbox,
  Layers,
  Loader2,
  Pencil,
  Pizza,
  PlusCircle,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Utensils,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { MenuItems } from '@/lib/data'
import { getMenuItems } from '@/lib/api/menu'

const categories = [
  { value: 'classic', label: 'Classic Pizza' },
  { value: 'cheese', label: 'Cheese Pizza' },
  { value: 'chicken', label: 'Chicken Pizza' },
  { value: 'vegetarian', label: 'Vegetarian Pizza' },
  { value: 'special', label: 'Special Pizza' },
]

const categoryVariant: Record<
  string,
  'red' | 'amber' | 'orange' | 'emerald' | 'violet' | 'default'
> = {
  classic: 'red',
  cheese: 'amber',
  chicken: 'orange',
  vegetarian: 'emerald',
  special: 'violet',
}

const categoryLabel = (value: string) =>
  categories.find((category) => category.value === value)?.label ?? value

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatDate = (value: string) => {
  if (!value) return 'N/A'

  const [year, month, day] = value.slice(0, 10).split('-')
  const monthIndex = Number(month) - 1

  if (!year || !day || !MONTHS[monthIndex]) {
    return value
  }

  return `${Number(day)} ${MONTHS[monthIndex]} ${year}`
}

const formatDollar = (value: number) => `$${value.toFixed(2)}`

const inputClass =
  'w-full min-h-[46px] rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm font-medium text-white placeholder:text-zinc-500 outline-none transition-all duration-300 [color-scheme:dark] focus:border-red-500 focus:bg-zinc-900 focus:ring-4 focus:ring-red-500/10'

const labelClass =
  'mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400'

type MenuImageProps = {
  src: string
  alt: string
  className?: string
}

const MenuImage = ({ src, alt, className = '' }: MenuImageProps) => (
  <div
    className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-zinc-800 ${className}`}
  >
    <Pizza size={18} className="text-zinc-600" />

    {src ? (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
    ) : null}
  </div>
)

export default function ManageMenuPage() {
  const [items, setItems] = useState<MenuItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [today, setToday] = useState('')

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  useEffect(() => {
    const date = new Date()

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    // eslint-disable-next-line react-hooks/set-state-in-effect -- initialize client date after mount to avoid SSR mismatch
    setToday(`${year}-${month}-${day}`)
  }, [])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getMenuItems()

        setItems(data)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load menu items',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => setToast(null), 4000)

    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (editingIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEditingIndex(null)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingIndex])

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase()

    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const matchesQuery =
          !search ||
          item.pizzaName.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search)

        const matchesCategory =
          categoryFilter === 'all' || item.category === categoryFilter

        return matchesQuery && matchesCategory
      })
  }, [items, query, categoryFilter])

  const stats = useMemo(() => {
    const total = items.length

    const uniqueCategories = new Set(items.map((item) => item.category)).size

    const averagePrice = total
      ? items.reduce((sum, item) => sum + item.price, 0) / total
      : 0

    const availableNow = today
      ? items.filter((item) => item.availableDate <= today).length
      : 0

    return {
      total,
      uniqueCategories,
      averagePrice,
      availableNow,
    }
  }, [items, today])

  const editingItem = editingIndex !== null ? items[editingIndex] : null

  const hasActiveFilters = query.trim() !== '' || categoryFilter !== 'all'

  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    setToast({ message, type })
  }

  const handleDelete = (index: number) => {
    const removed = items[index]

    if (!removed) return

    setItems((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    )

    showToast(`${removed.pizzaName} has been removed from your menu.`)
  }

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editingIndex === null) return

    const formData = new FormData(event.currentTarget)

    const updated: MenuItems = {
      pizzaName: String(formData.get('pizzaName')),
      category: String(formData.get('category')),
      price: Number(formData.get('price')),
      preparationTime: String(formData.get('preparationTime')),
      availableDate: String(formData.get('availableDate')),
      imageUrl: String(formData.get('imageUrl')),
      description: String(formData.get('description')),
    }

    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === editingIndex ? updated : item,
      ),
    )

    setEditingIndex(null)

    showToast(`${updated.pizzaName} has been updated successfully.`)
  }

  const clearFilters = () => {
    setQuery('')
    setCategoryFilter('all')
  }

  return (
    <div className="relative min-h-full text-white">
      {toast ? (
        <div
          role="status"
          className="fixed right-4 top-5 z-[120] w-[calc(100%-2rem)] max-w-sm"
        >
          <div
            className={`overflow-hidden rounded-2xl border bg-[#18181b] shadow-2xl shadow-black/40 ${
              toast.type === 'success'
                ? 'border-emerald-500/20'
                : 'border-red-500/20'
            }`}
          >
            <div className="flex items-start gap-3 p-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                <CheckCircle2 size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white">
                  {toast.type === 'success'
                    ? 'Menu Updated!'
                    : 'Something Went Wrong!'}
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Close notification"
                className="rounded-lg p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-rose-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-red-300">
              <Sparkles size={14} />
              VENDOR MENU MANAGEMENT
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Manage My{' '}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Menu Items
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Every pizza you have added to PizzaHub lives here. Search, edit or
              remove items to keep your menu fresh and delicious.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/menu/add"
            className="group inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-1 hover:from-red-500 hover:to-orange-400 hover:shadow-xl hover:shadow-red-600/30 active:translate-y-0 lg:self-auto"
          >
            <PlusCircle
              size={18}
              className="transition-transform group-hover:rotate-90"
            />
            Add Menu Item
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#111114]/95 p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Pizza size={22} />
              </div>
              <Badge variant="red">Live</Badge>
            </div>

            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {stats.total}
            </p>

            <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Total Menu Items
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114]/95 p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Layers size={22} />
              </div>
              <Badge variant="orange">Variety</Badge>
            </div>

            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {stats.uniqueCategories}
            </p>

            <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Pizza Categories
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114]/95 p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign size={22} />
              </div>
              <Badge variant="emerald">Average</Badge>
            </div>

            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {formatDollar(stats.averagePrice)}
            </p>

            <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Average Price
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114]/95 p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <CalendarDays size={22} />
              </div>
              <Badge variant="violet">Ready</Badge>
            </div>

            <p className="mt-4 text-3xl font-black tracking-tight text-white">
              {stats.availableNow}
            </p>

            <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              Available Now
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111114]/95 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-bold sm:text-xl">My Pizzas</h2>

              <p className="mt-1 text-sm text-zinc-500">
                Showing {rows.length} of {items.length} menu items
                {hasActiveFilters ? ' · filtered' : ''}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pizzas..."
                  aria-label="Search menu items"
                  className={`${inputClass} min-w-0 pl-10 sm:w-64`}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
                className={`${inputClass} cursor-pointer sm:w-52`}
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-300 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
                >
                  <X size={16} />
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 size={36} className="animate-spin text-red-400" />
              <p className="mt-4 text-sm text-zinc-400">
                Loading menu items...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl border border-white/10 px-5 py-2 text-sm text-zinc-300 hover:bg-white/10"
              >
                Try Again
              </button>
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-500">
                <Inbox size={30} />
              </div>

              <h3 className="mt-6 text-lg font-bold text-white">
                No menu items found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Nothing matches your search. Try a different pizza name or
                category, or add a new delicious pizza to your menu.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    Clear Filters
                  </button>
                ) : null}

                <Link
                  href="/dashboard/vendor/menu/add"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:from-red-500 hover:to-orange-400"
                >
                  <PlusCircle size={17} />
                  Add Menu Item
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1040px] text-left">
                  <thead className="border-b border-white/10 bg-white/[0.03]">
                    <tr className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                      <th className="px-6 py-4">Pizza</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4 text-right">Price</th>
                      <th className="px-4 py-4">Prep Time</th>
                      <th className="px-4 py-4">Available</th>
                      <th className="px-4 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.06]">
                    {rows.map(({ item, index }) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-white/[0.03]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <MenuImage
                              src={item.imageUrl}
                              alt={item.pizzaName}
                              className="h-12 w-12 rounded-xl"
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-white">
                                {item.pizzaName}
                              </p>

                              <p className="mt-1 text-xs text-zinc-500">
                                Item #{String(index + 1).padStart(3, '0')}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            variant={
                              categoryVariant[item.category] ?? 'default'
                            }
                          >
                            {categoryLabel(item.category)}
                          </Badge>
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-bold text-emerald-400">
                          {formatDollar(item.price)}
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                            <Clock3 size={14} className="text-orange-400" />
                            {item.preparationTime}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-zinc-300">
                          {formatDate(item.availableDate)}
                        </td>

                        <td className="px-4 py-4">
                          <p className="line-clamp-2 max-w-[260px] text-xs leading-5 text-zinc-500">
                            {item.description}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingIndex(index)}
                              aria-label={`Edit ${item.pizzaName}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition-all hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(index)}
                              aria-label={`Delete ${item.pizzaName}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 p-4 md:hidden">
                {rows.map(({ item, index }) => (
                  <article
                    key={index}
                    className="rounded-2xl border border-white/10 bg-[#18181b] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <MenuImage
                        src={item.imageUrl}
                        alt={item.pizzaName}
                        className="h-14 w-14 rounded-xl"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-6 text-white">
                          {item.pizzaName}
                        </p>

                        <div className="mt-2">
                          <Badge
                            variant={
                              categoryVariant[item.category] ?? 'default'
                            }
                          >
                            {categoryLabel(item.category)}
                          </Badge>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-emerald-400">
                        {formatDollar(item.price)}
                      </p>
                    </div>

                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-500">
                      {item.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                          Prep Time
                        </p>

                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                          <Clock3 size={13} className="text-orange-400" />
                          {item.preparationTime}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                          Available
                        </p>

                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                          <CalendarDays size={13} className="text-orange-400" />
                          {formatDate(item.availableDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingIndex(index)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-zinc-300 transition-all hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-zinc-300 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <p className="mt-10 text-center text-xs text-zinc-500">
          PizzaHub Vendor Dashboard · Manage what is on your menu
        </p>
      </div>

      {editingItem ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editingItem.pizzaName}`}
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingIndex(null)
            }
          }}
        >
          <div className="my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#111114] shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                  <Utensils size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold sm:text-lg">
                    Edit Menu Item
                  </h2>

                  <p className="mt-0.5 text-xs text-zinc-500">
                    Update your pizza details below
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="max-h-[70vh] space-y-4 overflow-y-auto p-5 sm:p-6"
              onSubmit={handleSave}
            >
              <div>
                <label htmlFor="edit-pizzaName" className={labelClass}>
                  <Pizza size={14} className="text-red-400" />
                  Pizza Name
                </label>

                <input
                  id="edit-pizzaName"
                  name="pizzaName"
                  type="text"
                  required
                  defaultValue={editingItem.pizzaName}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-category" className={labelClass}>
                    <Tag size={14} className="text-red-400" />
                    Category
                  </label>

                  <select
                    id="edit-category"
                    name="category"
                    required
                    defaultValue={editingItem.category}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-price" className={labelClass}>
                    <DollarSign size={14} className="text-red-400" />
                    Price ($)
                  </label>

                  <input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    defaultValue={editingItem.price}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-preparationTime" className={labelClass}>
                    <Clock3 size={14} className="text-red-400" />
                    Preparation Time
                  </label>

                  <input
                    id="edit-preparationTime"
                    name="preparationTime"
                    type="text"
                    required
                    defaultValue={editingItem.preparationTime}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="edit-availableDate" className={labelClass}>
                    <CalendarDays size={14} className="text-red-400" />
                    Available Date
                  </label>

                  <input
                    id="edit-availableDate"
                    name="availableDate"
                    type="date"
                    required
                    defaultValue={editingItem.availableDate.slice(0, 10)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-imageUrl" className={labelClass}>
                  <ImagePlus size={14} className="text-red-400" />
                  Pizza Image URL
                </label>

                <input
                  id="edit-imageUrl"
                  name="imageUrl"
                  type="url"
                  required
                  defaultValue={editingItem.imageUrl}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="edit-description" className={labelClass}>
                  <Sparkles size={14} className="text-red-400" />
                  Description
                </label>

                <textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  required
                  defaultValue={editingItem.description}
                  className={`${inputClass} min-h-[110px] resize-y`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-red-500 hover:to-orange-400 active:translate-y-0"
                >
                  <CheckCircle2 size={17} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
