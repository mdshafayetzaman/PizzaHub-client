'use client'

import { SearchX } from 'lucide-react'

type Props = {
  query?: string
  onClear?: () => void
}

export default function MenuEmptyState({ query, onClear }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#171614]/80 px-6 py-14 text-center backdrop-blur">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
        <SearchX className="size-8" aria-hidden />
      </div>
      <h2 className="mt-5 text-xl font-bold text-white">No pizzas found</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-400">
        {query
          ? `We couldn't find any pizzas matching "${query}". Try a different search or category.`
          : 'No pizzas match your current filters. Try adjusting your search or category.'}
      </p>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-400"
        >
          Clear Filters
        </button>
      ) : null}
    </div>
  )
}
