"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

// <EditMe> — user fills these in. Placeholders are intentionally round numbers
// so the section looks intentional rather than empty.
const ITEMS = [
  { key: "years", value: 7, suffix: "" },
  { key: "implementations", value: 24, suffix: "" },
  { key: "websites", value: 38, suffix: "" },
  { key: "hours", value: 120, suffix: "k+" },
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
      <div className="text-mono mb-12 flex items-center gap-3 text-[var(--coshift-bone)]/60">
        <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
        {t("kicker")}
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <div
            key={item.key}
            className="relative flex flex-col gap-3 border-t border-white/10 pt-6"
          >
            <div className="text-mono text-[var(--coshift-bone)]/50">
              0{i + 1}
            </div>
            <Counter value={item.value} suffix={item.suffix} run={inView} />
            <div className="text-base text-[var(--coshift-bone)]/70">
              {t(`items.${item.key}`)}{" "}
              <span className="ml-1 inline-block align-middle">
                <ShiftGlyph className="inline-block h-3 w-auto text-[var(--coshift-cyan)]/60" />
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-mono mt-12 text-[var(--coshift-bone)]/40">
        {/* TODO: replace with real figures */}
        Figures are pre-fill placeholders — confirmed numbers go in
        <code className="mx-1 text-[var(--coshift-cyan)]">
          src/components/sections/Numbers.tsx
        </code>
      </p>
    </section>
  );
}

function Counter({
  value,
  suffix,
  run,
}: {
  value: number;
  suffix: string;
  run: boolean;
}) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const rounded = useTransform(spring, (latest) => Math.floor(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (run) mv.set(value);
  }, [run, value, mv]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  return (
    <motion.div className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-[var(--coshift-bone)]">
      {display}
      <span className="text-[var(--coshift-cyan)]">{suffix}</span>
    </motion.div>
  );
}
