import PageHeader from '@/components/dashboard/page-header'
import TransactionsTable from '@/components/dashboard/transactions-table'

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Every payment, refund and failure across the marketplace."
      />

      <TransactionsTable />
    </div>
  )
}
