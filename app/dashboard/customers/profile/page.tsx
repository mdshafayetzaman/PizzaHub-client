import PageHeader from '@/components/dashboard/page-header'
import Panel from '@/components/dashboard/panel'
import ProfileForm from '@/components/dashboard/profile-form'
import { getCurrentUser } from '@/lib/session'

export default async function CustomerProfilePage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile settings"
        description="Update your name, photo and how you appear on PizzaHub."
      />

      <div className="max-w-2xl">
        <Panel>
          <ProfileForm
            role="customer"
            initialName={user?.name}
            initialEmail={user?.email}
            initialImage={user?.image ?? ''}
          />
        </Panel>
      </div>
    </div>
  )
}
