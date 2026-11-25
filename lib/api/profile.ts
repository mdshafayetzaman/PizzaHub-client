import { authClient } from '@/lib/auth-client'
import { apiFetch } from '@/lib/api-client'

export type ProfilePayload = {
  name?: string
  image?: string
}

export async function updateProfile(payload: ProfilePayload) {
  // Update through Better Auth so session reflects changes immediately.
  const result = await authClient.updateUser({
    name: payload.name,
    image: payload.image,
  })

  if (result?.error) {
    throw new Error(result.error.message || 'Failed to update profile')
  }

  // Best-effort sync with backend profile endpoint if present.
  try {
    await apiFetch('/users/profile', { method: 'PATCH', auth: true, json: payload })
  } catch {
    // Backend profile sync is optional; Better Auth update is the source of truth.
  }

  return result?.data
}
