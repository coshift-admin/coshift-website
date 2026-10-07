"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { useLocale } from "next-intl";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * A handwritten aside — the DS accent face (Caveat; Lemonada in Arabic) in the
 * warm coral. When it scrolls into view the words are "written" (a wipe that
 * follows the pen in the reading direction), then the hand-drawn arrow draws
 * itself. DS rule: short (≤ ~6 words), human, never UI or numbers — and
 * sparing: one per section at most.
 *
 * Arrow names are logical: "start"/"end" follow the reading direction, and the
 * whole arrow mirrors in RTL. Colour comes from `--hand` (coral on dark,
 * deep coral on light surfaces).
 */
export type HandArrow = "down" | "down-start" | "down-end" | "up-start" | "up-end" | "start" | "end";

const ARROWS: Record<HandArrow, { box: string; w: number; h: number; d: string; head: string }> = {
  down: { box: "0 0 40 60", w: 28, h: 42, d: "M22 4C30 18 12 28 20 52", head: "M12 45L20 54L27 46" },
  "down-start": { box: "0 0 70 60", w: 50, h: 42, d: "M62 6C52 4 30 10 22 28C17 38 16 46 14 52", head: "M7 44L14 53L22 46" },
  "down-end": { box: "0 0 70 60", w: 50, h: 42, d: "M8 6C18 4 40 10 48 28C53 38 54 46 56 52", head: "M48 46L56 53L63 44" },
  "up-start": { box: "0 0 70 60", w: 50, h: 42, d: "M62 54C50 56 28 50 20 32C16 22 16 14 14 8", head: "M7 16L14 7L22 14" },
  "up-end": { box: "0 0 70 60", w: 50, h: 42, d: "M8 54C20 56 42 50 50 32C54 22 54 14 56 8", head: "M48 14L56 7L63 16" },
  start: { box: "0 0 70 40", w: 52, h: 30, d: "M66 28C50 12 26 10 8 20", head: "M15 12L7 20L16 27" },
  end: { box: "0 0 70 40", w: 52, h: 30, d: "M4 28C20 12 44 10 62 20", head: "M55 12L63 20L54 27" },
};

const LAYOUT: Record<HandArrow, string> = {
  down: "flex-col items-center",
  "down-start": "flex-col items-start",
  "down-end": "flex-col items-end",
  "up-start": "flex-col-reverse items-start",
  "up-end": "flex-col-reverse items-end",
  start: "flex-row-reverse items-center",
  end: "flex-row items-center",
};

export function HandNote({
  children,
  arrow = "down",
  className,
  style,
  delay = 0,
  play,
}: {
  children: string;
  arrow?: HandArrow;
  className?: string;
  style?: CSSProperties;
  /** Seconds to wait after the note enters the viewport. */
  delay?: number;
  /** Override the in-view trigger, e.g. to wait for a scroll-driven reveal. */
  play?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduced = useReducedMotionPref();
  const show = reduced || (play ?? inView);
  const a = ARROWS[arrow];
  const rtl = useLocale() === "ar";
  // The pen moves with the reading direction: left→right, or right→left in Arabic.
  const hidden = rtl ? "inset(-20% 0 -20% 100%)" : "inset(-20% 100% -20% 0)";
  const written = "inset(-20% 0% -20% 0%)";

  return (
    <span
      ref={ref}
      style={style}
      className={cn("pointer-events-none inline-flex gap-1 text-[var(--hand)]", LAYOUT[arrow], className)}
    >
      <motion.span
        className="font-hand block -rotate-3 whitespace-nowrap text-[1.5rem] leading-none rtl:rotate-3"
        initial={reduced ? false : { clipPath: hidden, opacity: 0.2 }}
        animate={show ? { clipPath: written, opacity: 1 } : undefined}
        transition={{ duration: 0.9, delay, ease: [0.45, 0, 0.25, 1] }}
      >
        {children}
      </motion.span>
      <svg
        aria-hidden
        viewBox={a.box}
        width={a.w}
        height={a.h}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 overflow-visible rtl:-scale-x-100"
      >
        <motion.path
          d={a.d}
          initial={reduced ? false : { pathLength: 0 }}
          animate={show ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.6, delay: delay + 0.8, ease: [0.2, 0, 0.1, 1] }}
        />
        <motion.path
          d={a.head}
          initial={reduced ? false : { opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 0.2, delay: delay + 1.35 }}
        />
      </svg>
    </span>
  );
}
