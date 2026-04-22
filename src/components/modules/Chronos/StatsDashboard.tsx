"use client";

import * as React from "react";
import { Activity, Hourglass, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatInteger, type LifeStats } from "./utils";

type StatsDashboardProps = {
  stats: LifeStats;
  cleanDays: number;
};

function StatsDashboardInner({ stats, cleanDays }: StatsDashboardProps) {
  const { progressPct, daysRemaining, weeksRemaining } = stats;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Progreso
            </span>
            <Hourglass className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
              {progressPct.toFixed(6)}
            </span>
            <span className="font-mono text-xs text-muted-foreground">%</span>
          </div>
          <Progress value={progressPct} aria-label="Progreso de vida" />
          <span className="font-sans text-xs italic text-muted-foreground">
            Partem vitæ iam transactam
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Tiempo restante
            </span>
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
              {formatInteger(daysRemaining)}
            </span>
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              días
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm tabular-nums text-foreground/80">
              {formatInteger(weeksRemaining)}
            </span>
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              semanas en reserva
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <Badge variant="success" className="w-fit gap-2 px-3 py-1.5 normal-case">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)] dark:bg-emerald-400 dark:shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
            <span className="font-sans tracking-[0.12em]">Día</span>
            <span className="font-mono text-[11px] font-semibold tabular-nums tracking-normal">
              {cleanDays}
            </span>
            <span className="font-sans tracking-[0.12em]">— sistema limpio</span>
          </Badge>
          <span className="font-sans text-xs italic text-muted-foreground">
            Ἐγκράτεια · constancia del día
          </span>
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
