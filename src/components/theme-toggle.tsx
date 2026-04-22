"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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
          "h-9 w-full max-w-[10rem] rounded-md border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03]",
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
        "flex w-full max-w-[10rem] items-center justify-center gap-2 rounded-md border border-black/[0.1] bg-white/70 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] transition-colors hover:border-oxido/40 hover:bg-white dark:border-white/[0.1] dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_0_rgba(235,229,223,0.06)] dark:hover:border-oxido/50 dark:hover:bg-white/[0.07]",
        className
      )}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? (
        <>
          <Sun className="h-3.5 w-3.5 shrink-0 text-oxido" />
          <span>Marfil</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 shrink-0 text-oxido" />
          <span>Carbón</span>
        </>
      )}
    </button>
  );
}
