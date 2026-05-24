import type { Transition, Variants } from "framer-motion";

/** Easing editorial — suave, sin rebote exagerado */
export const citadelEase = [0.25, 0.1, 0.25, 1] as const;

export const citadelDuration = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.55,
} as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: citadelDuration.normal, ease: citadelEase },
  },
};

export const fadeUpReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: citadelDuration.fast },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerContainerReducedVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: citadelDuration.normal, ease: citadelEase },
  },
};

export const staggerItemReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: citadelDuration.fast },
  },
};

export const pageEnterVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: citadelDuration.normal, ease: citadelEase },
  },
};

export const pageEnterReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: citadelDuration.fast },
  },
};

export const sidebarSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
};
