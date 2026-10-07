"use client";

import { useRef, useState } from "react";
import {
  motion,
  motionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { HandNote } from "@/components/ui/HandNote";

/**
 * The one light-palette moment. As the section scrolls through, a bone-coloured
 * "curtain" wipes in over the dark page and back out again — making the shift
 * metaphor physical (dark → light → dark). The Fraunces-italic line reveals
 * word-by-word inside it. Reduced-motion gets a static light section instead.
 */
export function ManifestoStrip() {
  const ref = useRef<HTMLElement | null>(null);
  const t = useTranslations("home.manifesto");
  const kicker = t("kicker");
  const hand = t("hand");
  const reduced = useReducedMotionPref();
  const pre = t("linePre");
  const post = t("linePost");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Curtain: collapsed at top → full → collapsed at bottom (a vertical wipe).
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.22, 0.72, 1],
    [
      "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    ],
  );
  const reveal = useTransform(scrollYProgress, [0.24, 0.6], [0, 1]);

  if (reduced) {
    return (
      <section
        data-palette="bone"
        aria-label={kicker}
        className="relative overflow-hidden py-32 md:py-48"
      >
        <Content kicker={kicker} hand={hand} pre={pre} post={post} />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label={kicker}
      className="relative isolate overflow-hidden py-32 md:py-48"
    >
      {/* animated bone curtain */}
      <motion.div
        aria-hidden
        data-palette="bone"
        style={{ clipPath }}
        className="absolute inset-0 bg-[var(--coshift-bone)]"
      />
      <Content kicker={kicker} hand={hand} pre={pre} post={post} reveal={reveal} />
    </section>
  );
}

function Content({
  kicker,
  hand,
  pre,
  post,
  reveal,
}: {
  kicker: string;
  hand: string;
  pre: string;
  post: string;
  reveal?: MotionValue<number>;
}) {
  return (
    <div className="container-x relative z-10 mx-auto max-w-[1600px]">
      <div className="text-mono mb-12 flex items-center gap-3 text-[var(--coshift-ink)]/50">
        <ShiftGlyph className="h-3 w-auto text-[var(--coshift-cyan)]" />
        {kicker}
      </div>
      <h2
        aria-label={`${pre} ${post}`}
        className="font-display text-[clamp(2.75rem,9vw,9rem)] leading-[0.95] tracking-[-0.025em] text-[var(--coshift-ink)]"
      >
        {reveal ? (
          <>
            <Line text={pre} progress={reveal} from={0} to={0.5} />
            <span className="block h-2 md:h-6" />
            <Line text={post} progress={reveal} from={0.5} to={1} />
          </>
        ) : (
          <>
            <span className="block">{pre}</span>
            <span className="block h-2 md:h-6" />
            <span className="block">{post}</span>
          </>
        )}
      </h2>
      {/* handwritten aside pointing back at "we run them" — deep coral on the light curtain */}
      <ManifestoHand text={hand} reveal={reveal} />
    </div>
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
        if (w.trim() === "") return <span key={i}> </span>;
        return (
          <span key={i} className="inline-block overflow-hidden align-baseline">
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
    <motion.span style={{ y, display: "inline-block" }}>{word}</motion.span>
  );
}

/** The aside waits until "we run them" has fully revealed before it writes itself. */
function ManifestoHand({ text, reveal }: { text: string; reveal?: MotionValue<number> }) {
  const [done, setDone] = useState(false);
  useMotionValueEvent(reveal ?? FALLBACK_REVEAL, "change", (v) => {
    if (v > 0.97) setDone(true);
  });
  return (
    <HandNote
      arrow="up-start"
      play={reveal ? done : undefined}
      className="ms-[8%] mt-4 [--hand:var(--warm-700)] md:ms-[22%]"
    >
      {text}
    </HandNote>
  );
}

const FALLBACK_REVEAL = motionValue(1);
