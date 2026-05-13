"use client";

import { useEffect, useRef } from "react";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Procedural case-study cover: gradient mesh + GLSL-style noise-warp
 * driven by cursor proximity. Renders to a `<canvas>` and degrades to a
 * static gradient if the device is low-power or reduced-motion.
 *
 * `hue` is HSL hue base, `tone` selects palette emphasis.
 */
export function CaseCover({
  hue,
  tone,
}: {
  hue: number;
  tone: "cyan" | "indigo" | "mixed";
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let active = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / r.width;
      mouseY = (e.clientY - r.top) / r.height;
    };
    const onEnter = () => (active = true);
    const onLeave = () => (active = false);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    let t = 0;
    const palette =
      tone === "cyan"
        ? ["#1FB6F0", "#0B5C8B", "#050614"]
        : tone === "indigo"
          ? ["#4DD0FF", "#1A1B5C", "#050614"]
          : ["#1FB6F0", "#1A1B5C", "#050614"];

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = mouseX * w;
      const cy = mouseY * h;

      // gradient mesh
      const g = ctx.createRadialGradient(cx, cy, 20, w / 2, h / 2, Math.max(w, h));
      g.addColorStop(0, palette[0] + "cc");
      g.addColorStop(0.4, palette[1] + "88");
      g.addColorStop(1, palette[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // animated noise dots (low density = cheap)
      const count = 90;
      ctx.fillStyle = "rgba(244,242,236,0.06)";
      for (let i = 0; i < count; i++) {
        const ax = ((i * 53 + t * 11) % w + w) % w;
        const ay = ((i * 97 + Math.sin(t * 0.01 + i) * 40 + h) % h + h) % h;
        ctx.fillRect(ax, ay, 1.5, 1.5);
      }

      // hue label corner shimmer (just decoration)
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.08)`;
      ctx.fillRect(0, 0, w, h * 0.35);

      t += active ? 1.6 : 0.4;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [hue, tone, reduced]);

  return (
    <>
      <canvas
        ref={ref}
        className="absolute inset-0 h-full w-full"
        aria-hidden
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 80% 38%) 0%, hsl(${hue} 60% 16%) 60%, var(--coshift-ink) 100%)`,
        }}
      />
      <ShiftGlyph
        aria-hidden
        className="absolute left-1/2 top-1/2 h-1/3 w-auto -translate-x-1/2 -translate-y-1/2 text-[var(--coshift-bone)]/30 mix-blend-screen"
      />
    </>
  );
}
