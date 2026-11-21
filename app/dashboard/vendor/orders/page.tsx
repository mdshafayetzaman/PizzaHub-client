import OrdersTable from '@/components/dashboard/orders-table'
import PageHeader from '@/components/dashboard/page-header'

export default function VendorOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer orders"
        description="Accept, prepare and deliver every order. Use the actions to move an order along."
      />

      <OrdersTable editable />
    </div>
  )
}
