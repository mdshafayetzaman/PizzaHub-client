import { Search } from 'lucide-react'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** Pill search field. Controlled by the parent — it only reports keystrokes. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search pizzas, toppings or descriptions…',
}: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-neutral-500"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search the menu"
        className="h-13 w-full rounded-full border border-white/10 bg-white/[0.04] pr-4 pl-11 text-sm font-medium text-white [color-scheme:dark] outline-none transition placeholder:text-neutral-500 focus:border-orange-500/50 focus:bg-white/[0.06]"
      />
    </div>
  )
}
