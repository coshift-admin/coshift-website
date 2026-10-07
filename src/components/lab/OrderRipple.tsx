"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowCounterClockwise,
  Calculator,
  Package,
  Receipt,
  Storefront,
  Truck,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { useVisible } from "@/hooks/useVisible";
import { cn } from "@/lib/cn";

/**
 * Lab — "One order, everything follows".
 *
 * A tiny live system map: the shop in the middle, wired to stock, invoice,
 * accounting, WhatsApp and delivery. Placing an order sends a glowing pulse
 * down every wire; each system flashes and updates the moment its pulse lands
 * (shorter wires land first). Stock running low turns coral and the system
 * suggests a re-order — the automation story in one gesture.
 *
 * Nodes are HTML (crisp, translatable text) positioned in % over an SVG of
 * the wires, measured in px so curves and pulses stay round at any size.
 * Demo values only (stock 8, 4 900 DA per order). Reduced motion: values
 * update and nodes flash, no travelling pulses.
 */

type NodeKey = "stock" | "invoice" | "accounting" | "whatsapp" | "delivery";
type Pt = { x: number; y: number };
type Size = { w: number; h: number };
type Shown = { stock: number; invoice: number; whatsapp: number; delivery: number; total: number };
type PulseSpec = { id: number; order: number; node: NodeKey };
type Wire = { a: Pt; c: Pt; b: Pt; d: string; duration: number };

const START_STOCK = 8;
const LOW_STOCK = 2;
const ORDER_VALUE = 4900;

/** Shop at the centre, the five systems on a pentagon around it (% of the map). */
const CENTER: Pt = { x: 50, y: 50 };
const NODES: { key: NodeKey; icon: Icon; at: Pt }[] = [
  { key: "invoice", icon: Receipt, at: { x: 50, y: 13 } },
  { key: "accounting", icon: Calculator, at: { x: 84, y: 40 } },
  { key: "whatsapp", icon: WhatsappLogo, at: { x: 72, y: 84 } },
  { key: "delivery", icon: Truck, at: { x: 28, y: 84 } },
  { key: "stock", icon: Package, at: { x: 16, y: 40 } },
];

/** How each system changes when an order's pulse reaches it. */
const APPLY: Record<NodeKey, (s: Shown) => Shown> = {
  stock: (s) => ({ ...s, stock: Math.max(0, s.stock - 1) }),
  invoice: (s) => ({ ...s, invoice: s.invoice + 1 }),
  accounting: (s) => ({ ...s, total: s.total + ORDER_VALUE }),
  whatsapp: (s) => ({ ...s, whatsapp: s.whatsapp + 1 }),
  delivery: (s) => ({ ...s, delivery: s.delivery + 1 }),
};

/** Algerian formats with Latin digits, as on the rest of the site. */
const INTL_LOCALE: Record<string, string> = { fr: "fr-DZ", en: "en-DZ", ar: "ar-DZ" };

const EASE: [number, number, number, number] = [0.45, 0, 0.25, 1];

const invoiceNo = (n: number) => `F-${String(n).padStart(4, "0")}`;

function wireFor(at: Pt, size: Size): Omit<Wire, "duration"> & { len: number } {
  const a = { x: (CENTER.x / 100) * size.w, y: (CENTER.y / 100) * size.h };
  const b = { x: (at.x / 100) * size.w, y: (at.y / 100) * size.h };
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const chord = Math.hypot(dx, dy) || 1;
  // bend each wire a little, away from the vertical axis, so the map reads as a web
  const side = at.x < CENTER.x ? -1 : 1;
  const bend = chord * 0.2 * side;
  const c = { x: (a.x + b.x) / 2 + (-dy / chord) * bend, y: (a.y + b.y) / 2 + (dx / chord) * bend };
  const len = (chord + Math.hypot(c.x - a.x, c.y - a.y) + Math.hypot(b.x - c.x, b.y - c.y)) / 2;
  return { a, c, b, d: `M${a.x} ${a.y}Q${c.x} ${c.y} ${b.x} ${b.y}`, len };
}

const quad = (p0: number, p1: number, p2: number, t: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

export function OrderRipple() {
  const t = useTranslations("lab.items.order");
  const locale = useLocale();
  const reduced = useReducedMotionPref();
  const rawId = useId();
  const glowId = `order-glow-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const visible = useVisible(rootRef);
  const inView = useInView(rootRef, { once: true, amount: 0.4 });

  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [available, setAvailable] = useState(START_STOCK);
  const [shown, setShown] = useState<Shown>({ stock: START_STOCK, invoice: 0, whatsapp: 0, delivery: 0, total: 0 });
  const [hits, setHits] = useState<Record<NodeKey | "shop", number>>({
    shop: 0,
    stock: 0,
    invoice: 0,
    accounting: 0,
    whatsapp: 0,
    delivery: 0,
  });
  const [pulses, setPulses] = useState<PulseSpec[]>([]);
  const [orders, setOrders] = useState(0);
  const [announce, setAnnounce] = useState("");

  const availableRef = useRef(START_STOCK);
  const shownStockRef = useRef(START_STOCK);
  const inflight = useRef(0);
  const orderSeq = useRef(0);
  const pulseSeq = useRef(0);
  const arrivals = useRef(new Map<number, number>());
  const restockTimers = useRef(new Set<number>());

  useEffect(() => {
    shownStockRef.current = shown.stock;
  }, [shown.stock]);

  // measure the map so wires and pulses are drawn in real pixels
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const pending = restockTimers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const wires = useMemo(() => {
    if (!size.w || !size.h) return null;
    const raw = NODES.map((n) => wireFor(n.at, size));
    const longest = Math.max(...raw.map((w) => w.len));
    return Object.fromEntries(
      NODES.map((n, i) => {
        const { a, c, b, d, len } = raw[i];
        return [n.key, { a, c, b, d, duration: 0.5 + 0.55 * (len / longest) }];
      }),
    ) as Record<NodeKey, Wire>;
  }, [size]);

  const money = useMemo(
    () =>
      new Intl.NumberFormat(INTL_LOCALE[locale] ?? locale, {
        style: "currency",
        currency: "DZD",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const arrive = useCallback(
    (order: number, node: NodeKey) => {
      setHits((h) => ({ ...h, [node]: h[node] + 1 }));
      setShown(APPLY[node]);
      if (node === "stock") inflight.current = Math.max(0, inflight.current - 1);
      const count = (arrivals.current.get(order) ?? 0) + 1;
      if (count >= NODES.length) {
        arrivals.current.delete(order);
        setAnnounce(t("announce", { invoice: invoiceNo(order) }));
      } else {
        arrivals.current.set(order, count);
      }
    },
    [t],
  );

  const place = useCallback(() => {
    if (availableRef.current <= 0) return;
    availableRef.current -= 1;
    setAvailable(availableRef.current);
    inflight.current += 1;
    const order = ++orderSeq.current;
    setOrders(order);
    setHits((h) => ({ ...h, shop: h.shop + 1 }));
    if (reduced || !wires) {
      NODES.forEach((n) => arrive(order, n.key));
      return;
    }
    setPulses((list) => [...list, ...NODES.map((n) => ({ id: ++pulseSeq.current, order, node: n.key }))]);
  }, [reduced, wires, arrive]);

  const onPulseDone = useCallback(
    (pulse: PulseSpec) => {
      setPulses((list) => list.filter((p) => p.id !== pulse.id));
      arrive(pulse.order, pulse.node);
    },
    [arrive],
  );

  /** The suggested re-order: stock climbs back to 8, one unit at a time. */
  const restock = useCallback(() => {
    restockTimers.current.forEach((id) => window.clearTimeout(id));
    restockTimers.current.clear();
    availableRef.current = START_STOCK - inflight.current;
    setAvailable(availableRef.current);
    setHits((h) => ({ ...h, stock: h.stock + 1 }));
    if (reduced) {
      setShown((s) => ({ ...s, stock: START_STOCK }));
      return;
    }
    const steps = START_STOCK - shownStockRef.current;
    for (let i = 1; i <= steps; i++) {
      restockTimers.current.add(
        window.setTimeout(() => setShown((s) => ({ ...s, stock: Math.min(START_STOCK, s.stock + 1) })), i * 90),
      );
    }
  }, [reduced]);

  // autoplay: one order the first time the map comes into view
  const placeRef = useRef(place);
  useEffect(() => {
    placeRef.current = place;
  }, [place]);
  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(() => placeRef.current(), 650);
    return () => window.clearTimeout(id);
  }, [inView]);

  const low = shown.stock <= LOW_STOCK;
  const flowing = visible && !reduced;

  const value: Record<NodeKey, ReactNode> = {
    stock: t("values.stock", { count: String(shown.stock) }),
    invoice: shown.invoice ? <span dir="ltr">{invoiceNo(shown.invoice)}</span> : t("values.waiting"),
    accounting: t("values.total", { amount: money.format(shown.total) }),
    whatsapp: shown.whatsapp ? t("values.whatsapp") : t("values.waiting"),
    delivery: shown.delivery ? t("values.delivery", { count: String(shown.delivery) }) : t("values.waiting"),
  };

  return (
    <div
      ref={rootRef}
      className="relative flex h-[clamp(400px,40vw,480px)] w-full flex-col bg-[radial-gradient(60%_55%_at_50%_45%,color-mix(in_oklab,var(--coshift-cyan)_10%,transparent),transparent_75%)]"
    >
      <div ref={mapRef} className="relative m-3 min-h-0 flex-1">
        {wires && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            <defs>
              <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {NODES.map((n) => (
              <motion.path
                key={n.key}
                d={wires[n.key].d}
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeDasharray="2 6"
                animate={{ strokeDashoffset: flowing ? [0, -16] : 0 }}
                transition={flowing ? { duration: 1.4, repeat: Infinity, ease: "linear" } : { duration: 0 }}
              />
            ))}
            {pulses.map((p) => (
              <Pulse key={p.id} spec={p} wire={wires[p.node]} glowId={glowId} onDone={onPulseDone} />
            ))}
          </svg>
        )}

        <CenterNode label={t("nodes.shop")} hits={hits.shop} />

        {NODES.map((n) => (
          <NodeCard
            key={n.key}
            icon={n.icon}
            at={n.at}
            label={t(`nodes.${n.key}`)}
            value={value[n.key]}
            hits={hits[n.key]}
            warm={n.key === "stock" && low}
            chip={
              n.key === "stock" && low ? (
                <span className="mt-1 rounded-full bg-[color-mix(in_oklab,var(--warm)_18%,transparent)] px-2 py-0.5 text-[0.6rem] font-semibold leading-tight text-[var(--warm-300)]">
                  {t("lowStock")}
                </span>
              ) : null
            }
            float={
              n.key === "accounting" && hits.accounting > 0 ? (
                <motion.span
                  key={hits.accounting}
                  aria-hidden
                  className="tabular pointer-events-none absolute -top-4 whitespace-nowrap text-[0.7rem] font-bold text-[var(--status-ok)]"
                  initial={{ opacity: 0, y: 4 }}
                  animate={reduced ? { opacity: [0, 1, 0] } : { opacity: [0, 1, 0], y: -14 }}
                  transition={{ duration: 1.2, ease: EASE }}
                >
                  +{money.format(ORDER_VALUE)}
                </motion.span>
              ) : null
            }
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2 border-t border-white/[0.07] px-4 py-3">
        <button
          type="button"
          onClick={place}
          disabled={available === 0}
          className="rounded-lg bg-[var(--coshift-cyan)] px-4 py-2.5 text-sm font-bold text-[#170f3c] transition-opacity duration-[var(--dur-ds-fast)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {available === 0 ? t("soldOut") : t("place")}
        </button>
        {low && (
          <button
            type="button"
            onClick={restock}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.06]"
          >
            <ArrowCounterClockwise weight="fill" aria-hidden className="size-4 text-[var(--warm)]" />
            {t("restock")}
          </button>
        )}
        <span className="tabular ms-auto text-xs text-[var(--navy-300)]">
          {t("orders", { count: String(orders) })}
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/* ───────────── pieces ───────────── */

/** One glowing pulse with a short comet tail, travelling shop → system. */
function Pulse({
  spec,
  wire,
  glowId,
  onDone,
}: {
  spec: PulseSpec;
  wire: Wire;
  glowId: string;
  onDone: (spec: PulseSpec) => void;
}) {
  const progress = useMotionValue(0);
  const cx = useTransform(progress, (v) => quad(wire.a.x, wire.c.x, wire.b.x, v));
  const cy = useTransform(progress, (v) => quad(wire.a.y, wire.c.y, wire.b.y, v));
  const tail = useTransform(progress, (v) => Math.min(v, 0.24));
  const tailStart = useTransform(progress, (v) => Math.max(0, v - 0.24));
  const opacity = useTransform(progress, [0, 0.06, 0.9, 1], [0, 1, 1, 0]);

  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  // one flight per pulse (a resize mid-flight just continues from where it is)
  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: wire.duration,
      ease: EASE,
      onComplete: () => doneRef.current(spec),
    });
    return () => controls.stop();
  }, [progress, spec, wire.duration]);

  return (
    <g>
      <motion.path
        d={wire.d}
        fill="none"
        stroke="var(--coshift-cyan)"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ pathLength: tail, pathOffset: tailStart, opacity }}
      />
      <motion.circle r={4.5} fill="var(--cyan-300)" filter={`url(#${glowId})`} cx={cx} cy={cy} style={{ opacity }} />
    </g>
  );
}

/** A one-shot ring + fill flash, replayed by changing `hits` (the key). */
function Flash({ hits, radius }: { hits: number; radius: string }) {
  if (hits === 0) return null;
  return (
    <>
      <motion.span
        key={`ring-${hits}`}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 border-2 border-current", radius)}
        initial={{ opacity: 0.9, scale: 1 }}
        animate={{ opacity: 0, scale: 1.9 }}
        transition={{ duration: 0.7, ease: [0.2, 0, 0.1, 1] }}
      />
      <motion.span
        key={`fill-${hits}`}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 bg-current", radius)}
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0.1, 1] }}
      />
    </>
  );
}

function CenterNode({ label, hits }: { label: string; hits: number }) {
  return (
    <div
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
    >
      <span className="relative grid size-12 place-items-center rounded-2xl bg-[var(--coshift-cyan)] text-[#170f3c] shadow-[0_0_0_6px_color-mix(in_oklab,var(--coshift-cyan)_14%,transparent),0_10px_30px_-8px_color-mix(in_oklab,var(--coshift-cyan)_70%,transparent)]">
        <span className="absolute inset-0 text-[var(--cyan-300)]">
          <Flash hits={hits} radius="rounded-2xl" />
        </span>
        <Storefront weight="fill" aria-hidden className="relative size-6" />
      </span>
      <span className="text-mono mt-2 text-[0.62rem] text-[var(--cyan-300)]">{label}</span>
    </div>
  );
}

function NodeCard({
  icon: NodeIcon,
  at,
  label,
  value,
  hits,
  warm,
  chip,
  float,
}: {
  icon: Icon;
  at: Pt;
  label: string;
  value: ReactNode;
  hits: number;
  warm: boolean;
  chip: ReactNode;
  float: ReactNode;
}) {
  return (
    <div
      className="absolute z-10 flex w-max max-w-[6.75rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center sm:max-w-[8.5rem]"
      style={{ left: `${at.x}%`, top: `${at.y}%` }}
    >
      {float}
      <span
        className={cn(
          "relative grid size-9 place-items-center rounded-xl border bg-[var(--coshift-haze)] transition-colors duration-300",
          warm
            ? "border-[color-mix(in_oklab,var(--warm)_55%,transparent)] text-[var(--warm)]"
            : "border-white/10 text-[var(--cyan-300)]",
        )}
      >
        <Flash hits={hits} radius="rounded-xl" />
        <NodeIcon weight="fill" aria-hidden className="relative size-[18px]" />
      </span>
      <span className="text-mono mt-1.5 text-[0.6rem] text-[var(--navy-300)]">{label}</span>
      <span
        className={cn(
          "tabular mt-0.5 text-[0.72rem] font-semibold leading-tight transition-colors duration-300",
          warm ? "text-[var(--warm-300)]" : "text-white",
        )}
      >
        {value}
      </span>
      {chip}
    </div>
  );
}
