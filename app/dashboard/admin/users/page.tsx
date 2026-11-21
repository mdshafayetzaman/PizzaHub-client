import PageHeader from '@/components/dashboard/page-header'
import UsersTable from '@/components/dashboard/users-table'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage users"
        description="Customers, vendors and admins on PizzaHub. Suspend accounts that break the rules."
      />

      <UsersTable editable />
    </div>
  )
}
