import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botones — lenguaje Dualite warm-paper.
 *
 * - default (CTA): pill tinta sobre crema, sin gradiente, hover opacity.
 * - secondary    : pill papel con borde arena.
 * - outline      : rectangular suave para toolbars.
 * - ghost        : acción ligera dentro de cards y tablas.
 * - link         : subrayado clásico editorial.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // CTA principal — Liquid Glass cyan tenue (estilo iOS 26).
        // Glassmorphism con backdrop-blur, gradiente vertical traslúcido,
        // borde fino spray y highlight superior interno. Sin azul saturado.
        default: "liquid-glass",
        // Alias semántico: igual que default pero explícito en el código.
        glass: "liquid-glass",
        destructive:
          "rounded-full bg-destructive text-destructive-foreground shadow-[0_1px_2px_hsl(var(--foreground)/0.18)] hover:opacity-90",
        outline:
          "rounded-md border border-border bg-popover text-foreground hover:bg-secondary hover:border-foreground/30",
        secondary:
          "rounded-full border border-border bg-popover text-foreground hover:bg-secondary",
        ghost:
          "rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-11 px-7 text-[15px]",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
