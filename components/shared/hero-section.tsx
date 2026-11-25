import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Flame,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  { value: "30 min", label: "average delivery" },
  { value: "50+", label: "house recipes" },
  { value: "100%", label: "fresh ingredients" },
];

const reviews = [
  { initials: "AR", className: "from-orange-400 to-rose-500" },
  { initials: "JM", className: "from-amber-300 to-orange-500" },
  { initials: "SK", className: "from-emerald-400 to-teal-600" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[#11100F] text-white"
    >
      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-48 top-0 size-[34rem] rounded-full bg-orange-500/10 blur-[130px]" />
        <div className="absolute -right-40 top-1/4 size-[40rem] rounded-full bg-orange-600/20 blur-[150px]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:py-20 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-400">
            <Flame className="size-3.5" aria-hidden />
            Wood-fired since &apos;98
          </div>

          <h1
            id="hero-heading"
            className="mt-6 text-[3.25rem] font-black leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-[4.75rem]"
          >
            Hot from the
            <br />
            <span className="relative inline-block text-orange-500">
              stone oven.
              <svg
                aria-hidden
                viewBox="0 0 300 18"
                className="absolute -bottom-2 left-0 h-3 w-full text-orange-500/70"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 13C64 4 142 3 297 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            Hand-tossed dough, slow-simmered sauce and generous toppings.
            Every PizzaHub pie is fired fresh and delivered before the cheese
            stops stretching.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              nativeButton={false}
              render={<Link href="/browse-menu" />}
              className="group h-13 rounded-full bg-orange-500 px-7 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-500/40"
            >
              <ShoppingBag className="size-4.5" aria-hidden />
              Order now
              <ArrowRight
                className="size-4.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Button>

            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/browse-menu" />}
              className="group h-13 rounded-full border-white/15 bg-white/[0.03] px-7 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-white/[0.06] hover:text-white"
            >
              Explore the menu
              <ArrowUpRight
                className="size-4.5 text-orange-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex -space-x-2.5">
              {reviews.map((review) => (
                <span
                  key={review.initials}
                  className={`flex size-9 items-center justify-center rounded-full bg-gradient-to-br ${review.className} text-[10px] font-black text-white ring-2 ring-[#11100F]`}
                >
                  {review.initials}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-orange-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-3.5 fill-current"
                    aria-hidden
                  />
                ))}
              </span>
              <p className="text-xs font-medium text-neutral-400">
                <span className="font-bold text-white">4.9</span> from 2,400+
                pizza lovers
              </p>
            </div>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0 last:pr-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-lg font-black tracking-tight text-white sm:text-xl">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-[11px] text-neutral-500 sm:text-xs">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[540px]">
          <div
            aria-hidden
            className="animate-hero-spin absolute inset-5 rounded-full border border-dashed border-white/15 sm:inset-7"
          />
          <div
            aria-hidden
            className="absolute inset-12 rounded-full bg-orange-500/25 blur-3xl"
          />

          <div className="relative aspect-square w-full p-5 sm:p-8">
            <div className="relative size-full overflow-hidden rounded-full ring-1 ring-white/15 shadow-[0_40px_120px_-24px_rgba(249,115,22,0.55)]">
              <Image
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop"
                alt="A freshly baked pepperoni pizza with melted mozzarella and basil"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 540px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-white/10"
              />
            </div>

            {/* Fresh badge */}
            <div className="animate-hero-float absolute -left-1 top-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1917]/90 p-3 pr-4 shadow-xl shadow-black/40 backdrop-blur-xl sm:-left-3 sm:top-12">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                <Flame className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-bold text-white">
                  Fresh out of the oven
                </span>
                <span className="mt-0.5 block text-[10px] text-neutral-400">
                  Baked at 450°C
                </span>
              </span>
            </div>

            {/* Product card */}
            <div className="animate-hero-float-reverse absolute -bottom-2 -right-1 w-[190px] rounded-2xl border border-white/10 bg-[#1A1917]/90 p-4 shadow-xl shadow-black/50 backdrop-blur-xl sm:-right-4 sm:bottom-4 sm:w-[210px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-400">
                    Fan favourite
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Pepperoni Passion
                  </p>
                </div>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <Plus className="size-4" aria-hidden />
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-base font-black text-white">$18.90</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400">
                  <Star
                    className="size-3 fill-orange-400 text-orange-400"
                    aria-hidden
                  />
                  4.9
                </span>
              </div>
            </div>

            {/* Delivery chip */}
            <div className="animate-hero-float absolute -left-2 bottom-12 hidden items-center gap-2 rounded-full border border-white/10 bg-[#1A1917]/90 px-4 py-2.5 shadow-lg shadow-black/40 backdrop-blur-xl sm:flex">
              <Clock3 className="size-4 text-orange-400" aria-hidden />
              <span className="text-[11px] font-semibold text-white">
                30 min delivery
              </span>
            </div>

            {/* Sparkles */}
            <Sparkles
              aria-hidden
              className="absolute -right-1 top-2 size-6 text-orange-400/70"
            />
            <span
              aria-hidden
              className="absolute bottom-4 left-8 size-2 rounded-full bg-orange-500/70"
            />
            <span
              aria-hidden
              className="absolute right-10 top-4 size-1.5 rounded-full bg-white/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
