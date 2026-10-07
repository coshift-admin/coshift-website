"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle,
  EnvelopeSimple,
  FileXls,
  Globe,
  Invoice,
  Package,
  Receipt,
  ShoppingCartSimple,
  Storefront,
  User,
  WarningCircle,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { CoshiftCO } from "@/components/icons/CoshiftWordmark";
import { cn } from "@/lib/cn";

/**
 * The hero's "shift", made tangible. Five everyday tools of an SME sit
 * scattered around "you" (stock in Excel, orders on WhatsApp, a website on its
 * own, hand-made invoices, a @gmail address). Flip to "after the shift" and
 * the same five pieces snap into one system wired to a single hub.
 *
 * Plays once on its own (with a visible countdown under the toggle), then the
 * visitor drives it. Motion is CSS transitions on transform/opacity
 * (globals.css → "Shift board"); this component only flips `data-state`.
 */

type BoardState = "before" | "after";
type Pt = { x: number; y: number };

const AUTO_MS = 3200;
const PRELOADER_MS = 1350; // matches --intro-delay

type NodeDef = {
  key: "stock" | "orders" | "site" | "invoices" | "email";
  iconBefore: Icon;
  iconAfter: Icon;
  /** Positions in % of the board — wide (5:4) and narrow/phone (4:5). */
  wide: { before: Pt & { r: number }; after: Pt };
  narrow: { before: Pt & { r: number }; after: Pt };
};

const NODES: NodeDef[] = [
  {
    key: "stock",
    iconBefore: FileXls,
    iconAfter: Package,
    wide: { before: { x: 24, y: 15, r: -7 }, after: { x: 50, y: 13 } },
    narrow: { before: { x: 30, y: 11, r: -6 }, after: { x: 27, y: 39 } },
  },
  {
    key: "orders",
    iconBefore: WhatsappLogo,
    iconAfter: ShoppingCartSimple,
    wide: { before: { x: 75, y: 22, r: 6 }, after: { x: 79, y: 40 } },
    narrow: { before: { x: 70, y: 26, r: 5 }, after: { x: 73, y: 39 } },
  },
  {
    key: "site",
    iconBefore: Globe,
    iconAfter: Storefront,
    wide: { before: { x: 77, y: 60, r: -5 }, after: { x: 69, y: 84 } },
    narrow: { before: { x: 69, y: 75, r: -5 }, after: { x: 73, y: 64 } },
  },
  {
    key: "invoices",
    iconBefore: Receipt,
    iconAfter: Invoice,
    wide: { before: { x: 23, y: 62, r: 8 }, after: { x: 31, y: 84 } },
    narrow: { before: { x: 28, y: 60, r: 7 }, after: { x: 27, y: 64 } },
  },
  {
    key: "email",
    iconBefore: EnvelopeSimple,
    iconAfter: EnvelopeSimple,
    wide: { before: { x: 55, y: 87, r: -4 }, after: { x: 21, y: 40 } },
    narrow: { before: { x: 40, y: 90, r: -3 }, after: { x: 50, y: 89 } },
  },
];

const HUB = {
  wide: { before: { x: 50, y: 40 }, after: { x: 50, y: 49 } },
  narrow: { before: { x: 63, y: 45 }, after: { x: 50, y: 13 } },
};

/* ---------- connector geometry (SVG units: width = 100 × aspect) ---------- */
const WIDE_W = 125; // 5:4
const NARROW_W = 80; // 4:5

const sx = (p: Pt, w: number) => (p.x * w) / 100;

function straight(a: Pt, b: Pt, w: number) {
  return `M${sx(a, w).toFixed(2)} ${a.y.toFixed(2)} L${sx(b, w).toFixed(2)} ${b.y.toFixed(2)}`;
}

/** A bowed link — the "before" wiring is deliberately untidy. */
function bowed(a: Pt, b: Pt, w: number, bend: number) {
  const ax = sx(a, w);
  const bx = sx(b, w);
  const dx = bx - ax;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (ax + bx) / 2 - (dy / len) * bend;
  const cy = (a.y + b.y) / 2 + (dx / len) * bend;
  return `M${ax.toFixed(2)} ${a.y.toFixed(2)} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${bx.toFixed(2)} ${b.y.toFixed(2)}`;
}

function linesFor(layout: "wide" | "narrow") {
  const w = layout === "wide" ? WIDE_W : NARROW_W;
  const hub = HUB[layout];
  const node = (key: NodeDef["key"]) => NODES.find((n) => n.key === key)![layout];
  return {
    w,
    before: [
      ...NODES.map((n, i) => bowed(hub.before, n[layout].before, w, i % 2 ? 7 : -7)),
      // tools that should talk to each other, patched by hand
      bowed(node("stock").before, node("site").before, w, 10),
      bowed(node("orders").before, node("invoices").before, w, -12),
    ],
    after: NODES.map((n) => straight(hub.after, n[layout].after, w)),
    // pulses run from each tool into the hub
    pulses: NODES.map((n) => straight(n[layout].after, hub.after, w)),
  };
}

const LINES = { wide: linesFor("wide"), narrow: linesFor("narrow") };

function nodeVars(n: NodeDef, i: number): CSSProperties {
  return {
    "--bx": n.wide.before.x,
    "--by": n.wide.before.y,
    "--br": `${n.wide.before.r}deg`,
    "--ax": n.wide.after.x,
    "--ay": n.wide.after.y,
    "--mbx": n.narrow.before.x,
    "--mby": n.narrow.before.y,
    "--mbr": `${n.narrow.before.r}deg`,
    "--max": n.narrow.after.x,
    "--may": n.narrow.after.y,
    "--d": `${i * 70}ms`,
  } as CSSProperties;
}

const HUB_VARS = {
  "--bx": HUB.wide.before.x,
  "--by": HUB.wide.before.y,
  "--ax": HUB.wide.after.x,
  "--ay": HUB.wide.after.y,
  "--mbx": HUB.narrow.before.x,
  "--mby": HUB.narrow.before.y,
  "--max": HUB.narrow.after.x,
  "--may": HUB.narrow.after.y,
} as CSSProperties;

export function ShiftBoard() {
  const t = useTranslations("home.hero.board");
  const [state, setState] = useState<BoardState>("before");
  const [auto, setAuto] = useState(true);

  // Flip once by itself so every visitor sees the shift; reduced-motion
  // visitors start on the outcome and can compare with the toggle.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("after");
      setAuto(false);
      return;
    }
    const preloading = document.documentElement.dataset.preloaded === undefined;
    const id = window.setTimeout(
      () => {
        setState("after");
        setAuto(false);
      },
      AUTO_MS + (preloading ? PRELOADER_MS : 0),
    );
    return () => window.clearTimeout(id);
  }, []);

  const choose = (next: BoardState) => {
    setAuto(false);
    setState(next);
  };

  const after = state === "after";

  return (
    <figure className="board-shell w-full">
      <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[color-mix(in_oklab,var(--coshift-haze)_60%,transparent)]">
        {/* top bar: what you're looking at + the switch */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-3 py-2.5 sm:px-4">
          <span className="text-mono flex min-w-0 items-center gap-2 text-[0.66rem] text-[var(--navy-300)]">
            <span
              aria-hidden
              className={cn(
                "size-1.5 shrink-0 rounded-full transition-colors duration-[var(--dur-ds-slow)]",
                after ? "bg-[var(--status-live)]" : "bg-[var(--status-warn)]",
              )}
            />
            <span className="truncate max-sm:sr-only">{t("title")}</span>
          </span>

          <div
            role="group"
            aria-label={t("toggleLabel")}
            className="relative grid shrink-0 grid-cols-2 rounded-lg border border-white/10 bg-white/[0.03] p-1"
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-1 start-1 w-[calc(50%-4px)] rounded-md transition-[translate,background-color] duration-[var(--dur-ds-slow)] ease-[var(--ease-ds)]",
                // logical start + a translate that follows the reading direction
                after ? "translate-x-full bg-[var(--coshift-cyan)] rtl:-translate-x-full" : "bg-white/10",
              )}
            />
            <button
              type="button"
              aria-pressed={!after}
              onClick={() => choose("before")}
              className={cn(
                "relative rounded-md px-2.5 py-1.5 text-[0.8rem] font-semibold transition-colors duration-[var(--dur-ds-normal)] sm:px-3.5 sm:text-sm",
                after ? "text-white/60 hover:text-white" : "text-white",
              )}
            >
              {t("before")}
            </button>
            <button
              type="button"
              aria-pressed={after}
              onClick={() => choose("after")}
              className={cn(
                "relative rounded-md px-2.5 py-1.5 text-[0.8rem] font-semibold transition-colors duration-[var(--dur-ds-normal)] sm:px-3.5 sm:text-sm",
                after ? "text-[#170f3c]" : "text-white/80 hover:text-white",
              )}
            >
              {t("after")}
              {auto && (
                <span
                  aria-hidden
                  style={{ ["--board-auto" as string]: `${AUTO_MS}ms` }}
                  className="board-countdown absolute inset-x-2 bottom-0.5 h-[2px] rounded-full bg-[var(--coshift-cyan)]"
                />
              )}
            </button>
          </div>
        </div>

        {/* the board */}
        <div className="board relative" data-state={state}>
          {/* blueprint grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px]"
          />

          <Connectors layout="wide" />
          <Connectors layout="narrow" />

          {/* hub: "you, in the middle of everything" → "one system" */}
          <div className="board-node board-hub" style={HUB_VARS} aria-hidden>
            <div className="board-hub-core relative grid size-[clamp(46px,12cqw,68px)] place-items-center rounded-2xl border border-white/15 bg-white/[0.05]">
              <User
                weight="fill"
                className="board-face board-face-before size-[46%] text-[var(--navy-100)] [grid-area:1/1]"
              />
              <CoshiftCO className="board-face board-face-after w-[64%] text-[var(--coshift-cyan)] [grid-area:1/1]" />
              <span className="absolute left-1/2 top-full mt-2 grid -translate-x-1/2 whitespace-nowrap text-center">
                <span className="board-face board-face-before rounded-md bg-[var(--coshift-ink)]/85 px-2 py-0.5 [grid-area:1/1]">
                  <span className="block text-[clamp(11px,2.4cqw,13px)] font-bold text-white">
                    {t("hub.before.title")}
                  </span>
                  <span className="block text-[clamp(10px,2cqw,11.5px)] text-[var(--navy-300)]">
                    {t("hub.before.sub")}
                  </span>
                </span>
                <span className="board-face board-face-after rounded-md bg-[var(--coshift-ink)]/85 px-2 py-0.5 [grid-area:1/1]">
                  <span className="block text-[clamp(11px,2.4cqw,13px)] font-bold text-white">
                    {t("hub.after.title")}
                  </span>
                  <span className="block text-[clamp(10px,2cqw,11.5px)] text-[var(--navy-300)]">
                    {t("hub.after.sub")}
                  </span>
                </span>
              </span>
            </div>
          </div>

          {NODES.map((n, i) => (
            <div key={n.key} className="board-node" style={nodeVars(n, i)} aria-hidden>
              <div className="board-card grid rounded-xl border border-white/10 bg-[color-mix(in_oklab,var(--coshift-haze)_92%,white)] p-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] sm:p-2.5">
                <Face
                  kind="before"
                  icon={n.iconBefore}
                  label={t(`nodes.${n.key}.before.label`)}
                  status={t(`nodes.${n.key}.before.status`)}
                />
                <Face
                  kind="after"
                  icon={n.iconAfter}
                  label={t(`nodes.${n.key}.after.label`)}
                  status={t(`nodes.${n.key}.after.status`)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* what the picture means, in one line */}
        <figcaption className="grid border-t border-white/[0.07] px-3 py-3 text-[0.9rem] leading-snug sm:px-4">
          <span
            className={cn(
              "transition-opacity duration-[var(--dur-ds-slow)] [grid-area:1/1]",
              after ? "opacity-0" : "opacity-100",
            )}
            aria-hidden={after}
          >
            <span className="font-semibold text-white">{t("caption.before.strong")}</span>{" "}
            <span className="text-[var(--navy-300)]">{t("caption.before.rest")}</span>
          </span>
          <span
            className={cn(
              "transition-opacity duration-[var(--dur-ds-slow)] [grid-area:1/1]",
              after ? "opacity-100 delay-500" : "opacity-0",
            )}
            aria-hidden={!after}
          >
            <span className="font-semibold text-white">{t("caption.after.strong")}</span>{" "}
            <span className="text-[var(--navy-300)]">{t("caption.after.rest")}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

function Face({
  kind,
  icon: Glyph,
  label,
  status,
}: {
  kind: BoardState;
  icon: Icon;
  label: string;
  status: string;
}) {
  const before = kind === "before";
  const StatusIcon = before ? WarningCircle : CheckCircle;
  return (
    <div className={cn("board-face flex items-center gap-2 [grid-area:1/1] sm:gap-2.5", `board-face-${kind}`)}>
      <span
        className={cn(
          "grid size-[clamp(26px,6.6cqw,34px)] shrink-0 place-items-center rounded-lg",
          before
            ? "bg-white/[0.06] text-[var(--navy-300)]"
            : "bg-[color-mix(in_oklab,var(--coshift-cyan)_16%,transparent)] text-[var(--coshift-cyan)]",
        )}
      >
        <Glyph weight="fill" className="size-[55%]" />
      </span>
      <span className="min-w-0">
        <span className="block text-pretty text-[clamp(11.5px,2.7cqw,14px)] font-semibold leading-tight text-white [overflow-wrap:anywhere]">
          {label}
        </span>
        <span
          className={cn(
            "mt-1 flex items-center gap-1 text-[clamp(10px,2.25cqw,12px)] font-medium leading-none",
            before ? "text-[var(--status-warn)]" : "text-[var(--status-ok)]",
          )}
        >
          <StatusIcon weight="fill" className="size-[1.05em] shrink-0" />
          <span className="truncate">{status}</span>
        </span>
      </span>
    </div>
  );
}

function Connectors({ layout }: { layout: "wide" | "narrow" }) {
  const lines = LINES[layout];
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${lines.w} 100`}
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        layout === "wide" ? "board-lines-wide" : "board-lines-narrow",
      )}
      fill="none"
      strokeWidth={0.28}
    >
      {lines.before.map((d, i) => (
        <path key={`b${i}`} d={d} className="board-line-before" />
      ))}
      {lines.after.map((d, i) => (
        <path
          key={`a${i}`}
          d={d}
          pathLength={100}
          className="board-line-after"
          style={{ ["--d" as string]: `${i * 70}ms` }}
        />
      ))}
      {lines.pulses.map((d, i) => (
        <path
          key={`p${i}`}
          d={d}
          pathLength={100}
          strokeWidth={0.6}
          className="board-pulse"
          style={{ ["--d" as string]: `${i * 520}ms` }}
        />
      ))}
    </svg>
  );
}
