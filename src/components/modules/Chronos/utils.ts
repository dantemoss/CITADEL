import {
  addYears,
  differenceInDays,
  differenceInMilliseconds,
  differenceInSeconds,
  differenceInWeeks,
} from "date-fns";

export const WEEKS_PER_YEAR = 52;

export type LifeStats = {
  now: Date;
  birth: Date;
  death: Date;
  totalWeeks: number;
  weeksElapsed: number;
  weeksRemaining: number;
  daysRemaining: number;
  secondsRemaining: number;
  progressPct: number;
};

export function computeLifeStats(
  birthDate: Date,
  lifespanYears: number,
  now: Date = new Date()
): LifeStats {
  const death = addYears(birthDate, lifespanYears);
  const totalWeeks = lifespanYears * WEEKS_PER_YEAR;

  const weeksElapsedRaw = differenceInWeeks(now, birthDate);
  const weeksElapsed = Math.max(0, Math.min(totalWeeks, weeksElapsedRaw));
  const weeksRemaining = Math.max(0, totalWeeks - weeksElapsed);

  const daysRemaining = Math.max(0, differenceInDays(death, now));
  const secondsRemaining = Math.max(0, differenceInSeconds(death, now));

  const totalMs = differenceInMilliseconds(death, birthDate);
  const elapsedMs = differenceInMilliseconds(now, birthDate);
  const progressPct = Math.max(0, Math.min(100, (elapsedMs / totalMs) * 100));

  return {
    now,
    birth: birthDate,
    death,
    totalWeeks,
    weeksElapsed,
    weeksRemaining,
    daysRemaining,
    secondsRemaining,
    progressPct,
  };
}

export function weekCoordinates(index: number): {
  yearOfLife: number;
  weekOfYear: number;
} {
  return {
    yearOfLife: Math.floor(index / WEEKS_PER_YEAR) + 1,
    weekOfYear: (index % WEEKS_PER_YEAR) + 1,
  };
}

export function formatInteger(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.floor(n));
}
