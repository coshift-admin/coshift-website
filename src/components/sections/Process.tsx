"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

const STEPS = ["diagnose", "design", "build", "shift"] as const;

/**
 * Desktop: horizontal-scroll-on-vertical-scroll. Mobile (< md): plain vertical
 * stack — pinning + horizontal motion on a tall viewport feels wrong.
 *
 * Geometry: 4 cards × 56vw wide + 3 × 1.5rem gaps. We translate the track from
 * x=0 to x = -(trackWidth - viewportWidth - leftPadding). Using viewport units
 * means we don't need to measure on resize.
 */
const CARD_VW = 56; // card width on desktop, in vw
const GAP_REM = 1.5; // tailwind gap-6 = 1.5rem
const LEFT_PAD_VW = 4; // leading padding so the first card doesn't kiss the edge
const RIGHT_PAD_VW = 4; // and the last card has room

export function Process() {
  const t = useTranslations("home.process");
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Total track width in vw = 4 * 56 + 3 * gap-as-vw + left+right pad
  // We treat the small rem gap as ~1.5vw worth (close enough at 1440px).
  // Actual translation: from 0vw to -(trackWidth - 100vw)vw.
  const trackVw = STEPS.length * CARD_VW + (STEPS.length - 1) * GAP_REM * 1; // gap in rem -> kept literal in markup
  const distanceVw = trackVw + LEFT_PAD_VW + RIGHT_PAD_VW - 100;

  // Lead-in: don't start sliding until the section is fully pinned. End-out: stop
  // a bit before the very end so the last card sits comfortably.
  const x = useTransform(
    scrollYProgress,
    [0.05, 0.95],
    [`0vw`, `-${distanceVw}vw`],
  );
  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Active-step indicator updates as the user scrolls through.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const segment = Math.min(STEPS.length, Math.floor(p * STEPS.length) + 1);
    if (segment !== active) setActive(segment);
  });

  return (
    <>
      {/* Mobile: simple vertical stack */}
      <section
        aria-label="Process"
        className="md:hidden container-x mx-auto max-w-[1600px] section-y"
      >
        <SectionHeader t={t} active={1} mobile />
        <ol className="mt-12 space-y-6">
          {STEPS.map((key, i) => (
            <ProcessCard
              key={key}
              index={i}
              title={t(`steps.${key}.title`)}
              body={t(`steps.${key}.body`)}
              mobile
            />
          ))}
        </ol>
      </section>

      {/* Desktop: pinned horizontal scroll */}
      <section
        ref={ref}
        aria-label="Process"
        className="relative hidden md:block"
        style={{ height: "320vh" }}
      >
        <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
          <div className="container-x mx-auto flex w-full max-w-[1600px] items-center justify-between pt-28 md:pt-32">
            <SectionHeader t={t} active={active} />
            <div className="text-mono tabular-nums hidden text-[var(--coshift-bone)]/60 md:block">
              {String(active).padStart(2, "0")} / 04
            </div>
          </div>

          <motion.div
            style={{ x }}
            className="mt-auto flex h-[62vh] items-stretch gap-6 pb-16"
          >
            {/* left lead-in spacer */}
            <div aria-hidden style={{ width: `${LEFT_PAD_VW}vw` }} className="shrink-0" />
            {STEPS.map((key, i) => (
              <ProcessCard
                key={key}
                index={i}
                title={t(`steps.${key}.title`)}
                body={t(`steps.${key}.body`)}
              />
            ))}
            <div aria-hidden style={{ width: `${RIGHT_PAD_VW}vw` }} className="shrink-0" />
          </motion.div>

          {/* progress rail */}
          <div className="container-x mx-auto w-full max-w-[1600px] pb-6">
            <div className="relative h-px w-full bg-white/10">
              <motion.div
                className="absolute left-0 top-0 h-px bg-[var(--coshift-cyan)]"
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
      <div className="text-mono mb-3 flex items-center gap-3 text-[var(--coshift-bone)]/60">
        <ShiftGlyph className="h-3 w-auto text-[var(--coshift-cyan)]" />
        {t("kicker")}
      </div>
      <h2 className={`text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em] ${mobile ? "max-w-[18ch]" : ""}`}>
        {t("heading")}
      </h2>
    </div>
  );
}

function ProcessCard({
  index,
  title,
  body,
  mobile,
}: {
  index: number;
  title: string;
  body: string;
  mobile?: boolean;
}) {
  const desktopWidth = `${CARD_VW}vw`;
  return (
    <article
      style={mobile ? undefined : { width: desktopWidth }}
      className="relative flex shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[var(--coshift-haze)] p-10 md:p-14"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="font-display leading-[0.85] text-[var(--coshift-cyan)]" style={{ fontSize: mobile ? "5.5rem" : "clamp(7rem,12vw,14rem)" }}>
          0{index + 1}
        </div>
        <ShiftGlyph className="h-12 w-auto text-[var(--coshift-cyan)]/70 md:h-20" />
      </div>
      <div className={`mt-12 max-w-[44ch] ${mobile ? "" : "md:mt-auto"}`}>
        <h3 className="text-[length:var(--fs-h3)] font-semibold leading-[1.1] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-4 text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {body}
        </p>
      </div>
    </article>
  );
}
