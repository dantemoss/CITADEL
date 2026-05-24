import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Badge — etiqueta editorial Dualite.
 *
 * Bordes arena, fondos crema, tipografía sans 500 con tracking eyebrow.
 * Variantes semánticas (success/warning/destructive) usan tintes muy lavados
 * para mantenerse dentro del registro papel.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border bg-card px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/15 focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-foreground/15 bg-foreground text-background hover:opacity-90",
        secondary:
          "border-border bg-card text-muted-foreground",
        destructive:
          "border-destructive/25 bg-destructive/[0.08] text-destructive",
        success:
          "border-emerald-700/20 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200",
        warning:
          "border-amber-700/25 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200",
        outline:
          "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
