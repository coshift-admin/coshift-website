"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Pans a site screenshot gently inside its browser frame as the card scrolls
 * past — like glancing down the page. Transform-only; still for reduced motion.
 */
export function ScrollPan({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y, scale: 1.12 }}>
        {children}
      </motion.div>
    </div>
  );
}
