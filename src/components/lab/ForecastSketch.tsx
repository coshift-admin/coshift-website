"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion, useInView } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Lab — "Dessinez vos ventes".
 *
 * Twelve months of (made-up) sales, then six months of forecast. The visitor
 * redraws the history with a finger or the mouse; the forecast follows live,
 * with its uncertainty band widening the further it looks. The maths is plain
 * Holt's linear method (double exponential smoothing) — honest about being a
 * simple illustration, which the footnote says.
 *
 * The curve draws itself once when it comes into view. Keyboard: ← → pick a
 * month, ↑ ↓ change it. Reduced motion: no drawing-in animation.
 * The chart always reads left → right (time), also on the Arabic page.
 */

const N_HIST = 12;
const N_FC = 6;
const N = N_HIST + N_FC;
/** Values are relative (0–100 drawable, headroom above for the forecast band). */
const DOMAIN = 115;
const DRAW_MIN = 2;
const DRAW_MAX = 100;
const PAD = { l: 6, r: 6, t: 24, b: 24 };
const DEFAULT_DATA = [38, 42, 40, 47, 52, 49, 55, 61, 58, 64, 70, 68];
const ALPHA = 0.5;
const BETA = 0.3;
const Z80 = 1.28;

type Pt = { x: number; y: number };
type Forecast = { mean: number; lo: number; hi: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const intlLocale = (locale: string) => (locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB");

/** Holt's linear trend: level + trend, 80 % band from the one-step-ahead errors. */
function holt(ys: number[], horizon: number): Forecast[] {
  const n = ys.length;
  const span = Math.min(3, n - 1);
  let level = ys[0];
  let trend = (ys[span] - ys[0]) / span;
  let sq = 0;
  for (let t = 1; t < n; t++) {
    const err = ys[t] - (level + trend);
    sq += err * err;
    const prev = level;
    level = ALPHA * ys[t] + (1 - ALPHA) * (level + trend);
    trend = BETA * (level - prev) + (1 - BETA) * trend;
  }
  const sigma = Math.sqrt(sq / Math.max(1, n - 2));
  return Array.from({ length: horizon }, (_, i) => {
    const h = i + 1;
    const mean = level + h * trend;
    const spread = Z80 * sigma * Math.sqrt(h);
    return { mean, lo: mean - spread, hi: mean + spread };
  });
}

/** Catmull-Rom through the points, as cubic Béziers. */
function smooth(points: Pt[]): string {
  if (points.length < 2) return "";
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d += `C${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
  }
  return d;
}

export function ForecastSketch() {
  const t = useTranslations("lab.items.forecast");
  const locale = useLocale();
  const reduced = useReducedMotionPref();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<HTMLDivElement | null>(null);
  const drawing = useRef(false);
  const lastCol = useRef<number | null>(null);
  const lastVal = useRef(0);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [data, setData] = useState<number[]>(DEFAULT_DATA);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focusCol, setFocusCol] = useState(N_HIST - 1);
  const [announce, setAnnounce] = useState("");

  const inView = useInView(rootRef, { once: true, amount: 0.4 });
  const intro = reduced || inView;

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const months = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale(locale), { month: "short" });
    const now = new Date();
    return Array.from({ length: N }, (_, i) =>
      fmt.format(new Date(now.getFullYear(), now.getMonth() - (N_HIST - 1) + i, 1)),
    );
  }, [locale]);

  const forecast = useMemo(() => holt(data, N_FC), [data]);

  // ── geometry (in real pixels: the viewBox is the box's own size, so nothing stretches)
  const { w, h } = size;
  const plotH = Math.max(1, h - PAD.t - PAD.b);
  const colW = Math.max(1, (w - PAD.l - PAD.r) / N);
  const x = (i: number) => PAD.l + (i + 0.5) * colW;
  const y = (v: number) => PAD.t + (1 - clamp(v, 0, DOMAIN) / DOMAIN) * plotH;
  const todayX = PAD.l + N_HIST * colW;
  const baseY = h - PAD.b;

  const hist: Pt[] = data.map((v, i) => ({ x: x(i), y: y(v) }));
  const last = hist[N_HIST - 1];
  const fc: Pt[] = forecast.map((f, j) => ({ x: x(N_HIST + j), y: y(f.mean) }));
  const histPath = smooth(hist);
  const areaPath = `${histPath}L${last.x} ${baseY}L${hist[0].x} ${baseY}Z`;
  const fcPath = smooth([last, ...fc]);
  const bandPath = [
    `M${last.x} ${last.y}`,
    ...forecast.map((f, j) => `L${x(N_HIST + j)} ${y(f.hi)}`),
    ...forecast
      .map((f, j) => `L${x(N_HIST + j)} ${y(Math.max(0, f.lo))}`)
      .reverse(),
    "Z",
  ].join("");
  const labelStep = colW < 22 ? 3 : colW < 34 ? 2 : 1;

  // ── drawing: the column under the pointer takes the pointer's height
  const pointAt = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const col = clamp(Math.floor((e.clientX - rect.left - PAD.l) / colW), 0, N_HIST - 1);
    const v = clamp((1 - (e.clientY - rect.top - PAD.t) / plotH) * DOMAIN, DRAW_MIN, DRAW_MAX);
    return { col, v };
  };

  const apply = (col: number, v: number) => {
    const from = lastCol.current;
    const fromV = lastVal.current;
    setData((prev) => {
      const next = prev.slice();
      // fast strokes skip columns: fill the gap on a straight line
      if (from !== null && Math.abs(col - from) > 1) {
        const dir = col > from ? 1 : -1;
        for (let c = from + dir; c !== col; c += dir) {
          next[c] = fromV + ((v - fromV) * (c - from)) / (col - from);
        }
      }
      next[col] = v;
      return next;
    });
    lastCol.current = col;
    lastVal.current = v;
    setFocusCol(col);
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    lastCol.current = null;
    setTouched(true);
    const { col, v } = pointAt(e);
    apply(col, v);
  };
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drawing.current) return;
    const { col, v } = pointAt(e);
    apply(col, v);
  };
  const endStroke = () => {
    if (!drawing.current) return;
    drawing.current = false;
    lastCol.current = null;
    // alternate a zero-width space so the same message is announced again
    setAnnounce((a) => (a === t("updated") ? `${t("updated")}​` : t("updated")));
  };

  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setFocusCol((c) => clamp(c + (e.key === "ArrowRight" ? 1 : -1), 0, N_HIST - 1));
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 5 : -5;
      setTouched(true);
      setData((prev) => prev.map((v, i) => (i === focusCol ? clamp(v + delta, DRAW_MIN, DRAW_MAX) : v)));
    }
  };

  const reset = () => {
    setData(DEFAULT_DATA);
    setTouched(false);
    setFocusCol(N_HIST - 1);
  };

  const fadeIn = (delay: number) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: { opacity: intro ? 1 : 0 },
    transition: { duration: 0.6, delay: reduced ? 0 : delay },
  });

  return (
    <div ref={rootRef} className="relative flex h-[clamp(400px,40vw,480px)] flex-col gap-3 p-4 sm:p-6">
      {/* legend + reset */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--navy-100)]">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-[3px] w-5 rounded-full bg-[var(--coshift-cyan)]" />
            {t("history")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="relative h-2.5 w-5 rounded-sm bg-[color-mix(in_oklab,var(--coshift-cyan)_18%,transparent)]"
            >
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[var(--cyan-300)]" />
            </span>
            {t("forecast")}
          </span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.06]"
        >
          {t("reset")}
        </button>
      </div>

      {/* the chart — time runs left → right in every language */}
      <div ref={plotRef} dir="ltr" className="relative min-h-0 flex-1">
        {w > 0 && h > 0 && (
          <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            role="application"
            aria-label={t("chartLabel")}
            tabIndex={0}
            className="absolute inset-0 cursor-crosshair touch-none select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--coshift-cyan)]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <defs>
              <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--coshift-cyan)" stopOpacity={0.26} />
                <stop offset="100%" stopColor="var(--coshift-cyan)" stopOpacity={0} />
              </linearGradient>
              <filter id={`${uid}-glow`} x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>

            {/* the future, faintly shaded */}
            <rect x={todayX} y={PAD.t - 8} width={w - PAD.r - todayX} height={baseY - PAD.t + 8} fill="rgba(255,255,255,0.025)" />

            {/* relative gridlines — no axis values, the shape is the point */}
            {[25, 50, 75, 100].map((v) => (
              <line key={v} x1={PAD.l} x2={w - PAD.r} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.06)" />
            ))}
            <line x1={PAD.l} x2={w - PAD.r} y1={baseY} y2={baseY} stroke="rgba(255,255,255,0.14)" />

            {/* keyboard focus: the month that the arrow keys change */}
            {focused && (
              <rect x={PAD.l + focusCol * colW} y={PAD.t - 8} width={colW} height={baseY - PAD.t + 8} fill="rgba(255,255,255,0.06)" rx={4} />
            )}

            <motion.path d={areaPath} fill={`url(#${uid}-area)`} {...fadeIn(0.9)} />
            <motion.path d={bandPath} fill="var(--coshift-cyan)" fillOpacity={0.14} {...fadeIn(1.2)} />
            <motion.path
              d={fcPath}
              fill="none"
              stroke="var(--cyan-300)"
              strokeWidth={2}
              strokeDasharray="5 6"
              strokeLinecap="round"
              {...fadeIn(1.2)}
            />

            {/* today */}
            <line x1={todayX} x2={todayX} y1={PAD.t - 6} y2={baseY} stroke="rgba(255,255,255,0.28)" strokeDasharray="3 4" />
            <text
              x={todayX}
              y={PAD.t - 12}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              letterSpacing="0.08em"
              fill="var(--cyan-300)"
              style={{ textTransform: "uppercase" }}
            >
              {t("today")}
            </text>

            {/* history: glow + line draw themselves in */}
            <motion.path
              d={histPath}
              fill="none"
              stroke="var(--coshift-cyan)"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={0.45}
              filter={`url(#${uid}-glow)`}
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: intro ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.45, 0, 0.25, 1] }}
            />
            <motion.path
              d={histPath}
              fill="none"
              stroke="var(--coshift-cyan)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: intro ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.45, 0, 0.25, 1] }}
            />

            {hist.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={focused && i === focusCol ? 5 : 3.5}
                fill="var(--coshift-ink)"
                stroke="var(--coshift-cyan)"
                strokeWidth={2}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: intro ? 1 : 0 }}
                transition={{ duration: 0.3, delay: reduced ? 0 : 0.1 + i * 0.08 }}
              />
            ))}
            {fc.map((p, j) => (
              <motion.circle
                key={`f${j}`}
                cx={p.x}
                cy={p.y}
                r={2.5}
                fill="var(--coshift-ink)"
                stroke="var(--cyan-300)"
                strokeWidth={1.5}
                {...fadeIn(1.3 + j * 0.05)}
              />
            ))}

            {months.map((m, i) =>
              i % labelStep === 0 ? (
                <text
                  key={i}
                  x={x(i)}
                  y={h - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--navy-300)"
                  opacity={i < N_HIST ? 1 : 0.6}
                >
                  {m}
                </text>
              ) : null,
            )}
          </svg>
        )}

        {/* hand-written hint, gone after the first stroke */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-[14%] top-[2%] flex items-start gap-1 text-[var(--hand)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: intro && !touched ? 1 : 0 }}
          transition={{ duration: 0.4, delay: intro && !touched && !reduced ? 1.6 : 0 }}
        >
          <span className="font-hand -rotate-3 whitespace-nowrap text-[1.35rem] leading-none">{t("hint")}</span>
          <svg viewBox="0 0 34 30" className="mt-2 h-[30px] w-[34px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4C14 5 24 11 27 24" />
            <path d="M21 20.5L27.2 24.6 29.6 17.6" />
          </svg>
        </motion.div>
      </div>

      <p className="text-[11px] leading-snug text-[var(--navy-300)]">{t("note")}</p>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
