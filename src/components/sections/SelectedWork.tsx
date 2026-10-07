"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { caseStudies, tr } from "@/content/work";
import { CaseVisual } from "@/components/work/CaseVisual";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerList } from "@/components/motion/StaggerList";
import { HandNote } from "@/components/ui/HandNote";

/** Home: three live websites as proof — real screenshots, link to each case. */
const FEATURED = caseStudies.filter((c) => c.kind === "site").slice(0, 3);

export function SelectedWork() {
  const t = useTranslations("home.work");
  const locale = useLocale();

  return (
    <section aria-labelledby="work-title" className="container-x mx-auto max-w-[1320px] py-[var(--section-y)]">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
        <SectionHeader id="work-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
          <HandNote arrow="down-start" delay={0.3} className="ms-[30%] mt-4">
            {t("hand")}
          </HandNote>
        </SectionHeader>
        <Link
          href="/work"
          className="group inline-flex items-center gap-1.5 font-semibold text-[var(--cyan-300)] transition-colors duration-[var(--dur-ds-fast)] hover:text-white"
        >
          {t("viewAll")} <span aria-hidden className="arrow-fwd">→</span>
        </Link>
      </div>

      <StaggerList as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-3" staggerChildren={0.12}>
        {FEATURED.map((c) => (
          <li key={c.slug}>
            <Link href={`/work/${c.slug}`} data-cursor-label={t("view")} className="group block">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                <CaseVisual c={c} alt={c.client} sizes="(min-width: 768px) 33vw, 92vw" />
              </div>
              <p className="text-mono mt-5 text-[var(--cyan-300)]">{c.client}</p>
              <h3 className="mt-2 text-pretty text-[1.2rem] font-bold leading-snug tracking-[-0.01em] text-white transition-colors duration-[var(--dur-ds-fast)] group-hover:text-[var(--cyan-300)]">
                {tr(c.title, locale)}
              </h3>
              <p className="mt-2 line-clamp-3 text-pretty text-[0.95rem] leading-[1.6] text-[var(--navy-100)]/75">
                {tr(c.summary, locale)}
              </p>
            </Link>
          </li>
        ))}
      </StaggerList>
    </section>
  );
}
