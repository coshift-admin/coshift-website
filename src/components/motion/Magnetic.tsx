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

    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(r.width, r.height) * 1.4;
      if (dist > radius) {
        targetX = 0;
        targetY = 0;
        return;
      }
      const k = 1 - dist / radius;
      targetX = (dx / radius) * pull * 2 * k;
      targetY = (dy / radius) * pull * 2 * k;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [pull, reduced]);

  return (
    <span ref={ref} className={`magnetic ${className ?? ""}`}>
      {children}
    </span>
  );
}
