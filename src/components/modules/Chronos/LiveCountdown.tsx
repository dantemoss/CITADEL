"use client";

import * as React from "react";
import { differenceInSeconds } from "date-fns";

import { PremiumFrame } from "@/components/ui/premium-frame";

import { formatInteger } from "./utils";

type LiveCountdownProps = {
  deathDate: Date;
};

/** Aísla el estado que cambia cada segundo para no re-renderizar el marco estático. */
function SecondsTicker({
  deathDate,
  className,
  suffixClassName,
}: {
  deathDate: Date;
  className?: string;
  suffixClassName?: string;
}) {
  const deathMs = deathDate.getTime();
  const [seconds, setSeconds] = React.useState(() =>
    Math.max(0, differenceInSeconds(deathDate, new Date()))
  );

  React.useEffect(() => {
    const tick = () => {
      setSeconds(Math.max(0, differenceInSeconds(deathDate, new Date())));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deathDate, deathMs]);

  return (
    <div className="flex w-full min-w-0 items-baseline justify-end gap-2 px-1">
      <span className={className}>{formatInteger(seconds)}</span>
      {suffixClassName ? (
        <span className={suffixClassName}>SEG</span>
      ) : (
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          s
        </span>
      )}
    </div>
  );
}

export function LiveCountdown({
  deathDate,
}: LiveCountdownProps) {
  return (
    <PremiumFrame className="rounded-[0.55rem] bg-gradient-to-br from-marfil/[0.09] via-marfil/[0.035] to-marfil/[0.012]">
      <div
        className="relative grid min-h-[86px] min-w-0 grid-cols-[150px_minmax(0,1fr)] items-center rounded-[0.5rem] bg-card px-4 shadow-[inset_0_1px_0_hsl(var(--marfil)_/_0.035)] sm:grid-cols-[175px_minmax(0,1fr)] sm:px-5"
        aria-live="polite"
      >
        <div className="absolute inset-y-0 left-0 w-[175px] border-r border-border bg-background/25" />
        <div className="relative z-10 flex h-full min-w-0 flex-col justify-center pr-4">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.34em] text-oxido/90">
            Temporis Cursus
          </span>
          <span className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">
            Reliquum Vitæ
          </span>
        </div>
        <div className="relative z-10 flex min-w-0 items-baseline justify-end pl-4">
          <SecondsTicker
            deathDate={deathDate}
            className="shrink whitespace-nowrap pl-1 font-mono text-[clamp(1.8rem,3.05vw,2.62rem)] font-medium leading-none tabular-nums tracking-[0.07em] text-marfil"
            suffixClassName="shrink-0 font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-oxido/75"
          />
        </div>
      </div>
    </PremiumFrame>
  );
}
