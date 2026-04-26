"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { WEEKS_PER_YEAR, weekCoordinates } from "./utils";

const CELL_H = 6;
const GAP_Y = 2;
const STRIDE_Y = CELL_H + GAP_Y;

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
  totalWeeks: number,
  cellW: number,
  gapX: number
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const palette = isDark
    ? {
        past: "hsl(220 8% 24%)",
        current: "hsl(36 18% 84%)",
        futureFill: "hsl(220 16% 8%)",
        futureBorder: "hsl(220 8% 22%)",
        glow: "hsl(36 18% 84% / 0.42)",
      }
    : {
        past: "hsl(220 7% 74%)",
        current: "hsl(220 18% 16%)",
        futureFill: "hsl(36 16% 89%)",
        futureBorder: "hsl(36 9% 76%)",
        glow: "hsl(220 18% 16% / 0.18)",
      };

  for (let i = 0; i < totalWeeks; i++) {
    const c = i % WEEKS_PER_YEAR;
    const r = Math.floor(i / WEEKS_PER_YEAR);
    const strideX = cellW + gapX;
    const x = c * strideX;
    const y = r * STRIDE_Y;
    const state =
      i < weeksElapsed ? "past" : i === weeksElapsed ? "current" : "future";

    if (state === "past") {
      ctx.fillStyle = palette.past;
      ctx.fillRect(x, y, cellW, CELL_H);
    } else if (state === "current") {
      ctx.save();
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = 11;
      ctx.fillStyle = palette.current;
      ctx.fillRect(x, y, cellW, CELL_H);
      ctx.restore();
    } else {
      ctx.fillStyle = palette.futureFill;
      ctx.fillRect(x, y, cellW, CELL_H);
      ctx.strokeStyle = palette.futureBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, Math.max(1, cellW - 1), CELL_H - 1);
    }
  }
}

export const LifeGrid = React.memo(function LifeGrid({
  weeksElapsed,
  totalWeeks,
  lifespanYears,
}: LifeGridProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const [availableWidth, setAvailableWidth] = React.useState(920);

  const rows = Math.ceil(totalWeeks / WEEKS_PER_YEAR);
  const gapX = 4;
  const cssW = Math.max(760, Math.floor(availableWidth));
  const cssH = rows * CELL_H + (rows - 1) * GAP_Y;
  const cellW = Math.max(
    10,
    (cssW - (WEEKS_PER_YEAR - 1) * gapX) / WEEKS_PER_YEAR
  );
  const isDark = resolvedTheme !== "light";

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry.contentRect.width);
      if (nextWidth > 0) {
        setAvailableWidth(nextWidth);
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
    canvas.style.width = "100%";
    canvas.style.height = `${cssH}px`;

    drawGrid(
      ctx,
      cssW,
      cssH,
      dpr,
      isDark,
      weeksElapsed,
      totalWeeks,
      cellW,
      gapX
    );
  }, [weeksElapsed, totalWeeks, isDark, cssW, cssH, cellW, gapX]);

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (cssW / rect.width);
      const y = (e.clientY - rect.top) * (cssH / rect.height);
      const col = Math.floor(x / (cellW + gapX));
      const row = Math.floor(y / STRIDE_Y);
      if (col < 0 || col >= WEEKS_PER_YEAR || row < 0 || row >= rows) {
        setHoverIdx(null);
        return;
      }
      const idx = row * WEEKS_PER_YEAR + col;
      const next = idx >= 0 && idx < totalWeeks ? idx : null;
      setHoverIdx((prev) => (prev === next ? prev : next));
    },
    [cellW, cssH, cssW, gapX, rows, totalWeeks]
  );

  const hoverLabel =
    hoverIdx === null
      ? null
      : (() => {
          const { yearOfLife, weekOfYear } = weekCoordinates(hoverIdx);
          return `Semana ${weekOfYear}, Año ${yearOfLife}`;
        })();

  const CELL_LEGEND = "h-[7px] w-[7px] shrink-0 rounded-[1px]";
  const xMarks = Array.from({ length: 14 }, (_, index) =>
    index === 13 ? 52 : index * 4
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.24em] text-oxido/85">
            Tabula Vitae
          </span>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground/75">
            · {totalWeeks.toLocaleString("en-US")} semanas
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[0.57rem] uppercase tracking-[0.22em] text-muted-foreground/80">
          <span className="flex items-center gap-2">
            <span className={cn(CELL_LEGEND, "bg-acero/45")} />
            Quod transactum
          </span>
          <span className="flex items-center gap-2 text-marfil/90">
            <span
              className={cn(
                CELL_LEGEND,
                "bg-marfil shadow-[0_0_14px_hsl(var(--marfil)_/_0.28)]"
              )}
            />
            Nunc
          </span>
          <span className="flex items-center gap-2">
            <span
              className={cn(
                CELL_LEGEND,
                "border border-border bg-background/80"
              )}
            />
            Quod restat
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[38px_minmax(0,1fr)] gap-3">
        <div className="relative font-mono text-[0.7rem] tabular-nums text-muted-foreground">
          {[80, 70, 60, 50, 40, 30, 20, 10, 0].map((age) => (
            <span
              key={age}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${100 - (age / lifespanYears) * 100}%` }}
            >
              {age}
            </span>
          ))}
          <span className="absolute left-0 top-1/2 -translate-x-5 -translate-y-1/2 -rotate-90 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-oxido/80">
            Aetas ({lifespanYears})
          </span>
        </div>

        <div ref={containerRef} className="min-w-0">
          <div className="w-full overflow-hidden">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Grilla de vida: ${totalWeeks} semanas`}
              className="block w-full cursor-crosshair touch-none"
              onMouseMove={onMove}
              onMouseLeave={() => setHoverIdx(null)}
            />
          </div>

          <div className="mt-2 grid grid-cols-[repeat(14,minmax(0,1fr))] font-mono text-[0.68rem] tabular-nums text-muted-foreground">
            {xMarks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
          <div className="mt-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.28em] text-oxido/70">
            Anni · (52)
          </div>
        </div>
      </div>

      {hoverLabel ? (
        <p className="text-center font-mono text-[0.62rem] text-muted-foreground">
          {hoverLabel}
        </p>
      ) : (
        <p className="text-center font-mono text-[0.62rem] text-muted-foreground/50">
          &nbsp;
        </p>
      )}
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
