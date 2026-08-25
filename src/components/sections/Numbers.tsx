"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";

// Figures are drawn ONLY from the brand brief (§3–§5) — every one is
// founder-cleared and defensible. Do NOT add invented counts (years in
// business, hours saved, revenue) unless the founder supplies them in writing.
// <EditMe> — update these as new work closes; keep each one truthful.
const ITEMS = [
  { key: "clients", value: 14, suffix: "" },
  { key: "domains", value: 10, suffix: "" },
  { key: "sectors", value: 12, suffix: "" },
  { key: "languages", value: 3, suffix: "" },
] as const;

export function Numbers() {
  const t = useTranslations("home.numbers");
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      aria-label="Numbers"
      className="container-x mx-auto max-w-[1600px] section-y"
    >
      <Reveal>
        <div className="text-mono mb-12 flex items-center gap-3 text-[var(--coshift-bone)]/60">
          <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
          <RevealWords text={t("kicker")} />
        </div>
      </Reveal>
      <StaggerList as="div" className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4" staggerChildren={0.12}>
        {ITEMS.map((item, i) => (
          <div
            key={item.key}
            className="relative flex flex-col gap-3 border-t border-white/10 pt-6"
          >
            <div className="text-mono text-[var(--coshift-bone)]/50">
              0{i + 1}
            </div>
            <DigitRoll value={item.value} suffix={item.suffix} run={inView} />
            <div className="text-base text-[var(--coshift-bone)]/70">
              {t(`items.${item.key}`)}{" "}
              <span className="ml-1 inline-block align-middle">
                <ShiftGlyph className="inline-block h-3 w-auto text-[var(--coshift-cyan)]/60" />
              </span>
            </div>
          </div>
        ))}
      </StaggerList>
      <p className="text-mono mt-12 max-w-2xl text-[var(--coshift-bone)]/40">
        {t("note")}
      </p>
    </section>
  );
}

/* Slot-machine digit roll: each digit is a 0–9 reel that spins up to its target
   on viewport entry, staggered left→right. Reduced-motion shows the final value. */
function DigitRoll({
  value,
  suffix,
  run,
}: {
  value: number;
  suffix: string;
  run: boolean;
}) {
  const reduced = useReducedMotionPref();
  const digits = String(value).split("");

  return (
    <div className="font-display flex text-[clamp(3rem,8vw,7rem)] leading-none text-[var(--coshift-bone)]">
      {digits.map((d, i) => (
        <Reel key={i} digit={Number(d)} index={i} run={run} reduced={reduced} />
      ))}
      <span className="text-[var(--coshift-cyan)]">{suffix}</span>
    </div>
  );
}

function Reel({
  digit,
  index,
  run,
  reduced,
}: {
  digit: number;
  index: number;
  run: boolean;
  reduced: boolean;
}) {
  if (reduced) {
    return <span aria-hidden>{digit}</span>;
  }
  return (
    <span
      aria-hidden
      className="relative inline-block overflow-hidden"
      style={{ height: "1em", width: "0.62em" }}
    >
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        initial={{ y: "0em" }}
        animate={run ? { y: `-${digit}em` } : { y: "0em" }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.12 * index,
        }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex h-[1em] items-start justify-center">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
