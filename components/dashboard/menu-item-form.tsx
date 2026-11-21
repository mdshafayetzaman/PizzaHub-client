'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MenuCategory } from '@/lib/data'

const CATEGORIES: MenuCategory[] = [
  'Classic',
  'Speciality',
  'Vegan',
  'Sides',
  'Desserts',
]

const fieldClass =
  'h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-neutral-600 focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20'

const labelClass = 'text-xs font-bold uppercase tracking-[0.14em] text-neutral-500'

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className={labelClass}>{label}</Label>
      {children}
    </div>
  )
}

export default function MenuItemForm() {
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Item name">
        <Input
          name="name"
          required
          placeholder="Truffle Mushroom"
          className={fieldClass}
        />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Wild mushrooms, truffle cream, mozzarella and thyme…"
          className={`${fieldClass} h-auto min-h-28 resize-y py-3`}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Price (£)">
          <Input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="16.99"
            className={fieldClass}
          />
        </Field>

        <Field label="Category">
          <select
            name="category"
            required
            defaultValue="Classic"
            className={`${fieldClass} appearance-none`}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category} className="bg-[#14110F]">
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Preparation time">
          <Input
            name="prepTime"
            required
            placeholder="14 min"
            className={fieldClass}
          />
        </Field>

        <Field label="Calories">
          <Input
            name="calories"
            type="number"
            min="0"
            required
            placeholder="950"
            className={fieldClass}
          />
        </Field>
      </div>

      <Field label="Image URL">
        <Input
          name="image"
          type="url"
          required
          placeholder="https://images.unsplash.com/photo-…"
          className={fieldClass}
        />
      </Field>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300">
        <input
          type="checkbox"
          name="popular"
          className="size-4 rounded border-white/20 bg-white/5 accent-orange-500"
        />
        Mark as popular
      </label>

      {saved && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            Menu item saved. Connect this form to your API to persist changes —
            the current data is a local demo.
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
      >
        Save menu item
      </Button>
    </form>
  )
}
