import { headers } from 'next/headers'

import { auth } from './auth'
import { normalizeRole, type DashboardUser } from './roles'

export type { DashboardRole, DashboardUser } from './roles'
export { ROLE_HOME, ROLE_META, normalizeRole } from './roles'

export async function getCurrentUser(): Promise<DashboardUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: normalizeRole((user as { role?: unknown }).role),
  }
}
