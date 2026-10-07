"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Scroll-driven line art for the four solution cards — same language as the
 * "Quatre phases" cards (ProcessCardArt): each drawing plays as its card
 * scrolls into view and tells that solution's story in one move.
 *
 *   erp   — scattered modules fly in and lock into one ERP window.
 *   web   — a shop builds itself, an order travels down the wire to the stock.
 *   apps  — two connectors slide together and the link lights up.
 *   automation — an order comes in, WhatsApp asks the client, the client
 *           confirms, the delivery leaves. Nobody picked up the phone.
 *   email — an envelope heads for spam, then lands in the inbox.
 *
 * Strokes use currentColor (set by the container), fills the brand cyan, and
 * the grey details read `--art-muted`, so the same art works on the light
 * cards and on the dark page heroes. Reduced motion shows the finished state.
 * `autoplay` plays the story once when it comes into view instead of following
 * the scroll — for the top of a page, where there is no scroll to follow yet.
 * Hooks never run in loops: every animated element is its own small component.
 */
export type SolutionArtVariant = "erp" | "web" | "apps" | "automation" | "email";

export function SolutionArt({
  variant,
  autoplay = false,
  delay = 0.5,
}: {
  variant: SolutionArtVariant;
  autoplay?: boolean;
  /** Seconds before an autoplaying drawing starts. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 30%"] });
  const done = useMotionValue(1);
  const auto = useMotionValue(0);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!autoplay || reduced || !inView) return;
    const controls = animate(auto, 1, { duration: 2.8, delay, ease: [0.2, 0, 0.1, 1] });
    return () => controls.stop();
  }, [autoplay, reduced, inView, delay, auto]);

  const progress = reduced ? done : autoplay ? auto : scrollYProgress;

  return (
    <div ref={ref} className="h-full w-full">
      {variant === "erp" && <ErpArt p={progress} />}
      {variant === "web" && <WebArt p={progress} />}
      {variant === "apps" && <AppsArt p={progress} />}
      {variant === "automation" && <AutomationArt p={progress} />}
      {variant === "email" && <EmailArt p={progress} />}
    </div>
  );
}

/* ───────────── shared pieces ───────────── */

const MUTED = "var(--art-muted, #c5ccdb)";
const FILL = "var(--coshift-cyan)";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 200" className="block h-full w-full overflow-visible" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {children}
    </svg>
  );
}

/** A stroke that draws itself between `from` and `to` (fractions of progress). */
function Draw({
  p,
  from,
  to,
  d,
  width = 1.5,
  color = "currentColor",
  dashed,
}: {
  p: MotionValue<number>;
  from: number;
  to: number;
  d: string;
  width?: number;
  color?: string;
  dashed?: boolean;
}) {
  const pathLength = useTransform(p, [from, to], [0, 1]);
  const opacity = useTransform(p, [from, from + 0.02], [0, 1]);
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "4 5" : undefined}
      style={dashed ? { opacity } : { pathLength, opacity }}
    />
  );
}

/** Fades + scales a group in between `from` and `to`. */
function Pop({ p, from, to, children }: { p: MotionValue<number>; from: number; to: number; children: ReactNode }) {
  const scale = useTransform(p, [from, to], [0.4, 1]);
  const opacity = useTransform(p, [from, to], [0, 1]);
  // SVG motion elements scale from their own bounding-box centre.
  return <motion.g style={{ scale, opacity }}>{children}</motion.g>;
}

const rectPath = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;

const Check = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r={11} fill={FILL} />
    <path d={`M${x - 5} ${y}l3.5 3.5 6.5 -7`} fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/* ───────────── ERP: modules lock into one window ───────────── */

const ERP_TILES = [
  { to: [80, 58], from: [-60, 10, -24] },
  { to: [162, 58], from: [170, -70, 14] },
  { to: [244, 58], from: [440, 20, 22] },
  { to: [80, 118], from: [-50, 190, 16] },
  { to: [162, 118], from: [150, 260, -12] },
  { to: [244, 118], from: [450, 180, -20] },
] as const;

function ErpArt({ p }: { p: MotionValue<number> }) {
  return (
    <Frame>
      <Draw p={p} from={0} to={0.35} d={rectPath(64, 22, 272, 160, 12)} />
      <Draw p={p} from={0.25} to={0.4} d="M64 44H336" width={1} />
      <Pop p={p} from={0.35} to={0.45}>
        {[84, 96, 108].map((x) => (
          <circle key={x} cx={x} cy={33} r={3} fill={MUTED} />
        ))}
      </Pop>
      {ERP_TILES.map((t, i) => (
        <ErpTile key={i} p={p} i={i} to={t.to} from={t.from} />
      ))}
      <Pop p={p} from={0.88} to={1}>
        <Check x={322} y={33} />
      </Pop>
    </Frame>
  );
}

function ErpTile({ p, i, to, from }: { p: MotionValue<number>; i: number; to: readonly [number, number]; from: readonly [number, number, number] }) {
  const s = 0.12 + i * 0.07;
  const e = s + 0.32;
  const x = useTransform(p, [s, e], [from[0], to[0]]);
  const y = useTransform(p, [s, e], [from[1], to[1]]);
  const rotate = useTransform(p, [s, e], [from[2], 0]);
  const opacity = useTransform(p, [s, s + 0.08], [0, 1]);
  return (
    <motion.g style={{ x, y, rotate, opacity }}>
      <rect width={76} height={52} rx={7} fill={FILL} fillOpacity={0.12} stroke="currentColor" strokeWidth={1.2} />
      <circle cx={13} cy={14} r={4.5} fill={FILL} />
      <path d="M11 30H58M11 40H44" stroke={MUTED} strokeWidth={3} strokeLinecap="round" />
    </motion.g>
  );
}

/* ───────────── Web: the shop wired to the stock ───────────── */

function WebArt({ p }: { p: MotionValue<number> }) {
  // the order travelling from the "add to cart" button to the stock box
  const dotX = useTransform(p, [0.58, 0.8], [214, 292]);
  const dotY = useTransform(p, [0.58, 0.69, 0.8], [112, 102, 104]);
  const dotOpacity = useTransform(p, [0.56, 0.6, 0.78, 0.82], [0, 1, 1, 0]);
  const lastBar = useTransform(p, [0.8, 0.9], [26, 12]);
  const lastBarY = useTransform(lastBar, (h) => 186 - h);
  return (
    <Frame>
      {/* browser */}
      <Draw p={p} from={0} to={0.3} d={rectPath(28, 24, 214, 154, 10)} />
      <Draw p={p} from={0.2} to={0.32} d="M28 46H242" width={1} />
      <Pop p={p} from={0.3} to={0.4}>
        {[46, 58, 70].map((x) => (
          <circle key={x} cx={x} cy={35} r={3} fill={MUTED} />
        ))}
      </Pop>
      {/* product card */}
      <Pop p={p} from={0.25} to={0.42}>
        <rect x={46} y={62} width={72} height={96} rx={8} fill={FILL} fillOpacity={0.14} stroke="currentColor" strokeWidth={1.1} />
        <path d="M60 128l14-16 12 12 8-8 14 14" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
        <circle cx={96} cy={84} r={6} fill={FILL} />
      </Pop>
      <Draw p={p} from={0.34} to={0.46} d="M134 72H222" width={3} color={MUTED} />
      <Draw p={p} from={0.38} to={0.5} d="M134 86H196" width={3} color={MUTED} />
      <Pop p={p} from={0.46} to={0.56}>
        <rect x={134} y={102} width={82} height={22} rx={11} fill={FILL} />
        <path d="M150 113h50" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
      </Pop>
      {/* wire to the stock */}
      <Draw p={p} from={0.5} to={0.62} d="M216 113C246 113 258 103 290 103" width={1.4} />
      {/* stock box + level bars */}
      <Draw p={p} from={0.12} to={0.4} d="M300 70l38-18 38 18v44l-38 18-38-18z M300 70l38 18 38-18 M338 88v44" width={1.4} />
      {[0, 1, 2, 3].map((i) => (
        <StockBar key={i} p={p} i={i} />
      ))}
      {/* the stock that the order just used */}
      <motion.rect x={360} width={9} rx={2} fill={FILL} y={lastBarY} height={lastBar} />
      <motion.circle r={5} fill={FILL} cx={dotX} cy={dotY} style={{ opacity: dotOpacity }} />
      <Pop p={p} from={0.88} to={1}>
        <Check x={376} y={58} />
      </Pop>
    </Frame>
  );
}

function StockBar({ p, i }: { p: MotionValue<number>; i: number }) {
  const h = [30, 22, 34, 18][i];
  const height = useTransform(p, [0.3 + i * 0.04, 0.45 + i * 0.04], [0, h]);
  const y = useTransform(height, (v) => 186 - v);
  return <motion.rect x={304 + i * 14} width={9} rx={2} fill={FILL} fillOpacity={0.45} y={y} height={height} />;
}

/* ───────────── Apps: plug it in ───────────── */

function AppsArt({ p }: { p: MotionValue<number> }) {
  const leftX = useTransform(p, [0.3, 0.62], [-46, 0]);
  const rightX = useTransform(p, [0.3, 0.62], [46, 0]);
  const spark = useTransform(p, [0.62, 0.7, 0.82], [0, 1, 0]);
  const glowOpacity = useTransform(p, [0.62, 0.75], [0, 0.16]);
  const pulseX = useTransform(p, [0.75, 0.97], [104, 296]);
  const pulseOpacity = useTransform(p, [0.73, 0.76, 0.95, 0.98], [0, 1, 1, 0]);
  return (
    <Frame>
      {/* phone */}
      <Draw p={p} from={0} to={0.3} d={rectPath(42, 36, 64, 128, 12)} />
      <Draw p={p} from={0.18} to={0.32} d="M64 48H84" width={2} color={MUTED} />
      <Pop p={p} from={0.22} to={0.36}>
        <rect x={54} y={64} width={40} height={26} rx={5} fill={FILL} fillOpacity={0.18} />
        <path d="M54 102H94M54 114H82M54 126H90" stroke={MUTED} strokeWidth={3} strokeLinecap="round" />
      </Pop>
      {/* database */}
      <Draw p={p} from={0.05} to={0.35} d="M298 62c0-9 22-14 44-14s44 5 44 14-22 14-44 14-44-5-44-14z M298 62v76c0 9 22 14 44 14s44-5 44-14V62 M298 100c0 9 22 14 44 14s44-5 44-14" width={1.4} />
      {/* cables */}
      <Draw p={p} from={0.2} to={0.36} d="M106 100H150" />
      <Draw p={p} from={0.2} to={0.36} d="M250 100H298" />
      {/* connectors sliding together */}
      <motion.g style={{ x: leftX }}>
        <rect x={150} y={88} width={30} height={24} rx={5} fill={FILL} fillOpacity={0.18} stroke="currentColor" strokeWidth={1.4} />
        <path d="M180 94h12M180 106h12" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
      </motion.g>
      <motion.g style={{ x: rightX }}>
        <rect x={192} y={86} width={58} height={28} rx={6} fill={FILL} fillOpacity={0.18} stroke="currentColor" strokeWidth={1.4} />
        <path d="M200 94h6M200 106h6" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
      </motion.g>
      {/* the moment they connect */}
      <motion.circle cx={192} cy={100} r={26} fill={FILL} style={{ opacity: glowOpacity }} />
      <motion.g style={{ opacity: spark }} stroke={FILL} strokeWidth={2.2} strokeLinecap="round">
        <path d="M192 70v-10M192 130v10M170 78l-7-7M214 78l7-7M170 122l-7 7M214 122l7 7" />
      </motion.g>
      <motion.circle cy={100} r={5} fill={FILL} cx={pulseX} style={{ opacity: pulseOpacity }} />
    </Frame>
  );
}

/* ───────────── Automation: the order confirms itself ───────────── */

function AutomationArt({ p }: { p: MotionValue<number> }) {
  const typing = useTransform(p, [0.47, 0.5, 0.55, 0.58], [0, 1, 1, 0]);
  const confirmed = useTransform(p, [0.66, 0.74], [0, 1]);
  const truckX = useTransform(p, [0.8, 0.95], [0, 18]);
  const speed = useTransform(p, [0.8, 0.86, 1], [0, 1, 0.5]);
  return (
    <Frame>
      {/* the order */}
      <Draw p={p} from={0} to={0.28} d={rectPath(22, 50, 96, 104, 10)} />
      <Draw p={p} from={0.16} to={0.28} d="M22 72H118" width={1} />
      <Draw p={p} from={0.22} to={0.34} d="M36 90H100" width={3} color={MUTED} />
      <Draw p={p} from={0.26} to={0.38} d="M36 103H82" width={3} color={MUTED} />
      <Draw p={p} from={0.28} to={0.4} d={rectPath(36, 124, 60, 16, 8)} width={1.2} color={MUTED} />
      <motion.rect x={36} y={124} width={60} height={16} rx={8} fill={FILL} style={{ opacity: confirmed }} />
      {/* order → WhatsApp */}
      <Draw p={p} from={0.3} to={0.4} d="M118 96C138 96 142 62 160 62" width={1.4} />
      {/* the client's phone */}
      <Draw p={p} from={0.04} to={0.3} d={rectPath(160, 16, 100, 168, 14)} />
      <Draw p={p} from={0.2} to={0.3} d="M198 28H222" width={2} color={MUTED} />
      <Pop p={p} from={0.38} to={0.47}>
        <rect x={172} y={44} width={66} height={34} rx={9} fill={FILL} fillOpacity={0.12} stroke="currentColor" strokeWidth={1.2} />
        <path d="M182 56H226M182 66H212" stroke={MUTED} strokeWidth={3} strokeLinecap="round" />
      </Pop>
      <motion.g style={{ opacity: typing }} fill={MUTED}>
        <circle cx={222} cy={101} r={3} />
        <circle cx={232} cy={101} r={3} />
        <circle cx={242} cy={101} r={3} />
      </motion.g>
      <Pop p={p} from={0.57} to={0.66}>
        <rect x={204} y={88} width={46} height={26} rx={9} fill={FILL} />
        <path d="M218 101l5 5 9-10" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Pop>
      {/* WhatsApp → delivery */}
      <Draw p={p} from={0.66} to={0.75} d="M260 122C278 122 280 136 296 136" width={1.4} />
      <motion.g style={{ opacity: speed }} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        <path d="M290 122H276M292 134H272M290 146H280" />
      </motion.g>
      <motion.g style={{ x: truckX }}>
        <Draw p={p} from={0.1} to={0.38} d={rectPath(296, 112, 50, 36, 5)} />
        <Draw p={p} from={0.2} to={0.4} d="M346 124H362L372 136V148H346" />
        <Pop p={p} from={0.32} to={0.42}>
          <circle cx={312} cy={150} r={6} fill={FILL} fillOpacity={0.25} stroke="currentColor" strokeWidth={1.4} />
          <circle cx={360} cy={150} r={6} fill={FILL} fillOpacity={0.25} stroke="currentColor" strokeWidth={1.4} />
        </Pop>
      </motion.g>
      <Pop p={p} from={0.9} to={1}>
        <Check x={378} y={96} />
      </Pop>
    </Frame>
  );
}

/* ───────────── Email: past spam, into the inbox ───────────── */

/** Points along the envelope's flight: up toward spam, then down into the inbox. */
const FLIGHT = (() => {
  const P = [
    [46, 112],
    [150, 30],
    [250, 40],
    [300, 136],
  ];
  const pts: [number, number][] = [];
  for (let k = 0; k <= 12; k++) {
    const t = k / 12;
    const u = 1 - t;
    const x = u ** 3 * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t ** 3 * P[3][0];
    const y = u ** 3 * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t ** 3 * P[3][1];
    pts.push([x, y]);
  }
  return pts;
})();
const FLIGHT_T = FLIGHT.map((_, k) => 0.2 + (k / 12) * 0.58);

function EmailArt({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, FLIGHT_T, FLIGHT.map((q) => q[0]));
  const y = useTransform(p, FLIGHT_T, FLIGHT.map((q) => q[1]));
  const rotate = useTransform(p, [0.2, 0.45, 0.62, 0.78], [-14, 6, 18, 0]);
  const spamDim = useTransform(p, [0.6, 0.8], [1, 0.45]);
  const inboxFill = useTransform(p, [0.75, 0.85], [0, 0.14]);
  return (
    <Frame>
      {/* spam tray (where it would have gone) */}
      <motion.g style={{ opacity: spamDim }}>
        <Draw p={p} from={0.05} to={0.3} d={rectPath(300, 18, 84, 52, 8)} color={MUTED} width={1.4} />
        <path d="M342 32l9 16h-18z M342 38v4 M342 45v.5" fill="none" stroke={MUTED} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      </motion.g>
      {/* inbox tray */}
      <Draw p={p} from={0.08} to={0.33} d={rectPath(300, 112, 84, 60, 8)} />
      <motion.path d={rectPath(300, 112, 84, 60, 8)} fill={FILL} style={{ fillOpacity: inboxFill }} />
      <Draw p={p} from={0.2} to={0.34} d="M300 142h22l6 10h28l6-10h22" width={1.2} />
      {/* the trail */}
      <Draw p={p} from={0.2} to={0.78} d="M46 112C150 30 250 40 300 136" width={1.2} dashed />
      {/* envelope */}
      <motion.g style={{ x, y, rotate }}>
        <g transform="translate(-22 -15)">
          <rect width={44} height={30} rx={4} fill="#fff" stroke="currentColor" strokeWidth={1.5} />
          <path d="M2 3l20 14 20-14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
        </g>
      </motion.g>
      <Pop p={p} from={0.86} to={1}>
        <Check x={372} y={112} />
      </Pop>
    </Frame>
  );
}
