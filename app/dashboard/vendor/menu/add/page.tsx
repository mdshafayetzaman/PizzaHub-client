'use client'

import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Pizza,
  PlusCircle,
  ImagePlus,
  Utensils,
  MapPin,
  Clock3,
  DollarSign,
  X,
  Loader2,
  CheckCircle2,
  Upload,
  Sparkles,
  FileImage,
  ChefHat,
  Tag,
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const categories = [
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
]

interface MenuForm {
  itemName: string
  category: string
  description: string
  price: string
  location: string
}

const initialForm: MenuForm = {
  itemName: '',
  category: '',
  description: '',
  price: '',
  location: '',
}

export default function NewAddPage() {
  const router = useRouter()
  const { data: session, isPending: sessionLoading } = useSession()

  const [form, setForm] = useState<MenuForm>(initialForm)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(false)

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace('/login')
    }
  }, [session, sessionLoading, router])

  useEffect(() => {
    if (preview) return
    return () => {}
  }, [preview])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image.')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.')
      e.target.value = ''
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setImage(null)
    setPreview('')
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_URL}/api/upload-image`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Image upload failed.')
    }

    const imageUrl = result.url || result.imageUrl || result.data?.url

    if (!imageUrl) {
      throw new Error('Image URL was not returned by the server.')
    }

    return imageUrl
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!session?.user) {
      toast.error('Please login first.')
      router.push('/login')
      return
    }

    if (session.user.role !== 'vendor') {
      toast.error('Only vendors can add menu items.')
      return
    }

    if (!image) {
      toast.error('Please upload a pizza image.')
      return
    }

    if (
      !form.itemName.trim() ||
      !form.category ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      toast.error('Please fill in all required fields.')
      return
    }

    const price = Number(form.price)

    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Please enter a valid price.')
      return
    }

    if (form.description.trim().length < 10) {
      toast.error('Description must contain at least 10 characters.')
      return
    }

    try {
      setLoading(true)
      setUploadProgress(true)

      const imageUrl = await uploadImage(image)

      setUploadProgress(false)

      const response = await fetch(`${API_URL}/api/menu-items`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: form.itemName.trim(),
          category: form.category,
          description: form.description.trim(),
          price,
          location: form.location.trim(),
          images: [imageUrl],
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create menu item.')
      }

      toast.success('Your menu item has been submitted for approval!')

      setForm(initialForm)
      removeImage()

      router.push('/dashboard/vendor/menu')
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      )
    } finally {
      setLoading(false)
      setUploadProgress(false)
    }
  }

  if (sessionLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c0e]">
        <Loader2 className="size-9 animate-spin text-orange-500" />
      </div>
    )
  }

  if (session.user.role !== 'vendor') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0c0c0e] px-4 text-center text-white">
        <ChefHat className="size-12 text-orange-500" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-zinc-400">
          Only restaurant vendors can add menu items.
        </p>
        <Link
          href="/dashboard"
          className="rounded-xl bg-orange-500 px-6 py-3 font-bold"
        >
          Go to Dashboard
        </Link>
      </div>
    )
  }

  const inputClass =
    'h-12 w-full rounded-xl border border-white/10 bg-[#101012] px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-600 hover:border-white/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'

  const labelClass = 'mb-2 block text-sm font-semibold text-zinc-300'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c0c0e] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-red-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 top-80 size-96 rounded-full bg-orange-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/dashboard/vendor"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-400"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-xl shadow-orange-950/40">
              <Pizza className="size-7 text-white" />
            </div>

            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-orange-400">
                Vendor Workspace
              </span>
              <Sparkles className="size-4 text-orange-400" />
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Add New{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Menu Item
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Bring your delicious creations to PizzaHub. Add your pizza details
              and let customers discover your taste.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold">Quality Matters</p>
              <p className="mt-1 text-xs text-zinc-500">
                New items need admin approval
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-3xl border border-white/[0.08] bg-[#171719] p-5 shadow-2xl shadow-black/20 sm:p-8"
          >
            <div className="mb-7 flex items-center gap-3 border-b border-white/[0.07] pb-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Utensils className="size-5" />
              </div>
              <div>
                <h2 className="font-bold">Menu Information</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Enter your food details carefully
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Item Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="itemName"
                    value={form.itemName}
                    onChange={handleChange}
                    placeholder="e.g. Margherita Pizza"
                    className={inputClass}
                    maxLength={80}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Category <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-orange-400" />
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pl-11 pr-10`}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-zinc-900"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Price ($) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-orange-400" />
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g. 15"
                      min="0.01"
                      step="0.01"
                      className={`${inputClass} pl-11`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Restaurant Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-orange-400" />
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Dhanmondi, Dhaka"
                      className={`${inputClass} pl-11`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Pizza Image <span className="text-red-400">*</span>
                </label>
                <input
                  id="pizza-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <AnimatePresence mode="wait">
                  {preview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-black"
                    >
                      <img
                        src={preview}
                        alt="Pizza preview"
                        className="h-64 w-full object-cover sm:h-72"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                        <div className="flex items-center gap-2">
                          <FileImage className="size-4 text-orange-400" />
                          <span className="max-w-[200px] truncate text-xs font-medium text-white">
                            {image?.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex size-9 items-center justify-center rounded-xl bg-red-500 text-white transition hover:bg-red-600"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.label
                      key="upload"
                      htmlFor="pizza-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-[#101012] px-4 py-8 text-center transition hover:border-orange-500/60 hover:bg-orange-500/[0.03]"
                    >
                      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                        <ImagePlus className="size-7" />
                      </div>
                      <p className="text-sm font-bold text-zinc-200">
                        Drop your pizza image here
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        or click to browse your files
                      </p>
                      <span className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                        PNG, JPG, WEBP · Max 5MB
                      </span>
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className={labelClass}>
                    Description <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-zinc-600">
                    {form.description.length}/500
                  </span>
                </div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={500}
                  placeholder="Describe your delicious ingredients, flavors, toppings and what makes this item special..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#101012] p-4 text-sm leading-6 text-white outline-none transition duration-300 placeholder:text-zinc-600 hover:border-white/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  required
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/vendor/menu"
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 px-7 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:bg-white/5"
              >
                Cancel
              </Link>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    {uploadProgress
                      ? 'Uploading Image...'
                      : 'Creating Menu Item...'}
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-5" />
                    Add Menu Item
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="space-y-5"
          >
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#171719]">
              <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-red-600/20 via-orange-500/10 to-transparent">
                <div className="absolute -right-5 -top-10 size-40 rounded-full bg-orange-500/10 blur-3xl" />
                <Pizza className="relative size-16 text-orange-500/80" />
                <div className="absolute bottom-3 left-5 flex items-center gap-2">
                  <Sparkles className="size-3 text-orange-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-orange-300">
                    PizzaHub Kitchen
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold">Make it irresistible!</h3>
                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  Great photos and clear descriptions help customers discover
                  your delicious menu items.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#171719] p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <ChefHat className="size-5" />
                </div>
                <h3 className="font-bold">Publishing Guidelines</h3>
              </div>

              <div className="space-y-4">
                {[
                  'Use a clear, attractive food image.',
                  'Write an honest and detailed description.',
                  'Select the correct menu category.',
                  'Provide your restaurant location.',
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <p className="text-xs leading-5 text-zinc-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                  <Clock3 className="size-5" />
                </div>
                <h3 className="font-bold">Approval Process</h3>
              </div>
              <p className="mt-3 text-xs leading-6 text-zinc-400">
                Your newly submitted menu item will have{' '}
                <span className="font-bold text-orange-400">Pending</span>{' '}
                status. An administrator must approve it before customers can
                see it.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                <Upload className="size-4 text-orange-400" />
                Image Hosting
              </div>
              <p className="mt-2 text-[11px] leading-5 text-zinc-500">
                Your image will be uploaded to ImgBB when you submit the form.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  )
}
