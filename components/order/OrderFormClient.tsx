'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'

import OrderForm from './OrderForm'
import { getMenuItemById, getMenuItems, getMenuImage, getMenuName } from '@/lib/api/menu'
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

  const resolvedId = String(record._id || record.id || id)
  const hasRealId = /^[a-fA-F0-9]{24}$/.test(String(record._id || record.id || ''))

  return {
    id: resolvedId,
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
    isDemo: Boolean((record as { isDemo?: unknown }).isDemo) && !hasRealId,
  }
}

export default function OrderFormClient({ pizzaId, user }: OrderFormClientProps) {
  const [pizza, setPizza] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLocalOnly, setIsLocalOnly] = useState(false)

  const loadPizza = useCallback(async () => {
    try {
      const record = await getMenuItemById(pizzaId)
      const mapped = toMenuItem(record, pizzaId)
      if (mapped) {
        setPizza(mapped)
        setIsLocalOnly(false)
        setError('')
        return
      }
    } catch {
      // Continue to DB/local resolution fallback.
    }

    const local = getMenuItem(pizzaId)

    // If the route ID is a local/demo ID, try to resolve the real DB menu item
    // by matching against live menu items so order submission uses a valid _id.
    try {
      const allItems = await getMenuItems()
      const dbMatch = Array.isArray(allItems)
        ? allItems.find((record) => {
            const recordId = String(record._id || record.id || '')
            if (recordId && recordId === pizzaId) return true
            if (!local) return false
            const recordName = getMenuName(record).trim().toLowerCase()
            return recordName && recordName === local.name.trim().toLowerCase()
          })
        : undefined

      if (dbMatch) {
        const mappedDb = toMenuItem(dbMatch, pizzaId)
        if (mappedDb) {
          setPizza(mappedDb)
          setIsLocalOnly(false)
          setError('')
          return
        }
      }
    } catch {
      // Ignore DB lookup failure; fall back below.
    }

    if (local) {
      // Last attempt: resolve by name from DB so seeded demo items get real ObjectIds.
      try {
        const allItems = await getMenuItems()
        const byName = Array.isArray(allItems)
          ? allItems.find((record) => getMenuName(record).trim().toLowerCase() === local.name.trim().toLowerCase())
          : undefined
        if (byName) {
          const mappedDb = toMenuItem(byName, pizzaId)
          if (mappedDb) {
            setPizza(mappedDb)
            setIsLocalOnly(false)
            setError('')
            return
          }
        }
      } catch {
        // ignore
      }
      setPizza(null)
      setIsLocalOnly(false)
      setError('This menu item is not available right now. Please refresh the page and try again.')
      return
    }

    setPizza(null)
    setIsLocalOnly(false)
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

  return <OrderForm pizza={pizza} user={user} isLocalOnly={isLocalOnly} />
}
