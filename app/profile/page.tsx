import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { ROLE_HOME } from '@/lib/roles'
import { getCurrentUser } from '@/lib/session'

async function ProfileRedirect() {
  let user: Awaited<ReturnType<typeof getCurrentUser>> = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('[profile] Failed to resolve current user', error)
  }

  if (!user) {
    redirect('/sign-in?callbackUrl=%2Fprofile')
  }

  if (user.role === 'customer') {
    redirect('/dashboard/customers/profile')
  }

  redirect(ROLE_HOME[user.role])
  return null
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileRedirect />
    </Suspense>
  )
}
