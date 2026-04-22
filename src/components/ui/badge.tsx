import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border border-black/[0.08] bg-zinc-100/80 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-white/[0.08] dark:bg-zinc-950/60 dark:text-zinc-200 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:focus:ring-white/15 dark:focus:ring-offset-0 dark:focus:ring-offset-transparent",
  {
    variants: {
      variant: {
        default:
          "border-zinc-200 bg-zinc-900 text-zinc-50 shadow-none hover:bg-zinc-800 dark:border-white/[0.1] dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white",
        secondary:
          "border-black/[0.06] bg-white/60 text-zinc-700 backdrop-blur-md dark:border-white/[0.06] dark:bg-zinc-950/50 dark:text-zinc-300",
        destructive:
          "border-red-500/20 bg-red-950/50 text-red-100 hover:bg-red-950/70",
        success:
          "border-emerald-600/20 bg-emerald-50/90 text-emerald-950 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:border-emerald-500/15 dark:bg-emerald-950/35 dark:text-emerald-100/95 dark:shadow-[inset_0_1px_0_0_rgba(52,211,153,0.12)]",
        warning:
          "border-amber-500/25 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
        outline:
          "border-black/[0.12] bg-transparent text-foreground dark:border-white/[0.1] dark:text-zinc-200",
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
