'use client'

import { ChevronDown, ArrowUpDown } from 'lucide-react'

export type MenuSortValue = 'featured' | 'price-asc' | 'price-desc' | 'name'

type Props = {
  value: MenuSortValue
  onChange: (value: MenuSortValue) => void
}

const OPTIONS: { value: MenuSortValue; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name' },
]

export default function MenuSort({ value, onChange }: Props) {
  return (
    <div className="relative w-full sm:w-56">
      <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-orange-400" aria-hidden />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as MenuSortValue)}
        aria-label="Sort menu items"
        className="h-12 w-full appearance-none rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-10 text-sm font-semibold text-white outline-none transition hover:border-orange-500/40 focus:border-orange-500/60 [color-scheme:dark]"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
    </div>
  )
}
