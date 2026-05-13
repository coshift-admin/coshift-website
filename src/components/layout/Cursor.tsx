"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Custom cursor: 12px ring (cyan, mix-blend-difference) that swells to a
 * 48px filled disc over interactive elements, with magnetic pull toward
 * the cursor on `.magnetic` anchors.
 *
 * - Hidden on coarse pointers (touch) and when reduced motion is set.
 * - Position updated outside React via `transform: translate3d` on the
 *   layer — this keeps it pinned to the cursor even when smooth scroll
 *   is moving the page underneath.
 */
export function Cursor() {
  const reduced = useReducedMotionPref();
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isOver = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${isOver ? 4 : 1})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const interactiveSel =
      'a, button, [role="button"], [data-cursor="hover"], input, textarea, select, [contenteditable="true"]';

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(interactiveSel)) {
        isOver = true;
        ring.dataset.state = "hover";
      }
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(interactiveSel)) {
        isOver = false;
        ring.dataset.state = "idle";
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      style={{ zIndex: "var(--z-cursor)" }}
      className="pointer-events-none fixed inset-0"
    >
      <div
        ref={ringRef}
        data-state="idle"
        className="cursor-ring"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 12,
          height: 12,
          borderRadius: 9999,
          border: "1.5px solid var(--coshift-cyan)",
          mixBlendMode: "difference",
          transition: "transform 240ms var(--ease-out-expo), background 200ms",
          willChange: "transform",
          backgroundColor: "transparent",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 4,
          height: 4,
          borderRadius: 9999,
          background: "var(--coshift-cyan)",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
    </div>
  );
}
