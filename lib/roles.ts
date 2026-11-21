export type DashboardRole = 'admin' | 'vendor' | 'customer'

export type DashboardUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: DashboardRole
}

const ROLES: readonly DashboardRole[] = ['admin', 'vendor', 'customer']

/** Where each role lands after signing in / visiting `/dashboard`. */
export const ROLE_HOME: Record<DashboardRole, string> = {
  admin: '/dashboard/admin',
  vendor: '/dashboard/vendor',
  customer: '/dashboard/customers',
}

/** Display metadata for each of the three PizzaHub roles. */
export const ROLE_META: Record<
  DashboardRole,
  { label: string; hint: string; badgeClass: string }
> = {
  admin: {
    label: 'Admin',
    hint: 'Full access',
    badgeClass: 'bg-orange-500/15 text-orange-400 ring-orange-500/30',
  },
  vendor: {
    label: 'Vendor',
    hint: 'Store owner',
    badgeClass: 'bg-violet-500/15 text-violet-400 ring-violet-500/30',
  },
  customer: {
    label: 'Customer',
    hint: 'Food lover',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  },
}

/** Falls back to `customer` when the stored role is missing or unknown. */
export function normalizeRole(value: unknown): DashboardRole {
  return ROLES.includes(value as DashboardRole)
    ? (value as DashboardRole)
    : 'customer'
}
