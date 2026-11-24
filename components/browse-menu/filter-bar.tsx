'use client'

import { useState, type FormEvent } from 'react'
import { Search, X } from 'lucide-react'

import {
  MENU_CATEGORY_OPTIONS,
  PRICE_RANGE_OPTIONS,
  RATING_OPTIONS,
  SORT_OPTIONS,
  type FilterOption,
} from '@/lib/data'

import { FilterSelect } from './filter-select'
import { SearchInput } from './search-input'

/** Live values of every control in the bar. */
export type BrowseMenuFilters = {
  query: string
  category: string
  price: string
  rating: string
  sort: string
}

/** Keys driven by the dropdowns — everything except the search box. */
export type FilterKey = Exclude<keyof BrowseMenuFilters, 'query'>

type BrowseMenuFilterBarProps = {
  /** Search submitted (Enter or the Search button). */
  onSearch?: (query: string) => void
  /** A dropdown picked a new value. */
  onFilterChange?: (key: FilterKey, value: string) => void
  /** Search and every filter were reset. */
  onClear?: () => void
}

const DEFAULT_FILTERS: BrowseMenuFilters = {
  query: '',
  category: 'all',
  price: 'any',
  rating: 'any',
  sort: 'popular',
}

const FILTER_FIELDS: {
  key: FilterKey
  label: string
  options: readonly FilterOption[]
}[] = [
  { key: 'category', label: 'Category', options: MENU_CATEGORY_OPTIONS },
  { key: 'price', label: 'Price', options: PRICE_RANGE_OPTIONS },
  { key: 'rating', label: 'Rating', options: RATING_OPTIONS },
  { key: 'sort', label: 'Sort by', options: SORT_OPTIONS },
]

/**
 * Search box + filter dropdowns for the browse-menu page.
 *
 * The controls are controlled locally so they always respond; the optional
 * callbacks are the seams where the URL query is written — wire them up in the
 * page that renders this component.
 */
export default function BrowseMenuFilterBar({
  onSearch,
  onFilterChange,
  onClear,
}: BrowseMenuFilterBarProps) {
  const [filters, setFilters] = useState<BrowseMenuFilters>(DEFAULT_FILTERS)

  const activeFields = FILTER_FIELDS.filter(
    (field) => filters[field.key] !== DEFAULT_FILTERS[field.key],
  )

  const activeChips = [
    ...(filters.query
      ? [{ key: 'query' as const, label: `"${filters.query}"` }]
      : []),
    ...activeFields.map((field) => ({
      key: field.key,
      label:
        field.options.find((option) => option.value === filters[field.key])
          ?.label ?? '',
    })),
  ]

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSearch?.(filters.query)
  }

  const handleSelectChange = (key: FilterKey, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }))

    onFilterChange?.(key, value)
  }

  const handleRemove = (key: keyof BrowseMenuFilters) => {
    const value = DEFAULT_FILTERS[key]

    setFilters((previous) => ({ ...previous, [key]: value }))

    if (key === 'query') {
      onSearch?.(value)
    } else {
      onFilterChange?.(key, value)
    }
  }

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS)

    onClear?.()
  }

  return (
    <section
      aria-label="Search and filters"
      className="rounded-3xl border border-white/10 bg-[#1A1917]/80 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-5"
    >
      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <SearchInput
          value={filters.query}
          onChange={(value) =>
            setFilters((previous) => ({ ...previous, query: value }))
          }
        />

        <button
          type="submit"
          className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
        >
          <Search aria-hidden className="size-4.5" />
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2 xl:grid-cols-4">
        {FILTER_FIELDS.map((field) => (
          <FilterSelect
            key={field.key}
            label={field.label}
            value={filters[field.key]}
            options={field.options}
            onChange={(value) => handleSelectChange(field.key, value)}
          />
        ))}
      </div>

      {/* Active filters */}
      {activeChips.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className="mr-1 text-[11px] font-bold tracking-[0.16em] text-neutral-500 uppercase">
            Active
          </span>

          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              aria-label={`Remove ${chip.label}`}
              onClick={() => handleRemove(chip.key)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 py-1.5 pr-2 pl-3 text-xs font-semibold text-orange-300 transition hover:border-orange-500/60 hover:bg-orange-500/20"
            >
              {chip.label}
              <X
                aria-hidden
                className="size-3.5 opacity-60 transition group-hover:opacity-100"
              />
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-orange-500/40 hover:text-white"
          >
            <X aria-hidden className="size-3.5" />
            Clear all
          </button>
        </div>
      ) : null}
    </section>
  )
}
