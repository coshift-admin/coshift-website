"use client";

import { useTranslations } from "next-intl";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";

type ProofItem = { title: string; body: string };

/**
 * "We run what we build." — the Tier-1 differentiators from the brand brief
 * (§5): own infrastructure, instant working demo, bespoke modules, self-hosted
 * AI. Honesty notes are baked into the copy (messages/*.json), not the layout.
 */
export function ProofPoints() {
  const t = useTranslations("home.proof");
  const items = t.raw("items") as ProofItem[];

  return (
    <section
      aria-label="Why Coshift"
      className="container-x mx-auto max-w-[1600px] section-y"
    >
      <header className="mb-12 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <div className="text-mono mb-4 flex items-center gap-3 text-[var(--coshift-bone)]/60">
            <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
            {t("kicker")}
          </div>
          <h2 className="max-w-[16ch] text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em]">
            <RevealWords text={t("heading")} />
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-[42ch] text-base text-[var(--coshift-bone)]/70">
            {t("intro")}
          </p>
        </Reveal>
      </header>

      <StaggerList
        as="div"
        className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2"
        staggerChildren={0.1}
      >
        {items.map((item, i) => (
          <div
            key={item.title}
            className="group relative bg-[var(--coshift-haze)] p-8 transition-colors md:p-12"
          >
            <div className="flex items-center justify-between">
              <span className="text-mono text-[var(--coshift-bone)]/50">
                0{i + 1}
              </span>
              <ShiftGlyph className="h-5 w-auto text-[var(--coshift-cyan)]/60 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1" />
            </div>
            <h3 className="mt-6 text-[length:var(--fs-h3)] font-semibold leading-[1.15] tracking-[-0.01em] text-[var(--coshift-bone)]">
              {item.title}
            </h3>
            <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-[var(--coshift-bone)]/70">
              {item.body}
            </p>
          </div>
        ))}
      </StaggerList>
    </section>
  );
}
