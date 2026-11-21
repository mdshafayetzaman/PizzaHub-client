import Link from "next/link"
import {
  ArrowUpRight,
  Clock3,
  Flame,
  Mail,
  MapPin,
  Phone,
  Pizza,
  Star,
} from "lucide-react"

import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/shared/social-icons"
import { Button } from "@/components/ui/button"

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Browse menu", href: "/menu" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Your account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Create account", href: "/sign-up" },
      { label: "Profile settings", href: "/profile" },
    ],
  },
]

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "X", href: "https://x.com", icon: XIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YouTubeIcon },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0D0C0B] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-40 size-[30rem] rounded-full bg-orange-600/10 blur-[130px]" />
        <div className="absolute -left-40 bottom-0 size-[24rem] rounded-full bg-orange-500/[0.07] blur-[120px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none text-[20vw] font-black leading-none tracking-[-0.08em] text-white/[0.02]"
      >
        PIZZA
      </span>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* CTA */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-12 md:flex-row md:items-center md:justify-between lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-400">
              <Flame className="size-3.5" aria-hidden />
              Still hungry?
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              Let&apos;s get you a{" "}
              <span className="text-orange-500">slice.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/menu" />}
              className="group h-12 rounded-full bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/35"
            >
              Order now
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Button>

            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/sign-up" />}
              className="h-12 rounded-full border-white/15 bg-white/[0.03] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-white/[0.06] hover:text-white"
            >
              Join PizzaHub
            </Button>
          </div>
        </div>

        {/* Main footer */}
        <div className="grid grid-cols-2 gap-10 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="col-span-2 lg:col-span-5 lg:pr-12">
            <Link href="/" className="group flex w-fit items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20 transition duration-300 group-hover:rotate-12">
                <Pizza className="size-6" strokeWidth={2.3} aria-hidden />
              </span>
              <span>
                <span className="block text-2xl font-black tracking-tight">
                  Pizza<span className="text-orange-500">Hub.</span>
                </span>
                <span className="block text-[9px] font-semibold tracking-[3px] text-neutral-500">
                  THE ART OF GREAT PIZZA
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-400">
              Hand-tossed dough, slow-simmered sauce and a whole lot of love.
              Fired fresh in our stone oven and delivered while the cheese is
              still stretching.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-neutral-400">
              <Star
                className="size-3.5 fill-orange-400 text-orange-400"
                aria-hidden
              />
              <span className="font-bold text-white">4.9</span>
              <span className="text-neutral-600">·</span>
              2,400+ happy eaters
            </div>

            <div className="mt-7 flex items-center gap-2.5">
              {socials.map((social) => {
                const Icon = social.icon

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition duration-300 hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                  >
                    <Icon className="size-[18px]" aria-hidden />
                  </a>
                )
              })}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="col-span-1 lg:col-span-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 transition hover:text-orange-400 focus-visible:outline-none focus-visible:text-orange-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              Find us
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-neutral-400">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-orange-400"
                  aria-hidden
                />
                <span>
                  42 Crust Street,
                  <br />
                  Slice City, NY 10012
                </span>
              </li>
              <li>
                <a
                  href="tel:+15550101998"
                  className="flex items-center gap-3 transition hover:text-orange-400"
                >
                  <Phone className="size-4 shrink-0 text-orange-400" aria-hidden />
                  +1 (555) 010-1998
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@pizzahub.com"
                  className="flex items-center gap-3 transition hover:text-orange-400"
                >
                  <Mail className="size-4 shrink-0 text-orange-400" aria-hidden />
                  hello@pizzahub.com
                </a>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                <Clock3 className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold text-white">Open daily</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">
                  11:00 — 23:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © 2026 PizzaHub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
            <Link
              href="/sign-in"
              className="transition hover:text-orange-400"
            >
              Sign in
            </Link>
            <Link href="/sign-up" className="transition hover:text-orange-400">
              Create account
            </Link>
            <span className="inline-flex items-center gap-1.5">
              Made with
              <Pizza className="size-3.5 text-orange-500" aria-hidden />
              in Slice City
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
