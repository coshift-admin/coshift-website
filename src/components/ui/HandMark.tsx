"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/** Matches --intro-delay: how long the first-visit preloader holds the page. */
const INTRO_S = 1.35;

/**
 * A coral, hand-drawn underline that scribbles itself under a word — the same
 * pen as HandNote, used to mark "shift" (the brand word) where it matters.
 * Purely decorative: the word stays plain text for readers and crawlers.
 */
export function HandMark({
  children,
  delay = 0,
  afterIntro = false,
}: {
  children: ReactNode;
  /** Seconds after the word enters the viewport. */
  delay?: number;
  /** Also wait for the first-visit preloader (for the home hero). */
  afterIntro?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotionPref();
  const drawn = useMotionValue(0);
  const opacity = useTransform(drawn, [0, 0.02], [0, 1]);

  useEffect(() => {
    if (reduced) {
      drawn.set(1);
      return;
    }
    if (!inView) return;
    const preloading = afterIntro && document.documentElement.dataset.preloaded === undefined;
    const controls = animate(drawn, 1, {
      duration: 0.8,
      delay: delay + (preloading ? INTRO_S : 0),
      ease: [0.45, 0, 0.25, 1],
    });
    return () => controls.stop();
  }, [reduced, inView, delay, afterIntro, drawn]);

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.12em] left-[-2%] h-[0.28em] w-[104%] overflow-visible text-[var(--hand)] rtl:-scale-x-100"
      >
        <motion.path
          d="M3 13C40 6 88 5 128 8C152 10 172 11 197 6M18 17C62 12 112 12 170 14"
          fill="none"
          stroke="currentColor"
          strokeWidth={4.5}
          strokeLinecap="round"
          style={{ pathLength: drawn, opacity }}
        />
      </svg>
    </span>
  );
}
