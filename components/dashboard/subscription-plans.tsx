'use client'

import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Plan = {
  name: string
  price: number
  tagline: string
  features: string[]
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: 29,
    tagline: 'For a single kitchen finding its feet.',
    features: ['1 store', 'Up to 40 menu items', 'Order notifications', 'Email support'],
  },
  {
    name: 'Growth',
    price: 79,
    tagline: 'For busy shops that need insights.',
    features: [
      '3 stores',
      'Unlimited menu items',
      'Sales analytics',
      'Promotions & coupons',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    price: 149,
    tagline: 'For groups and multi-site operators.',
    features: [
      'Unlimited stores',
      'Staff accounts',
      'API access',
      'Dedicated manager',
      'SLA & onboarding',
    ],
  },
]

export default function SubscriptionPlans() {
  const [selected, setSelected] = useState('Growth')

  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isSelected = selected === plan.name

          return (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border p-6 transition',
                isSelected
                  ? 'border-orange-500/50 bg-orange-500/[0.06] shadow-lg shadow-orange-500/5'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              )}
            >
              {isSelected && (
                <Badge
                  variant="orange"
                  className="absolute right-4 top-4 border-0"
                >
                  Current plan
                </Badge>
              )}

              <h3 className="text-lg font-black text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-neutral-500">{plan.tagline}</p>

              <p className="mt-5">
                <span className="text-3xl font-black text-white">
                  £{plan.price}
                </span>
                <span className="text-xs font-semibold text-neutral-500">
                  {' '}
                  / month
                </span>
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-neutral-300"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-emerald-400"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={isSelected ? 'outline' : 'default'}
                onClick={() => setSelected(plan.name)}
                className={cn(
                  'mt-6 h-10 rounded-xl text-sm font-bold',
                  isSelected &&
                    'border-white/15 bg-transparent text-white hover:bg-white/5'
                )}
              >
                {isSelected ? 'Current plan' : 'Choose plan'}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs leading-5 text-neutral-500">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-orange-400" aria-hidden />
        <p>
          Billing is a demo in this build. Choosing a plan updates your selection
          locally — connect it to Stripe or your billing provider to go live.
        </p>
      </div>
    </div>
  )
}
