'use client'

import { Flame } from 'lucide-react'

import BrowseMenuFilterBar, {
  type FilterKey,
} from '@/components/browse-menu/filter-bar'

const BrowseMenuPage = () => {
  const handleSearch = (query: string) => {
    void query
    // TODO: wire search query to URL params
  }

  const handleFilterChange = (key: FilterKey, value: string) => {
    void key
    void value
    // TODO: wire filter changes to URL params
  }

  const handleClear = () => {
    // TODO: clear URL params
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#11100F] text-white">
      {/* Background atmosphere */}
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

        {/* Menu results grid goes here */}
      </div>
    </main>
  )
}

export default BrowseMenuPage
