"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Magnetic } from "@/components/motion/Magnetic";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

export function CtaBlock() {
  const t = useTranslations("home.cta");
  return (
    <section aria-label="Plan your shift" className="container-x mx-auto max-w-[1600px] section-y">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--coshift-haze)] px-8 py-16 md:p-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 opacity-30"
        >
          <ShiftGlyph className="h-72 w-auto text-[var(--coshift-cyan)]" />
        </div>
        <h2 className="max-w-[18ch] text-[var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em]">
          {t("heading")}
        </h2>
        <p className="mt-6 max-w-[52ch] text-[var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {t("body")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Magnetic pull={8}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--coshift-cyan)] px-6 py-3 text-base font-semibold text-[var(--coshift-ink)] hover:bg-[var(--coshift-glow)]"
            >
              {t("primary")}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Magnetic>
          <Magnetic pull={6}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-base hover:border-[var(--coshift-cyan)] hover:text-[var(--coshift-cyan)]"
            >
              {t("secondary")}
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
