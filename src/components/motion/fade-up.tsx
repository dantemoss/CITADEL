"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  citadelDuration,
  citadelEase,
  fadeUpReducedVariants,
  fadeUpVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type FadeUpProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeUp({ children, className, delay = 0 }: FadeUpProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reduced ? fadeUpReducedVariants : fadeUpVariants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/** Entrada mínima para secciones internas (sin desplazamiento en reduced motion). */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? citadelDuration.fast : citadelDuration.normal,
        ease: citadelEase,
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
