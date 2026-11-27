import { redirect } from 'next/navigation'

import { ROLE_HOME } from '@/lib/roles'
import { getCurrentUser } from '@/lib/session'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in?callbackUrl=%2Fprofile')
  }

  if (user.role === 'customer') {
    redirect('/dashboard/customers/profile')
  }

  redirect(ROLE_HOME[user.role])
}
