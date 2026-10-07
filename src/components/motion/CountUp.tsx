"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Counts a real figure up from 0 the first time it scrolls into view.
 * Server-renders the final value (no layout shift, correct without JS);
 * reduced motion skips the count. Only for founder-cleared figures.
 */
export function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const target = Number.parseInt(value, 10);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotionPref();
  const [shown, setShown] = useState(value);

  // If the figure starts below the fold, park it at 0 now so the count
  // doesn't flash "14 → 0 → 14" when it arrives. (SSR and no-JS keep the
  // real value; figures already on screen at load are left alone.)
  useEffect(() => {
    const el = ref.current;
    if (reduced || !el || !Number.isFinite(target)) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setShown("0");
  }, [reduced, target]);

  useEffect(() => {
    if (!inView || reduced || !Number.isFinite(target)) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(String(Math.round(eased * target)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, duration]);

  return (
    <span ref={ref} className="tabular">
      {shown}
    </span>
  );
}
