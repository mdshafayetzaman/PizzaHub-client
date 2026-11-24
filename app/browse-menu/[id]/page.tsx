import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

import MenuItemDetails from '@/components/browse-menu/menu-item-details'
import { getMenuItem } from '@/lib/data'

type MenuDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function MenuDetailsPage({
  params,
}: MenuDetailsPageProps) {
  const { id } = await params
  const item = getMenuItem(id)

  if (!item) {
    notFound()
  }

  return (
    <main className="relative isolate overflow-hidden bg-[#11100F] text-white">
      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-24 size-[34rem] rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute -left-40 top-1/3 size-[30rem] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
        {/* Breadcrumb */}
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
