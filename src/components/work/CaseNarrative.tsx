"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

export type Panel = { label: string; body: string; lead?: boolean };

/**
 * Case-study narrative as a pinned horizontal scroll on desktop (the brief's
 * "horizontal-scroll narrative"), and a plain vertical stack on mobile /
 * reduced-motion. Panels slide summary → problem → approach → result.
 */
const PANEL_VW = 62;
const GAP_REM = 1.5;
const LEFT_PAD_VW = 4;
const RIGHT_PAD_VW = 4;

export function CaseNarrative({ panels }: { panels: Panel[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotionPref();
  const [active, setActive] = useState(1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const trackVw = panels.length * PANEL_VW + (panels.length - 1) * GAP_REM;
  const distanceVw = trackVw + LEFT_PAD_VW + RIGHT_PAD_VW - 100;
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0vw", `-${distanceVw}vw`]);
  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const seg = Math.min(panels.length, Math.floor(p * panels.length) + 1);
    if (seg !== active) setActive(seg);
  });

  const total = String(panels.length).padStart(2, "0");

  return (
    <>
      {/* Mobile / reduced-motion: vertical stack */}
      <div
        className={
          "container-x mx-auto grid max-w-[1600px] grid-cols-1 gap-y-14 py-20 " +
          (reduced ? "" : "md:hidden")
        }
      >
        {panels.map((p, i) => (
          <PanelCard key={p.label} panel={p} index={i} total={total} stacked />
        ))}
      </div>

      {/* Desktop: pinned horizontal scroll */}
      {!reduced && (
        <section
          ref={ref}
          aria-label="Case narrative"
          className="relative hidden md:block"
          style={{ height: `${panels.length * 90}vh` }}
        >
          <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
            <motion.div
              style={{ x }}
              className="mt-auto flex h-[68vh] min-h-[460px] items-stretch gap-6 pb-10"
            >
              <div aria-hidden style={{ width: `${LEFT_PAD_VW}vw` }} className="shrink-0" />
              {panels.map((p, i) => (
                <PanelCard key={p.label} panel={p} index={i} total={total} />
              ))}
              <div aria-hidden style={{ width: `${RIGHT_PAD_VW}vw` }} className="shrink-0" />
            </motion.div>

            <div className="container-x mx-auto flex w-full max-w-[1600px] items-center gap-6 pb-8">
              <span className="text-mono tabular-nums text-[var(--coshift-bone)]/60">
                {String(active).padStart(2, "0")} / {total}
              </span>
              <div className="relative h-px flex-1 bg-white/10">
                <motion.div
                  className="absolute left-0 top-0 h-px bg-[var(--coshift-cyan)]"
                  style={{ width: railWidth }}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function PanelCard({
  panel,
  index,
  total,
  stacked,
}: {
  panel: Panel;
  index: number;
  total: string;
  stacked?: boolean;
}) {
  return (
    <article
      style={stacked ? undefined : { width: `${PANEL_VW}vw` }}
      className="relative flex shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[var(--coshift-haze)] p-8 md:p-12"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="text-mono text-[var(--coshift-cyan)]">
          {String(index + 1).padStart(2, "0")} / {total}
        </div>
        <ShiftGlyph className="h-8 w-auto text-[var(--coshift-cyan)]/60 md:h-10" />
      </div>
      <div className="mt-auto max-w-[52ch] pt-10">
        <div className="text-mono mb-4 text-[var(--coshift-bone)]/60">
          {panel.label}
        </div>
        <p
          className={
            panel.lead
              ? "text-[length:var(--fs-h3)] font-medium leading-[1.2] tracking-[-0.01em] text-[var(--coshift-bone)]"
              : "text-[length:var(--fs-lead)] leading-[1.5] text-[var(--coshift-bone)]/80"
          }
        >
          {panel.body}
        </p>
      </div>
    </article>
  );
}
