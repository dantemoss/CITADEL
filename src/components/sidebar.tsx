"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { sidebarSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { MODULES } from "@/lib/modules";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-[272px] shrink-0 flex-col border-r border-border bg-card/90 backdrop-blur-[8px]">
      {/* Velo cobalto vertical — atmósfera romántica de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 veil-vertical" />

      {/* Logo CITADEL — arco gótico ojival */}
      <div className="relative flex h-[4.75rem] items-center gap-3 border-b border-border px-6">
        <Logomark />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="font-serif text-[22px] leading-none text-foreground tracking-[0.02em]">
            Citadel
          </span>
          <span className="mt-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Pensamiento · Disciplina · Legado
          </span>
        </div>
      </div>

      {/* Etiqueta de sección — ornamento + eyebrow */}
      <div className="relative flex items-center gap-3 px-6 pb-3 pt-6">
        <Fleuron className="h-2.5 w-2.5 text-accent" />
        <span className="eyebrow">Módulos</span>
      </div>

      <Stagger className="relative flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 scrollbar-stoic">
        {MODULES.map((mod, idx) => {
          const isActive =
            pathname === mod.href || pathname.startsWith(`${mod.href}/`);
          const Icon = mod.icon;
          const number = String(idx + 1).padStart(2, "0");

          return (
            <StaggerItem key={mod.id}>
              <Link
                href={mod.href}
                prefetch={false}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-200",
                  isActive
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="sidebar-active"
                    aria-hidden
                    className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-accent"
                    transition={sidebarSpring}
                  />
                ) : null}

              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums transition-colors duration-200",
                  isActive ? "text-accent" : "text-muted-foreground/70"
                )}
              >
                {number}
              </span>

              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />

              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={cn(
                    "font-sans text-[13px] font-medium leading-tight tracking-[0.01em] transition-colors duration-200",
                    isActive ? "text-foreground" : "text-foreground/85"
                  )}
                >
                  {capitalize(mod.name)}
                </span>
                <span className="truncate font-sans text-[11px] leading-tight text-muted-foreground">
                  {mod.description}
                </span>
              </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Pie — ornamento divisor + toggle + cita */}
      <div className="relative mt-auto space-y-4 border-t border-border px-6 py-5">
        <Ornament className="mx-auto h-3 w-20 text-border" />

        <ThemeToggle className="max-w-none" />

        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
            <p className="font-serif text-[14px] italic leading-snug text-muted-foreground">
              «No es que tengamos poco tiempo, sino que perdemos mucho.»
            </p>
          </div>
          <p className="text-right font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
            — Séneca
          </p>
        </div>
      </div>
    </aside>
  );
}

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Logomark — arco gótico ojival con rosetón.
 * Sustituye al templo griego anterior. Romanticismo + modernidad:
 * trazo fino, simetría limpia, un solo color (acento spray).
 */
function Logomark() {
  return (
    <span
      aria-hidden
      className="relative flex h-10 w-10 items-center justify-center rounded-md border border-border bg-popover/80"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 text-accent"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Base */}
        <path d="M3.5 21 H20.5" />
        {/* Pilastras */}
        <path d="M5 21 V11" />
        <path d="M19 21 V11" />
        {/* Arco ojival (punta gótica) */}
        <path d="M5 11 Q12 1 19 11" />
        {/* Rosetón central */}
        <circle cx="12" cy="13" r="1.4" />
        {/* Aguja superior */}
        <path d="M12 3.5 V1.5" />
      </svg>
    </span>
  );
}

/**
 * Fleuron — pequeño ornamento (rombo + puntos) para etiquetas de sección.
 */
function Fleuron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 10 10"
      className={className}
      fill="currentColor"
    >
      <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" />
    </svg>
  );
}

/**
 * Ornament — línea decorativa con rombos centrales, estilo cartouche romántico.
 * Divide visualmente la nav de la sección de toggle/cita en la sidebar.
 */
function Ornament({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 12"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      stroke="currentColor"
      strokeWidth="1"
      fill="currentColor"
    >
      <line x1="0" y1="6" x2="32" y2="6" />
      <path
        d="M36 6 L40 2 L44 6 L40 10 Z"
        strokeWidth="0.8"
        fill="none"
      />
      <line x1="48" y1="6" x2="80" y2="6" />
    </svg>
  );
}
