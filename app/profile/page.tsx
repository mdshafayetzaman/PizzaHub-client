import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import PageHeader from '@/components/dashboard/page-header'
import ProfileForm from '@/components/dashboard/profile-form'
import { getCurrentUser } from '@/lib/session'

export const metadata = {
  title: 'Profile Settings — PizzaHub',
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100svh-5rem)] bg-[#11100F] px-5 py-12 text-white sm:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
            <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
          </div>
        </main>
      }
    >
      <ProfileGate />
    </Suspense>
  )
}

async function ProfileGate() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <main className="min-h-[calc(100svh-5rem)] bg-[#11100F] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Profile settings"
          description="Update how you appear across PizzaHub. Your email is used to sign in, so it stays fixed."
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <ProfileForm
            initialName={user.name}
            initialEmail={user.email}
            initialImage={user.image ?? ''}
          />
        </div>
      </div>
    </main>
  )
}
