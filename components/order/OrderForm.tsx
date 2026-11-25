'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  Mail,
} from 'lucide-react'

import { createOrder } from '@/lib/api/orders'
import { formatPrice, type MenuItem } from '@/lib/data'
import { getErrorMessage } from '@/lib/api-client'
import {
  EXTRA_TOPPINGS,
  PIZZA_SIZES,
  calculateOrderTotals,
  type PizzaSize,
} from '@/lib/order-pricing'

type OrderFormProps = {
  pizza: MenuItem
  user: {
    name: string
    email: string
  }
}

type FormState = {
  customerName: string
  customerEmail: string
  phone: string
  deliveryAddress: string
  city: string
  area: string
  quantity: number
  size: PizzaSize
  extraToppings: string[]
  specialInstructions: string
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10'

const labelClass = 'mb-2 block text-sm font-semibold text-neutral-200'

export default function OrderForm({ pizza, user }: OrderFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>({
    customerName: user.name || '',
    customerEmail: user.email || '',
    phone: '',
    deliveryAddress: '',
    city: '',
    area: '',
    quantity: 1,
    size: 'Medium',
    extraToppings: [],
    specialInstructions: '',
  })

  const totals = useMemo(
    () =>
      calculateOrderTotals({
        basePrice: pizza.price,
        size: form.size,
        quantity: form.quantity,
        extraToppings: form.extraToppings,
      }),
    [pizza.price, form.size, form.quantity, form.extraToppings],
  )

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleTopping = (topping: string) => {
    setForm((prev) => ({
      ...prev,
      extraToppings: prev.extraToppings.includes(topping)
        ? prev.extraToppings.filter((t) => t !== topping)
        : [...prev.extraToppings, topping],
    }))
  }

  const validate = () => {
    if (!form.customerName.trim()) return 'Customer name is required.'
    if (!form.customerEmail.trim()) return 'Email is required.'
    if (!form.phone.trim()) return 'Phone number is required.'
    if (!form.deliveryAddress.trim()) return 'Delivery address is required.'
    if (!form.city.trim()) return 'City is required.'
    if (!form.area.trim()) return 'Area is required.'
    if (!Number.isInteger(form.quantity) || form.quantity < 1 || form.quantity > 20) {
      return 'Quantity must be between 1 and 20.'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      setSubmitting(true)
      const result = await createOrder({
        menuItemId: pizza.id,
        pizzaName: pizza.name,
        pizzaImage: pizza.image,
        category: pizza.category,
        basePrice: pizza.price,
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        phone: form.phone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        city: form.city.trim(),
        area: form.area.trim(),
        quantity: form.quantity,
        size: form.size,
        extraToppings: form.extraToppings,
        specialInstructions: form.specialInstructions.trim(),
      })

      const orderId = String(result._id || result.id || '')
      toast.success('Order placed successfully!')
      router.push(orderId ? `/order/success?orderId=${encodeURIComponent(orderId)}` : '/order/success')
      router.refresh()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to place order. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-[#1A1917]/90 p-5 sm:p-7">
        <h2 className="text-xl font-bold text-white">Delivery Details</h2>
        <p className="mt-1 text-sm text-neutral-400">Fill in your information to place the order.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="customerName" className={labelClass}><span className="inline-flex items-center gap-2"><User className="size-4 text-orange-400" />Customer Name</span></label>
            <input id="customerName" value={form.customerName} onChange={(e) => setField('customerName', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="customerEmail" className={labelClass}><span className="inline-flex items-center gap-2"><Mail className="size-4 text-orange-400" />Email</span></label>
            <input id="customerEmail" type="email" value={form.customerEmail} onChange={(e) => setField('customerEmail', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}><span className="inline-flex items-center gap-2"><Phone className="size-4 text-orange-400" />Phone Number</span></label>
            <input id="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className={inputClass} placeholder="e.g. 01XXXXXXXXX" required />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}><span className="inline-flex items-center gap-2"><MapPin className="size-4 text-orange-400" />City</span></label>
            <input id="city" value={form.city} onChange={(e) => setField('city', e.target.value)} className={inputClass} placeholder="Your city" required />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="deliveryAddress" className={labelClass}>Delivery Address</label>
            <input id="deliveryAddress" value={form.deliveryAddress} onChange={(e) => setField('deliveryAddress', e.target.value)} className={inputClass} placeholder="Street address" required />
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>Area</label>
            <input id="area" value={form.area} onChange={(e) => setField('area', e.target.value)} className={inputClass} placeholder="Area / Neighborhood" required />
          </div>
          <div>
            <label htmlFor="quantity" className={labelClass}>Quantity</label>
            <input id="quantity" type="number" min={1} max={20} value={form.quantity} onChange={(e) => setField('quantity', Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className={inputClass} required />
          </div>
        </div>

        <div className="mt-6">
          <p className={labelClass}>Pizza Size</p>
          <div className="grid grid-cols-3 gap-3">
            {PIZZA_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setField('size', size)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  form.size === size
                    ? 'border-orange-500 bg-orange-500/15 text-orange-300'
                    : 'border-white/10 bg-white/[0.04] text-neutral-300 hover:border-orange-500/40'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className={labelClass}>Extra Toppings (+{formatPrice(1.5)} each)</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXTRA_TOPPINGS.map((topping) => {
              const checked = form.extraToppings.includes(topping)
              return (
                <label key={topping} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${checked ? 'border-orange-500/50 bg-orange-500/10 text-white' : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20'}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleTopping(topping)} className="size-4 accent-orange-500" />
                  {topping}
                </label>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="specialInstructions" className={labelClass}>Special Instructions</label>
          <textarea id="specialInstructions" value={form.specialInstructions} onChange={(e) => setField('specialInstructions', e.target.value)} className={`${inputClass} min-h-[110px] resize-y`} placeholder="Any special requests? (optional)" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>

      <aside className="h-fit rounded-3xl border border-white/10 bg-[#1A1917]/90 p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-white">Order Summary</h2>

        <div className="mt-4 flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={pizza.image} alt={pizza.name} fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white">{pizza.name}</p>
            <p className="text-xs text-neutral-400">{pizza.category}</p>
            <p className="mt-1 text-sm font-bold text-orange-400">{formatPrice(pizza.price)}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-neutral-400">{pizza.description}</p>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-neutral-300"><span>Size</span><span className="font-medium text-white">{form.size}</span></div>
          <div className="flex justify-between text-neutral-300"><span>Quantity</span><span className="font-medium text-white">{form.quantity}</span></div>
          <div className="flex justify-between text-neutral-300"><span>Unit price ({form.size})</span><span className="font-medium text-white">{formatPrice(totals.unitPrice)}</span></div>
          <div className="flex justify-between text-neutral-300"><span>Toppings</span><span className="font-medium text-white">{formatPrice(totals.toppingsTotal)}</span></div>
          <div className="flex justify-between text-neutral-300"><span>Subtotal</span><span className="font-medium text-white">{formatPrice(totals.subtotal)}</span></div>
          <div className="flex justify-between text-neutral-300"><span>Delivery charge</span><span className="font-medium text-white">{formatPrice(totals.deliveryCharge)}</span></div>
          <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold text-white">
            <span>Total</span>
            <span className="text-orange-400">{formatPrice(totals.total)}</span>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-xs text-orange-200">
          <p className="inline-flex items-center gap-2 font-semibold"><ShoppingBag className="size-4" /> Payment status: Unpaid</p>
          <p className="mt-1 text-orange-100/80">Order will be placed as Pending after confirmation.</p>
        </div>
      </aside>
    </div>
  )
}
