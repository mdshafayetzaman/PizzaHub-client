import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { ROLE_HOME, getCurrentUser } from '@/lib/session'

export default function DashboardIndexPage() {
  return (
    <Suspense fallback={null}>
      <RedirectToRoleHome />
    </Suspense>
  )
}

async function RedirectToRoleHome(): Promise<never> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  redirect(ROLE_HOME[user.role])
}
