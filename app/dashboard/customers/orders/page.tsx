import PageHeader from '@/components/dashboard/page-header'
import OrdersTable from '@/components/dashboard/orders-table'

export default function CustomerOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My orders"
        description="Every order you have placed, from the oven to your door."
      />

      <OrdersTable showCustomer={false} linkOrders={false} />
    </div>
  )
}
