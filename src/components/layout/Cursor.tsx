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
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let scale = 1;
    let isOver = false;
    let raf = 0;

    // The loop only runs while the ring is catching up — it sleeps when the
    // pointer is still, instead of ticking every frame forever.
    const tick = () => {
      const targetScale = isOver ? 4 : 1;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      scale += (targetScale - scale) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      // Label trails the cursor slightly, offset below-right.
      label.style.transform = `translate3d(${mouseX + 18}px, ${mouseY + 18}px, 0)`;
      const settled =
        Math.abs(mouseX - ringX) < 0.1 &&
        Math.abs(mouseY - ringY) < 0.1 &&
        Math.abs(targetScale - scale) < 0.01;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      wake();
    };
    wake();

    const interactiveSel =
      'a, button, [role="button"], [data-cursor="hover"], input, textarea, select, [contenteditable="true"]';

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(interactiveSel)) {
        isOver = true;
        ring.dataset.state = "hover";
        wake();
      }
      const labelled = target.closest<HTMLElement>("[data-cursor-label]");
      if (labelled?.dataset.cursorLabel) {
        label.textContent = labelled.dataset.cursorLabel;
        label.dataset.show = "true";
      }
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(interactiveSel)) {
        isOver = false;
        ring.dataset.state = "idle";
        wake();
      }
      if (target.closest("[data-cursor-label]")) {
        label.dataset.show = "false";
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
          // No transform transition: position and scale are already eased in
          // JS, and a CSS transition on top restarts every frame.
          transition: "background 200ms",
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
      <div
        ref={labelRef}
        data-show="false"
        className="cursor-label"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          willChange: "transform",
        }}
      />
    </div>
  );
}
