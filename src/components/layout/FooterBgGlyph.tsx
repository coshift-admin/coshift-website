"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Footer ambient glyph — a giant shift mark drifts up and rotates slightly
 * as the user scrolls into the footer. Scroll-tied, so it never moves when
 * the user is idle (per brief: motion is purposeful, idle = still).
 */
export function FooterBgGlyph() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-10%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-12, 4]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.06, 0.08]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{ y, rotate, opacity }}
        className="absolute -right-32 bottom-0 h-[120%]"
      >
        <ShiftGlyph className="h-full w-auto text-[var(--coshift-cyan)]" />
      </motion.div>
    </div>
  );
}
