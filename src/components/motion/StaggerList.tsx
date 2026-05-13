"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * StaggerList — fade + slide-in for each direct child, with a configurable
 * stagger. Wraps an existing list (`<ul>`/`<ol>`/grid `<div>`) and animates
 * its children on viewport entry.
 *
 * Use for: deliverables lists, module/tech chips, principles, work index rows.
 */
export function StaggerList({
  children,
  as: As = "ul",
  className,
  staggerChildren = 0.08,
  y = 20,
  duration = 0.6,
  amount = 0.2,
  initialDelay = 0,
}: {
  children: ReactNode;
  as?: "ul" | "ol" | "div";
  className?: string;
  staggerChildren?: number;
  y?: number;
  duration?: number;
  amount?: number;
  initialDelay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  const reduced = useReducedMotionPref();
  const MotionAs = motion[As];

  if (reduced) {
    return <As className={className}>{children}</As>;
  }

  return (
    <MotionAs
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren, delayChildren: initialDelay },
        },
      }}
    >
      {wrapChildren(children, y, duration)}
    </MotionAs>
  );
}

function wrapChildren(children: ReactNode, y: number, duration: number) {
  const variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: EASE },
    },
  };
  // Wrap each direct child in a motion.div with variants. Using a fragment-like
  // map preserves keys when callers pass an array.
  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <motion.div
        key={(child as { key?: string | number })?.key ?? i}
        variants={variants}
        className="contents"
      >
        {child}
      </motion.div>
    ));
  }
  return (
    <motion.div variants={variants} className="contents">
      {children}
    </motion.div>
  );
}
