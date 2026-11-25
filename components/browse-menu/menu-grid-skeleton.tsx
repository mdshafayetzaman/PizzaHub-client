export default function MenuGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#1A1917]/90"
        >
          <div className="aspect-[4/3] animate-pulse bg-white/[0.06]" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-white/[0.06]" />
            <div className="flex gap-3 pt-2">
              <div className="h-4 w-20 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
            </div>
            <div className="h-11 w-full animate-pulse rounded-full bg-white/[0.08] pt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
