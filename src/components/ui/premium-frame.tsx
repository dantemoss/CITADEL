import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PremiumFrame — marco tipo “placa” del manual de marca:
 * borde marfil muy tenue sobre piedra/carbón. En modo claro,
 * borde carbón tenue sobre marfil.
 */
const frame =
  "rounded-xl bg-gradient-to-br from-carbon/10 via-carbon/[0.04] to-carbon/[0.02] p-px shadow-[0_0_0_1px_hsl(var(--carbon)_/_0.06)] dark:from-marfil/10 dark:via-marfil/[0.04] dark:to-marfil/[0.015] dark:shadow-[0_0_0_1px_hsl(var(--marfil)_/_0.04)]";

const fill =
  "rounded-[11px] bg-card/90 backdrop-blur-md shadow-[inset_0_1px_0_0_hsl(var(--carbon)_/_0.05),inset_0_0_48px_hsl(var(--carbon)_/_0.02)] dark:bg-piedra/[0.78] dark:shadow-[inset_0_1px_0_0_hsl(var(--marfil)_/_0.055),inset_0_0_48px_hsl(var(--marfil)_/_0.018)]";

type PremiumFrameProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const PremiumFrame = React.forwardRef<HTMLDivElement, PremiumFrameProps>(
  function PremiumFrame({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(frame, className)} {...props}>
        <div className={cn(fill, "h-full min-h-0")}>{children}</div>
      </div>
    );
  }
);
PremiumFrame.displayName = "PremiumFrame";

export const premiumFrameClass = frame;
export const premiumFillClass = fill;
