import { Construction } from "lucide-react";

import { PremiumFrame } from "@/components/ui/premium-frame";
import { MODULES } from "@/lib/modules";

const iconShell =
  "flex h-12 w-12 items-center justify-center rounded-md border border-black/[0.08] bg-white/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-[inset_0_1px_0_0_rgba(235,229,223,0.05)]";

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
    <div className="flex flex-col gap-4">
      <PremiumFrame>
        <header className="flex flex-col gap-6 p-6 sm:p-8">
          {/* Barra editorial con número óxido */}
          <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-oxido">
                {number}
              </span>
              <span className="h-[1px] w-8 rule-oxido" aria-hidden />
              <span className="eyebrow">
                Módulo · <span className="italic normal-case tracking-normal">{mod.greek}</span>
              </span>
            </div>
            <span className="eyebrow">Citadel</span>
          </div>

          <div className="flex items-center gap-5">
            <div className={iconShell}>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-[0.08em] text-foreground">
                {mod.name.toUpperCase()}
              </h1>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                {mod.description}
              </p>
            </div>
          </div>
        </header>
      </PremiumFrame>

      <PremiumFrame>
        <div className="flex flex-col items-start gap-3 border border-dashed border-black/[0.12] bg-transparent p-8 sm:p-10 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Construction className="h-4 w-4 text-oxido" />
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              En construcción
            </span>
          </div>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground">
            Este módulo está listo para ser implementado. Los componentes
            específicos de{" "}
            <span className="font-serif tracking-[0.08em] text-foreground">
              {mod.name.toUpperCase()}
            </span>{" "}
            viven en{" "}
            <code className="rounded-md border border-black/[0.1] bg-white/70 px-2 py-1 font-mono text-xs text-muted-foreground dark:border-white/[0.08] dark:bg-white/[0.03]">
              src/components/modules/
              {mod.name[0] + mod.name.slice(1).toLowerCase()}/
            </code>
            .
          </p>
        </div>
      </PremiumFrame>
    </div>
  );
}
