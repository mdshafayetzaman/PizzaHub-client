'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Crown, CreditCard, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast'
import { useSearchParams } from 'next/navigation'

import { LoadingBlock } from '@/components/dashboard/LoadingBlock'
import { StatusPill } from '@/components/dashboard/StatusPill'
import { getMySubscription, createCheckoutSession, type SubscriptionRecord } from '@/lib/api/subscriptions'
import { getErrorMessage } from '@/lib/api-client'

const FREE_FEATURES = ['Up to 3 active menu items', 'Basic order management', 'Standard dashboard access']
const PREMIUM_FEATURES = ['Unlimited menu items', 'Priority visibility', 'Full vendor dashboard features', 'Premium support']

export default function VendorSubscriptionPage() {
  const [sub, setSub] = useState<SubscriptionRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const params = useSearchParams()

  const load = async () => {
    try {
      setLoading(true)
      setSub(await getMySubscription())
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to load subscription.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  useEffect(() => {
    const payment = params.get('payment') || params.get('status')
    if (payment === 'success') toast.success('Payment successful! Your subscription has been upgraded.')
    if (payment === 'cancel' || payment === 'cancelled') toast.info('Payment was cancelled.')
  }, [params])

  const plan = String(sub?.plan || (sub?.isPremium ? 'premium' : 'free')).toLowerCase()
  const isPremium = plan === 'premium'

  const onUpgrade = async () => {
    try {
      setUpgrading(true)
      const res = await createCheckoutSession()
      const url = (res?.url || res?.checkoutUrl || res?.sessionUrl) as string | undefined
      if (!url) throw new Error('Checkout URL was not returned by the backend.')
      window.location.href = url
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to start Stripe checkout.'))
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Subscription <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Plan</span></h1>
        <p className="mt-2 text-sm text-zinc-400">Manage your vendor subscription and unlock premium features.</p>
      </div>

      {loading ? <LoadingBlock label="Loading subscription..." /> : (
        <>
          <div className="mb-6 rounded-3xl border border-white/10 bg-[#111114]/95 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Current Plan</p>
                <div className="mt-2 flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white capitalize">{plan}</h2>
                  <StatusPill status={sub?.status || sub?.subscriptionStatus || (isPremium ? 'active' : 'free')} />
                </div>
              </div>
              {!isPremium ? (
                <button onClick={onUpgrade} disabled={upgrading} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 text-sm font-bold text-white disabled:opacity-60">
                  {upgrading ? <Loader2 size={16} className="animate-spin" /> : <Crown size={16} />} {upgrading ? 'Redirecting...' : 'Upgrade to Premium'}
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"><Crown size={16} /> Premium Active</div>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className={`rounded-3xl border p-6 ${!isPremium ? 'border-orange-500/40 bg-orange-500/5' : 'border-white/10 bg-[#111114]/95'}`}>
              <div className="flex items-center gap-2 text-lg font-bold"><CreditCard size={20} className="text-zinc-400" /> Free</div>
              <p className="mt-2 text-sm text-zinc-400">For getting started.</p>
              <ul className="mt-5 space-y-3">
                {FREE_FEATURES.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-zinc-300"><CheckCircle2 size={16} className="mt-0.5 text-emerald-400 shrink-0" />{f}</li>)}
              </ul>
            </div>
            <div className={`rounded-3xl border p-6 ${isPremium ? 'border-orange-500/40 bg-orange-500/5' : 'border-white/10 bg-[#111114]/95'}`}>
              <div className="flex items-center gap-2 text-lg font-bold"><Crown size={20} className="text-orange-400" /> Premium</div>
              <p className="mt-2 text-sm text-zinc-400">For growing vendors.</p>
              <ul className="mt-5 space-y-3">
                {PREMIUM_FEATURES.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-zinc-300"><CheckCircle2 size={16} className="mt-0.5 text-emerald-400 shrink-0" />{f}</li>)}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
