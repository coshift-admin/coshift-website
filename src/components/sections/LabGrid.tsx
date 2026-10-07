"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * The Lab: six small, playable experiments. Each one acts out — in a few
 * seconds — a problem Coshift solves, and links to the matching offer. They
 * load on the client only (canvas, pointer physics), each sets its own stage
 * height, and each pauses its animation loop while off-screen (useVisible).
 * Copy lives in messages/{locale}/lab/<key>.json (merged as `lab.items`).
 */
const WIDE = "h-[clamp(380px,46vw,560px)]";
const NORMAL = "h-[clamp(400px,40vw,480px)]";

const ShiftParticles = dynamic(
  () => import("@/components/lab/ShiftParticles").then((m) => m.ShiftParticles),
  { ssr: false, loading: () => <div aria-hidden className={WIDE} /> },
);
const OrderRipple = dynamic(
  () => import("@/components/lab/OrderRipple").then((m) => m.OrderRipple),
  { ssr: false, loading: () => <div aria-hidden className={NORMAL} /> },
);
const InvoiceScan = dynamic(
  () => import("@/components/lab/InvoiceScan").then((m) => m.InvoiceScan),
  { ssr: false, loading: () => <div aria-hidden className={NORMAL} /> },
);
const ForecastSketch = dynamic(
  () => import("@/components/lab/ForecastSketch").then((m) => m.ForecastSketch),
  { ssr: false, loading: () => <div aria-hidden className={NORMAL} /> },
);
const InboxTest = dynamic(
  () => import("@/components/lab/InboxTest").then((m) => m.InboxTest),
  { ssr: false, loading: () => <div aria-hidden className={NORMAL} /> },
);
const RtlFlip = dynamic(
  () => import("@/components/lab/RtlFlip").then((m) => m.RtlFlip),
  { ssr: false, loading: () => <div aria-hidden className={WIDE} /> },
);

type Experiment = {
  key: "shift" | "order" | "invoice" | "forecast" | "inbox" | "rtl";
  Demo: ComponentType;
  /** The offer this experiment acts out. */
  href?: string;
  wide?: boolean;
};

const EXPERIMENTS: Experiment[] = [
  { key: "shift", Demo: ShiftParticles, wide: true },
  { key: "order", Demo: OrderRipple, href: "/solutions/erp" },
  { key: "invoice", Demo: InvoiceScan, href: "/solutions/automation" },
  { key: "forecast", Demo: ForecastSketch, href: "/solutions/automation" },
  { key: "inbox", Demo: InboxTest, href: "/solutions/email" },
  { key: "rtl", Demo: RtlFlip, href: "/solutions/web", wide: true },
];

export function LabGrid() {
  const t = useTranslations("lab.items");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {EXPERIMENTS.map(({ key, Demo, href, wide }, i) => (
        // No transform on the card: some demos fly elements with fixed positioning.
        <article
          key={key}
          aria-labelledby={`lab-${key}`}
          className={cn(
            "flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--coshift-haze)]",
            wide && "lg:col-span-2",
          )}
        >
          <div className="relative overflow-hidden bg-[var(--coshift-ink)]">
            <Demo />
          </div>
          <div className="flex flex-1 flex-col gap-5 border-t border-white/[0.07] p-6 sm:flex-row sm:items-end sm:justify-between md:p-7">
            <div>
              <p className="text-mono tabular text-[var(--cyan-300)]">{String(i + 1).padStart(2, "0")}</p>
              <h2
                id={`lab-${key}`}
                className="mt-2 text-balance text-xl font-bold tracking-[-0.01em] text-white md:text-2xl"
              >
                {t(`${key}.title`)}
              </h2>
              <p className="mt-2 max-w-[56ch] text-pretty leading-[1.6] text-[var(--navy-100)]/80">
                {t(`${key}.desc`)}
              </p>
            </div>
            {href && (
              <Link
                href={href}
                className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-[var(--coshift-cyan)] transition-colors duration-[var(--dur-ds-fast)] hover:text-[var(--cyan-300)]"
              >
                {t(`${key}.link`)}
                <span aria-hidden className="arrow-fwd">
                  →
                </span>
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
