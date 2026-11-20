import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

import type { auth } from './auth'

export const authClient = createAuthClient({
  /**
   * The base URL of the auth server. Defaults to the current origin
   * (`/api/auth`) so sign-in/sign-out work on any domain or port.
   */
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || undefined,
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient
