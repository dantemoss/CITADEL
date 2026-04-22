"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";

import { PremiumFrame } from "@/components/ui/premium-frame";

import { LifeGrid } from "./LifeGrid";
import { LiveCountdown } from "./LiveCountdown";
import { StatsDashboard } from "./StatsDashboard";
import { computeLifeStats } from "./utils";

export type ChronosModuleProps = {
  birthDate?: string;
  lifespanYears?: number;
  cleanDays?: number;
};

export function ChronosModule({
  birthDate = "2005-04-20",
  lifespanYears = 80,
  cleanDays = 13,
}: ChronosModuleProps) {
  const birth = React.useMemo(() => parseISO(birthDate), [birthDate]);

  const [now, setNow] = React.useState<Date>(() => new Date());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const stats = React.useMemo(
    () => computeLifeStats(birth, lifespanYears, now),
    [birth, lifespanYears, now]
  );

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-4 duration-500">
      <LiveCountdown deathDate={stats.death} prominence="hero" />

      <PremiumFrame>
        <header className="flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-sans text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
                CHRONOS
              </h1>
              <p className="font-sans text-sm font-medium italic text-muted-foreground">
                Memento mori
              </p>
            </div>
            <div className="flex flex-col items-start gap-1 text-left sm:items-end sm:text-right">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Nacimiento — término
              </span>
              <span className="font-mono text-xs tabular-nums tracking-tight text-foreground/90">
                {format(stats.birth, "yyyy-MM-dd")}
                <span className="mx-2 text-muted-foreground/80">·</span>
                {format(stats.death, "yyyy-MM-dd")}
              </span>
            </div>
          </div>
        </header>
      </PremiumFrame>

      <StatsDashboard stats={stats} cleanDays={cleanDays} />

      <PremiumFrame>
        <div className="p-6 sm:p-8">
          <LifeGrid
            weeksElapsed={stats.weeksElapsed}
            totalWeeks={stats.totalWeeks}
            lifespanYears={lifespanYears}
          />
        </div>
      </PremiumFrame>
    </section>
  );
}
