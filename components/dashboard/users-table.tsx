import { Badge } from '@/components/ui/badge'
import {
  DataTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@/components/dashboard/data-table'
import StatusPill from '@/components/dashboard/status-pill'
import { UserRowActions } from '@/components/dashboard/row-actions'
import { formatDate, type ManagedUser } from '@/lib/data'

const ROLE_VARIANTS = {
  admin: 'orange',
  vendor: 'violet',
  customer: 'emerald',
} as const

type UsersTableProps = {
  users?: ManagedUser[]
  editable?: boolean
}

export default function UsersTable({
  users,
  editable = false,
}: UsersTableProps) {
  const rows = users ?? []
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center text-sm text-neutral-500">
        No users found. Try adjusting your filters.
      </div>
    )
  }

  return (
    <DataTable>
      <Thead>
        <Tr>
          <Th>User</Th>
          <Th>Role</Th>
          <Th>Joined</Th>
          <Th>Orders</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>

      <Tbody>
        {rows.map((user) => (
          <Tr key={user.id}>
            <Td>
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/30 to-orange-700/20 text-xs font-black uppercase text-orange-300 ring-1 ring-orange-500/20">
                  {user.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{user.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </Td>
            <Td>
              <Badge variant={ROLE_VARIANTS[user.role]}>{user.role}</Badge>
            </Td>
            <Td className="text-xs text-neutral-400">
              {formatDate(`${user.joined}T12:00:00Z`)}
            </Td>
            <Td className="font-semibold text-white">{user.orders}</Td>
            <Td>
              {editable ? (
                <UserRowActions initialStatus={user.status} />
              ) : (
                <StatusPill value={user.status} />
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </DataTable>
  )
}
