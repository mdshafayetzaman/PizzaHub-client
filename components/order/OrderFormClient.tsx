'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'

import OrderForm from './OrderForm'
import { getMenuItemById, getMenuImage, getMenuName } from '@/lib/api/menu'
import { getMenuItem, type MenuItem } from '@/lib/data'

type OrderFormClientProps = {
  pizzaId: string
  user: { name: string; email: string }
}

function toMenuItem(
  record: Awaited<ReturnType<typeof getMenuItemById>>,
  id: string,
): MenuItem | null {
  if (!record || typeof record !== 'object') return null
  const name = getMenuName(record)
  const image = getMenuImage(record)
  const price = Number(record.price)
  if (!name || !image || Number.isNaN(price)) return null

  return {
    id: String(record._id || record.id || id),
    name,
    description: record.description || 'Delicious pizza made fresh to order.',
    price,
    category: (record.category as MenuItem['category']) || 'Classic',
    image,
    rating: 4.5,
    reviews: 0,
    toppings: [],
    calories: 0,
    prepTime: record.preparationTime || '15-20 min',
    isAvailable:
      String(record.status || record.approvalStatus || 'active').toLowerCase() !==
      'inactive',
  }
}

export default function OrderFormClient({ pizzaId, user }: OrderFormClientProps) {
  const [pizza, setPizza] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPizza = useCallback(async () => {
    try {
      const record = await getMenuItemById(pizzaId)
      const mapped = toMenuItem(record, pizzaId)
      if (mapped) {
        setPizza(mapped)
        setError('')
        return
      }
    } catch {
      // Fall back to local catalog data.
    }

    const local = getMenuItem(pizzaId)
    if (local) {
      setPizza(local)
      setError('')
      return
    }

    setPizza(null)
    setError('Pizza not found. It may have been removed or is unavailable.')
  }, [pizzaId])

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        await loadPizza()
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [loadPizza])

  const handleRetry = async () => {
    setLoading(true)
    setError('')
    await loadPizza()
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#1A1917]/90 p-8 text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-orange-500" />
        <p className="mt-4 text-sm text-neutral-400">Loading pizza details...</p>
      </div>
    )
  }

  if (error || !pizza) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <AlertCircle className="mx-auto size-10 text-red-400" />
        <h2 className="mt-4 text-lg font-bold text-white">Unable to load pizza</h2>
        <p className="mt-2 text-sm text-red-200/80">{error || 'Pizza not found.'}</p>
        <button
          type="button"
          onClick={() => void handleRetry()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      </div>
    )
  }

  return <OrderForm pizza={pizza} user={user} />
}
