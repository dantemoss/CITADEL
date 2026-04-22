"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { WEEKS_PER_YEAR, weekCoordinates } from "./utils";

const CELL = 3;
const GAP = 2;
const STRIDE = CELL + GAP;

type LifeGridProps = {
  weeksElapsed: number;
  totalWeeks: number;
  lifespanYears: number;
};

function drawGrid(
  ctx: CanvasRenderingContext2D,
  cssW: number,
  cssH: number,
  dpr: number,
  isDark: boolean,
  weeksElapsed: number,
  totalWeeks: number
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const palette = isDark
    ? {
        past: "#18181b",
        current: "#fafafa",
        futureFill: "#09090b",
        futureBorder: "#3f3f46",
        glow: "rgba(255,255,255,0.4)",
      }
    : {
        past: "#d4d4d8",
        current: "#18181b",
        futureFill: "#f4f4f5",
        futureBorder: "#d4d4d8",
        glow: "rgba(0,0,0,0.22)",
      };

  for (let i = 0; i < totalWeeks; i++) {
    const c = i % WEEKS_PER_YEAR;
    const r = Math.floor(i / WEEKS_PER_YEAR);
    const x = c * STRIDE;
    const y = r * STRIDE;
    const state =
      i < weeksElapsed ? "past" : i === weeksElapsed ? "current" : "future";

    if (state === "past") {
      ctx.fillStyle = palette.past;
      ctx.fillRect(x, y, CELL, CELL);
    } else if (state === "current") {
      ctx.save();
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = 6;
      ctx.fillStyle = palette.current;
      ctx.fillRect(x, y, CELL, CELL);
      ctx.restore();
    } else {
      ctx.fillStyle = palette.futureFill;
      ctx.fillRect(x, y, CELL, CELL);
      ctx.strokeStyle = palette.futureBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
    }
  }
}

export const LifeGrid = React.memo(function LifeGrid({
  weeksElapsed,
  totalWeeks,
  lifespanYears,
}: LifeGridProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  const rows = Math.ceil(totalWeeks / WEEKS_PER_YEAR);
  const cssW = WEEKS_PER_YEAR * CELL + (WEEKS_PER_YEAR - 1) * GAP;
  const cssH = rows * CELL + (rows - 1) * GAP;
  const isDark = resolvedTheme !== "light";

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      2
    );
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    drawGrid(ctx, cssW, cssH, dpr, isDark, weeksElapsed, totalWeeks);
  }, [weeksElapsed, totalWeeks, isDark, cssW, cssH]);

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / STRIDE);
      const row = Math.floor(y / STRIDE);
      if (col < 0 || col >= WEEKS_PER_YEAR || row < 0 || row >= rows) {
        setHoverIdx(null);
        return;
      }
      const idx = row * WEEKS_PER_YEAR + col;
      const next = idx >= 0 && idx < totalWeeks ? idx : null;
      setHoverIdx((prev) => (prev === next ? prev : next));
    },
    [rows, totalWeeks]
  );

  const hoverLabel =
    hoverIdx === null
      ? null
      : (() => {
          const { yearOfLife, weekOfYear } = weekCoordinates(hoverIdx);
          return `Semana ${weekOfYear}, Año ${yearOfLife}`;
        })();

  const CELL_LEGEND = "h-[3px] w-[3px] shrink-0 rounded-[0.5px]";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-0.5 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        <span>semana I</span>
        <span className="normal-case text-[11px] font-normal italic tracking-normal text-muted-foreground">
          Tabula vitæ ·{" "}
          <span className="font-mono not-italic tabular-nums">
            {lifespanYears}
          </span>
          a × 52s
        </span>
        <span>semana {WEEKS_PER_YEAR}</span>
      </div>

      <div className="inline-block max-w-full overflow-x-auto">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Grilla de vida: ${totalWeeks} semanas`}
          className="max-w-full cursor-crosshair touch-none"
          onMouseMove={onMove}
          onMouseLeave={() => setHoverIdx(null)}
        />
      </div>

      {hoverLabel ? (
        <p className="text-center font-mono text-[10px] text-muted-foreground">
          {hoverLabel}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-0.5 font-sans text-[10px] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className={cn(CELL_LEGEND, "bg-zinc-300 dark:bg-zinc-900")} />
          transcurrido
        </span>
        <span className="flex items-center gap-2">
          <span
            className={cn(
              CELL_LEGEND,
              "bg-zinc-900 shadow-[0_0_12px_rgba(0,0,0,0.25)] dark:bg-white dark:shadow-[0_0_12px_rgba(255,255,255,0.45)]"
            )}
          />
          nunc
        </span>
        <span className="flex items-center gap-2">
          <span
            className={cn(
              CELL_LEGEND,
              "border border-zinc-300/80 bg-zinc-100 dark:border-zinc-900/50 dark:bg-zinc-950"
            )}
          />
          quod restat
        </span>
      </div>
    </div>
  );
}, areEqual);

function areEqual(
  a: LifeGridProps,
  b: LifeGridProps
): boolean {
  return (
    a.weeksElapsed === b.weeksElapsed &&
    a.totalWeeks === b.totalWeeks &&
    a.lifespanYears === b.lifespanYears
  );
}
