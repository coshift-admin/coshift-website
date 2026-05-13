"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

/**
 * The single light-palette section. A Fraunces-italic sentence reveals one
 * letter at a time as the section enters the viewport, then the palette
 * snaps back to dark on exit via a clip-path reveal of the next section.
 */
export function ManifestoStrip() {
  const ref = useRef<HTMLElement | null>(null);
  const t = useTranslations("home.manifesto");
  const pre = t("linePre");
  const post = t("linePost");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Drive the kinetic reveal — 0 to 1 across the central scroll range.
  const reveal = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);

  return (
    <section
      ref={ref}
      data-palette="bone"
      aria-label="Manifesto"
      className="relative isolate overflow-hidden py-32 md:py-48"
    >
      <div className="container-x mx-auto max-w-[1600px]">
        <div className="text-mono mb-12 flex items-center gap-3 text-[var(--coshift-ink)]/50">
          <ShiftGlyph className="h-3 w-auto text-[var(--coshift-cyan)]" />
          MANIFESTO
        </div>
        <h2
          aria-label={`${pre} ${post}`}
          className="font-display text-[clamp(2.75rem,9vw,9rem)] leading-[0.95] tracking-[-0.025em] text-[var(--coshift-ink)]"
        >
          <Line text={pre} progress={reveal} from={0} to={0.5} />
          <span className="block h-2 md:h-6" />
          <Line text={post} progress={reveal} from={0.5} to={1} />
        </h2>
      </div>
    </section>
  );
}

function Line({
  text,
  progress,
  from,
  to,
}: {
  text: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
}) {
  const words = text.split(/(\s+)/);
  return (
    <span className="block">
      {words.map((w, i) => {
        if (w.trim() === "")
          return <span key={i}> </span>;
        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-baseline"
          >
            <Word word={w} progress={progress} index={i} total={words.length} from={from} to={to} />
          </span>
        );
      })}
    </span>
  );
}

function Word({
  word,
  progress,
  index,
  total,
  from,
  to,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
  from: number;
  to: number;
}) {
  const start = from + ((to - from) * index) / Math.max(total, 1);
  const end = Math.min(to, start + (to - from) * 0.25);
  const y = useTransform(progress, [start, end], ["110%", "0%"]);
  return (
    <motion.span style={{ y, display: "inline-block" }}>
      {word}
    </motion.span>
  );
}
