"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { LOGO_GEOMETRY } from "@/components/icons/CoshiftWordmark";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { useVisible } from "@/hooks/useVisible";

/**
 * Lab 01 — "Du désordre à l'ordre". The shift, as a toy: a few thousand dots
 * drift around the stage like scattered tools; hover (or tap) and they stream
 * into the Coshift wordmark and hold it. Near the formed logo the pointer
 * pushes dots aside and the springs pull them back — a ripple. Leave, and
 * after a beat they scatter again.
 *
 * Targets are sampled from the real logo geometry (LOGO_GEOMETRY) drawn on an
 * offscreen canvas: the CO half + i-dot keep the brand cyan, SHIFT stays bone.
 * One 2D canvas, typed arrays, no allocation per frame; the loop only runs
 * while the stage is on screen. Reduced motion: the finished dot-wordmark,
 * drawn once; the toggle still works, instantly.
 */

type Sim = {
  w: number;
  h: number;
  dpr: number;
  n: number;
  size: number;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  tx: Float32Array;
  ty: Float32Array;
  /** per-dot spring stiffness — the spread makes the dots stream in, not snap */
  k: Float32Array;
  cyan: Uint8Array;
};

type Palette = { ink: string; trail: string; bone: string; cyan: string; glow: string };
type Pointer = { x: number; y: number; active: boolean };

const REPEL_R = 72;

export function ShiftParticles() {
  const t = useTranslations("lab.items.shift");
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<Sim | null>(null);
  const paletteRef = useRef<Palette | null>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });
  const leaveTimer = useRef<number | undefined>(undefined);
  const touchTimer = useRef<number | undefined>(undefined);
  const orderedRef = useRef(false);
  const prevOrdered = useRef(false);
  const interactedRef = useRef(false);

  const [ordered, setOrdered] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const reduced = useReducedMotionPref();
  const visible = useVisible(stageRef);
  const inView = useInView(stageRef, { once: true, amount: 0.4 });

  // Keep the loop's copy in sync; a release from "ordered" bursts the dots apart.
  useEffect(() => {
    orderedRef.current = ordered;
    const was = prevOrdered.current;
    prevOrdered.current = ordered;
    if (!reduced && was && !ordered && simRef.current) burst(simRef.current);
  }, [ordered, reduced]);

  // Build (and rebuild on resize) the canvas + the dots.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    paletteRef.current = readPalette();

    const build = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (w < 10 || h < 10) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const sim = buildSim(w, h, dpr, orderedRef.current);
      simRef.current = sim;
      if (sim && paletteRef.current) paint(canvas, sim, paletteRef.current, true);
    };

    build();
    let size = `${stage.clientWidth}x${stage.clientHeight}`;
    const ro = new ResizeObserver(() => {
      const next = `${stage.clientWidth}x${stage.clientHeight}`;
      if (next === size) return;
      size = next;
      build();
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // The loop — only while visible, never with reduced motion.
  useEffect(() => {
    if (!visible || reduced) return;
    let raf = 0;
    const tick = (now: number) => {
      const sim = simRef.current;
      const canvas = canvasRef.current;
      const pal = paletteRef.current;
      if (sim && canvas && pal) {
        stepSim(sim, now, orderedRef.current, pointer.current);
        paint(canvas, sim, pal, false);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced]);

  // Reduced motion: show the finished wordmark, redraw statically on toggle.
  useEffect(() => {
    if (reduced) setOrdered(true);
  }, [reduced]);

  useEffect(() => {
    if (!reduced) return;
    const sim = simRef.current;
    const canvas = canvasRef.current;
    const pal = paletteRef.current;
    if (!sim || !canvas || !pal) return;
    place(sim, ordered);
    paint(canvas, sim, pal, true);
  }, [reduced, ordered]);

  // Autoplay: the first time the stage is seen, the dots tidy themselves up.
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setTimeout(() => {
      if (!interactedRef.current) setOrdered(true);
    }, 800);
    return () => window.clearTimeout(id);
  }, [inView, reduced]);

  useEffect(() => {
    const leave = leaveTimer;
    const touch = touchTimer;
    return () => {
      window.clearTimeout(leave.current);
      window.clearTimeout(touch.current);
    };
  }, []);

  const markInteracted = () => {
    if (interactedRef.current) return;
    interactedRef.current = true;
    setInteracted(true);
  };

  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.x = e.clientX - r.left;
    pointer.current.y = e.clientY - r.top;
  };

  return (
    <div
      ref={stageRef}
      className="relative h-[clamp(380px,46vw,560px)] w-full select-none overflow-hidden"
      // Mouse / pen: hover orders, leaving scatters. Touch: a tap toggles
      // (touch also fires enter/leave, so those ignore it). No preventDefault,
      // so the page still scrolls on phones.
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        window.clearTimeout(leaveTimer.current);
        track(e);
        pointer.current.active = true;
        markInteracted();
        setOrdered(true);
      }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        track(e);
        pointer.current.active = true;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        pointer.current.active = false;
        window.clearTimeout(leaveTimer.current);
        leaveTimer.current = window.setTimeout(() => setOrdered(false), 600);
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "touch") return;
        track(e);
        pointer.current.active = true;
        window.clearTimeout(touchTimer.current);
        touchTimer.current = window.setTimeout(() => {
          pointer.current.active = false;
        }, 450);
        markInteracted();
        setOrdered((o) => !o);
      }}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

      <button
        type="button"
        // keep a tap on the button from also toggling through the stage
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => {
          markInteracted();
          window.clearTimeout(leaveTimer.current);
          setOrdered((o) => !o);
        }}
        className="absolute end-3 top-3 z-10 rounded-lg border border-white/15 bg-[color-mix(in_oklab,var(--coshift-ink)_70%,transparent)] px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.08]"
      >
        {ordered ? t("scatter") : t("order")}
      </button>

      <motion.p
        aria-hidden
        initial={false}
        animate={{ opacity: interacted ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="font-hand pointer-events-none absolute inset-x-0 bottom-4 text-center text-[1.35rem] text-[var(--warm-300)]"
      >
        {t("hint")}
      </motion.p>

      <p className="sr-only" aria-live="polite">
        {ordered ? t("statusOrdered") : t("statusScattered")}
      </p>
    </div>
  );
}

/* ───────────── sampling the logo ───────────── */

function sampleLogo(w: number, h: number) {
  const { viewBox: vb, co, shift } = LOGO_GEOMETRY;
  // ~72% of the stage width, never taller than ~42% of its height
  const s = Math.min((w * 0.72) / vb.width, (h * 0.42) / vb.height);
  const lw = Math.ceil(vb.width * s);
  const lh = Math.ceil(vb.height * s);
  if (lw < 4 || lh < 4) return null;

  const off = document.createElement("canvas");
  off.width = lw;
  off.height = lh;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  // Red channel = cyan half (CO + i-dot), green = bone half (SHIFT).
  ctx.setTransform(s, 0, 0, s, -vb.x * s, -vb.y * s);
  ctx.fillStyle = "#ff0000";
  for (const d of co.paths) ctx.fill(new Path2D(d));
  ctx.fillRect(co.dot.x, co.dot.y, co.dot.width, co.dot.height);
  ctx.fillStyle = "#00ff00";
  for (const d of shift.paths) ctx.fill(new Path2D(d));
  for (const pts of shift.polygons) ctx.fill(new Path2D(`M${pts}Z`));

  const { data } = ctx.getImageData(0, 0, lw, lh);
  let filled = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) filled++;

  // phone ≈ 1200 dots … desktop ≈ 3500
  const want = w < 640 ? 1200 : w < 1024 ? 2200 : 3500;
  const step = Math.max(1.5, Math.sqrt(filled / want));
  const ox = (w - lw) / 2;
  const oy = (h - lh) / 2 - h * 0.03;

  const xs: number[] = [];
  const ys: number[] = [];
  const cs: number[] = [];
  for (let py = step / 2; py < lh; py += step) {
    for (let px = step / 2; px < lw; px += step) {
      const i = (Math.floor(py) * lw + Math.floor(px)) * 4;
      if (data[i + 3] <= 128) continue;
      xs.push(ox + px);
      ys.push(oy + py);
      cs.push(data[i] > data[i + 1] ? 1 : 0);
    }
  }
  return { xs, ys, cs };
}

/* ───────────── simulation ───────────── */

function buildSim(w: number, h: number, dpr: number, ordered: boolean): Sim | null {
  const targets = sampleLogo(w, h);
  if (!targets || targets.xs.length === 0) return null;
  const n = targets.xs.length;
  const sim: Sim = {
    w,
    h,
    dpr,
    n,
    size: w < 640 ? 1.6 : w < 1024 ? 1.9 : 2.2,
    x: new Float32Array(n),
    y: new Float32Array(n),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    tx: new Float32Array(n),
    ty: new Float32Array(n),
    k: new Float32Array(n),
    cyan: new Uint8Array(n),
  };
  for (let i = 0; i < n; i++) {
    sim.tx[i] = targets.xs[i];
    sim.ty[i] = targets.ys[i];
    sim.cyan[i] = targets.cs[i];
    sim.k[i] = 0.008 + Math.random() * 0.03;
  }
  place(sim, ordered);
  return sim;
}

/** Put every dot on its target (ordered) or anywhere on the stage (scattered). */
function place(sim: Sim, ordered: boolean) {
  for (let i = 0; i < sim.n; i++) {
    sim.x[i] = ordered ? sim.tx[i] : Math.random() * sim.w;
    sim.y[i] = ordered ? sim.ty[i] : Math.random() * sim.h;
    sim.vx[i] = 0;
    sim.vy[i] = 0;
  }
}

/** A kick outward when the logo lets go, so it breaks apart instead of melting. */
function burst(sim: Sim) {
  const cx = sim.w / 2;
  const cy = sim.h / 2;
  for (let i = 0; i < sim.n; i++) {
    const dx = sim.x[i] - cx;
    const dy = sim.y[i] - cy;
    const d = Math.hypot(dx, dy) || 1;
    const kick = 1.5 + Math.random() * 4;
    sim.vx[i] += (dx / d) * kick + (Math.random() - 0.5) * 2;
    sim.vy[i] += (dy / d) * kick + (Math.random() - 0.5) * 2;
  }
}

function stepSim(sim: Sim, now: number, ordered: boolean, p: Pointer) {
  const t = now * 0.001;
  const { n, w, h, x, y, vx, vy, tx, ty, k } = sim;
  const r2 = REPEL_R * REPEL_R;
  const damp = ordered ? 0.86 : 0.965;

  for (let i = 0; i < n; i++) {
    const xi = x[i];
    const yi = y[i];
    let ax: number;
    let ay: number;

    if (ordered) {
      ax = (tx[i] - xi) * k[i];
      ay = (ty[i] - yi) * k[i];
    } else {
      // cheap trig flow field: smooth, slowly turning currents
      const a =
        (Math.sin(xi * 0.0065 + t * 0.35) +
          Math.cos(yi * 0.0072 - t * 0.28) +
          Math.sin((xi + yi) * 0.0021 + t * 0.15)) *
        1.7;
      ax = Math.cos(a) * 0.06;
      ay = Math.sin(a) * 0.06;
    }

    if (p.active) {
      const dx = xi - p.x;
      const dy = yi - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const f = 1 - d / REPEL_R;
        const s = (f * f * 2.6) / d;
        ax += dx * s;
        ay += dy * s;
      }
    }

    const nvx = (vx[i] + ax) * damp;
    const nvy = (vy[i] + ay) * damp;
    vx[i] = nvx;
    vy[i] = nvy;
    let nx = xi + nvx;
    let ny = yi + nvy;
    if (!ordered) {
      if (nx < -8) nx += w + 16;
      else if (nx > w + 8) nx -= w + 16;
      if (ny < -8) ny += h + 16;
      else if (ny > h + 8) ny -= h + 16;
    }
    x[i] = nx;
    y[i] = ny;
  }
}

/* ───────────── drawing ───────────── */

function paint(canvas: HTMLCanvasElement, sim: Sim, pal: Palette, clear: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { n, x, y, cyan, size } = sim;
  ctx.setTransform(sim.dpr, 0, 0, sim.dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  // a translucent ink wash instead of a clear leaves short motion trails
  ctx.fillStyle = clear ? pal.ink : pal.trail;
  ctx.fillRect(0, 0, sim.w, sim.h);

  const half = size / 2;
  ctx.fillStyle = pal.bone;
  for (let i = 0; i < n; i++) if (!cyan[i]) ctx.fillRect(x[i] - half, y[i] - half, size, size);
  ctx.fillStyle = pal.cyan;
  for (let i = 0; i < n; i++) if (cyan[i]) ctx.fillRect(x[i] - half, y[i] - half, size, size);

  // faint additive halo on the cyan half
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = pal.glow;
  const g = size * 2.6;
  const gh = g / 2;
  for (let i = 0; i < n; i++) if (cyan[i]) ctx.fillRect(x[i] - gh, y[i] - gh, g, g);
  ctx.globalCompositeOperation = "source-over";
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const ink = v("--coshift-ink", "#0d0826");
  const cyan = v("--coshift-cyan", "#33c5f3");
  return {
    ink,
    trail: withAlpha(ink, 0.32),
    bone: withAlpha(v("--coshift-bone", "#f4f2ec"), 0.88),
    cyan,
    glow: withAlpha(cyan, 0.16),
  };
}

function withAlpha(hex: string, a: number) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
