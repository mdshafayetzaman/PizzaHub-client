'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { toast } from 'react-toastify'

import AuthToggle from './auth-toggle'
import { authClient, signIn } from '@/lib/auth-client'
import { ROLE_HOME, normalizeRole } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SignInFormProps = {
  callbackUrl?: string
}

function getSafeCallbackUrl(callbackUrl?: string) {
  if (!callbackUrl) return '/'
  if (!callbackUrl.startsWith('/') || callbackUrl.startsWith('//')) return '/'
  return callbackUrl
}

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter()
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl)

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const hasExplicitCallback = !!callbackUrl && safeCallbackUrl !== '/'

  const resolvePostAuthRedirect = async () => {
    if (hasExplicitCallback) return safeCallbackUrl
    const session = await authClient.getSession()
    const role = normalizeRole((session?.data?.user as { role?: unknown } | undefined)?.role)
    return ROLE_HOME[role]
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage('')
    setSocialLoading(true)
    try {
      const { error } = await signIn.social({
        provider: 'google',
        callbackURL: hasExplicitCallback ? safeCallbackUrl : '/profile',
        errorCallbackURL: '/sign-in',
      })
      if (error) {
        const message = error.message || 'Google sign-in failed.'
        setErrorMessage(message)
        toast.error(message)
        setSocialLoading(false)
      }
    } catch {
      const message = 'Google sign-in failed. Please try again.'
      setErrorMessage(message)
      toast.error(message)
      setSocialLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsLoading(true)
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const rememberMe = formData.get('rememberMe') === 'on'

    try {
      const { error } = await signIn.email({
        email,
        password,
        rememberMe,
      })

      if (error) {
        const message = error.message || 'Invalid email or password'
        setErrorMessage(message)
        toast.error(message)
        return
      }

      const target = await resolvePostAuthRedirect()
      router.push(target)
      router.refresh()
    } catch {
      const message = 'Something went wrong. Please try again.'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <AuthToggle active="sign-in" />

      <div className="mt-8">
        <h1 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Welcome back
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Sign in to reorder your favourites, track deliveries and pick up where
          you left off.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="sign-in-email" className="text-neutral-300">
            Email address
          </Label>

          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />

            <Input
              id="sign-in-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-in-password" className="text-neutral-300">
            Password
          </Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />

            <Input
              id="sign-in-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 pr-12 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white/5 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-400">
            <input
              type="checkbox"
              name="rememberMe"
              className="size-4 rounded border-white/20 bg-white/5 accent-orange-500"
            />
            Keep me signed in
          </label>

          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-orange-400 transition hover:text-orange-300"
          >
            Forgot password?
          </Link>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading || socialLoading}
          className="group h-12 w-full rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}

          {!isLoading && (
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isLoading || socialLoading}
        onClick={handleGoogleSignIn}
        className="h-12 w-full rounded-xl border-white/10 bg-white/[0.04] text-sm font-semibold text-white hover:bg-white/[0.08] hover:text-white"
      >
        <svg aria-hidden className="size-4" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.8-1.6 2.8-4 2.8-6.8 0-.7-.1-1.3-.2-1.9H12z"/>
          <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.6-2.5l-3-2.3c-.8.6-1.9 1-3.6 1-2.8 0-5.1-1.9-6-4.4H2.9v2.4C4.5 19.8 8 22 12 22z"/>
          <path fill="#4A90E2" d="M6 13.8c-.2-.6-.4-1.2-.4-1.8s.1-1.2.4-1.8V7.8H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.2l3-2.4z"/>
          <path fill="#FBBC05" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3.2 14.7 2 12 2 8 2 4.5 4.2 2.9 7.8l3.1 2.4c.9-2.5 3.2-4.1 6-4.1z"/>
        </svg>
        {socialLoading ? 'Connecting to Google...' : 'Continue with Google'}
      </Button>

      <p className="mt-8 text-center text-sm text-neutral-500">
        New to PizzaHub?{' '}
        <Link
          href="/sign-up"
          className="font-semibold text-orange-400 transition hover:text-orange-300"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
