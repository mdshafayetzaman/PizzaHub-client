'use client'

type Props = {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export default function MenuCategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const active = selected === category
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              active
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'border border-white/10 bg-white/[0.04] text-neutral-300 hover:border-orange-500/40 hover:text-orange-300'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
