import Image from "next/image"
import Link from "next/link"
import { Check, Pizza, Sparkles } from "lucide-react"

const perks = [
  "Track every order in real time",
  "Save your favourite pies and addresses",
  "Unlock member-only drops and offers",
]

export default function AuthShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] bg-[#11100F] text-white">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] overflow-hidden border-r border-white/10 lg:flex">
        <Image
          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1400&auto=format&fit=crop"
          alt="A wood-fired pizza on a rustic table"
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/80 to-[#0B0A09]/25"
        />
        <div
          aria-hidden
          className="absolute -left-24 top-1/3 size-[26rem] rounded-full bg-orange-500/20 blur-[120px]"
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          <Link href="/" className="group flex w-fit items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/25 transition duration-300 group-hover:rotate-12">
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

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
              <Sparkles className="size-3.5" aria-hidden />
              PizzaHub rewards
            </span>

            <h2 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.04em] xl:text-5xl">
              Good pizza.
              <br />
              <span className="text-orange-500">Better with you.</span>
            </h2>

            <p className="mt-5 text-sm leading-6 text-neutral-300">
              Join PizzaHub to make every order faster, remember your favourites
              and get first dibs on new slices.
            </p>

            <ul className="mt-8 space-y-3">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 text-sm text-neutral-300"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-neutral-500">
            © PizzaHub 2026. Hand-tossed since &apos;98.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <div className="relative flex w-full items-center justify-center overflow-hidden px-5 py-12 lg:w-[54%] lg:px-12 lg:py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-24 size-[26rem] rounded-full bg-orange-600/15 blur-[130px]" />
          <div className="absolute -bottom-40 -left-24 size-[22rem] rounded-full bg-orange-500/10 blur-[120px]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <div className="relative z-10 w-full max-w-[430px]">{children}</div>
      </div>
    </main>
  )
}
