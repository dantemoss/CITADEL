"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  staggerContainerReducedVariants,
  staggerContainerVariants,
  staggerItemReducedVariants,
  staggerItemVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Stagger({ children, className }: StaggerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={
        reduced ? staggerContainerReducedVariants : staggerContainerVariants
      }
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function StaggerItem({
  children,
  className,
  hover = false,
}: StaggerItemProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={reduced ? staggerItemReducedVariants : staggerItemVariants}
      whileHover={hover && !reduced ? { y: -1 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
