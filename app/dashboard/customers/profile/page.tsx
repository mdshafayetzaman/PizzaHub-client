'use client'

import { useEffect, useState } from 'react'
import { Save, Upload, User } from 'lucide-react'
import { toast } from '@/lib/toast'

import { useSession } from '@/lib/auth-client'
import { updateProfile } from '@/lib/api/profile'
import { uploadImageToImgBB } from '@/lib/api/upload'
import { getErrorMessage } from '@/lib/api-client'

export default function CustomerProfilePage() {
  const { data: session, isPending, refetch } = useSession()
  const user = session?.user as any
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setImage(user.image || '')
    }
  }, [user?.name, user?.image])

  const onUpload = async (file?: File) => {
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImageToImgBB(file)
      setImage(url)
      toast.success('Image uploaded. Click Save Changes to update your profile.')
    } catch (e) {
      toast.error(getErrorMessage(e, 'Image upload failed.'))
    } finally {
      setUploading(false)
    }
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name is required.')
      return
    }
    try {
      setSaving(true)
      await updateProfile({ name: name.trim(), image: image.trim() || undefined })
      await refetch?.()
      toast.success('Profile updated successfully.')
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to update profile.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Profile <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">Settings</span></h1>
        <p className="mt-2 text-sm text-zinc-400">Manage your personal information.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111114]/95 p-6 sm:p-8">
        {isPending ? (
          <div className="py-12 text-center text-zinc-400">Loading profile...</div>
        ) : !user ? (
          <div className="py-12 text-center text-zinc-400">Unable to load user session.</div>
        ) : (
          <form onSubmit={onSave} className="space-y-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                {image ? <img src={image} alt="Profile" className="h-full w-full object-cover" /> : <User size={36} className="text-zinc-500" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user.email}</p>
                <p className="mt-1 text-xs text-zinc-500">Role: {String(user.role || 'customer')}</p>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/10">
                  <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void onUpload(e.target.files?.[0])} />
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-200">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none focus:border-red-500" placeholder="Your name" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-200">Profile Image URL</label>
              <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none focus:border-red-500" placeholder="https://..." />
              <p className="mt-2 text-xs text-zinc-500">Upload an image to ImgBB or paste an image URL.</p>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving || uploading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 text-sm font-bold text-white disabled:opacity-60">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
