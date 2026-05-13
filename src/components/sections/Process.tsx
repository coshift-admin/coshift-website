"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

const STEPS = ["diagnose", "design", "build", "shift"] as const;

/**
 * Horizontal-scroll-on-vertical-scroll. The outer wrapper is `100vh * 4`
 * tall and pins on the inner track; the track translates X based on
 * scroll progress.
 */
export function Process() {
  const t = useTranslations("home.process");
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section
      ref={ref}
      aria-label="Process"
      className="relative h-[400vh] w-full"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <div className="container-x mx-auto flex w-full max-w-[1600px] items-center justify-between pt-28 md:pt-32">
          <div>
            <div className="text-mono mb-3 flex items-center gap-3 text-[var(--coshift-bone)]/60">
              <ShiftGlyph className="h-3 w-auto text-[var(--coshift-cyan)]" />
              {t("kicker")}
            </div>
            <h2 className="text-[var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em]">
              {t("heading")}
            </h2>
          </div>
          <div className="text-mono hidden text-[var(--coshift-bone)]/60 md:block">
            01 / 04
          </div>
        </div>

        <motion.div
          style={{ x }}
          className="mt-auto flex h-[60vh] items-stretch gap-6 px-[var(--gutter)] pb-16"
        >
          {STEPS.map((key, i) => (
            <ProcessCard
              key={key}
              index={i}
              title={t(`steps.${key}.title`)}
              body={t(`steps.${key}.body`)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProcessCard({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <article className="relative flex h-full w-[78vw] shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-[var(--coshift-haze)] p-10 md:w-[60vw] md:p-16">
      <div className="flex items-start justify-between">
        <div className="font-display text-[clamp(6rem,18vw,16rem)] leading-[0.85] text-[var(--coshift-cyan)]">
          0{index + 1}
        </div>
        <ShiftGlyph className="h-12 w-auto text-[var(--coshift-cyan)]/70 md:h-20" />
      </div>
      <div className="max-w-[40ch]">
        <h3 className="text-[var(--fs-h3)] font-semibold leading-[1.1] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-4 text-base text-[var(--coshift-bone)]/70">{body}</p>
      </div>
    </article>
  );
}
