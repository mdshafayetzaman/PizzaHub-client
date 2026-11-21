import {
  DataTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@/components/dashboard/data-table'
import StatusPill from '@/components/dashboard/status-pill'
import { formatDate, formatPrice, type Transaction } from '@/lib/data'

const METHOD_LABELS: Record<Transaction['method'], string> = {
  card: 'Card',
  cash: 'Cash',
  wallet: 'Wallet',
}

type TransactionsTableProps = {
  transactions?: Transaction[]
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  const rows = transactions ?? []
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center text-sm text-neutral-500">
        No transactions yet. Payments will appear here once orders are placed.
      </div>
    )
  }

  return (
    <DataTable>
      <Thead>
        <Tr>
          <Th>Transaction</Th>
          <Th>Order</Th>
          <Th>Customer</Th>
          <Th>Method</Th>
          <Th>Amount</Th>
          <Th>Status</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>

      <Tbody>
        {rows.map((transaction) => (
          <Tr key={transaction.id}>
            <Td className="font-bold text-white">{transaction.id}</Td>
            <Td className="text-neutral-400">{transaction.orderId}</Td>
            <Td className="font-semibold text-white">
              {transaction.customer}
            </Td>
            <Td className="text-neutral-400">
              {METHOD_LABELS[transaction.method]}
            </Td>
            <Td className="font-bold text-white">
              {formatPrice(transaction.amount)}
            </Td>
            <Td>
              <StatusPill value={transaction.status} />
            </Td>
            <Td className="text-xs text-neutral-400">
              {formatDate(transaction.date)}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </DataTable>
  )
}
