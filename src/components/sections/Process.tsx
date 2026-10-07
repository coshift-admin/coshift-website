"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { ProcessCardArt } from "./ProcessCardArt";

const STEPS = ["diagnose", "design", "build", "shift"] as const;
type StepKey = (typeof STEPS)[number];

/**
 * Desktop: horizontal-scroll-on-vertical-scroll. Mobile (< md): plain vertical
 * stack — pinning + horizontal motion on a tall viewport feels wrong.
 *
 * Geometry: 4 cards × 56vw wide + 3 × 1.5rem gaps. We translate the track from
 * x=0 to x = -(trackWidth - viewportWidth - leftPadding). Using viewport units
 * means we don't need to measure on resize.
 *
 * Per-card animation: each card receives a `cardProgress` MotionValue. We split
 * the total scroll into 4 equal segments; within each segment, the matching
 * card's progress runs 0→1 (with a small overlap so animations begin slightly
 * before the card is fully centered).
 */
const CARD_VW = 56;
const GAP_REM = 1.5;
const LEFT_PAD_VW = 4;
const RIGHT_PAD_VW = 4;

export function Process() {
  const t = useTranslations("home.process");
  const rtl = useLocale() === "ar";
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const trackVw = STEPS.length * CARD_VW + (STEPS.length - 1) * GAP_REM;
  const distanceVw = trackVw + LEFT_PAD_VW + RIGHT_PAD_VW - 100;

  const x = useTransform(
    scrollYProgress,
    [0.05, 0.95],
    // RTL lays the track out from the right edge, so it slides the other way.
    [`0vw`, `${rtl ? "" : "-"}${distanceVw}vw`],
  );
  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const segment = Math.min(STEPS.length, Math.floor(p * STEPS.length) + 1);
    if (segment !== active) setActive(segment);
  });

  return (
    <>
      {/* Mobile: simple vertical stack — each card gets its animation driven by
          its own in-view scroll so the artwork still plays on phones. */}
      <section
        aria-label={t("kicker")}
        className="container-x mx-auto max-w-[1600px] section-y md:[@media(min-height:640px)]:hidden"
      >
        <SectionHeader t={t} active={1} mobile />
        <ol className="mt-12 space-y-6">
          {STEPS.map((key, i) => (
            <MobileCard
              key={key}
              variant={key}
              index={i}
              title={t(`steps.${key}.title`)}
              body={t(`steps.${key}.body`)}
            />
          ))}
        </ol>
      </section>

      {/* Desktop: pinned horizontal scroll */}
      <section
        ref={ref}
        aria-label={t("kicker")}
        className="relative hidden md:[@media(min-height:640px)]:block"
        style={{ height: "320vh" }}
      >
        <div className="sticky top-0 flex h-[100svh] w-full flex-col overflow-hidden">
          <div className="container-x mx-auto flex w-full max-w-[1600px] items-end justify-between gap-8 pt-[max(6rem,12svh)]">
            <SectionHeader t={t} active={active} />
            <div className="text-mono tabular-nums shrink-0 whitespace-nowrap pb-2 text-[var(--navy-300)]">
              {String(active).padStart(2, "0")} / 04
            </div>
          </div>

          <motion.div
            style={{ x }}
            className="flex min-h-0 flex-1 items-stretch gap-6 py-[clamp(1rem,3.5svh,2.5rem)]"
          >
            <div
              aria-hidden
              style={{ width: `${LEFT_PAD_VW}vw` }}
              className="shrink-0"
            />
            {STEPS.map((key, i) => (
              <DesktopCard
                key={key}
                variant={key}
                index={i}
                title={t(`steps.${key}.title`)}
                body={t(`steps.${key}.body`)}
                scrollYProgress={scrollYProgress}
              />
            ))}
            <div
              aria-hidden
              style={{ width: `${RIGHT_PAD_VW}vw` }}
              className="shrink-0"
            />
          </motion.div>

          <div className="container-x mx-auto w-full max-w-[1600px] pb-6">
            <div className="relative h-px w-full bg-white/10">
              <motion.div
                className="absolute start-0 top-0 h-px bg-[var(--coshift-cyan)]"
                style={{ width: railWidth }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  t,
  active: _active,
  mobile,
}: {
  t: ReturnType<typeof useTranslations>;
  active: number;
  mobile?: boolean;
}) {
  return (
    <div>
      <div className="text-mono mb-3 flex items-center gap-3 text-[var(--navy-300)]">
        <ShiftGlyph className="h-3 w-auto text-[var(--coshift-cyan)]" />
        {t("kicker")}
      </div>
      <h2
        className={`font-extrabold leading-[1.05] tracking-[-0.025em] ${mobile ? "max-w-[18ch] text-[length:var(--fs-h2)]" : "text-[clamp(2rem,min(4.2vw,7.5svh),4.25rem)]"}`}
      >
        {t("heading")}
      </h2>
    </div>
  );
}

/* ───────────── Desktop card ─────────────
   Carves a per-card sub-progress from the parent scroll. Card N's animation
   runs across the parent range [N/4 - lead, (N+1)/4 + lead], clamped to 0–1. */
function DesktopCard({
  variant,
  index,
  title,
  body,
  scrollYProgress,
}: {
  variant: StepKey;
  index: number;
  title: string;
  body: string;
  scrollYProgress: MotionValue<number>;
}) {
  const slice = 1 / STEPS.length;
  const lead = 0.04;
  const start = Math.max(0, index * slice - lead);
  const end = Math.min(1, (index + 1) * slice + lead);

  const cardProgress = useTransform(scrollYProgress, [start, end], [0, 1], {
    clamp: true,
  });

  return (
    <article
      style={{ width: `${CARD_VW}vw` }}
      className="relative flex shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--coshift-haze)] p-[clamp(1.25rem,3.5svh,2.5rem)]"
    >
      <div className="flex items-start justify-between gap-6">
        <div
          className="font-display tabular leading-[0.85] text-[var(--coshift-cyan)]"
          style={{ fontSize: "clamp(2.75rem, min(9vw, 13svh), 9.5rem)" }}
        >
          0{index + 1}
        </div>
        <ShiftGlyph className="h-[clamp(1.75rem,6svh,3.5rem)] w-auto text-[var(--coshift-cyan)]/70" />
      </div>

      {/* artwork: takes remaining space between number and title block,
          but its SVG is capped so the title is guaranteed visible */}
      <div className="my-[2svh] flex min-h-0 grow items-center text-[var(--coshift-cyan)]">
        <ProcessCardArt variant={variant} progress={cardProgress} />
      </div>

      <div className="max-w-[44ch]">
        <h3 className="text-[clamp(1.25rem,min(2.2vw,4.2svh),2.25rem)] font-bold leading-[1.15] tracking-[-0.015em]">
          {title}
        </h3>
        <p className="mt-[1.2svh] text-[clamp(0.95rem,min(1.3vw,2.6svh),1.25rem)] leading-[1.5] text-[var(--navy-100)]/80">
          {body}
        </p>
      </div>
    </article>
  );
}

/* ───────────── Mobile card ─────────────
   Plain vertical layout. The artwork's progress is driven by the card's own
   scroll position relative to the viewport so the animation still plays on
   phones — falling back to a finished state if scroll is unavailable. */
function MobileCard({
  variant,
  index,
  title,
  body,
}: {
  variant: StepKey;
  index: number;
  title: string;
  body: string;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  // Card art plays across the central 50% of its visible scroll
  const cardProgress = useTransform(scrollYProgress, [0.25, 0.75], [0, 1], {
    clamp: true,
  });

  return (
    <article
      ref={cardRef}
      className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[var(--coshift-haze)] p-8"
    >
      <div className="flex items-start justify-between">
        <div
          className="font-display leading-[0.85] text-[var(--coshift-cyan)]"
          style={{ fontSize: "5rem" }}
        >
          0{index + 1}
        </div>
        <ShiftGlyph className="h-12 w-auto text-[var(--coshift-cyan)]/70" />
      </div>
      <div className="text-[var(--coshift-cyan)]">
        <ProcessCardArt variant={variant} progress={cardProgress} />
      </div>
      <div>
        <h3 className="text-[length:var(--fs-h3)] font-semibold leading-[1.1] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-3 text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {body}
        </p>
      </div>
    </article>
  );
}
