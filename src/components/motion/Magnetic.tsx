"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Magnetic hover: child translates toward cursor by up to `pull` pixels,
 * eased. Caps at 12px by default (per brief). Disabled on touch + reduced motion.
 */
export function Magnetic({
  children,
  pull = 12,
  className,
}: {
  children: ReactNode;
  pull?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    // Untransformed centre + pull radius. Measured lazily and dropped on
    // scroll/resize, so pointer moves don't force a layout read every event.
    let zone: { cx: number; cy: number; radius: number } | null = null;

    const measure = () => {
      const r = node.getBoundingClientRect();
      zone = {
        cx: r.left + r.width / 2 - x,
        cy: r.top + r.height / 2 - y,
        radius: Math.max(r.width, r.height) * 1.4,
      };
      return zone;
    };

    // Runs only while the element is easing somewhere; sleeps at rest.
    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      const settled = Math.abs(targetX - x) < 0.05 && Math.abs(targetY - y) < 0.05;
      if (settled) {
        x = targetX;
        y = targetY;
      }
      node.style.transform = x || y ? `translate3d(${x}px, ${y}px, 0)` : "";
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const { cx, cy, radius } = zone ?? measure();
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        if (targetX || targetY) {
          targetX = 0;
          targetY = 0;
          wake();
        }
        return;
      }
      const k = 1 - dist / radius;
      targetX = (dx / radius) * pull * 2 * k;
      targetY = (dy / radius) * pull * 2 * k;
      wake();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      wake();
    };
    const invalidate = () => {
      zone = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [pull, reduced]);

  return (
    <span ref={ref} className={`magnetic ${className ?? ""}`}>
      {children}
    </span>
  );
}
