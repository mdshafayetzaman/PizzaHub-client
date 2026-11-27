'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pizza, PlusCircle, ImagePlus, Utensils, DollarSign, Tag, FileText, Sparkles, MapPin, Upload, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'

import { createMenuItem } from '@/lib/api/menu'
import { uploadImageToImgBB } from '@/lib/api/upload'
import { getErrorMessage } from '@/lib/api-client'

const categories = [
  { value: 'Classic', label: 'Classic Pizza' },
  { value: 'Cheese', label: 'Cheese Pizza' },
  { value: 'Chicken', label: 'Chicken Pizza' },
  { value: 'Vegetarian', label: 'Vegetarian Pizza' },
  { value: 'Special', label: 'Special Pizza' },
]

const inputClass = 'w-full min-h-[54px] rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10'
const labelClass = 'mb-2.5 flex items-center gap-2 text-sm font-semibold text-zinc-200'

export default function AddMenuItemPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const handleImageUpload = async (file?: File) => {
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImageToImgBB(file)
      setImageUrl(url)
      toast.success('Image uploaded successfully.')
    } catch (e) {
      toast.error(getErrorMessage(e, 'Image upload failed.'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const pizzaName = String(formData.get('pizzaName') || '').trim()
    const category = String(formData.get('category') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const location = String(formData.get('location') || '').trim()
    const price = Number(formData.get('price'))
    const finalImageUrl = String(formData.get('imageUrl') || imageUrl || '').trim()

    if (!pizzaName || !category || !description || !location || !finalImageUrl || !Number.isFinite(price) || price <= 0) {
      toast.error('Please fill all required fields with valid values.')
      return
    }

    try {
      setIsLoading(true)
      await toast.promise(
        createMenuItem({
          pizzaName,
          category,
          description,
          price,
          location,
          imageUrl: finalImageUrl,
          preparationTime: String(formData.get('preparationTime') || '').trim() || undefined,
          availableDate: String(formData.get('availableDate') || '').trim() || undefined,
        }),
        {
          loading: 'Submitting menu item...',
          success: () => {
            form.reset()
            setImageUrl('')
            router.push('/dashboard/vendor/menu')
            router.refresh()
            return `${pizzaName} was submitted for approval.`
          },
          error: (e) => getErrorMessage(e, 'Failed to create menu item.'),
        }
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-full text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <Link href="/dashboard/vendor/menu" className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-white">
          <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1" /> Back to Menu
        </Link>

        <section className="mt-8 grid items-start gap-8 xl:grid-cols-[0.85fr_1.5fr]">
          <div className="space-y-7 xl:sticky xl:top-8">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold tracking-wider text-red-300">
                <Sparkles size={14} /> VENDOR MENU MANAGEMENT
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Create Your
                <span className="mt-2 block bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Delicious Pizza</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">Add a new pizza to your menu. New items are saved with <span className="text-amber-300 font-semibold">Pending</span> approval status.</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-500/15 via-zinc-900 to-orange-500/10 p-7 sm:p-9">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-400"><Pizza size={34} /></div>
              <h2 className="mt-7 text-2xl font-bold">Plan Limits</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">Free vendors can have up to 3 active items. Premium vendors can publish unlimited items. The backend enforces this rule.</p>
              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400"><Utensils size={20} /></div>
                <div><p className="text-sm font-semibold">Ready to serve?</p><p className="mt-1 text-xs text-zinc-500">Submit a quality menu item for approval.</p></div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-7">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20"><PlusCircle size={27} /></div>
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">Add New Pizza</h2>
                <p className="mt-1 text-sm text-zinc-400">Enter your pizza information below</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="pizzaName" className={labelClass}><Pizza size={16} className="text-red-400" /> Pizza Name</label>
                <input id="pizzaName" name="pizzaName" type="text" placeholder="e.g. Italian Margherita Pizza" required className={inputClass} />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className={labelClass}><Tag size={16} className="text-red-400" /> Category</label>
                  <select id="category" name="category" required defaultValue="" className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className={labelClass}><DollarSign size={16} className="text-red-400" /> Price ($)</label>
                  <input id="price" name="price" type="number" min="0.01" step="0.01" placeholder="e.g. 15.99" required className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}><MapPin size={16} className="text-red-400" /> Location</label>
                <input id="location" name="location" type="text" placeholder="e.g. Dhaka, Bangladesh" required className={inputClass} />
              </div>

              <div>
                <label htmlFor="imageFile" className={labelClass}><ImagePlus size={16} className="text-red-400" /> Item Image (ImgBB)</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-300 hover:bg-white/10">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {uploading ? 'Uploading...' : 'Upload to ImgBB'}
                    <input id="imageFile" type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void handleImageUpload(e.target.files?.[0])} />
                  </label>
                  <input id="imageUrl" name="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL" required className={`${inputClass} flex-1`} />
                </div>
                {imageUrl ? <img src={imageUrl} alt="Preview" className="mt-3 h-28 w-28 rounded-xl object-cover border border-white/10" /> : null}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="preparationTime" className={labelClass}>Preparation Time</label>
                  <input id="preparationTime" name="preparationTime" type="text" placeholder="e.g. 20-30 minutes" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="availableDate" className={labelClass}>Available Date</label>
                  <input id="availableDate" name="availableDate" type="date" className={`${inputClass} cursor-pointer`} />
                </div>
              </div>

              <div>
                <label htmlFor="description" className={labelClass}><FileText size={16} className="text-red-400" /> Description</label>
                <textarea id="description" name="description" rows={5} placeholder="Describe your delicious pizza..." required className={`${inputClass} min-h-[140px] resize-y`} />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:justify-end">
                <Link href="/dashboard/vendor/menu" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white">Cancel</Link>
                <button type="submit" disabled={isLoading || uploading} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-1 hover:from-red-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} className="transition-transform group-hover:rotate-90" />}
                  {isLoading ? 'Creating...' : 'Add Pizza'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
