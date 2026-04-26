"use client";

import * as React from "react";
import { Activity, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatInteger, type LifeStats } from "./utils";

type StatsDashboardProps = {
  stats: LifeStats;
  cleanDays: number;
};

function StatsDashboardInner({ stats, cleanDays }: StatsDashboardProps) {
  const { progressPct, daysRemaining, weeksRemaining } = stats;
  const segments = Array.from({ length: 58 }, (_, index) => index);
  const activeSegments = Math.round((progressPct / 100) * segments.length);

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-3 lg:grid-cols-[1.08fr_0.98fr_0.92fr]">
      <Card className="h-full rounded-[0.65rem] bg-gradient-to-br from-white/[0.09] via-white/[0.035] to-white/[0.012]">
        <CardContent className="flex h-full min-h-[132px] flex-col justify-between gap-4 rounded-[0.6rem] bg-card/88 p-5 text-marfil shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.035)]">
          <div>
            <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.22em] text-oxido/85">
              Vitam Consumptam
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[1.55rem] font-medium tabular-nums tracking-[0.08em] text-marfil">
              {progressPct.toFixed(6)}
            </span>
            <span className="font-mono text-[0.72rem] text-muted-foreground">%</span>
          </div>
          <span className="font-sans text-xs text-muted-foreground">
            Partem vitæ iam transactam
          </span>
          <div className="flex h-2 items-center gap-[3px]" aria-hidden>
            {segments.map((segment) => (
              <span
                key={segment}
                className={
                  segment < activeSegments
                    ? "h-2 min-w-[2px] flex-1 bg-marfil shadow-[0_0_8px_hsl(var(--marfil)_/_0.22)]"
                    : "h-2 min-w-[2px] flex-1 bg-muted/70"
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="h-full rounded-[0.65rem] bg-gradient-to-br from-white/[0.09] via-white/[0.035] to-white/[0.012]">
        <CardContent className="flex h-full min-h-[132px] flex-col justify-between gap-4 rounded-[0.6rem] bg-card/88 p-5 text-marfil shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.035)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.22em] text-oxido/85">
              Tempus Reliquum
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/45">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 items-center divide-x divide-border">
            <div className="flex min-w-0 flex-col justify-center gap-2 pr-6">
              <span className="font-mono text-[1.55rem] font-medium tabular-nums tracking-[0.08em] text-marfil">
                {formatInteger(daysRemaining)}
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                Días
              </span>
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-2 pl-6">
              <span className="font-mono text-[1.55rem] font-medium tabular-nums tracking-[0.08em] text-marfil">
                {formatInteger(weeksRemaining)}
              </span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.29em] text-muted-foreground">
                Semanas en reserva
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-full rounded-[0.65rem] bg-gradient-to-br from-white/[0.09] via-white/[0.035] to-white/[0.012]">
        <CardContent className="flex h-full min-h-[132px] flex-col justify-between gap-4 rounded-[0.6rem] bg-card/88 p-5 text-marfil shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.035)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.22em] text-oxido/85">
              Status / Egkrateia
            </span>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-4">
            <Badge
              variant="success"
              className="w-full justify-start gap-3 rounded-lg border-emerald-400/20 bg-emerald-500/[0.07] px-4 py-3 normal-case text-emerald-200 shadow-[0_0_24px_hsl(152_60%_42%_/_0.08),inset_0_1px_0_hsl(152_60%_58%_/_0.14)]"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span className="font-mono text-[0.7rem] tracking-[0.16em]">Día</span>
              <span className="font-mono text-[0.7rem] font-semibold tabular-nums tracking-normal">
                {cleanDays}
              </span>
              <span className="font-mono text-[0.7rem] tracking-[0.16em]">
                — sistema limpio
              </span>
            </Badge>
            <span className="font-sans text-xs text-muted-foreground">
              Ἐγκράτεια · constancia del día
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function statsEqual(a: LifeStats, b: LifeStats): boolean {
  return (
    a.progressPct === b.progressPct &&
    a.daysRemaining === b.daysRemaining &&
    a.weeksRemaining === b.weeksRemaining
  );
}

export const StatsDashboard = React.memo(
  function StatsDashboard({ stats, cleanDays }: StatsDashboardProps) {
    return <StatsDashboardInner stats={stats} cleanDays={cleanDays} />;
  },
  (prev, next) =>
    statsEqual(prev.stats, next.stats) && prev.cleanDays === next.cleanDays
);
