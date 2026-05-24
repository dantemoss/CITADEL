"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

import {
  pageEnterReducedVariants,
  pageEnterVariants,
} from "@/lib/motion";

export function PageEnter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="visible"
      variants={reduced ? pageEnterReducedVariants : pageEnterVariants}
    >
      {children}
    </motion.div>
  );
}
