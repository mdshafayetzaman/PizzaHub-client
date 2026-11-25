export function LoadingBlock({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-red-500" />
      <p className="mt-4 text-sm text-zinc-400">{label}</p>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111114]/95 p-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-white/10" />
      <div className="mt-4 h-8 w-16 rounded bg-white/10" />
      <div className="mt-3 h-3 w-32 rounded bg-white/5" />
    </div>
  )
}
