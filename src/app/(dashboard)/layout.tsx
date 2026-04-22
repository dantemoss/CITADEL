import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-[1] flex min-h-screen bg-background">
      <Sidebar />
      <main className="relative flex-1 overflow-x-hidden border-l border-black/[0.08] bg-background/40 backdrop-blur-[2px] dark:border-white/[0.07] dark:bg-black/30">
        {/* Línea superior — detalle editorial */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oxido/60 to-transparent opacity-60 dark:via-oxido/70"
        />
        <div className="relative mx-auto w-full max-w-7xl px-8 py-10 md:px-10 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
