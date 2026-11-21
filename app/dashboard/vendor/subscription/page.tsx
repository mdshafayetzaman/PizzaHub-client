import PageHeader from '@/components/dashboard/page-header'
import SubscriptionPlans from '@/components/dashboard/subscription-plans'

export default function VendorSubscriptionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription"
        description="Pick the plan that fits your kitchen. Upgrade, downgrade or cancel any time."
      />

      <SubscriptionPlans />
    </div>
  )
}
