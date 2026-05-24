import { PageEnter } from "@/components/motion";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-[1] flex min-h-screen">
      <Sidebar />
      <main className="relative flex-1 overflow-x-hidden">
        {/* Línea superior — detalle editorial Dualite */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
        <div className="relative mx-auto w-full max-w-[1180px] px-8 py-12 md:px-12 md:py-16">
          <PageEnter>{children}</PageEnter>
        </div>
      </main>
    </div>
  );
}
