import PageHeader from '@/components/dashboard/page-header'
import Panel from '@/components/dashboard/panel'
import ProfileForm from '@/components/dashboard/profile-form'
import { getCurrentUser } from '@/lib/session'

export default async function AdminProfilePage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile settings"
        description="Your admin account details and how you appear to the team."
      />

      <div className="max-w-2xl">
        <Panel>
          <ProfileForm
            role="admin"
            initialName={user?.name}
            initialEmail={user?.email}
            initialImage={user?.image ?? ''}
          />
        </Panel>
      </div>
    </div>
  )
}
