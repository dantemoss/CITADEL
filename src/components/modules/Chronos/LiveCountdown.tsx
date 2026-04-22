"use client";

import * as React from "react";
import { differenceInSeconds } from "date-fns";
import { Hourglass } from "lucide-react";

import { PremiumFrame } from "@/components/ui/premium-frame";

import { formatInteger } from "./utils";

type LiveCountdownProps = {
  deathDate: Date;
  prominence?: "hero" | "compact";
};

const iconBox =
  "rounded-lg border border-black/[0.08] bg-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]";

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
    <div className="flex items-baseline gap-1.5 sm:gap-2">
      <span className={className}>{formatInteger(seconds)}</span>
      {suffixClassName ? (
        <span className={suffixClassName}>seg</span>
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
  prominence = "hero",
}: LiveCountdownProps) {
  if (prominence === "compact") {
    return (
      <PremiumFrame>
        <div
          className="flex items-center justify-between gap-4 px-5 py-4"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5">
            <Hourglass className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-sans text-sm text-muted-foreground">
              Reliquum vitæ
            </span>
          </div>
          <SecondsTicker
            deathDate={deathDate}
            className="font-mono text-lg font-medium tabular-nums tracking-tight text-foreground"
          />
        </div>
      </PremiumFrame>
    );
  }

  return (
    <PremiumFrame>
      <div className="relative px-6 py-7 sm:px-8 sm:py-8" aria-live="polite">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_85%_20%,rgba(0,0,0,0.04),transparent_55%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_85%_20%,rgba(255,255,255,0.06),transparent_55%)]"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center ${iconBox}`}
            >
              <Hourglass className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex max-w-lg flex-col gap-1.5">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                Memento mori
              </span>
              <p className="font-sans text-2xl font-semibold leading-tight tracking-tighter text-foreground sm:text-3xl">
                Lo que resta
              </p>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Segundos estimados hasta el término de la vida, medidos en
                silencio.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
            <span className="font-sans text-xs text-muted-foreground">
              Reliquum vitæ
            </span>
            <SecondsTicker
              deathDate={deathDate}
              className="font-mono text-4xl font-medium tabular-nums tracking-tighter text-foreground sm:text-5xl"
              suffixClassName="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </PremiumFrame>
  );
}
