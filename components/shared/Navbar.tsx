'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pizza, ShoppingBag, Menu, X, ArrowUpRight, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SignOutButton from '@/components/shared/sign-out-button'
import { useSession } from '@/lib/auth-client'

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, isPending } = useSession()

  const user = session?.user
  const dashboardHref =
    user?.role === 'vendor'
      ? '/dashboard/vendor/menu'
      : user?.role === 'customer'
        ? '/dashboard/customers'
        : user?.role === 'admin'
          ? '/dashboard/admin'
          : '/dashboard'

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse menu', href: '/browse-menu' },
    ...(user ? [{ name: 'Dashboard', href: dashboardHref }] : []),
  ]

  const handleOrder = () => {
    setIsOpen(false)

    // Not authenticated → send the user to the sign-in page.
    if (!user) {
      router.push('/sign-in')
      return
    }

    // Authenticated → continue to the ordering/menu page.
    router.push('/menu')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/70 bg-[#11100F]/95 text-white backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20 transition duration-300 group-hover:rotate-12">
              <Pizza size={27} strokeWidth={2.3} />
            </div>

            <div>
              <h1 className="text-[26px] font-black tracking-tight">
                Pizza<span className="text-orange-500">Hub.</span>
              </h1>
              <p className="text-[9px] font-semibold tracking-[3px] text-neutral-500">
                THE ART OF GREAT PIZZA
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`group relative py-2 text-[14px] font-semibold transition-colors ${
                  link.name === 'Home'
                    ? 'text-orange-500'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-800 transition hover:border-orange-500 hover:bg-orange-500/10"
            >
              <ShoppingBag
                size={20}
                className="text-neutral-300 transition group-hover:text-orange-500"
              />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                0
              </span>
            </Link>

            {isPending ? (
              <div
                aria-hidden
                className="h-11 w-40 animate-pulse rounded-full bg-neutral-800/60"
              />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full border border-neutral-800 px-3 py-2 transition hover:border-orange-500"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                      <User size={18} />
                    </div>
                  )}

                  <span className="max-w-28 truncate text-sm font-semibold text-white">
                    {user.name}
                  </span>
                </Link>

                <SignOutButton
                  variant="outline"
                  className="h-11 gap-2 rounded-full border-neutral-700 bg-transparent px-4 text-neutral-300 hover:border-orange-500 hover:bg-orange-500/10 hover:text-orange-500"
                />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-neutral-300 transition hover:text-orange-500"
              >
                Sign In
              </Link>
            )}

            <Button
              onClick={handleOrder}
              disabled={isPending}
              className="h-12 rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              <span className="flex items-center">
                Order Now
                <ArrowUpRight size={17} className="ml-2" />
              </span>
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-800 transition hover:border-orange-500 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-neutral-800 py-6 lg:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-neutral-300 transition hover:bg-orange-500/10 hover:text-orange-500"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-5 flex items-center gap-3">
              {isPending ? (
                <div
                  aria-hidden
                  className="h-14 w-full animate-pulse rounded-xl bg-neutral-800/60"
                />
              ) : user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-1 items-center gap-3 rounded-xl border border-neutral-800 p-3"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                        <User size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-500">View Profile</p>
                    </div>
                  </Link>

                  <SignOutButton
                    iconOnly
                    variant="outline"
                    className="h-12 w-12 shrink-0 rounded-xl border-neutral-700 bg-transparent text-white hover:border-orange-500 hover:bg-neutral-800"
                    onSignedOut={() => setIsOpen(false)}
                  />
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-xl border-neutral-700 bg-transparent text-white hover:bg-neutral-800"
                  >
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>

                  <Button
                    onClick={handleOrder}
                    className="h-12 flex-1 rounded-xl bg-orange-500 font-bold text-white hover:bg-orange-600"
                  >
                    <span className="flex items-center">
                      Order Now
                      <ArrowUpRight size={17} className="ml-1 inline" />
                    </span>
                  </Button>
                </>
              )}
            </div>

            {!isPending && user && (
              <Button
                onClick={handleOrder}
                className="mt-3 h-12 w-full rounded-xl bg-orange-500 font-bold text-white hover:bg-orange-600"
              >
                <span className="flex items-center">
                  Order Now
                  <ArrowUpRight size={17} className="ml-1 inline" />
                </span>
              </Button>
            )}

            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="mt-5 flex items-center gap-3 rounded-xl border border-neutral-800 p-4 text-sm font-medium text-neutral-300"
            >
              <ShoppingBag size={20} />
              Shopping Cart
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
