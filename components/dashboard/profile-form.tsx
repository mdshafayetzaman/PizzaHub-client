'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient, useSession } from '@/lib/auth-client'
import type { DashboardRole } from '@/lib/roles'

const fieldClass =
  'h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-neutral-600 focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20'

type ProfileFormProps = {
  role?: DashboardRole
  initialName?: string
  initialEmail?: string
  initialImage?: string
}

export default function ProfileForm({
  role,
  initialName,
  initialEmail,
  initialImage,
}: ProfileFormProps) {
  const { data: session } = useSession()
  const user = session?.user

  const [name, setName] = useState(initialName ?? user?.name ?? '')
  const [image, setImage] = useState(initialImage ?? user?.image ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  )

  const email = initialEmail ?? user?.email ?? ''
  const avatarSrc = image || user?.image || ''

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('saving')

    const { error } = await authClient.updateUser({
      name,
      image: image || null,
    })

    setStatus(error ? 'error' : 'saved')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4">
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt={name || 'Profile'}
            className="size-14 rounded-2xl object-cover ring-1 ring-white/10"
          />
        ) : (
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-700/20 text-lg font-black uppercase text-orange-300 ring-1 ring-orange-500/20">
            {name?.slice(0, 1) ?? 'P'}
          </span>
        )}

        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-xs text-neutral-500">
            {role ? `${role} account` : 'PizzaHub account'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="profile-name"
          className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500"
        >
          Full name
        </Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="profile-email"
          className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500"
        >
          Email address
        </Label>
        <Input
          id="profile-email"
          value={email}
          disabled
          className={`${fieldClass} cursor-not-allowed opacity-60`}
        />
        <p className="text-[11px] text-neutral-600">
          Email changes are handled separately for security.
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="profile-image"
          className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500"
        >
          Profile image URL
        </Label>
        <Input
          id="profile-image"
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className={fieldClass}
        />
      </div>

      {status === 'saved' && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-200">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          Profile updated.
        </div>
      )}

      {status === 'error' && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm font-semibold text-red-300">
          We could not save your profile. Please try again.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'saving'}
        className="h-11 rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
      >
        {status === 'saving' ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Saving…
          </span>
        ) : (
          'Save changes'
        )}
      </Button>
    </form>
  )
}
