'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'
import type { FormEvent } from 'react'

type Props = {
  query: string
  onQueryChange: (value: string) => void
  onSearch: (value: string) => void
}

export default function BrowseMenuHero({ query, onQueryChange, onSearch }: Props) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#171412]">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop"
          alt="Delicious pizza on a table"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#110f0d] via-[#110f0d]/90 to-[#110f0d]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110f0d] via-transparent to-transparent" />
      </div>

      <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <span className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-400">
          Fresh From The Oven
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          Explore Our <span className="text-orange-500">Delicious Pizzas</span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
          Discover handcrafted pizzas made with fresh ingredients, bold flavors, and the perfect crust. Search your favorites and find the perfect slice for any craving.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-500" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search for pizzas..."
              aria-label="Search pizzas"
              className="h-14 w-full rounded-full border border-white/10 bg-white/[0.07] pl-12 pr-4 text-sm font-medium text-white placeholder:text-neutral-500 outline-none backdrop-blur transition focus:border-orange-500/60 focus:bg-white/[0.1]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center rounded-full bg-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-400"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  )
}
