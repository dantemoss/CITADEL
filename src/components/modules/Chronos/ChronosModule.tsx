"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Hourglass } from "lucide-react";

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
  birthDate = "2004-10-28",
  lifespanYears = 80,
  cleanDays = 13,
}: ChronosModuleProps) {
  const birth = React.useMemo(() => parseISO(birthDate), [birthDate]);

  const [now, setNow] = React.useState<Date>(() => new Date());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(id);
  }, []);

  const stats = React.useMemo(
    () => computeLifeStats(birth, lifespanYears, now),
    [birth, lifespanYears, now]
  );

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 mx-auto flex w-full max-w-[1180px] flex-col font-sans duration-500">
      <PremiumFrame className="overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-marfil/10 via-marfil/[0.035] to-marfil/[0.012] shadow-[0_0_0_1px_hsl(var(--marfil)_/_0.045),0_26px_90px_hsl(var(--carbon)_/_0.46)]">
        <div className="relative overflow-hidden rounded-[calc(1.1rem-1px)] bg-background px-5 py-5 text-marfil shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.035),inset_0_0_120px_hsl(var(--marfil)_/_0.012)] sm:px-6 sm:py-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_11%_0%,hsl(var(--oxido)_/_0.18),transparent_23%),radial-gradient(circle_at_86%_8%,hsl(var(--marfil)_/_0.045),transparent_23%),linear-gradient(180deg,hsl(var(--marfil)_/_0.018),transparent_38%)]"
          />

          <div className="relative flex flex-col gap-3">
            <header className="grid grid-cols-1 gap-3 xl:grid-cols-[260px_minmax(0,1fr)_205px]">
              <div className="flex min-h-[86px] items-center gap-4 rounded-[0.55rem] border border-border bg-card/70 px-4 shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.035)]">
                <div className="relative flex h-12 w-9 items-center justify-center text-oxido">
                  <Hourglass className="h-10 w-10 stroke-[1.35]" />
                  <span className="absolute inset-x-1 top-1 h-px bg-oxido/45" />
                  <span className="absolute inset-x-1 bottom-1 h-px bg-oxido/45" />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-sans text-[1.48rem] font-semibold uppercase leading-none tracking-[0.33em] text-marfil">
                    Chronos
                  </h1>
                  <span className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.36em] text-oxido/85">
                    Memento.Mori
                  </span>
                </div>
              </div>

              <LiveCountdown deathDate={stats.death} />

              <LocalTimePanel now={now} />
            </header>

            <StatsDashboard stats={stats} cleanDays={cleanDays} />

            <PremiumFrame className="rounded-[0.65rem] bg-gradient-to-br from-white/[0.095] via-white/[0.035] to-white/[0.012]">
              <div className="rounded-[0.6rem] bg-card/72 px-4 py-4 shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.03)] sm:px-5 sm:py-5">
                <LifeGrid
                  weeksElapsed={stats.weeksElapsed}
                  totalWeeks={stats.totalWeeks}
                  lifespanYears={lifespanYears}
                />
              </div>
            </PremiumFrame>

            <footer className="flex items-center justify-between rounded-[0.55rem] border border-border bg-card/65 px-4 py-3 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground">
              <span>〃 Memento Mori · Respice Finem</span>
              <span className="flex items-center gap-3">
                Sic Itur Ad Astra
                <span className="text-base leading-none text-oxido/70">✧</span>
              </span>
            </footer>
          </div>
        </div>
      </PremiumFrame>
    </section>
  );
}

function LocalTimePanel({ now }: { now: Date }) {
  const second = now.getSeconds();
  const minute = now.getMinutes();
  const hour = now.getHours() % 12;
  const hourDeg = hour * 30 + minute * 0.5;
  const minuteDeg = minute * 6;
  const secondDeg = second * 6;

  return (
    <div className="flex min-h-[86px] items-center justify-between rounded-[0.55rem] border border-border bg-card/70 px-4 shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.035)]">
      <div className="flex flex-col">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.32em] text-muted-foreground">
          Hora Local
        </span>
        <span className="mt-2 font-mono text-sm tabular-nums tracking-[0.2em] text-marfil">
          {format(now, "HH:mm:ss")}
        </span>
        <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground/70">
          {format(now, "dd MMM yyyy")}
        </span>
      </div>
      <div className="relative h-[54px] w-[54px] shrink-0 rounded-full border border-border bg-[radial-gradient(circle,hsl(var(--marfil)_/_0.09),hsl(var(--marfil)_/_0.025)_42%,transparent_64%)] shadow-[inset_0_0_18px_hsl(var(--carbon)_/_0.48)]">
        <span className="absolute left-1/2 top-[5px] h-1 w-px -translate-x-1/2 rounded-full bg-oxido/60" />
        <span className="absolute bottom-[5px] left-1/2 h-1 w-px -translate-x-1/2 rounded-full bg-muted-foreground/40" />
        <span className="absolute left-[5px] top-1/2 h-px w-1 -translate-y-1/2 rounded-full bg-muted-foreground/40" />
        <span className="absolute right-[5px] top-1/2 h-px w-1 -translate-y-1/2 rounded-full bg-oxido/60" />
        <span
          className="absolute bottom-1/2 left-1/2 h-[15px] w-[2px] origin-bottom rounded-full bg-marfil/75"
          style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        />
        <span
          className="absolute bottom-1/2 left-1/2 h-[20px] w-px origin-bottom rounded-full bg-muted-foreground"
          style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
        />
        <span
          className="absolute bottom-1/2 left-1/2 h-[22px] w-px origin-bottom rounded-full bg-oxido/85"
          style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
        />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-oxido shadow-[0_0_10px_hsl(var(--oxido)_/_0.48)]" />
      </div>
    </div>
  );
}
