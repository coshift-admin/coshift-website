"use client";

import { useTranslations } from "next-intl";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";

/**
 * Sector-coverage band. Breadth is itself a marketing asset (brand brief §4.3):
 * the same principle held across construction, pharma, cosmetics and more.
 */
export function Sectors() {
  const t = useTranslations("home.sectors");
  const items = t.raw("items") as string[];

  return (
    <section
      aria-label="Sectors"
      className="container-x mx-auto max-w-[1600px] section-y"
    >
      <Reveal>
        <div className="text-mono mb-6 flex items-center gap-3 text-[var(--coshift-bone)]/60">
          <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
          {t("kicker")}
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="max-w-[28ch] text-[length:var(--fs-h3)] font-medium leading-[1.25] tracking-[-0.01em] text-[var(--coshift-bone)]/90">
          <RevealWords text={t("heading")} />
        </h2>
      </Reveal>

      <StaggerList
        as="ul"
        className="mt-12 flex flex-wrap gap-3"
        staggerChildren={0.05}
      >
        {items.map((s) => (
          <li
            key={s}
            className="rounded-full border border-white/12 px-4 py-2 text-sm text-[var(--coshift-bone)]/70 transition-colors hover:border-[var(--coshift-cyan)] hover:text-[var(--coshift-cyan)]"
          >
            {s}
          </li>
        ))}
      </StaggerList>
    </section>
  );
}
