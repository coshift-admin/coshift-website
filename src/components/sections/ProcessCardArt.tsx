"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Per-card scroll-driven SVG animations for the Process section.
 *
 * Each variant maps a 0→1 `progress` MotionValue (computed by the parent
 * from the card's segment of the overall scroll) into a different visual
 * metaphor for that phase:
 *
 *   01 Diagnose — scattered nodes get connected into a workflow map.
 *   02 Design   — misaligned wireframe blocks snap into a refined grid.
 *   03 Build    — vertical bars rise to construct a finished structure.
 *   04 Shift    — a chaotic block arrangement reorders into a clean flow.
 *
 * Each element that needs a hook is a tiny sub-component so we never call
 * useTransform inside a loop body (React hook rules).
 */
export function ProcessCardArt({
  variant,
  progress,
}: {
  variant: "diagnose" | "design" | "build" | "shift";
  progress: MotionValue<number>;
}) {
  switch (variant) {
    case "diagnose":
      return <DiagnoseArt progress={progress} />;
    case "design":
      return <DesignArt progress={progress} />;
    case "build":
      return <BuildArt progress={progress} />;
    case "shift":
      return <ShiftArt progress={progress} />;
  }
}

const ART_VIEWBOX = "0 0 400 220";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={ART_VIEWBOX}
      className="block w-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: "auto", maxHeight: "180px" }}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/* ─────────────────────────── 01 Diagnose ─────────────────────────── */

const DIAGNOSE_NODES: { x: number; y: number }[] = [
  { x: 50, y: 60 },
  { x: 150, y: 40 },
  { x: 250, y: 80 },
  { x: 350, y: 60 },
  { x: 200, y: 160 },
  { x: 90, y: 170 },
  { x: 320, y: 170 },
];
const DIAGNOSE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [4, 1],
  [4, 2],
  [5, 0],
  [5, 4],
  [6, 3],
  [6, 2],
];

function DiagnoseArt({ progress }: { progress: MotionValue<number> }) {
  const sweepX = useTransform(progress, [0.05, 1], ["-10%", "110%"]);
  const sweepOpacity = useTransform(
    progress,
    [0, 0.05, 0.9, 1],
    [0, 0.8, 0.8, 0],
  );

  return (
    <Frame>
      <defs>
        <linearGradient id="sweep-grad" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--coshift-glow)" stopOpacity={0} />
          <stop offset="100%" stopColor="var(--coshift-glow)" stopOpacity={0.35} />
        </linearGradient>
      </defs>

      {/* faint grid backdrop */}
      <g opacity={0.18} stroke="currentColor" strokeWidth="0.3">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`v${i}`} x1={50 * i} y1={0} x2={50 * i} y2={220} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={50 * i} x2={400} y2={50 * i} />
        ))}
      </g>

      {DIAGNOSE_EDGES.map(([a, b], i) => (
        <DiagnoseEdge
          key={`e${i}`}
          ax={DIAGNOSE_NODES[a].x}
          ay={DIAGNOSE_NODES[a].y}
          bx={DIAGNOSE_NODES[b].x}
          by={DIAGNOSE_NODES[b].y}
          order={i}
          progress={progress}
        />
      ))}

      {DIAGNOSE_NODES.map((n, i) => (
        <DiagnoseNode key={`n${i}`} cx={n.x} cy={n.y} order={i} progress={progress} />
      ))}

      <motion.g style={{ x: sweepX, opacity: sweepOpacity }}>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={220}
          stroke="var(--coshift-glow)"
          strokeWidth={1.5}
        />
        <rect x={-30} y={0} width={30} height={220} fill="url(#sweep-grad)" />
      </motion.g>
    </Frame>
  );
}

function DiagnoseEdge({
  ax,
  ay,
  bx,
  by,
  order,
  progress,
}: {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  order: number;
  progress: MotionValue<number>;
}) {
  const len = Math.hypot(ax - bx, ay - by);
  const start = 0.18 + order * 0.06;
  const end = start + 0.18;
  const offset = useTransform(progress, [start, end], [len, 0]);
  return (
    <motion.line
      x1={ax}
      y1={ay}
      x2={bx}
      y2={by}
      stroke="var(--coshift-cyan)"
      strokeWidth={1.2}
      strokeDasharray={len}
      style={{ strokeDashoffset: offset }}
      opacity={0.7}
    />
  );
}

function DiagnoseNode({
  cx,
  cy,
  order,
  progress,
}: {
  cx: number;
  cy: number;
  order: number;
  progress: MotionValue<number>;
}) {
  const start = order * 0.04;
  const end = start + 0.12;
  const r = useTransform(progress, [start, end], [0, 5]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  return (
    <motion.circle cx={cx} cy={cy} fill="var(--coshift-cyan)" style={{ r, opacity }} />
  );
}

/* ─────────────────────────── 02 Design ─────────────────────────── */

type DesignBlock = {
  fromX: number;
  fromY: number;
  fromR: number;
  toX: number;
  toY: number;
  w: number;
  h: number;
};

const DESIGN_BLOCKS: DesignBlock[] = [
  { fromX: -40, fromY: -20, fromR: -12, toX: 30, toY: 30, w: 110, h: 60 },
  { fromX: 60, fromY: 40, fromR: 8, toX: 150, toY: 30, w: 90, h: 60 },
  { fromX: 30, fromY: -50, fromR: 16, toX: 250, toY: 30, w: 120, h: 60 },
  { fromX: -10, fromY: 60, fromR: -6, toX: 30, toY: 110, w: 90, h: 80 },
  { fromX: 40, fromY: 20, fromR: 10, toX: 130, toY: 110, w: 110, h: 80 },
  { fromX: -30, fromY: 50, fromR: -14, toX: 250, toY: 110, w: 120, h: 80 },
];

function DesignArt({ progress }: { progress: MotionValue<number> }) {
  return (
    <Frame>
      <g opacity={0.12} stroke="currentColor" strokeWidth="0.3">
        {[30, 130, 250, 370].map((x) => (
          <line key={`g${x}`} x1={x} y1={20} x2={x} y2={200} />
        ))}
        {[30, 90, 110, 190].map((y) => (
          <line key={`gh${y}`} x1={20} y1={y} x2={380} y2={y} />
        ))}
      </g>

      {DESIGN_BLOCKS.map((b, i) => (
        <DesignBlockEl key={i} block={b} order={i} progress={progress} />
      ))}
    </Frame>
  );
}

function DesignBlockEl({
  block,
  order,
  progress,
}: {
  block: DesignBlock;
  order: number;
  progress: MotionValue<number>;
}) {
  const stagger = order * 0.04;
  // Center of the block at its target position — used as the pivot.
  const cx = block.toX + block.w / 2;
  const cy = block.toY + block.h / 2;

  // We split the transform into TWO nested groups:
  //   outer g: translates to (cx + offset → cx)
  //   inner g: rotates about its own origin (which sits at the rect center)
  // This avoids `originX`/`originY` and SVG `transform` attribute pitfalls.
  const tx = useTransform(progress, [stagger, stagger + 0.6], [cx + block.fromX, cx]);
  const ty = useTransform(progress, [stagger, stagger + 0.6], [cy + block.fromY, cy]);
  const rot = useTransform(progress, [stagger, stagger + 0.6], [block.fromR, 0]);

  const fillOpacity = useTransform(progress, [0.55, 0.95], [0, 0.32]);
  const accentOpacity = useTransform(progress, [0.65, 0.98], [0, 0.9]);

  return (
    <motion.g style={{ x: tx, y: ty }}>
      <motion.g style={{ rotate: rot }}>
        <motion.rect
          x={-block.w / 2}
          y={-block.h / 2}
          width={block.w}
          height={block.h}
          rx={3}
          fill="var(--coshift-cyan)"
          stroke="var(--coshift-cyan)"
          strokeWidth={1.6}
          style={{ fillOpacity }}
        />
        <motion.rect
          x={-block.w / 2 + 10}
          y={-block.h / 2 + 14}
          width={block.w * 0.35}
          height={3}
          rx={1.5}
          fill="var(--coshift-cyan)"
          style={{ opacity: accentOpacity }}
        />
      </motion.g>
    </motion.g>
  );
}

/* ─────────────────────────── 03 Build ─────────────────────────── */

const BUILD_BARS: { x: number; h: number; delay: number }[] = [
  { x: 40, h: 80, delay: 0.0 },
  { x: 90, h: 130, delay: 0.05 },
  { x: 140, h: 60, delay: 0.1 },
  { x: 190, h: 150, delay: 0.15 },
  { x: 240, h: 95, delay: 0.2 },
  { x: 290, h: 165, delay: 0.25 },
  { x: 340, h: 110, delay: 0.3 },
];
const BUILD_BASELINE = 195;

function BuildArt({ progress }: { progress: MotionValue<number> }) {
  const capOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);
  return (
    <Frame>
      <line
        x1={20}
        y1={BUILD_BASELINE}
        x2={380}
        y2={BUILD_BASELINE}
        stroke="var(--coshift-cyan)"
        strokeWidth={1}
        opacity={0.5}
      />
      <g opacity={0.12} stroke="currentColor" strokeWidth="0.3">
        {[
          BUILD_BASELINE - 40,
          BUILD_BASELINE - 80,
          BUILD_BASELINE - 120,
          BUILD_BASELINE - 160,
        ].map((y) => (
          <line key={y} x1={20} y1={y} x2={380} y2={y} />
        ))}
      </g>

      {BUILD_BARS.map((b, i) => (
        <BuildBar key={i} bar={b} progress={progress} />
      ))}

      <motion.circle
        cx={290}
        cy={BUILD_BASELINE - 165 - 8}
        r={4}
        fill="var(--coshift-glow)"
        style={{ opacity: capOpacity }}
      />
    </Frame>
  );
}

function BuildBar({
  bar,
  progress,
}: {
  bar: { x: number; h: number; delay: number };
  progress: MotionValue<number>;
}) {
  const start = bar.delay;
  const end = start + 0.35;
  const heightMv = useTransform(progress, [start, end], [0, bar.h]);
  const y = useTransform(heightMv, (h) => BUILD_BASELINE - h);
  const height = useTransform(heightMv, (h) => h);
  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  return (
    <motion.rect
      x={bar.x - 16}
      width={32}
      rx={2}
      fill="var(--coshift-cyan)"
      style={{ y, height, opacity }}
    />
  );
}

/* ─────────────────────────── 04 Shift ─────────────────────────── */

const SHIFT_COLS = 8;
const SHIFT_ROWS = 3;
const SHIFT_STEP_X = 360 / (SHIFT_COLS - 1);
const SHIFT_STEP_Y = 50;
const SHIFT_ORIGIN_X = 20;
const SHIFT_ORIGIN_Y = 60;

type ShiftDot = {
  col: number;
  row: number;
  jitterX: number;
  jitterY: number;
};

/**
 * Pure-integer pseudo-random hash. Returns a value in [0, 1).
 * Uses bitwise ops only, so the output is bit-identical between Node (SSR)
 * and V8 (browser) — no `Math.sin` shenanigans that break hydration.
 */
function seed(i: number, j: number) {
  let h = (i * 374761393 + j * 668265263) >>> 0;
  h = ((h ^ (h >>> 13)) * 1274126177) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

const SHIFT_DOTS: ShiftDot[] = (() => {
  const out: ShiftDot[] = [];
  for (let r = 0; r < SHIFT_ROWS; r++) {
    for (let c = 0; c < SHIFT_COLS; c++) {
      out.push({
        col: c,
        row: r,
        jitterX: (seed(c, r) - 0.5) * 110,
        jitterY: (seed(r, c) - 0.5) * 100,
      });
    }
  }
  return out;
})();

function ShiftArt({ progress }: { progress: MotionValue<number> }) {
  const arrowX = useTransform(progress, [0.1, 0.95], ["-20%", "100%"]);
  const arrowOpacity = useTransform(
    progress,
    [0.05, 0.2, 0.85, 1],
    [0, 0.8, 0.8, 0],
  );

  return (
    <Frame>
      <g
        opacity={0.18}
        stroke="currentColor"
        strokeDasharray="3 5"
        strokeWidth="0.5"
      >
        {Array.from({ length: SHIFT_ROWS }, (_, r) => (
          <line
            key={r}
            x1={SHIFT_ORIGIN_X}
            y1={SHIFT_ORIGIN_Y + r * SHIFT_STEP_Y}
            x2={SHIFT_ORIGIN_X + (SHIFT_COLS - 1) * SHIFT_STEP_X}
            y2={SHIFT_ORIGIN_Y + r * SHIFT_STEP_Y}
          />
        ))}
      </g>

      {SHIFT_DOTS.map((d, i) => (
        <ShiftDotEl key={i} dot={d} progress={progress} />
      ))}

      <motion.g style={{ x: arrowX, opacity: arrowOpacity }}>
        <rect
          x={-2}
          y={SHIFT_ORIGIN_Y - 16}
          width={4}
          height={(SHIFT_ROWS - 1) * SHIFT_STEP_Y + 32}
          fill="var(--coshift-glow)"
        />
        <polygon
          points={`0,${SHIFT_ORIGIN_Y - 18} 12,${SHIFT_ORIGIN_Y + ((SHIFT_ROWS - 1) * SHIFT_STEP_Y) / 2} 0,${SHIFT_ORIGIN_Y + (SHIFT_ROWS - 1) * SHIFT_STEP_Y + 18}`}
          fill="var(--coshift-glow)"
          opacity={0.6}
        />
      </motion.g>
    </Frame>
  );
}

function ShiftDotEl({
  dot,
  progress,
}: {
  dot: ShiftDot;
  progress: MotionValue<number>;
}) {
  const targetX = SHIFT_ORIGIN_X + dot.col * SHIFT_STEP_X;
  const targetY = SHIFT_ORIGIN_Y + dot.row * SHIFT_STEP_Y;
  const t = useTransform(
    progress,
    [0 + dot.col * 0.02, 0.5 + dot.col * 0.04],
    [0, 1],
    { clamp: true },
  );
  const cx = useTransform(t, [0, 1], [targetX + dot.jitterX, targetX]);
  const cy = useTransform(t, [0, 1], [targetY + dot.jitterY, targetY]);
  const fill = useTransform(t, [0, 1], [
    "var(--coshift-indigo)",
    "var(--coshift-cyan)",
  ]);
  return <motion.circle r={3.4} style={{ cx, cy, fill }} />;
}
