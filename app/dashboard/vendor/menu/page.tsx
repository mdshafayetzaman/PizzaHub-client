import Link from 'next/link'
import { Plus } from 'lucide-react'

import MenuItemsTable from '@/components/dashboard/menu-items-table'
import PageHeader from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'

export default function VendorMenuPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My menu items"
        description="Everything currently firing in your kitchen. Add new slices or tidy up the classics."
        action={
          <Button
            render={<Link href="/dashboard/vendor/menu/new" />}
            className="h-10 gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
          >
            <Plus className="size-4" aria-hidden />
            Add menu item
          </Button>
        }
      />

      <MenuItemsTable editable editHref="/dashboard/vendor/menu/new" />
    </div>
  )
}
