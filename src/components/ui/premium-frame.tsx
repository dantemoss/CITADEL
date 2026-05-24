import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PremiumFrame — “tabla pintada” Romanticismo · Midnight Cobalt.
 *
 * Antes era una hoja plana; ahora es una superficie con un gradiente
 * vertical interno muy sutil (top ligeramente más claro, bottom más
 * profundo) que da textura de óleo sin glassmorphism ni brillos.
 *
 * Estructura:
 *   - Capa exterior: borde 1px + sombra paper.
 *   - Capa interior: bg-card sobre gradiente lineal (sentido de luz).
 *
 * El gradiente usa solo tokens (--foreground/--card/--cobalt) → se
 * adapta a ambos modos automáticamente.
 */
const frame =
  "relative rounded-[var(--radius)] border border-border bg-card shadow-paper transition-all duration-300";

const fill =
  "relative rounded-[calc(var(--radius)-1px)] h-full min-h-0 overflow-hidden " +
  "bg-[linear-gradient(180deg,hsl(var(--foreground)/0.02)_0%,transparent_42%,hsl(var(--cobalt)/0.05)_100%)] " +
  "dark:bg-[linear-gradient(180deg,hsl(var(--foreground)/0.025)_0%,transparent_38%,hsl(var(--cobalt)/0.12)_100%)]";

type PremiumFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const PremiumFrame = React.forwardRef<HTMLDivElement, PremiumFrameProps>(
  function PremiumFrame({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(frame, className)} {...props}>
        <div className={fill}>{children}</div>
      </div>
    );
  }
);
PremiumFrame.displayName = "PremiumFrame";

export const premiumFrameClass = frame;
export const premiumFillClass = fill;
