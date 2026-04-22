"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-900/10 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-white/[0.06] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 rounded-full bg-zinc-900 shadow-[0_0_12px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(0,0,0,0.15)] transition-all duration-700 ease-out dark:bg-zinc-100 dark:shadow-[0_0_16px_rgba(255,255,255,0.35),inset_0_1px_0_0_rgba(255,255,255,0.5)]"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
