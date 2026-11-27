import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Suspense } from "react";

import HeroSection from "@/components/shared/hero-section";
import MenuCard from "@/components/browse-menu/menu-card";
import { MENU_ITEMS } from "@/lib/data";
import AuthRedirectHandler from "@/components/shared/auth-redirect-handler";

const HomePage = () => {
  const featuredItems = MENU_ITEMS.filter((item) => item.isAvailable).slice(0, 6);

  return (
    <main className="bg-[#11100F] text-white">
      <Suspense fallback={null}>
        <AuthRedirectHandler />
      </Suspense>
      <HeroSection />

      <section className="relative isolate overflow-hidden px-5 py-16 sm:py-20 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 size-[28rem] rounded-full bg-orange-500/10 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 size-[24rem] rounded-full bg-orange-600/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[11px] font-bold tracking-[0.22em] text-orange-400 uppercase">
                <Flame aria-hidden className="size-3.5" />
                Customer favorites
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Popular <span className="text-orange-500">picks.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-neutral-400">
                Fresh, hand-tossed pizzas loved by our customers. Browse the full menu for more.
              </p>
            </div>

            <Link
              href="/browse-menu"
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-orange-500/40 hover:text-orange-300"
            >
              View full menu
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featuredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
