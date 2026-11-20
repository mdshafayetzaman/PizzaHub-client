'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'

import AuthToggle from './auth-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries())

    console.log(values)
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

        <Button
          type="submit"
          className="group h-12 w-full rounded-xl bg-orange-500 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
        >
          Sign in
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </Button>
      </form>

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
