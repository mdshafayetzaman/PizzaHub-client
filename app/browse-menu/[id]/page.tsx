import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

import MenuItemDetails from '@/components/browse-menu/menu-item-details'
import { getMenuItem, type MenuItem } from '@/lib/data'
import { getMenuItemById, getMenuImage, getMenuName } from '@/lib/api/menu'
import { getCurrentUser } from '@/lib/session'

type MenuDetailsPageProps = {
  params: Promise<{ id: string }>
}

function toMenuItem(record: Awaited<ReturnType<typeof getMenuItemById>>, id: string): MenuItem | null {
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
    isAvailable: String(record.status || record.approvalStatus || 'active').toLowerCase() !== 'inactive',
  }
}

async function resolveMenuItem(id: string): Promise<MenuItem | null> {
  const localItem = getMenuItem(id)
  if (localItem) return localItem

  try {
    const record = await getMenuItemById(id)
    return toMenuItem(record, id)
  } catch {
    return null
  }
}

export default async function MenuDetailsPage({
  params,
}: MenuDetailsPageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/browse-menu/${id}`)}`)
  }

  const item = await resolveMenuItem(id)

  if (!item) {
    notFound()
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#11100F] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-24 size-[34rem] rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -left-40 top-1/3 size-[30rem] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <li>
              <Link
                href="/browse-menu"
                className="text-neutral-400 transition hover:text-orange-500"
              >
                Browse menu
              </Link>
            </li>
            <li aria-hidden className="text-neutral-600">
              <ChevronRight className="size-4" />
            </li>
            <li className="text-white" aria-current="page">
              {item.name}
            </li>
          </ol>
        </nav>

        <MenuItemDetails item={item} />
      </div>
    </main>
  )
}
