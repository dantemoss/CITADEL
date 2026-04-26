"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { MODULES } from "@/lib/modules";

const hairline = "border-black/[0.08] dark:border-white/[0.07]";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 shrink-0 flex-col border-r backdrop-blur-md",
        hairline,
        "bg-marfil/60 dark:bg-piedra/70"
      )}
    >
      {/* Encabezado: logotipo CITADEL en serif */}
      <div className={cn("flex h-[4.75rem] items-center gap-3 border-b px-5", hairline)}>
        <Logomark />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="font-serif text-xl font-semibold tracking-[0.18em] text-foreground">
            CITADEL
          </span>
          <span className="eyebrow truncate">
            Pensamiento · Disciplina · Legado
          </span>
        </div>
      </div>

      {/* Barra de sección */}
      <div className="flex items-center gap-2 px-5 pb-3 pt-6">
        <span className="h-[2px] w-6 rule-oxido" aria-hidden />
        <span className="eyebrow">Módulos</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 scrollbar-stoic">
        {MODULES.map((mod, idx) => {
          const isActive =
            pathname === mod.href || pathname.startsWith(`${mod.href}/`);
          const Icon = mod.icon;
          const number = String(idx + 1).padStart(2, "0");

          return (
            <Link
              key={mod.id}
              href={mod.href}
              prefetch={false}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-all duration-300 ease-out",
                isActive
                  ? "border-black/[0.08] bg-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.04]"
                  : "hover:border-black/[0.06] hover:bg-black/[0.03] dark:hover:border-white/[0.05] dark:hover:bg-white/[0.03]"
              )}
            >
              {/* Marcador rojo lateral cuando está activo */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full transition-opacity duration-300",
                  isActive ? "rule-oxido opacity-100" : "opacity-0"
                )}
              />

              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums transition-colors duration-300",
                  isActive ? "text-oxido" : "text-muted-foreground"
                )}
              >
                {number}
              </span>

              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-serif text-[13px] font-semibold tracking-[0.12em] text-foreground">
                  {mod.name.toUpperCase()}
                </span>
                <span className="truncate font-sans text-[11px] leading-tight text-muted-foreground">
                  {mod.description}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-auto space-y-4 border-t px-5 py-5", hairline)}>
        <ThemeToggle className="max-w-none" />

        <div className="space-y-2 border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-oxido" />
            <p className="font-serif text-[13px] italic leading-snug text-muted-foreground">
              «No es que tengamos poco tiempo, sino que perdemos mucho.»
            </p>
          </div>
          <p className="text-right font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            — Séneca
          </p>
        </div>
      </div>
    </aside>
  );
}

/**
 * Logomark — icono inspirado en el "templo" del manual de marca:
 * columnas sobre basamento, en óxido rojo.
 */
function Logomark() {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-md border border-black/[0.08] bg-background/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)] dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
        stroke="currentColor"
      >
        <g className="text-oxido" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
          <path d="M4 20 H20" />
          <path d="M5 20 V9" />
          <path d="M9 20 V7" />
          <path d="M12 20 V5" />
          <path d="M15 20 V7" />
          <path d="M19 20 V9" />
          <path d="M4 20 H20" />
          <path d="M3 20 H21" />
        </g>
      </svg>
    </span>
  );
}
