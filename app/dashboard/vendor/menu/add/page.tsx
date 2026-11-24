'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Pizza,
  PlusCircle,
  ImagePlus,
  Utensils,
  CalendarDays,
  Clock3,
  DollarSign,
  Tag,
  FileText,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  X,
} from 'lucide-react'
import { createMenu } from '@/lib/actions/menuitem'
import type { MenuItems } from '@/lib/data'

const categories = [
  { value: 'classic', label: 'Classic Pizza' },
  { value: 'cheese', label: 'Cheese Pizza' },
  { value: 'chicken', label: 'Chicken Pizza' },
  { value: 'vegetarian', label: 'Vegetarian Pizza' },
  { value: 'special', label: 'Special Pizza' },
]

const inputClass =
  'w-full min-h-[54px] rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10'

const labelClass =
  'mb-2.5 flex items-center gap-2 text-sm font-semibold text-zinc-200'

export default function NewAddPage() {
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!toastMessage) return

    const timer = setTimeout(() => {
      setToastMessage('')
    }, 4000)

    return () => clearTimeout(timer)
  }, [toastMessage])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    const menu: MenuItems = {
      pizzaName: String(formData.get('pizzaName')),
      category: String(formData.get('category')),
      price: Number(formData.get('price')),
      preparationTime: String(formData.get('preparationTime')),
      availableDate: String(formData.get('availableDate')),
      imageUrl: String(formData.get('imageUrl')),
      description: String(formData.get('description')),
    }

    try {
      setIsLoading(true)

      const result = await createMenu(menu)

      console.log('Menu Created:', result)

      setToastType('success')
      setToastMessage(`${menu.pizzaName} has been added successfully.`)

      form.reset()
    } catch (error) {
      console.error('Menu Creation Failed:', error)

      setToastType('error')
      setToastMessage('Failed to create pizza. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-full text-white">
      {toastMessage && (
        <div
          role="status"
          className="fixed right-4 top-5 z-[100] w-[calc(100%-2rem)] max-w-sm"
        >
          <div
            className={`overflow-hidden rounded-2xl border bg-[#18181b] shadow-2xl shadow-black/40 ${
              toastType === 'success'
                ? 'border-emerald-500/20'
                : 'border-red-500/20'
            }`}
          >
            <div className="flex items-start gap-3 p-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  toastType === 'success'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                <CheckCircle2 size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white">
                  {toastType === 'success'
                    ? 'Pizza Created Successfully!'
                    : 'Something Went Wrong!'}
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  {toastMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setToastMessage('')}
                aria-label="Close notification"
                className="rounded-lg p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-rose-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <Link
          href="/dashboard/vendor/menu"
          className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Menu
        </Link>

        <section className="mt-8 grid items-start gap-8 xl:grid-cols-[0.85fr_1.5fr]">
          <div className="space-y-7 xl:sticky xl:top-8">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-red-300">
                <Sparkles size={14} />
                VENDOR MENU MANAGEMENT
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Create Your
                <span className="mt-2 block bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Delicious Pizza
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                Add a new pizza to your restaurant menu. Give your customers
                something delicious to discover.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/15 via-zinc-900 to-orange-500/10 p-7 sm:p-9">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-400">
                  <Pizza size={34} />
                </div>

                <h2 className="mt-7 text-2xl font-bold">
                  Your Menu, Your Style
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  Make your pizza stand out with a catchy name, delicious
                  description and an attractive image.
                </p>

                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    <Utensils size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Ready to serve?</p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Let&apos;s add something tasty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20">
                <PlusCircle size={27} />
              </div>

              <div>
                <h2 className="text-xl font-bold sm:text-2xl">Add New Pizza</h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Enter your pizza information below
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="pizzaName" className={labelClass}>
                  <Pizza size={16} className="text-red-400" />
                  Pizza Name
                </label>

                <input
                  id="pizzaName"
                  name="pizzaName"
                  type="text"
                  placeholder="e.g. Italian Margherita Pizza"
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className={labelClass}>
                    <Tag size={16} className="text-red-400" />
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue=""
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>

                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className={labelClass}>
                    <DollarSign size={16} className="text-red-400" />
                    Price ($)
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 15.99"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="preparationTime" className={labelClass}>
                    <Clock3 size={16} className="text-red-400" />
                    Preparation Time
                  </label>

                  <input
                    id="preparationTime"
                    name="preparationTime"
                    type="text"
                    placeholder="e.g. 20-30 minutes"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="availableDate" className={labelClass}>
                    <CalendarDays size={16} className="text-red-400" />
                    Available Date
                  </label>

                  <input
                    id="availableDate"
                    name="availableDate"
                    type="date"
                    required
                    className={`${inputClass} cursor-pointer`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="imageUrl" className={labelClass}>
                  <ImagePlus size={16} className="text-red-400" />
                  Pizza Image URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/pizza-image.jpg"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  <FileText size={16} className="text-red-400" />
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Describe your delicious pizza, ingredients and special taste..."
                  required
                  className={`${inputClass} min-h-[140px] resize-y`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:justify-end">
                <Link
                  href="/dashboard/vendor/menu"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-1 hover:from-red-500 hover:to-orange-400 hover:shadow-xl hover:shadow-red-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PlusCircle
                    size={18}
                    className="transition-transform group-hover:rotate-90"
                  />
                  {isLoading ? 'Creating...' : 'Add Pizza'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-zinc-500">
          PizzaHub Vendor Dashboard · Create something delicious
        </p>
      </div>
    </div>
  )
}
