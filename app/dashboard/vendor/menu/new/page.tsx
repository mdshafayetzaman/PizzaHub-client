import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import MenuItemForm from '@/components/dashboard/menu-item-form'
import PageHeader from '@/components/dashboard/page-header'
import Panel from '@/components/dashboard/panel'

export default function VendorAddMenuItemPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/vendor/menu"
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 transition hover:text-orange-400"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to my menu
      </Link>

      <PageHeader
        title="Add menu item"
        description="Give your customers something new to fall in love with. Prices are shown in pounds."
      />

      <div className="max-w-3xl">
        <Panel>
          <MenuItemForm />
        </Panel>
      </div>
    </div>
  )
}
