import Link from "next/link";
import { ArrowUpRight, ScrollText } from "lucide-react";

import { FadeUp, Stagger, StaggerItem } from "@/components/motion";
import { PremiumFrame } from "@/components/ui/premium-frame";
import { MODULES } from "@/lib/modules";

export default function WelcomePage() {
  const now = new Date();
  const stamp = now.toLocaleDateString("es", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-16">
      {/* ── 00 · Cabecera editorial ──────────────────────────────────── */}
      <FadeUp className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-accent">
              00
            </span>
            <Fleuron className="h-2.5 w-2.5 text-accent" />
            <span className="eyebrow">Ordo Interior</span>
          </div>
          <div className="flex items-center gap-2">
            <ScrollText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {stamp}
            </span>
          </div>
        </div>

        {/* Hero — serif romántico + panel destacado spray al lado */}
        <div className="relative grid grid-cols-1 items-end gap-10 pt-4 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div className="flex max-w-2xl flex-col gap-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" aria-hidden />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                Bienvenido, Arquitecto
              </span>
            </div>

            <h1 className="font-serif text-[clamp(48px,7vw,80px)] leading-[1.04] tracking-editorial text-foreground">
              Ordena tu vida<br />
              en seis columnas.
            </h1>

            <p className="max-w-xl font-sans text-[17px] leading-relaxed text-muted-foreground">
              Citadel no persigue el ruido. Es un lugar de trabajo silencioso para
              pensar, contar el tiempo, vigilar lo que se gasta y guardar lo que
              vale la pena recordar.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/chronos"
                className="liquid-glass liquid-glass-lg group inline-flex items-center gap-2"
              >
                Entrar a Chronos
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/hypomnemata"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-popover px-6 py-3 font-sans text-sm font-medium tracking-[0.01em] text-foreground transition-colors hover:bg-secondary"
              >
                Abrir Brain Dump
              </Link>
            </div>
          </div>

          {/* Panel destacado — fondo spray, ornamento + cita */}
          <aside className="group relative hidden h-[300px] w-full shrink-0 overflow-hidden rounded-[var(--radius)] border border-spray-400/30 bg-spray-400 text-spray-950 shadow-spray-glow lg:block">
            {/* Vidriera: círculos concéntricos sutiles */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border border-spray-200/40"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full border border-spray-200/25"
            />
            {/* Patrón pictórico muy sutil */}
            <div aria-hidden className="absolute inset-0 pattern-paper opacity-60" />

            <div className="relative flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <Fleuron className="h-2.5 w-2.5 text-spray-950" />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-spray-950/80">
                  harmonia
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-serif text-[22px] italic leading-[1.2] text-spray-950">
                  «La calidad de tus pensamientos determina la calidad de tu vida.»
                </p>
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-spray-950/75">
                  — Marco Aurelio
                </p>
              </div>
            </div>
          </aside>
        </div>
      </FadeUp>

      {/* ── 01 · Bento de módulos ────────────────────────────────────── */}
      <FadeUp delay={0.08} className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-accent">
              01
            </span>
            <Fleuron className="h-2.5 w-2.5 text-accent" />
            <span className="eyebrow">Las seis columnas</span>
          </div>
          <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            {String(MODULES.length).padStart(2, "0")} módulos
          </span>
        </div>

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod, index) => {
            const Icon = mod.icon;
            const idx = String(index + 1).padStart(2, "0");

            return (
              <StaggerItem key={mod.id} hover>
                <PremiumFrame className="group min-h-[240px] h-full transition-all duration-300 hover:border-accent/40 hover:shadow-spray-glow">
                <Link
                  href={mod.href}
                  className="relative flex h-full min-h-[240px] flex-col justify-between p-7"
                >
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] font-medium tracking-[0.24em] text-accent">
                        {idx}
                      </span>
                      <span className="h-px w-6 bg-accent" aria-hidden />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>

                  <div className="relative mt-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary/60 transition-colors duration-300 group-hover:border-accent/30 group-hover:bg-accent/10">
                      <Icon className="h-4 w-4 text-accent transition-colors" />
                    </div>
                    <span className="font-serif text-[15px] italic text-muted-foreground">
                      {mod.greek}
                    </span>
                  </div>

                  <div className="relative mt-5 flex flex-col gap-2">
                    <h2 className="font-serif text-[28px] leading-tight tracking-editorial text-foreground">
                      {capitalize(mod.name)}
                    </h2>
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {mod.description}
                    </p>
                  </div>
                </Link>
                </PremiumFrame>
              </StaggerItem>
            );
          })}
        </Stagger>
      </FadeUp>

      {/* ── Pie editorial ────────────────────────────────────────────── */}
      <FadeUp delay={0.12}>
        <footer className="mt-4 flex items-center justify-between border-t border-border pt-5">
        <span className="flex items-center gap-3">
          <Fleuron className="h-2.5 w-2.5 text-accent" />
          <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Citadel · Cultus Animi
          </span>
        </span>
        <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
          v2.0
        </span>
        </footer>
      </FadeUp>
    </div>
  );
}

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Fleuron — pequeño rombo de cuatro puntas. Reutilizable en eyebrows
 * y como divisor en lugar de la línea sólida `bg-accent`.
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
