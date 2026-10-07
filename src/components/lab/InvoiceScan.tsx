"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Scan } from "@phosphor-icons/react/dist/ssr";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Lab — "Une facture lue en un instant".
 *
 * A paper supplier invoice on the left, an empty ERP form on the right. Press
 * "read": a scan beam sweeps down the paper, each value it reads gets a cyan
 * box, then a copy of it flies across into its form field. The form ends as a
 * *draft to check* — the point of the demo: the AI reads, a person validates.
 * Mirrors the invoice-reading Coshift has delivered (all data here is made up).
 *
 * Plays once by itself when it comes into view, then the visitor drives it.
 * Reduced motion: the fields fill at once, no beam and no flight.
 */

type Field = "supplier" | "number" | "date" | "total";
const FIELDS: Field[] = ["supplier", "number", "date", "total"];
type Phase = "idle" | "reading" | "draft";
type Flight = { key: Field; text: string; from: { x: number; y: number }; to: { x: number; y: number } };

const BEAM_MS = 1200;
const FLIGHT_S = 0.6;
const EASE = [0.2, 0, 0.1, 1] as const;

/** Fictional invoice: fixed number, date and lines (qty × unit price, DZD). */
const INVOICE_NO = "FA-2026-0318";
const INVOICE_DATE = new Date(2026, 2, 18);
const LINES = [
  { qty: 12, price: 1850 },
  { qty: 4, price: 3200 },
  { qty: 2, price: 6750 },
] as const;
const VAT = 0.19;

/** Algerian conventions: Latin digits in Arabic (ar-DZ), DA in French. */
const intlLocale = (locale: string) => (locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-GB");

const NONE: Record<Field, boolean> = { supplier: false, number: false, date: false, total: false };
const ALL: Record<Field, boolean> = { supplier: true, number: true, date: true, total: true };

export function InvoiceScan() {
  const t = useTranslations("lab.items.invoice");
  const locale = useLocale();
  const reduced = useReducedMotionPref();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const paperVals = useRef<Record<Field, HTMLElement | null>>({ supplier: null, number: null, date: null, total: null });
  const fieldVals = useRef<Record<Field, HTMLElement | null>>({ supplier: null, number: null, date: null, total: null });
  const timers = useRef<number[]>([]);
  const autoplayed = useRef(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [found, setFound] = useState<Record<Field, boolean>>(NONE);
  const [filled, setFilled] = useState<Record<Field, boolean>>(NONE);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [beamKey, setBeamKey] = useState(0);

  const inView = useInView(rootRef, { once: true, amount: 0.4 });

  // ── the invoice's figures, formatted the Algerian way for this locale
  const { values, lineAmounts, vatText } = useMemo(() => {
    const tag = intlLocale(locale);
    const num = new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const cur = new Intl.NumberFormat(tag, { style: "currency", currency: "DZD", minimumFractionDigits: 2 });
    const ht = LINES.reduce((sum, l) => sum + l.qty * l.price, 0);
    const vat = Math.round(ht * VAT);
    return {
      values: {
        supplier: t("paper.supplier"),
        number: INVOICE_NO,
        date: new Intl.DateTimeFormat(tag, { day: "2-digit", month: "short", year: "numeric" }).format(INVOICE_DATE),
        total: cur.format(ht + vat),
      } satisfies Record<Field, string>,
      lineAmounts: LINES.map((l) => num.format(l.qty * l.price)),
      vatText: num.format(vat),
    };
  }, [locale, t]);

  // timers are pushed into one array that is never reassigned, so unmount can clear them all
  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.length = 0;
  }, []);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);

  /** A copy of the value leaves its box on the paper and lands in the form field. */
  const launch = useCallback(
    (key: Field) => {
      const root = rootRef.current;
      const from = paperVals.current[key];
      const to = fieldVals.current[key];
      if (!root || !from || !to) {
        setFilled((f) => ({ ...f, [key]: true }));
        return;
      }
      const rr = root.getBoundingClientRect();
      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();
      const rtl = getComputedStyle(root).direction === "rtl";
      const chipW = fr.width + 16;
      const chipH = 22;
      setFlights((list) => [
        ...list,
        {
          key,
          text: values[key],
          from: { x: fr.left - rr.left - 8, y: fr.top - rr.top + (fr.height - chipH) / 2 },
          to: {
            x: rtl ? tr.right - rr.left - 8 - chipW : tr.left - rr.left + 4,
            y: tr.top - rr.top + (tr.height - chipH) / 2,
          },
        },
      ]);
    },
    [values],
  );

  const land = useCallback((key: Field) => {
    setFlights((list) => list.filter((f) => f.key !== key));
    setFilled((f) => ({ ...f, [key]: true }));
  }, []);

  const scan = useCallback(() => {
    clearTimers();
    setFlights([]);
    if (reduced) {
      setFound(ALL);
      setFilled(ALL);
      setPhase("draft");
      return;
    }
    setFound(NONE);
    setFilled(NONE);
    setPhase("reading");
    setBeamKey((k) => k + 1);

    const paper = paperRef.current;
    if (!paper) return;
    const pr = paper.getBoundingClientRect();
    FIELDS.forEach((key) => {
      const el = paperVals.current[key];
      const r = el?.getBoundingClientRect();
      // the beam reaches a value at the same fraction of its sweep as the value's height on the paper
      const share = r ? Math.min(1, Math.max(0, (r.top + r.height / 2 - pr.top) / pr.height)) : 1;
      const at = share * BEAM_MS;
      later(at, () => setFound((f) => ({ ...f, [key]: true })));
      later(at + 180, () => launch(key));
      // backstop: land even if the flight's onAnimationComplete never fires (throttled frames)
      later(at + 180 + FLIGHT_S * 1000 + 80, () => land(key));
    });
  }, [clearTimers, later, launch, land, reduced]);

  const reset = useCallback(() => {
    clearTimers();
    setFlights([]);
    setFound(NONE);
    setFilled(NONE);
    setPhase("idle");
  }, [clearTimers]);

  // all four fields landed → the draft waits for a human
  useEffect(() => {
    if (phase === "reading" && FIELDS.every((k) => filled[k])) setPhase("draft");
  }, [filled, phase]);

  // autoplay once, the first time the demo is on screen
  useEffect(() => {
    if (!inView || autoplayed.current) return;
    autoplayed.current = true;
    later(reduced ? 0 : 600, scan);
  }, [inView, later, reduced, scan]);

  const status = t(`status.${phase}`);

  return (
    <div
      ref={rootRef}
      className="relative grid gap-4 p-4 sm:h-[clamp(400px,40vw,480px)] sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] sm:items-center sm:gap-5 sm:p-6"
    >
      {/* ───────── the paper invoice ───────── */}
      <div className="flex justify-center sm:block">
        <div
          ref={paperRef}
          className="relative w-full max-w-[320px] -rotate-[1.2deg] rounded-[6px] bg-[#fbfaf7] p-3.5 text-[#1d1a2e] shadow-[0_22px_44px_-14px_rgba(0,0,0,0.6)] rtl:rotate-[1.2deg] sm:max-w-none sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6b6585]">{t("paper.from")}</p>
              <Value refCb={(el) => { paperVals.current.supplier = el; }} found={found.supplier} className="mt-0.5 text-[12px] font-bold leading-tight">
                {values.supplier}
              </Value>
              <p className="mt-0.5 text-[9.5px] leading-snug text-[#6b6585]">{t("paper.address")}</p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-[12.5px] font-extrabold tracking-[0.08em]">{t("paper.heading")}</p>
              <Value refCb={(el) => { paperVals.current.number = el; }} found={found.number} className="tabular mt-0.5 text-[10.5px] font-semibold" ltr>
                {values.number}
              </Value>
              <p className="mt-1 text-[9.5px] text-[#6b6585]">
                {t("paper.dateLabel")}{" "}
                <Value refCb={(el) => { paperVals.current.date = el; }} found={found.date} className="tabular font-semibold text-[#1d1a2e]">
                  {values.date}
                </Value>
              </p>
            </div>
          </div>

          <table className="mt-3 w-full border-collapse text-[10px] sm:text-[10.5px]">
            <thead>
              <tr className="border-b border-[#1d1a2e]/15 text-[9px] uppercase tracking-[0.08em] text-[#6b6585]">
                <th className="pb-1 text-start font-semibold">{t("paper.item")}</th>
                <th className="pb-1 text-center font-semibold">{t("paper.qty")}</th>
                <th className="pb-1 text-end font-semibold">{t("paper.amount")}</th>
              </tr>
            </thead>
            <tbody>
              {(t.raw("paper.items") as string[]).map((name, i) => (
                <tr key={name} className="border-b border-dashed border-[#1d1a2e]/10">
                  <td className="py-1 pe-2">{name}</td>
                  <td className="tabular py-1 text-center">{LINES[i]?.qty}</td>
                  <td className="tabular py-1 text-end">{lineAmounts[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-2 space-y-0.5 text-[10px] sm:text-[10.5px]">
            <div className="flex justify-between gap-3 text-[#6b6585]">
              <span>{t("paper.vat")}</span>
              <span className="tabular">{vatText}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#1d1a2e]/20 pt-1 font-bold">
              <span>{t("paper.total")}</span>
              <Value refCb={(el) => { paperVals.current.total = el; }} found={found.total} className="tabular text-[11.5px]">
                {values.total}
              </Value>
            </div>
          </div>

          {/* scan beam: a cyan line with a soft trail, sweeping top → bottom */}
          {phase === "reading" && !reduced && (
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]">
              <motion.div
                key={beamKey}
                className="absolute inset-x-0 h-0"
                initial={{ top: "0%", opacity: 0 }}
                animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: BEAM_MS / 1000, ease: "linear", opacity: { duration: BEAM_MS / 1000, times: [0, 0.08, 0.9, 1] } }}
              >
                <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-[rgba(51,197,243,0.32)] to-transparent" />
                <div className="absolute -top-px h-[2px] w-full bg-[var(--coshift-cyan)] shadow-[0_0_12px_3px_rgba(51,197,243,0.65)]" />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* ───────── the ERP form ───────── */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4">
          <p className="text-mono flex items-center gap-2 text-[0.62rem] text-[var(--cyan-300)]">
            <Scan weight="fill" aria-hidden className="size-3.5" />
            {t("form.title")}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-1">
            {FIELDS.map((key) => (
              <FormField
                key={key}
                label={t(`form.${key}`)}
                value={values[key]}
                filled={filled[key]}
                ltr={key === "number"}
                refCb={(el) => {
                  fieldVals.current[key] = el;
                }}
              />
            ))}
          </dl>
          <StatusPill phase={phase} label={status} />
        </div>

        <div className="flex flex-wrap gap-2">
          {phase === "draft" ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.06]"
            >
              {t("reset")}
            </button>
          ) : (
            <button
              type="button"
              onClick={scan}
              disabled={phase === "reading"}
              className="rounded-lg bg-[var(--coshift-cyan)] px-4 py-2.5 text-sm font-bold text-[#170f3c] transition-opacity duration-[var(--dur-ds-fast)] disabled:opacity-50"
            >
              {t("scan")}
            </button>
          )}
        </div>
      </div>

      {/* copies in flight, positioned in the root's own (physical) coordinates */}
      {flights.map((f) => (
        <motion.span
          key={`${f.key}-${beamKey}`}
          aria-hidden
          dir={f.key === "number" ? "ltr" : undefined}
          className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-md bg-[var(--coshift-cyan)] px-2 py-0.5 text-[12px] font-semibold leading-[18px] text-[#170f3c] shadow-[0_8px_24px_-6px_rgba(51,197,243,0.7)]"
          initial={{ x: f.from.x, y: f.from.y, opacity: 0, scale: 0.92 }}
          animate={{ x: f.to.x, y: f.to.y, opacity: 1, scale: 1 }}
          transition={{ duration: FLIGHT_S, ease: EASE, opacity: { duration: 0.15 } }}
          onAnimationComplete={() => land(f.key)}
        >
          {f.text}
        </motion.span>
      ))}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

/** A value on the paper; boxed in cyan once the beam has read it. */
function Value({
  children,
  found,
  className,
  ltr,
  refCb,
}: {
  children: ReactNode;
  found: boolean;
  className?: string;
  ltr?: boolean;
  refCb: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <span
      ref={refCb}
      dir={ltr ? "ltr" : undefined}
      className={cn(
        "inline-block rounded-[3px] px-1 -mx-1 transition-[background-color,box-shadow] duration-300",
        found && "bg-[rgba(51,197,243,0.16)] shadow-[0_0_0_1.5px_var(--coshift-cyan)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

function FormField({
  label,
  value,
  filled,
  ltr,
  refCb,
}: {
  label: string;
  value: string;
  filled: boolean;
  ltr?: boolean;
  refCb: (el: HTMLElement | null) => void;
}) {
  return (
    <div>
      <dt className="text-[11px] text-[var(--navy-300)]">{label}</dt>
      <dd
        ref={refCb}
        className={cn(
          "mt-1 flex h-8 items-center rounded-md border px-2.5 text-[13px] transition-[border-color,background-color] duration-500",
          filled
            ? "border-[color-mix(in_oklab,var(--coshift-cyan)_55%,transparent)] bg-[color-mix(in_oklab,var(--coshift-cyan)_8%,transparent)] text-white"
            : "border-white/10 bg-white/[0.02]",
        )}
      >
        {filled && (
          <motion.span
            dir={ltr ? "ltr" : undefined}
            className="tabular truncate font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {value}
          </motion.span>
        )}
      </dd>
    </div>
  );
}

function StatusPill({ phase, label }: { phase: Phase; label: string }) {
  return (
    <p
      className={cn(
        "mt-3.5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        phase === "idle" && "bg-white/[0.05] text-[var(--navy-300)]",
        phase === "reading" && "bg-[color-mix(in_oklab,var(--coshift-cyan)_12%,transparent)] text-[var(--cyan-300)]",
        phase === "draft" && "bg-[color-mix(in_oklab,var(--status-warn)_14%,transparent)] text-[var(--status-warn)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full bg-current",
          phase === "reading" && "animate-pulse",
        )}
      />
      {label}
    </p>
  );
}
