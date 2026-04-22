import Link from "next/link";
import { ArrowUpRight, ScrollText } from "lucide-react";

import { PremiumFrame } from "@/components/ui/premium-frame";
import { MODULES } from "@/lib/modules";

const tileIcon =
  "flex h-10 w-10 items-center justify-center rounded-md border border-black/[0.08] bg-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]";

export default function WelcomePage() {
  const now = new Date();
  const stamp = now.toLocaleDateString("es", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Cabecera editorial tipo manual de marca */}
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-oxido">
              00
            </span>
            <span className="h-[1px] w-8 rule-oxido" aria-hidden />
            <span className="eyebrow">Ordo Interior</span>
          </div>
          <div className="flex items-center gap-2">
            <ScrollText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {stamp}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-5xl font-semibold tracking-[0.08em] text-foreground md:text-6xl">
            CITADEL
          </h1>
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-10 rule-oxido" aria-hidden />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.36em] text-muted-foreground">
              Pensamiento · Disciplina · Legado
            </span>
          </div>
          <p className="mt-3 max-w-xl font-serif text-base italic leading-relaxed text-muted-foreground">
            Bienvenido, Arquitecto. Aquí no se persigue el ruido: se ordena la
            vida en cinco columnas, como las estelas de un templo.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod, index) => {
          const Icon = mod.icon;
          const idx = String(index + 1).padStart(2, "0");

          return (
            <PremiumFrame key={mod.id} className="group min-h-[220px] h-full">
              <Link
                href={mod.href}
                className="relative flex h-full min-h-[220px] flex-col justify-between p-6 sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 90% 0%, hsl(var(--oxido) / 0.10), transparent 60%)",
                  }}
                />

                {/* Encabezado tipo ficha de manual: número en óxido, flecha */}
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-medium tracking-[0.24em] text-oxido">
                      {idx}
                    </span>
                    <span className="h-[1px] w-6 rule-oxido" aria-hidden />
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <div className="relative mt-6 flex items-center gap-4">
                  <div className={tileIcon}>
                    <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                  <span className="font-sans text-sm italic text-muted-foreground">
                    {mod.greek}
                  </span>
                </div>

                <div className="relative mt-5 flex flex-col gap-2">
                  <h2 className="font-serif text-2xl font-semibold tracking-[0.1em] text-foreground">
                    {mod.name.toUpperCase()}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {mod.description}
                  </p>
                </div>
              </Link>
            </PremiumFrame>
          );
        })}

        {/* Tarjeta final: Harmonia — cita de Marco Aurelio (manual) */}
        <PremiumFrame className="min-h-[220px]">
          <div className="flex h-full min-h-[220px] flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-medium tracking-[0.24em] text-oxido">
                  06
                </span>
                <span className="h-[1px] w-6 rule-oxido" aria-hidden />
              </div>
              <span className="flex items-center gap-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-oxido shadow-[0_0_10px_hsl(var(--oxido)/0.55)]" />
                harmonia
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <p className="font-serif text-lg italic leading-snug text-foreground">
                «La calidad de tus pensamientos determina la calidad de tu
                vida.»
              </p>
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-oxido">
                — Marco Aurelio
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
              <div>
                <p className="eyebrow">Módulos</p>
                <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-foreground">
                  {String(MODULES.length).padStart(2, "0")}
                </p>
              </div>
              <div>
                <p className="eyebrow">Enfoque</p>
                <p className="mt-1 font-serif text-2xl font-medium tabular-nums text-foreground">
                  Uno
                </p>
              </div>
            </div>
          </div>
        </PremiumFrame>
      </section>

      {/* Pie tipo hoja de manual */}
      <footer className="mt-auto flex items-center justify-between border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
        <span className="flex items-center gap-3">
          <span className="h-[1px] w-6 rule-oxido" aria-hidden />
          <span className="font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Citadel · Cultus Animi
          </span>
        </span>
        <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
          v2.0
        </span>
      </footer>
    </div>
  );
}
