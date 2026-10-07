"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle, PaperPlaneTilt, Tray, WarningOctagon } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Lab — "Spam or inbox?".
 *
 * Three switches — SPF, DKIM, DMARC — each explained in one plain line. Every
 * change sends a fresh email: it always heads for the inbox, but unless all
 * three proofs are on it gets knocked down into spam. A 3-step trust meter
 * fills as switches go on. Autoplay (once): everything off → spam, then the
 * three switches flip on one by one until it lands in the inbox.
 *
 * Positions are % of the scene (mirrored for Arabic, so the email flies the
 * reading way); the flight is a cubic curve measured in px. Reduced motion:
 * the result shows at once, no flight.
 */

const SETTINGS = ["spf", "dkim", "dmarc"] as const;
type Setting = (typeof SETTINGS)[number];
type Settings = Record<Setting, boolean>;
type Dest = "inbox" | "spam";
type Pt = { x: number; y: number };

const NAMES: Record<Setting, string> = { spf: "SPF", dkim: "DKIM", dmarc: "DMARC" };
const ALL_OFF: Settings = { spf: false, dkim: false, dmarc: false };

/** Stations (% of the scene, LTR). */
const OUTBOX: Pt = { x: 16, y: 50 };
const AT: Record<Dest, Pt> = { inbox: { x: 82, y: 22 }, spam: { x: 82, y: 78 } };
/** Both flights rise toward the inbox; the spam one gets knocked down at the end. */
const CURVES: Record<Dest, [Pt, Pt, Pt, Pt]> = {
  inbox: [OUTBOX, { x: 34, y: 12 }, { x: 60, y: 6 }, AT.inbox],
  spam: [OUTBOX, { x: 38, y: 8 }, { x: 70, y: 14 }, AT.spam],
};

const ENV_W = 44;
const ENV_H = 30;
const EASE: [number, number, number, number] = [0.45, 0, 0.25, 1];

const cubic = (p: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const u = 1 - t;
  const k0 = u * u * u;
  const k1 = 3 * u * u * t;
  const k2 = 3 * u * t * t;
  const k3 = t * t * t;
  return {
    x: k0 * p[0].x + k1 * p[1].x + k2 * p[2].x + k3 * p[3].x,
    y: k0 * p[0].y + k1 * p[1].y + k2 * p[2].y + k3 * p[3].y,
  };
};

export function InboxTest() {
  const t = useTranslations("lab.items.inbox");
  const rtl = useLocale() === "ar";
  const reduced = useReducedMotionPref();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.4 });

  const [settings, setSettings] = useState<Settings>(ALL_OFF);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [flying, setFlying] = useState<Dest | null>(null);
  const [landed, setLanded] = useState<Dest | null>(null);
  const [landings, setLandings] = useState(0);
  const [announce, setAnnounce] = useState("");

  // the flight reads these refs, so the motion values never need re-creating
  const sizeRef = useRef(size);
  const rtlRef = useRef(rtl);
  const destRef = useRef<Dest>("inbox");
  const flight = useRef<AnimationPlaybackControls | null>(null);
  const fades = useRef<AnimationPlaybackControls[]>([]);
  const timers = useRef(new Set<number>());

  const progress = useMotionValue(0);
  const relayout = useMotionValue(0);
  const opacity = useMotionValue(1);
  const scale = useMotionValue(1);

  const px = (p: Pt) => {
    const { w, h } = sizeRef.current;
    return { x: ((rtlRef.current ? 100 - p.x : p.x) / 100) * w, y: (p.y / 100) * h };
  };
  const x = useTransform([progress, relayout], ([v]: number[]) => px(cubic(CURVES[destRef.current], v)).x - ENV_W / 2);
  const y = useTransform([progress, relayout], ([v]: number[]) => px(cubic(CURVES[destRef.current], v)).y - ENV_H / 2);
  const tilt = useTransform(progress, [0, 0.35, 0.8, 1], [-12, 4, 12, 0]);
  const rotate = useTransform(tilt, (r) => (rtlRef.current ? -r : r));

  useEffect(() => {
    rtlRef.current = rtl;
    relayout.set(relayout.get() + 1);
  }, [rtl, relayout]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = { w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) };
      sizeRef.current = next;
      setSize(next);
      relayout.set(relayout.get() + 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [relayout]);

  const stopAll = useCallback(() => {
    flight.current?.stop();
    fades.current.forEach((c) => c.stop());
    fades.current = [];
  }, []);

  useEffect(() => stopAll, [stopAll]);

  const land = useCallback(
    (dest: Dest) => {
      setFlying(null);
      setLanded(dest);
      setLandings((n) => n + 1);
      setAnnounce(t(dest === "inbox" ? "delivered" : "spammed"));
      if (reduced) {
        opacity.set(0);
        return;
      }
      // the envelope drops into its tray
      fades.current = [
        animate(opacity, 0, { duration: 0.3, delay: 0.08, ease: EASE }),
        animate(scale, 0.55, { duration: 0.3, delay: 0.08, ease: EASE }),
      ];
    },
    [t, reduced, opacity, scale],
  );

  /** Send a fresh email with the given proofs switched on. */
  const send = useCallback(
    (proofs: Settings) => {
      const dest: Dest = SETTINGS.every((k) => proofs[k]) ? "inbox" : "spam";
      stopAll();
      destRef.current = dest;
      setLanded(null);
      if (reduced) {
        progress.set(1);
        land(dest);
        return;
      }
      setFlying(dest);
      progress.set(0);
      opacity.set(1);
      scale.set(1);
      flight.current = animate(progress, 1, { duration: 1.05, ease: EASE, onComplete: () => land(dest) });
    },
    [stopAll, reduced, progress, opacity, scale, land],
  );

  const apply = useCallback(
    (next: Settings) => {
      setSettings(next);
      send(next);
    },
    [send],
  );

  const cancelAutoplay = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.clear();
  };

  const toggle = (key: Setting) => {
    cancelAutoplay();
    apply({ ...settings, [key]: !settings[key] });
  };

  const resend = () => {
    cancelAutoplay();
    send(settings);
  };

  // autoplay once: all off → spam, then SPF, DKIM, DMARC on, one by one → inbox
  const applyRef = useRef(apply);
  useEffect(() => {
    applyRef.current = apply;
  }, [apply]);
  useEffect(() => {
    if (!inView) return;
    const pending = timers.current;
    const steps: [number, Settings][] = [
      [600, ALL_OFF],
      [2000, { spf: true, dkim: false, dmarc: false }],
      [3300, { spf: true, dkim: true, dmarc: false }],
      [4600, { spf: true, dkim: true, dmarc: true }],
    ];
    steps.forEach(([delay, next]) => {
      const id = window.setTimeout(() => {
        pending.delete(id);
        applyRef.current(next);
      }, delay);
      pending.add(id);
    });
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      pending.clear();
    };
  }, [inView]);

  const count = SETTINGS.filter((k) => settings[k]).length;
  const lit = flying ?? landed;

  const pathD = (dest: Dest) => {
    if (!size.w) return "";
    const [a, b, c, d] = CURVES[dest].map(px);
    return `M${a.x} ${a.y}C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`;
  };

  return (
    <div ref={rootRef} className="relative flex w-full flex-col sm:h-[clamp(400px,40vw,480px)] sm:flex-row">
      {/* the three proofs */}
      <div className="flex flex-col gap-1 border-t border-white/[0.07] p-3 sm:w-[48%] sm:border-e sm:border-t-0 sm:p-4">
        {SETTINGS.map((key) => (
          <ProofSwitch
            key={key}
            name={NAMES[key]}
            body={t(`settings.${key}`)}
            on={settings[key]}
            onToggle={() => toggle(key)}
          />
        ))}
        <div className="mt-auto flex items-center gap-3 px-2.5 pt-3">
          <TrustMeter count={count} label={t("trust")} />
          <button
            type="button"
            onClick={resend}
            className="ms-auto inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.06]"
          >
            {t("send")}
            <PaperPlaneTilt weight="fill" aria-hidden className="size-4 text-[var(--cyan-300)] rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      {/* the flight */}
      <div className="order-first flex min-h-[230px] flex-1 flex-col sm:order-none">
        <div ref={sceneRef} className="relative m-3 min-h-0 flex-1">
          {size.w > 0 && (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${size.w} ${size.h}`}
            >
              {(["inbox", "spam"] as const).map((dest) => (
                <path
                  key={dest}
                  d={pathD(dest)}
                  fill="none"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeDasharray="3 6"
                  className="transition-[stroke] duration-300"
                  stroke={
                    lit === dest
                      ? dest === "inbox"
                        ? "var(--status-ok)"
                        : "var(--status-warn)"
                      : "rgba(255,255,255,0.14)"
                  }
                />
              ))}
            </svg>
          )}

          <Station at={OUTBOX} rtl={rtl} icon={PaperPlaneTilt} label={t("outbox")} tone="idle" flash={0} />
          <Station
            at={AT.inbox}
            rtl={rtl}
            icon={Tray}
            label={t("inbox")}
            tone={landed === "inbox" ? "ok" : "idle"}
            flash={landed === "inbox" ? landings : 0}
            badge={landed === "inbox"}
          />
          <Station
            at={AT.spam}
            rtl={rtl}
            icon={WarningOctagon}
            label={t("spam")}
            tone={landed === "spam" ? "warn" : "idle"}
            flash={landed === "spam" ? landings : 0}
          />

          {size.w > 0 && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-20 drop-shadow-[0_8px_18px_rgba(51,197,243,0.45)]"
              style={{ x, y, rotate, opacity, scale, width: ENV_W, height: ENV_H }}
            >
              <svg viewBox="0 0 44 30" className="block h-full w-full">
                <rect width={44} height={30} rx={4} fill="#fff" />
                <path
                  d="M3 4l19 13 19-13"
                  fill="none"
                  stroke="#0d0826"
                  strokeOpacity={0.35}
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          )}
        </div>

        <p aria-hidden className="mb-3 h-5 px-3 text-center text-sm font-semibold">
          {landed && (
            <motion.span
              key={landings}
              className={landed === "inbox" ? "text-[var(--status-ok)]" : "text-[var(--status-warn)]"}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {t(landed === "inbox" ? "delivered" : "spammed")}
            </motion.span>
          )}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/* ───────────── pieces ───────────── */

function ProofSwitch({
  name,
  body,
  on,
  onToggle,
}: {
  name: string;
  body: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex w-full items-start gap-3 rounded-lg p-2.5 text-start transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--coshift-cyan)]"
    >
      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          on ? "bg-[var(--coshift-cyan)]" : "bg-white/15",
        )}
      >
        <span
          className={cn(
            "absolute start-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200 ease-[var(--ease-ds)]",
            on && "translate-x-4 rtl:-translate-x-4",
          )}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold tracking-wide text-white">{name}</span>
        <span className="mt-0.5 block text-xs leading-snug text-[var(--navy-300)]">{body}</span>
      </span>
    </button>
  );
}

function TrustMeter({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-mono text-[0.62rem] text-[var(--navy-300)]">{label}</span>
      <span aria-hidden className="flex gap-1">
        {SETTINGS.map((key, i) => (
          <span
            key={key}
            className={cn(
              "h-1.5 w-5 rounded-full transition-colors duration-300",
              i < count ? (count === SETTINGS.length ? "bg-[var(--status-ok)]" : "bg-[var(--coshift-cyan)]") : "bg-white/15",
            )}
          />
        ))}
      </span>
    </div>
  );
}

function Station({
  at,
  rtl,
  icon: StationIcon,
  label,
  tone,
  flash,
  badge = false,
}: {
  at: Pt;
  rtl: boolean;
  icon: Icon;
  label: string;
  tone: "idle" | "ok" | "warn";
  flash: number;
  badge?: boolean;
}) {
  return (
    <div
      className="absolute z-10 flex w-max max-w-[7.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
      style={{ left: `${rtl ? 100 - at.x : at.x}%`, top: `${at.y}%` }}
    >
      <span
        className={cn(
          "relative grid size-12 place-items-center rounded-xl border bg-[var(--coshift-haze)] transition-colors duration-300",
          tone === "ok" && "border-[color-mix(in_oklab,var(--status-ok)_55%,transparent)] text-[var(--status-ok)]",
          tone === "warn" && "border-[color-mix(in_oklab,var(--status-warn)_55%,transparent)] text-[var(--status-warn)]",
          tone === "idle" && "border-white/15 text-[var(--navy-100)]",
        )}
      >
        {flash > 0 && (
          <motion.span
            key={flash}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl border-2 border-current"
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0.1, 1] }}
          />
        )}
        <StationIcon weight="fill" aria-hidden className="size-6" />
        {badge && (
          <CheckCircle
            weight="fill"
            aria-hidden
            className="absolute -end-2 -top-2 size-5 rounded-full bg-[var(--coshift-ink)] text-[var(--status-ok)]"
          />
        )}
      </span>
      <span className="text-mono mt-1.5 text-[0.62rem] text-[var(--navy-300)]">{label}</span>
    </div>
  );
}
