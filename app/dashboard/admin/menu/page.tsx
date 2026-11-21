import PageHeader from '@/components/dashboard/page-header'
import MenuItemsTable from '@/components/dashboard/menu-items-table'

export default function AdminMenuPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage menu items"
        description="The full catalogue across every vendor. Review, edit or remove items as needed."
      />

      <MenuItemsTable editable editHref="/dashboard/admin/menu" />
    </div>
  )
}
