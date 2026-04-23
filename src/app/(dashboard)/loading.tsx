export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 border-b border-white/[0.04] pb-5">
        <div className="h-3 w-28 rounded bg-white/[0.05]" />
        <div className="h-9 w-56 rounded-lg bg-white/[0.06]" />
        <div className="h-3 w-96 rounded bg-white/[0.04]" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/[0.04]" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-white/[0.05] bg-[#0a0a0b] overflow-hidden">
        <div className="border-b border-white/[0.04] px-5 py-4">
          <div className="h-3 w-32 rounded bg-white/[0.04]" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-white/[0.03] px-5 py-3 last:border-b-0">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-md bg-white/[0.04]" />
              <div className="flex flex-1 flex-col gap-1.5 justify-center">
                <div className="h-3 w-24 rounded bg-white/[0.04]" />
                <div className="h-2.5 w-40 rounded bg-white/[0.03]" />
              </div>
              <div className="h-3 w-16 rounded bg-white/[0.04] self-center ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
