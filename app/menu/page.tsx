import type { Metadata } from 'next'

import MenuCatalog from '@/components/menu/menu-catalog'

export const metadata: Metadata = {
  title: 'Browse Menu — PizzaHub',
  description:
    'Hand-tossed pizzas, stone-fired sides and desserts from PizzaHub. Choose a favourite and order hot from the oven.',
}

export default function MenuPage() {
  return (
    <main className="relative overflow-hidden bg-[#11100F] py-16 text-white sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 size-[32rem] rounded-full bg-orange-500/10 blur-[130px]" />
        <div className="absolute -right-40 top-1/3 size-[36rem] rounded-full bg-orange-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <MenuCatalog />
      </div>
    </main>
  )
}
