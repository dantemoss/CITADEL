import { Construction } from "lucide-react";

import { FadeUp } from "@/components/motion";
import { PremiumFrame } from "@/components/ui/premium-frame";
import { MODULES } from "@/lib/modules";

type Props = {
  moduleId: (typeof MODULES)[number]["id"];
};

export function ModulePlaceholder({ moduleId }: Props) {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return null;

  const Icon = mod.icon;
  const index = MODULES.findIndex((m) => m.id === moduleId);
  const number = String(index + 1).padStart(2, "0");

  return (
    <FadeUp className="flex flex-col gap-6">
      {/* Cabecera editorial — número óxido + módulo */}
      <header className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-accent">
              {number}
            </span>
            <span className="h-px w-8 bg-accent" aria-hidden />
            <span className="eyebrow">
              Módulo · <span className="italic normal-case tracking-normal text-muted-foreground/80">{mod.greek}</span>
            </span>
          </div>
          <span className="eyebrow">Citadel</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border bg-popover shadow-paper">
            <Icon className="h-6 w-6 text-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-serif text-[clamp(40px,5vw,60px)] leading-[1.04] tracking-editorial text-foreground">
              {capitalize(mod.name)}
            </h1>
            <p className="font-sans text-[15px] leading-relaxed text-muted-foreground">
              {mod.description}
            </p>
          </div>
        </div>
      </header>

      {/* Bloque "en construcción" — pattern papel + texto editorial */}
      <PremiumFrame className="overflow-hidden">
        <div className="relative flex flex-col gap-4 p-10 pattern-paper">
          <div className="flex items-center gap-2">
            <Construction className="h-4 w-4 text-accent" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              En construcción
            </span>
          </div>
          <p className="max-w-2xl font-sans text-[15px] leading-relaxed text-muted-foreground">
            Este módulo está listo para ser implementado. Los componentes
            específicos de{" "}
            <span className="font-serif italic text-foreground">{capitalize(mod.name)}</span>{" "}
            viven en{" "}
            <code className="rounded-md border border-border bg-popover px-2 py-0.5 font-mono text-xs text-foreground">
              src/components/modules/{capitalize(mod.name)}/
            </code>
            .
          </p>
        </div>
      </PremiumFrame>
    </FadeUp>
  );
}

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
