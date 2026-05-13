"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─────────────── <Reveal> — block-level fade + lift ───────────────
   Generic wrapper. Use for any element you want to slide+fade in once,
   when at least `amount` of it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  amount = 0.3,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
  className?: string;
  // SSR-safe: a few semantic tags only. Default is <div>.
  as?: "div" | "section" | "article" | "header" | "footer" | "li";
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
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </MotionAs>
  );
}

/* ─────────────── <RevealWords> — word-by-word mask ───────────────
   Splits text into words and reveals them in sequence with a translateY
   mask. Use for headlines / kickers — anything where the wording itself
   benefits from being read in order. */
export function RevealWords({
  text,
  className,
  delay = 0,
  staggerChildren = 0.04,
  amount = 0.5,
  yFrom = "110%",
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  amount?: number;
  yFrom?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  const reduced = useReducedMotionPref();
  const words = text.split(/(\s+)/);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren: delay },
    },
  };
  const child: Variants = {
    hidden: { y: yFrom },
    show: {
      y: "0%",
      transition: { duration: 0.65, ease: EASE },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {words.map((w, i) =>
        w.trim() === "" ? (
          <span key={i}> </span>
        ) : (
          <span
            key={i}
            className="inline-block overflow-hidden align-baseline"
          >
            <motion.span variants={child} className="inline-block">
              {w}
            </motion.span>
          </span>
        ),
      )}
    </motion.span>
  );
}

/* ─────────────── <RevealLines> — multi-line block reveal ───────────────
   For paragraphs / leads. Cheaper than word-by-word, but still gives a
   theatrical "lifting into place" feel. Splits on explicit \n only. */
export function RevealLines({
  lines,
  className,
  delay = 0,
  staggerChildren = 0.08,
  amount = 0.3,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  staggerChildren?: number;
  amount?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  const reduced = useReducedMotionPref();

  if (reduced) {
    return (
      <span className={className}>
        {lines.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren, delayChildren: delay } },
      }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.7, ease: EASE },
              },
            }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
