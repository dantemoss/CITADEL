"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { citadelDuration, citadelEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-10 w-full max-w-none rounded-full border border-border bg-popover",
          className
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex w-full max-w-none items-center justify-center gap-2 rounded-full border border-border bg-popover px-4 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-foreground transition-colors hover:bg-secondary",
        className
      )}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 20 }}
            transition={{ duration: citadelDuration.fast, ease: citadelEase }}
            className="flex items-center gap-2"
          >
            <Sun className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span>Claro</span>
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 20 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -20 }}
            transition={{ duration: citadelDuration.fast, ease: citadelEase }}
            className="flex items-center gap-2"
          >
            <Moon className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span>Oscuro</span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
