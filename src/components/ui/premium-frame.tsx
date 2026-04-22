import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PremiumFrame — marco tipo “placa” del manual de marca:
 * borde marfil muy tenue sobre piedra/carbón. En modo claro,
 * borde carbón tenue sobre marfil.
 */
const frame =
  "rounded-xl bg-gradient-to-br from-black/[0.06] via-black/[0.03] to-black/[0.01] p-px shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:from-white/[0.10] dark:via-white/[0.04] dark:to-white/[0.015] dark:shadow-[0_0_0_1px_rgba(235,229,223,0.04)]";

const fill =
  "rounded-[11px] bg-card/90 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(0,0,0,0.05),inset_0_0_48px_rgba(0,0,0,0.02)] dark:bg-piedra/70 dark:shadow-[inset_0_1px_0_0_rgba(235,229,223,0.06),inset_0_0_48px_rgba(235,229,223,0.02)]";

type PremiumFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const PremiumFrame = React.forwardRef<HTMLDivElement, PremiumFrameProps>(
  function PremiumFrame({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(frame, className)} {...props}>
        <div className={cn(fill, "min-h-0")}>{children}</div>
      </div>
    );
  }
);
PremiumFrame.displayName = "PremiumFrame";

export const premiumFrameClass = frame;
export const premiumFillClass = fill;
