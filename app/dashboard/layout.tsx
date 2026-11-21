import { Suspense, type ReactNode } from 'react'
import { redirect } from 'next/navigation'

import DashboardShell from './dashboardlayout'
import { getCurrentUser } from '@/lib/session'

/**
 * Every `/dashboard/*` route is wrapped by this guard. The session read is a
 * request-time API, so it sits behind a `<Suspense>` boundary (required while
 * Cache Components is enabled) and streams in behind the fallback below.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardGate>{children}</DashboardGate>
    </Suspense>
  )
}

async function DashboardGate({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()

  if (!user) redirect('/sign-in')

  return <DashboardShell user={user}>{children}</DashboardShell>
}

function DashboardFallback() {
  return (
    <div className="flex min-h-svh bg-[#11100F] text-neutral-100">
      <div className="hidden w-64 shrink-0 flex-col gap-4 border-r border-white/10 bg-[#14110F] p-4 md:flex">
        <div className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-xl bg-orange-500/30" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-2 w-16 animate-pulse rounded bg-white/5" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-2 w-20 animate-pulse rounded bg-white/5" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-full animate-pulse rounded-md bg-white/5"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-white/10 px-6">
          <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
        </div>

        <div className="flex-1 space-y-4 p-6">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
          <div className="h-3 w-80 animate-pulse rounded bg-white/5" />
          <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
