"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { caseStudies } from "@/content/work";
import { CaseCover } from "@/components/work/CaseCover";

export function SelectedWork() {
  const t = useTranslations("home.work");
  return (
    <section
      aria-label="Selected work"
      className="container-x mx-auto max-w-[1600px] section-y"
    >
      <header className="mb-12 flex items-end justify-between gap-6 md:mb-20">
        <div>
          <div className="text-mono mb-3 flex items-center gap-3 text-[var(--coshift-bone)]/60">
            <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
            {t("kicker")}
          </div>
          <h2 className="text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em]">
            {t("heading")}
          </h2>
        </div>
        <Link
          href="/work"
          className="text-mono hidden text-[var(--coshift-cyan)] underline-offset-4 hover:underline md:inline-flex"
        >
          {t("viewAll")} →
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {caseStudies.slice(0, 2).map((c, i) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 md:aspect-[5/4]">
              <CaseCover hue={c.cover.hue} tone={c.cover.tone} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,6,20,0.85)_100%)]" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-mono text-[var(--coshift-cyan)]">
                  0{i + 1} — {c.client}
                </div>
                <h3 className="mt-2 max-w-[24ch] text-[length:var(--fs-h3)] font-semibold leading-[1.15] tracking-[-0.01em] text-[var(--coshift-bone)]">
                  <ShiftIn>{c.title}</ShiftIn>
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ShiftIn({ children }: { children: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-baseline">
      <span className="inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full inline-block w-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}
