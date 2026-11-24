import { useId } from 'react'
import { ChevronDown } from 'lucide-react'

import type { FilterOption } from '@/lib/data'

type FilterSelectProps = {
  label: string
  value: string
  options: readonly FilterOption[]
  onChange: (value: string) => void
}

/** Labelled dropdown used for one browse-menu filter. */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-bold tracking-[0.16em] text-neutral-500 uppercase"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-full border border-white/10 bg-white/[0.04] pr-10 pl-4 text-sm font-semibold text-white [color-scheme:dark] outline-none transition hover:border-orange-500/40 focus:border-orange-500/60"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-orange-500"
        />
      </div>
    </div>
  )
}
