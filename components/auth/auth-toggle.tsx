import Link from "next/link"

import { cn } from "@/lib/utils"

const tabs = [
  { label: "Sign in", href: "/sign-in", value: "sign-in" },
  { label: "Sign up", href: "/sign-up", value: "sign-up" },
] as const

export default function AuthToggle({
  active,
}: {
  active: "sign-in" | "sign-up"
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={tab.href}
          aria-current={active === tab.value ? "page" : undefined}
          className={cn(
            "rounded-full py-2.5 text-center text-sm font-semibold transition-all duration-300",
            active === tab.value
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
              : "text-neutral-400 hover:text-white"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
