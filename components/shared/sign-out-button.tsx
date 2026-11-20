'use client'

import { useState, type ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'

import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SignOutButtonProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  /** Button text. Defaults to "Sign Out". */
  label?: string
  /** Hide the label and only show the icon (useful for compact headers). */
  iconOnly?: boolean
  /** Where to send the user after signing out. Pass `null` to stay put. */
  redirectTo?: string | null
  /** Called after the session has been cleared successfully. */
  onSignedOut?: () => void
}

export default function SignOutButton({
  label = 'Sign Out',
  iconOnly = false,
  redirectTo = '/',
  onSignedOut,
  className,
  variant = 'outline',
  disabled,
  ...props
}: SignOutButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [isPending, setIsPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSignOut = async () => {
    if (isPending) return

    setIsPending(true)
    setErrorMessage(null)

    try {
      const { error } = await signOut()

      if (error) {
        setErrorMessage(
          error.message || 'We could not sign you out. Please try again.'
        )
        return
      }

      onSignedOut?.()

      if (redirectTo && pathname !== redirectTo) {
        router.push(redirectTo)
      }

      // Re-render server components so the navbar/account state is fresh.
      router.refresh()
    } catch {
      setErrorMessage(
        'We could not sign you out. Check your connection and try again.'
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <Button
        {...props}
        variant={variant}
        onClick={handleSignOut}
        disabled={disabled || isPending}
        aria-busy={isPending}
        aria-label={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        className={cn('relative', className)}
      >
        {isPending ? (
          <Loader2 className="animate-spin" aria-hidden />
        ) : (
          <LogOut aria-hidden />
        )}
        {iconOnly ? (
          <span className="sr-only">{isPending ? 'Signing out…' : label}</span>
        ) : (
          <span className={cn(isPending && 'opacity-80')}>
            {isPending ? 'Signing out…' : label}
          </span>
        )}
      </Button>

      {errorMessage &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="alert"
            aria-live="assertive"
            className="fixed bottom-6 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-red-500/30 bg-[#1A1211] px-4 py-3 text-sm text-red-200 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xs font-bold text-red-400">
                !
              </span>
              <p className="flex-1 leading-5">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-red-300/70 transition hover:text-red-200"
              >
                Dismiss
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
