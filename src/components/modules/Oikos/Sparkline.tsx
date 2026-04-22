"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SparklineProps = {
  data: number[];
  className?: string;
  width?: number;
  height?: number;
};

/** Sparkline SVG sin dependencias; color según tendencia (esmeralda / rosa suave). */
export function Sparkline({
  data,
  className,
  width = 88,
  height = 28,
}: SparklineProps) {
  const { path, up } = React.useMemo(() => {
    if (data.length < 2) return { path: "", up: true };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const pad = 2;
    const w = width - pad * 2;
    const h = height - pad * 2;
    const span = max - min || 1;
    const pts = data.map((v, i) => {
      const x = pad + (i / (data.length - 1)) * w;
      const y = pad + h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const d = `M ${pts.join(" L ")}`;
    const up = data[data.length - 1] >= data[0];
    return { path: d, up };
  }, [data, width, height]);

  const stroke = up ? "#10b981" : "#fb7185";

  if (!path) return <div className={cn("h-7 w-[5.5rem]", className)} />;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-7 w-[5.5rem] shrink-0", className)}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  );
}
