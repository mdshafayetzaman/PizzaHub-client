'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Eye,
  EyeOff,
  ImageIcon,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Store,
  User,
} from 'lucide-react'

import AuthToggle from './auth-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/auth-client'

const roles = [
  { value: 'customer', label: 'Customer', icon: User },
  { value: 'vendor', label: 'Vendor', icon: Store },
  { value: 'admin', label: 'Admin', icon: ShieldCheck },
] as const

export default function SignUpForm() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    if (data.password !== data.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    const roleValue = String(data.role || 'customer')
    const role: 'customer' | 'vendor' | 'admin' =
      roleValue === 'vendor' || roleValue === 'admin' ? roleValue : 'customer'

    try {
      setLoading(true)

      const { error } = await signUp.email({
        name: String(data.name),
        email: String(data.email),
        password: String(data.password),
        role,
        image:
          typeof data.imageUrl === 'string' && data.imageUrl
            ? data.imageUrl
            : undefined,
        callbackURL: '/',
      })

      if (error) {
        setErrorMessage(error.message || 'Something went wrong.')
        return
      }

      router.replace('/')
      router.refresh()
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AuthToggle active="sign-up" />

      <div className="mt-8">
        <h1 className="text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          Create your account
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-400">
          Join PizzaHub for faster checkout, saved favourites and a little
          something extra on your first order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="sign-up-name" className="text-neutral-300">
            Full name
          </Label>

          <div className="relative">
            <User
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />

            <Input
              id="sign-up-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Alex Morgan"
              required
              className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20"
            />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-neutral-300">
            Account type
          </legend>

          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => {
              const Icon = role.icon

              return (
                <label key={role.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    defaultChecked={role.value === 'customer'}
                    required
                    className="peer sr-only"
                  />

                  <span className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-3 text-xs font-semibold text-neutral-400 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] peer-checked:border-orange-500/60 peer-checked:bg-orange-500/10 peer-checked:text-orange-400 peer-checked:shadow-lg peer-checked:shadow-orange-500/10 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500/40">
                    <Icon className="size-4" aria-hidden />
                    {role.label}
                  </span>
                </label>
              )
            })}
          </div>

          <p className="text-[11px] text-neutral-500">
            Choose how you&apos;ll use PizzaHub. You can update this later.
          </p>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="sign-up-image" className="text-neutral-300">
            Profile image URL{' '}
            <span className="text-xs font-normal text-neutral-500">
              (optional)
            </span>
          </Label>

          <div className="relative">
            <ImageIcon
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />

            <Input
              id="sign-up-image"
              name="imageUrl"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://example.com/avatar.jpg"
              className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20"
            />
          </div>

          <p className="text-[11px] text-neutral-500">
            Paste a link to a photo you want to use as your avatar.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign-up-email" className="text-neutral-300">
            Email address
          </Label>

          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />

            <Input
              id="sign-up-email"
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
          <Label htmlFor="sign-up-password" className="text-neutral-300">
            Password
          </Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />

            <Input
              id="sign-up-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              maxLength={128}
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

        <div className="space-y-2">
          <Label
            htmlFor="sign-up-confirm-password"
            className="text-neutral-300"
          >
            Confirm password
          </Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            />

            <Input
              id="sign-up-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Repeat your password"
              minLength={8}
              required
              className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 pr-12 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white/5 hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-neutral-400">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            className="mt-0.5 size-4 shrink-0 rounded border-white/20 bg-white/5 accent-orange-500"
          />
          I agree to the terms of service and privacy policy.
        </label>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="group h-12 w-full rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
        >
          {loading ? 'Creating account...' : 'Create account'}

          {!loading && (
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-semibold text-orange-400 transition hover:text-orange-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
