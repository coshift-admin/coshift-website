"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth-scroll wrapper. Runs once on the client.
 *
 * - Disabled on touch (`pointer: coarse`) and when `prefers-reduced-motion`
 *   is set — native scrolling is the right call in both cases.
 * - Exposes the instance on `window.__lenis` so GSAP ScrollTrigger and any
 *   imperative scroll-to-top calls can hook in without prop drilling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionPref();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || isTouch) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });
    window.__lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [reduced]);

  return <>{children}</>;
}
