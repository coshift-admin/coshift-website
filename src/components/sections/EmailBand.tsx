"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Magnetic } from "@/components/motion/Magnetic";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { Reveal, RevealWords } from "@/components/motion/Reveal";

/**
 * Email lead-magnet band. The brand brief (§8 M6, §9 Pillar D) calls
 * professional email the strongest, cheapest entry point — a concrete offer
 * that's easy to say yes to. One clear CTA into contact.
 */
export function EmailBand() {
  const t = useTranslations("home.emailOffer");

  return (
    <section aria-label="Professional email offer" className="container-x mx-auto max-w-[1600px] section-y">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--coshift-cyan)]/25 bg-[var(--coshift-indigo)] p-8 md:p-16">
        <ShiftGlyph
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-10 h-52 w-auto text-[var(--coshift-cyan)]/10 md:h-72"
        />
        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="text-mono mb-4 flex items-center gap-3 text-[var(--coshift-bone)]/60">
              <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
              {t("kicker")}
            </div>
            <h2 className="max-w-[20ch] text-[length:var(--fs-h2)] font-bold leading-[1.02] tracking-[-0.02em] text-[var(--coshift-bone)]">
              <RevealWords text={t("heading")} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-[52ch] text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/75">
                {t("body")}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="lg:justify-self-end">
            <Magnetic pull={8}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--coshift-cyan)] px-7 py-4 text-base font-semibold text-[var(--coshift-ink)] transition-colors hover:bg-[var(--coshift-glow)]"
              >
                {t("cta")}
                <span aria-hidden className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
