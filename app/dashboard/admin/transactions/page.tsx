'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Receipt } from 'lucide-react'
import { toast } from 'react-toastify'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { getTransactions, getTransactionId, type TransactionRecord } from '@/lib/api/transactions'
import { getErrorMessage } from '@/lib/api-client'

function fmtDate(v?: string) {
  if (!v) return 'N/A'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString()
}

export default function AdminTransactionsPage() {
  const [items, setItems] = useState<TransactionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setItems(await getTransactions())
      } catch (e) {
        toast.error(getErrorMessage(e, 'Failed to load transactions.'))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((t) => {
      const s = String(t.paymentStatus || t.status || '').toLowerCase()
      const matchStatus = status === 'all' || s === status
      const hay = [t.vendorName, t.vendorEmail, t.plan, t.subscriptionPlan, t.transactionId, t.paymentIntentId, s].filter(Boolean).join(' ').toLowerCase()
      return matchStatus && (!q || hay.includes(q))
    })
  }, [items, query, status])

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Transactions <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">History</span></h1>
        <p className="mt-2 text-sm text-zinc-400">View payment and subscription transaction records. Records are read-only.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vendor, plan, tx id..." className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-red-500" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500">
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {loading ? <LoadingBlock label="Loading transactions..." /> : filtered.length === 0 ? (
          <EmptyState icon={Receipt} title="No transactions found" description="Transaction records will appear here." />
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-white/10 text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="px-3 py-3">Vendor</th>
                  <th className="px-3 py-3">Plan</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Transaction ID</th>
                  <th className="px-3 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filtered.map((t) => (
                  <tr key={getTransactionId(t)} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-4">
                      <p className="font-semibold text-white">{t.vendorName || 'N/A'}</p>
                      <p className="text-xs text-zinc-500">{t.vendorEmail || ''}</p>
                    </td>
                    <td className="px-3 py-4 text-sm text-zinc-300 capitalize">{String(t.plan || t.subscriptionPlan || 'N/A')}</td>
                    <td className="px-3 py-4 text-sm text-zinc-300">${Number(t.amount ?? t.price ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-4"><StatusPill status={String(t.paymentStatus || t.status || 'unknown')} /></td>
                    <td className="px-3 py-4 text-xs text-zinc-400 font-mono">{String(t.transactionId || t.paymentIntentId || getTransactionId(t) || 'N/A')}</td>
                    <td className="px-3 py-4 text-sm text-zinc-400">{fmtDate(t.date || t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
