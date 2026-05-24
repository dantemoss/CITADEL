export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header skeleton — papel Dualite */}
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="h-3 w-28 rounded bg-foreground/[0.06]" />
        <div className="h-12 w-72 rounded-md bg-foreground/[0.08]" />
        <div className="h-3 w-[28rem] max-w-full rounded bg-foreground/[0.05]" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-[var(--radius)] border border-border bg-card shadow-paper"
          />
        ))}
      </div>

      {/* Tabla skeleton */}
      <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-paper">
        <div className="border-b border-border px-6 py-4">
          <div className="h-3 w-32 rounded bg-foreground/[0.06]" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border-b border-border px-6 py-4 last:border-b-0"
          >
            <div className="flex gap-4">
              <div className="h-9 w-9 rounded-md bg-foreground/[0.06]" />
              <div className="flex flex-1 flex-col justify-center gap-1.5">
                <div className="h-3 w-32 rounded bg-foreground/[0.06]" />
                <div className="h-2.5 w-48 rounded bg-foreground/[0.04]" />
              </div>
              <div className="ml-auto h-3 w-20 self-center rounded bg-foreground/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
