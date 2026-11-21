import PageHeader from '@/components/dashboard/page-header'
import Panel from '@/components/dashboard/panel'
import ProfileForm from '@/components/dashboard/profile-form'
import { getCurrentUser } from '@/lib/session'

export default async function VendorProfilePage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile settings"
        description="How your store and account appear across PizzaHub."
      />

      <div className="max-w-2xl">
        <Panel>
          <ProfileForm
            role="vendor"
            initialName={user?.name}
            initialEmail={user?.email}
            initialImage={user?.image ?? ''}
          />
        </Panel>
      </div>
    </div>
  )
}
