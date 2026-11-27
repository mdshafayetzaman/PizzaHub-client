export default function MenuGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#171614]/90"
        >
          <div className="aspect-[4/3] animate-pulse bg-white/[0.06]" />
          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-6 w-2/3 animate-pulse rounded bg-white/[0.08]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/[0.06]" />
              </div>
              <div className="h-16 w-20 animate-pulse rounded-2xl bg-white/[0.06]" />
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-white/[0.06]" />
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="h-11 animate-pulse rounded-full bg-white/[0.08]" />
              <div className="h-11 animate-pulse rounded-full bg-white/[0.08]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
